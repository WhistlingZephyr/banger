import {MdSave} from 'react-icons/md';
import {useMemo, useState} from 'react';
import styles from './css/settings.module.css';
import Button from '@/components/button';
import Page from '@/components/page';
import Select from '@/components/select';
import Input from '@/components/input';
import {backendId, bangConfig, bangConfig as config} from '@/helpers/bang';
import {listEngines} from '@/helpers/search';
import {usePromise} from '@/hooks/use-promise';
import {useConfig} from '@/hooks/use-config';
import time from '@/utils/time';

const databases = [
    {value: 'ddg', label: 'DuckDuckGo'},
    {value: 'brave', label: 'Brave'},
];

export default function SettingsPage(): JSX.Element {
    const [callbacks, setCallbacks] = useState<Map<symbol, () => void>>(
        new Map(),
    );
    const enginesList = usePromise(async () =>
        (await listEngines()).map(engine => engine.name),
    );
    const [currentEngine, setCurrentEngineState] = useConfig(
        bangConfig.engineName,
        setCallbacks,
    );
    const [backend, setBackendState] = useConfig(backendId, setCallbacks);
    const [luckyBangUrl, setLuckyBangUrlState] = useConfig(
        config.luckyBangUrl,
        setCallbacks,
    );
    const [siteFormat, setSiteFormatState] = useConfig(
        config.siteFormat,
        setCallbacks,
    );
    const [bangPrefix, setBangPrefixState] = useConfig(
        config.bangPrefix,
        setCallbacks,
    );
    const [luckyBang, setLuckyBangState] = useConfig(
        config.luckyBang,
        setCallbacks,
    );
    const [siteBangSep, setSiteBangSepState] = useConfig(
        config.siteBangSep,
        setCallbacks,
    );
    const [orOperator, setOrOperator] = useConfig(
        config.orOperator,
        setCallbacks,
    );
    const [superLuckyBangPrefix, setSuperLuckyBangPrefixState] = useConfig(
        config.superLuckyBangPrefix,
        setCallbacks,
    );
    const [multiBangDelim, setMultiBangDelimState] = useConfig(
        config.multiBangDelim,
        setCallbacks,
    );
    const [multiSiteBangDelim, setMultiSiteBangDelimState] = useConfig(
        config.multiSiteBangDelim,
        setCallbacks,
    );
    const [cacheLifetime, setCacheLifetimeState] = useConfig(
        config.cacheLifetime,
        setCallbacks,
    );
    const cacheLifetimeNotes = useMemo(
        () => cacheLifetime && [`${time(cacheLifetime)}ms`],
        [cacheLifetime],
    );
    const onSave = (): void => {
        for (const callback of callbacks.values()) {
            callback();
        }
    };

    return (
        <Page>
            <div className={styles.settingsContainer}>
                {enginesList &&
                    currentEngine &&
                    backend &&
                    luckyBangUrl &&
                    siteFormat &&
                    bangPrefix &&
                    luckyBang &&
                    siteBangSep &&
                    superLuckyBangPrefix &&
                    multiBangDelim &&
                    multiSiteBangDelim &&
                    cacheLifetime &&
                    cacheLifetimeNotes && (
                        <>
                            <Select
                                items={enginesList}
                                label="Search engine to use"
                                getItemLabel={(engine): string => engine}
                                getItemValue={(engine): string =>
                                    engine ?? 'Invalid'
                                }
                                callback={setCurrentEngineState}
                                defaultItem={currentEngine}
                            />
                            <Select
                                items={databases}
                                label="Bang database to use"
                                getItemLabel={(item): string => item.label}
                                getItemValue={(item): string =>
                                    item?.value ?? 'Invalid'
                                }
                                callback={(item): void => {
                                    setBackendState(item.value);
                                }}
                                defaultItem={databases.find(
                                    item => item.value === backend,
                                )}
                            />
                            <Input
                                label="(Super) lucky bang URL"
                                notes={[
                                    'Must contain %q.',
                                    '%q is replaced with the query text.',
                                ]}
                                callback={setLuckyBangUrlState}
                                validate={async (value): Promise<boolean> =>
                                    config.luckyBangUrl.validate(value)
                                }
                                defaultValue={luckyBangUrl}
                            />
                            <Input
                                label="Site/super lucky bang format"
                                notes={[
                                    'Must contain %d.',
                                    '%d is replaced with the domain.',
                                ]}
                                callback={setSiteFormatState}
                                validate={async (value): Promise<boolean> =>
                                    config.siteFormat.validate(value)
                                }
                                defaultValue={siteFormat}
                            />
                            <Input
                                label="Multi-site OR operator"
                                notes={[
                                    'The text segment used for joining multiple site bangs',
                                    '"|" or "OR" are the most common ones supported by search engines',
                                ]}
                                callback={setOrOperator}
                                validate={async (value): Promise<boolean> =>
                                    config.orOperator.validate(value)
                                }
                                defaultValue={orOperator}
                            />
                            <Input
                                label="Bang prefix"
                                notes={["Can't contain whitespaces."]}
                                callback={setBangPrefixState}
                                validate={async (value): Promise<boolean> =>
                                    config.bangPrefix.validate(value)
                                }
                                defaultValue={bangPrefix}
                            />
                            <Input
                                label="Lucky bang"
                                notes={[
                                    "Can't contain whitespaces.",
                                    'Lucky bang is the bang that takes you to the first search result.',
                                ]}
                                callback={setLuckyBangState}
                                validate={async (value): Promise<boolean> =>
                                    config.luckyBang.validate(value)
                                }
                                defaultValue={luckyBang}
                            />
                            <Input
                                label="Site bang separator"
                                notes={[
                                    "Can't contain whitespaces.",
                                    'Search a specific site within your search engine.',
                                ]}
                                callback={setSiteBangSepState}
                                validate={async (value): Promise<boolean> =>
                                    config.siteBangSep.validate(value)
                                }
                                defaultValue={siteBangSep}
                            />
                            <Input
                                label="Super lucky bang prefix"
                                notes={[
                                    "Can't contain whitespaces.",
                                    'Go to the first search result from a specific site.',
                                ]}
                                callback={setSuperLuckyBangPrefixState}
                                validate={async (value): Promise<boolean> =>
                                    config.superLuckyBangPrefix.validate(value)
                                }
                                defaultValue={superLuckyBangPrefix}
                            />
                            <Input
                                label="Multi-bang delimiter"
                                notes={[
                                    "Can't contain whitespaces.",
                                    'Chain multiple bangs/site bangs/super lucky bangs and open each in their own tab.',
                                ]}
                                callback={setMultiBangDelimState}
                                validate={async (value): Promise<boolean> =>
                                    config.multiBangDelim.validate(value)
                                }
                                defaultValue={multiBangDelim}
                            />
                            <Input
                                label="Multi-site bang delimiter"
                                notes={[
                                    "Can't contain whitespaces.",
                                    'Chain multiple site bangs/super lucky bangs within the same search.',
                                ]}
                                callback={setMultiSiteBangDelimState}
                                validate={async (value): Promise<boolean> =>
                                    config.multiSiteBangDelim.validate(value)
                                }
                                defaultValue={multiSiteBangDelim}
                            />
                            <Input
                                label="Cache lifetime"
                                notes={cacheLifetimeNotes}
                                callback={setCacheLifetimeState}
                                validate={async (value): Promise<boolean> =>
                                    config.cacheLifetime.validate(value)
                                }
                                defaultValue={cacheLifetime}
                            />
                        </>
                    )}
            </div>
            <div className={styles.buttonContainer}>
                <Button
                    icon={MdSave}
                    buttonClass={styles.saveButton}
                    onClick={onSave}
                >
                    Save
                </Button>
            </div>
        </Page>
    );
}
