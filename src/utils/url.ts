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
