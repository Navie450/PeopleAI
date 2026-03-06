"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartmentEmployees = exports.getDepartmentHierarchy = exports.deleteDepartment = exports.updateDepartment = exports.createDepartment = exports.getDepartment = exports.listDepartments = void 0;
const department_service_1 = require("../services/department.service");
const logger_1 = require("../utils/logger");
const department_dto_1 = require("../dto/department.dto");
// List all departments with pagination and filters
const listDepartments = async (req, res, next) => {
    try {
        const query = department_dto_1.listDepartmentsQuerySchema.parse(req.query);
        const { departments, meta } = await department_service_1.departmentService.listDepartments(query);
        const response = {
            success: true,
            data: departments,
            meta: { pagination: meta },
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.listDepartments = listDepartments;
// Get single department by ID
const getDepartment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const department = await department_service_1.departmentService.getDepartmentById(id);
        const response = {
            success: true,
            data: department,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getDepartment = getDepartment;
// Create new department
const createDepartment = async (req, res, next) => {
    try {
        const data = department_dto_1.createDepartmentSchema.parse(req.body);
        const createdBy = req.user?.id;
        const department = await department_service_1.departmentService.createDepartment(data, createdBy);
        logger_1.logger.info('Department created via API:', {
            departmentId: department.id,
            createdBy,
        });
        const response = {
            success: true,
            data: department,
            message: 'Department created successfully',
        };
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.createDepartment = createDepartment;
// Update department
const updateDepartment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = department_dto_1.updateDepartmentSchema.parse(req.body);
        const updatedBy = req.user?.id;
        const department = await department_service_1.departmentService.updateDepartment(id, data, updatedBy);
        logger_1.logger.info('Department updated via API:', {
            departmentId: id,
            updatedBy,
        });
        const response = {
            success: true,
            data: department,
            message: 'Department updated successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.updateDepartment = updateDepartment;
// Delete department
const deleteDepartment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedBy = req.user?.id;
        await department_service_1.departmentService.deleteDepartment(id, deletedBy);
        logger_1.logger.info('Department deleted via API:', {
            departmentId: id,
            deletedBy,
        });
        const response = {
            success: true,
            message: 'Department deleted successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteDepartment = deleteDepartment;
// Get department hierarchy
const getDepartmentHierarchy = async (req, res, next) => {
    try {
        const hierarchy = await department_service_1.departmentService.getDepartmentHierarchy();
        const response = {
            success: true,
            data: hierarchy,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getDepartmentHierarchy = getDepartmentHierarchy;
// Get employees in department
const getDepartmentEmployees = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await department_service_1.departmentService.getDepartmentEmployees(id);
        const response = {
            success: true,
            data: result,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getDepartmentEmployees = getDepartmentEmployees;
//# sourceMappingURL=department.controller.js.map