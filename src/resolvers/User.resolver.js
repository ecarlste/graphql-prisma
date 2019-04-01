import getUserId from '../utils/getUserId';

const User = {
  email(parent, args, { request }) {
    const userId = getUserId(request, false);

    if (userId && userId === parent.id) {
      return parent.email;
    }

    return null;
  }
};

export default User;
