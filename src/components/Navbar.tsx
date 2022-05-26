import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  return (
    <>
      <div>Navbar</div>
      {session && (
        <>
          {router.pathname === '/' && (
            <Link href="/dashboard">
              <a>Enter Dashboard</a>
            </Link>
          )}
        </>
      )}
    </>
  )
}

export default Navbar
