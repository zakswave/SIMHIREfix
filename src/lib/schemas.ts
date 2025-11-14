import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama harus minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role: z.enum(['candidate', 'company'], { message: 'Role harus candidate atau company' }),
});

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password harus diisi'),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;

export const salaryRangeSchema = z.object({
  min: z.number().min(0, 'Gaji minimum harus >= 0'),
  max: z.number().min(0, 'Gaji maksimum harus >= 0'),
  currency: z.enum(['IDR', 'USD']),
}).refine(data => data.max >= data.min, {
  message: 'Gaji maksimum harus >= gaji minimum',
  path: ['max'],
});

export const jobPostSchema = z.object({
  title: z.string().min(3, 'Judul pekerjaan minimal 3 karakter'),
  department: z.string().min(2, 'Department minimal 2 karakter'),
  description: z.string().min(50, 'Deskripsi minimal 50 karakter'),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  experienceLevel: z.enum(['entry', 'mid', 'senior']),
  locationMode: z.enum(['remote', 'hybrid', 'on-site']),
  location: z.string().min(2, 'Lokasi minimal 2 karakter'),
  salaryRange: salaryRangeSchema.optional(),
  requirements: z.array(z.string()).min(1, 'Minimal 1 requirement'),
  skills: z.array(z.string()).min(1, 'Minimal 1 skill'),
  benefits: z.array(z.string()).optional(),
  isUrgent: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const jobSchema = jobPostSchema;

export type JobPostSchema = z.infer<typeof jobPostSchema>;
export type JobSchema = z.infer<typeof jobSchema>;
export type SalaryRangeSchema = z.infer<typeof salaryRangeSchema>;

export const applicationSchema = z.object({
  jobId: z.string().uuid('Job ID tidak valid'),
  jobTitle: z.string(),
  company: z.string(),
  coverLetter: z.string().min(50, 'Cover letter minimal 50 karakter').optional(),
  resumeUrl: z.string().url('URL resume tidak valid').optional(),
  portfolioUrl: z.string().url('URL portfolio tidak valid').optional(),
});

export type ApplicationSchema = z.infer<typeof applicationSchema>;

export const candidateProfileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Nomor HP tidak valid').optional(),
  location: z.string().min(2, 'Lokasi minimal 2 karakter').optional(),
  bio: z.string().max(500, 'Bio maksimal 500 karakter').optional(),
  skills: z.array(z.string()).max(20, 'Maksimal 20 skills').optional(),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.string(),
  })).optional(),
});

export const companyProfileSchema = z.object({
  name: z.string().min(2, 'Nama perusahaan minimal 2 karakter'),
  industry: z.string().min(2, 'Industri minimal 2 karakter'),
  size: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']),
  location: z.string().min(2, 'Lokasi minimal 2 karakter'),
  description: z.string().min(50, 'Deskripsi minimal 50 karakter'),
  website: z.string().url('URL website tidak valid').optional(),
  email: z.string().email('Email tidak valid').optional(),
  phone: z.string().regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Nomor HP tidak valid').optional(),
});

export type CandidateProfileSchema = z.infer<typeof candidateProfileSchema>;
export type CompanyProfileSchema = z.infer<typeof companyProfileSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
});

export type ContactSchema = z.infer<typeof contactSchema>;

