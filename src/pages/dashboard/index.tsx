import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, GetSessionParams, useSession } from 'next-auth/react'
import Layout from '../../components/Layout'

function Dashboard() {
  const { data: session } = useSession()
  if (session) {
    return <div>Welcome {session?.user.name}</div>
  }
}

export default Dashboard

export async function getServerSideProps(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
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
