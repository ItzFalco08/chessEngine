require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const port = 8000; // your backend port

app.use(cors({
  origin: process.env.FRONTEND_URL
}));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received:', message);
    // Echo the message back
    ws.send(`Server received: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('WebSocket server is running');
});

// use effect for port, runs every time port changes
server.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
