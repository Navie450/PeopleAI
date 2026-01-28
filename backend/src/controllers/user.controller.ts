import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse } from '../types';
import {
  createUserSchema,
  updateUserSchema,
  assignRoleSchema,
  listUsersQuerySchema,
} from '../dto/user.dto';
import { logger } from '../utils/logger';

export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = listUsersQuerySchema.parse(req.query);
    const { users, meta } = await userService.listUsers(query);

    const response: ApiResponse = {
      success: true,
      data: users,
      meta: { pagination: meta },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    const response: ApiResponse = {
      success: true,
      data: user,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = createUserSchema.parse(req.body);
    const createdBy = req.user?.id;

    const user = await userService.createUser(userData, createdBy);

    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'User created successfully',
    };

    logger.info('User created via API:', {
      userId: user.id,
      createdBy,
    });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userData = updateUserSchema.parse(req.body);
    const updatedBy = req.user?.id;

    const user = await userService.updateUser(id, userData, updatedBy);

    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'User updated successfully',
    };

    logger.info('User updated via API:', {
      userId: id,
      updatedBy,
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedBy = req.user?.id;

    await userService.deleteUser(id, deletedBy);

    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully',
    };

    logger.info('User deleted via API:', {
      userId: id,
      deletedBy,
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const activatedBy = req.user?.id;

    const user = await userService.activateUser(id, activatedBy);

    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'User activated successfully',
    };

    logger.info('User activated via API:', {
      userId: id,
      activatedBy,
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deactivatedBy = req.user?.id;

    const user = await userService.deactivateUser(id, deactivatedBy);

    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'User deactivated successfully',
    };

    logger.info('User deactivated via API:', {
      userId: id,
      deactivatedBy,
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const roles = await userService.getUserRoles(id);

    const response: ApiResponse = {
      success: true,
      data: roles,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const assignRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { role_name } = assignRoleSchema.parse(req.body);
    const assignedBy = req.user?.id;

    await userService.assignRole(id, role_name, assignedBy);

    const response: ApiResponse = {
      success: true,
      message: `Role '${role_name}' assigned successfully`,
    };

    logger.info('Role assigned via API:', {
      userId: id,
      roleName: role_name,
      assignedBy,
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const removeRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, roleId } = req.params;
    const removedBy = req.user?.id;

    await userService.removeRole(id, roleId, removedBy);

    const response: ApiResponse = {
      success: true,
      message: 'Role removed successfully',
    };

    logger.info('Role removed via API:', {
      userId: id,
      roleId,
      removedBy,
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
};
