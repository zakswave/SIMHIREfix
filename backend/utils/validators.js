import { z } from 'zod';
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  phone: z.string().min(10, 'Invalid phone number'),
  role: z.enum(['candidate', 'company']),
  companyName: z.string().optional(),
  nik: z.string().length(16, 'NIK must be 16 digits').optional(),
  npwp: z.string().optional(),
  nib: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password min 6 characters'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(3).optional(),
  phone: z.string().min(10).optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.number().optional(),
  salaryExpectation: z.number().optional(),
  availability: z.enum(['available', 'open_to_offers', 'not_looking']).optional(),
});
export const createJobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.array(z.string()).optional().default([]),
  responsibilities: z.array(z.string()).optional().default([]),

  location: z.string().min(1, 'Location is required'),
  type: z.string().optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']).optional(),
  locationMode: z.string().optional(),
  experienceLevel: z.string().optional(),
  department: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  skills: z.array(z.string()).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),
  status: z.string().optional(),
  remote: z.boolean().optional(),
  urgent: z.boolean().optional(),
  featured: z.boolean().optional(),
}).passthrough();

export const updateJobSchema = createJobSchema.partial();
export const createApplicationSchema = z.object({
  jobId: z.string().uuid('Invalid job ID'),
  coverLetter: z.string().optional(),
  portfolioIds: z.array(z.string()).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['applied', 'screening', 'interview', 'offer', 'rejected', 'accepted']),
  note: z.string().optional(),
  interviewDate: z.string().optional(),
  interviewType: z.enum(['phone', 'video', 'onsite', 'technical', 'hr']).optional(),
  meetingLink: z.string().url().optional(),
  interviewLocation: z.string().optional(),
  interviewNotes: z.string().optional(),
});
export const submitSimulasiSchema = z.object({
  categoryId: z.string(),
  taskResults: z.array(z.object({
    taskId: z.string(),
    answer: z.object({
      text: z.string().optional(),
      code: z.string().optional(),
      files: z.array(z.string()).optional(),
    }),
    timeSpent: z.number(),
  })),
  breakdown: z.object({
    technical: z.number().min(0).max(100),
    creativity: z.number().min(0).max(100),
    efficiency: z.number().min(0).max(100),
    communication: z.number().min(0).max(100),
  }),
});
export const createPortfolioSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  liveUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
});

export const updatePortfolioSchema = createPortfolioSchema.partial();
export const sendMessageSchema = z.object({
  recipientId: z.string().uuid(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
export function validateData(schema, data) {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ message: 'Validation failed' }] };
  }
}

export default {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  createJobSchema,
  updateJobSchema,
  createApplicationSchema,
  updateApplicationStatusSchema,
  submitSimulasiSchema,
  createPortfolioSchema,
  updatePortfolioSchema,
  sendMessageSchema,
  validateData,
};
