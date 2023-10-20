import styles from './css/link.module.css';

export default function Button({
    className,
    url,
}: {
    readonly className?: string;
    readonly url: string;
}): JSX.Element {
    return (
        <a href={url} className={[styles.link, className ?? ''].join(' ')}>
            {url}
        </a>
    );
}
