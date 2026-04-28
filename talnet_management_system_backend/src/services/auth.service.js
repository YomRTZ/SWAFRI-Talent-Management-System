import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { hashPassword, comparePassword } from '../utils/password.js';
import { AppError } from '../utils/AppError.js';
import { models } from '../models/index.js';

export const registerUser = async ({ email, password_hash, full_name, phone_number }) => {
  try {
    const existing = await models.User.findOne({ where: { email } });
    if (existing) throw new AppError("An account with this email already exists. Please log in instead of signing up again. If you forgot your password, use the \"Forgot Password\" option to reset it.", 409);

    const role = await models.Role.findOne({ where: { role_name: 'user' } });
    if (!role) throw new AppError('Default role not found', 500);

    const user = await models.User.create({
      email,
      password_hash: await hashPassword(password_hash),
      full_name,
      phone_number,
      role_id: role.id, 
    });

    return user;
  } catch (error) {
    console.error('registerUser service error:', error);
    throw error;
  }
};


export const loginUser = async ({ email, password_hash, rememberMe }, req) => {
  const user = await models.User.findOne({
    where: { email },
    include: models.Role,
  });
  if (!user) throw new AppError("Invalid email or password. Please check your credentials and try again.", 401);

  const valid = await comparePassword(password_hash, user.password_hash);
  if (!valid) throw new AppError("Invalid email or password. Please check your credentials and try again.", 401);

  const deviceInfo = req ? {
    device: req.headers?.['user-agent'],
    ip: req.ip,
  } : {};

  const refreshToken = await generateRefreshToken(user.id, rememberMe, deviceInfo);

  return {
    user,
    accessToken: signAccessToken(user),
    refreshToken,
  };
};


export const verifyRefreshToken = async token => {
  try {
    if (!token) throw new AppError('Refresh token missing', 401);

    const record = await models.RefreshToken.findOne({ where: { token } });
    if (!record || record.revoked_at || record.expires_at < new Date()) {
      throw new AppError('Invalid refresh token', 403);
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return payload.user_id;
    } catch {
      throw new AppError('Invalid refresh token', 403);
    }
  } catch (error) {
    console.error('verifyRefreshToken service error:', error);
    throw error;
  }
};

// Rotate refresh token - verify current token, revoke it, and generate new one
export const rotateRefreshToken = async (token, req) => {
  try {
    if (!token) throw new AppError('Refresh token missing', 401);

    // Find the refresh token record
    const record = await models.RefreshToken.findOne({ where: { token } });
    if (!record || record.revoked_at || record.expires_at < new Date()) {
      throw new AppError('Invalid or expired refresh token', 403);
    }

    // Verify JWT signature
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      throw new AppError('Invalid refresh token', 403);
    }

    const userId = payload.user_id;

    // Get user with role
    const user = await models.User.findByPk(userId, { include: models.Role });
    if (!user) throw new AppError('User not found', 401);

    // Revoke the old token
    await models.RefreshToken.update(
      { revoked_at: new Date() },
      { where: { token } }
    );

    // Generate new access token
    const accessToken = jwt.sign(
      {
        user_id: user.id,
        role_name: user.Role.role_name
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Generate new refresh token
    const deviceInfo = req ? {
      device: req.headers?.['user-agent'],
      ip: req.ip,
    } : {};

    const newRefreshToken = await generateRefreshToken(user.id, false, deviceInfo);

    return { accessToken, newRefreshToken };
  } catch (error) {
    console.error('rotateRefreshToken service error:', error);
    throw error;
  }
};

export const revokeRefreshToken = async token => {
  try {
    await models.RefreshToken.update(
      { revoked_at: new Date() },
      { where: { token } }
    );
  } catch (error) {
    console.error('revokeRefreshToken service error:', error);
    throw error;
  }
};

/* ----------------- helpers ----------------- */
const signAccessToken = user =>
  jwt.sign(
    {
      user_id: user.id,
      role_name: user.Role.role_name
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

const generateRefreshToken = async (user_id, rememberMe = false, { device, ip } = {}) => {
  const expiresInMs = rememberMe
    ? 30 * 24 * 60 * 60 * 1000
    : 24 * 60 * 60 * 1000;

  const token = jwt.sign({ user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: rememberMe ? '30d' : '1d' });

  await models.RefreshToken.create({
    token,
    user_id,
    device,
    ip,
    expires_at: new Date(Date.now() + expiresInMs),
  });

  return token;
};
