import {useEffect, useId, useState} from 'react';
import styles from './css/input.module.css';

export default function Input({
    label,
    defaultValue: value,
    placeholder,
    notes,
    callback,
    validate,
}: {
    label: string;
    defaultValue?: string;
    placeholder?: string;
    notes?: string[];
    callback?: (text: string) => void;
    validate?: MaybeAsyncFn<string, boolean>;
}): JSX.Element {
    const [error, setError] = useState(false);
    const [state, setState] = useState(value);
    const id = useId();

    useEffect(() => {
        (async (): Promise<void> => {
            if (validate) {
                const isValid = await validate(state ?? '');
                setError(!isValid);
            }
        })();
    }, [value, validate, state]);

    useEffect(() => {
        setState(value);
    }, [value]);

    return (
        <div className={styles.container}>
            <div className={styles.inputContainer}>
                <label htmlFor={id} className={styles.inputLabel}>
                    {label}
                </label>
                <input
                    type="text"
                    id={id}
                    className={[
                        styles.inputControl,
                        error ? styles.error : '',
                    ].join(' ')}
                    placeholder={placeholder ?? value}
                    value={state}
                    onChange={async (event): Promise<void> => {
                        const newText = event.target.value;
                        callback?.(newText);
                        setState(newText);
                    }}
                />
            </div>
            <div className={styles.notesContainer}>
                {notes?.length &&
                    notes.map(note => (
                        <p key={note} className={styles.note}>
                            &bull; {note}
                        </p>
                    ))}
            </div>
        </div>
    );
}
