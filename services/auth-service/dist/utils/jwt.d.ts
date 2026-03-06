export interface JWTPayload {
    sub: string;
    email: string;
    roles: string[];
    iat?: number;
    exp?: number;
}
export declare const generateAccessToken: (userId: string, email: string, roles: string[]) => string;
export declare const generateRefreshToken: (userId: string, email: string) => string;
export declare const verifyAccessToken: (token: string) => JWTPayload;
export declare const verifyRefreshToken: (token: string) => {
    sub: string;
    email: string;
    type: string;
};
export declare const extractTokenFromHeader: (authHeader?: string) => string | null;
//# sourceMappingURL=jwt.d.ts.map