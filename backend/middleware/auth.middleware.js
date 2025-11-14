import { verifyToken } from '../utils/jwt.js';
import { getUserById } from '../utils/db.js';
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login.',
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.',
      });
    }
    const user = await getUserById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    req.userId = user.id;
    req.userRole = user.role;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
}
export function requireCandidate(req, res, next) {
  if (req.userRole !== 'candidate') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Candidate role required.',
    });
  }
  next();
}
export function requireCompany(req, res, next) {
  if (req.userRole !== 'company') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Company role required.',
    });
  }
  next();
}
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      if (decoded) {
        const user = await getUserById(decoded.userId);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          req.user = userWithoutPassword;
          req.userId = user.id;
          req.userRole = user.role;
        }
      }
    }

    next();
  } catch (error) {
    next();
  }
}

export default {
  authenticate,
  requireCandidate,
  requireCompany,
  optionalAuth,
};
