import { signIn, signOut, useSession } from 'next-auth/react'
import { MenuIcon, XIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import Links from '../../Links'

function Sidebar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      {isOpen ? (
        <div className="cursor-pointer block md:hidden">
          <XIcon
            onClick={() => setIsOpen(!isOpen)}
            className=" h-5 w-5 active:rotate-12"
          />
        </div>
      ) : (
        <div className="cursor-pointer block md:hidden">
          <MenuIcon
            onClick={() => setIsOpen(!isOpen)}
            className=" h-5 w-5 active:rotate-12"
          />
        </div>
      )}
      <div
        className={`fixed top-[4.07rem] p-4 right-0 h-screen w-screen bg-white duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 ' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col space-y-3 p-2 text-lg items-center">
          <Links />
        </div>
        <div className="flex flex-col space-y-3 p-2 text-lg items-center">
          <button
            className="py-3 bg-teal-600 rounded-md w-full text-white hover:bg-teal-500"
            onClick={() => {
              signIn('google', { callbackUrl: '/dashboard' })
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
