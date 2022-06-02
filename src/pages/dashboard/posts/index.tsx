import { getSession, useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { prisma } from '../../../../lib/prisma'
import { useRouter } from 'next/router'
import { PlusIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { Posts } from '../../../../typings'



function Posts({ posts }: Posts) {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <>
      {session && (
        <div className="flex flex-col relative space-y-4 mt-2 p-10">
          <Link href="/dashboard/posts/create">
            <div className="absolute text-white flex space-x-3 top-1 right-10 hover:opacity-80 cursor-pointer items-center rounded-full py-2 px-8 bg-green-500">
              <PlusIcon className="h-3 w-3" />
              <p>Create</p>
            </div>
          </Link>
          {posts.map((post) => (
            <div
              onClick={() =>
                router.push(
                  '/dashboard/posts/[slug]',
                  `/dashboard/posts/${post.slug}`
                )
              }
              className="overflow-hidden p-5 border cursor-pointer border-slate-300 hover:border-slate-400 rounded-md"
              key={post.id}
            >
              <h1 className="hover:underline">{post.title}</h1>
              <p className="excerpt">{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default Posts

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession({ ctx })

  const posts = await prisma.posts.findMany({
    where: {
      author: {
        email: session?.user.email,
      },
    },
    include: {
      author: {
        select: { name: true, email: true },
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
