const User = {
  posts(parent, _, { prisma }) {
    return prisma.user({ id: parent.id }).posts();
  },
  comments(parent, _, { prisma }) {
    return prisma.user({ id: parent.id }).comments();
  }
};

export default User;
