import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { ApiResponse } from '../types';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  UserResponse,
} from '../dto/auth.dto';
import { logger } from '../utils/logger';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, first_name, last_name } = registerSchema.parse(req.body);

    const { tokens, user } = await authService.register(
      email,
      password,
      first_name,
      last_name
    );

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      display_name: user.display_name,
      roles: user.roles || [],
      is_active: user.is_active,
      email_verified: user.email_verified,
      last_login_at: user.last_login_at,
      created_at: user.created_at,
    };

    const response: ApiResponse = {
      success: true,
      data: {
        tokens,
        user: userResponse,
      },
      message: 'Registration successful',
    };

    logger.info('User registered successfully:', {
      userId: user.id,
      email: user.email,
    });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const { tokens, user } = await authService.login(email, password);

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      display_name: user.display_name,
      roles: user.roles || [],
      is_active: user.is_active,
      email_verified: user.email_verified,
      last_login_at: user.last_login_at,
      created_at: user.created_at,
    };

    const response: ApiResponse = {
      success: true,
      data: {
        tokens,
        user: userResponse,
      },
      message: 'Login successful',
    };

    logger.info('User logged in successfully:', {
      userId: user.id,
      email: user.email,
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refresh_token } = refreshTokenSchema.parse(req.body);

    const tokens = await authService.refreshAccessToken(refresh_token);

    const response: ApiResponse = {
      success: true,
      data: { tokens },
      message: 'Token refreshed successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const { old_password, new_password } = changePasswordSchema.parse(req.body);

    await authService.changePassword(req.user.id, old_password, new_password);

    const response: ApiResponse = {
      success: true,
      message: 'Password changed successfully',
    };

    logger.info('Password changed:', { userId: req.user.id });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      const response: ApiResponse = {
        success: true,
        message: 'Logged out successfully',
      };
      return res.json(response);
    }

    await authService.logout(req.user.id);

    const response: ApiResponse = {
      success: true,
      message: 'Logged out successfully',
    };

    logger.info('User logged out:', { userId: req.user.id });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const userResponse: UserResponse = {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      display_name: req.user.display_name,
      roles: req.user.roles || [],
      is_active: req.user.is_active,
      email_verified: req.user.email_verified,
      last_login_at: req.user.last_login_at,
      created_at: req.user.created_at,
    };

    const response: ApiResponse = {
      success: true,
      data: userResponse,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};
