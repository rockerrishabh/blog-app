import type { GetServerSideProps, NextPage } from 'next'
import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { prisma } from '../../lib/prisma'

interface Props {
  posts: {
    id: string
    title: string
    content: string
    slug: string
    featuredImage: string
    author: {
      name: string
    }
  }[]
}

const Home: NextPage<Props> = ({ posts }) => {
  const { data: session } = useSession()
  const router = useRouter()
  return (
    <div>
      <div className="p-5 flex flex-col space-y-4">
        <div>Posts</div>
        {posts.map((post) => (
          <div
            onClick={() => router.push('/posts/[slug]', `/posts/${post.slug}`)}
            key={post.slug}
          >
            <div className="cursor-pointer hover:underline">{post.title}</div>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession({ ctx })
  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: '/dashboard',
      },
    }
  }

  const posts = await prisma.posts.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
  return JSON.parse(
    JSON.stringify({
      props: { session, posts },
    })
  )
}
