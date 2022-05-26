import { getSession, GetSessionParams, useSession } from 'next-auth/react'
import Layout from '../../components/Layout'

function Dashboard() {
  const { data: session } = useSession()
  if (session) {
    return <div>Welcome {session?.user.name}</div>
  }
}

export default Dashboard

export async function getServerSideProps(ctx: GetSessionParams | undefined) {
  const session = await getSession(ctx)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {
      session: { session },
    },
  }
}
