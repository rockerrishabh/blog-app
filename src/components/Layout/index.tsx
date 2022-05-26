import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Navbar from '../Navbar'

type Props = { children: ReactNode }

export default function Layout({ children }: Props) {
  const { data: session } = useSession()
  return (
    <>
      <Navbar />

      {children}
    </>
  )
}
