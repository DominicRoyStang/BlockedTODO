import express from 'express';
import morgan from 'morgan';
import {errorHandler, githubWebhooks} from './middleware/index.js';

const app = express();

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms')); // eslint-disable-line

app.set('trust proxy', 1);

app.use(githubWebhooks);

app.get('/', (req, res, next) => res.send('BlockedTODO Backend Server'));
app.get('/ping', (req, res, next) => res.send('Pong!'));
app.get('/health', (req, res, next) => res.send('OK'));

app.use(errorHandler);

export default app;
