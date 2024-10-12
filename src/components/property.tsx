import {useEffect, useId, useState} from 'react';
import styles from './css/property.module.css';

export default function Property({
    label,
    isDisabled: disabled,
    value,
    callback,
    validate,
}: {
    readonly label: string;
    readonly isDisabled: boolean;
    readonly value?: string;
    readonly callback?: (text: string) => void;
    readonly validate?: (text: string) => boolean;
}): JSX.Element {
    const [error, setError] = useState(false);
    const id = useId();

    useEffect(() => {
        if (validate) {
            const isValid = validate(value ?? '');
            setError(!isValid);
        }
    }, [validate, value]);
    return (
        <div className={styles.container}>
            <label htmlFor={id} className={styles.propertyLabel}>
                {label}
            </label>
            <input
                id={id}
                name={label}
                className={[
                    styles.propertyValue,
                    error ? styles.error : '',
                ].join(' ')}
                disabled={disabled}
                defaultValue={value}
                onChange={(event): void => {
                    const newText = event.target.value;
                    callback?.(newText);
                    if (validate) {
                        const isValid = validate(newText);
                        setError(!isValid);
                    }
                }}
            />
        </div>
    );
}
