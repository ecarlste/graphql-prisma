const Mutation = {
  createUser(_, { data }, { prisma }, info) {
    return prisma.mutation.createUser({ data }, info);
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
