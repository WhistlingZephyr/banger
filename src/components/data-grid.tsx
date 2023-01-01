import {useCallback, useEffect, useMemo, useState} from 'react';
import {Grid, _} from 'gridjs-react';
import {
    MdAdd,
    MdCancel,
    MdDelete,
    MdDomain,
    MdEdit,
    MdInfo,
    MdSave,
    MdSegment,
    MdShortcut,
    MdTune,
    MdSettingsBackupRestore,
} from 'react-icons/md';
import type {CustomBang} from '../models/backend';
import BangModal from './bang-modal';
import styles from './css/data-grid.module.css';
import Property from './property';
import './css/data-grid.css';
import Button from './button';
import {bangConfig} from '@/helpers/bang';

export function BangsDataGrid(): JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBang, setCurrentBang] = useState<CustomBang>();
    const [currentBangShortcut, setCurrentBangShortcut] = useState<string>();
    const [bangs, setBangs] = useState<CustomBang[]>();
    const fetchBangs = useCallback(async () => {
        setBangs(await bangConfig.customBangs.getValue());
    }, []);
    const data = useMemo(
        () =>
            bangs?.map(bang => ({
                name: bang.name,
                shortcut: bang.shortcut,
                domain: bang.domain,
                actions: bang,
            })),
        [bangs],
    );
    function Actions({bang}: {bang: CustomBang}): JSX.Element {
        return (
            <div className={styles.actionsContainer}>
                <button
                    type="button"
                    className={styles.actionButton}
                    title="Info"
                    aria-label="Information about this bang"
                    onClick={(): void => {
                        setCurrentBang(bang);
                        setCurrentBangShortcut(bang.shortcut);
                        setIsEditing(false);
                        setIsModalOpen(true);
                    }}
                >
                    <MdInfo className={styles.actionIcon} />
                </button>
                <button
                    type="button"
                    className={styles.actionButton}
                    title="Edit"
                    aria-label="Edit this bang"
                    onClick={(): void => {
                        setCurrentBang(bang);
                        setIsEditing(true);
                        setIsModalOpen(true);
                    }}
                >
                    <MdEdit className={styles.actionIcon} />
                </button>
                <button
                    type="button"
                    className={[
                        styles.actionButton,
                        styles.actionDeleteButton,
                    ].join(' ')}
                    title="Delete"
                    aria-label="Delete this bang"
                    onClick={async (): Promise<void> => {
                        await bangConfig.customBangs.removeBang(bang.shortcut);
                        await fetchBangs();
                    }}
                >
                    <MdDelete className={styles.actionIcon} />
                </button>
            </div>
        );
    }

    useEffect(() => {
        if (!isModalOpen) {
            setCurrentBang(undefined);
        }
    }, [isModalOpen]);

    useEffect(() => {
        fetchBangs();
    }, [fetchBangs]);

    return (
        <>
            <div className={styles.buttonContainer}>
                <Button
                    buttonClass={styles.button}
                    iconClass={styles.buttonIcon}
                    icon={MdSettingsBackupRestore}
                    onClick={async (): Promise<void> => {
                        await bangConfig.customBangs.updateValue(
                            await bangConfig.customBangs.getDefaultValue(),
                        );
                        await fetchBangs();
                    }}
                >
                    Restore defaults
                </Button>
                <Button
                    buttonClass={styles.button}
                    iconClass={styles.buttonIcon}
                    icon={MdAdd}
                    onClick={(): void => {
                        setCurrentBangShortcut(undefined);
                        setCurrentBang({
                            name: '',
                            shortcut: '',
                            domain: '',
                        });
                        setIsEditing(true);
                        setIsModalOpen(true);
                    }}
                >
                    Add bang
                </Button>
            </div>
            {data && (
                <>
                    <Grid
                        search
                        className={styles}
                        data={data}
                        columns={[
                            {
                                id: 'name',
                                name: _(
                                    <div>
                                        <MdSegment
                                            className={styles.headerIcon}
                                        />
                                        <span>Name</span>
                                    </div>,
                                ),
                            },
                            {
                                id: 'shortcut',
                                name: _(
                                    <div>
                                        <MdShortcut
                                            className={styles.headerIcon}
                                        />
                                        <span>Shortcut</span>
                                    </div>,
                                ),
                            },
                            {
                                id: 'domain',
                                name: _(
                                    <div>
                                        <MdDomain
                                            className={styles.headerIcon}
                                        />
                                        <span>Domain</span>
                                    </div>,
                                ),
                            },
                            {
                                id: 'actions',
                                name: _(
                                    <div>
                                        <MdTune className={styles.headerIcon} />
                                        <span>Actions</span>
                                    </div>,
                                ),
                                formatter: (cell: CustomBang) =>
                                    _(<Actions bang={cell} />),
                            },
                        ]}
                        width="100%"
                        pagination={{
                            enabled: true,
                            limit: 10,
                        }}
                    />
                    <BangModal
                        isOpen={isModalOpen}
                        setIsOpen={setIsModalOpen}
                        contentLabel="Bang information"
                    >
                        <div className={styles.modalPropertyContainer}>
                            <Property
                                label="Name*"
                                disabled={!isEditing}
                                value={currentBang?.name}
                                callback={(value): void => {
                                    if (currentBang) {
                                        currentBang.name = value;
                                    }
                                }}
                            />
                            <Property
                                label="Shortcut*"
                                disabled={!isEditing}
                                value={currentBang?.shortcut}
                                callback={(value): void => {
                                    if (currentBang) {
                                        currentBang.shortcut = value;
                                    }
                                }}
                            />
                            <Property
                                label="Domain*"
                                disabled={!isEditing}
                                value={currentBang?.domain}
                                callback={(value): void => {
                                    if (currentBang) {
                                        currentBang.domain = value;
                                    }
                                }}
                            />
                            <Property
                                label="URL"
                                disabled={!isEditing}
                                value={currentBang?.url}
                                callback={(value): void => {
                                    if (currentBang) {
                                        currentBang.url = value;
                                    }
                                }}
                            />
                        </div>
                        <div className={styles.modalButtonContainer}>
                            {isEditing ? (
                                <Button
                                    icon={MdSave}
                                    buttonClass={styles.modalButton}
                                    onClick={async (): Promise<void> => {
                                        setIsEditing(false);
                                        if (currentBang) {
                                            if (
                                                currentBangShortcut ===
                                                currentBang.shortcut
                                            ) {
                                                await bangConfig.customBangs.updateBang(
                                                    currentBang,
                                                );
                                                await fetchBangs();
                                                setIsModalOpen(false);
                                            } else {
                                                const result =
                                                    await bangConfig.customBangs.pushBang(
                                                        currentBang,
                                                    );
                                                if (result) {
                                                    setIsModalOpen(false);
                                                }

                                                await fetchBangs();
                                            }
                                        }
                                    }}
                                >
                                    Save
                                </Button>
                            ) : (
                                <Button
                                    icon={MdEdit}
                                    buttonClass={styles.modalButton}
                                    onClick={(): void => {
                                        setIsEditing(true);
                                    }}
                                >
                                    Edit
                                </Button>
                            )}
                            <Button
                                icon={MdCancel}
                                buttonClass={styles.modalButton}
                                onClick={(): void => {
                                    setIsModalOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </BangModal>
                </>
            )}
        </>
    );
}
