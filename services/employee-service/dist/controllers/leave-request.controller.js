"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectLeaveRequest = exports.approveLeaveRequest = exports.getLeaveRequest = exports.getTeamLeaveSummary = exports.getTeamLeaveRequests = exports.listLeaveRequests = exports.cancelLeaveRequest = exports.createLeaveRequest = exports.getMyLeaveBalances = exports.getMyLeaveRequests = void 0;
const leave_request_service_1 = require("../services/leave-request.service");
const logger_1 = require("../utils/logger");
const leave_request_dto_1 = require("../dto/leave-request.dto");
// Get current user's leave requests
const getMyLeaveRequests = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        const query = leave_request_dto_1.listLeaveRequestsQuerySchema.parse(req.query);
        let leaveRequests = [];
        let meta = { page: 1, limit: 10, total: 0, totalPages: 0 };
        try {
            const result = await leave_request_service_1.leaveRequestService.getMyLeaveRequests(userId, query);
            leaveRequests = result.leaveRequests;
            meta = result.meta;
        }
        catch (err) {
            // If no employee record exists, return empty list
            if (err.name === 'NotFoundError') {
                const response = {
                    success: true,
                    data: [],
                    meta: { pagination: meta },
                    message: 'No employee profile linked to this user account',
                };
                return res.status(200).json(response);
            }
            throw err;
        }
        const response = {
            success: true,
            data: leaveRequests,
            meta: { pagination: meta },
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getMyLeaveRequests = getMyLeaveRequests;
// Get current user's leave balances
const getMyLeaveBalances = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        let balances = [];
        try {
            balances = await leave_request_service_1.leaveRequestService.getMyLeaveBalances(userId);
        }
        catch (err) {
            // If no employee record exists, return empty balances
            if (err.name === 'NotFoundError') {
                const response = {
                    success: true,
                    data: [],
                    message: 'No employee profile linked to this user account',
                };
                return res.status(200).json(response);
            }
            throw err;
        }
        const response = {
            success: true,
            data: balances,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getMyLeaveBalances = getMyLeaveBalances;
// Create leave request
const createLeaveRequest = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        const data = leave_request_dto_1.createLeaveRequestSchema.parse(req.body);
        const leaveRequest = await leave_request_service_1.leaveRequestService.createLeaveRequest(userId, data);
        logger_1.logger.info('Leave request created via API:', {
            id: leaveRequest.id,
            userId,
        });
        const response = {
            success: true,
            data: leaveRequest,
            message: 'Leave request submitted successfully',
        };
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.createLeaveRequest = createLeaveRequest;
// Cancel leave request
const cancelLeaveRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        const leaveRequest = await leave_request_service_1.leaveRequestService.cancelLeaveRequest(id, userId);
        logger_1.logger.info('Leave request cancelled via API:', {
            id,
            userId,
        });
        const response = {
            success: true,
            data: leaveRequest,
            message: 'Leave request cancelled successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.cancelLeaveRequest = cancelLeaveRequest;
// List all leave requests (admin/manager)
const listLeaveRequests = async (req, res, next) => {
    try {
        const query = leave_request_dto_1.listLeaveRequestsQuerySchema.parse(req.query);
        const { leaveRequests, meta } = await leave_request_service_1.leaveRequestService.listLeaveRequests(query);
        const response = {
            success: true,
            data: leaveRequests,
            meta: { pagination: meta },
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.listLeaveRequests = listLeaveRequests;
// Get team's leave requests (manager)
const getTeamLeaveRequests = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        const query = leave_request_dto_1.listLeaveRequestsQuerySchema.parse(req.query);
        const { leaveRequests, meta } = await leave_request_service_1.leaveRequestService.getTeamLeaveRequests(userId, query);
        const response = {
            success: true,
            data: leaveRequests,
            meta: { pagination: meta },
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getTeamLeaveRequests = getTeamLeaveRequests;
// Get team leave summary (manager)
const getTeamLeaveSummary = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        const summary = await leave_request_service_1.leaveRequestService.getTeamLeaveSummary(userId);
        const response = {
            success: true,
            data: summary,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getTeamLeaveSummary = getTeamLeaveSummary;
// Get leave request by ID
const getLeaveRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const leaveRequest = await leave_request_service_1.leaveRequestService.getLeaveRequestById(id);
        const response = {
            success: true,
            data: leaveRequest,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getLeaveRequest = getLeaveRequest;
// Approve leave request
const approveLeaveRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const reviewerId = req.user?.id;
        if (!reviewerId) {
            throw new Error('User not authenticated');
        }
        const data = leave_request_dto_1.reviewLeaveRequestSchema.parse(req.body);
        const leaveRequest = await leave_request_service_1.leaveRequestService.approveLeaveRequest(id, reviewerId, data);
        logger_1.logger.info('Leave request approved via API:', {
            id,
            reviewerId,
        });
        const response = {
            success: true,
            data: leaveRequest,
            message: 'Leave request approved successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.approveLeaveRequest = approveLeaveRequest;
// Reject leave request
const rejectLeaveRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const reviewerId = req.user?.id;
        if (!reviewerId) {
            throw new Error('User not authenticated');
        }
        const data = leave_request_dto_1.reviewLeaveRequestSchema.parse(req.body);
        const leaveRequest = await leave_request_service_1.leaveRequestService.rejectLeaveRequest(id, reviewerId, data);
        logger_1.logger.info('Leave request rejected via API:', {
            id,
            reviewerId,
        });
        const response = {
            success: true,
            data: leaveRequest,
            message: 'Leave request rejected',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.rejectLeaveRequest = rejectLeaveRequest;
//# sourceMappingURL=leave-request.controller.js.map