import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Post } from '../../../../../typings'
import { prisma } from '../../../../../lib/prisma'
import { useRouter } from 'next/router'
import 'suneditor/dist/css/suneditor.min.css'
import dynamic from 'next/dynamic'

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
})

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
                  <SunEditor
                    height="100%"
                    width="100%"
                    setContents={post.content}
                    onBlur={onBlur}
                    onChange={onChange}
                    setOptions={{
                      imageFileInput: false,
                      buttonList: [
                        ['undo', 'redo'],
                        ['font', 'fontSize'],
                        // ['paragraphStyle', 'blockquote'],
                        [
                          'bold',
                          'underline',
                          'italic',
                          'strike',
                          'subscript',
                          'superscript',
                        ],
                        ['fontColor', 'hiliteColor'],
                        ['align', 'list', 'lineHeight'],
                        ['outdent', 'indent'],

                        ['table', 'horizontalRule', 'link', 'image', 'video'],
                        // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                        // ['imageGallery'], // You must add the "imageGalleryUrl".
                        // ["fullScreen", "showBlocks", "codeView"],
                        ['preview', 'print'],
                        ['removeFormat'],

                        // ['save', 'template'],
                        // '/', Line break
                      ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                      defaultTag: 'div',
                      minHeight: '300px',
                    }}
                  />
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
