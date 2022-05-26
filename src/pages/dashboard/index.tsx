import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  if (!session) {
    return router.push('/')
  }
  if (session) {
    return <div>Welcome {session?.user.name}</div>
  }
}

export default Dashboard
