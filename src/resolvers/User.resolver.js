import getUserId from '../utils/getUserId';

const User = {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { request }) {
      const userId = getUserId(request, false);

      if (userId && userId === parent.id) {
        return parent.email;
      }

      return null;
    }
  },
  posts: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { prisma }) {
      return prisma.query.posts({
        where: {
          AND: [
            {
              published: true
            },
            {
              author: {
                id: parent.id
              }
            }
          ]
        }
      });
    }
  }
};

export default User;
