import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import { getSession, useSession } from 'next-auth/react'

function Pages() {
  const { data: session } = useSession()
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  if (session) {
    return <div>Pages</div>
  }
}

export default Pages
