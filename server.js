const express = require('express');
const app = express();
// const http = require('http').createServer(app);
const io = require('socket.io')();
const path = require('path');
const port = 8080;
const matchToRoom = require('./game/matchmaking.js');

app.use('/static', express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('connected', socket.id);
  socket.send('Connected to server');
  socket.on('findGame', () => matchToRoom(socket, io));
  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected');
    socket.send('Disconnected...')
  });
});

app.get('/api/test', (req, res) => {
  res.send('test output')
})

// app.listen(port, () => {
//   console.log(`Listening at http://localhost:${port}`)
// })

io.listen(port);
console.log(`Listening at http://localhost:${port}`);
