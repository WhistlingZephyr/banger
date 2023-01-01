import type {Bang} from '@/models/backend';

export default class ConfigBangs<T extends Bang> {
    defaultState: T[] = [];
    readonly allKeys: string[];
    #value: T[] = [];

    constructor(
        public readonly id: string,
        public readonly defaultValue: T[] | MaybeAsync<() => T[]>,
        public readonly requiredKeys: string[],
        optionalKeys: string[],
        public readonly sync = false,
    ) {
        this.allKeys = [...requiredKeys, ...optionalKeys];
        this.getValue();
    }

    async getDefaultValue(): Promise<T[]> {
        return Array.isArray(this.defaultValue)
            ? this.defaultValue
            : this.defaultValue();
    }

    async updateValue(value: T[], _validate: boolean): Promise<boolean> {
        this.#value = value;
        return true;
    }

    async getValue(): Promise<T[]> {
        if (this.#value.length === 0) {
            this.#value = await this.getDefaultValue();
        }

        return this.#value;
    }

    async pushBang(bang: T): Promise<boolean> {
        this.#value.push(bang);
        return true;
    }

    async updateBang(bang: T): Promise<boolean> {
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

    validateBang(_value: unknown): _value is T {
        return true;
    }

    validate(_data: unknown): _data is T[] {
        return true;
    }
}
