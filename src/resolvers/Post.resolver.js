const Post = {
  author(parent, _, { prisma }) {
    return prisma.post({ id: parent.id }).author();
  },
  comments(parent, _, { prisma }) {
    return prisma.post({ id: parent.id }).comments();
  }
};

export default Post;
