import getUserId from '../utils/getUserId';

export default {
  post: {
    subscribe(_, _1, { prisma }, info) {
      return prisma.subscription.post(null, info);
    }
  },
  comment: {
    subscribe(_, { postId }, { prisma }, info) {
      return prisma.subscription.comment({ where: { node: { post: { id: postId } } }, info });
    }
  },
  myPost: {
    subscribe(_, _1, { prisma, request }, info) {
      const userId = getUserId(request);

      return prisma.subscription.post(
        {
          where: {
            node: {
              author: {
                id: userId
              }
            }
          }
        },
        info
      );
    }
  }
};
