import { signIn, signOut, useSession } from 'next-auth/react'
import { MenuIcon, XIcon } from '@heroicons/react/solid'
import { useRef, useState } from 'react'
import Links from '../../Links'
import useClickOutside from '../../Modules/useClickOutside'

function Sidebar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setIsOpen(false))
  return (
    <>
      {session ? (
        <>
          {isOpen ? (
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer block md:hidden"
            >
              <XIcon className="mt-[0.14rem] h-5 w-5 active:rotate-12" />
            </div>
          ) : (
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer block md:hidden"
            >
              <MenuIcon className="mt-[0.14rem] h-5 w-5 active:rotate-12" />
            </div>
          )}
          <div
            ref={ref}
            className={`fixed z-50 top-[4.07rem] transition duration-300 ease-in-out border-r p-4 left-0 h-screen md:w-44 w-40 bg-white  ${
              isOpen
                ? '-translate-x-3 md:-translate-x-3'
                : '-translate-x-48 md:-translate-x-3'
            }`}
          >
            <div className="flex flex-col pl-5 space-y-3 text-lg">
              <Links />
            </div>
          </div>
        </>
      ) : (
        <>
          {isOpen ? (
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer block md:hidden"
            >
              <XIcon className=" h-5 w-5 active:rotate-12" />
            </div>
          ) : (
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer block md:hidden"
            >
              <MenuIcon className=" h-5 w-5 active:rotate-12" />
            </div>
          )}
          <div
            ref={ref}
            className={`fixed top-[4.07rem] md:hidden border-l p-4 right-0 h-screen w-44 bg-white duration-500  ${
              isOpen ? 'translate-x-0 ' : 'translate-x-full'
            }`}
          >
            <div className="flex flex-col pl-5 space-y-3 text-lg">
              <Links />
            </div>
            <div className="flex flex-col space-y-3 p-2 text-lg items-center">
              <button
                className="py-2 bg-teal-600 rounded-md w-full text-white hover:bg-teal-500"
                onClick={() => {
                  signIn('google', { callbackUrl: '/dashboard' })
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Sidebar
