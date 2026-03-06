"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mock_express_1 = require("../helpers/mock-express");
const employee_fixtures_1 = require("../fixtures/employee.fixtures");
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
const controller = __importStar(require("../../controllers/employee.controller"));
beforeEach(() => {
    jest.clearAllMocks();
});
describe('Employee Controller', () => {
    describe('listEmployees', () => {
        it('should return 200 with paginated employees', async () => {
            const mockResult = {
                employees: [{ id: employee_fixtures_1.uuid1, full_name: 'John Doe' }],
                meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
            };
            mockService.listEmployees.mockResolvedValue(mockResult);
            const req = (0, mock_express_1.createMockRequest)({ query: {} });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.listEmployees(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res._json.success).toBe(true);
            expect(res._json.data).toEqual(mockResult.employees);
            expect(res._json.meta.pagination).toEqual(mockResult.meta);
        });
        it('should pass query params to service', async () => {
            mockService.listEmployees.mockResolvedValue({ employees: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } });
            const req = (0, mock_express_1.createMockRequest)({ query: { page: '2', limit: '20', search: 'John' } });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.listEmployees(req, res, next);
            expect(mockService.listEmployees).toHaveBeenCalledWith(expect.objectContaining({ page: 2, limit: 20, search: 'John' }));
        });
        it('should delegate errors to next', async () => {
            const error = new Error('DB error');
            mockService.listEmployees.mockRejectedValue(error);
            const req = (0, mock_express_1.createMockRequest)({ query: {} });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.listEmployees(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
    describe('getEmployee', () => {
        it('should return 200 with employee data', async () => {
            mockService.getEmployeeById.mockResolvedValue({ id: employee_fixtures_1.uuid1 });
            const req = (0, mock_express_1.createMockRequest)({ params: { id: employee_fixtures_1.uuid1 } });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.getEmployee(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res._json.data.id).toBe(employee_fixtures_1.uuid1);
        });
    });
    describe('getEmployeeByUserId', () => {
        it('should return 200 with employee for user', async () => {
            mockService.getEmployeeByUserId.mockResolvedValue({ id: employee_fixtures_1.uuid1 });
            const req = (0, mock_express_1.createMockRequest)({ params: { userId: employee_fixtures_1.userUuid } });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.getEmployeeByUserId(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    describe('getMyProfile', () => {
        it('should return employee profile for authenticated user', async () => {
            mockService.getEmployeeByUserId.mockResolvedValue({ id: employee_fixtures_1.uuid1 });
            const req = (0, mock_express_1.createMockRequest)({ user: { id: employee_fixtures_1.userUuid, email: 'test@test.com', roles: ['user'] } });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.getMyProfile(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res._json.data.id).toBe(employee_fixtures_1.uuid1);
        });
        it('should return null data if no employee record', async () => {
            const notFoundError = new Error('Employee not found');
            notFoundError.name = 'NotFoundError';
            mockService.getEmployeeByUserId.mockRejectedValue(notFoundError);
            const req = (0, mock_express_1.createMockRequest)({ user: { id: employee_fixtures_1.userUuid, email: 'test@test.com', roles: ['user'] } });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.getMyProfile(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res._json.data).toBeNull();
        });
    });
    describe('createEmployee', () => {
        it('should return 201 with created employee', async () => {
            const mockEmployee = { id: employee_fixtures_1.uuid1, employee_id: 'EMP001' };
            mockService.createEmployee.mockResolvedValue(mockEmployee);
            const req = (0, mock_express_1.createMockRequest)({
                body: {
                    user_id: employee_fixtures_1.userUuid,
                    first_name: 'John',
                    last_name: 'Doe',
                    work_email: 'john@company.com',
                    job_title: 'Engineer',
                    hire_date: '2024-01-15',
                },
                user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.createEmployee(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res._json.success).toBe(true);
            expect(res._json.data).toEqual(mockEmployee);
        });
        it('should call next with Zod error for invalid data', async () => {
            const req = (0, mock_express_1.createMockRequest)({
                body: { first_name: 'John' }, // missing required fields
                user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.createEmployee(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
    describe('updateEmployee', () => {
        it('should return 200 with updated employee', async () => {
            mockService.updateEmployee.mockResolvedValue({ id: employee_fixtures_1.uuid1 });
            const req = (0, mock_express_1.createMockRequest)({
                params: { id: employee_fixtures_1.uuid1 },
                body: { first_name: 'Jane' },
                user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.updateEmployee(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    describe('deleteEmployee', () => {
        it('should return 200 on successful delete', async () => {
            mockService.deleteEmployee.mockResolvedValue(undefined);
            const req = (0, mock_express_1.createMockRequest)({
                params: { id: employee_fixtures_1.uuid1 },
                user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.deleteEmployee(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res._json.message).toContain('deleted');
        });
    });
    describe('bulkUpdateEmployees', () => {
        it('should return 200 with bulk update result', async () => {
            mockService.bulkUpdateEmployees.mockResolvedValue({ updated: 3, failed: [] });
            const req = (0, mock_express_1.createMockRequest)({
                body: {
                    employee_ids: [employee_fixtures_1.uuid1, employee_fixtures_1.uuid2],
                    updates: { is_remote: true },
                },
                user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.bulkUpdateEmployees(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    describe('transferEmployee', () => {
        it('should return 200 on successful transfer', async () => {
            mockService.transferEmployee.mockResolvedValue({ id: employee_fixtures_1.uuid1 });
            const req = (0, mock_express_1.createMockRequest)({
                params: { id: employee_fixtures_1.uuid1 },
                body: { new_department_id: employee_fixtures_1.deptUuid, effective_date: '2024-06-01' },
                user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.transferEmployee(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    describe('promoteEmployee', () => {
        it('should return 200 on successful promotion', async () => {
            mockService.promoteEmployee.mockResolvedValue({ id: employee_fixtures_1.uuid1 });
            const req = (0, mock_express_1.createMockRequest)({
                params: { id: employee_fixtures_1.uuid1 },
                body: { new_job_title: 'Staff Engineer', effective_date: '2024-06-01' },
                user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.promoteEmployee(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    describe('terminateEmployee', () => {
        it('should return 200 on successful termination', async () => {
            mockService.terminateEmployee.mockResolvedValue({ id: employee_fixtures_1.uuid1 });
            const req = (0, mock_express_1.createMockRequest)({
                params: { id: employee_fixtures_1.uuid1 },
                body: { termination_date: '2024-06-01', termination_reason: 'Voluntary' },
                user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.terminateEmployee(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    describe('getDirectReports', () => {
        it('should return 200 with direct reports', async () => {
            mockService.getDirectReports.mockResolvedValue([{ id: employee_fixtures_1.uuid2 }]);
            const req = (0, mock_express_1.createMockRequest)({ params: { id: employee_fixtures_1.uuid1 } });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.getDirectReports(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    describe('getOrgChart', () => {
        it('should return 200 with org chart', async () => {
            mockService.getOrgChart.mockResolvedValue([{ id: employee_fixtures_1.uuid1 }]);
            const req = (0, mock_express_1.createMockRequest)({ query: {} });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.getOrgChart(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    describe('getAnalytics', () => {
        it('should return 200 with analytics', async () => {
            mockService.getAnalytics.mockResolvedValue({ total_employees: 50 });
            const req = (0, mock_express_1.createMockRequest)();
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.getAnalytics(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    describe('searchEmployees', () => {
        it('should return 200 with search results', async () => {
            mockService.searchEmployees.mockResolvedValue([{ id: employee_fixtures_1.uuid1 }]);
            const req = (0, mock_express_1.createMockRequest)({ query: { q: 'John', limit: '5' } });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.searchEmployees(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(mockService.searchEmployees).toHaveBeenCalledWith('John', 5);
        });
    });
    describe('getEmployeesBySkill', () => {
        it('should return 200 with employees by skill', async () => {
            mockService.getEmployeesBySkill.mockResolvedValue([{ id: employee_fixtures_1.uuid1 }]);
            const req = (0, mock_express_1.createMockRequest)({ query: { skill: 'TypeScript', minLevel: 'advanced' } });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.getEmployeesBySkill(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(mockService.getEmployeesBySkill).toHaveBeenCalledWith('TypeScript', 'advanced');
        });
    });
    describe('updateSkills', () => {
        it('should return 200 on skill update', async () => {
            mockService.updateSkills.mockResolvedValue({ id: employee_fixtures_1.uuid1 });
            const req = (0, mock_express_1.createMockRequest)({
                params: { id: employee_fixtures_1.uuid1 },
                body: { skills: [{ name: 'Go', level: 'beginner' }] },
                user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.updateSkills(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    describe('updateLeaveBalance', () => {
        it('should return 200 on leave balance update', async () => {
            mockService.updateLeaveBalance.mockResolvedValue({ id: employee_fixtures_1.uuid1 });
            const req = (0, mock_express_1.createMockRequest)({
                params: { id: employee_fixtures_1.uuid1 },
                body: { leave_type: 'annual', total_days: 25 },
                user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.updateLeaveBalance(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    describe('addPerformanceGoal', () => {
        it('should return 201 on goal creation', async () => {
            mockService.addPerformanceGoal.mockResolvedValue({ id: employee_fixtures_1.uuid1 });
            const req = (0, mock_express_1.createMockRequest)({
                params: { id: employee_fixtures_1.uuid1 },
                body: { title: 'New Goal', description: 'Desc', target_date: '2024-12-31' },
                user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.addPerformanceGoal(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });
    describe('updatePerformanceGoal', () => {
        it('should return 200 on goal update', async () => {
            mockService.updatePerformanceGoal.mockResolvedValue({ id: employee_fixtures_1.uuid1 });
            const goalId = '880e8400-e29b-41d4-a716-446655440001';
            const req = (0, mock_express_1.createMockRequest)({
                params: { id: employee_fixtures_1.uuid1, goalId },
                body: { progress_percentage: 80 },
                user: { id: 'admin-id', email: 'admin@test.com', roles: ['admin'] },
            });
            const res = (0, mock_express_1.createMockResponse)();
            const next = (0, mock_express_1.createMockNext)();
            await controller.updatePerformanceGoal(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
//# sourceMappingURL=employee.controller.test.js.map