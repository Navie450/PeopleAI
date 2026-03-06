import { Request, Response, NextFunction } from 'express';
export declare const listAnnouncements: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listAllAnnouncements: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAnnouncement: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createAnnouncement: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateAnnouncement: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteAnnouncement: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const togglePin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=announcement.controller.d.ts.map