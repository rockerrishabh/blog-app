import { Editor } from '@tinymce/tinymce-react'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

type FormData = {
  title: string
  slug: string
  content: string
}

function CreatePost() {
  const { data: session } = useSession()
  const router = useRouter()
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const onSubmit = handleSubmit((data) =>
    toast.promise(Create(data), {
      loading: 'Creating Post...',
      success: <b>Post Created Successfully!</b>,
      error: <b>Error while Post Creating</b>,
    })
  )

  const Create = async (data: FormData) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    reset()
    router.push(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/posts`)
  }
  return (
    <>
      {session && (
        <div className="p-10">
          <form onSubmit={onSubmit} className="flex space-y-4 flex-col">
            <div className="space-x-10 items-center flex">
              <label htmlFor="title">Title:</label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur } }) => (
                  <input
                    id="title"
                    type="text"
                    onBlur={onBlur}
                    onChange={onChange}
                    className="flex-1 px-1 py-1 bg-transparent outline-none border border-gray-600 rounded focus:ring-2 focus:border-0 focus:ring-blue-500"
                  />
                )}
                name="title"
              />
            </div>
            <div className="space-x-10 items-center flex">
              <label htmlFor="slug">Slug:</label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur } }) => (
                  <input
                    id="slug"
                    type="text"
                    onBlur={onBlur}
                    onChange={onChange}
                    className="flex-1 px-1 py-1 bg-transparent outline-none border border-gray-600 rounded focus:ring-2 focus:border-0 focus:ring-blue-500"
                  />
                )}
                name="slug"
              />
            </div>
            <div className="space-x-4 items-center flex">
              <label htmlFor="content">Content:</label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur } }) => (
                  <div className="border p-2 border-gray-600 rounded">
                    <Editor
                      onBlur={onBlur}
                      id="content"
                      init={{
                        branding: false,
                        a11y_advanced_options: true,
                        plugins: [
                          'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                        ],
                        menubar: true,
                        toolbar_sticky: true,
                        image_advtab: true,
                        skin: 'snow',
                        content_css: 'default',
                        toolbar_mode: 'sliding',
                        contextmenu: 'link image imagetools table',
                        quickbars_selection_toolbar:
                          'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                        height: 400,
                        width: 979,
                        icons: 'thin',
                        image_caption: true,
                        mobile: {
                          plugins:
                            'print preview powerpaste code casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker textpattern noneditable help formatpainter pageembed charmap mentions quickbars linkchecker emoticons advtable',
                        },
                        menu: {
                          tc: {
                            title: 'Comments',
                            items:
                              'addcomment showcomments deleteallconversations',
                          },
                        },
                        toolbar:
                          'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
                      }}
                      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                      onEditorChange={onChange}
                    />
                  </div>
                )}
                name="content"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 py-2 rounded text-white hover:opacity-95"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default CreatePost

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession({ ctx })
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }
  return {
    props: { session },
  }
}
