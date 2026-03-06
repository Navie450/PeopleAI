"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersQuerySchema = exports.assignRoleSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    username: zod_1.z.string().min(3, 'Username must be at least 3 characters').optional(),
    first_name: zod_1.z.string().min(1, 'First name is required').optional(),
    last_name: zod_1.z.string().min(1, 'Last name is required').optional(),
    display_name: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters').optional(),
    roles: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address').optional(),
    username: zod_1.z.string().min(3, 'Username must be at least 3 characters').optional(),
    first_name: zod_1.z.string().min(1, 'First name is required').optional(),
    last_name: zod_1.z.string().min(1, 'Last name is required').optional(),
    display_name: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    is_active: zod_1.z.boolean().optional(),
});
exports.assignRoleSchema = zod_1.z.object({
    role_name: zod_1.z.string().min(1, 'Role name is required'),
});
exports.listUsersQuerySchema = zod_1.z.object({
    page: zod_1.z.string().transform(Number).optional(),
    limit: zod_1.z.string().transform(Number).optional(),
    search: zod_1.z.string().optional(),
    role: zod_1.z.string().optional(),
    is_active: zod_1.z.string().transform((val) => val === 'true').optional(),
});
//# sourceMappingURL=user.dto.js.map