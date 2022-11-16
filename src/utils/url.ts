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

export function isUrl(string: string): boolean {
    if (typeof string !== 'string') {
        throw new TypeError('Expected a string');
    }

    try {
        // eslint-disable-next-line no-new
        new URL(string);
        return true;
    } catch {
        return false;
    }
}
