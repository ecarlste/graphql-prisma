import getUserId from '../utils/getUserId';

export default {
  users(_, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          },
          {
            email_contains: args.query
          }
        ]
      };
    }

    return prisma.query.users(opArgs, info);
  },
  async posts(_, args, { prisma }, info) {
    const opArgs = {
      where: {
        published: true
      }
    };

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ];
    }

    return prisma.query.posts(opArgs, info);
  },
  async myPosts(_, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const opArgs = {
      where: {
        author: {
          id: userId
        }
      }
    };

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ];
    }

    return prisma.query.posts(opArgs, info);
  },
  comments(_, _1, { prisma }, info) {
    return prisma.query.comments(null, info);
  },
  me(_, _1, { prisma, request }, info) {
    const userId = getUserId(request);

    const user = prisma.query.user({ where: { id: userId } }, info);

    return user;
  },
  post(_, { id }, { prisma, request }, info) {
    const userId = getUserId(request, false);

    const posts = prisma.query.posts(
      {
        where: {
          id,
          OR: [
            {
              published: true
            },
            {
              author: {
                id: userId
              }
            }
          ]
        }
      },
      info
    );

    if (posts.length === 0) {
      throw new Error('Post not found.');
    }

    return posts[0];
  }
};
