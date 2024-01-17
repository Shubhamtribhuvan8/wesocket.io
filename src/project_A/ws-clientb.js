// Project A
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3002/project-b');

ws.on('open', function open() {
  ws.send('Hello from Project B!');
});
