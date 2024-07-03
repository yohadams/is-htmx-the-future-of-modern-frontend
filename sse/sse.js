import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = express();

server.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, './sse.html'));
});

server.get('/subscribe-to-alerts', (req, res) => {
  let counter = 0;
  res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		Connection: 'keep-alive',
		'Cache-Control': 'no-cache',
	});
  setInterval(() => {
      res.write('event: alert\n');
      res.write(`data: <span>Alert ${counter}</span>\n`);
      res.write(`id: ${counter}\n\n`);
      counter += 1;
  }, 2500);
  
  req.on('close', () => res.end('OK'))
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
