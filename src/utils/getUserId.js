import jwt from 'jsonwebtoken';

const getUserId = ({ request }) => {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new Error('Authentication required.');
  }

  const token = authorization.replace('Bearer ', '');
  const decodedToken = jwt.verify(token, 'thisisasecret');

  return decodedToken.userId;
};

export default getUserId;
