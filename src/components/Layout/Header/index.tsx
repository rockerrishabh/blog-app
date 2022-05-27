import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SearchIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import Links from '../../Links'

function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  function handleSearchIconClick() {
    setIsSearchOpen(!isSearchOpen)
  }
  return (
    <div className="top-0 sticky border-b">
      <div className="max-w-7xl px-4 mx-auto font-medium items-center  text-slate-900 flex py-4 justify-between">
        <div className="space-x-2 flex items-center">
          <Link href="/">
            <a className=" mb-1 font-bold text-2xl hover:text-blue-500 hover:scale-105">
              Blog App
            </a>
          </Link>
          {session && (
            <div className="flex space-x-2 items-center">
              {router.pathname === '/' && (
                <>
                  <p className=" font-bold">:</p>
                  <Link href="/dashboard">
                    <a className="hover:opacity-100 opacity-60">
                      Enter Dashboard
                    </a>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-x-2 md:space-x-10 flex items-center">
          <div className="space-x-2 flex items-center">
            <div
              className={`rounded-full  items-center mt-1 flex py-1 px-2 ${
                isSearchOpen &&
                'bg-slate-100 focus:ring-blue-500 focus:border-none focus:ring-1 border'
              } `}
            >
              <SearchIcon
                onClick={handleSearchIconClick}
                className="cursor-pointer h-5 w-5 hover:text-blue-500 text-slate-600"
              />
              <input
                id="search"
                type="text"
                placeholder="Search..."
                className={`outline-none pl-2 text-slate-700  caret-slate-700 bg-transparent ${
                  isSearchOpen
                    ? 'flex-1 transition duration-300 ease-in-out'
                    : 'hidden'
                }`}
              />
            </div>
            <div className="space-x-4 md:flex items-center hidden">
              {router.pathname === '/' && <Links />}
              {router.pathname === '/categories' && <Links />}
              {router.pathname === '/about-us' && <Links />}
              {router.pathname === '/contact-us' && <Links />}
            </div>
          </div>
          {session ? (
            <div
              onClick={() => {
                signOut({ callbackUrl: '/dashboard' })
              }}
              className="px-5 py-1 items-center hover:opacity-100 opacity-60 rounded-full border cursor-pointer border-slate-500 hover:border-slate-900"
            >
              <p className=" font-medium">Sign Out</p>
            </div>
          ) : (
            <div
              onClick={() => {
                signIn('google', { callbackUrl: '/dashboard' })
              }}
              className="px-5 py-1 items-center hover:opacity-100 opacity-60 rounded-full border cursor-pointer border-slate-500 hover:border-slate-900"
            >
              <p className=" font-medium">Sign In</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
