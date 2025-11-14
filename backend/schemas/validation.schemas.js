
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .toLowerCase(),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),

  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),

  role: z.enum(['candidate', 'company'], {
    errorMap: () => ({ message: 'Role must be either candidate or company' })
  }),

  phone: z.string()
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
    .optional(),

  companyName: z.string().optional(),

  nik: z.string().optional(),
  npwp: z.string().optional(),
  nib: z.string().optional(),
}).refine(
  (data) => data.role !== 'company' || data.companyName,
  {
    message: 'Company name is required for company accounts',
    path: ['companyName'],
  }
);

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .toLowerCase(),

  password: z.string()
    .min(1, 'Password is required'),
});

export const createJobSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),

  department: z.string()
    .min(1, 'Department is required')
    .trim(),

  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship'], {
    errorMap: () => ({ message: 'Invalid employment type' })
  }),

  experienceLevel: z.enum(['entry', 'mid', 'senior'], {
    errorMap: () => ({ message: 'Invalid experience level' })
  }),

  locationMode: z.enum(['remote', 'hybrid', 'on-site'], {
    errorMap: () => ({ message: 'Invalid location mode' })
  }),

  location: z.string()
    .min(1, 'Location is required')
    .trim(),

  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .trim(),

  requirements: z.array(z.string())
    .min(1, 'At least one requirement is needed'),

  skills: z.array(z.string())
    .min(1, 'At least one skill is required'),

  benefits: z.array(z.string()).optional(),

  currency: z.enum(['IDR', 'USD']).default('IDR'),

  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),

  salaryRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    currency: z.enum(['IDR', 'USD']),
  }).optional(),
});

export const updateJobSchema = createJobSchema.partial();

export const jobIdSchema = z.object({
  id: z.string().uuid('Invalid job ID format'),
});

export const createApplicationSchema = z.object({
  jobId: z.string()
    .uuid('Invalid job ID format'),

  candidateName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),

  candidateEmail: z.string()
    .email('Invalid email format')
    .toLowerCase(),

  candidatePhone: z.string()
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
    .optional(),

  candidateSkills: z.array(z.string()).optional(),

  coverLetter: z.string()
    .max(2000, 'Cover letter must not exceed 2000 characters')
    .optional(),

  yearsOfExperience: z.number().min(0).optional(),

  expectedSalary: z.number().min(0).optional(),

  availableStartDate: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['applied', 'screening', 'interview', 'offer', 'accepted', 'hired', 'rejected'], {
    errorMap: () => ({ message: 'Invalid status value' })
  }),

  notes: z.string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional(),
});

export const applicationIdSchema = z.object({
  id: z.string().uuid('Invalid application ID format'),
});

export const paginationSchema = z.object({
  page: z.string()
    .transform(val => parseInt(val, 10))
    .pipe(z.number().int().min(1))
    .optional()
    .default('1'),

  limit: z.string()
    .transform(val => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(100))
    .optional()
    .default('10'),
});

export const searchSchema = z.object({
  q: z.string()
    .min(1, 'Search query must be at least 1 character')
    .max(200, 'Search query must not exceed 200 characters')
    .optional(),

  status: z.string().optional(),
  type: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .optional(),

  phone: z.string()
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
    .optional(),

  bio: z.string()
    .max(500, 'Bio must not exceed 500 characters')
    .optional(),

  location: z.string().optional(),

  skills: z.array(z.string()).optional(),

  experience: z.number().min(0).optional(),

  salaryExpectation: z.number().min(0).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),

  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
});

export const uuidSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});
