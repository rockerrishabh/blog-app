import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

function Pages() {
  const { data: session } = useSession()
  const router = useRouter()
  if (!session) {
    return router.push('/')
  }

  if (session) {
    return <div>Pages</div>
  }
}

export default Pages
