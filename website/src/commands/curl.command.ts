export async function curlCommand(urlArray: unknown[]): Promise<string> {
	const url = urlArray[0];

	if (typeof url !== 'string') return 'curl: invalid URL type';

	try {
		const response = await fetch(`${import.meta.env.VITE_PROXY_SERVER_URL}/curl/fetch/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        const body = await response.json();

		if (!response.ok) {
			return `curl: ${(body as { message: string }).message} (${response.status})`;
		}

		return (body as { message: string }).message;
	} catch (error) {
		return `curl: ${(error as Error).message}`;
	}
}
