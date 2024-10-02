// src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'abcsjjs' // Make sure to use the same secret as used in the auth controller

export interface AuthenticatedRequest extends Request {
  user?: any; // Add a user property to the request object
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
  const token = req.header('Authorization')?.split(' ')[1]; // Expecting 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add the decoded token payload (user data) to the request object
    next(); // Call the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
