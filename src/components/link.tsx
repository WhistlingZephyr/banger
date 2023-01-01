import styles from './css/link.module.css';

export default function Button({
    className,
    url,
}: {
    className?: string;
    url: string;
}): JSX.Element {
    return (
        <a href={url} className={[styles.link, className ?? ''].join(' ')}>
            {url}
        </a>
    );
}
