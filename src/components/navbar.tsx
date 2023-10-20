import {useMemo, useState} from 'react';
import {IconContext, type IconType} from 'react-icons/lib';
import styles from './css/navbar.module.css';

export type PageInfo = Array<{icon: IconType; label: string; id: string}>;

export default function NavBar({
    defaultPage,
    pages,
    callback,
}: {
    readonly defaultPage: string;
    readonly pages: PageInfo;
    readonly callback: (page: string) => void;
}): JSX.Element {
    const [page, setPage] = useState(defaultPage);
    function PageButton({
        icon: Icon,
        label,
        id,
    }: {
        readonly icon: IconType;
        readonly label: string;
        readonly id: string;
    }): JSX.Element {
        return (
            <button
                type="button"
                className={[
                    styles.navbarButton,
                    page === id ? styles.selected : '',
                ].join(' ')}
                onClick={(): void => {
                    callback(id);
                    setPage(id);
                }}
            >
                <Icon />
                <span>{label}</span>
            </button>
        );
    }

    return (
        <IconContext.Provider
            value={useMemo(() => ({className: styles.icon}), [])}
        >
            <nav className={styles.navbar}>
                {pages.map(props => (
                    <PageButton key={props.id} {...props} />
                ))}
            </nav>
        </IconContext.Provider>
    );
}
