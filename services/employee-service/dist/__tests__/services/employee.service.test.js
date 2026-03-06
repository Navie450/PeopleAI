"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mock_repository_1 = require("../helpers/mock-repository");
const employee_fixtures_1 = require("../fixtures/employee.fixtures");
const Employee_1 = require("../../entities/Employee");
const errors_1 = require("../../utils/errors");
// Mock dependencies before importing service
jest.mock('../../utils/logger', () => ({
    logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));
jest.mock('../../config/environment', () => ({
    env: { NODE_ENV: 'test' },
}));
const mockEmployeeRepo = (0, mock_repository_1.createMockRepository)();
const mockDepartmentRepo = (0, mock_repository_1.createMockRepository)();
const mockAuditLogRepo = (0, mock_repository_1.createMockRepository)();
jest.mock('../../config/database', () => ({
    AppDataSource: {
        getRepository: jest.fn((entity) => {
            if (entity.name === 'Employee')
                return mockEmployeeRepo;
            if (entity.name === 'Department')
                return mockDepartmentRepo;
            if (entity.name === 'AuditLog')
                return mockAuditLogRepo;
            return mockEmployeeRepo;
        }),
    },
}));
// Must import after mocks
const employee_service_1 = require("../../services/employee.service");
beforeEach(() => {
    jest.clearAllMocks();
});
describe('EmployeeService', () => {
    describe('listEmployees', () => {
        it('should return paginated employees', async () => {
            const employees = [(0, employee_fixtures_1.createMockEmployee)()];
            mockEmployeeRepo.queryBuilder.getCount.mockResolvedValue(1);
            mockEmployeeRepo.queryBuilder.getMany.mockResolvedValue(employees);
            const result = await employee_service_1.employeeService.listEmployees({ page: 1, limit: 10, sort_by: 'created_at', sort_order: 'desc' });
            expect(result.employees).toHaveLength(1);
            expect(result.meta.total).toBe(1);
            expect(result.meta.page).toBe(1);
        });
        it('should apply search filter', async () => {
            mockEmployeeRepo.queryBuilder.getCount.mockResolvedValue(0);
            mockEmployeeRepo.queryBuilder.getMany.mockResolvedValue([]);
            await employee_service_1.employeeService.listEmployees({ page: 1, limit: 10, search: 'John', sort_by: 'created_at', sort_order: 'desc' });
            expect(mockEmployeeRepo.queryBuilder.andWhere).toHaveBeenCalled();
        });
        it('should cap limit at 100', async () => {
            mockEmployeeRepo.queryBuilder.getCount.mockResolvedValue(0);
            mockEmployeeRepo.queryBuilder.getMany.mockResolvedValue([]);
            const result = await employee_service_1.employeeService.listEmployees({ page: 1, limit: 200, sort_by: 'created_at', sort_order: 'desc' });
            expect(result.meta.limit).toBe(100);
        });
    });
    describe('getEmployeeById', () => {
        it('should return employee detail', async () => {
            const employee = (0, employee_fixtures_1.createMockEmployee)();
            mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);
            const result = await employee_service_1.employeeService.getEmployeeById(employee_fixtures_1.uuid1);
            expect(result.id).toBe(employee_fixtures_1.uuid1);
            expect(result.full_name).toBe('John Doe');
            expect(result.years_of_service).toBeDefined();
        });
        it('should throw NotFoundError if employee not found', async () => {
            mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(null);
            await expect(employee_service_1.employeeService.getEmployeeById('nonexistent')).rejects.toThrow(errors_1.NotFoundError);
        });
    });
    describe('getEmployeeByUserId', () => {
        it('should return employee by user ID', async () => {
            const employee = (0, employee_fixtures_1.createMockEmployee)();
            mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);
            const result = await employee_service_1.employeeService.getEmployeeByUserId(employee_fixtures_1.userUuid);
            expect(result.id).toBe(employee_fixtures_1.uuid1);
        });
        it('should throw NotFoundError if not found', async () => {
            mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(null);
            await expect(employee_service_1.employeeService.getEmployeeByUserId('nonexistent')).rejects.toThrow(errors_1.NotFoundError);
        });
    });
    describe('createEmployee', () => {
        it('should create employee successfully', async () => {
            const dto = (0, employee_fixtures_1.createMockCreateEmployeeDto)();
            const created = (0, employee_fixtures_1.createMockEmployee)();
            mockEmployeeRepo.findOne.mockResolvedValue(null); // no existing user or email
            mockDepartmentRepo.findOne.mockResolvedValue(null); // no department to validate
            mockEmployeeRepo.queryBuilder.getOne
                .mockResolvedValueOnce(null) // generateEmployeeId query
                .mockResolvedValueOnce(created); // getEmployeeById after create
            mockEmployeeRepo.create.mockReturnValue(created);
            mockEmployeeRepo.save.mockResolvedValue(created);
            const result = await employee_service_1.employeeService.createEmployee(dto, 'admin-user');
            expect(result.id).toBe(employee_fixtures_1.uuid1);
            expect(mockAuditLogRepo.save).toHaveBeenCalled();
        });
        it('should throw ConflictError if user already has employee record', async () => {
            const dto = (0, employee_fixtures_1.createMockCreateEmployeeDto)();
            mockEmployeeRepo.findOne.mockResolvedValueOnce((0, employee_fixtures_1.createMockEmployee)());
            await expect(employee_service_1.employeeService.createEmployee(dto)).rejects.toThrow(errors_1.ConflictError);
        });
        it('should throw ConflictError if work email already in use', async () => {
            const dto = (0, employee_fixtures_1.createMockCreateEmployeeDto)();
            mockEmployeeRepo.findOne
                .mockResolvedValueOnce(null) // user check passes
                .mockResolvedValueOnce((0, employee_fixtures_1.createMockEmployee)()); // email check fails
            await expect(employee_service_1.employeeService.createEmployee(dto)).rejects.toThrow(errors_1.ConflictError);
        });
        it('should validate department if provided', async () => {
            const dto = (0, employee_fixtures_1.createMockCreateEmployeeDto)({ department_id: employee_fixtures_1.deptUuid });
            mockEmployeeRepo.findOne.mockResolvedValue(null);
            mockDepartmentRepo.findOne.mockResolvedValue(null); // department not found
            await expect(employee_service_1.employeeService.createEmployee(dto)).rejects.toThrow(errors_1.ValidationError);
        });
        it('should validate manager if provided', async () => {
            const dto = (0, employee_fixtures_1.createMockCreateEmployeeDto)({ manager_id: employee_fixtures_1.uuid2 });
            mockEmployeeRepo.findOne
                .mockResolvedValueOnce(null) // user check
                .mockResolvedValueOnce(null) // email check
                .mockResolvedValueOnce(null); // manager check
            await expect(employee_service_1.employeeService.createEmployee(dto)).rejects.toThrow(errors_1.ValidationError);
        });
    });
    describe('updateEmployee', () => {
        it('should update employee successfully', async () => {
            const existing = (0, employee_fixtures_1.createMockEmployee)();
            const updated = (0, employee_fixtures_1.createMockEmployee)({ first_name: 'Jane' });
            mockEmployeeRepo.findOne.mockResolvedValue(existing);
            mockEmployeeRepo.save.mockResolvedValue(updated);
            mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(updated);
            const result = await employee_service_1.employeeService.updateEmployee(employee_fixtures_1.uuid1, { first_name: 'Jane' }, 'admin');
            expect(mockEmployeeRepo.save).toHaveBeenCalled();
        });
        it('should throw NotFoundError if employee not found', async () => {
            mockEmployeeRepo.findOne.mockResolvedValue(null);
            await expect(employee_service_1.employeeService.updateEmployee('nonexistent', { first_name: 'Jane' })).rejects.toThrow(errors_1.NotFoundError);
        });
        it('should throw ConflictError if email already in use', async () => {
            const existing = (0, employee_fixtures_1.createMockEmployee)();
            mockEmployeeRepo.findOne
                .mockResolvedValueOnce(existing) // find employee
                .mockResolvedValueOnce((0, employee_fixtures_1.createMockEmployee)({ id: employee_fixtures_1.uuid2 })); // email conflict
            await expect(employee_service_1.employeeService.updateEmployee(employee_fixtures_1.uuid1, { work_email: 'taken@company.com' })).rejects.toThrow(errors_1.ConflictError);
        });
        it('should throw ValidationError if self-manager', async () => {
            const existing = (0, employee_fixtures_1.createMockEmployee)();
            mockEmployeeRepo.findOne.mockResolvedValueOnce(existing);
            await expect(employee_service_1.employeeService.updateEmployee(employee_fixtures_1.uuid1, { manager_id: employee_fixtures_1.uuid1 })).rejects.toThrow(errors_1.ValidationError);
        });
    });
    describe('deleteEmployee', () => {
        it('should soft delete employee', async () => {
            const employee = (0, employee_fixtures_1.createMockEmployee)();
            mockEmployeeRepo.findOne.mockResolvedValue(employee);
            mockEmployeeRepo.save.mockResolvedValue(employee);
            await employee_service_1.employeeService.deleteEmployee(employee_fixtures_1.uuid1, 'admin');
            expect(mockEmployeeRepo.save).toHaveBeenCalledWith(expect.objectContaining({
                deleted_at: expect.any(Date),
                employment_status: Employee_1.EmploymentStatus.TERMINATED,
            }));
        });
        it('should throw NotFoundError if not found', async () => {
            mockEmployeeRepo.findOne.mockResolvedValue(null);
            await expect(employee_service_1.employeeService.deleteEmployee('nonexistent')).rejects.toThrow(errors_1.NotFoundError);
        });
    });
    describe('bulkUpdateEmployees', () => {
        it('should update multiple employees', async () => {
            const emp1 = (0, employee_fixtures_1.createMockEmployee)({ id: employee_fixtures_1.uuid1 });
            const emp2 = (0, employee_fixtures_1.createMockEmployee)({ id: employee_fixtures_1.uuid2 });
            mockEmployeeRepo.findOne
                .mockResolvedValueOnce(emp1)
                .mockResolvedValueOnce(emp2);
            mockEmployeeRepo.save.mockResolvedValue({});
            const result = await employee_service_1.employeeService.bulkUpdateEmployees({ employee_ids: [employee_fixtures_1.uuid1, employee_fixtures_1.uuid2], updates: { is_remote: true } }, 'admin');
            expect(result.updated).toBe(2);
            expect(result.failed).toHaveLength(0);
        });
        it('should track failed updates', async () => {
            mockEmployeeRepo.findOne.mockResolvedValue(null);
            const result = await employee_service_1.employeeService.bulkUpdateEmployees({ employee_ids: [employee_fixtures_1.uuid1], updates: { is_remote: true } }, 'admin');
            expect(result.updated).toBe(0);
            expect(result.failed).toContain(employee_fixtures_1.uuid1);
        });
    });
    describe('transferEmployee', () => {
        it('should transfer employee to new department', async () => {
            const employee = (0, employee_fixtures_1.createMockEmployee)();
            const newDept = (0, employee_fixtures_1.createMockDepartment)({ id: '660e8400-e29b-41d4-a716-446655440002', name: 'Product' });
            mockEmployeeRepo.findOne.mockResolvedValue(employee);
            mockDepartmentRepo.findOne.mockResolvedValue(newDept);
            mockEmployeeRepo.save.mockResolvedValue(employee);
            mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);
            const result = await employee_service_1.employeeService.transferEmployee(employee_fixtures_1.uuid1, { new_department_id: newDept.id, effective_date: '2024-06-01', reason: 'Restructuring' }, 'admin');
            expect(mockEmployeeRepo.save).toHaveBeenCalled();
        });
        it('should throw NotFoundError if employee not found', async () => {
            mockEmployeeRepo.findOne.mockResolvedValue(null);
            await expect(employee_service_1.employeeService.transferEmployee('nonexistent', { new_department_id: employee_fixtures_1.deptUuid, effective_date: '2024-06-01' })).rejects.toThrow(errors_1.NotFoundError);
        });
        it('should throw ValidationError for invalid department', async () => {
            mockEmployeeRepo.findOne.mockResolvedValue((0, employee_fixtures_1.createMockEmployee)());
            mockDepartmentRepo.findOne.mockResolvedValue(null);
            await expect(employee_service_1.employeeService.transferEmployee(employee_fixtures_1.uuid1, { new_department_id: 'invalid-dept-uuid', effective_date: '2024-06-01' })).rejects.toThrow(errors_1.ValidationError);
        });
    });
    describe('promoteEmployee', () => {
        it('should promote employee', async () => {
            const employee = (0, employee_fixtures_1.createMockEmployee)();
            mockEmployeeRepo.findOne.mockResolvedValue(employee);
            mockEmployeeRepo.save.mockResolvedValue(employee);
            mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);
            await employee_service_1.employeeService.promoteEmployee(employee_fixtures_1.uuid1, { new_job_title: 'Staff Engineer', effective_date: '2024-06-01' }, 'admin');
            expect(mockEmployeeRepo.save).toHaveBeenCalled();
            expect(mockAuditLogRepo.save).toHaveBeenCalled();
        });
        it('should throw NotFoundError if not found', async () => {
            mockEmployeeRepo.findOne.mockResolvedValue(null);
            await expect(employee_service_1.employeeService.promoteEmployee('nonexistent', { new_job_title: 'Staff', effective_date: '2024-06-01' })).rejects.toThrow(errors_1.NotFoundError);
        });
    });
    describe('terminateEmployee', () => {
        it('should terminate employee', async () => {
            const employee = (0, employee_fixtures_1.createMockEmployee)();
            mockEmployeeRepo.findOne
                .mockResolvedValueOnce(employee); // find for terminate
            mockEmployeeRepo.save.mockResolvedValue(employee);
            mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);
            await employee_service_1.employeeService.terminateEmployee(employee_fixtures_1.uuid1, {
                termination_date: '2024-06-01',
                termination_reason: 'Resignation',
                eligible_for_rehire: true,
                exit_interview_completed: false,
            }, 'admin');
            expect(mockEmployeeRepo.save).toHaveBeenCalledWith(expect.objectContaining({
                employment_status: Employee_1.EmploymentStatus.TERMINATED,
            }));
        });
        it('should throw NotFoundError if not found', async () => {
            mockEmployeeRepo.findOne.mockResolvedValue(null);
            await expect(employee_service_1.employeeService.terminateEmployee('nonexistent', {
                termination_date: '2024-06-01',
                termination_reason: 'test',
                eligible_for_rehire: true,
                exit_interview_completed: false,
            })).rejects.toThrow(errors_1.NotFoundError);
        });
    });
    describe('getDirectReports', () => {
        it('should return direct reports', async () => {
            const reports = [(0, employee_fixtures_1.createMockEmployee)({ id: employee_fixtures_1.uuid2, manager_id: employee_fixtures_1.uuid1 })];
            mockEmployeeRepo.queryBuilder.getMany.mockResolvedValue(reports);
            const result = await employee_service_1.employeeService.getDirectReports(employee_fixtures_1.uuid1);
            expect(result).toHaveLength(1);
        });
    });
    describe('searchEmployees', () => {
        it('should search employees by term', async () => {
            const employees = [(0, employee_fixtures_1.createMockEmployee)()];
            mockEmployeeRepo.queryBuilder.getMany.mockResolvedValue(employees);
            const result = await employee_service_1.employeeService.searchEmployees('John');
            expect(result).toHaveLength(1);
            expect(mockEmployeeRepo.queryBuilder.andWhere).toHaveBeenCalled();
        });
    });
    describe('getEmployeesBySkill', () => {
        it('should find employees by skill', async () => {
            const employees = [(0, employee_fixtures_1.createMockEmployee)()];
            mockEmployeeRepo.queryBuilder.getMany.mockResolvedValue(employees);
            const result = await employee_service_1.employeeService.getEmployeesBySkill('TypeScript');
            expect(result).toHaveLength(1);
        });
    });
    describe('updateSkills', () => {
        it('should update employee skills', async () => {
            const employee = (0, employee_fixtures_1.createMockEmployee)();
            mockEmployeeRepo.findOne.mockResolvedValue(employee);
            mockEmployeeRepo.save.mockResolvedValue(employee);
            mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);
            const newSkills = [{ name: 'Go', level: 'beginner' }];
            await employee_service_1.employeeService.updateSkills(employee_fixtures_1.uuid1, newSkills, 'admin');
            expect(mockEmployeeRepo.save).toHaveBeenCalled();
        });
        it('should throw NotFoundError if not found', async () => {
            mockEmployeeRepo.findOne.mockResolvedValue(null);
            await expect(employee_service_1.employeeService.updateSkills('nonexistent', [], 'admin')).rejects.toThrow(errors_1.NotFoundError);
        });
    });
    describe('updateLeaveBalance', () => {
        it('should update existing leave balance', async () => {
            const employee = (0, employee_fixtures_1.createMockEmployee)();
            mockEmployeeRepo.findOne.mockResolvedValue(employee);
            mockEmployeeRepo.save.mockResolvedValue(employee);
            mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);
            await employee_service_1.employeeService.updateLeaveBalance(employee_fixtures_1.uuid1, 'annual', { total_days: 25 }, 'admin');
            expect(mockEmployeeRepo.save).toHaveBeenCalled();
        });
        it('should add new leave balance type', async () => {
            const employee = (0, employee_fixtures_1.createMockEmployee)({ leave_balances: [] });
            mockEmployeeRepo.findOne.mockResolvedValue(employee);
            mockEmployeeRepo.save.mockResolvedValue(employee);
            mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);
            await employee_service_1.employeeService.updateLeaveBalance(employee_fixtures_1.uuid1, 'sick', { total_days: 10 }, 'admin');
            expect(mockEmployeeRepo.save).toHaveBeenCalled();
        });
        it('should throw NotFoundError if not found', async () => {
            mockEmployeeRepo.findOne.mockResolvedValue(null);
            await expect(employee_service_1.employeeService.updateLeaveBalance('nonexistent', 'annual', {})).rejects.toThrow(errors_1.NotFoundError);
        });
    });
    describe('addPerformanceGoal', () => {
        it('should add a performance goal', async () => {
            const employee = (0, employee_fixtures_1.createMockEmployee)({ performance_goals: [] });
            mockEmployeeRepo.findOne.mockResolvedValue(employee);
            mockEmployeeRepo.save.mockResolvedValue(employee);
            mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);
            await employee_service_1.employeeService.addPerformanceGoal(employee_fixtures_1.uuid1, { title: 'New Goal', description: 'Do stuff', target_date: '2024-12-31' }, 'admin');
            expect(mockEmployeeRepo.save).toHaveBeenCalled();
        });
        it('should throw NotFoundError if not found', async () => {
            mockEmployeeRepo.findOne.mockResolvedValue(null);
            await expect(employee_service_1.employeeService.addPerformanceGoal('nonexistent', {
                title: 'Goal', description: 'Desc', target_date: '2024-12-31',
            })).rejects.toThrow(errors_1.NotFoundError);
        });
    });
    describe('updatePerformanceGoal', () => {
        it('should update an existing goal', async () => {
            const employee = (0, employee_fixtures_1.createMockEmployee)();
            mockEmployeeRepo.findOne.mockResolvedValue(employee);
            mockEmployeeRepo.save.mockResolvedValue(employee);
            mockEmployeeRepo.queryBuilder.getOne.mockResolvedValue(employee);
            const goalId = employee.performance_goals[0].id;
            await employee_service_1.employeeService.updatePerformanceGoal(employee_fixtures_1.uuid1, goalId, { progress_percentage: 80 }, 'admin');
            expect(mockEmployeeRepo.save).toHaveBeenCalled();
        });
        it('should throw NotFoundError if goal not found', async () => {
            const employee = (0, employee_fixtures_1.createMockEmployee)();
            mockEmployeeRepo.findOne.mockResolvedValue(employee);
            await expect(employee_service_1.employeeService.updatePerformanceGoal(employee_fixtures_1.uuid1, 'nonexistent-goal', { progress_percentage: 80 })).rejects.toThrow(errors_1.NotFoundError);
        });
        it('should throw NotFoundError if employee not found', async () => {
            mockEmployeeRepo.findOne.mockResolvedValue(null);
            await expect(employee_service_1.employeeService.updatePerformanceGoal('nonexistent', 'goal-id', { progress_percentage: 80 })).rejects.toThrow(errors_1.NotFoundError);
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
                .mockResolvedValueOnce([{ department_id: employee_fixtures_1.deptUuid, department_name: 'Engineering', count: '20' }])
                .mockResolvedValueOnce([{ location: 'SF', count: '30' }]);
            mockEmployeeRepo.queryBuilder.getRawOne.mockResolvedValue({ avg_tenure: '2.5' });
            mockEmployeeRepo.queryBuilder.getCount
                .mockResolvedValueOnce(5) // new hires
                .mockResolvedValueOnce(2) // terminations
                .mockResolvedValueOnce(3) // upcoming reviews
                .mockResolvedValueOnce(1); // probation ending
            const result = await employee_service_1.employeeService.getAnalytics();
            expect(result.total_employees).toBe(50);
            expect(result.active_employees).toBe(40);
            expect(result.remote_vs_onsite.remote).toBe(10);
        });
    });
    describe('getOrgChart', () => {
        it('should build org chart tree', async () => {
            const employees = [
                (0, employee_fixtures_1.createMockEmployee)({ id: employee_fixtures_1.uuid1, manager_id: null, first_name: 'CEO', last_name: 'Boss' }),
                (0, employee_fixtures_1.createMockEmployee)({ id: employee_fixtures_1.uuid2, manager_id: employee_fixtures_1.uuid1, first_name: 'VP', last_name: 'Sales' }),
            ];
            mockEmployeeRepo.queryBuilder.getMany.mockResolvedValue(employees);
            const result = await employee_service_1.employeeService.getOrgChart();
            expect(result).toHaveLength(1);
            expect(result[0].full_name).toBe('CEO Boss');
        });
        it('should throw NotFoundError for invalid root employee', async () => {
            mockEmployeeRepo.queryBuilder.getMany.mockResolvedValue([]);
            await expect(employee_service_1.employeeService.getOrgChart('nonexistent')).rejects.toThrow(errors_1.NotFoundError);
        });
    });
});
//# sourceMappingURL=employee.service.test.js.map