import uuidv4 from 'uuid/v4';

export default {
  async createUser(_, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error('Email already in use.');
    }

    return prisma.mutation.createUser({ data: args.data }, info);
  },
  updateUser(_, { id, data }, { db }) {
    const userToUpdate = db.users.find(user => user.id === id);

    if (!userToUpdate) {
      throw new Error('User with specified ID does not exist.');
    }

    if (typeof data.email === 'string') {
      const isEmailInUse = db.users.find(user => user.email === data.email);

      if (isEmailInUse) {
        throw new Error('Email already in use.');
      }

      userToUpdate.email = data.email;
    }

    if (typeof data.name === 'string') {
      userToUpdate.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      userToUpdate.age = data.age;
    }

    return userToUpdate;
  },
  deleteUser(_, args, { db }) {
    const index = db.users.findIndex(user => user.id === args.id);

    if (index === -1) {
      throw new Error('User with specified ID does not exist.');
    }

    const user = db.users.splice(index, 1)[0];

    db.setPosts(
      db.posts.filter(post => {
        const isMatch = post.author === args.id;

        if (isMatch) {
          db.setComments(db.comments.filter(comment => comment.post !== post.id));
        }

        return !isMatch;
      })
    );

    db.setComments(db.comments.filter(comment => comment.author !== args.id));

    return user;
  },
  createPost(_, args, { db, pubsub }) {
    const userExists = db.users.some(user => user.id === args.data.author);

    if (!userExists) {
      throw new Error('Specified user ID not found.');
    }

    const post = {
      id: uuidv4(),
      ...args.data
    };

    db.posts.push(post);

    if (post.published) {
      pubsub.publish('post', { postEvent: { eventType: 'POST_CREATED', post } });
    }

    return post;
  },
  updatePost(_, { id, data }, { db, pubsub }) {
    const postToUpdate = db.posts.find(post => post.id === id);
    const wasPublished = postToUpdate.published;

    if (!postToUpdate) {
      throw new Error('Post with specified ID does not exist.');
    }

    if (typeof data.title === 'string') {
      postToUpdate.title = data.title;
    }

    if (typeof data.body === 'string') {
      postToUpdate.body = data.body;
    }

    if (typeof data.published === 'boolean') {
      postToUpdate.published = data.published;
    }

    if (wasPublished || postToUpdate.published) {
      pubsub.publish('post', { postEvent: { eventType: 'POST_UPDATE', post: postToUpdate } });
    }

    return postToUpdate;
  },
  deletePost(_, args, { db, pubsub }) {
    const index = db.posts.findIndex(post => post.id === args.id);

    if (index === -1) {
      throw new Error('Post with specified ID does not exist.');
    }

    const post = db.posts.splice(index, 1)[0];
    db.setComments(db.comments.filter(comment => comment.post !== args.id));

    if (post.published) {
      pubsub.publish('post', { postEvent: { eventType: 'POST_DELETED', post } });
    }

    return post;
  },
  createComment(_, args, { db, pubsub }) {
    const userExists = db.users.some(user => user.id === args.data.author);
    const publishedPostExists = db.posts.some(post => post.id === args.data.post && post.published);

    // this is a useless error, 3 things could be wrong and the client would have to perform 3 bad requests to find that out
    if (!userExists || !publishedPostExists) {
      throw new Error('Specified user ID or published post with specified ID not found.');
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    };

    db.comments.push(comment);
    pubsub.publish(`comment ${comment.post}`, {
      commentEvent: { eventType: 'COMMENT_CREATED', comment }
    });

    return comment;
  },
  updateComment(_, { id, data }, { db, pubsub }) {
    const commentToUpdate = db.comments.find(comment => comment.id === id);

    if (!commentToUpdate) {
      throw new Error('Comment with specified ID not found.');
    }

    if (typeof data.text === 'string') {
      commentToUpdate.text = data.text;
    }

    if (Object.keys(data).length > 0) {
      pubsub.publish(`comment ${commentToUpdate.post}`, {
        commentEvent: { eventType: 'COMMENT_UPDATED', comment: commentToUpdate }
      });
    }

    return commentToUpdate;
  },
  deleteComment(_, args, { db, pubsub }) {
    const index = db.comments.findIndex(comment => comment.id === args.id);

    if (index === -1) {
      throw new Error('Comment with specified ID does not exist.');
    }

    const deletedComment = db.comments.splice(index, 1)[0];
    pubsub.publish(`comment ${deletedComment.post}`, {
      commentEvent: { eventType: 'COMMENT_DELETED', deletedComment }
    });

    return deletedComment;
  }
};
