import {useSelect} from 'downshift';
import {useId, useMemo} from 'react';
import {IconContext} from 'react-icons/lib';
import {MdExpandLess, MdExpandMore} from 'react-icons/md';
import styles from './css/select.module.css';

export default function Select<T>({
    label,
    items,
    callback,
    getItemValue,
    getItemLabel,
    defaultItem,
}: {
    readonly label: string;
    readonly callback?: (item: T) => void;
    readonly items: T[];
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly getItemValue: (item: T | null) => string;
    readonly getItemLabel: (item: T) => string;
    readonly defaultItem?: T;
}): JSX.Element {
    const {
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        highlightedIndex,
        selectedItem,
        getToggleButtonProps,
    } = useSelect<T>({
        items,
        onSelectedItemChange({selectedItem}): void {
            if (selectedItem) {
                callback?.(selectedItem);
            }
        },
        itemToString: getItemValue,
        defaultSelectedItem: defaultItem,
    });
    const id = useId();

    return (
        <IconContext.Provider
            value={useMemo(() => ({className: styles.icon}), [])}
        >
            <div className={styles.selectContainer}>
                <div className={styles.selectControlContainer}>
                    <label
                        htmlFor={id}
                        className={styles.selectLabel}
                        {...getLabelProps()}
                    >
                        {label}
                    </label>
                    <div
                        id={id}
                        className={[
                            styles.selectControl,
                            isOpen ? styles.open : '',
                        ].join(' ')}
                        {...getToggleButtonProps()}
                    >
                        <span className={styles.selectControlText}>
                            {selectedItem
                                ? getItemLabel(selectedItem)
                                : defaultItem === undefined
                                ? 'Select'
                                : getItemLabel(defaultItem)}
                        </span>
                        {isOpen ? <MdExpandLess /> : <MdExpandMore />}
                    </div>
                </div>
                <div className={styles.selectListContainer}>
                    <ul className={styles.selectList} {...getMenuProps()}>
                        {isOpen &&
                            items.map((item, index) => (
                                // eslint-disable-next-line react/jsx-key
                                <li
                                    className={[
                                        styles.selectItem,
                                        highlightedIndex === index
                                            ? styles.highlighted
                                            : '',
                                        selectedItem === item
                                            ? styles.selected
                                            : '',
                                    ].join(' ')}
                                    {...getItemProps({
                                        key: getItemValue(item),
                                        index,
                                        item,
                                    })}
                                >
                                    {getItemLabel(item)}
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </IconContext.Provider>
    );
}
