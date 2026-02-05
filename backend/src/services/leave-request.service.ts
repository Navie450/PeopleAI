import { AppDataSource } from '../config/database';
import { LeaveRequest, LeaveRequestStatus, LeaveType } from '../entities/LeaveRequest';
import { Employee } from '../entities/Employee';
import { User } from '../entities/User';
import { AuditLog } from '../entities/AuditLog';
import { IsNull, In, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { logger } from '../utils/logger';
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from '../utils/errors';
import {
  CreateLeaveRequestDto,
  UpdateLeaveRequestDto,
  ReviewLeaveRequestDto,
  ListLeaveRequestsQuery,
  LeaveRequestListItemResponse,
  LeaveRequestDetailResponse,
  LeaveBalanceSummary,
  TeamLeaveSummary,
} from '../dto/leave-request.dto';
import { PaginationMeta } from '../types';

class LeaveRequestService {
  // Get current user's leave requests
  async getMyLeaveRequests(
    userId: string,
    query: ListLeaveRequestsQuery
  ): Promise<{ leaveRequests: LeaveRequestListItemResponse[]; meta: PaginationMeta }> {
    const employeeRepository = AppDataSource.getRepository(Employee);
    const employee = await employeeRepository.findOne({
      where: { user_id: userId, deleted_at: IsNull() },
    });

    if (!employee) {
      throw new NotFoundError('Employee record not found');
    }

    return this.listLeaveRequests({ ...query, employee_id: employee.id });
  }

  // List leave requests (admin/manager view)
  async listLeaveRequests(
    query: ListLeaveRequestsQuery
  ): Promise<{ leaveRequests: LeaveRequestListItemResponse[]; meta: PaginationMeta }> {
    const leaveRequestRepository = AppDataSource.getRepository(LeaveRequest);
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const skip = (page - 1) * limit;

    const queryBuilder = leaveRequestRepository
      .createQueryBuilder('leaveRequest')
      .leftJoinAndSelect('leaveRequest.employee', 'employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('leaveRequest.reviewer', 'reviewer')
      .where('leaveRequest.deleted_at IS NULL');

    // Apply filters
    if (query.employee_id) {
      queryBuilder.andWhere('leaveRequest.employee_id = :employeeId', {
        employeeId: query.employee_id,
      });
    }

    if (query.leave_type) {
      queryBuilder.andWhere('leaveRequest.leave_type = :leaveType', {
        leaveType: query.leave_type,
      });
    }

    if (query.status) {
      queryBuilder.andWhere('leaveRequest.status = :status', {
        status: query.status,
      });
    }

    if (query.start_date_from) {
      queryBuilder.andWhere('leaveRequest.start_date >= :startDateFrom', {
        startDateFrom: query.start_date_from,
      });
    }

    if (query.start_date_to) {
      queryBuilder.andWhere('leaveRequest.start_date <= :startDateTo', {
        startDateTo: query.start_date_to,
      });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply sorting
    const sortColumn = `leaveRequest.${query.sort_by}`;
    queryBuilder.orderBy(sortColumn, query.sort_order === 'asc' ? 'ASC' : 'DESC');

    // Get paginated results
    const leaveRequests = await queryBuilder.skip(skip).take(limit).getMany();

    const responses: LeaveRequestListItemResponse[] = leaveRequests.map((lr) =>
      this.mapToListItemResponse(lr)
    );

    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return { leaveRequests: responses, meta };
  }

  // Get team's leave requests (for managers)
  async getTeamLeaveRequests(
    managerId: string,
    query: ListLeaveRequestsQuery
  ): Promise<{ leaveRequests: LeaveRequestListItemResponse[]; meta: PaginationMeta }> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    // Get manager's employee record
    const manager = await employeeRepository.findOne({
      where: { user_id: managerId, deleted_at: IsNull() },
    });

    if (!manager) {
      throw new NotFoundError('Manager employee record not found');
    }

    // Get direct reports
    const directReports = await employeeRepository.find({
      where: { manager_id: manager.id, deleted_at: IsNull() },
    });

    const directReportIds = directReports.map((dr) => dr.id);

    if (directReportIds.length === 0) {
      return {
        leaveRequests: [],
        meta: { page: 1, limit: query.limit || 10, total: 0, totalPages: 0 },
      };
    }

    const leaveRequestRepository = AppDataSource.getRepository(LeaveRequest);
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const skip = (page - 1) * limit;

    const queryBuilder = leaveRequestRepository
      .createQueryBuilder('leaveRequest')
      .leftJoinAndSelect('leaveRequest.employee', 'employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('leaveRequest.reviewer', 'reviewer')
      .where('leaveRequest.deleted_at IS NULL')
      .andWhere('leaveRequest.employee_id IN (:...directReportIds)', { directReportIds });

    if (query.status) {
      queryBuilder.andWhere('leaveRequest.status = :status', { status: query.status });
    }

    const total = await queryBuilder.getCount();
    const sortColumn = `leaveRequest.${query.sort_by}`;
    queryBuilder.orderBy(sortColumn, query.sort_order === 'asc' ? 'ASC' : 'DESC');

    const leaveRequests = await queryBuilder.skip(skip).take(limit).getMany();

    const responses: LeaveRequestListItemResponse[] = leaveRequests.map((lr) =>
      this.mapToListItemResponse(lr)
    );

    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return { leaveRequests: responses, meta };
  }

  // Get leave request by ID
  async getLeaveRequestById(id: string): Promise<LeaveRequestDetailResponse> {
    const leaveRequestRepository = AppDataSource.getRepository(LeaveRequest);

    const leaveRequest = await leaveRequestRepository
      .createQueryBuilder('leaveRequest')
      .leftJoinAndSelect('leaveRequest.employee', 'employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('leaveRequest.reviewer', 'reviewer')
      .where('leaveRequest.id = :id', { id })
      .andWhere('leaveRequest.deleted_at IS NULL')
      .getOne();

    if (!leaveRequest) {
      throw new NotFoundError('Leave request not found');
    }

    return this.mapToDetailResponse(leaveRequest);
  }

  // Create leave request
  async createLeaveRequest(
    userId: string,
    data: CreateLeaveRequestDto
  ): Promise<LeaveRequestDetailResponse> {
    const employeeRepository = AppDataSource.getRepository(Employee);
    const leaveRequestRepository = AppDataSource.getRepository(LeaveRequest);

    const employee = await employeeRepository.findOne({
      where: { user_id: userId, deleted_at: IsNull() },
    });

    if (!employee) {
      throw new NotFoundError('Employee record not found');
    }

    // Validate dates
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);

    if (startDate > endDate) {
      throw new ValidationError('Start date must be before end date');
    }

    if (startDate < new Date()) {
      throw new ValidationError('Cannot request leave for past dates');
    }

    // Check for overlapping requests
    const existingRequest = await leaveRequestRepository
      .createQueryBuilder('lr')
      .where('lr.employee_id = :employeeId', { employeeId: employee.id })
      .andWhere('lr.status IN (:...statuses)', {
        statuses: [LeaveRequestStatus.PENDING, LeaveRequestStatus.APPROVED],
      })
      .andWhere('lr.deleted_at IS NULL')
      .andWhere(
        '(lr.start_date <= :endDate AND lr.end_date >= :startDate)',
        { startDate: data.start_date, endDate: data.end_date }
      )
      .getOne();

    if (existingRequest) {
      throw new ValidationError('You have an overlapping leave request for these dates');
    }

    // Check leave balance
    const leaveBalance = employee.leave_balances?.find(
      (lb) => lb.leave_type.toLowerCase() === data.leave_type.toLowerCase()
    );

    if (leaveBalance) {
      const availableDays = leaveBalance.total_days - leaveBalance.used_days - leaveBalance.pending_days;
      if (data.total_days > availableDays) {
        throw new ValidationError(
          `Insufficient leave balance. Available: ${availableDays} days, Requested: ${data.total_days} days`
        );
      }
    }

    try {
      const leaveRequest = leaveRequestRepository.create({
        employee_id: employee.id,
        leave_type: data.leave_type,
        start_date: startDate,
        end_date: endDate,
        total_days: data.total_days,
        reason: data.reason,
        status: LeaveRequestStatus.PENDING,
      });

      await leaveRequestRepository.save(leaveRequest);

      // Update pending days in leave balance
      if (leaveBalance) {
        const updatedBalances = employee.leave_balances!.map((lb) => {
          if (lb.leave_type.toLowerCase() === data.leave_type.toLowerCase()) {
            return { ...lb, pending_days: lb.pending_days + data.total_days };
          }
          return lb;
        });
        employee.leave_balances = updatedBalances;
        await employeeRepository.save(employee);
      }

      // Create audit log
      await this.createAuditLog({
        user_id: userId,
        action: 'CREATE_LEAVE_REQUEST',
        resource_type: 'leave_request',
        resource_id: leaveRequest.id,
        changes: {
          leave_type: data.leave_type,
          start_date: data.start_date,
          end_date: data.end_date,
          total_days: data.total_days,
        },
      });

      logger.info('Leave request created:', { id: leaveRequest.id, userId });

      return this.getLeaveRequestById(leaveRequest.id);
    } catch (error) {
      logger.error('Failed to create leave request:', error);
      throw error;
    }
  }

  // Cancel leave request (by owner)
  async cancelLeaveRequest(
    id: string,
    userId: string
  ): Promise<LeaveRequestDetailResponse> {
    const employeeRepository = AppDataSource.getRepository(Employee);
    const leaveRequestRepository = AppDataSource.getRepository(LeaveRequest);

    const employee = await employeeRepository.findOne({
      where: { user_id: userId, deleted_at: IsNull() },
    });

    if (!employee) {
      throw new NotFoundError('Employee record not found');
    }

    const leaveRequest = await leaveRequestRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!leaveRequest) {
      throw new NotFoundError('Leave request not found');
    }

    if (leaveRequest.employee_id !== employee.id) {
      throw new ForbiddenError('You can only cancel your own leave requests');
    }

    if (leaveRequest.status !== LeaveRequestStatus.PENDING) {
      throw new ValidationError('Only pending leave requests can be cancelled');
    }

    leaveRequest.status = LeaveRequestStatus.CANCELLED;
    await leaveRequestRepository.save(leaveRequest);

    // Update pending days in leave balance
    const leaveBalance = employee.leave_balances?.find(
      (lb) => lb.leave_type.toLowerCase() === leaveRequest.leave_type.toLowerCase()
    );

    if (leaveBalance) {
      const updatedBalances = employee.leave_balances!.map((lb) => {
        if (lb.leave_type.toLowerCase() === leaveRequest.leave_type.toLowerCase()) {
          return { ...lb, pending_days: Math.max(0, lb.pending_days - Number(leaveRequest.total_days)) };
        }
        return lb;
      });
      employee.leave_balances = updatedBalances;
      await employeeRepository.save(employee);
    }

    await this.createAuditLog({
      user_id: userId,
      action: 'CANCEL_LEAVE_REQUEST',
      resource_type: 'leave_request',
      resource_id: id,
      changes: { status: 'cancelled' },
    });

    logger.info('Leave request cancelled:', { id, userId });

    return this.getLeaveRequestById(id);
  }

  // Approve leave request (admin/manager)
  async approveLeaveRequest(
    id: string,
    reviewerId: string,
    data?: ReviewLeaveRequestDto
  ): Promise<LeaveRequestDetailResponse> {
    const leaveRequestRepository = AppDataSource.getRepository(LeaveRequest);
    const employeeRepository = AppDataSource.getRepository(Employee);

    const leaveRequest = await leaveRequestRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['employee'],
    });

    if (!leaveRequest) {
      throw new NotFoundError('Leave request not found');
    }

    if (leaveRequest.status !== LeaveRequestStatus.PENDING) {
      throw new ValidationError('Only pending leave requests can be approved');
    }

    leaveRequest.status = LeaveRequestStatus.APPROVED;
    leaveRequest.reviewed_by = reviewerId;
    leaveRequest.reviewed_at = new Date();
    leaveRequest.reviewer_comments = data?.reviewer_comments;

    await leaveRequestRepository.save(leaveRequest);

    // Update leave balances: move from pending to used
    const employee = await employeeRepository.findOne({
      where: { id: leaveRequest.employee_id },
    });

    if (employee?.leave_balances) {
      const updatedBalances = employee.leave_balances.map((lb) => {
        if (lb.leave_type.toLowerCase() === leaveRequest.leave_type.toLowerCase()) {
          return {
            ...lb,
            pending_days: Math.max(0, lb.pending_days - Number(leaveRequest.total_days)),
            used_days: lb.used_days + Number(leaveRequest.total_days),
          };
        }
        return lb;
      });
      employee.leave_balances = updatedBalances;
      await employeeRepository.save(employee);
    }

    await this.createAuditLog({
      user_id: reviewerId,
      action: 'APPROVE_LEAVE_REQUEST',
      resource_type: 'leave_request',
      resource_id: id,
      changes: { status: 'approved', comments: data?.reviewer_comments },
    });

    logger.info('Leave request approved:', { id, reviewerId });

    return this.getLeaveRequestById(id);
  }

  // Reject leave request (admin/manager)
  async rejectLeaveRequest(
    id: string,
    reviewerId: string,
    data?: ReviewLeaveRequestDto
  ): Promise<LeaveRequestDetailResponse> {
    const leaveRequestRepository = AppDataSource.getRepository(LeaveRequest);
    const employeeRepository = AppDataSource.getRepository(Employee);

    const leaveRequest = await leaveRequestRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!leaveRequest) {
      throw new NotFoundError('Leave request not found');
    }

    if (leaveRequest.status !== LeaveRequestStatus.PENDING) {
      throw new ValidationError('Only pending leave requests can be rejected');
    }

    leaveRequest.status = LeaveRequestStatus.REJECTED;
    leaveRequest.reviewed_by = reviewerId;
    leaveRequest.reviewed_at = new Date();
    leaveRequest.reviewer_comments = data?.reviewer_comments;

    await leaveRequestRepository.save(leaveRequest);

    // Update leave balances: remove from pending
    const employee = await employeeRepository.findOne({
      where: { id: leaveRequest.employee_id },
    });

    if (employee?.leave_balances) {
      const updatedBalances = employee.leave_balances.map((lb) => {
        if (lb.leave_type.toLowerCase() === leaveRequest.leave_type.toLowerCase()) {
          return {
            ...lb,
            pending_days: Math.max(0, lb.pending_days - Number(leaveRequest.total_days)),
          };
        }
        return lb;
      });
      employee.leave_balances = updatedBalances;
      await employeeRepository.save(employee);
    }

    await this.createAuditLog({
      user_id: reviewerId,
      action: 'REJECT_LEAVE_REQUEST',
      resource_type: 'leave_request',
      resource_id: id,
      changes: { status: 'rejected', comments: data?.reviewer_comments },
    });

    logger.info('Leave request rejected:', { id, reviewerId });

    return this.getLeaveRequestById(id);
  }

  // Get leave balances for current user
  async getMyLeaveBalances(userId: string): Promise<LeaveBalanceSummary[]> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository.findOne({
      where: { user_id: userId, deleted_at: IsNull() },
    });

    if (!employee) {
      throw new NotFoundError('Employee record not found');
    }

    const balances = employee.leave_balances || [];

    return balances.map((lb) => ({
      leave_type: lb.leave_type,
      total_days: lb.total_days,
      used_days: lb.used_days,
      pending_days: lb.pending_days,
      available_days: lb.total_days - lb.used_days - lb.pending_days,
      carry_forward_days: lb.carry_forward_days,
    }));
  }

  // Get team leave summary for managers
  async getTeamLeaveSummary(managerId: string): Promise<TeamLeaveSummary> {
    const employeeRepository = AppDataSource.getRepository(Employee);
    const leaveRequestRepository = AppDataSource.getRepository(LeaveRequest);

    const manager = await employeeRepository.findOne({
      where: { user_id: managerId, deleted_at: IsNull() },
    });

    if (!manager) {
      throw new NotFoundError('Manager employee record not found');
    }

    const directReports = await employeeRepository.find({
      where: { manager_id: manager.id, deleted_at: IsNull() },
    });

    const directReportIds = directReports.map((dr) => dr.id);

    if (directReportIds.length === 0) {
      return { pending_requests: 0, upcoming_leaves: [], on_leave_today: [] };
    }

    // Count pending requests
    const pendingRequests = await leaveRequestRepository.count({
      where: {
        employee_id: In(directReportIds),
        status: LeaveRequestStatus.PENDING,
        deleted_at: IsNull(),
      },
    });

    // Get upcoming approved leaves (next 30 days)
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const upcomingLeaves = await leaveRequestRepository
      .createQueryBuilder('lr')
      .leftJoinAndSelect('lr.employee', 'employee')
      .where('lr.employee_id IN (:...directReportIds)', { directReportIds })
      .andWhere('lr.status = :status', { status: LeaveRequestStatus.APPROVED })
      .andWhere('lr.start_date >= :today', { today: today.toISOString().split('T')[0] })
      .andWhere('lr.start_date <= :thirtyDays', { thirtyDays: thirtyDaysFromNow.toISOString().split('T')[0] })
      .andWhere('lr.deleted_at IS NULL')
      .orderBy('lr.start_date', 'ASC')
      .take(10)
      .getMany();

    // Get employees on leave today
    const todayStr = today.toISOString().split('T')[0];
    const onLeaveToday = await leaveRequestRepository
      .createQueryBuilder('lr')
      .leftJoinAndSelect('lr.employee', 'employee')
      .where('lr.employee_id IN (:...directReportIds)', { directReportIds })
      .andWhere('lr.status = :status', { status: LeaveRequestStatus.APPROVED })
      .andWhere('lr.start_date <= :today', { today: todayStr })
      .andWhere('lr.end_date >= :today', { today: todayStr })
      .andWhere('lr.deleted_at IS NULL')
      .getMany();

    return {
      pending_requests: pendingRequests,
      upcoming_leaves: upcomingLeaves.map((lr) => ({
        employee_id: lr.employee?.employee_id || '',
        employee_name: lr.employee ? `${lr.employee.first_name} ${lr.employee.last_name}` : '',
        leave_type: lr.leave_type,
        start_date: lr.start_date,
        end_date: lr.end_date,
        total_days: Number(lr.total_days),
      })),
      on_leave_today: onLeaveToday.map((lr) => ({
        employee_id: lr.employee?.employee_id || '',
        employee_name: lr.employee ? `${lr.employee.first_name} ${lr.employee.last_name}` : '',
        leave_type: lr.leave_type,
        end_date: lr.end_date,
      })),
    };
  }

  private async createAuditLog(data: {
    user_id?: string;
    action: string;
    resource_type: string;
    resource_id?: string;
    changes?: Record<string, unknown>;
  }): Promise<void> {
    const auditLogRepository = AppDataSource.getRepository(AuditLog);
    const auditLog = auditLogRepository.create(data);
    await auditLogRepository.save(auditLog);
  }

  private mapToListItemResponse(leaveRequest: LeaveRequest): LeaveRequestListItemResponse {
    return {
      id: leaveRequest.id,
      employee_id: leaveRequest.employee_id,
      employee: leaveRequest.employee
        ? {
            id: leaveRequest.employee.id,
            full_name: `${leaveRequest.employee.first_name} ${leaveRequest.employee.last_name}`,
            employee_id: leaveRequest.employee.employee_id,
            department: leaveRequest.employee.department
              ? {
                  id: leaveRequest.employee.department.id,
                  name: leaveRequest.employee.department.name,
                }
              : undefined,
          }
        : undefined,
      leave_type: leaveRequest.leave_type,
      start_date: leaveRequest.start_date,
      end_date: leaveRequest.end_date,
      total_days: Number(leaveRequest.total_days),
      reason: leaveRequest.reason,
      status: leaveRequest.status,
      reviewed_by: leaveRequest.reviewed_by,
      reviewer: leaveRequest.reviewer
        ? {
            id: leaveRequest.reviewer.id,
            full_name: `${leaveRequest.reviewer.first_name || ''} ${leaveRequest.reviewer.last_name || ''}`.trim(),
          }
        : undefined,
      reviewed_at: leaveRequest.reviewed_at,
      reviewer_comments: leaveRequest.reviewer_comments,
      created_at: leaveRequest.created_at,
      updated_at: leaveRequest.updated_at,
    };
  }

  private mapToDetailResponse(leaveRequest: LeaveRequest): LeaveRequestDetailResponse {
    return this.mapToListItemResponse(leaveRequest);
  }
}

export const leaveRequestService = new LeaveRequestService();
