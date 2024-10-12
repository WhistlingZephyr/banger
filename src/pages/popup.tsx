import '@fontsource/inter';
import {MdRefresh, MdSettings} from 'react-icons/md';
import {StrictMode, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import styles from './popup/css/popup.module.css';
import Button from '@/components/button';
import {getBackendInstance} from '@/helpers/bang';
import {type ConfigData, getConfig} from '@/helpers/import-export';

function App(): JSX.Element {
    const [config, setConfig] = useState<ConfigData>();

    useEffect(() => {
        (async (): Promise<void> => {
            setConfig(await getConfig());
        })();
    }, []);

    return (
        <div className={styles.container}>
            {config && (
                <div className={styles.textContainer}>
                    <p className={styles.label}>Search: {config.engineName}</p>
                </div>
            )}
            <div className={styles.buttonContainer}>
                <Button
                    icon={MdRefresh}
                    buttonClass={styles.button}
                    iconClass={styles.icon}
                    onClick={(): void => {
                        getBackendInstance().fetch();
                    }}
                >
                    Refetch
                </Button>
                <Button
                    icon={MdSettings}
                    buttonClass={styles.button}
                    iconClass={styles.icon}
                    onClick={(): void => {
                        browser.runtime.openOptionsPage();
                    }}
                >
                    Settings
                </Button>
            </div>
        </div>
    );
}

createRoot(document.querySelector('#app')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
