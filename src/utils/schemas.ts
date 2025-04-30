import { z } from 'zod';

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  id_number: z.string().optional(),
  dept: z.string().optional(),
  rank: z.string().optional(),
  instructor_office: z.number().optional(),
  nickname: z.string().optional(),
  phone: z.string().regex(/^\d+$/, 'Phone number must contain only digits').optional(),
  role: z.enum(['Student', 'Instructor', 'Admin']).optional(),
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
  nickname: z.string().min(1, 'Nickname is required'),
  role: z.enum(['Student', 'Instructor']),
  department: z.string().min(1, 'Department is required'),
  studentNumber: z.string().optional(),
  instructorID: z.string().optional(),
  instructorOffice: z.string().optional(),
  facultyRank: z.string().optional(),
});

export const userSchema = z.object({
  auth_id: z.string(),
  email: z.string().email('Invalid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  student_num: z.string().nullable(),
  instructor_id: z.string().nullable(),
  phone: z.string().regex(/^\d+$/, 'Phone number must contain only digits').nullable(),
  dept: z.string().min(1, 'Department is required'),
  role: z.enum(['Student', 'Instructor', 'Admin']),
  nickname: z.string().nullable(),
});
