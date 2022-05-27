import { useSession } from 'next-auth/react'
import { MenuIcon, XIcon } from '@heroicons/react/solid'

function Sidebar() {
  const { data: session } = useSession()
  return <div>Sidebar</div>
}

export default Sidebar
