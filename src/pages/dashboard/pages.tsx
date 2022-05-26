import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, useSession } from 'next-auth/react'

function Pages() {
  const { data: session } = useSession()

  if (session) {
    return <div>Pages</div>
  }
}

export default Pages
export async function getServerSideProps(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {
      session: { session },
    },
  }
}
