import { getSession, useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'

function Posts() {
  const { data: session } = useSession()

  if (session) {
    return <div>Posts</div>
  }
}

export default Posts

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
