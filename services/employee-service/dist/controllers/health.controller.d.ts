import { Request, Response, NextFunction } from 'express';
export declare const healthCheck: (_req: Request, res: Response, _next: NextFunction) => Promise<void>;
export declare const databaseHealthCheck: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const fullHealthCheck: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=health.controller.d.ts.map