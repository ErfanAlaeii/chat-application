import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export async function register(data: { email: string; password: string; name?: string }) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) {
    throw new Error('Duplicate email.');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name || '',
    },
  });

  return user;
}

export async function login(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error('user not found');
  }

  const isMatch = await bcrypt.compare(data.password, user.password || '');
  if (!isMatch) {
    throw new Error('The password is wrong.');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET || 'secret_key',
    { expiresIn: '1h' },
  );

  return token;
}
