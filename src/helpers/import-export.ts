import {bangConfig} from './bang';
import {type BangConfig, type CustomBang} from '@/models/backend';

export type ConfigData = Record<
    Exclude<keyof BangConfig, 'customBangs'> | 'backendId',
    string
> & {
    customBangs: CustomBang[];
};

export async function getConfig(): Promise<ConfigData> {
    const result: ConfigData = Object.fromEntries(
        await Promise.all(
            Object.entries(bangConfig).map(async ([key, config]) => [
                key,
                await config.getValue(),
            ]),
        ),
    );
    return result;
}

export async function getDefaultConfig(): Promise<ConfigData> {
    const result: ConfigData = Object.fromEntries(
        await Promise.all(
            Object.entries(bangConfig).map(async ([key, config]) => [
                key,
                await config.getDefaultValue(),
            ]),
        ),
    );
    return result;
}

export async function validateConfig(
    config: Partial<ConfigData>,
): Promise<string[]> {
    return (
        await Promise.all(
            Object.entries({
                ...config,
                ...('backendId' in config ? {backendId: config.backendId} : {}),
            }).map(async ([key, value]) => {
                if (key in bangConfig) {
                    if (
                        await bangConfig[
                            key as keyof BangConfig
                            // @ts-expect-error Seems like TypeScript won't allow this easily.
                        ].validate(value)
                    ) {
                        return;
                    }

                    return (
                        'Invalid value for key ' +
                        JSON.stringify(key) +
                        ': ' +
                        JSON.stringify(value)
                    );
                }

                return 'Invalid key ' + JSON.stringify(key);
            }),
        )
    ).filter(Boolean) as string[];
}

export async function updateConfig(
    config: Partial<ConfigData>,
    validate = true,
): Promise<string[]> {
    if (validate) {
        const errors = await validateConfig(config);
        if (errors.length > 0) {
            return errors;
        }
    }

    return (
        await Promise.all(
            Object.entries(config).map(async ([key, value]) =>
                (await bangConfig[key as keyof BangConfig].updateValue(
                    // @ts-expect-error Seems like TypeScript won't allow this easily.
                    value,
                    validate,
                ))
                    ? undefined
                    : 'Failed set key ' +
                      JSON.stringify(key) +
                      ' to ' +
                      JSON.stringify(value),
            ),
        )
    ).filter(Boolean) as string[];
}

export async function resetConfig(): Promise<void> {
    await updateConfig(await getDefaultConfig(), false);
}
