import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = express();

server.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, './infinite-scrolling.html'));
});

server.get("/users", (req, res) => {
  const page = parseInt(req.query.page, 10);
  const users = new Array(5).fill(null);;
  let html = users
    .map(
      (_, index) => `
      <tr>
        <td>John Doe ${((page - 1) * 5) + index}</td>
        <td>Frontend developer</td>
        <td>Team 1</td>
      </tr>`
    )
    .join("");

  html += `
    <tr 
      hx-get="/users/?page=${page + 1}" 
      hx-trigger="revealed" 
      hx-swap="afterend">
    </tr>`;
  res.send(html);
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});