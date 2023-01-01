import validateType from '@/utils/validate-type';

const values: Record<string, string> = {
    engine: 'Google',
};

export default class ConfigValue {
    defaultState = '';
    #value: string | undefined;

    constructor(
        public readonly id: string,
        public defaultValue: string | MaybeAsync<() => string>,
        _validate?: MaybeAsyncFn<string, boolean>,
        public callback?: MaybeAsyncFn<string, void>,
    ) {
        if (typeof defaultValue === 'string') {
            this.defaultState = defaultValue;
        }

        this.getValue();
    }

    async getDefaultValue(): Promise<string> {
        if (
            validateType<MaybeAsync<() => string>>(
                this.defaultValue,
                'function',
            )
        ) {
            return values[this.id];
        }

        return this.defaultValue;
    }

    async getValue(): Promise<string> {
        if (!this.#value) {
            const defaultValue = await this.getDefaultValue();
            await this.updateValue(defaultValue);
            return defaultValue;
        }

        return this.#value;
    }

    async updateValue(value: string): Promise<boolean> {
        if (typeof value !== 'string') {
            return false;
        }

        this.#value = value;
        return true;
    }
}
