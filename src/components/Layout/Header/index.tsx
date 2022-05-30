import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SearchIcon } from '@heroicons/react/outline'
import { Fragment, useState } from 'react'
import Links from '../../Links'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, MenuIcon, XIcon } from '@heroicons/react/solid'
import Image from 'next/image'
import Sidebar from './Sidebar'

function Header() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <div className="top-0 sticky border-b">
      <div
        className={`max-w-6xl px-4 mx-auto justify-between flex items-center ${
          session ? 'py-2' : 'py-5'
        }`}
      >
        {session ? (
          <>
            <Link href="/dashboard">
              <a>Dashboard</a>
            </Link>
            <div>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="cursor-pointer flex items-center text-gray-700 hover:text-gray-500 ">
                    <Image
                      className="rounded-full"
                      height="40"
                      width="40"
                      alt=""
                      src={session?.user.image as string}
                    />
                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-36 md:w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                      <Menu.Item>
                        {({ active }: any) => (
                          <button
                            className={`${
                              active
                                ? 'bg-violet-500 text-white'
                                : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Profile
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }: any) => (
                          <button
                            className={`${
                              active
                                ? 'bg-violet-500 text-white'
                                : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Settings
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }: any) => (
                          <button
                            onClick={() => {
                              signOut({ callbackUrl: '/' })
                            }}
                            className={`${
                              active
                                ? 'bg-violet-500 text-white'
                                : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </>
        ) : (
          <>
            <Link href="/">
              <a>Blog App</a>
            </Link>
            <div className="space-x-10 hidden items-center md:inline-flex">
              <div className="space-x-6">
                <Links />
              </div>
              <div className="space-x-4 ">
                {!session && (
                  <button
                    className="py-2 bg-teal-600 rounded-md px-4 text-white hover:bg-teal-500"
                    onClick={() => {
                      signIn('google', { callbackUrl: '/dashboard' })
                    }}
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>

            <Sidebar />
          </>
        )}
      </div>
    </div>
  )
}

export default Header
