import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import { getSession, useSession } from 'next-auth/react'

function Pages() {
  const { data: session } = useSession()

  if (session) {
    return <div>Pages</div>
  }
}

export default Pages
export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx)
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
