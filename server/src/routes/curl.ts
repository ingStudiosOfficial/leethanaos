import { Router } from 'express';

export const curlRouter = Router();

curlRouter.post('/fetch', async (req, res) => {
	const url = req.body?.url;

	if (!url) {
		return res.status(400).json({
			message: 'url missing',
		});
	}

	try {
		const response = await fetch(url);

		const responseText = await response.text();

		console.log('Response text:', responseText);

		return res.status(response.status).json({
			message: responseText,
		});
	} catch (error) {
		return res.status(500).json({
			message: (error as Error).message,
		});
	}
});
