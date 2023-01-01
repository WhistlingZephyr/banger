type RequestDetails = Parameters<
    Parameters<typeof browser.webRequest.onBeforeRequest.addListener>[0]
>[0];
// eslint-disable-next-line @typescript-eslint/ban-types
type MaybeAsync<T extends Function> =
    | T
    | ((...args: Parameters<T>) => Promise<ReturnType<T>>);
type MaybeAsyncFn<T, U> = MaybeAsync<(value: T) => U>;
