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
      player: null
    }
  }

  componentDidMount() {
    // axios.get('/api/test')
    //   .then((res) => this.setState({test: res.data}))
    socket.on('message', (res) => this.setState({status: res}))
    socket.on('join info', (info) => this.setState({roomId: info[0], player: info[1]}))
  }

  handleFind() {
    socket.emit('findGame')
  }

  render() {
    let roomInfo = this.state.player ? <p>Player {this.state.player} joined room: {this.state.roomId}</p> : '';

    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.handleFind}>Find Game</button>
          <img src={logo} className="App-logo" alt="logo" />
          <p>{this.state.status}</p>
          {roomInfo}
        </header>
      </div>
    );
  }
}

export default App;
