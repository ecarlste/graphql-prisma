import jwt from 'jsonwebtoken';

const getUserId = (request, requireAuth = true) => {
  const authorization = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization;

  if (authorization) {
    const token = authorization.replace('Bearer ', '');
    const decodedToken = jwt.verify(token, 'thisisasecret');

    return decodedToken.userId;
  }

  if (requireAuth) {
    throw new Error('Authentication required.');
  }

  return null;
};

export default getUserId;
