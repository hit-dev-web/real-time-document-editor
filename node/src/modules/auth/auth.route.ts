// src/routes/authRoute.ts

import express from 'express';
import {AuthController} from './auth.controller';
import { authMiddleware } from '../../middleware';

const authController = new AuthController()
const router = express.Router();

// Route to register a new user
router.post(
  '/register',
  authController.registerUser 
);

// Route to log in a user
router.post(
  '/login',
  authController.loginUser  
);
// Route to log in a user
router.get(
  '/me',
  authMiddleware,
  authController.getUser  // Notice: pass the function without calling it
);
export default router;
