import { useSession } from 'next-auth/react'

function Dashboard() {
  const { data: session } = useSession()
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  if (session) {
    return <div>Welcome {session?.user.name}</div>
  }
}

export default Dashboard
