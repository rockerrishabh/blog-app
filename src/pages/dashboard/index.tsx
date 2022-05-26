import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

function Dashboard() {
  const { data: session } = useSession()

  if (session) {
    return <div>Welcome {session?.user.name}</div>
  }
}

export default Dashboard

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
