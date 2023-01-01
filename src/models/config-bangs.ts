import type {Bang} from './backend';
import {isUrl} from '@/utils/url';

export default class ConfigBangs<T extends Bang> {
    defaultState: T[] = [];
    readonly allKeys: string[];

    constructor(
        public readonly id: string,
        public readonly defaultValue: T[] | MaybeAsync<() => T[]>,
        public readonly requiredKeys: string[],
        optionalKeys: string[],
        public readonly sync = false,
    ) {
        this.allKeys = [...requiredKeys, ...optionalKeys];
    }

    async updateValue(value: T[], validate = true): Promise<boolean> {
        if (!validate || this.validate(value)) {
            await browser.storage[this.sync ? 'sync' : 'local'].set({
                [this.id]: value,
            });
            return true;
        }

        return false;
    }

    async getDefaultValue(): Promise<T[]> {
        return Array.isArray(this.defaultValue)
            ? this.defaultValue
            : this.defaultValue();
    }

    async getValue(): Promise<T[]> {
        const data = (
            await browser.storage[this.sync ? 'sync' : 'local'].get(this.id)
        )[this.id];

        if (!this.validate(data)) {
            const defaultValue = await this.getDefaultValue();
            await this.updateValue(defaultValue, false);
            return defaultValue;
        }

        const filteredData = data.filter(
            (value, index) =>
                data.findIndex(bang => bang.shortcut === value.shortcut) ===
                index,
        );

        if (filteredData.length !== data.length) {
            await this.updateValue(filteredData, false);
        }

        return filteredData;
    }

    async pushBang(bang: T): Promise<boolean> {
        if (!this.validateBang(bang)) {
            return false;
        }

        const bangs = await this.getValue();
        if (bangs.some(value => value.shortcut === bang.shortcut)) {
            return false;
        }

        await this.updateValue([...bangs, bang], false);

        return true;
    }

    async updateBang(bang: T): Promise<boolean> {
        if (!this.validateBang(bang)) {
            return false;
        }

        const bangs = await this.getValue();
        const filteredBangs = bangs.filter(
            value => value.shortcut !== bang.shortcut,
        );
        if (bangs.length === filteredBangs.length) {
            return false;
        }

        await this.updateValue([...filteredBangs, bang], false);

        return true;
    }

    async removeBang(shortcut: string): Promise<boolean> {
        const bangs = await this.getValue();
        const filteredBangs = bangs.filter(
            value => value.shortcut !== shortcut,
        );
        if (bangs.length === filteredBangs.length) {
            return false;
        }

        await this.updateValue(filteredBangs, false);

        return true;
    }

    validateBang(value: unknown): value is T {
        if (typeof value !== 'object' || value === null) {
            return false;
        }

        const keys = Object.keys(value);
        if (
            keys.length >= this.requiredKeys.length &&
            keys.length <= this.allKeys.length &&
            this.requiredKeys.every(key => keys.includes(key)) &&
            keys.every(key => this.allKeys.includes(key))
        ) {
            const bang = value as T;
            if (!isUrl(bang.domain)) {
                return false;
            }

            if (bang.url) {
                return isUrl(bang.url) || bang.url.includes('%q');
            }

            return true;
        }

        return false;
    }

    validate(data: unknown): data is T[] {
        return (
            Array.isArray(data) && data.every(bang => this.validateBang(bang))
        );
    }
}
