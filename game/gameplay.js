const deck = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6];

const playGame = (socket, io, room) => {
  let playerDeck = deck.slice();

  socket.on('charge', (player) => {
    if (playerDeck.length === 0) {
      playerDeck = deck.slice();
    }
    let randomIndex = Math.floor(Math.random() * playerDeck.length)
    let attackVal = playerDeck.splice(randomIndex, 1);
    io.to(room).emit('attackVal', attackVal[0], player);
  })
}

module.exports = playGame;
