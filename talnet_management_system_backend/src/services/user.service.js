
import { sequelize, models } from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { comparePassword, hashPassword } from '../utils/password.js';

// Get Op from sequelize
const Op = sequelize.Sequelize.Op;

/* -----------------------------
   Get all users (Admin only)
   - Only returns users who have completed their talent profile
----------------------------- */
export const getAllUsers = async () => {
  return await models.User.findAll({
    where: {
      is_deleted: false,
      full_name: { [Op.and]: { [Op.ne]: null, [Op.ne]: '' } },
      email: { [Op.and]: { [Op.ne]: null, [Op.ne]: '' } },
      primary_skill: { [Op.and]: { [Op.ne]: null, [Op.ne]: '' } },
      years_of_experience: { [Op.ne]: null },
      description: { [Op.and]: { [Op.ne]: null, [Op.ne]: '' } },
    },
    include: [{ model: models.Role }],
  });
};

/* -----------------------------
   Get single user by id
   - Admin can access any
   - Normal user can access self only
----------------------------- */
export const getUserById = async (currentUser, targetUserId) => {
  if (currentUser.role !== 'admin' && currentUser.id !== targetUserId) {
    throw new AppError('Access denied', 403);
  }

  const user = await models.User.findOne({
    where: { id: targetUserId, is_deleted: false },
    include: [{ model: models.Role }],
  });

  if (!user) throw new AppError('User not found', 404);
  return user;
};

/* -----------------------------
   Get User Profile Data
   - Returns user data for talent profile
   - Includes isProfileComplete flag
----------------------------- */
export const getUserProfile = async (userId) => {
  console.log('[getUserProfile] Starting profile fetch for userId:', userId);

  try {
    const user = await models.User.findOne({
      where: { id: userId, is_deleted: false },
      include: [{ model: models.Role }],
    });

    console.log('[getUserProfile] Query completed, user found:', !!user);

    if (!user) throw new AppError('User not found', 404);

    // Transform user data to match frontend expectations
    const userData = user.toJSON();

    // Check if profile is complete (has required fields for talent)
    const hasFullName = userData.full_name && userData.full_name.trim().length > 0;
    const hasEmail = userData.email && userData.email.trim().length > 0;
    const hasPrimarySkill = userData.primary_skill && userData.primary_skill.trim().length > 0;
    const hasExperience = userData.years_of_experience !== null && userData.years_of_experience !== undefined;
    const hasDescription = userData.description && userData.description.trim().length > 0;

    // Profile is complete if user has full name, email, primary skill, experience, and description
    userData.isProfileComplete = hasFullName && hasEmail && hasPrimarySkill && hasExperience && hasDescription;
    userData.profileCompletion = {
      hasFullName,
      hasEmail,
      hasPrimarySkill,
      hasExperience,
      hasDescription,
      missingFields: []
    };

    if (!hasFullName) userData.profileCompletion.missingFields.push('Full Name');
    if (!hasEmail) userData.profileCompletion.missingFields.push('Email');
    if (!hasPrimarySkill) userData.profileCompletion.missingFields.push('Primary Skill');
    if (!hasExperience) userData.profileCompletion.missingFields.push('Years of Experience');
    if (!hasDescription) userData.profileCompletion.missingFields.push('Description');

    return userData;
  } catch (error) {
    console.error('[getUserProfile] Error:', error.message);
    console.error('[getUserProfile] Stack:', error.stack);
    throw error;
  }
};

/* -----------------------------
   Update User Profile
   - Updates user talent profile data
----------------------------- */
export const updateUserProfile = async (userId, data) => {
  const {
    full_name,
    email,
    primary_skill,
    years_of_experience,
    description,
    phone_number
  } = data;

  try {
    // Find the user
    const user = await models.User.findByPk(userId);
    if (!user) throw new AppError('User not found', 404);

    // Update user fields
    if (full_name !== undefined) user.full_name = full_name;
    if (email !== undefined) user.email = email;
    if (primary_skill !== undefined) user.primary_skill = primary_skill;
    if (years_of_experience !== undefined) user.years_of_experience = years_of_experience;
    if (description !== undefined) user.description = description;
    if (phone_number !== undefined) user.phone_number = phone_number;

    await user.save();

    // Return updated profile
    return await getUserProfile(userId);
  } catch (error) {
    console.error('[updateUserProfile] Error:', error.message);
    console.error('[updateUserProfile] Stack:', error.stack);
    throw error;
  }
};

/* -----------------------------
   Update user
   - Only users can update their own profile
   - Admin cannot update any profile
----------------------------- */
export const updateUser = async (currentUser, targetUserId, data) => {
  const user = await models.User.findOne({
    where: { id: targetUserId, is_deleted: false },
  });

  if (!user) throw new AppError('User not found', 404);

  // Admin cannot update any user profile
  if (currentUser.role === 'admin') {
    throw new AppError('Access denied', 403);
  }

  // Normal user: can update only self
  if (currentUser.id !== targetUserId) {
    throw new AppError('Access denied', 403);
  }

  delete data.is_active; // normal user cannot toggle active status
  delete data.password_hash;
  delete data.role_id;
  delete data.is_deleted;
  delete data.deleted_at;

  Object.assign(user, data);
  await user.save();

  console.log(`[Audit] User ${currentUser.id} updated user ${targetUserId} at ${new Date().toISOString()}`);
  return user;
};


/* -----------------------------
   Change user password
   - Verifies old password before updating
   - Returns error if old password doesn't match
----------------------------- */
export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await models.User.findOne({
    where: { id: userId, is_deleted: false },
  });

  if (!user) throw new AppError('User not found', 404);

  // Verify old password
  const isOldPasswordValid = await comparePassword(oldPassword, user.password_hash);
  if (!isOldPasswordValid) {
    throw new AppError('Your old password did not match', 400);
  }

  // Hash and save new password
  user.password_hash = await hashPassword(newPassword);
  await user.save();

  return { message: 'Password changed successfully' };
};

/* -----------------------------
   Soft delete user
   - Only users can delete their own profile
   - Admin cannot delete any profile
----------------------------- */
export const deleteUser = async (currentUser, targetUserId) => {
  // Admin cannot delete any user
  if (currentUser.role === 'admin') {
    throw new AppError('Access denied', 403);
  }

  // Normal user: can delete only self
  if (currentUser.id !== targetUserId) {
    throw new AppError('Access denied', 403);
  }

  const user = await models.User.findOne({
    where: { id: targetUserId, is_deleted: false },
  });

  if (!user) throw new AppError('User not found', 404);

  user.is_deleted = true;
  user.deleted_at = new Date();
  await user.save();

  console.log(`[Audit] User ${currentUser.id} soft-deleted user ${targetUserId} at ${new Date().toISOString()}`);
  return user;
};

