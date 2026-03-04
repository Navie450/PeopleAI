import { Request, Response, NextFunction } from 'express';
import { employeeService } from '../services/employee.service';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  listEmployeesQuerySchema,
  bulkUpdateEmployeesSchema,
  transferEmployeeSchema,
  promoteEmployeeSchema,
  terminateEmployeeSchema,
  addSkillSchema,
  updateLeaveBalanceSchema,
  addPerformanceGoalSchema,
  updatePerformanceGoalSchema,
} from '../dto/employee.dto';

// List all employees with pagination and filters
export const listEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = listEmployeesQuerySchema.parse(req.query);
    const { employees, meta } = await employeeService.listEmployees(query);

    const response: ApiResponse = {
      success: true,
      data: employees,
      meta: { pagination: meta },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get single employee by ID
export const getEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeById(id);

    const response: ApiResponse = {
      success: true,
      data: employee,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get employee by user ID (for self-service)
export const getEmployeeByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId || req.user?.id;
    if (!userId) {
      throw new Error('User ID is required');
    }

    const employee = await employeeService.getEmployeeByUserId(userId);

    const response: ApiResponse = {
      success: true,
      data: employee,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get current user's employee profile
export const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    let employee = null;
    try {
      employee = await employeeService.getEmployeeByUserId(userId);
    } catch (err: any) {
      // If no employee record exists, return null instead of error
      if (err.name === 'NotFoundError') {
        const response: ApiResponse = {
          success: true,
          data: null,
          message: 'No employee profile linked to this user account',
        };
        return res.status(200).json(response);
      }
      throw err;
    }

    const response: ApiResponse = {
      success: true,
      data: employee,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Create new employee
export const createEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createEmployeeSchema.parse(req.body);
    const createdBy = req.user?.id;

    const employee = await employeeService.createEmployee(data, createdBy);

    logger.info('Employee created via API:', {
      employeeId: employee.id,
      createdBy,
    });

    const response: ApiResponse = {
      success: true,
      data: employee,
      message: 'Employee created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// Update employee
export const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = updateEmployeeSchema.parse(req.body);
    const updatedBy = req.user?.id;

    const employee = await employeeService.updateEmployee(id, data, updatedBy);

    logger.info('Employee updated via API:', {
      employeeId: id,
      updatedBy,
    });

    const response: ApiResponse = {
      success: true,
      data: employee,
      message: 'Employee updated successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Delete employee
export const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedBy = req.user?.id;

    await employeeService.deleteEmployee(id, deletedBy);

    logger.info('Employee deleted via API:', {
      employeeId: id,
      deletedBy,
    });

    const response: ApiResponse = {
      success: true,
      message: 'Employee deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Bulk update employees
export const bulkUpdateEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = bulkUpdateEmployeesSchema.parse(req.body);
    const updatedBy = req.user?.id;

    const result = await employeeService.bulkUpdateEmployees(data, updatedBy);

    logger.info('Bulk employee update via API:', {
      updated: result.updated,
      failed: result.failed.length,
      updatedBy,
    });

    const response: ApiResponse = {
      success: true,
      data: result,
      message: `Successfully updated ${result.updated} employee(s)`,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Transfer employee
export const transferEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = transferEmployeeSchema.parse(req.body);
    const transferredBy = req.user?.id;

    const employee = await employeeService.transferEmployee(id, data, transferredBy);

    logger.info('Employee transferred via API:', {
      employeeId: id,
      transferredBy,
    });

    const response: ApiResponse = {
      success: true,
      data: employee,
      message: 'Employee transferred successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Promote employee
export const promoteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = promoteEmployeeSchema.parse(req.body);
    const promotedBy = req.user?.id;

    const employee = await employeeService.promoteEmployee(id, data, promotedBy);

    logger.info('Employee promoted via API:', {
      employeeId: id,
      promotedBy,
    });

    const response: ApiResponse = {
      success: true,
      data: employee,
      message: 'Employee promoted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Terminate employee
export const terminateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = terminateEmployeeSchema.parse(req.body);
    const terminatedBy = req.user?.id;

    const employee = await employeeService.terminateEmployee(id, data, terminatedBy);

    logger.info('Employee terminated via API:', {
      employeeId: id,
      terminatedBy,
    });

    const response: ApiResponse = {
      success: true,
      data: employee,
      message: 'Employee terminated successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get direct reports
export const getDirectReports = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const directReports = await employeeService.getDirectReports(id);

    const response: ApiResponse = {
      success: true,
      data: directReports,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get org chart
export const getOrgChart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rootId } = req.query;
    const orgChart = await employeeService.getOrgChart(rootId as string | undefined);

    const response: ApiResponse = {
      success: true,
      data: orgChart,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get analytics
export const getAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const analytics = await employeeService.getAnalytics();

    const response: ApiResponse = {
      success: true,
      data: analytics,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Search employees
export const searchEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q, limit } = req.query;
    const employees = await employeeService.searchEmployees(
      q as string,
      limit ? parseInt(limit as string, 10) : 10
    );

    const response: ApiResponse = {
      success: true,
      data: employees,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get employees by skill
export const getEmployeesBySkill = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { skill, minLevel } = req.query;
    const employees = await employeeService.getEmployeesBySkill(
      skill as string,
      minLevel as string | undefined
    );

    const response: ApiResponse = {
      success: true,
      data: employees,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Update skills
export const updateSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const skills = req.body.skills;
    const updatedBy = req.user?.id;

    // Validate each skill
    skills.forEach((skill: unknown) => addSkillSchema.parse(skill));

    const employee = await employeeService.updateSkills(id, skills, updatedBy);

    const response: ApiResponse = {
      success: true,
      data: employee,
      message: 'Skills updated successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Update leave balance
export const updateLeaveBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = updateLeaveBalanceSchema.parse(req.body);
    const updatedBy = req.user?.id;

    const employee = await employeeService.updateLeaveBalance(
      id,
      data.leave_type,
      {
        total_days: data.total_days,
        used_days: data.used_days,
        pending_days: data.pending_days,
        carry_forward_days: data.carry_forward_days,
      },
      updatedBy
    );

    const response: ApiResponse = {
      success: true,
      data: employee,
      message: 'Leave balance updated successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Add performance goal
export const addPerformanceGoal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = addPerformanceGoalSchema.parse(req.body);
    const addedBy = req.user?.id;

    const employee = await employeeService.addPerformanceGoal(id, data, addedBy);

    const response: ApiResponse = {
      success: true,
      data: employee,
      message: 'Performance goal added successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// Update performance goal
export const updatePerformanceGoal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, goalId } = req.params;
    const data = updatePerformanceGoalSchema.parse({ ...req.body, goal_id: goalId });
    const updatedBy = req.user?.id;

    const employee = await employeeService.updatePerformanceGoal(
      id,
      goalId,
      {
        title: data.title,
        description: data.description,
        target_date: data.target_date,
        status: data.status,
        progress_percentage: data.progress_percentage,
      },
      updatedBy
    );

    const response: ApiResponse = {
      success: true,
      data: employee,
      message: 'Performance goal updated successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ============================================
// SELF-SERVICE ROUTES
// ============================================

// Update own contact info
export const updateMyContactInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const employee = await employeeService.getEmployeeByUserId(userId);

    // Only allow updating contact-related fields
    const allowedFields = {
      personal_email: req.body.personal_email,
      personal_phone: req.body.personal_phone,
      address_line1: req.body.address_line1,
      address_line2: req.body.address_line2,
      city: req.body.city,
      state: req.body.state,
      postal_code: req.body.postal_code,
      country: req.body.country,
    };

    // Remove undefined values
    const updates = Object.fromEntries(
      Object.entries(allowedFields).filter(([_, v]) => v !== undefined)
    );

    const updatedEmployee = await employeeService.updateEmployee(
      employee.id,
      updates,
      userId
    );

    logger.info('Employee updated own contact info:', {
      employeeId: employee.id,
      userId,
    });

    const response: ApiResponse = {
      success: true,
      data: updatedEmployee,
      message: 'Contact information updated successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Update own emergency contacts
export const updateMyEmergencyContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const employee = await employeeService.getEmployeeByUserId(userId);

    const updatedEmployee = await employeeService.updateEmployee(
      employee.id,
      { emergency_contacts: req.body.emergency_contacts },
      userId
    );

    logger.info('Employee updated own emergency contacts:', {
      employeeId: employee.id,
      userId,
    });

    const response: ApiResponse = {
      success: true,
      data: updatedEmployee,
      message: 'Emergency contacts updated successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Update own goal progress
export const updateMyGoalProgress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { goalId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const employee = await employeeService.getEmployeeByUserId(userId);

    // Only allow updating progress_percentage and status for self-service
    const updates = {
      progress_percentage: req.body.progress_percentage,
      status: req.body.status,
    };

    const updatedEmployee = await employeeService.updatePerformanceGoal(
      employee.id,
      goalId,
      updates,
      userId
    );

    logger.info('Employee updated own goal progress:', {
      employeeId: employee.id,
      goalId,
      userId,
    });

    const response: ApiResponse = {
      success: true,
      data: updatedEmployee,
      message: 'Goal progress updated successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
