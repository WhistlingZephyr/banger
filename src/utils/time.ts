import ms from 'ms';

export default function time(value: string): number {
    return value
        .split(/(?<=\D)\s*/)
        .reduce((acc, string) => acc + ms(string), 0);
}
