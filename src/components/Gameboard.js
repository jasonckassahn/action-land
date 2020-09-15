import React from 'react';
import './Gameboard.css';

const Gameboard = (props) => {
  let { gameState, handleCharge } = props;
  let { attack, activePlayer, firstPlayerCharge, secondPlayerCharge, firstPlayerHealth, secondPlayerHealth, player } = gameState;
  const isFirstPlayer = player === 1;
  const thisPlayerColor = isFirstPlayer ? 'Red' : 'Blue';
  const otherPlayerColor = thisPlayerColor === 'Red' ? 'Blue' : 'Red';

  return (
    <div>
      <p>{otherPlayerColor} Player's Health: {isFirstPlayer ? secondPlayerHealth : firstPlayerHealth}</p>
      <img className="healthBar" src={`https://action-land-clash.s3-us-west-1.amazonaws.com/life${isFirstPlayer ? secondPlayerHealth : firstPlayerHealth}.png`} alt={`${otherPlayerColor}'s health bar, currently at ${isFirstPlayer ? secondPlayerHealth : firstPlayerHealth}`}></img>
      <div>
        <p>Charge level: {isFirstPlayer ? secondPlayerCharge : firstPlayerCharge}/12</p>
        <img className="chargeMeter" alt={`red player charge meter charged to ${firstPlayerCharge}`} src={`https://action-land-clash.s3-us-west-1.amazonaws.com/r_bar_${firstPlayerCharge}.png`} />
        <img className="chargeMeter" alt={`blue player charge meter charged to ${secondPlayerCharge}`} src={`https://action-land-clash.s3-us-west-1.amazonaws.com/b_bar_${secondPlayerCharge}.png`} />
        <p>Charge level: {isFirstPlayer ? firstPlayerCharge : secondPlayerCharge}/12</p>
      </div>
      <img className="healthBar" src={`https://action-land-clash.s3-us-west-1.amazonaws.com/life${isFirstPlayer ? firstPlayerHealth : secondPlayerHealth}.png`} alt={`${thisPlayerColor}'s health bar, currently at ${isFirstPlayer ? firstPlayerHealth : secondPlayerHealth}`}></img>
      <p>{thisPlayerColor} Player's Health: {isFirstPlayer ? firstPlayerHealth : secondPlayerHealth}</p>
      <p>Charged: {attack}</p>
      <button onClick={handleCharge} disabled={!activePlayer}>Charge Up</button>
    </div>
  );
}

export default Gameboard;