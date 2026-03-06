import { Request, Response, NextFunction } from 'express';
export declare const listDepartments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getDepartment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createDepartment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateDepartment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteDepartment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getDepartmentHierarchy: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getDepartmentEmployees: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=department.controller.d.ts.map