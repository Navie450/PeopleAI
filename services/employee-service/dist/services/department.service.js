"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentService = void 0;
const database_1 = require("../config/database");
const Department_1 = require("../entities/Department");
const Employee_1 = require("../entities/Employee");
const AuditLog_1 = require("../entities/AuditLog");
const typeorm_1 = require("typeorm");
const logger_1 = require("../utils/logger");
const errors_1 = require("../utils/errors");
class DepartmentService {
    async listDepartments(query) {
        const departmentRepository = database_1.AppDataSource.getRepository(Department_1.Department);
        const employeeRepository = database_1.AppDataSource.getRepository(Employee_1.Employee);
        const page = query.page || 1;
        const limit = Math.min(query.limit || 10, 100);
        const skip = (page - 1) * limit;
        const queryBuilder = departmentRepository
            .createQueryBuilder('department')
            .leftJoinAndSelect('department.parent', 'parent')
            .where('department.deleted_at IS NULL');
        // Apply filters
        if (query.search) {
            queryBuilder.andWhere('(department.name ILIKE :search OR department.code ILIKE :search)', { search: `%${query.search}%` });
        }
        if (query.parent_id) {
            queryBuilder.andWhere('department.parent_id = :parentId', {
                parentId: query.parent_id,
            });
        }
        if (query.is_active !== undefined) {
            queryBuilder.andWhere('department.is_active = :isActive', {
                isActive: query.is_active,
            });
        }
        // Get total count
        const total = await queryBuilder.getCount();
        // Get paginated results
        const departments = await queryBuilder
            .skip(skip)
            .take(limit)
            .orderBy('department.name', 'ASC')
            .getMany();
        // Get employee counts for each department
        const departmentResponses = await Promise.all(departments.map(async (dept) => {
            const employeeCount = await employeeRepository.count({
                where: { department_id: dept.id, deleted_at: (0, typeorm_1.IsNull)() },
            });
            // Get manager name if exists
            let managerName;
            if (dept.manager_id) {
                const manager = await employeeRepository.findOne({
                    where: { id: dept.manager_id },
                });
                if (manager) {
                    managerName = `${manager.first_name} ${manager.last_name}`;
                }
            }
            return {
                id: dept.id,
                name: dept.name,
                code: dept.code,
                description: dept.description,
                parent_id: dept.parent_id,
                parent_name: dept.parent?.name,
                manager_id: dept.manager_id,
                manager_name: managerName,
                location: dept.location,
                employee_count: employeeCount,
                is_active: dept.is_active,
                created_at: dept.created_at,
            };
        }));
        const meta = {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
        return { departments: departmentResponses, meta };
    }
    async getDepartmentById(departmentId) {
        const departmentRepository = database_1.AppDataSource.getRepository(Department_1.Department);
        const employeeRepository = database_1.AppDataSource.getRepository(Employee_1.Employee);
        const department = await departmentRepository
            .createQueryBuilder('department')
            .leftJoinAndSelect('department.parent', 'parent')
            .leftJoinAndSelect('department.children', 'children')
            .where('department.id = :departmentId', { departmentId })
            .andWhere('department.deleted_at IS NULL')
            .getOne();
        if (!department) {
            throw new errors_1.NotFoundError('Department not found');
        }
        // Get employee count
        const employeeCount = await employeeRepository.count({
            where: { department_id: department.id, deleted_at: (0, typeorm_1.IsNull)() },
        });
        // Get manager name
        let managerName;
        if (department.manager_id) {
            const manager = await employeeRepository.findOne({
                where: { id: department.manager_id },
            });
            if (manager) {
                managerName = `${manager.first_name} ${manager.last_name}`;
            }
        }
        // Map children
        const childrenResponses = await Promise.all((department.children || [])
            .filter((child) => !child.deleted_at)
            .map(async (child) => {
            const childEmployeeCount = await employeeRepository.count({
                where: { department_id: child.id, deleted_at: (0, typeorm_1.IsNull)() },
            });
            return {
                id: child.id,
                name: child.name,
                code: child.code,
                description: child.description,
                parent_id: child.parent_id,
                employee_count: childEmployeeCount,
                is_active: child.is_active,
                created_at: child.created_at,
            };
        }));
        return {
            id: department.id,
            name: department.name,
            code: department.code,
            description: department.description,
            parent_id: department.parent_id,
            parent_name: department.parent?.name,
            manager_id: department.manager_id,
            manager_name: managerName,
            location: department.location,
            budget: department.budget ? Number(department.budget) : undefined,
            employee_count: employeeCount,
            is_active: department.is_active,
            children: childrenResponses,
            metadata: department.metadata,
            created_at: department.created_at,
            updated_at: department.updated_at,
        };
    }
    async createDepartment(departmentData, createdBy) {
        const departmentRepository = database_1.AppDataSource.getRepository(Department_1.Department);
        // Check if code already exists
        const existingDepartment = await departmentRepository.findOne({
            where: { code: departmentData.code },
        });
        if (existingDepartment) {
            throw new errors_1.ConflictError('Department with this code already exists');
        }
        // Validate parent if provided
        if (departmentData.parent_id) {
            const parent = await departmentRepository.findOne({
                where: { id: departmentData.parent_id, deleted_at: (0, typeorm_1.IsNull)() },
            });
            if (!parent) {
                throw new errors_1.ValidationError('Invalid parent department ID');
            }
        }
        // Validate manager if provided
        if (departmentData.manager_id) {
            const employeeRepository = database_1.AppDataSource.getRepository(Employee_1.Employee);
            const manager = await employeeRepository.findOne({
                where: { id: departmentData.manager_id, deleted_at: (0, typeorm_1.IsNull)() },
            });
            if (!manager) {
                throw new errors_1.ValidationError('Invalid manager ID');
            }
        }
        try {
            const department = departmentRepository.create(departmentData);
            await departmentRepository.save(department);
            // Create audit log
            await this.createAuditLog({
                user_id: createdBy,
                action: 'CREATE_DEPARTMENT',
                resource_type: 'department',
                resource_id: department.id,
                changes: {
                    created: {
                        name: department.name,
                        code: department.code,
                    },
                },
            });
            logger_1.logger.info('Department created successfully:', {
                departmentId: department.id,
                code: department.code,
            });
            return this.getDepartmentById(department.id);
        }
        catch (error) {
            logger_1.logger.error('Failed to create department:', error);
            throw error;
        }
    }
    async updateDepartment(departmentId, departmentData, updatedBy) {
        const departmentRepository = database_1.AppDataSource.getRepository(Department_1.Department);
        const department = await departmentRepository.findOne({
            where: { id: departmentId, deleted_at: (0, typeorm_1.IsNull)() },
        });
        if (!department) {
            throw new errors_1.NotFoundError('Department not found');
        }
        const changes = {};
        // Check for code conflicts
        if (departmentData.code && departmentData.code !== department.code) {
            const existingDepartment = await departmentRepository.findOne({
                where: { code: departmentData.code },
            });
            if (existingDepartment) {
                throw new errors_1.ConflictError('Department with this code already exists');
            }
            changes.code = { from: department.code, to: departmentData.code };
        }
        // Validate parent if being changed
        if (departmentData.parent_id && departmentData.parent_id !== department.parent_id) {
            if (departmentData.parent_id === departmentId) {
                throw new errors_1.ValidationError('Department cannot be its own parent');
            }
            const parent = await departmentRepository.findOne({
                where: { id: departmentData.parent_id, deleted_at: (0, typeorm_1.IsNull)() },
            });
            if (!parent) {
                throw new errors_1.ValidationError('Invalid parent department ID');
            }
            // Check for circular reference
            let currentParent = parent;
            while (currentParent.parent_id) {
                if (currentParent.parent_id === departmentId) {
                    throw new errors_1.ValidationError('Circular reference detected in department hierarchy');
                }
                currentParent = await departmentRepository.findOne({
                    where: { id: currentParent.parent_id },
                });
            }
            changes.parent_id = { from: department.parent_id, to: departmentData.parent_id };
        }
        // Update department
        Object.assign(department, departmentData);
        await departmentRepository.save(department);
        // Create audit log
        if (Object.keys(changes).length > 0) {
            await this.createAuditLog({
                user_id: updatedBy,
                action: 'UPDATE_DEPARTMENT',
                resource_type: 'department',
                resource_id: departmentId,
                changes,
            });
        }
        logger_1.logger.info('Department updated successfully:', { departmentId });
        return this.getDepartmentById(departmentId);
    }
    async deleteDepartment(departmentId, deletedBy) {
        const departmentRepository = database_1.AppDataSource.getRepository(Department_1.Department);
        const employeeRepository = database_1.AppDataSource.getRepository(Employee_1.Employee);
        const department = await departmentRepository.findOne({
            where: { id: departmentId, deleted_at: (0, typeorm_1.IsNull)() },
        });
        if (!department) {
            throw new errors_1.NotFoundError('Department not found');
        }
        // Check if department has employees
        const employeeCount = await employeeRepository.count({
            where: { department_id: departmentId, deleted_at: (0, typeorm_1.IsNull)() },
        });
        if (employeeCount > 0) {
            throw new errors_1.ValidationError(`Cannot delete department with ${employeeCount} employee(s). Please reassign employees first.`);
        }
        // Check if department has children
        const childCount = await departmentRepository.count({
            where: { parent_id: departmentId, deleted_at: (0, typeorm_1.IsNull)() },
        });
        if (childCount > 0) {
            throw new errors_1.ValidationError(`Cannot delete department with ${childCount} sub-department(s). Please reassign or delete sub-departments first.`);
        }
        // Soft delete
        department.deleted_at = new Date();
        department.is_active = false;
        await departmentRepository.save(department);
        // Create audit log
        await this.createAuditLog({
            user_id: deletedBy,
            action: 'DELETE_DEPARTMENT',
            resource_type: 'department',
            resource_id: departmentId,
            changes: {
                deleted: {
                    name: department.name,
                    code: department.code,
                },
            },
        });
        logger_1.logger.info('Department deleted successfully:', { departmentId });
    }
    async getDepartmentHierarchy() {
        const departmentRepository = database_1.AppDataSource.getRepository(Department_1.Department);
        const departments = await departmentRepository.find({
            where: { deleted_at: (0, typeorm_1.IsNull)(), is_active: true },
            order: { name: 'ASC' },
        });
        const buildTree = (parentId) => {
            return departments
                .filter((dept) => dept.parent_id === parentId)
                .map((dept) => ({
                id: dept.id,
                name: dept.name,
                code: dept.code,
                children: buildTree(dept.id),
            }));
        };
        return buildTree(null);
    }
    async getDepartmentEmployees(departmentId) {
        const departmentRepository = database_1.AppDataSource.getRepository(Department_1.Department);
        const employeeRepository = database_1.AppDataSource.getRepository(Employee_1.Employee);
        const department = await departmentRepository.findOne({
            where: { id: departmentId, deleted_at: (0, typeorm_1.IsNull)() },
        });
        if (!department) {
            throw new errors_1.NotFoundError('Department not found');
        }
        const employees = await employeeRepository.find({
            where: { department_id: departmentId, deleted_at: (0, typeorm_1.IsNull)() },
            order: { first_name: 'ASC' },
        });
        return {
            department: {
                id: department.id,
                name: department.name,
                code: department.code,
                description: department.description,
                location: department.location,
                is_active: department.is_active,
                created_at: department.created_at,
            },
            employees: employees.map((emp) => ({
                id: emp.id,
                employee_id: emp.employee_id,
                full_name: `${emp.first_name} ${emp.last_name}`,
                job_title: emp.job_title,
                work_email: emp.work_email,
            })),
        };
    }
    async createAuditLog(data) {
        const auditLogRepository = database_1.AppDataSource.getRepository(AuditLog_1.AuditLog);
        const auditLog = auditLogRepository.create(data);
        await auditLogRepository.save(auditLog);
    }
}
exports.departmentService = new DepartmentService();
//# sourceMappingURL=department.service.js.map