import {useId} from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import {MdCheck} from 'react-icons/md';
import styles from './css/checkbox.module.css';

export default function Checkbox({
    label,
    isDefaultChecked: defaultChecked,
    callback,
}: {
    readonly label: string;
    readonly isDefaultChecked?: boolean;
    readonly callback?: (text: boolean) => void;
}): JSX.Element {
    const id = useId();

    return (
        <div className={styles.container}>
            <label htmlFor={id} className={styles.checkboxLabel}>
                {label}
            </label>
            <CheckboxPrimitive.Root
                className={styles.root}
                defaultChecked={defaultChecked}
                onCheckedChange={(newValue: boolean): void => {
                    callback?.(newValue);
                }}
            >
                <CheckboxPrimitive.Indicator className={styles.indicator}>
                    <MdCheck className={styles.icon} aria-label="Checked" />
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
        </div>
    );
}
