export function getMockedFn<T extends jest.MockableFunction>(arg: T): jest.MockedFn<T> {
    return arg as unknown as jest.MockedFn<T>;
}
