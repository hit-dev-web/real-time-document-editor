import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from './user.model'; // Ensure your User model is imported
import mongoose from 'mongoose';

const JWT_SECRET = 'abcsjjs'; // You should store this in an environment variable

export class AuthController {
  // Register a new user and return a JWT token
  public async registerUser(req: Request, res: Response): Promise<any> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ email, password: hashedPassword });
      await user.save();

      // Generate a JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      return res.status(201).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // Log in a user and return a JWT token
  public async loginUser(req: Request, res: Response): Promise<any> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Generate a JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      return res.json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // Get user details from the token
  public async getUser(req: any, res: Response): Promise<any> {
    try {
      const { user: { id } } = req.locals;
      const _id = new mongoose.Types.ObjectId(id);
      const user = await User.findOne({ _id }).lean();
      return res.json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}
