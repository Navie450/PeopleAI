import { createMockQueryBuilder, createMockRepository } from '../helpers/mock-repository';
import { createMockEmployee, createMockDepartment, createMockCreateEmployeeDto, uuid1, uuid2, deptUuid, userUuid } from '../fixtures/employee.fixtures';
import { EmploymentStatus } from '../../entities/Employee';
import { NotFoundError, ConflictError, ValidationError } from '../../utils/errors';

// Mock dependencies before importing service
jest.mock('../../utils/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

jest.mock('../../config/environment', () => ({
  env: { NODE_ENV: 'test' },
}));

const mockEmployeeRepo = createMockRepository();
const mockDepartmentRepo = createMockRepository();
const mockAuditLogRepo = createMockRepository();

jest.mock('../../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn((entity: { name: string }) => {
      if (entity.name === 'Employee') return mockEmployeeRepo;
      if (entity.name === 'Department') return mockDepartmentRepo;
      if (entity.name === 'AuditLog') return mockAuditLogRepo;
      return mockEmployeeRepo;
    }),
  },
}));

// Must import after mocks
import { employeeService } from '../../services/employee.service';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('EmployeeService', () => {
  describe('listEmployees', () => {
    it('should return paginated employees', async () => {
      const employees = [createMockEmployee()];
      mockEmployeeRepo.queryBuilder.getCount.mockResolvedValue(1);
      mockEmployeeRepo.queryBuilder.getMany.mockResolvedValue(employees);

      const result = await employeeService.listEmployees({ page: 1, limit: 10, sort_by: 'created_at', sort_order: 'desc' });

      expect(result.employees).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });

    it('should apply search filter', async () => {
      mockEmployeeRepo.queryBuilder.getCount.mockResolvedValue(0);
      mockEmployeeRepo.queryBuilder.getMany.mockResolvedValue([]);

      await employeeService.listEmployees({ page: 1, limit: 10, search: 'John', sort_by: 'created_at', sort_order: 'desc' });

      expect(mockEmployeeRepo.queryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should cap limit at 100', async () => {
      mockEmployeeRepo.queryBuilder.getCount.mockResolvedValue(0);
      mockEmployeeRepo.queryBuilder.getMany.mockResolvedValue([]);

      const result = await employeeService.listEmployees({ page: 1, limit: 200, sort_by: 'created_at', sort_order: 'desc' });

      expect(result.meta.limit).toBe(100);
    });
  });

  describe('getEmployeeById', () => {
    it('should return employee detail', async () => {
      const employee = createMockEmployee();
      mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);

      const result = await employeeService.getEmployeeById(uuid1);

      expect(result.id).toBe(uuid1);
      expect(result.full_name).toBe('John Doe');
      expect(result.years_of_service).toBeDefined();
    });

    it('should throw NotFoundError if employee not found', async () => {
      mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(null);

      await expect(employeeService.getEmployeeById('nonexistent')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getEmployeeByUserId', () => {
    it('should return employee by user ID', async () => {
      const employee = createMockEmployee();
      mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);

      const result = await employeeService.getEmployeeByUserId(userUuid);

      expect(result.id).toBe(uuid1);
    });

    it('should throw NotFoundError if not found', async () => {
      mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(null);

      await expect(employeeService.getEmployeeByUserId('nonexistent')).rejects.toThrow(NotFoundError);
    });
  });

  describe('createEmployee', () => {
    it('should create employee successfully', async () => {
      const dto = createMockCreateEmployeeDto();
      const created = createMockEmployee();

      mockEmployeeRepo.findOne.mockResolvedValue(null); // no existing user or email
      mockDepartmentRepo.findOne.mockResolvedValue(null); // no department to validate
      mockEmployeeRepo.queryBuilder.getOne
        .mockResolvedValueOnce(null) // generateEmployeeId query
        .mockResolvedValueOnce(created); // getEmployeeById after create
      mockEmployeeRepo.create.mockReturnValue(created);
      mockEmployeeRepo.save.mockResolvedValue(created);

      const result = await employeeService.createEmployee(dto, 'admin-user');

      expect(result.id).toBe(uuid1);
      expect(mockAuditLogRepo.save).toHaveBeenCalled();
    });

    it('should throw ConflictError if user already has employee record', async () => {
      const dto = createMockCreateEmployeeDto();
      mockEmployeeRepo.findOne.mockResolvedValueOnce(createMockEmployee());

      await expect(employeeService.createEmployee(dto)).rejects.toThrow(ConflictError);
    });

    it('should throw ConflictError if work email already in use', async () => {
      const dto = createMockCreateEmployeeDto();
      mockEmployeeRepo.findOne
        .mockResolvedValueOnce(null) // user check passes
        .mockResolvedValueOnce(createMockEmployee()); // email check fails

      await expect(employeeService.createEmployee(dto)).rejects.toThrow(ConflictError);
    });

    it('should validate department if provided', async () => {
      const dto = createMockCreateEmployeeDto({ department_id: deptUuid });
      mockEmployeeRepo.findOne.mockResolvedValue(null);
      mockDepartmentRepo.findOne.mockResolvedValue(null); // department not found

      await expect(employeeService.createEmployee(dto)).rejects.toThrow(ValidationError);
    });

    it('should validate manager if provided', async () => {
      const dto = createMockCreateEmployeeDto({ manager_id: uuid2 });
      mockEmployeeRepo.findOne
        .mockResolvedValueOnce(null) // user check
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce(null); // manager check

      await expect(employeeService.createEmployee(dto)).rejects.toThrow(ValidationError);
    });
  });

  describe('updateEmployee', () => {
    it('should update employee successfully', async () => {
      const existing = createMockEmployee();
      const updated = createMockEmployee({ first_name: 'Jane' });

      mockEmployeeRepo.findOne.mockResolvedValue(existing);
      mockEmployeeRepo.save.mockResolvedValue(updated);
      mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(updated);

      const result = await employeeService.updateEmployee(uuid1, { first_name: 'Jane' }, 'admin');

      expect(mockEmployeeRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if employee not found', async () => {
      mockEmployeeRepo.findOne.mockResolvedValue(null);

      await expect(employeeService.updateEmployee('nonexistent', { first_name: 'Jane' })).rejects.toThrow(NotFoundError);
    });

    it('should throw ConflictError if email already in use', async () => {
      const existing = createMockEmployee();
      mockEmployeeRepo.findOne
        .mockResolvedValueOnce(existing) // find employee
        .mockResolvedValueOnce(createMockEmployee({ id: uuid2 })); // email conflict

      await expect(
        employeeService.updateEmployee(uuid1, { work_email: 'taken@company.com' })
      ).rejects.toThrow(ConflictError);
    });

    it('should throw ValidationError if self-manager', async () => {
      const existing = createMockEmployee();
      mockEmployeeRepo.findOne.mockResolvedValueOnce(existing);

      await expect(
        employeeService.updateEmployee(uuid1, { manager_id: uuid1 })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('deleteEmployee', () => {
    it('should soft delete employee', async () => {
      const employee = createMockEmployee();
      mockEmployeeRepo.findOne.mockResolvedValue(employee);
      mockEmployeeRepo.save.mockResolvedValue(employee);

      await employeeService.deleteEmployee(uuid1, 'admin');

      expect(mockEmployeeRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          deleted_at: expect.any(Date),
          employment_status: EmploymentStatus.TERMINATED,
        })
      );
    });

    it('should throw NotFoundError if not found', async () => {
      mockEmployeeRepo.findOne.mockResolvedValue(null);

      await expect(employeeService.deleteEmployee('nonexistent')).rejects.toThrow(NotFoundError);
    });
  });

  describe('bulkUpdateEmployees', () => {
    it('should update multiple employees', async () => {
      const emp1 = createMockEmployee({ id: uuid1 });
      const emp2 = createMockEmployee({ id: uuid2 });

      mockEmployeeRepo.findOne
        .mockResolvedValueOnce(emp1)
        .mockResolvedValueOnce(emp2);
      mockEmployeeRepo.save.mockResolvedValue({});

      const result = await employeeService.bulkUpdateEmployees(
        { employee_ids: [uuid1, uuid2], updates: { is_remote: true } },
        'admin'
      );

      expect(result.updated).toBe(2);
      expect(result.failed).toHaveLength(0);
    });

    it('should track failed updates', async () => {
      mockEmployeeRepo.findOne.mockResolvedValue(null);

      const result = await employeeService.bulkUpdateEmployees(
        { employee_ids: [uuid1], updates: { is_remote: true } },
        'admin'
      );

      expect(result.updated).toBe(0);
      expect(result.failed).toContain(uuid1);
    });
  });

  describe('transferEmployee', () => {
    it('should transfer employee to new department', async () => {
      const employee = createMockEmployee();
      const newDept = createMockDepartment({ id: '660e8400-e29b-41d4-a716-446655440002', name: 'Product' });

      mockEmployeeRepo.findOne.mockResolvedValue(employee);
      mockDepartmentRepo.findOne.mockResolvedValue(newDept);
      mockEmployeeRepo.save.mockResolvedValue(employee);
      mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);

      const result = await employeeService.transferEmployee(
        uuid1,
        { new_department_id: newDept.id, effective_date: '2024-06-01', reason: 'Restructuring' },
        'admin'
      );

      expect(mockEmployeeRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if employee not found', async () => {
      mockEmployeeRepo.findOne.mockResolvedValue(null);

      await expect(
        employeeService.transferEmployee('nonexistent', { new_department_id: deptUuid, effective_date: '2024-06-01' })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ValidationError for invalid department', async () => {
      mockEmployeeRepo.findOne.mockResolvedValue(createMockEmployee());
      mockDepartmentRepo.findOne.mockResolvedValue(null);

      await expect(
        employeeService.transferEmployee(uuid1, { new_department_id: 'invalid-dept-uuid', effective_date: '2024-06-01' })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('promoteEmployee', () => {
    it('should promote employee', async () => {
      const employee = createMockEmployee();
      mockEmployeeRepo.findOne.mockResolvedValue(employee);
      mockEmployeeRepo.save.mockResolvedValue(employee);
      mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);

      await employeeService.promoteEmployee(
        uuid1,
        { new_job_title: 'Staff Engineer', effective_date: '2024-06-01' },
        'admin'
      );

      expect(mockEmployeeRepo.save).toHaveBeenCalled();
      expect(mockAuditLogRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if not found', async () => {
      mockEmployeeRepo.findOne.mockResolvedValue(null);

      await expect(
        employeeService.promoteEmployee('nonexistent', { new_job_title: 'Staff', effective_date: '2024-06-01' })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('terminateEmployee', () => {
    it('should terminate employee', async () => {
      const employee = createMockEmployee();
      mockEmployeeRepo.findOne
        .mockResolvedValueOnce(employee); // find for terminate
      mockEmployeeRepo.save.mockResolvedValue(employee);
      mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);

      await employeeService.terminateEmployee(
        uuid1,
        {
          termination_date: '2024-06-01',
          termination_reason: 'Resignation',
          eligible_for_rehire: true,
          exit_interview_completed: false,
        },
        'admin'
      );

      expect(mockEmployeeRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          employment_status: EmploymentStatus.TERMINATED,
        })
      );
    });

    it('should throw NotFoundError if not found', async () => {
      mockEmployeeRepo.findOne.mockResolvedValue(null);

      await expect(
        employeeService.terminateEmployee('nonexistent', {
          termination_date: '2024-06-01',
          termination_reason: 'test',
          eligible_for_rehire: true,
          exit_interview_completed: false,
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getDirectReports', () => {
    it('should return direct reports', async () => {
      const reports = [createMockEmployee({ id: uuid2, manager_id: uuid1 })];
      mockEmployeeRepo.queryBuilder.getMany.mockResolvedValue(reports);

      const result = await employeeService.getDirectReports(uuid1);

      expect(result).toHaveLength(1);
    });
  });

  describe('searchEmployees', () => {
    it('should search employees by term', async () => {
      const employees = [createMockEmployee()];
      mockEmployeeRepo.queryBuilder.getMany.mockResolvedValue(employees);

      const result = await employeeService.searchEmployees('John');

      expect(result).toHaveLength(1);
      expect(mockEmployeeRepo.queryBuilder.andWhere).toHaveBeenCalled();
    });
  });

  describe('getEmployeesBySkill', () => {
    it('should find employees by skill', async () => {
      const employees = [createMockEmployee()];
      mockEmployeeRepo.queryBuilder.getMany.mockResolvedValue(employees);

      const result = await employeeService.getEmployeesBySkill('TypeScript');

      expect(result).toHaveLength(1);
    });
  });

  describe('updateSkills', () => {
    it('should update employee skills', async () => {
      const employee = createMockEmployee();
      mockEmployeeRepo.findOne.mockResolvedValue(employee);
      mockEmployeeRepo.save.mockResolvedValue(employee);
      mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);

      const newSkills = [{ name: 'Go', level: 'beginner' as const }];
      await employeeService.updateSkills(uuid1, newSkills, 'admin');

      expect(mockEmployeeRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if not found', async () => {
      mockEmployeeRepo.findOne.mockResolvedValue(null);

      await expect(
        employeeService.updateSkills('nonexistent', [], 'admin')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateLeaveBalance', () => {
    it('should update existing leave balance', async () => {
      const employee = createMockEmployee();
      mockEmployeeRepo.findOne.mockResolvedValue(employee);
      mockEmployeeRepo.save.mockResolvedValue(employee);
      mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);

      await employeeService.updateLeaveBalance(uuid1, 'annual', { total_days: 25 }, 'admin');

      expect(mockEmployeeRepo.save).toHaveBeenCalled();
    });

    it('should add new leave balance type', async () => {
      const employee = createMockEmployee({ leave_balances: [] });
      mockEmployeeRepo.findOne.mockResolvedValue(employee);
      mockEmployeeRepo.save.mockResolvedValue(employee);
      mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);

      await employeeService.updateLeaveBalance(uuid1, 'sick', { total_days: 10 }, 'admin');

      expect(mockEmployeeRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if not found', async () => {
      mockEmployeeRepo.findOne.mockResolvedValue(null);

      await expect(
        employeeService.updateLeaveBalance('nonexistent', 'annual', {})
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('addPerformanceGoal', () => {
    it('should add a performance goal', async () => {
      const employee = createMockEmployee({ performance_goals: [] });
      mockEmployeeRepo.findOne.mockResolvedValue(employee);
      mockEmployeeRepo.save.mockResolvedValue(employee);
      mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);

      await employeeService.addPerformanceGoal(
        uuid1,
        { title: 'New Goal', description: 'Do stuff', target_date: '2024-12-31' },
        'admin'
      );

      expect(mockEmployeeRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if not found', async () => {
      mockEmployeeRepo.findOne.mockResolvedValue(null);

      await expect(
        employeeService.addPerformanceGoal('nonexistent', {
          title: 'Goal', description: 'Desc', target_date: '2024-12-31',
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updatePerformanceGoal', () => {
    it('should update an existing goal', async () => {
      const employee = createMockEmployee();
      mockEmployeeRepo.findOne.mockResolvedValue(employee);
      mockEmployeeRepo.save.mockResolvedValue(employee);
      mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);

      const goalId = employee.performance_goals![0].id;
      await employeeService.updatePerformanceGoal(
        uuid1,
        goalId,
        { progress_percentage: 80 },
        'admin'
      );

      expect(mockEmployeeRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if goal not found', async () => {
      const employee = createMockEmployee();
      mockEmployeeRepo.findOne.mockResolvedValue(employee);

      await expect(
        employeeService.updatePerformanceGoal(uuid1, 'nonexistent-goal', { progress_percentage: 80 })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if employee not found', async () => {
      mockEmployeeRepo.findOne.mockResolvedValue(null);

      await expect(
        employeeService.updatePerformanceGoal('nonexistent', 'goal-id', { progress_percentage: 80 })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getAnalytics', () => {
    it('should return analytics data', async () => {
      mockEmployeeRepo.count
        .mockResolvedValueOnce(50) // total
        .mockResolvedValueOnce(40) // active
        .mockResolvedValueOnce(10); // remote

      mockEmployeeRepo.queryBuilder.getRawMany
        .mockResolvedValueOnce([{ status: 'active', count: '40' }])
        .mockResolvedValueOnce([{ type: 'full_time', count: '35' }])
        .mockResolvedValueOnce([{ department_id: deptUuid, department_name: 'Engineering', count: '20' }])
        .mockResolvedValueOnce([{ location: 'SF', count: '30' }]);

      mockEmployeeRepo.queryBuilder.getRawOne.mockResolvedValue({ avg_tenure: '2.5' });
      mockEmployeeRepo.queryBuilder.getCount
        .mockResolvedValueOnce(5) // new hires
        .mockResolvedValueOnce(2) // terminations
        .mockResolvedValueOnce(3) // upcoming reviews
        .mockResolvedValueOnce(1); // probation ending

      const result = await employeeService.getAnalytics();

      expect(result.total_employees).toBe(50);
      expect(result.active_employees).toBe(40);
      expect(result.remote_vs_onsite.remote).toBe(10);
    });
  });

  describe('getOrgChart', () => {
    it('should build org chart tree', async () => {
      const employees = [
        createMockEmployee({ id: uuid1, manager_id: null, first_name: 'CEO', last_name: 'Boss' }),
        createMockEmployee({ id: uuid2, manager_id: uuid1, first_name: 'VP', last_name: 'Sales' }),
      ];
      mockEmployeeRepo.queryBuilder.getMany.mockResolvedValue(employees);

      const result = await employeeService.getOrgChart();

      expect(result).toHaveLength(1);
      expect(result[0].full_name).toBe('CEO Boss');
    });

    it('should throw NotFoundError for invalid root employee', async () => {
      mockEmployeeRepo.queryBuilder.getMany.mockResolvedValue([]);

      await expect(employeeService.getOrgChart('nonexistent')).rejects.toThrow(NotFoundError);
    });
  });
});
