import { z } from 'zod';

export const createUserSchema = z.object({
    email:z.string().email({ message: 'Invalid email address'}),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    name: z.string().optional()
})

export const loginUserUserSchema = z.object({
    email:z.string().email({ message: 'Invalid email address'}),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
})


export const updateUserSchema = z.object({
    name: z.string().optional(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).optional(),
    role: z.enum(['USER', 'ADMIN']).optional(),
  });