import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
if (!JWT_SECRET || JWT_SECRET === 'your_super_secret_jwt_key_change_this_in_production') {
  throw new Error(
    '❌ SECURITY ERROR: JWT_SECRET must be set in environment variables!\n' +
    '   Set a strong secret in .env file: JWT_SECRET=your_random_secret_here\n' +
    '   Generate random secret: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"\n'
  );
}
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
}
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
export function decodeToken(token) {
  return jwt.decode(token);
}

export default {
  generateToken,
  verifyToken,
  decodeToken,
};
