import { createMockRequest, createMockResponse, createMockNext } from '../helpers/mock-express';
import { createMockEmployee, uuid1, uuid2, userUuid, deptUuid } from '../fixtures/employee.fixtures';

// Mock dependencies
jest.mock('../../utils/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

jest.mock('../../config/environment', () => ({
  env: { NODE_ENV: 'test' },
}));

const mockService = {
  listEmployees: jest.fn(),
  getEmployeeById: jest.fn(),
  getEmployeeByUserId: jest.fn(),
  createEmployee: jest.fn(),
  updateEmployee: jest.fn(),
  deleteEmployee: jest.fn(),
  bulkUpdateEmployees: jest.fn(),
  transferEmployee: jest.fn(),
  promoteEmployee: jest.fn(),
  terminateEmployee: jest.fn(),
  getDirectReports: jest.fn(),
  getOrgChart: jest.fn(),
  getAnalytics: jest.fn(),
  searchEmployees: jest.fn(),
  getEmployeesBySkill: jest.fn(),
  updateSkills: jest.fn(),
  updateLeaveBalance: jest.fn(),
  addPerformanceGoal: jest.fn(),
  updatePerformanceGoal: jest.fn(),
};

jest.mock('../../services/employee.service', () => ({
  employeeService: mockService,
}));

import * as controller from '../../controllers/employee.controller';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Employee Controller', () => {
  describe('listEmployees', () => {
    it('should return 200 with paginated employees', async () => {
      const mockResult = {
        employees: [{ id: uuid1, full_name: 'John Doe' }],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      mockService.listEmployees.mockResolvedValue(mockResult);

      const req = createMockRequest({ query: {} });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.listEmployees(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res._json.success).toBe(true);
      expect(res._json.data).toEqual(mockResult.employees);
      expect(res._json.meta.pagination).toEqual(mockResult.meta);
    });

    it('should pass query params to service', async () => {
      mockService.listEmployees.mockResolvedValue({ employees: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } });

      const req = createMockRequest({ query: { page: '2', limit: '20', search: 'John' } });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.listEmployees(req as any, res as any, next);

      expect(mockService.listEmployees).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, limit: 20, search: 'John' })
      );
    });

    it('should delegate errors to next', async () => {
      const error = new Error('DB error');
      mockService.listEmployees.mockRejectedValue(error);

      const req = createMockRequest({ query: {} });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.listEmployees(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getEmployee', () => {
    it('should return 200 with employee data', async () => {
      mockService.getEmployeeById.mockResolvedValue({ id: uuid1 });

      const req = createMockRequest({ params: { id: uuid1 } });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getEmployee(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res._json.data.id).toBe(uuid1);
    });
  });

  describe('getEmployeeByUserId', () => {
    it('should return 200 with employee for user', async () => {
      mockService.getEmployeeByUserId.mockResolvedValue({ id: uuid1 });

      const req = createMockRequest({ params: { userId: userUuid } });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getEmployeeByUserId(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getMyProfile', () => {
    it('should return employee profile for authenticated user', async () => {
      mockService.getEmployeeByUserId.mockResolvedValue({ id: uuid1 });

      const req = createMockRequest({ user: { id: userUuid, email: 'test@test.com', roles: ['user'] } });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getMyProfile(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res._json.data.id).toBe(uuid1);
    });

    it('should return null data if no employee record', async () => {
      const notFoundError = new Error('Employee not found');
      (notFoundError as any).name = 'NotFoundError';
      mockService.getEmployeeByUserId.mockRejectedValue(notFoundError);

      const req = createMockRequest({ user: { id: userUuid, email: 'test@test.com', roles: ['user'] } });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getMyProfile(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res._json.data).toBeNull();
    });
  });

  describe('createEmployee', () => {
    it('should return 201 with created employee', async () => {
      const mockEmployee = { id: uuid1, employee_id: 'EMP001' };
      mockService.createEmployee.mockResolvedValue(mockEmployee);

      const req = createMockRequest({
        body: {
          user_id: userUuid,
          first_name: 'John',
          last_name: 'Doe',
          work_email: 'john@company.com',
          job_title: 'Engineer',
          hire_date: '2024-01-15',
        },
        user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.createEmployee(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res._json.success).toBe(true);
      expect(res._json.data).toEqual(mockEmployee);
    });

    it('should call next with Zod error for invalid data', async () => {
      const req = createMockRequest({
        body: { first_name: 'John' }, // missing required fields
        user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.createEmployee(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateEmployee', () => {
    it('should return 200 with updated employee', async () => {
      mockService.updateEmployee.mockResolvedValue({ id: uuid1 });

      const req = createMockRequest({
        params: { id: uuid1 },
        body: { first_name: 'Jane' },
        user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.updateEmployee(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteEmployee', () => {
    it('should return 200 on successful delete', async () => {
      mockService.deleteEmployee.mockResolvedValue(undefined);

      const req = createMockRequest({
        params: { id: uuid1 },
        user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.deleteEmployee(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res._json.message).toContain('deleted');
    });
  });

  describe('bulkUpdateEmployees', () => {
    it('should return 200 with bulk update result', async () => {
      mockService.bulkUpdateEmployees.mockResolvedValue({ updated: 3, failed: [] });

      const req = createMockRequest({
        body: {
          employee_ids: [uuid1, uuid2],
          updates: { is_remote: true },
        },
        user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.bulkUpdateEmployees(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('transferEmployee', () => {
    it('should return 200 on successful transfer', async () => {
      mockService.transferEmployee.mockResolvedValue({ id: uuid1 });

      const req = createMockRequest({
        params: { id: uuid1 },
        body: { new_department_id: deptUuid, effective_date: '2024-06-01' },
        user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.transferEmployee(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('promoteEmployee', () => {
    it('should return 200 on successful promotion', async () => {
      mockService.promoteEmployee.mockResolvedValue({ id: uuid1 });

      const req = createMockRequest({
        params: { id: uuid1 },
        body: { new_job_title: 'Staff Engineer', effective_date: '2024-06-01' },
        user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.promoteEmployee(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('terminateEmployee', () => {
    it('should return 200 on successful termination', async () => {
      mockService.terminateEmployee.mockResolvedValue({ id: uuid1 });

      const req = createMockRequest({
        params: { id: uuid1 },
        body: { termination_date: '2024-06-01', termination_reason: 'Voluntary' },
        user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.terminateEmployee(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getDirectReports', () => {
    it('should return 200 with direct reports', async () => {
      mockService.getDirectReports.mockResolvedValue([{ id: uuid2 }]);

      const req = createMockRequest({ params: { id: uuid1 } });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getDirectReports(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getOrgChart', () => {
    it('should return 200 with org chart', async () => {
      mockService.getOrgChart.mockResolvedValue([{ id: uuid1 }]);

      const req = createMockRequest({ query: {} });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getOrgChart(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getAnalytics', () => {
    it('should return 200 with analytics', async () => {
      mockService.getAnalytics.mockResolvedValue({ total_employees: 50 });

      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getAnalytics(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('searchEmployees', () => {
    it('should return 200 with search results', async () => {
      mockService.searchEmployees.mockResolvedValue([{ id: uuid1 }]);

      const req = createMockRequest({ query: { q: 'John', limit: '5' } });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.searchEmployees(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockService.searchEmployees).toHaveBeenCalledWith('John', 5);
    });
  });

  describe('getEmployeesBySkill', () => {
    it('should return 200 with employees by skill', async () => {
      mockService.getEmployeesBySkill.mockResolvedValue([{ id: uuid1 }]);

      const req = createMockRequest({ query: { skill: 'TypeScript', minLevel: 'advanced' } });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.getEmployeesBySkill(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockService.getEmployeesBySkill).toHaveBeenCalledWith('TypeScript', 'advanced');
    });
  });

  describe('updateSkills', () => {
    it('should return 200 on skill update', async () => {
      mockService.updateSkills.mockResolvedValue({ id: uuid1 });

      const req = createMockRequest({
        params: { id: uuid1 },
        body: { skills: [{ name: 'Go', level: 'beginner' }] },
        user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.updateSkills(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updateLeaveBalance', () => {
    it('should return 200 on leave balance update', async () => {
      mockService.updateLeaveBalance.mockResolvedValue({ id: uuid1 });

      const req = createMockRequest({
        params: { id: uuid1 },
        body: { leave_type: 'annual', total_days: 25 },
        user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.updateLeaveBalance(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('addPerformanceGoal', () => {
    it('should return 201 on goal creation', async () => {
      mockService.addPerformanceGoal.mockResolvedValue({ id: uuid1 });

      const req = createMockRequest({
        params: { id: uuid1 },
        body: { title: 'New Goal', description: 'Desc', target_date: '2024-12-31' },
        user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.addPerformanceGoal(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updatePerformanceGoal', () => {
    it('should return 200 on goal update', async () => {
      mockService.updatePerformanceGoal.mockResolvedValue({ id: uuid1 });
      const goalId = '880e8400-e29b-41d4-a716-446655440001';

      const req = createMockRequest({
        params: { id: uuid1, goalId },
        body: { progress_percentage: 80 },
        user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
      });
      const res = createMockResponse();
      const next = createMockNext();

      await controller.updatePerformanceGoal(req as any, res as any, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
