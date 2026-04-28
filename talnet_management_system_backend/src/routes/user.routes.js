import express from 'express';
import {
  getUsers,
  getUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';
import { verifyToken, permit } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateUserSchema } from '../utils/validators.js';
const router = express.Router();
// User profile routes (for regular users to manage their own profile)
router.use(verifyToken);
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.patch('/change-password', changePassword);
// Admin routes
router.get('/', permit('admin'), getUsers);
router.get('/:id', getUser);
router.put('/:id', validate(updateUserSchema), updateUser); 
router.delete('/:id', deleteUser); 

export default router;
