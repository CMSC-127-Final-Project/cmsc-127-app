import { z } from 'zod';

export const updateUserSchema = z.object({
  nickname: z.string().optional(),
  phone: z.string().regex(/^\d+$/, 'Phone number must contain only digits').optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string(),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  fname: z.string().min(1, 'First name is required'),
  lname: z.string().min(1, 'Last name is required'),
  nickname: z.string().optional(),
  role: z.enum(['Student', 'Instructor']),
  department: z.string().min(1, 'Department is required'),
  studentNumber: z.string().optional(),
  instructorID: z.string().optional(),
  instructorOffice: z.string().optional(),
  facultyRank: z.string().optional(),
});
