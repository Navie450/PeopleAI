"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const employee_dto_1 = require("../../dto/employee.dto");
const Employee_1 = require("../../entities/Employee");
describe('Employee DTOs', () => {
    describe('createEmployeeSchema', () => {
        const validData = {
            user_id: '550e8400-e29b-41d4-a716-446655440001',
            first_name: 'John',
            last_name: 'Doe',
            work_email: 'john@company.com',
            job_title: 'Engineer',
            hire_date: '2024-01-15',
        };
        it('should validate valid employee data', () => {
            const result = employee_dto_1.createEmployeeSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
        it('should apply defaults', () => {
            const result = employee_dto_1.createEmployeeSchema.parse(validData);
            expect(result.employment_type).toBe(Employee_1.EmploymentType.FULL_TIME);
            expect(result.employment_status).toBe(Employee_1.EmploymentStatus.ACTIVE);
            expect(result.salary_currency).toBe('USD');
            expect(result.salary_frequency).toBe('annual');
            expect(result.is_remote).toBe(false);
        });
        it('should reject missing required fields', () => {
            expect(employee_dto_1.createEmployeeSchema.safeParse({}).success).toBe(false);
            expect(employee_dto_1.createEmployeeSchema.safeParse({ first_name: 'John' }).success).toBe(false);
        });
        it('should reject invalid email', () => {
            const result = employee_dto_1.createEmployeeSchema.safeParse({ ...validData, work_email: 'not-an-email' });
            expect(result.success).toBe(false);
        });
        it('should reject invalid UUID for user_id', () => {
            const result = employee_dto_1.createEmployeeSchema.safeParse({ ...validData, user_id: 'not-uuid' });
            expect(result.success).toBe(false);
        });
        it('should validate skills array', () => {
            const result = employee_dto_1.createEmployeeSchema.safeParse({
                ...validData,
                skills: [{ name: 'TypeScript', level: 'expert' }],
            });
            expect(result.success).toBe(true);
        });
        it('should reject invalid skill level', () => {
            const result = employee_dto_1.createEmployeeSchema.safeParse({
                ...validData,
                skills: [{ name: 'TS', level: 'godlike' }],
            });
            expect(result.success).toBe(false);
        });
        it('should handle empty strings as undefined for optional fields', () => {
            const result = employee_dto_1.createEmployeeSchema.parse({ ...validData, middle_name: '' });
            expect(result.middle_name).toBeUndefined();
        });
        it('should validate emergency contacts', () => {
            const result = employee_dto_1.createEmployeeSchema.safeParse({
                ...validData,
                emergency_contacts: [{ name: 'Jane', relationship: 'Spouse', phone: '+123' }],
            });
            expect(result.success).toBe(true);
        });
    });
    describe('updateEmployeeSchema', () => {
        it('should allow partial updates', () => {
            const result = employee_dto_1.updateEmployeeSchema.safeParse({ first_name: 'Jane' });
            expect(result.success).toBe(true);
        });
        it('should allow empty object', () => {
            const result = employee_dto_1.updateEmployeeSchema.safeParse({});
            expect(result.success).toBe(true);
        });
        it('should allow nullable fields', () => {
            const result = employee_dto_1.updateEmployeeSchema.safeParse({
                middle_name: null,
                manager_id: null,
            });
            expect(result.success).toBe(true);
        });
        it('should validate email format when provided', () => {
            const result = employee_dto_1.updateEmployeeSchema.safeParse({ work_email: 'bad-email' });
            expect(result.success).toBe(false);
        });
    });
    describe('listEmployeesQuerySchema', () => {
        it('should apply defaults', () => {
            const result = employee_dto_1.listEmployeesQuerySchema.parse({});
            expect(result.page).toBe(1);
            expect(result.limit).toBe(10);
            expect(result.sort_by).toBe('created_at');
            expect(result.sort_order).toBe('desc');
        });
        it('should coerce string page/limit to numbers', () => {
            const result = employee_dto_1.listEmployeesQuerySchema.parse({ page: '3', limit: '25' });
            expect(result.page).toBe(3);
            expect(result.limit).toBe(25);
        });
        it('should reject page < 1', () => {
            const result = employee_dto_1.listEmployeesQuerySchema.safeParse({ page: '0' });
            expect(result.success).toBe(false);
        });
        it('should reject limit > 100', () => {
            const result = employee_dto_1.listEmployeesQuerySchema.safeParse({ limit: '200' });
            expect(result.success).toBe(false);
        });
        it('should validate employment_status enum', () => {
            const result = employee_dto_1.listEmployeesQuerySchema.safeParse({ employment_status: 'invalid' });
            expect(result.success).toBe(false);
        });
        it('should accept valid sort_by values', () => {
            const result = employee_dto_1.listEmployeesQuerySchema.safeParse({ sort_by: 'first_name' });
            expect(result.success).toBe(true);
        });
    });
    describe('bulkUpdateEmployeesSchema', () => {
        it('should validate bulk update data', () => {
            const result = employee_dto_1.bulkUpdateEmployeesSchema.safeParse({
                employee_ids: ['550e8400-e29b-41d4-a716-446655440001'],
                updates: { is_remote: true },
            });
            expect(result.success).toBe(true);
        });
        it('should require at least one employee_id', () => {
            const result = employee_dto_1.bulkUpdateEmployeesSchema.safeParse({
                employee_ids: [],
                updates: {},
            });
            expect(result.success).toBe(false);
        });
    });
    describe('transferEmployeeSchema', () => {
        it('should validate transfer data', () => {
            const result = employee_dto_1.transferEmployeeSchema.safeParse({
                new_department_id: '550e8400-e29b-41d4-a716-446655440001',
                effective_date: '2024-06-01',
            });
            expect(result.success).toBe(true);
        });
        it('should require department_id and effective_date', () => {
            expect(employee_dto_1.transferEmployeeSchema.safeParse({}).success).toBe(false);
            expect(employee_dto_1.transferEmployeeSchema.safeParse({ new_department_id: '550e8400-e29b-41d4-a716-446655440001' }).success).toBe(false);
        });
    });
    describe('promoteEmployeeSchema', () => {
        it('should validate promotion data', () => {
            const result = employee_dto_1.promoteEmployeeSchema.safeParse({
                new_job_title: 'Senior Engineer',
                effective_date: '2024-06-01',
            });
            expect(result.success).toBe(true);
        });
        it('should require new_job_title and effective_date', () => {
            expect(employee_dto_1.promoteEmployeeSchema.safeParse({}).success).toBe(false);
        });
    });
    describe('terminateEmployeeSchema', () => {
        it('should validate termination data', () => {
            const result = employee_dto_1.terminateEmployeeSchema.safeParse({
                termination_date: '2024-06-01',
                termination_reason: 'Voluntary resignation',
            });
            expect(result.success).toBe(true);
        });
        it('should apply defaults', () => {
            const result = employee_dto_1.terminateEmployeeSchema.parse({
                termination_date: '2024-06-01',
                termination_reason: 'Resignation',
            });
            expect(result.eligible_for_rehire).toBe(true);
            expect(result.exit_interview_completed).toBe(false);
        });
        it('should require termination_reason min length', () => {
            const result = employee_dto_1.terminateEmployeeSchema.safeParse({
                termination_date: '2024-06-01',
                termination_reason: '',
            });
            expect(result.success).toBe(false);
        });
    });
    describe('updateLeaveBalanceSchema', () => {
        it('should validate leave balance data', () => {
            const result = employee_dto_1.updateLeaveBalanceSchema.safeParse({
                leave_type: 'annual',
                total_days: 20,
            });
            expect(result.success).toBe(true);
        });
        it('should require leave_type', () => {
            const result = employee_dto_1.updateLeaveBalanceSchema.safeParse({ total_days: 20 });
            expect(result.success).toBe(false);
        });
    });
    describe('addPerformanceGoalSchema', () => {
        it('should validate goal data', () => {
            const result = employee_dto_1.addPerformanceGoalSchema.safeParse({
                title: 'Complete project',
                description: 'Finish by Q2',
                target_date: '2024-06-30',
            });
            expect(result.success).toBe(true);
        });
        it('should apply defaults', () => {
            const result = employee_dto_1.addPerformanceGoalSchema.parse({
                title: 'Goal',
                description: 'Desc',
                target_date: '2024-06-30',
            });
            expect(result.status).toBe('not_started');
            expect(result.progress_percentage).toBe(0);
        });
    });
    describe('updatePerformanceGoalSchema', () => {
        it('should validate partial goal updates', () => {
            const result = employee_dto_1.updatePerformanceGoalSchema.safeParse({
                goal_id: '550e8400-e29b-41d4-a716-446655440001',
                progress_percentage: 75,
                status: 'in_progress',
            });
            expect(result.success).toBe(true);
        });
        it('should reject progress > 100', () => {
            const result = employee_dto_1.updatePerformanceGoalSchema.safeParse({
                goal_id: '550e8400-e29b-41d4-a716-446655440001',
                progress_percentage: 150,
            });
            expect(result.success).toBe(false);
        });
    });
});
//# sourceMappingURL=employee.dto.test.js.map