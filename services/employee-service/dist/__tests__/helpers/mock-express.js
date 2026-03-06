"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockNext = exports.createMockResponse = exports.createMockRequest = void 0;
const createMockRequest = (overrides = {}) => ({
    params: {},
    query: {},
    body: {},
    headers: {},
    user: undefined,
    requestId: 'test-request-id',
    ...overrides,
});
exports.createMockRequest = createMockRequest;
const createMockResponse = () => {
    const res = {
        _json: null,
        _status: 200,
        status: jest.fn().mockImplementation(function (code) {
            this._status = code;
            return this;
        }),
        json: jest.fn().mockImplementation(function (data) {
            this._json = data;
            return this;
        }),
        send: jest.fn().mockReturnThis(),
    };
    return res;
};
exports.createMockResponse = createMockResponse;
const createMockNext = () => jest.fn();
exports.createMockNext = createMockNext;
//# sourceMappingURL=mock-express.js.map