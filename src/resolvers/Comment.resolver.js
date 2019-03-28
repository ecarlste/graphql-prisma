const Comment = {
  author(parent, _, { prisma }) {
    return prisma.comment({ id: parent.id }).author();
  },
  post(parent, _, { prisma }) {
    return prisma.comment({ id: parent.id }).post();
  }
};

export default Comment;
