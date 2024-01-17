// Project A
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3001/project-a');

ws.on('open', function open() {
  ws.send('Hello from Project A!');
});
