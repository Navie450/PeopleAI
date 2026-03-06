"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePasswordStrength = exports.verifyPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = require("./logger");
const SALT_ROUNDS = 10;
const hashPassword = async (password) => {
    try {
        const hash = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        return hash;
    }
    catch (error) {
        logger_1.logger.error('Failed to hash password:', error);
        throw new Error('Failed to hash password');
    }
};
exports.hashPassword = hashPassword;
const verifyPassword = async (password, hash) => {
    try {
        const isMatch = await bcrypt_1.default.compare(password, hash);
        return isMatch;
    }
    catch (error) {
        logger_1.logger.error('Failed to verify password:', error);
        return false;
    }
};
exports.verifyPassword = verifyPassword;
const validatePasswordStrength = (password) => {
    const errors = [];
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validatePasswordStrength = validatePasswordStrength;
//# sourceMappingURL=password.js.map