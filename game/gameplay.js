const deck = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6];

const playGame = (socket, io, room) => {
  let playerDeck = deck.slice();
  let charge = 0;

  socket.on('charge', (player) => {
    if (playerDeck.length === 0) {
      playerDeck = deck.slice();
    }
    let randomIndex = Math.floor(Math.random() * playerDeck.length)
    let attackVal = playerDeck.splice(randomIndex, 1);
    charge += attackVal[0];
    io.to(room).emit('attackVal', attackVal[0], player, charge);
  })

  socket.on('stand', (player) => {
    console.log('player', player, 'stood');
    io.to(room).emit('stood', player);
  })

  socket.on('damage', (firstPlayerCharge, secondPlayerCharge, bust) => {
    console.log('damage being done');
    let damage = bust < 2 ? 3 : 0;

    if (bust === 1) {
      io.to(room).emit('damageTo1', damage);
    } else if (bust === 0) {
      io.to(room).emit('damageTo2', damage);
    } else if (firstPlayerCharge > secondPlayerCharge) {
      damage += firstPlayerCharge - secondPlayerCharge;
      io.to(room).emit('damageTo2', damage);
    } else if (secondPlayerCharge > firstPlayerCharge) {
      damage += secondPlayerCharge - firstPlayerCharge;
      io.to(room).emit('damageTo1', damage);
    } else {
      io.to(room).emit('tie');
    }
  })

  socket.on('reset', () => {
    charge = 0;
  })

  socket.on('winner', (player) => {
    io.to(room).emit('winner', player);
  })
}

module.exports = playGame;
