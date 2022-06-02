import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { prisma } from '../../../../lib/prisma'
import { useEffect } from 'react'
import Image from 'next/image'
import { toast } from 'react-toastify'

type Props = {
  id: string
  title: string
  content: string
  slug: string
  featuredImage: string
}

function Post(post: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  async function publishPost(id: string): Promise<void> {
    await fetch(`http://localhost:3000/api/posts/publish/${id}`, {
      method: 'PUT',
    })
    toast('Published Successfully')
    await router.push('/dashboard/posts')
  }

  async function deletePost(id: string): Promise<void> {
    try {
      await fetch(`http://localhost:3000/api/posts/${id}`, {
      method: 'DELETE',
    })
    toast('Deleted Successfully')
    await router.push('/dashboard/posts')
    } catch (error) {
      toast('error happened')
    }
  }

  return (
    <div className="col-span-7 p-5">
      <div className="flex flex-col">
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        <div className="text-white space-x-4 mt-2">
          <button onClick={() => {
                   publishPost(post.id)
              }} 
            className="py-2 px-4 bg-green-500 hover:opacity-80 rounded-md">Publish</button>
          <button onClick={() => {
                    deletePost(post.id)
              }} 
            className="py-2 px-4 bg-blue-500 hover:opacity-80 rounded-md">Delete</button>
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
