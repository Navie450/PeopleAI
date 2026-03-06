"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_routes_1 = __importDefault(require("./health.routes"));
const employee_routes_1 = __importDefault(require("./employee.routes"));
const department_routes_1 = __importDefault(require("./department.routes"));
const leave_request_routes_1 = __importDefault(require("./leave-request.routes"));
const announcement_routes_1 = __importDefault(require("./announcement.routes"));
const router = (0, express_1.Router)();
router.use('/health', health_routes_1.default);
router.use('/employees', employee_routes_1.default);
router.use('/departments', department_routes_1.default);
router.use('/leave-requests', leave_request_routes_1.default);
router.use('/announcements', announcement_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map