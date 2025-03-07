import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function createPostService(
  postData: { title: string; content?: string },
  authorId: string
) {
  return await prisma.post.create({
    data: {
      title: postData.title,
      content: postData.content || null,
      authorId,
    },
  });
}

export async function publishPostService(postId: string, authorId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) throw new Error('Post not found');
  if (post.authorId !== authorId) throw new Error('Unauthorized');

  return await prisma.post.update({
    where: { id: postId },
    data: { published: true },
  });
}


export async function getPostsService() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });
  return posts;
}

export async function getUserPostsService(authorId: string) {
  return await prisma.post.findMany({
    where: { authorId },
    orderBy: { createdAt: 'desc' },
  });
}
