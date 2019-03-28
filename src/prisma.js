import { prisma } from '../prisma/prisma-client';

export const createPostForUser = async (authorId, data) => {
  const userExists = prisma.$exists.user({ id: authorId });

  if (!userExists) {
    throw new Error('User not found.');
  }

  const post = await prisma.createPost({
    ...data,
    author: {
      connect: {
        id: authorId
      }
    },
    comments: {}
  }).$fragment(`
  {
    author {
      id
      name
      email
      posts {
        id
        title
        published
      }
    }
  }`);

  return post.author;
};

export const updatePostForUser = async (postId, data) => {
  const postExists = await prisma.$exists.post({ id: postId });

  if (!postExists) {
    throw new Error('Post not found.');
  }

  const post = await prisma.updatePost({
    data,
    where: { id: postId }
  }).$fragment(`{
    author {
      id
      email
      name
      posts {
        id
        title
        published
      }
    }
  }`);

  return post.author;
};
