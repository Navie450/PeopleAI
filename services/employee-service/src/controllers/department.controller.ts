import { Request, Response, NextFunction } from 'express';
import { departmentService } from '../services/department.service';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  listDepartmentsQuerySchema,
} from '../dto/department.dto';

// List all departments with pagination and filters
export const listDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = listDepartmentsQuerySchema.parse(req.query);
    const { departments, meta } = await departmentService.listDepartments(query);

    const response: ApiResponse = {
      success: true,
      data: departments,
      meta: { pagination: meta },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get single department by ID
export const getDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const department = await departmentService.getDepartmentById(id);

    const response: ApiResponse = {
      success: true,
      data: department,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Create new department
export const createDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createDepartmentSchema.parse(req.body);
    const createdBy = req.user?.id;

    const department = await departmentService.createDepartment(data, createdBy);

    logger.info('Department created via API:', {
      departmentId: department.id,
      createdBy,
    });

    const response: ApiResponse = {
      success: true,
      data: department,
      message: 'Department created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// Update department
export const updateDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = updateDepartmentSchema.parse(req.body);
    const updatedBy = req.user?.id;

    const department = await departmentService.updateDepartment(id, data, updatedBy);

    logger.info('Department updated via API:', {
      departmentId: id,
      updatedBy,
    });

    const response: ApiResponse = {
      success: true,
      data: department,
      message: 'Department updated successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Delete department
export const deleteDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedBy = req.user?.id;

    await departmentService.deleteDepartment(id, deletedBy);

    logger.info('Department deleted via API:', {
      departmentId: id,
      deletedBy,
    });

    const response: ApiResponse = {
      success: true,
      message: 'Department deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get department hierarchy
export const getDepartmentHierarchy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hierarchy = await departmentService.getDepartmentHierarchy();

    const response: ApiResponse = {
      success: true,
      data: hierarchy,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get employees in department
export const getDepartmentEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await departmentService.getDepartmentEmployees(id);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
