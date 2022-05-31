import { getSession, useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'

function Users() {
  const { data: session } = useSession()

  if (session) {
    return <div>Pages</div>
  }
}

export default Users

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession({ ctx })
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }

  return {
    props: { session },
  }
}
