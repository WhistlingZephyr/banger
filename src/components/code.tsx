import type {PropsWithChildren} from 'react';
import styles from './css/code.module.css';

export default function Code({
    className,
    children,
}: PropsWithChildren<{
    readonly className?: string;
}>): JSX.Element {
    return (
        <code className={[styles.code, className ?? ''].join(' ')}>
            {children}
        </code>
    );
}
