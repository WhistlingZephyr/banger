import {type SetStateAction} from 'react';
import validateType from './validate-type';

export default function dispatch<T>(value: T, newValue: SetStateAction<T>): T {
    return validateType<(value: T) => T>(newValue, 'function')
        ? newValue(value)
        : newValue;
}
