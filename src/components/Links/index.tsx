import { useSession } from 'next-auth/react'
import Link from 'next/link'

function Links() {
  const { data: session } = useSession()
  return (
    <>
      {session ? (
        <>
          <Link href="/dashboard/posts">
            <a className="hover:opacity-100 opacity-80 px-2">Posts</a>
          </Link>
          {session.user.role === 'Editor' ||
            (session.user.role === 'Admin' && (
              <Link href="/dashboard/pages">
                <a className="hover:opacity-100 opacity-80 px-2">Pages</a>
              </Link>
            ))}
          {session.user.role === 'Admin' && (
            <Link href="/dashboard/users">
              <a className="hover:opacity-100 opacity-80 px-2">Users</a>
            </Link>
          )}
        </>
      ) : (
        <>
          <Link href="/">
            <a className="hover:opacity-100 opacity-80 px-2">Categories</a>
          </Link>

          <Link href="/about-us">
            <a className="hover:opacity-100 opacity-80 px-2">About Us</a>
          </Link>

          <Link href="/">
            <a className="hover:opacity-100 opacity-80 px-2">Contact Us</a>
          </Link>
        </>
      )}
    </>
  )
}

export default Links
