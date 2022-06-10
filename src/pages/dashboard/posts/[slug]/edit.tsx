import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Post } from '../../../../../typings'
import { prisma } from '../../../../../lib/prisma'
import { useRouter } from 'next/router'
import { Editor } from '@tinymce/tinymce-react'

type FormData = {
  title: string
  slug: string
  content: string
}

function EditPost(post: Post) {
  const { data: session } = useSession()
  const router = useRouter()
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const onSubmit = handleSubmit(({ title, slug, content }) =>
    toast.promise(Update({ title, slug, content }), {
      loading: 'Updating...',
      success: <b>Updated Successfully!</b>,
      error: <b>Error while Updating</b>,
    })
  )

  const Update = async ({ title, slug, content }: FormData): Promise<void> => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/update/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, content }),
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
                    defaultValue={post.title}
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
                    defaultValue={post.slug}
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
                      initialValue={post.content}
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
              Update
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default EditPost

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const post = await prisma.posts.findUnique({
    where: {
      slug: String(ctx.params?.slug),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  })
  if (!post?.slug) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }
  return {
    props: JSON.parse(JSON.stringify(post)),
  }
}
