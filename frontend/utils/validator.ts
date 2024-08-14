import { z } from 'zod';

export const signupSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username cannot exceed 20 characters'),
    // .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters long'),
    // .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    // .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const signinSchema = z.object({
    // username: z.string()
    //   .min(3, 'Username must be at least 3 characters long')
    //   .max(20, 'Username cannot exceed 20 characters'),
      // .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores'),
    email: z.string().email('Invalid email format'),
    password: z.string()
      .min(6, 'Password must be at least 6 characters long'),
      // .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      // .regex(/[0-9]/, 'Password must contain at least one number'),
  });
