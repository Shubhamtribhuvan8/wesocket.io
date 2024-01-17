// Project A
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3003/project-c');

ws.on('open', function open() {
  ws.send('Hello from Project C!');
});
