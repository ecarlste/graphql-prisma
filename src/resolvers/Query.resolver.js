export default {
  users(_, args, { prisma }) {
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

    return prisma.users(opArgs);
  },
  me() {
    return {
      id: '123',
      name: 'Erik',
      email: 'ecarlste@gmail.com',
      age: null
    };
  },
  posts(_, args, { prisma }) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            title_contains: args.query
          },
          {
            body_contains: args.query
          }
        ]
      };
    }

    return prisma.posts(opArgs);
  },
  post() {
    return {
      id: 'xyz',
      title: 'first post',
      body: 'best post NA... duh...',
      published: false
    };
  },
  comments(_, args, { prisma }) {
    return prisma.comments();
  }
};
