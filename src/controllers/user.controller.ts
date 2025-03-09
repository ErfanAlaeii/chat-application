import { Request, Response } from 'express';
import { 
  createUser, 
  loginUser, 
  listUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from '../services/user.service';
import { createUserSchema, loginUserUserSchema, updateUserSchema } from '../validations/user.validation';

export async function createUserController(req: Request, res: Response) {
  const validation = createUserSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.format() });
  }

  try {
    const user = await createUser(validation.data);
    res.status(201).json({ message: 'User created successfully.', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function loginUserController(req: Request, res: Response) {
  const validation = loginUserUserSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.format() });
  }

  try {
    const token = await loginUser(validation.data);
    res.status(200).json({ message: 'Login was successful.', token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

export async function listUsersController(req: Request, res: Response) {
  try {
    const users = await listUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getUserByIdController(req: Request, res: Response) {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

export async function updateUserController(req: Request, res: Response) {
  const validation = updateUserSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.format() });
  }

  try {
    const user = await updateUser(req.params.id, validation.data);
    res.status(200).json({ message: 'User updated.', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteUserController(req: Request, res: Response) {
  try {
    const user = await deleteUser(req.params.id);
    res.status(200).json({ message: 'User deleted.', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
