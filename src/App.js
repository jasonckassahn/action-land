import React from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8080');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      roomId: null,
      player: null,
      attack: null
    }
  }

  componentDidMount() {
    // axios.get('/api/test')
    //   .then((res) => this.setState({test: res.data}))
    socket.on('connect', () => {
      socket.on('message', (res) => this.setState({status: res}))
      socket.on('join info', (info) => {
        this.setState({roomId: info[0], player: info[1]});
      });
      socket.on('attackVal', (val) => {
        this.setState({attack: val})
        console.log('attack on client', val);
      });
    })
  }

  // componentDidUpdate() {
  //   socket.on('attackVal', (val) => {
  //     this.setState({attack: val})
  //     console.log('attack on client', val);
  //   });
  // }

  handleFind() {
    socket.emit('findGame');
  }

  handleAttack() {
    socket.emit('attack');
  }

  render() {
    let roomInfo = this.state.player ? <p>Player {this.state.player} joined room: {this.state.roomId}</p> : '';
    const numberDeck = <button onClick={this.handleAttack}>Attack!</button>;
    let attackVal = this.state.attack ? <p>{this.state.attack}</p> : '';
    let game =
      <div>
        {numberDeck}
        {attackVal}
      </div>
    let board = this.state.status === 'Game joined' ? game :
      <div>
        <button onClick={this.handleFind}>Find Game</button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>{this.state.status}</p>
        {roomInfo}
      </div>;

    return (
      <div className="App">
        <header className="App-header">
          {board}
        </header>
      </div>
    );
  }
}

export default App;
