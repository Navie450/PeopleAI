"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMyGoalProgress = exports.updateMyEmergencyContacts = exports.updateMyContactInfo = exports.updatePerformanceGoal = exports.addPerformanceGoal = exports.updateLeaveBalance = exports.updateSkills = exports.getEmployeesBySkill = exports.searchEmployees = exports.getAnalytics = exports.getOrgChart = exports.getDirectReports = exports.terminateEmployee = exports.promoteEmployee = exports.transferEmployee = exports.bulkUpdateEmployees = exports.deleteEmployee = exports.updateEmployee = exports.createEmployee = exports.getMyProfile = exports.getEmployeeByUserId = exports.getEmployee = exports.listEmployees = void 0;
const employee_service_1 = require("../services/employee.service");
const logger_1 = require("../utils/logger");
const employee_dto_1 = require("../dto/employee.dto");
// List all employees with pagination and filters
const listEmployees = async (req, res, next) => {
    try {
        const query = employee_dto_1.listEmployeesQuerySchema.parse(req.query);
        const { employees, meta } = await employee_service_1.employeeService.listEmployees(query);
        const response = {
            success: true,
            data: employees,
            meta: { pagination: meta },
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.listEmployees = listEmployees;
// Get single employee by ID
const getEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await employee_service_1.employeeService.getEmployeeById(id);
        const response = {
            success: true,
            data: employee,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getEmployee = getEmployee;
// Get employee by user ID (for self-service)
const getEmployeeByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.user?.id;
        if (!userId) {
            throw new Error('User ID is required');
        }
        const employee = await employee_service_1.employeeService.getEmployeeByUserId(userId);
        const response = {
            success: true,
            data: employee,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getEmployeeByUserId = getEmployeeByUserId;
// Get current user's employee profile
const getMyProfile = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        let employee = null;
        try {
            employee = await employee_service_1.employeeService.getEmployeeByUserId(userId);
        }
        catch (err) {
            // If no employee record exists, return null instead of error
            if (err.name === 'NotFoundError') {
                const response = {
                    success: true,
                    data: null,
                    message: 'No employee profile linked to this user account',
                };
                return res.status(200).json(response);
            }
            throw err;
        }
        const response = {
            success: true,
            data: employee,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getMyProfile = getMyProfile;
// Create new employee
const createEmployee = async (req, res, next) => {
    try {
        const data = employee_dto_1.createEmployeeSchema.parse(req.body);
        const createdBy = req.user?.id;
        const employee = await employee_service_1.employeeService.createEmployee(data, createdBy);
        logger_1.logger.info('Employee created via API:', {
            employeeId: employee.id,
            createdBy,
        });
        const response = {
            success: true,
            data: employee,
            message: 'Employee created successfully',
        };
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.createEmployee = createEmployee;
// Update employee
const updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = employee_dto_1.updateEmployeeSchema.parse(req.body);
        const updatedBy = req.user?.id;
        const employee = await employee_service_1.employeeService.updateEmployee(id, data, updatedBy);
        logger_1.logger.info('Employee updated via API:', {
            employeeId: id,
            updatedBy,
        });
        const response = {
            success: true,
            data: employee,
            message: 'Employee updated successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.updateEmployee = updateEmployee;
// Delete employee
const deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedBy = req.user?.id;
        await employee_service_1.employeeService.deleteEmployee(id, deletedBy);
        logger_1.logger.info('Employee deleted via API:', {
            employeeId: id,
            deletedBy,
        });
        const response = {
            success: true,
            message: 'Employee deleted successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteEmployee = deleteEmployee;
// Bulk update employees
const bulkUpdateEmployees = async (req, res, next) => {
    try {
        const data = employee_dto_1.bulkUpdateEmployeesSchema.parse(req.body);
        const updatedBy = req.user?.id;
        const result = await employee_service_1.employeeService.bulkUpdateEmployees(data, updatedBy);
        logger_1.logger.info('Bulk employee update via API:', {
            updated: result.updated,
            failed: result.failed.length,
            updatedBy,
        });
        const response = {
            success: true,
            data: result,
            message: `Successfully updated ${result.updated} employee(s)`,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.bulkUpdateEmployees = bulkUpdateEmployees;
// Transfer employee
const transferEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = employee_dto_1.transferEmployeeSchema.parse(req.body);
        const transferredBy = req.user?.id;
        const employee = await employee_service_1.employeeService.transferEmployee(id, data, transferredBy);
        logger_1.logger.info('Employee transferred via API:', {
            employeeId: id,
            transferredBy,
        });
        const response = {
            success: true,
            data: employee,
            message: 'Employee transferred successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.transferEmployee = transferEmployee;
// Promote employee
const promoteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = employee_dto_1.promoteEmployeeSchema.parse(req.body);
        const promotedBy = req.user?.id;
        const employee = await employee_service_1.employeeService.promoteEmployee(id, data, promotedBy);
        logger_1.logger.info('Employee promoted via API:', {
            employeeId: id,
            promotedBy,
        });
        const response = {
            success: true,
            data: employee,
            message: 'Employee promoted successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.promoteEmployee = promoteEmployee;
// Terminate employee
const terminateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = employee_dto_1.terminateEmployeeSchema.parse(req.body);
        const terminatedBy = req.user?.id;
        const employee = await employee_service_1.employeeService.terminateEmployee(id, data, terminatedBy);
        logger_1.logger.info('Employee terminated via API:', {
            employeeId: id,
            terminatedBy,
        });
        const response = {
            success: true,
            data: employee,
            message: 'Employee terminated successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.terminateEmployee = terminateEmployee;
// Get direct reports
const getDirectReports = async (req, res, next) => {
    try {
        const { id } = req.params;
        const directReports = await employee_service_1.employeeService.getDirectReports(id);
        const response = {
            success: true,
            data: directReports,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getDirectReports = getDirectReports;
// Get org chart
const getOrgChart = async (req, res, next) => {
    try {
        const { rootId } = req.query;
        const orgChart = await employee_service_1.employeeService.getOrgChart(rootId);
        const response = {
            success: true,
            data: orgChart,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getOrgChart = getOrgChart;
// Get analytics
const getAnalytics = async (req, res, next) => {
    try {
        const analytics = await employee_service_1.employeeService.getAnalytics();
        const response = {
            success: true,
            data: analytics,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getAnalytics = getAnalytics;
// Search employees
const searchEmployees = async (req, res, next) => {
    try {
        const { q, limit } = req.query;
        const employees = await employee_service_1.employeeService.searchEmployees(q, limit ? parseInt(limit, 10) : 10);
        const response = {
            success: true,
            data: employees,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.searchEmployees = searchEmployees;
// Get employees by skill
const getEmployeesBySkill = async (req, res, next) => {
    try {
        const { skill, minLevel } = req.query;
        const employees = await employee_service_1.employeeService.getEmployeesBySkill(skill, minLevel);
        const response = {
            success: true,
            data: employees,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getEmployeesBySkill = getEmployeesBySkill;
// Update skills
const updateSkills = async (req, res, next) => {
    try {
        const { id } = req.params;
        const skills = req.body.skills;
        const updatedBy = req.user?.id;
        // Validate each skill
        skills.forEach((skill) => employee_dto_1.addSkillSchema.parse(skill));
        const employee = await employee_service_1.employeeService.updateSkills(id, skills, updatedBy);
        const response = {
            success: true,
            data: employee,
            message: 'Skills updated successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.updateSkills = updateSkills;
// Update leave balance
const updateLeaveBalance = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = employee_dto_1.updateLeaveBalanceSchema.parse(req.body);
        const updatedBy = req.user?.id;
        const employee = await employee_service_1.employeeService.updateLeaveBalance(id, data.leave_type, {
            total_days: data.total_days,
            used_days: data.used_days,
            pending_days: data.pending_days,
            carry_forward_days: data.carry_forward_days,
        }, updatedBy);
        const response = {
            success: true,
            data: employee,
            message: 'Leave balance updated successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.updateLeaveBalance = updateLeaveBalance;
// Add performance goal
const addPerformanceGoal = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = employee_dto_1.addPerformanceGoalSchema.parse(req.body);
        const addedBy = req.user?.id;
        const employee = await employee_service_1.employeeService.addPerformanceGoal(id, data, addedBy);
        const response = {
            success: true,
            data: employee,
            message: 'Performance goal added successfully',
        };
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.addPerformanceGoal = addPerformanceGoal;
// Update performance goal
const updatePerformanceGoal = async (req, res, next) => {
    try {
        const { id, goalId } = req.params;
        const data = employee_dto_1.updatePerformanceGoalSchema.parse({ ...req.body, goal_id: goalId });
        const updatedBy = req.user?.id;
        const employee = await employee_service_1.employeeService.updatePerformanceGoal(id, goalId, {
            title: data.title,
            description: data.description,
            target_date: data.target_date,
            status: data.status,
            progress_percentage: data.progress_percentage,
        }, updatedBy);
        const response = {
            success: true,
            data: employee,
            message: 'Performance goal updated successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.updatePerformanceGoal = updatePerformanceGoal;
// ============================================
// SELF-SERVICE ROUTES
// ============================================
// Update own contact info
const updateMyContactInfo = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        const employee = await employee_service_1.employeeService.getEmployeeByUserId(userId);
        // Only allow updating contact-related fields
        const allowedFields = {
            personal_email: req.body.personal_email,
            personal_phone: req.body.personal_phone,
            address_line1: req.body.address_line1,
            address_line2: req.body.address_line2,
            city: req.body.city,
            state: req.body.state,
            postal_code: req.body.postal_code,
            country: req.body.country,
        };
        // Remove undefined values
        const updates = Object.fromEntries(Object.entries(allowedFields).filter(([_, v]) => v !== undefined));
        const updatedEmployee = await employee_service_1.employeeService.updateEmployee(employee.id, updates, userId);
        logger_1.logger.info('Employee updated own contact info:', {
            employeeId: employee.id,
            userId,
        });
        const response = {
            success: true,
            data: updatedEmployee,
            message: 'Contact information updated successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.updateMyContactInfo = updateMyContactInfo;
// Update own emergency contacts
const updateMyEmergencyContacts = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        const employee = await employee_service_1.employeeService.getEmployeeByUserId(userId);
        const updatedEmployee = await employee_service_1.employeeService.updateEmployee(employee.id, { emergency_contacts: req.body.emergency_contacts }, userId);
        logger_1.logger.info('Employee updated own emergency contacts:', {
            employeeId: employee.id,
            userId,
        });
        const response = {
            success: true,
            data: updatedEmployee,
            message: 'Emergency contacts updated successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.updateMyEmergencyContacts = updateMyEmergencyContacts;
// Update own goal progress
const updateMyGoalProgress = async (req, res, next) => {
    try {
        const { goalId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        const employee = await employee_service_1.employeeService.getEmployeeByUserId(userId);
        // Only allow updating progress_percentage and status for self-service
        const updates = {
            progress_percentage: req.body.progress_percentage,
            status: req.body.status,
        };
        const updatedEmployee = await employee_service_1.employeeService.updatePerformanceGoal(employee.id, goalId, updates, userId);
        logger_1.logger.info('Employee updated own goal progress:', {
            employeeId: employee.id,
            goalId,
            userId,
        });
        const response = {
            success: true,
            data: updatedEmployee,
            message: 'Goal progress updated successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.updateMyGoalProgress = updateMyGoalProgress;
//# sourceMappingURL=employee.controller.js.map