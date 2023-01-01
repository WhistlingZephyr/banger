import {useEffect, useState} from 'react';

export function usePromise<T>(factory: () => Promise<T>): T | undefined {
    const [state, setState] = useState<T>();
    useEffect(() => {
        (async (): Promise<void> => {
            setState(await factory());
        })();
    }, [factory]);

    return state;
}
