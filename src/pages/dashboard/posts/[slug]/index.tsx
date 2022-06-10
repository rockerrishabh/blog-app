import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { prisma } from '../../../../../lib/prisma'
import { useEffect } from 'react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { Post } from '../../../../../typings'
import Link from 'next/link'
import parse from 'html-react-parser'

function Post(post: Post) {
  const { data: session } = useSession()
  const router = useRouter()
  async function publishPost(id: string): Promise<void> {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/publish/${id}`, {
      method: 'PUT',
    })
    await router.push('/dashboard/posts')
  }

  async function deletePost(id: string): Promise<void> {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
      method: 'DELETE',
    })
    await router.push('/dashboard/posts')
  }

  return (
    <div className="col-span-7 p-5">
      <div className="flex flex-col">
        <div className="flex flex-col space-y-2">
          <h2>{post.title}</h2>
          <div>{parse(post.content)}</div>
        </div>
        <div className="text-white space-x-4 mt-2">
          <button
            onClick={() => {
              router.push(`/dashboard/posts/${post.slug}/edit`)
            }}
            className="py-2 px-6 bg-orange-400 hover:opacity-80 rounded-md"
          >
            <a>Edit</a>
          </button>
          <button
            onClick={() => {
              toast.promise(publishPost(post.id), {
                loading: 'Publishing...',
                success: <b>Published Successfully!</b>,
                error: <b>Error while Publishing</b>,
              })
            }}
            className="py-2 px-4 bg-green-500 hover:opacity-80 rounded-md"
          >
            Publish
          </button>
          <button
            onClick={() => {
              toast.promise(deletePost(post.id), {
                loading: 'Deleting...',
                success: <b>Deleted Successfully!</b>,
                error: <b>Error while Deleting</b>,
              })
            }}
            className="py-2 px-4 bg-blue-500 hover:opacity-80 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default Post

export const getServerSideProps: GetServerSideProps = async (context) => {
  const post = await prisma.posts.findUnique({
    where: {
      slug: String(context.params?.slug),
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
  } else
    return {
      props: JSON.parse(JSON.stringify(post)),
    }
}
