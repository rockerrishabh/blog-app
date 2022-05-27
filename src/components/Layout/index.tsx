import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Header from './Header'

type Props = { children: ReactNode }

export default function Layout({ children }: Props) {
  const { data: session } = useSession()
  return (
    <div className="">
      <Header />
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  )
}
