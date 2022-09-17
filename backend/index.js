import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import * as database from './database.js';

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

database.init();

const emitScores = () => {
  const scores = database.getScores();
  io.emit('scores', scores);
};

app.use(express.static('frontend'));
app.get('/', express.static('frontend/index.html'));

app.get('/addScore', (req, res) => {
  const { name, score } = req.query;
  database.addScore(name, score);
  emitScores();
  res.sendStatus(200);
});

io.on('connection', () => emitScores());

server.listen(PORT, () => {
  console.log('Express server running...');
}); 