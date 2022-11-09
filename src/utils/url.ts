export function withDefaultBase(url: string, base: string): string {
    if (url.startsWith('/')) {
        return new URL(url, base).href;
    }

    return url;
}

export function withScheme(url: string, scheme: string): string {
    if (!/^\w+:\/\//.test(url)) {
        return url.replace(/^(?:\w*:\/\/?)?/, `${scheme}://`);
    }

    return url;
}

function isUrl(string: string): boolean {
    if (typeof string !== 'string') {
        throw new TypeError('Expected a string');
    }

    try {
        const _url = new URL(string);
        return true;
    } catch {
        return false;
    }
}

export function validate(url: string, ...args: string[]): boolean {
    const result = isUrl(url);
    if (!result) {
        return false;
    }

    for (const arg of args) {
        if (!url.includes(arg)) {
            return false;
        }
    }

    return true;
}
