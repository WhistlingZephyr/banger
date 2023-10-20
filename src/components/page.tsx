import type {PropsWithChildren} from 'react';
import styles from './css/page.module.css';

export default function Page({
    children,
    containerClass,
    contentClass,
}: PropsWithChildren<{
    readonly containerClass?: string;
    readonly contentClass?: string;
}>): JSX.Element {
    return (
        <main className={[styles.page, containerClass ?? ''].join(' ')}>
            <div className={[styles.pageContent, contentClass ?? ''].join(' ')}>
                {children}
            </div>
        </main>
    );
}
