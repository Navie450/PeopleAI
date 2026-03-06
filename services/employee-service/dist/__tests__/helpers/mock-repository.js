"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockRepository = exports.createMockQueryBuilder = void 0;
const createMockQueryBuilder = (returnValue = null) => {
    const qb = {};
    const chainMethods = [
        'leftJoinAndSelect', 'leftJoin', 'where', 'andWhere', 'orWhere',
        'orderBy', 'addOrderBy', 'skip', 'take', 'select', 'addSelect',
        'groupBy', 'addGroupBy', 'having', 'setParameter',
    ];
    chainMethods.forEach((method) => {
        qb[method] = jest.fn().mockReturnThis();
    });
    qb.getOne = jest.fn().mockResolvedValue(returnValue);
    qb.getMany = jest.fn().mockResolvedValue(Array.isArray(returnValue) ? returnValue : returnValue ? [returnValue] : []);
    qb.getCount = jest.fn().mockResolvedValue(Array.isArray(returnValue) ? returnValue.length : returnValue ? 1 : 0);
    qb.getRawOne = jest.fn().mockResolvedValue(returnValue);
    qb.getRawMany = jest.fn().mockResolvedValue(Array.isArray(returnValue) ? returnValue : []);
    return qb;
};
exports.createMockQueryBuilder = createMockQueryBuilder;
const createMockRepository = (queryBuilder) => {
    const qb = queryBuilder || (0, exports.createMockQueryBuilder)();
    return {
        find: jest.fn(),
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        create: jest.fn((data) => data),
        save: jest.fn((entity) => Promise.resolve(entity)),
        update: jest.fn().mockResolvedValue({ affected: 1 }),
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
        softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
        count: jest.fn().mockResolvedValue(0),
        createQueryBuilder: jest.fn().mockReturnValue(qb),
        queryBuilder: qb,
    };
};
exports.createMockRepository = createMockRepository;
//# sourceMappingURL=mock-repository.js.map