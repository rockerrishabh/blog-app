import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const postId = req.query.id
  const posts = await prisma.posts.update({
    where: { id: String(postId) },
    data: { published: true },
  })
  res.json(posts)
}
