import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'

function AboutUs() {
  return <div>About Us</div>
}

export default AboutUs
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession({ ctx })
  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: '/dashboard',
      },
    }
  }

  return {
    props: { session },
  }
}
