export function openUrlCommand(urlArray: unknown[]): string {
	let messages = '';

	for (const url of urlArray) {
		if (typeof url !== 'string') return 'Invalid URL type';

		try {
			const webUrl = new URL(addPrefixToUrl(url));
			window.open(webUrl, '_blank');
			messages += `Successfully opened URL '${url}'\n`;
		} catch (error) {
			console.error('Failed to validate URL:', error);
			messages += `Invalid URL '${url}'\n`;
		}
	}

	return messages;
}

function addPrefixToUrl(url: string): string {
	if (url.startsWith('http://') || url.startsWith('https://')) return url;

	return `https://${url}`;
}
