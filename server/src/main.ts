import express from 'express';
import cors from 'cors';
import { curlRouter } from './routes/curl.js';

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
	}),
);

app.use('/curl', curlRouter);

app.listen(port, () => {
	console.log(`Server is running on port ${port}.`);
});
