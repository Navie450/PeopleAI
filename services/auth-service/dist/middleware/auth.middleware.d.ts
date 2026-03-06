import { Request, Response, NextFunction } from 'express';
export declare const authenticate: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export declare const optionalAuthenticate: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export declare const requireRole: (...requiredRoles: string[]) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map