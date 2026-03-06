export declare const createMockQueryBuilder: (returnValue?: unknown) => Record<string, jest.Mock<any, any, any>>;
export declare const createMockRepository: (queryBuilder?: ReturnType<typeof createMockQueryBuilder>) => {
    find: jest.Mock<any, any, any>;
    findOne: jest.Mock<any, any, any>;
    findOneBy: jest.Mock<any, any, any>;
    create: jest.Mock<unknown, [data: unknown], any>;
    save: jest.Mock<Promise<unknown>, [entity: unknown], any>;
    update: jest.Mock<any, any, any>;
    delete: jest.Mock<any, any, any>;
    softDelete: jest.Mock<any, any, any>;
    count: jest.Mock<any, any, any>;
    createQueryBuilder: jest.Mock<any, any, any>;
    queryBuilder: Record<string, jest.Mock<any, any, any>>;
};
//# sourceMappingURL=mock-repository.d.ts.map