import { Request, Response, NextFunction } from 'express';
import { announcementService } from '../services/announcement.service';
import { employeeService } from '../services/employee.service';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  listAnnouncementsQuerySchema,
  togglePinSchema,
} from '../dto/announcement.dto';

// List announcements (for authenticated users)
export const listAnnouncements = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = listAnnouncementsQuerySchema.parse(req.query);
    const userId = req.user?.id;

    // Get user's department for filtering
    let userDepartmentId: string | undefined;
    if (userId) {
      try {
        const employee = await employeeService.getEmployeeByUserId(userId);
        userDepartmentId = employee.department?.id;
      } catch {
        // User may not have an employee record
      }
    }

    const { announcements, meta } = await announcementService.listAnnouncements(query, userDepartmentId);

    const response: ApiResponse = {
      success: true,
      data: announcements,
      meta: { pagination: meta },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// List all announcements for admin
export const listAllAnnouncements = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = listAnnouncementsQuerySchema.parse(req.query);
    const { announcements, meta } = await announcementService.listAllAnnouncements(query);

    const response: ApiResponse = {
      success: true,
      data: announcements,
      meta: { pagination: meta },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get announcement by ID
export const getAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const announcement = await announcementService.getAnnouncementById(id);

    const response: ApiResponse = {
      success: true,
      data: announcement,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Create announcement (admin only)
export const createAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createdBy = req.user?.id;
    if (!createdBy) {
      throw new Error('User not authenticated');
    }

    const data = createAnnouncementSchema.parse(req.body);
    const announcement = await announcementService.createAnnouncement(data, createdBy);

    logger.info('Announcement created via API:', {
      id: announcement.id,
      createdBy,
    });

    const response: ApiResponse = {
      success: true,
      data: announcement,
      message: 'Announcement created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// Update announcement (admin only)
export const updateAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updatedBy = req.user?.id;
    if (!updatedBy) {
      throw new Error('User not authenticated');
    }

    const data = updateAnnouncementSchema.parse(req.body);
    const announcement = await announcementService.updateAnnouncement(id, data, updatedBy);

    logger.info('Announcement updated via API:', {
      id,
      updatedBy,
    });

    const response: ApiResponse = {
      success: true,
      data: announcement,
      message: 'Announcement updated successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Delete announcement (admin only)
export const deleteAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedBy = req.user?.id;
    if (!deletedBy) {
      throw new Error('User not authenticated');
    }

    await announcementService.deleteAnnouncement(id, deletedBy);

    logger.info('Announcement deleted via API:', {
      id,
      deletedBy,
    });

    const response: ApiResponse = {
      success: true,
      message: 'Announcement deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Toggle pin status (admin only)
export const togglePin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updatedBy = req.user?.id;
    if (!updatedBy) {
      throw new Error('User not authenticated');
    }

    const data = togglePinSchema.parse(req.body);
    const announcement = await announcementService.togglePin(id, data, updatedBy);

    logger.info(`Announcement ${data.is_pinned ? 'pinned' : 'unpinned'} via API:`, {
      id,
      updatedBy,
    });

    const response: ApiResponse = {
      success: true,
      data: announcement,
      message: `Announcement ${data.is_pinned ? 'pinned' : 'unpinned'} successfully`,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
