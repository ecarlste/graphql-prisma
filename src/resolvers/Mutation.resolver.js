import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const Mutation = {
  async createUser(_, { data }, { prisma }) {
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 charactes.');
    }

    const password = await bcrypt.hash(data.password, 10);

    const user = await prisma.mutation.createUser({ data: { ...data, password } });

    return { user, token: jwt.sign({ userId: user.id }, 'thisisasecret') };
  },
  updateUser(_, { id, data }, { prisma }, info) {
    return prisma.mutation.updateUser({ where: { id }, data }, info);
  },
  deleteUser(_, { id }, { prisma }, info) {
    return prisma.mutation.deleteUser({ where: { id } }, info);
  },
  createPost(_, args, { prisma }, info) {
    const { author: id, ...data } = args.data;
    return prisma.mutation.createPost(
      {
        data: {
          ...data,
          author: {
            connect: { id }
          }
        }
      },
      info
    );
  },
  updatePost(_, { id, data }, { prisma }, info) {
    return prisma.mutation.updatePost({ where: { id }, data }, info);
  },
  deletePost(_, { id }, { prisma }, info) {
    return prisma.mutation.deletePost({ where: { id } }, info);
  },
  createComment(_, args, { prisma }, info) {
    const { author, post, ...data } = args.data;
    return prisma.mutation.createComment(
      {
        data: {
          ...data,
          author: {
            connect: {
              id: author
            }
          },
          post: {
            connect: {
              id: post
            }
          }
        }
      },
      info
    );
  },
  updateComment(_, { id, data }, { prisma }, info) {
    return prisma.mutation.updateComment({ where: { id }, data }, info);
  },
  deleteComment(_, { id }, { prisma }, info) {
    return prisma.mutation.deleteComment({ where: { id } }, info);
  }
};
export default Mutation;
