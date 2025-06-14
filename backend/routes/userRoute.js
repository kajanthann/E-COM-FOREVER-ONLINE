import express from 'express';
import { loginUser, regUser, createAdmin } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', regUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', createAdmin);

export default userRouter;