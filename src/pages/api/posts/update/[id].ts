import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, content, slug, featuredImage } = req.body
  const postId = req.query.id
  if (req.method === 'UPDATE') {
    const posts = await prisma.posts.update({
      where: { id: String(postId) },
      data: {
        title: title,
        content: content,
        slug: slug,
        featuredImage: featuredImage,
      },
    })
    res.json(posts)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route`
    )
  }
}
