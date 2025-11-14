import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { createUser, getUserByEmail, getUserById, updateUser } from '../utils/db.js';
import { generateToken } from '../utils/jwt.js';
import { 
  ErrorTypes, 
  validateRequiredFields, 
  validateEmail, 
  validatePassword 
} from '../utils/errors.js';
export async function register(req, res, next) {
  try {
    const { email, password, name, phone, role, companyName, nik, npwp, nib } = req.body;
    validateRequiredFields(req.body, ['email', 'password', 'name', 'role']);
    validateEmail(email);
    validatePassword(password);
    if (!['candidate', 'company'].includes(role)) {
      throw ErrorTypes.INVALID_INPUT('role');
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw ErrorTypes.ALREADY_EXISTS('User with this email');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      phone,
      role,
      profile: {
        avatar: null,
        bio: null,
        location: null,
        skills: [],
        experience: role === 'candidate' ? 0 : null,
        salaryExpectation: role === 'candidate' ? null : null,
        availability: role === 'candidate' ? 'available' : null,
      },
      verification: {
        status: 'pending',
        nik: role === 'candidate' ? nik : null,
        ktpDocument: null,
        npwp: role === 'company' ? npwp : null,
        npwpDocument: null,
        nib: role === 'company' ? nib : null,
      },
      companyName: role === 'company' ? companyName : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (req.files) {
      if (req.files.ktp) {
        userData.verification.ktpDocument = `/uploads/documents/${req.files.ktp[0].filename}`;
      }
      if (req.files.npwpDoc) {
        userData.verification.npwpDocument = `/uploads/documents/${req.files.npwpDoc[0].filename}`;
      }
    }
    const user = await createUser(userData);
    const token = generateToken({ userId: user.id, role: user.role });
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    validateRequiredFields(req.body, ['email', 'password']);
    validateEmail(email);
    const user = await getUserByEmail(email);

    if (!user) {
      throw ErrorTypes.INVALID_CREDENTIALS();
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw ErrorTypes.INVALID_CREDENTIALS();
    }
    const token = generateToken({ userId: user.id, role: user.role });
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}
export async function getCurrentUser(req, res) {
  try {
    const user = req.user;

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get user information.',
    });
  }
}
export async function updateProfile(req, res) {
  try {
    const userId = req.userId;
    const updates = req.body;
    const currentUser = await getUserById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }
    if (req.file) {
      updates.profile = {
        ...currentUser.profile,
        avatar: `/uploads/avatars/${req.file.filename}`,
      };
    }
    const updatedProfile = {
      ...currentUser.profile,
      ...updates.profile,
      ...updates,
    };
    if (updates.linkedin || updates.github || updates.twitter || updates.dribbble) {
      updatedProfile.social = {
        ...currentUser.profile?.social,
        linkedin: updates.linkedin || currentUser.profile?.social?.linkedin,
        github: updates.github || currentUser.profile?.social?.github,
        twitter: updates.twitter || currentUser.profile?.social?.twitter,
        dribbble: updates.dribbble || currentUser.profile?.social?.dribbble,
      };
      delete updatedProfile.linkedin;
      delete updatedProfile.github;
      delete updatedProfile.twitter;
      delete updatedProfile.dribbble;
    }
    const updatedUser = await updateUser(userId, {
      name: updates.name || currentUser.name,
      phone: updates.phone || currentUser.phone,
      profile: updatedProfile,
    });
    const { password: _, ...userWithoutPassword } = updatedUser;

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: { user: userWithoutPassword },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
    });
  }
}
export async function logout(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Logout successful!',
  });
}

export default {
  register,
  login,
  getCurrentUser,
  updateProfile,
  logout,
};
