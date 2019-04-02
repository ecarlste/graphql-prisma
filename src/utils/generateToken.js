import jwt from 'jsonwebtoken';

const generateToken = userId => {
  return jwt.sign({ userId }, process.env.JWT_SIGNING_KEY, { expiresIn: '7 days' });
};

export default generateToken;
