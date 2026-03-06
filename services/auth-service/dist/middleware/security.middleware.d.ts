import cors from 'cors';
export declare const helmetConfig: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
export declare const corsConfig: (req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void;
export declare const rateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const sanitize: import("express").Handler;
//# sourceMappingURL=security.middleware.d.ts.map