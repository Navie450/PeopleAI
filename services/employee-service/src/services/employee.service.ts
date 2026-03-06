import { AppDataSource } from '../config/database';
import { Employee, EmploymentStatus } from '../entities/Employee';
import { Department } from '../entities/Department';
import { AuditLog } from '../entities/AuditLog';
import { IsNull, In, Between, Like, ILike } from 'typeorm';
import { logger } from '../utils/logger';
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from '../utils/errors';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  ListEmployeesQuery,
  BulkUpdateEmployeesDto,
  TransferEmployeeDto,
  PromoteEmployeeDto,
  TerminateEmployeeDto,
  EmployeeListItemResponse,
  EmployeeDetailResponse,
  EmployeeAnalytics,
  OrgChartNode,
} from '../dto/employee.dto';
import { PaginationMeta } from '../types';
import { v4 as uuidv4 } from 'uuid';

class EmployeeService {
  private async generateEmployeeId(): Promise<string> {
    const employeeRepository = AppDataSource.getRepository(Employee);
    const lastEmployee = await employeeRepository
      .createQueryBuilder('employee')
      .orderBy('employee.created_at', 'DESC')
      .getOne();

    if (!lastEmployee) {
      return 'EMP001';
    }

    const lastNumber = parseInt(lastEmployee.employee_id.replace('EMP', ''), 10);
    const nextNumber = lastNumber + 1;
    return `EMP${nextNumber.toString().padStart(3, '0')}`;
  }

  async listEmployees(
    query: ListEmployeesQuery
  ): Promise<{ employees: EmployeeListItemResponse[]; meta: PaginationMeta }> {
    const employeeRepository = AppDataSource.getRepository(Employee);
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const skip = (page - 1) * limit;

    const queryBuilder = employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.manager', 'manager')
      .where('employee.deleted_at IS NULL');

    // Apply filters
    if (query.search) {
      queryBuilder.andWhere(
        '(employee.first_name ILIKE :search OR employee.last_name ILIKE :search OR employee.work_email ILIKE :search OR employee.employee_id ILIKE :search OR employee.job_title ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    if (query.department_id) {
      queryBuilder.andWhere('employee.department_id = :departmentId', {
        departmentId: query.department_id,
      });
    }

    if (query.manager_id) {
      queryBuilder.andWhere('employee.manager_id = :managerId', {
        managerId: query.manager_id,
      });
    }

    if (query.employment_status) {
      queryBuilder.andWhere('employee.employment_status = :status', {
        status: query.employment_status,
      });
    }

    if (query.employment_type) {
      queryBuilder.andWhere('employee.employment_type = :type', {
        type: query.employment_type,
      });
    }

    if (query.job_title) {
      queryBuilder.andWhere('employee.job_title ILIKE :jobTitle', {
        jobTitle: `%${query.job_title}%`,
      });
    }

    if (query.job_level) {
      queryBuilder.andWhere('employee.job_level = :jobLevel', {
        jobLevel: query.job_level,
      });
    }

    if (query.work_location) {
      queryBuilder.andWhere('employee.work_location ILIKE :workLocation', {
        workLocation: `%${query.work_location}%`,
      });
    }

    if (query.is_remote !== undefined) {
      queryBuilder.andWhere('employee.is_remote = :isRemote', {
        isRemote: query.is_remote,
      });
    }

    if (query.hire_date_from) {
      queryBuilder.andWhere('employee.hire_date >= :hireDateFrom', {
        hireDateFrom: query.hire_date_from,
      });
    }

    if (query.hire_date_to) {
      queryBuilder.andWhere('employee.hire_date <= :hireDateTo', {
        hireDateTo: query.hire_date_to,
      });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply sorting
    const sortColumn = query.sort_by === 'department' ? 'department.name' : `employee.${query.sort_by}`;
    queryBuilder.orderBy(sortColumn, query.sort_order === 'asc' ? 'ASC' : 'DESC');

    // Get paginated results
    const employees = await queryBuilder.skip(skip).take(limit).getMany();

    const employeeResponses: EmployeeListItemResponse[] = employees.map((emp) =>
      this.mapToListItemResponse(emp)
    );

    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return { employees: employeeResponses, meta };
  }

  async getEmployeeById(employeeId: string): Promise<EmployeeDetailResponse> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.manager', 'manager')
      .leftJoinAndSelect('employee.direct_reports', 'direct_reports')
      .where('employee.id = :employeeId', { employeeId })
      .andWhere('employee.deleted_at IS NULL')
      .getOne();

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    return this.mapToDetailResponse(employee);
  }

  async getEmployeeByUserId(userId: string): Promise<EmployeeDetailResponse> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.manager', 'manager')
      .leftJoinAndSelect('employee.direct_reports', 'direct_reports')
      .where('employee.user_id = :userId', { userId })
      .andWhere('employee.deleted_at IS NULL')
      .getOne();

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    return this.mapToDetailResponse(employee);
  }

  async createEmployee(
    employeeData: CreateEmployeeDto,
    createdBy?: string
  ): Promise<EmployeeDetailResponse> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    // Check if user already has an employee record
    const existingEmployee = await employeeRepository.findOne({
      where: { user_id: employeeData.user_id },
    });

    if (existingEmployee) {
      throw new ConflictError('User already has an employee record');
    }

    // Check if work email is already in use
    const emailExists = await employeeRepository.findOne({
      where: { work_email: employeeData.work_email },
    });

    if (emailExists) {
      throw new ConflictError('Work email already in use');
    }

    // Validate department if provided
    if (employeeData.department_id) {
      const departmentRepository = AppDataSource.getRepository(Department);
      const department = await departmentRepository.findOne({
        where: { id: employeeData.department_id, deleted_at: IsNull() },
      });
      if (!department) {
        throw new ValidationError('Invalid department ID');
      }
    }

    // Validate manager if provided
    if (employeeData.manager_id) {
      const manager = await employeeRepository.findOne({
        where: { id: employeeData.manager_id, deleted_at: IsNull() },
      });
      if (!manager) {
        throw new ValidationError('Invalid manager ID');
      }
    }

    try {
      const employeeId = await this.generateEmployeeId();

      const employee = employeeRepository.create({
        ...employeeData,
        employee_id: employeeId,
        hire_date: new Date(employeeData.hire_date),
        probation_end_date: employeeData.probation_end_date
          ? new Date(employeeData.probation_end_date)
          : undefined,
        date_of_birth: employeeData.date_of_birth
          ? new Date(employeeData.date_of_birth)
          : undefined,
      });

      await employeeRepository.save(employee);

      // Create audit log
      await this.createAuditLog({
        user_id: createdBy,
        action: 'CREATE_EMPLOYEE',
        resource_type: 'employee',
        resource_id: employee.id,
        changes: {
          created: {
            employee_id: employee.employee_id,
            work_email: employee.work_email,
            job_title: employee.job_title,
          },
        },
      });

      logger.info('Employee created successfully:', {
        employeeId: employee.id,
        employeeCode: employee.employee_id,
      });

      return this.getEmployeeById(employee.id);
    } catch (error) {
      logger.error('Failed to create employee:', error);
      throw error;
    }
  }

  async updateEmployee(
    employeeId: string,
    employeeData: UpdateEmployeeDto,
    updatedBy?: string
  ): Promise<EmployeeDetailResponse> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository.findOne({
      where: { id: employeeId, deleted_at: IsNull() },
    });

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const changes: Record<string, unknown> = {};

    // Check for email conflicts
    if (employeeData.work_email && employeeData.work_email !== employee.work_email) {
      const emailExists = await employeeRepository.findOne({
        where: { work_email: employeeData.work_email },
      });
      if (emailExists) {
        throw new ConflictError('Work email already in use');
      }
      changes.work_email = { from: employee.work_email, to: employeeData.work_email };
    }

    // Validate department if being changed
    if (employeeData.department_id && employeeData.department_id !== employee.department_id) {
      const departmentRepository = AppDataSource.getRepository(Department);
      const department = await departmentRepository.findOne({
        where: { id: employeeData.department_id, deleted_at: IsNull() },
      });
      if (!department) {
        throw new ValidationError('Invalid department ID');
      }
      changes.department_id = { from: employee.department_id, to: employeeData.department_id };
    }

    // Validate manager if being changed
    if (employeeData.manager_id && employeeData.manager_id !== employee.manager_id) {
      if (employeeData.manager_id === employeeId) {
        throw new ValidationError('Employee cannot be their own manager');
      }
      const manager = await employeeRepository.findOne({
        where: { id: employeeData.manager_id, deleted_at: IsNull() },
      });
      if (!manager) {
        throw new ValidationError('Invalid manager ID');
      }
      changes.manager_id = { from: employee.manager_id, to: employeeData.manager_id };
    }

    // Handle date conversions
    const updateData: Partial<Employee> = { ...employeeData } as Partial<Employee>;
    if (employeeData.date_of_birth) {
      updateData.date_of_birth = new Date(employeeData.date_of_birth);
    }
    if (employeeData.probation_end_date) {
      updateData.probation_end_date = new Date(employeeData.probation_end_date);
    }
    if (employeeData.termination_date) {
      updateData.termination_date = new Date(employeeData.termination_date);
    }
    if (employeeData.last_review_date) {
      updateData.last_review_date = new Date(employeeData.last_review_date);
    }
    if (employeeData.next_review_date) {
      updateData.next_review_date = new Date(employeeData.next_review_date);
    }

    // Update employee
    Object.assign(employee, updateData);
    await employeeRepository.save(employee);

    // Create audit log
    if (Object.keys(changes).length > 0) {
      await this.createAuditLog({
        user_id: updatedBy,
        action: 'UPDATE_EMPLOYEE',
        resource_type: 'employee',
        resource_id: employeeId,
        changes,
      });
    }

    logger.info('Employee updated successfully:', { employeeId });

    return this.getEmployeeById(employeeId);
  }

  async deleteEmployee(employeeId: string, deletedBy?: string): Promise<void> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository.findOne({
      where: { id: employeeId, deleted_at: IsNull() },
    });

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // Soft delete
    employee.deleted_at = new Date();
    employee.employment_status = EmploymentStatus.TERMINATED;
    await employeeRepository.save(employee);

    // Create audit log
    await this.createAuditLog({
      user_id: deletedBy,
      action: 'DELETE_EMPLOYEE',
      resource_type: 'employee',
      resource_id: employeeId,
      changes: {
        deleted: {
          employee_id: employee.employee_id,
          work_email: employee.work_email,
        },
      },
    });

    logger.info('Employee deleted successfully:', { employeeId });
  }

  async bulkUpdateEmployees(
    bulkData: BulkUpdateEmployeesDto,
    updatedBy?: string
  ): Promise<{ updated: number; failed: string[] }> {
    const employeeRepository = AppDataSource.getRepository(Employee);
    let updated = 0;
    const failed: string[] = [];

    for (const empId of bulkData.employee_ids) {
      try {
        const employee = await employeeRepository.findOne({
          where: { id: empId, deleted_at: IsNull() },
        });

        if (!employee) {
          failed.push(empId);
          continue;
        }

        Object.assign(employee, bulkData.updates);
        await employeeRepository.save(employee);
        updated++;
      } catch (error) {
        logger.error(`Failed to update employee ${empId}:`, error);
        failed.push(empId);
      }
    }

    // Create audit log for bulk operation
    await this.createAuditLog({
      user_id: updatedBy,
      action: 'BULK_UPDATE_EMPLOYEES',
      resource_type: 'employee',
      changes: {
        updated_count: updated,
        failed_count: failed.length,
        updates: bulkData.updates,
      },
    });

    logger.info('Bulk update completed:', { updated, failed: failed.length });

    return { updated, failed };
  }

  async transferEmployee(
    employeeId: string,
    transferData: TransferEmployeeDto,
    transferredBy?: string
  ): Promise<EmployeeDetailResponse> {
    const employeeRepository = AppDataSource.getRepository(Employee);
    const departmentRepository = AppDataSource.getRepository(Department);

    const employee = await employeeRepository.findOne({
      where: { id: employeeId, deleted_at: IsNull() },
      relations: ['department'],
    });

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // Validate new department
    const newDepartment = await departmentRepository.findOne({
      where: { id: transferData.new_department_id, deleted_at: IsNull() },
    });

    if (!newDepartment) {
      throw new ValidationError('Invalid department ID');
    }

    // Store employment history
    const historyEntry = {
      job_title: employee.job_title,
      department: employee.department?.name || 'Unknown',
      start_date: employee.hire_date.toISOString(),
      end_date: transferData.effective_date,
      reason_for_change: transferData.reason || 'Department transfer',
    };

    employee.employment_history = [
      ...(employee.employment_history || []),
      historyEntry,
    ];

    // Apply transfer
    employee.department_id = transferData.new_department_id;
    if (transferData.new_job_title) employee.job_title = transferData.new_job_title;
    if (transferData.new_job_level) employee.job_level = transferData.new_job_level;
    if (transferData.new_manager_id) employee.manager_id = transferData.new_manager_id;
    if (transferData.new_salary) employee.base_salary = transferData.new_salary;

    await employeeRepository.save(employee);

    // Create audit log
    await this.createAuditLog({
      user_id: transferredBy,
      action: 'TRANSFER_EMPLOYEE',
      resource_type: 'employee',
      resource_id: employeeId,
      changes: {
        transfer: {
          from_department: employee.department?.name,
          to_department: newDepartment.name,
          effective_date: transferData.effective_date,
          reason: transferData.reason,
        },
      },
    });

    logger.info('Employee transferred:', { employeeId, newDepartment: newDepartment.name });

    return this.getEmployeeById(employeeId);
  }

  async promoteEmployee(
    employeeId: string,
    promoteData: PromoteEmployeeDto,
    promotedBy?: string
  ): Promise<EmployeeDetailResponse> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository.findOne({
      where: { id: employeeId, deleted_at: IsNull() },
      relations: ['department'],
    });

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // Store employment history
    const historyEntry = {
      job_title: employee.job_title,
      department: employee.department?.name || 'Unknown',
      start_date: employee.hire_date.toISOString(),
      end_date: promoteData.effective_date,
      reason_for_change: promoteData.reason || 'Promotion',
    };

    employee.employment_history = [
      ...(employee.employment_history || []),
      historyEntry,
    ];

    // Apply promotion
    const previousTitle = employee.job_title;
    employee.job_title = promoteData.new_job_title;
    if (promoteData.new_job_level) employee.job_level = promoteData.new_job_level;
    if (promoteData.new_salary) employee.base_salary = promoteData.new_salary;

    await employeeRepository.save(employee);

    // Create audit log
    await this.createAuditLog({
      user_id: promotedBy,
      action: 'PROMOTE_EMPLOYEE',
      resource_type: 'employee',
      resource_id: employeeId,
      changes: {
        promotion: {
          from_title: previousTitle,
          to_title: promoteData.new_job_title,
          effective_date: promoteData.effective_date,
          salary_change: promoteData.new_salary,
        },
      },
    });

    logger.info('Employee promoted:', {
      employeeId,
      from: previousTitle,
      to: promoteData.new_job_title,
    });

    return this.getEmployeeById(employeeId);
  }

  async terminateEmployee(
    employeeId: string,
    terminateData: TerminateEmployeeDto,
    terminatedBy?: string
  ): Promise<EmployeeDetailResponse> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository.findOne({
      where: { id: employeeId, deleted_at: IsNull() },
    });

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // Update employee status
    employee.employment_status = EmploymentStatus.TERMINATED;
    employee.termination_date = new Date(terminateData.termination_date);
    employee.termination_reason = terminateData.termination_reason;
    employee.metadata = {
      ...employee.metadata,
      termination_details: {
        last_working_date: terminateData.last_working_date,
        eligible_for_rehire: terminateData.eligible_for_rehire,
        exit_interview_completed: terminateData.exit_interview_completed,
        notes: terminateData.notes,
        terminated_by: terminatedBy,
        terminated_at: new Date().toISOString(),
      },
    };

    await employeeRepository.save(employee);

    // Create audit log
    await this.createAuditLog({
      user_id: terminatedBy,
      action: 'TERMINATE_EMPLOYEE',
      resource_type: 'employee',
      resource_id: employeeId,
      changes: {
        termination: {
          date: terminateData.termination_date,
          reason: terminateData.termination_reason,
        },
      },
    });

    logger.info('Employee terminated:', { employeeId });

    return this.getEmployeeById(employeeId);
  }

  async getDirectReports(managerId: string): Promise<EmployeeListItemResponse[]> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const directReports = await employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .where('employee.manager_id = :managerId', { managerId })
      .andWhere('employee.deleted_at IS NULL')
      .orderBy('employee.first_name', 'ASC')
      .getMany();

    return directReports.map((emp) => this.mapToListItemResponse(emp));
  }

  async getOrgChart(rootEmployeeId?: string): Promise<OrgChartNode[]> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    // Get all active employees
    const employees = await employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .where('employee.deleted_at IS NULL')
      .andWhere('employee.employment_status = :status', { status: EmploymentStatus.ACTIVE })
      .getMany();

    // Build hierarchy
    const buildTree = (managerId: string | null): OrgChartNode[] => {
      return employees
        .filter((emp) => emp.manager_id === managerId)
        .map((emp) => ({
          id: emp.id,
          employee_id: emp.employee_id,
          full_name: `${emp.first_name} ${emp.last_name}`,
          job_title: emp.job_title,
          department: emp.department?.name,
          profile_picture_url: emp.profile_picture_url,
          direct_reports: buildTree(emp.id),
        }));
    };

    if (rootEmployeeId) {
      const rootEmployee = employees.find((e) => e.id === rootEmployeeId);
      if (!rootEmployee) {
        throw new NotFoundError('Employee not found');
      }
      return [{
        id: rootEmployee.id,
        employee_id: rootEmployee.employee_id,
        full_name: `${rootEmployee.first_name} ${rootEmployee.last_name}`,
        job_title: rootEmployee.job_title,
        department: rootEmployee.department?.name,
        profile_picture_url: rootEmployee.profile_picture_url,
        direct_reports: buildTree(rootEmployee.id),
      }];
    }

    // Return top-level employees (no manager)
    return buildTree(null as unknown as string);
  }

  async getAnalytics(): Promise<EmployeeAnalytics> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Total and active employees
    const totalEmployees = await employeeRepository.count({
      where: { deleted_at: IsNull() },
    });

    const activeEmployees = await employeeRepository.count({
      where: { deleted_at: IsNull(), employment_status: EmploymentStatus.ACTIVE },
    });

    // By status
    const byStatus = await employeeRepository
      .createQueryBuilder('employee')
      .select('employee.employment_status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('employee.deleted_at IS NULL')
      .groupBy('employee.employment_status')
      .getRawMany();

    // By type
    const byType = await employeeRepository
      .createQueryBuilder('employee')
      .select('employee.employment_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('employee.deleted_at IS NULL')
      .groupBy('employee.employment_type')
      .getRawMany();

    // By department
    const byDepartment = await employeeRepository
      .createQueryBuilder('employee')
      .leftJoin('employee.department', 'department')
      .select('department.id', 'department_id')
      .addSelect('department.name', 'department_name')
      .addSelect('COUNT(*)', 'count')
      .where('employee.deleted_at IS NULL')
      .groupBy('department.id')
      .addGroupBy('department.name')
      .getRawMany();

    // By location
    const byLocation = await employeeRepository
      .createQueryBuilder('employee')
      .select('employee.work_location', 'location')
      .addSelect('COUNT(*)', 'count')
      .where('employee.deleted_at IS NULL')
      .andWhere('employee.work_location IS NOT NULL')
      .groupBy('employee.work_location')
      .getRawMany();

    // Remote vs onsite
    const remoteCount = await employeeRepository.count({
      where: { deleted_at: IsNull(), is_remote: true },
    });

    // Average tenure
    const tenureResult = await employeeRepository
      .createQueryBuilder('employee')
      .select('AVG(EXTRACT(YEAR FROM AGE(COALESCE(employee.termination_date, NOW()), employee.hire_date)))', 'avg_tenure')
      .where('employee.deleted_at IS NULL')
      .getRawOne();

    // New hires this month
    const newHiresThisMonth = await employeeRepository
      .createQueryBuilder('employee')
      .where('employee.deleted_at IS NULL')
      .andWhere('employee.hire_date >= :startOfMonth', { startOfMonth })
      .andWhere('employee.hire_date <= :endOfMonth', { endOfMonth })
      .getCount();

    // Terminations this month
    const terminationsThisMonth = await employeeRepository
      .createQueryBuilder('employee')
      .where('employee.termination_date >= :startOfMonth', { startOfMonth })
      .andWhere('employee.termination_date <= :endOfMonth', { endOfMonth })
      .getCount();

    // Upcoming reviews (next 30 days)
    const upcomingReviews = await employeeRepository
      .createQueryBuilder('employee')
      .where('employee.deleted_at IS NULL')
      .andWhere('employee.next_review_date <= :thirtyDays', { thirtyDays: thirtyDaysFromNow })
      .andWhere('employee.next_review_date >= :now', { now })
      .getCount();

    // Probation ending soon (next 30 days)
    const probationEndingSoon = await employeeRepository
      .createQueryBuilder('employee')
      .where('employee.deleted_at IS NULL')
      .andWhere('employee.employment_status = :status', { status: EmploymentStatus.PROBATION })
      .andWhere('employee.probation_end_date <= :thirtyDays', { thirtyDays: thirtyDaysFromNow })
      .andWhere('employee.probation_end_date >= :now', { now })
      .getCount();

    return {
      total_employees: totalEmployees,
      active_employees: activeEmployees,
      by_status: byStatus.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count, 10);
        return acc;
      }, {} as Record<string, number>),
      by_type: byType.reduce((acc, item) => {
        acc[item.type] = parseInt(item.count, 10);
        return acc;
      }, {} as Record<string, number>),
      by_department: byDepartment.map((item) => ({
        department_id: item.department_id,
        department_name: item.department_name || 'Unassigned',
        count: parseInt(item.count, 10),
      })),
      by_location: byLocation.map((item) => ({
        location: item.location,
        count: parseInt(item.count, 10),
      })),
      remote_vs_onsite: {
        remote: remoteCount,
        onsite: totalEmployees - remoteCount,
      },
      average_tenure_years: parseFloat(tenureResult?.avg_tenure || '0'),
      new_hires_this_month: newHiresThisMonth,
      terminations_this_month: terminationsThisMonth,
      upcoming_reviews: upcomingReviews,
      probation_ending_soon: probationEndingSoon,
    };
  }

  async searchEmployees(searchTerm: string, limit: number = 10): Promise<EmployeeListItemResponse[]> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employees = await employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.manager', 'manager')
      .where('employee.deleted_at IS NULL')
      .andWhere(
        '(employee.first_name ILIKE :search OR employee.last_name ILIKE :search OR employee.work_email ILIKE :search OR employee.employee_id ILIKE :search)',
        { search: `%${searchTerm}%` }
      )
      .take(limit)
      .getMany();

    return employees.map((emp) => this.mapToListItemResponse(emp));
  }

  async getEmployeesBySkill(
    skillName: string,
    minLevel?: string
  ): Promise<EmployeeListItemResponse[]> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    let query = employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.manager', 'manager')
      .where('employee.deleted_at IS NULL')
      .andWhere("employee.skills @> :skill", { skill: JSON.stringify([{ name: skillName }]) });

    if (minLevel) {
      const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
      const minLevelIndex = levelOrder.indexOf(minLevel);
      const validLevels = levelOrder.slice(minLevelIndex);
      // This is a simplification - for production, you'd want more sophisticated JSONB querying
    }

    const employees = await query.getMany();

    return employees.map((emp) => this.mapToListItemResponse(emp));
  }

  async updateSkills(
    employeeId: string,
    skills: Array<{
      name: string;
      level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      years_of_experience?: number;
      certified?: boolean;
    }>,
    updatedBy?: string
  ): Promise<EmployeeDetailResponse> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository.findOne({
      where: { id: employeeId, deleted_at: IsNull() },
    });

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    employee.skills = skills;
    await employeeRepository.save(employee);

    await this.createAuditLog({
      user_id: updatedBy,
      action: 'UPDATE_EMPLOYEE_SKILLS',
      resource_type: 'employee',
      resource_id: employeeId,
      changes: { skills },
    });

    return this.getEmployeeById(employeeId);
  }

  async updateLeaveBalance(
    employeeId: string,
    leaveType: string,
    balanceUpdate: {
      total_days?: number;
      used_days?: number;
      pending_days?: number;
      carry_forward_days?: number;
    },
    updatedBy?: string
  ): Promise<EmployeeDetailResponse> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository.findOne({
      where: { id: employeeId, deleted_at: IsNull() },
    });

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const leaveBalances = employee.leave_balances || [];
    const existingIndex = leaveBalances.findIndex((lb) => lb.leave_type === leaveType);

    if (existingIndex >= 0) {
      leaveBalances[existingIndex] = {
        ...leaveBalances[existingIndex],
        ...balanceUpdate,
      };
    } else {
      leaveBalances.push({
        leave_type: leaveType,
        total_days: balanceUpdate.total_days || 0,
        used_days: balanceUpdate.used_days || 0,
        pending_days: balanceUpdate.pending_days || 0,
        carry_forward_days: balanceUpdate.carry_forward_days || 0,
      });
    }

    employee.leave_balances = leaveBalances;
    await employeeRepository.save(employee);

    await this.createAuditLog({
      user_id: updatedBy,
      action: 'UPDATE_LEAVE_BALANCE',
      resource_type: 'employee',
      resource_id: employeeId,
      changes: { leave_type: leaveType, ...balanceUpdate },
    });

    return this.getEmployeeById(employeeId);
  }

  async addPerformanceGoal(
    employeeId: string,
    goal: {
      title: string;
      description: string;
      target_date: string;
      status?: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
      progress_percentage?: number;
    },
    addedBy?: string
  ): Promise<EmployeeDetailResponse> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository.findOne({
      where: { id: employeeId, deleted_at: IsNull() },
    });

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const newGoal = {
      id: uuidv4(),
      ...goal,
      status: goal.status || 'not_started',
      progress_percentage: goal.progress_percentage || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    employee.performance_goals = [...(employee.performance_goals || []), newGoal];
    await employeeRepository.save(employee);

    await this.createAuditLog({
      user_id: addedBy,
      action: 'ADD_PERFORMANCE_GOAL',
      resource_type: 'employee',
      resource_id: employeeId,
      changes: { goal: newGoal },
    });

    return this.getEmployeeById(employeeId);
  }

  async updatePerformanceGoal(
    employeeId: string,
    goalId: string,
    updates: {
      title?: string;
      description?: string;
      target_date?: string;
      status?: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
      progress_percentage?: number;
    },
    updatedBy?: string
  ): Promise<EmployeeDetailResponse> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository.findOne({
      where: { id: employeeId, deleted_at: IsNull() },
    });

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const goals = employee.performance_goals || [];
    const goalIndex = goals.findIndex((g) => g.id === goalId);

    if (goalIndex === -1) {
      throw new NotFoundError('Performance goal not found');
    }

    goals[goalIndex] = {
      ...goals[goalIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    employee.performance_goals = goals;
    await employeeRepository.save(employee);

    await this.createAuditLog({
      user_id: updatedBy,
      action: 'UPDATE_PERFORMANCE_GOAL',
      resource_type: 'employee',
      resource_id: employeeId,
      changes: { goal_id: goalId, updates },
    });

    return this.getEmployeeById(employeeId);
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

  private mapToListItemResponse(employee: Employee): EmployeeListItemResponse {
    return {
      id: employee.id,
      employee_id: employee.employee_id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      full_name: `${employee.first_name} ${employee.last_name}`,
      work_email: employee.work_email,
      job_title: employee.job_title,
      job_level: employee.job_level,
      department: employee.department
        ? {
            id: employee.department.id,
            name: employee.department.name,
          }
        : undefined,
      manager: employee.manager
        ? {
            id: employee.manager.id,
            full_name: `${employee.manager.first_name} ${employee.manager.last_name}`,
          }
        : undefined,
      employment_status: employee.employment_status,
      employment_type: employee.employment_type,
      hire_date: employee.hire_date,
      work_location: employee.work_location,
      is_remote: employee.is_remote,
      profile_picture_url: employee.profile_picture_url,
      created_at: employee.created_at,
    };
  }

  private mapToDetailResponse(employee: Employee): EmployeeDetailResponse {
    const startDate = new Date(employee.hire_date);
    const endDate = employee.termination_date
      ? new Date(employee.termination_date)
      : new Date();
    const yearsOfService = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );

    return {
      ...this.mapToListItemResponse(employee),
      middle_name: employee.middle_name,
      date_of_birth: employee.date_of_birth,
      gender: employee.gender,
      nationality: employee.nationality,
      marital_status: employee.marital_status,
      personal_email: employee.personal_email,
      work_phone: employee.work_phone,
      personal_phone: employee.personal_phone,
      address: {
        line1: employee.address_line1,
        line2: employee.address_line2,
        city: employee.city,
        state: employee.state,
        postal_code: employee.postal_code,
        country: employee.country,
      },
      probation_end_date: employee.probation_end_date,
      termination_date: employee.termination_date,
      termination_reason: employee.termination_reason,
      base_salary: employee.base_salary ? Number(employee.base_salary) : undefined,
      salary_currency: employee.salary_currency,
      salary_frequency: employee.salary_frequency,
      work_schedule: employee.work_schedule,
      timezone: employee.timezone,
      skills: employee.skills,
      certifications: employee.certifications,
      education: employee.education,
      emergency_contacts: employee.emergency_contacts,
      leave_balances: employee.leave_balances,
      documents: employee.documents,
      performance_goals: employee.performance_goals,
      last_performance_rating: employee.last_performance_rating
        ? Number(employee.last_performance_rating)
        : undefined,
      last_review_date: employee.last_review_date,
      next_review_date: employee.next_review_date,
      employment_history: employee.employment_history,
      direct_reports_count: employee.direct_reports?.length || 0,
      years_of_service: yearsOfService,
      updated_at: employee.updated_at,
    };
  }
}

export const employeeService = new EmployeeService();
