import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = express();

let counter = 0;
const counterElement = () => `<span id="counter">${counter}</span>`;

server.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, './counter.html'));
});

server.post('/increment', (_, res) => {
  counter++;
  res.send(counterElement());
});

server.get('/counter', (_, res) => {
  res.send(counterElement());
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});