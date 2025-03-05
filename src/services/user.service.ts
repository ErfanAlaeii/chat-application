import { Role } from '@prisma/client';
import prisma  from '../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export async function createUser(data: { email: string; password: string; name?: string; role?: Role}) {

  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw new Error('This email has already been registered.');
  }


  const hashedPassword = await bcrypt.hash(data.password, 10);


  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name || '',
      role: data.role || Role.USER,
    },
  });
  return user;
}


export async function loginUser(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new Error('user not found');
  }

  if(!user.password){
    throw new Error('No password set for this user.')
  }
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error('The password is incorrect.');
  }


  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '1h' }
  );
  return token;
}

export async function listUsers() {
  return prisma.user.findMany();
}


export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error('user not found');
  }
  return user;
}


export async function updateUser(id: string, data: { name?: string; password?: string; role?: string }) {
  const updateData: any = {};
  if (data.name !== undefined) {
    updateData.name = data.name;
  }
  if (data.role !== undefined) {
    updateData.role = data.role;
  }
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }
  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
  });
  return updatedUser;
}


export async function deleteUser(id: string) {
  const deletedUser = await prisma.user.delete({ where: { id } });
  return deletedUser;
}
