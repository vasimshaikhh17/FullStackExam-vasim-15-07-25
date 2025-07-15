import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {User} from '../models';

export interface AuthenticatedRequest extends Request {
  user?: { id: number; name: string; email: string };
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
      
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['passwordHash'] }
      });

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = user.get({ plain: true });
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};