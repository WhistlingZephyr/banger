import {useCallback, useEffect, useMemo, useState} from 'react';
import {
    MdFileDownload,
    MdRestore,
    MdSave,
    MdTextSnippet,
    MdUploadFile,
} from 'react-icons/md';
import {IconContext} from 'react-icons/lib';
import {useFilePicker} from 'use-file-picker';
import {saveAs} from 'file-saver';
import styles from './css/config.module.css';
import Button from './button';
import {
    type ConfigData,
    getConfig,
    resetConfig,
    updateConfig,
} from '@/helpers/import-export';

export default function Config(): JSX.Element {
    const [text, setText] = useState<string>('');
    const [errors, setErrors] = useState<string[]>([]);
    const {openFilePicker, filesContent, clear} = useFilePicker({
        accept: 'txt',
        multiple: false,
    });

    const loadConfig = async (): Promise<void> => {
        setText(JSON.stringify(await getConfig(), null, 4));
    };

    const saveConfig = useCallback(async (): Promise<void> => {
        try {
            const data = JSON.parse(text) as Partial<ConfigData>;
            setErrors(await updateConfig(data));
        } catch {
            setErrors(['Failed to parse JSON']);
        }
    }, [text]);

    const exportConfig = (): void => {
        saveAs(new Blob([text]), 'banger-config.json');
    };

    useEffect(() => {
        loadConfig();
    }, []);
    useEffect(() => {
        if (filesContent.length > 0) {
            const newText = filesContent[0].content;
            if (newText === text) {
                clear();
                saveConfig();
            } else {
                setText(newText);
            }
        }
    }, [filesContent, clear, saveConfig, text]);

    return (
        <IconContext.Provider
            value={useMemo(() => ({className: styles.icon}), [])}
        >
            <div className={styles.container}>
                <div className={styles.innerContainer}>
                    <div className={styles.textareaContainer}>
                        <div className={styles.textareaInnerContainer}>
                            <p className={styles.textareaLabel}>
                                <MdTextSnippet />
                                Config data:
                            </p>
                            <textarea
                                className={styles.textarea}
                                name="Config data"
                                value={text}
                                spellCheck={false}
                                onChange={(event): void => {
                                    setText(event.target.value);
                                }}
                            />
                        </div>
                        <div className={styles.buttonContainer}>
                            <Button
                                icon={MdUploadFile}
                                buttonClass={styles.button}
                                onClick={openFilePicker}
                            >
                                Import from file
                            </Button>
                            <Button
                                icon={MdSave}
                                buttonClass={styles.button}
                                onClick={saveConfig}
                            >
                                Save
                            </Button>
                            <Button
                                icon={MdFileDownload}
                                buttonClass={styles.button}
                                onClick={exportConfig}
                            >
                                Export to file
                            </Button>
                        </div>
                    </div>
                    <div className={styles.sideContainer}>
                        <div className={styles.errorContainer}>
                            <h1 className={styles.errorLabel}>Errors:</h1>
                            {(errors.length > 0
                                ? errors
                                : [
                                      'Any errors in saving/importing will show up here',
                                  ]
                            ).map(error => (
                                <p key={error} className={styles.error}>
                                    &bull; {error}
                                </p>
                            ))}
                        </div>
                        <Button
                            icon={MdRestore}
                            buttonClass={[styles.button, styles.restore].join(
                                ' ',
                            )}
                            onClick={async (): Promise<void> => {
                                await resetConfig();
                                await loadConfig();
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </div>
        </IconContext.Provider>
    );
}
