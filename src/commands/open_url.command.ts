export function openUrlCommand(urlArray: unknown[]): string {
    const url = urlArray[0];

    if (typeof url !== 'string') return 'Invalid URL type';

    try {
        const webUrl = new URL(addPrefixToUrl(url));
        window.open(webUrl, '_blank');
        return `Successfully opened URL '${url}'`;
    } catch (error) {
        console.error('Failed to validate URL:', error);
        return `Invalid URL '${url}'`;
    }
}

function addPrefixToUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;

    return `https://${url}`;
}