import React from 'react';
// import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import Gameboard from './components/Gameboard';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8080');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      roomId: null,
      player: null,
      attack: 0,
      turn: 1,
      activePlayer: false,
      firstPlayerCharge: 0,
      secondPlayerCharge: 0,
      firstPlayerHealth: 12,
      secondPlayerHealth: 12,
      stood: false,
      opponentStood: false,
      winningPlayer: null
    }
    this.handleCharge = this.handleCharge.bind(this);
    this.handleStand = this.handleStand.bind(this);
    this.resetTurn = this.resetTurn.bind(this);
  }

  componentDidMount() {
    socket.on('connect', () => {
      socket.on('message', (res) => this.setState({status: res}))
      socket.on('join info', (info) => {
        let initialState = { roomId: info[0], player: info[1] };
        if (this.state.turn === initialState.player) {
          initialState.activePlayer = true;
        }
        this.setState(initialState);
      });

      socket.on('attackVal', (val, player, charge) => {
        let turnNum = this.state.turn + 1;
        let stateChanges = { attack: val, turn: turnNum };
        if (turnNum % 2 === this.state.player) {
          stateChanges.activePlayer = true;
        }
        if (charge > 12) {
          charge = 13;
          socket.emit('damage', this.state.firstPlayerCharge, this.state.secondPlayerCharge, player)
        }
        if (player === 1) {
          stateChanges.firstPlayerCharge = charge;
        } else {
          stateChanges.secondPlayerCharge = charge;
        }
        this.setState(stateChanges);
        if (this.state.stood) {
          socket.emit('stand', this.state.player);
        }
      });

      socket.on('stood', (player) => {
        console.log('player', player, 'stood')
        let turnNum = this.state.turn + 1;
        let stateChanges = { turn: turnNum };
        if (turnNum % 2 === this.state.player) {
          stateChanges.activePlayer = true;
        }
        if (player !== this.state.player) {
          stateChanges.opponentStood = true;
        }
        this.setState(stateChanges);
      })

      socket.on('damageTo1', (damage) => {
        let newHealth = this.state.firstPlayerHealth - damage;
        if (newHealth < 1) {
          newHealth = 0;
          socket.emit('winner', 0)
        }
        this.setState({
          firstPlayerHealth: newHealth
        })
        setTimeout(this.resetTurn, 2000);
      })

      socket.on('damageTo2', (damage) => {
        let newHealth = this.state.secondPlayerHealth - damage;
        if (newHealth < 1) {
          newHealth = 0;
          socket.emit('winner', 1)
        }
        this.setState({
          secondPlayerHealth: newHealth
        })
        setTimeout(this.resetTurn, 2000);
      })

      socket.on('tie', () => {
        setTimeout(this.resetTurn, 2000);
      })

      socket.on('winner', (player) => {
        this.setState({winningPlayer: player})
      })
    })
  }

  handleFind() {
    socket.emit('findGame');
  }

  handleCharge() {
    socket.emit('charge', this.state.player);
    this.setState({activePlayer: false});
  }

  handleStand() {
    if (this.state.opponentStood) {
      socket.emit('damage', this.state.firstPlayerCharge, this.state.secondPlayerCharge);
    } else {
      socket.emit('stand', this.state.player);
    }
    this.setState({stood: true});
  }

  resetTurn() {
    this.setState({
      stood: false,
      opponentStood: false,
      attack: 0,
      firstPlayerCharge: 0,
      secondPlayerCharge: 0,
      activePlayer: this.state.turn % 2 === this.state.player
    })
    socket.emit('reset');
  }

  render() {
    let roomInfo = this.state.player ? <p>Player {this.state.player} joined room: {this.state.roomId}</p> : '';
    let intro = <div>
        <button onClick={this.handleFind}>Find Game</button>
        <p>{this.state.status}</p>
        <img src={logo} className="App-logo" alt="logo" />
        {roomInfo}
      </div>;

    return (
      <div className="App">
        <header className="App-header">
          {this.state.status === 'Game joined' ? <Gameboard gameState={this.state} handleCharge={this.handleCharge} handleStand={this.handleStand} /> : intro}
        </header>
      </div>
    );
  }
}

export default App;
