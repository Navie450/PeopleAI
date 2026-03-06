export declare const hashPassword: (password: string) => Promise<string>;
export declare const verifyPassword: (password: string, hash: string) => Promise<boolean>;
export declare const validatePasswordStrength: (password: string) => {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=password.d.ts.map