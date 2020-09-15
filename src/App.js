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
      secondPlayerHealth: 12
    }
    this.handleCharge = this.handleCharge.bind(this);
  }

  componentDidMount() {
    // axios.get('/api/test')
    //   .then((res) => this.setState({test: res.data}))
    socket.on('connect', () => {
      socket.on('message', (res) => this.setState({status: res}))
      socket.on('join info', (info) => {
        let initialState = { roomId: info[0], player: info[1] };
        if (this.state.turn === initialState.player) {
          initialState.activePlayer = true;
        }
        this.setState(initialState);
      });

      socket.on('attackVal', (val, player) => {
        let turnNum = this.state.turn + 1;
        let stateChanges = { attack: val, turn: turnNum };
        if (turnNum % 2 === this.state.player) {
          stateChanges.activePlayer = true;
        }
        if (player === 1) {
          stateChanges.firstPlayerCharge = this.state.firstPlayerCharge + val > 12 ? 13 : this.state.firstPlayerCharge + val;
        } else {
          stateChanges.secondPlayerCharge = this.state.secondPlayerCharge + val > 12 ? 13 : this.state.secondPlayerCharge + val;
        }
        this.setState(stateChanges);
        console.log('attack on client', val);
      });
    })
  }

  handleFind() {
    socket.emit('findGame');
  }

  handleCharge() {
    socket.emit('charge', this.state.player);
    this.setState({activePlayer: false});
  }

  render() {
    let roomInfo = this.state.player ? <p>Player {this.state.player} joined room: {this.state.roomId}</p> : '';
    // const numberDeck = <button onClick={this.handleCharge} disabled={this.state.activePlayer}>Charge Up</button>;
    // let attackVal = this.state.attack ? <p>{this.state.attack}</p> : '';
    // let game =
    //   <div>
    //     {numberDeck}
    //     {attackVal}
    //   </div>
    // let board =  game
    let intro = <div>
        <button onClick={this.handleFind}>Find Game</button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>{this.state.status}</p>
        {roomInfo}
      </div>;

    return (
      <div className="App">
        <header className="App-header">
          {this.state.status === 'Game joined' ? <Gameboard gameState={this.state} handleCharge={this.handleCharge} /> : intro}
          {/* {board} */}
        </header>
      </div>
    );
  }
}

export default App;
