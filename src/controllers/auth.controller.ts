import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { registerSchema,loginSchema } from '../validations/auth.validation';

export const registerController = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body)
    const user = await authService.register(validatedData);
    return res.status(201).json({ message: 'Registration was successful.', user });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body)
    const token = await authService.login(validatedData);
    return res.json({ message: 'Login was successful', token });
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
};
