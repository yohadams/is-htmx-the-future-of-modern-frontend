import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = express();

server.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, './lazy-loading.html'));
});

server.get('/generate-graph', async (req, res) => {
  await sleep(10000);
  res.send(getChart());
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const getChart = () => `
  <svg class="chart" width="600" height="150" aria-labelledby="title desc" role="img">
    <title id="title">Ice cream request</title>
    <g class="bar">
      <rect fill="#F3E5AB" width="40" height="19"></rect>
      <text x="45" y="9.5" dy=".35em">Vanilla</text>
    </g>
    <g class="bar">
      <rect fill="#7B3F00" width="100" height="19" y="20"></rect>
      <text x="105" y="28" dy=".35em">Chocolate</text>
    </g>
    <g class="bar">
      <rect fill="#3EB489" width="250" height="19" y="40"></rect>
      <text x="255" y="48" dy=".35em">Mint</text>
    </g>
    <g class="bar">
      <rect fill="#93C572" width="500" height="19" y="60"></rect>
      <text x="505" y="68" dy=".35em">Pistachio</text>
    </g>
  </svg>
`;


const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
