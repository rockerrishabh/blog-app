import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import 'suneditor/dist/css/suneditor.min.css'

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
})

type FormData = {
  title: string
  slug: string
  content: string
}

function CreatePost() {
  const { data: session } = useSession()
  const router = useRouter()
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const onSubmit = handleSubmit((data) =>
    toast.promise(Create(data), {
      loading: 'Creating Post...',
      success: <b>Post Created Successfully!</b>,
      error: <b>Error while Post Creating</b>,
    })
  )

  const Create = async (data: FormData) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    reset()
    router.push(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/posts`)
  }
  return (
    <>
      {session && (
        <div className="p-10">
          <form onSubmit={onSubmit} className="flex space-y-4 flex-col">
            <div className="space-x-10 items-center flex">
              <label htmlFor="title">Title:</label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur } }) => (
                  <input
                    id="title"
                    type="text"
                    onBlur={onBlur}
                    onChange={onChange}
                    className="flex-1 px-1 py-1 bg-transparent outline-none border border-gray-600 rounded focus:ring-2 focus:border-0 focus:ring-blue-500"
                  />
                )}
                name="title"
              />
            </div>
            <div className="space-x-10 items-center flex">
              <label htmlFor="slug">Slug:</label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur } }) => (
                  <input
                    id="slug"
                    type="text"
                    onBlur={onBlur}
                    onChange={onChange}
                    className="flex-1 px-1 py-1 bg-transparent outline-none border border-gray-600 rounded focus:ring-2 focus:border-0 focus:ring-blue-500"
                  />
                )}
                name="slug"
              />
            </div>
            <div className="space-x-4 items-center flex">
              <label htmlFor="content">Content:</label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur } }) => (
                  <SunEditor onBlur={onBlur} onChange={onChange} />
                )}
                name="content"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 py-2 rounded text-white hover:opacity-95"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default CreatePost

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
