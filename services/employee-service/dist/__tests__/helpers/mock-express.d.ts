import { Request, Response, NextFunction } from 'express';
export declare const createMockRequest: (overrides?: Partial<Request>) => Partial<Request>;
export declare const createMockResponse: () => Partial<Response> & {
    _json: any;
    _status: number;
};
export declare const createMockNext: () => NextFunction;
//# sourceMappingURL=mock-express.d.ts.map