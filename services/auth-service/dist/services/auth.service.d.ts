import { User } from '../entities/User';
import { AuthTokenResponse } from '../dto/auth.dto';
declare class AuthService {
    register(email: string, password: string, firstName?: string, lastName?: string): Promise<{
        tokens: AuthTokenResponse;
        user: User;
    }>;
    login(email: string, password: string): Promise<{
        tokens: AuthTokenResponse;
        user: User;
    }>;
    refreshAccessToken(refreshToken: string): Promise<AuthTokenResponse>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
    logout(userId: string): Promise<void>;
    private updateLastLogin;
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=auth.service.d.ts.map