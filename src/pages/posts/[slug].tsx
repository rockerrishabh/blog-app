import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { prisma } from '../../../lib/prisma'
import { useEffect } from 'react'
import Image from 'next/image'

type Props = {
  title: string
  content: string
  slug: string
  featuredImage: string
}

function Post(post: Props) {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <div className="col-span-7 p-5">
      <div className="flex flex-col space-y-3">
        <h2>{post.title}</h2>
        <p className="excerpt">{post.content}</p>
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
