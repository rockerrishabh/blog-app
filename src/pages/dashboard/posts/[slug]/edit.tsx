import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Post } from '../../../../../typings'
import { prisma } from '../../../../../lib/prisma'
import { useRouter } from 'next/router'

type FormData = {
  id: string
  title: string
  slug: string
  content: string
}

function CreatePost(post: Post) {
  const { data: session } = useSession()
  const router = useRouter()
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const onSubmit = handleSubmit(({ id, title, slug, content }) =>
    Update({ id, title, slug, content })
  )

  const Update = async ({
    id,
    title,
    slug,
    content,
  }: FormData): Promise<void> => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, content }),
      })
      reset()
      toast('Successfully Updated')
      router.push(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/posts`)
    } catch (error) {
      console.error(error)
      toast('error')
    }
  }
  return (
    <>
      {session && (
        <div className="p-10">
          <form onSubmit={onSubmit} className="flex space-y-4 flex-col">
            <div className="space-x-10 items-center flex">
              <label htmlFor="title">Title:</label>
              <input
                {...register('title', { required: true })}
                id="title"
                type="text"
                defaultValue={post.title}
                className="flex-1 px-1 py-1 outline-none border border-gray-600 rounded focus:ring-2 focus:border-0 focus:ring-blue-500"
              />
            </div>
            <div className="space-x-10 items-center flex">
              <label htmlFor="slug">Slug:</label>
              <input
                className="hidden"
                defaultValue={post.id}
                {...register('id', { required: true })}
              />
              <input
                {...register('slug', { required: true })}
                id="slug"
                type="text"
                defaultValue={post.slug}
                className="flex-1 px-1 py-1 outline-none border border-gray-600 rounded focus:ring-2 focus:border-0 focus:ring-blue-500"
              />
            </div>
            <div className="space-x-4 items-center flex">
              <label htmlFor="content">Content:</label>
              <textarea
                {...register('content', { required: true })}
                id="content"
                defaultValue={post.content}
                className="flex-1 px-1 py-1 outline-none border border-gray-600 rounded focus:ring-2 focus:border-0 focus:ring-blue-500"
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

export default CreatePost

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
