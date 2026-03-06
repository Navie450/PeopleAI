export interface JWTPayload {
    sub: string;
    email: string;
    roles: string[];
    iat?: number;
    exp?: number;
}
export declare const verifyAccessToken: (token: string) => JWTPayload;
export declare const extractTokenFromHeader: (authHeader?: string) => string | null;
//# sourceMappingURL=jwt.d.ts.map