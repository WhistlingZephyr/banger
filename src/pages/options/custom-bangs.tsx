import {BangsDataGrid} from '../../components/data-grid';
import Page from '../../components/page';
import styles from './css/custom-bangs.module.css';

export default function BangsPage(): JSX.Element {
    return (
        <Page contentClass={styles.bangsContent}>
            <BangsDataGrid />
        </Page>
    );
}
