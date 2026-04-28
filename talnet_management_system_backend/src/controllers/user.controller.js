import * as service from '../services/user.service.js';
import { catchAsync } from '../utils/catchAsync.js';

/* Get all users (Admin only) */
export const getUsers = catchAsync(async (req, res) => {
  const users = await service.getAllUsers();
  res.json({ success: true, data: users });
});

/* Get single user */
export const getUser = catchAsync(async (req, res) => {
  const user = await service.getUserById(req.user, req.params.id);
  res.json({ success: true, data: user });
});

/* Get user profile (current user) */
export const getUserProfile = catchAsync(async (req, res) => {
  console.log('[getUserProfile controller] req.user:', req.user);
  console.log('[getUserProfile controller] userId:', req.user?.id);
  
  const profile = await service.getUserProfile(req.user.id);
  res.json({ success: true, data: profile });
});

/* Update user profile */
export const updateUserProfile = catchAsync(async (req, res) => {
  const profile = await service.updateUserProfile(req.user.id, req.body);
  res.json({ success: true, message: 'Profile updated successfully', data: profile });
});

/* Change user password */
export const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const result = await service.changePassword(req.user.id, oldPassword, newPassword);
  res.json({ success: true, message: result.message });
});

/* Update user */
export const updateUser = catchAsync(async (req, res) => {
  const user = await service.updateUser(req.user, req.params.id, req.body);
  res.json({ success: true, message: 'Profile updated successfully', data: user });
});

/* Delete user (soft delete) */
export const deleteUser = catchAsync(async (req, res) => {
  await service.deleteUser(req.user, req.params.id);
  res.json({ success: true, message: 'User soft-deleted successfully' });
});
