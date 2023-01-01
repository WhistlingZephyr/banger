export default function validateType<T>(
    value: unknown,
    type:
        | 'bigint'
        | 'boolean'
        | 'function'
        | 'number'
        | 'object'
        | 'string'
        | 'undefined',
): value is T {
    return typeof value === type;
}
