import { Request, Response, NextFunction } from 'express';

export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
  params: {},
  query: {},
  body: {},
  headers: {},
  user: undefined,
  requestId: 'test-request-id',
  ...overrides,
});

export const createMockResponse = (): Partial<Response> & { _json: any; _status: number } => {
  const res: any = {
    _json: null as any,
    _status: 200,
    status: jest.fn().mockImplementation(function (this: any, code: number) {
      this._status = code;
      return this;
    }),
    json: jest.fn().mockImplementation(function (this: any, data: any) {
      this._json = data;
      return this;
    }),
    send: jest.fn().mockReturnThis(),
  };
  return res;
};

export const createMockNext = (): NextFunction => jest.fn();
