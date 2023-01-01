import {useEffect, useState, type Dispatch, type SetStateAction} from 'react';
import type ConfigValue from '../models/config-value';

export function useConfig(
    config: ConfigValue,
    setCallbacks: Dispatch<SetStateAction<Map<symbol, () => void>>>,
): [string | undefined, Dispatch<SetStateAction<string | undefined>>] {
    const [configValue, setConfigValue] = useState<string>();
    const [configState, setConfigState] = useState<string>();

    useEffect((): (() => void) => {
        const callback = (): void => {
            if (configState && configValue !== configState) {
                setConfigValue(configState);
                config.updateValue(configState);
            }
        };

        let key: symbol;
        setCallbacks(callbacks => {
            key = Symbol('setting callback');
            callbacks.set(key, callback);
            return callbacks;
        });

        return (): void => {
            setCallbacks(callbacks => {
                if (key) {
                    callbacks.delete(key);
                }

                return callbacks;
            });
        };
    }, [config, configValue, configState, setConfigValue, setCallbacks]);

    useEffect(() => {
        (async (): Promise<void> => {
            const value = await config.getValue();
            setConfigValue(value);
            setConfigState(value);
        })();
    }, [config]);

    return [configValue, setConfigState];
}
