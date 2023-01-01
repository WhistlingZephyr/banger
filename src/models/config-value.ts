import validateType from '@/utils/validate-type';

export default class ConfigValue {
    defaultState = '';
    readonly validate: MaybeAsyncFn<string, boolean>;

    constructor(
        public readonly id: string,
        public readonly defaultValue: string | MaybeAsync<() => string>,
        validate?: MaybeAsyncFn<string, boolean>,
        public callback?: MaybeAsyncFn<string, void>,
    ) {
        if (typeof defaultValue === 'string') {
            this.defaultState = defaultValue;
        }

        this.getValue();
        this.validate = validate ?? ((_value: string): boolean => true);
    }

    async getDefaultValue(): Promise<string> {
        return validateType<MaybeAsync<() => string>>(
            this.defaultValue,
            'function',
        )
            ? this.defaultValue()
            : this.defaultValue;
    }

    async getValue(): Promise<string> {
        try {
            const result = (await browser.storage.sync.get(this.id))[this.id];
            if (
                result &&
                typeof result === 'string' &&
                (await this.validate(result))
            ) {
                return result;
            }
        } catch (error: unknown) {
            console.error(error);
        }

        const defaultValue = await this.getDefaultValue();
        await this.updateValue(defaultValue, false);
        return defaultValue;
    }

    async updateValue(value: string, validate = true): Promise<boolean> {
        if (validate && !(typeof value === 'string' && this.validate(value))) {
            return false;
        }

        await browser.storage.sync.set({
            [this.id]: value,
        });
        await this.callback?.(value);

        return true;
    }
}
