import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId';

const authenticateFailedMessage = 'Unable to authenticate user.';
const Mutation = {
  async login(_, args, { prisma }) {
    const { email, password } = args.data;

    const user = await prisma.query.user({ where: { email } });
    if (!user) {
      throw new Error(authenticateFailedMessage);
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      throw new Error(authenticateFailedMessage);
    }

    return { user, token: jwt.sign({ userId: user.id }, 'thisisasecret') };
  },
  async createUser(_, { data }, { prisma }) {
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 charactes.');
    }

    const password = await bcrypt.hash(data.password, 10);

    const user = await prisma.mutation.createUser({ data: { ...data, password } });

    return { user, token: jwt.sign({ userId: user.id }, 'thisisasecret') };
  },
  updateUser(_, { data }, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.updateUser({ where: { id: userId }, data }, info);
  },
  deleteUser(_, _1, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser({ where: { id: userId } }, info);
  },
  createPost(_, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const { data } = args;

    return prisma.mutation.createPost(
      {
        data: {
          ...data,
          author: {
            connect: { id: userId }
          }
        }
      },
      info
    );
  },
  async updatePost(_, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const userOwnsPost = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    });

    if (!userOwnsPost) {
      throw new Error('Unable to update post: User does not own a post with the specified ID');
    }

    return prisma.mutation.updatePost({ where: { id }, data }, info);
  },
  async deletePost(_, { id }, { prisma, request }, info) {
    const userId = getUserId(request);

    const userOwnsPost = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    });

    if (!userOwnsPost) {
      throw new Error('Unable to delete post: User does not own a post with the specified ID');
    }

    return prisma.mutation.deletePost({ where: { id } }, info);
  },
  async createComment(_, args, { prisma, request }, info) {
    const { text, post } = args.data;
    const userId = getUserId(request);

    return prisma.mutation.createComment(
      {
        data: {
          text,
          author: {
            connect: {
              id: userId
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
  async updateComment(_, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const userOwnsComment = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    });

    if (!userOwnsComment) {
      throw new Error(
        'Unable to update comment: User does not own a comment with the specified ID'
      );
    }

    return prisma.mutation.updateComment({ where: { id }, data }, info);
  },
  async deleteComment(_, { id }, { prisma, request }, info) {
    const userId = getUserId(request);

    const userOwnsComment = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    });

    if (!userOwnsComment) {
      throw new Error(
        'Unable to delete comment: User does not own a comment with the specified ID'
      );
    }

    return prisma.mutation.deleteComment({ where: { id } }, info);
  }
};
export default Mutation;
