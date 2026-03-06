import { Request, Response, NextFunction } from 'express';
export declare const requireRole: (...allowedRoles: string[]) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: Request, _res: Response, next: NextFunction) => void;
export declare const requireAdminOrManager: (req: Request, _res: Response, next: NextFunction) => void;
export declare const requireSelfOrAdmin: (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=rbac.middleware.d.ts.map