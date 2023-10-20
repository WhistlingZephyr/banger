import type {PropsWithChildren, MouseEvent} from 'react';
import {useMemo} from 'react';
import {IconContext, type IconType} from 'react-icons/lib';
import styles from './css/button.module.css';

export default function Button({
    icon: Icon,
    buttonClass,
    iconClass,
    children,
    ariaLabel,
    onClick,
}: PropsWithChildren<{
    readonly icon?: IconType;
    readonly buttonClass?: string;
    readonly iconClass?: string;
    readonly ariaLabel?: string;
    readonly onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}>): JSX.Element {
    const iconContext = useMemo(
        () => ({className: [styles.icon, iconClass ?? ''].join(' ')}),
        [iconClass],
    );
    return Icon ? (
        <IconContext.Provider value={iconContext}>
            <button
                type="button"
                className={[styles.button, buttonClass ?? ''].join(' ')}
                aria-label={ariaLabel}
                onClick={onClick}
            >
                <Icon />
                <span>{children}</span>
            </button>
        </IconContext.Provider>
    ) : (
        <button
            type="button"
            className={[styles.button, buttonClass ?? ''].join(' ')}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
