import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type FormData = {
  title: string
  slug: string
  content: string
}

function CreatePost() {
  const { data: session } = useSession()
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const onSubmit = handleSubmit((data) => Create(data))

  const Create = async (data: FormData) => {
    try {
      await fetch(`http://localhost:3000/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      reset()
      toast('Successfully Created')
    } catch (error) {
      console.error(error)
      toast('error')
    }
  }
  return (
    <>
      {session && (
        <div className="p-10">
          <form onSubmit={onSubmit} className="flex space-y-4 flex-col">
            <div className="space-x-10 items-center flex">
              <label htmlFor="title">Title:</label>
              <input
                {...register('title', { required: true })}
                id="title"
                type="text"
                className="flex-1 px-1 py-1 outline-none border border-gray-600 rounded focus:ring-2 focus:border-0 focus:ring-blue-500"
              />
            </div>
            <div className="space-x-10 items-center flex">
              <label htmlFor="slug">Slug:</label>
              <input
                {...register('slug', { required: true })}
                id="slug"
                type="text"
                className="flex-1 px-1 py-1 outline-none border border-gray-600 rounded focus:ring-2 focus:border-0 focus:ring-blue-500"
              />
            </div>
            <div className="space-x-4 items-center flex">
              <label htmlFor="content">Content:</label>
              {/* <textarea {...register("content", { required: true })} id='content' className="flex-1 px-1 py-1 outline-none border border-gray-600 rounded focus:ring-2 focus:border-0 focus:ring-blue-500" /> */}
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
