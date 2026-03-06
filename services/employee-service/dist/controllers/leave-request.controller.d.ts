import { Request, Response, NextFunction } from 'express';
export declare const getMyLeaveRequests: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyLeaveBalances: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createLeaveRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const cancelLeaveRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listLeaveRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTeamLeaveRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTeamLeaveSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getLeaveRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const approveLeaveRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const rejectLeaveRequest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=leave-request.controller.d.ts.map