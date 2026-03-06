"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDepartmentsQuerySchema = exports.updateDepartmentSchema = exports.createDepartmentSchema = void 0;
const zod_1 = require("zod");
// Create Department Schema
exports.createDepartmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Department name is required'),
    code: zod_1.z.string().min(1, 'Department code is required').max(20),
    description: zod_1.z.string().optional(),
    parent_id: zod_1.z.string().uuid().optional(),
    manager_id: zod_1.z.string().uuid().optional(),
    location: zod_1.z.string().optional(),
    budget: zod_1.z.number().min(0).optional(),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
});
// Update Department Schema
exports.updateDepartmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    code: zod_1.z.string().min(1).max(20).optional(),
    description: zod_1.z.string().nullable().optional(),
    parent_id: zod_1.z.string().uuid().nullable().optional(),
    manager_id: zod_1.z.string().uuid().nullable().optional(),
    location: zod_1.z.string().nullable().optional(),
    budget: zod_1.z.number().min(0).nullable().optional(),
    is_active: zod_1.z.boolean().optional(),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
});
// List Departments Query Schema
exports.listDepartmentsQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    search: zod_1.z.string().optional(),
    parent_id: zod_1.z.string().uuid().optional(),
    is_active: zod_1.z.coerce.boolean().optional(),
    include_children: zod_1.z.coerce.boolean().default(false),
});
//# sourceMappingURL=department.dto.js.map