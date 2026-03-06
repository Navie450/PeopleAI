import { Request, Response, NextFunction } from 'express';
export declare const listUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const activateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deactivateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserRoles: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const assignRole: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const removeRole: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map