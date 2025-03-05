import { Request, Response, NextFunction } from 'express';
import passport from '../config/passport';


export const jwtAuth = passport.authenticate('jwt', { session: false });

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user 
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: No user found.' });
  }
  if (user.role !== 'ADMIN') {

    return res.status(403).json({ error: 'Access denied: Admins only.' });
  }
  next();
};

