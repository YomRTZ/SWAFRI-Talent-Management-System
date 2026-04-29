import * as service from '../services/auth.service.js'
import { catchAsync } from '../utils/catchAsync.js'
import { AppError } from '../utils/AppError.js'
import { models } from '../models/index.js'

export const register = catchAsync(async (req, res) => {
  try {
    const user = await service.registerUser(req.body)
    const role = await models.Role.findByPk(user.role_id)

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: [role?.role_name],
        message: 'Registration successful.',
      },
    })
  } catch (error) {
    console.error('Register controller error:', error)
    throw error
  }
})

export const login = catchAsync(async (req, res) => {
  try {
    const { rememberMe } = req.body
    
    // Handle both password and password_hash (for frontend compatibility)
    const password = req.body.password || req.body.password_hash;
    
    const { user, accessToken, refreshToken } =
      await service.loginUser({ ...req.body, password_hash: password }, req)

    // Check if request is from same origin (browser) or different origin
    const origin = req.headers.origin;
    const isSameOrigin = !origin || origin.includes('localhost') || origin.includes('netlify.app');
    // Use 'Lax' for same origin to allow cookie to work across subdomains/ports
    // Use 'none' for cross-origin (requires Secure flag in production)
    const sameSite = isSameOrigin ? 'Lax' : 'none';

    // Set refresh token in HttpOnly cookie ONLY
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSite,
      path: '/',
      maxAge: rememberMe
        ? 30 * 24 * 60 * 60 * 1000 // 30 days
        : 24 * 60 * 60 * 1000, // 1 day
    })

    // Return access token in response body (frontend will store in memory)
    // DO NOT return refreshToken in response body - only in HttpOnly cookie
    res.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: [user.Role.role_name],
        },
      },
    })
  } catch (error) {
    console.error('Login controller error:', error)
    throw error
  }
})


export const refreshToken = catchAsync(async (req, res) => {
  try {
    // ONLY accept refresh token from cookie - reject from body for security
    const token = req.cookies.refreshToken;
    if (!token) {
      throw new AppError('Refresh token missing. Please log in again.', 401)
    }

    // Verify the refresh token and get new access token (with rotation)
    const { accessToken, newRefreshToken } = await service.rotateRefreshToken(token, req)

    // Check if request is from same origin (browser) or different origin
    const origin = req.headers.origin;
    const isSameOrigin = !origin || origin.includes('localhost') || origin.includes('netlify.app');
    // Use 'Lax' for same origin to allow cookie to work across subdomains/ports
    // Use 'none' for cross-origin (requires Secure flag in production)
    const sameSite = isSameOrigin ? 'Lax' : 'none';

    // If rotation happened, set new refresh token cookie
    if (newRefreshToken) {
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: sameSite,
        path: '/',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
    }

    // Return new access token in response body (frontend stores in memory)
    res.json({
      success: true,
      data: { accessToken },
    })
  } catch (error) {
    // Don't log expected errors for missing refresh token
    if (error.message !== 'Refresh token missing. Please log in again.') {
      console.error('Refresh token controller error:', error)
    }
    
    // Clear the invalid refresh token cookie
    const origin = req.headers.origin;
    const isSameOrigin = !origin || origin.includes('localhost') || origin.includes('netlify.app');
    const sameSite = isSameOrigin ? 'Lax' : 'none';
    
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSite,
      path: '/',
    })
    
    throw error
  }
})


export const logout = catchAsync(async (req, res) => {
  try {
    const token = req.cookies.refreshToken
    if (token) await service.revokeRefreshToken(token)

    // Check if request is from same origin (browser) or different origin
    const origin = req.headers.origin;
    const isSameOrigin = !origin || origin.includes('localhost') || origin.includes('netlify.app');
    // Use 'Lax' for same origin to allow cookie to work across subdomains/ports
    // Use 'none' for cross-origin (requires Secure flag in production)
    const sameSite = isSameOrigin ? 'Lax' : 'none';

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSite,
      path: '/',
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Logout controller error:', error)
    throw error
  }
})

export const getLoginActivity = catchAsync(async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all refresh tokens for this user that haven't been revoked
    const refreshTokens = await models.RefreshToken.findAll({
      where: {
        user_id: userId,
        revoked_at: null, // Only active tokens
      },
      order: [['createdAt', 'DESC']],
      limit: 10, // Limit to last 10 sessions for performance
    });

    // Format the data for frontend
    const loginActivity = refreshTokens.map(token => ({
      id: token.id,
      device: token.device || 'Unknown Device',
      ip: token.ip || 'Unknown IP',
      createdAt: token.createdAt,
      lastUsed: token.createdAt, // For now, use createdAt as lastUsed
    }));

    res.json({
      success: true,
      data: loginActivity,
    });
  } catch (error) {
    console.error('Get login activity controller error:', error);
    throw error;
  }
});
