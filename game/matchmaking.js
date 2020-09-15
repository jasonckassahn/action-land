const playGame = require('./gameplay.js');

let roomId = null;

const matchToRoom = (socket, io) => {
  if (roomId) {
    socket.join(roomId, () => {
      console.log('player 2 room list:', socket.rooms);
      socket.emit('join info', [roomId, 2]);
      io.to(roomId).send('Game joined');
      playGame(socket, io, roomId);
      roomId = null;
    });
  } else {
    roomId = (Math.random()+1).toString(36).slice(2, 18);
    socket.join(roomId, () => {
      console.log('player 1 room list:', socket.rooms);
      socket.emit('join info', [roomId, 1]);
      playGame(socket, io, roomId);
    });
    socket.send('Finding opponent...');
  }
}

module.exports = matchToRoom;