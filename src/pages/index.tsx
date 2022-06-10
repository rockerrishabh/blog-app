import type { GetServerSideProps, NextPage } from 'next'
import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { prisma } from '../../lib/prisma'
import { Posts } from '../../typings'
import parse from 'html-react-parser'

const Home: NextPage<Posts> = ({ posts }) => {
  const { data: session } = useSession()
  const router = useRouter()
  return (
    <div>
      <div className="p-5 flex flex-col space-y-4">
        <div>Posts</div>
        {posts.map((post) => (
          <div
            className="overflow-hidden flex flex-col space-y-2 border rounded-md p-5"
            onClick={() => router.push('/posts/[slug]', `/posts/${post.slug}`)}
            key={post.slug}
          >
            <h2 className="cursor-pointer hover:underline">{post.title}</h2>
            <p className="post--content">{parse(post.content)}</p>
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
