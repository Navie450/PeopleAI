import { Request, Response, NextFunction } from 'express';
import { leaveRequestService } from '../services/leave-request.service';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';
import {
  createLeaveRequestSchema,
  reviewLeaveRequestSchema,
  listLeaveRequestsQuerySchema,
} from '../dto/leave-request.dto';

// Get current user's leave requests
export const getMyLeaveRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const query = listLeaveRequestsQuerySchema.parse(req.query);

    let leaveRequests: any[] = [];
    let meta = { page: 1, limit: 10, total: 0, totalPages: 0 };

    try {
      const result = await leaveRequestService.getMyLeaveRequests(userId, query);
      leaveRequests = result.leaveRequests;
      meta = result.meta;
    } catch (err: any) {
      // If no employee record exists, return empty list
      if (err.name === 'NotFoundError') {
        const response: ApiResponse = {
          success: true,
          data: [],
          meta: { pagination: meta },
          message: 'No employee profile linked to this user account',
        };
        return res.status(200).json(response);
      }
      throw err;
    }

    const response: ApiResponse = {
      success: true,
      data: leaveRequests,
      meta: { pagination: meta },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get current user's leave balances
export const getMyLeaveBalances = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    let balances: any[] = [];

    try {
      balances = await leaveRequestService.getMyLeaveBalances(userId);
    } catch (err: any) {
      // If no employee record exists, return empty balances
      if (err.name === 'NotFoundError') {
        const response: ApiResponse = {
          success: true,
          data: [],
          message: 'No employee profile linked to this user account',
        };
        return res.status(200).json(response);
      }
      throw err;
    }

    const response: ApiResponse = {
      success: true,
      data: balances,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Create leave request
export const createLeaveRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const data = createLeaveRequestSchema.parse(req.body);
    const leaveRequest = await leaveRequestService.createLeaveRequest(userId, data);

    logger.info('Leave request created via API:', {
      id: leaveRequest.id,
      userId,
    });

    const response: ApiResponse = {
      success: true,
      data: leaveRequest,
      message: 'Leave request submitted successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// Cancel leave request
export const cancelLeaveRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const leaveRequest = await leaveRequestService.cancelLeaveRequest(id, userId);

    logger.info('Leave request cancelled via API:', {
      id,
      userId,
    });

    const response: ApiResponse = {
      success: true,
      data: leaveRequest,
      message: 'Leave request cancelled successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// List all leave requests (admin/manager)
export const listLeaveRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = listLeaveRequestsQuerySchema.parse(req.query);
    const { leaveRequests, meta } = await leaveRequestService.listLeaveRequests(query);

    const response: ApiResponse = {
      success: true,
      data: leaveRequests,
      meta: { pagination: meta },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get team's leave requests (manager)
export const getTeamLeaveRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const query = listLeaveRequestsQuerySchema.parse(req.query);
    const { leaveRequests, meta } = await leaveRequestService.getTeamLeaveRequests(userId, query);

    const response: ApiResponse = {
      success: true,
      data: leaveRequests,
      meta: { pagination: meta },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get team leave summary (manager)
export const getTeamLeaveSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const summary = await leaveRequestService.getTeamLeaveSummary(userId);

    const response: ApiResponse = {
      success: true,
      data: summary,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get leave request by ID
export const getLeaveRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const leaveRequest = await leaveRequestService.getLeaveRequestById(id);

    const response: ApiResponse = {
      success: true,
      data: leaveRequest,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Approve leave request
export const approveLeaveRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const reviewerId = req.user?.id;
    if (!reviewerId) {
      throw new Error('User not authenticated');
    }

    const data = reviewLeaveRequestSchema.parse(req.body);
    const leaveRequest = await leaveRequestService.approveLeaveRequest(id, reviewerId, data);

    logger.info('Leave request approved via API:', {
      id,
      reviewerId,
    });

    const response: ApiResponse = {
      success: true,
      data: leaveRequest,
      message: 'Leave request approved successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Reject leave request
export const rejectLeaveRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const reviewerId = req.user?.id;
    if (!reviewerId) {
      throw new Error('User not authenticated');
    }

    const data = reviewLeaveRequestSchema.parse(req.body);
    const leaveRequest = await leaveRequestService.rejectLeaveRequest(id, reviewerId, data);

    logger.info('Leave request rejected via API:', {
      id,
      reviewerId,
    });

    const response: ApiResponse = {
      success: true,
      data: leaveRequest,
      message: 'Leave request rejected',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
