"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRole = exports.assignRole = exports.getUserRoles = exports.deactivateUser = exports.activateUser = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.listUsers = void 0;
const user_service_1 = require("../services/user.service");
const user_dto_1 = require("../dto/user.dto");
const logger_1 = require("../utils/logger");
const listUsers = async (req, res, next) => {
    try {
        const query = user_dto_1.listUsersQuerySchema.parse(req.query);
        const { users, meta } = await user_service_1.userService.listUsers(query);
        const response = {
            success: true,
            data: users,
            meta: { pagination: meta },
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.listUsers = listUsers;
const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await user_service_1.userService.getUserById(id);
        const response = {
            success: true,
            data: user,
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getUser = getUser;
const createUser = async (req, res, next) => {
    try {
        const userData = user_dto_1.createUserSchema.parse(req.body);
        const createdBy = req.user?.id;
        const user = await user_service_1.userService.createUser(userData, createdBy);
        const response = {
            success: true,
            data: user,
            message: 'User created successfully',
        };
        logger_1.logger.info('User created via API:', {
            userId: user.id,
            createdBy,
        });
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userData = user_dto_1.updateUserSchema.parse(req.body);
        const updatedBy = req.user?.id;
        const user = await user_service_1.userService.updateUser(id, userData, updatedBy);
        const response = {
            success: true,
            data: user,
            message: 'User updated successfully',
        };
        logger_1.logger.info('User updated via API:', {
            userId: id,
            updatedBy,
        });
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedBy = req.user?.id;
        await user_service_1.userService.deleteUser(id, deletedBy);
        const response = {
            success: true,
            message: 'User deleted successfully',
        };
        logger_1.logger.info('User deleted via API:', {
            userId: id,
            deletedBy,
        });
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
const activateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const activatedBy = req.user?.id;
        const user = await user_service_1.userService.activateUser(id, activatedBy);
        const response = {
            success: true,
            data: user,
            message: 'User activated successfully',
        };
        logger_1.logger.info('User activated via API:', {
            userId: id,
            activatedBy,
        });
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.activateUser = activateUser;
const deactivateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deactivatedBy = req.user?.id;
        const user = await user_service_1.userService.deactivateUser(id, deactivatedBy);
        const response = {
            success: true,
            data: user,
            message: 'User deactivated successfully',
        };
        logger_1.logger.info('User deactivated via API:', {
            userId: id,
            deactivatedBy,
        });
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.deactivateUser = deactivateUser;
const getUserRoles = async (req, res, next) => {
    try {
        const { id } = req.params;
        const roles = await user_service_1.userService.getUserRoles(id);
        const response = {
            success: true,
            data: roles,
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserRoles = getUserRoles;
const assignRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role_name } = user_dto_1.assignRoleSchema.parse(req.body);
        const assignedBy = req.user?.id;
        await user_service_1.userService.assignRole(id, role_name, assignedBy);
        const response = {
            success: true,
            message: `Role '${role_name}' assigned successfully`,
        };
        logger_1.logger.info('Role assigned via API:', {
            userId: id,
            roleName: role_name,
            assignedBy,
        });
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.assignRole = assignRole;
const removeRole = async (req, res, next) => {
    try {
        const { id, roleId } = req.params;
        const removedBy = req.user?.id;
        await user_service_1.userService.removeRole(id, roleId, removedBy);
        const response = {
            success: true,
            message: 'Role removed successfully',
        };
        logger_1.logger.info('Role removed via API:', {
            userId: id,
            roleId,
            removedBy,
        });
        res.json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.removeRole = removeRole;
//# sourceMappingURL=user.controller.js.map