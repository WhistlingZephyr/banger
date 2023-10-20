import type {PropsWithChildren, Dispatch, SetStateAction} from 'react';
import {useMemo} from 'react';
import {MdClose} from 'react-icons/md';
import {IconContext} from 'react-icons/lib';
import Modal from 'react-modal';
import styles from './css/bang-modal.module.css';
import './css/bang-modal.css';

Modal.setAppElement('#app');

export default function BangModal({
    isOpen,
    setIsOpen,
    contentLabel,
    children,
}: PropsWithChildren<{
    readonly isOpen: boolean;
    readonly setIsOpen: Dispatch<SetStateAction<boolean>>;
    readonly contentLabel: string;
}>): JSX.Element {
    const closeModal = (): void => {
        setIsOpen(false);
    };

    return (
        <IconContext.Provider
            value={useMemo(() => ({className: styles.closeIcon}), [])}
        >
            <Modal
                isOpen={isOpen}
                contentLabel={contentLabel}
                className={styles.bangModal}
                bodyOpenClassName={styles.body}
                overlayElement={(props, contentElement): JSX.Element => (
                    <div {...props}>
                        <div className={styles.backdrop} />
                        {contentElement}
                    </div>
                )}
                onRequestClose={closeModal}
            >
                <div className={styles.bangModalContent}>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={closeModal}
                    >
                        <MdClose />
                    </button>
                    {children}
                </div>
            </Modal>
        </IconContext.Provider>
    );
}
