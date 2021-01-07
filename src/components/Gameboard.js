import React from 'react';
import './Gameboard.css';

const Gameboard = (props) => {
  let { gameState, handleCharge, handleStand } = props;
  let { attack, activePlayer, firstPlayerCharge, secondPlayerCharge, firstPlayerHealth, secondPlayerHealth, player, stood, winningPlayer } = gameState;
  const isFirstPlayer = player === 1;
  const thisPlayerColor = isFirstPlayer ? 'Red' : 'Blue';
  const otherPlayerColor = thisPlayerColor === 'Red' ? 'Blue' : 'Red';

  return (
    <div>
      <p>{otherPlayerColor} Player's Health: {isFirstPlayer ? secondPlayerHealth : firstPlayerHealth}</p>
      <img className="healthBar" src={`https://action-land-clash.s3-us-west-1.amazonaws.com/life${isFirstPlayer ? secondPlayerHealth : firstPlayerHealth}.png`} alt={`${otherPlayerColor}'s health bar, currently at ${isFirstPlayer ? secondPlayerHealth : firstPlayerHealth}`}></img>
      <p>{activePlayer ? otherPlayerColor : thisPlayerColor} Player Charged: {attack}</p>
      <div className={winningPlayer === null ? '' : 'hidden'}>
        <p>Charge level: {isFirstPlayer ? secondPlayerCharge : firstPlayerCharge}/12</p>
        <img className="chargeMeter" alt={`red player charge meter charged to ${firstPlayerCharge}`} src={`https://action-land-clash.s3-us-west-1.amazonaws.com/r_bar_${firstPlayerCharge}.png`} />
        <img className="chargeMeter" alt={`blue player charge meter charged to ${secondPlayerCharge}`} src={`https://action-land-clash.s3-us-west-1.amazonaws.com/b_bar_${secondPlayerCharge}.png`} />
        <p>Charge level: {isFirstPlayer ? firstPlayerCharge : secondPlayerCharge}/12</p>
      </div>
      <div className={winningPlayer !== null ? '' : 'hidden'}>
        <p>{winningPlayer === player ? 'You Won!' : 'Opponent wins this round'}</p>
      </div>
      <img className="healthBar" src={`https://action-land-clash.s3-us-west-1.amazonaws.com/life${isFirstPlayer ? firstPlayerHealth : secondPlayerHealth}.png`} alt={`${thisPlayerColor}'s health bar, currently at ${isFirstPlayer ? firstPlayerHealth : secondPlayerHealth}`}></img>
      <p>{thisPlayerColor} Player's Health: {isFirstPlayer ? firstPlayerHealth : secondPlayerHealth}</p>
      <img className="deckOverlay" alt={activePlayer && !stood ? 'Deck ready to charge' : 'Waiting for other player'} src={activePlayer && !stood ? 'https://action-land-clash.s3-us-west-1.amazonaws.com/charge_overlay.png' : 'https://action-land-clash.s3-us-west-1.amazonaws.com/waiting.png'}></img>
      <input className={!activePlayer || stood ? "deckDisabled" : "deck"} type="image" alt="Player's charge deck, used to increase charge meter" onClick={handleCharge} disabled={!activePlayer || stood} src={thisPlayerColor === 'Red' ? 'https://action-land-clash.s3-us-west-1.amazonaws.com/r_deck.png' : 'https://action-land-clash.s3-us-west-1.amazonaws.com/b_deck.png'}></input>
      <input className={!activePlayer || stood ? "attackDisabled" : "attack"} type="image" alt="Attack button" onClick={handleStand} disabled={!activePlayer || stood} src="https://action-land-clash.s3-us-west-1.amazonaws.com/attack-20200914203605.png"></input>
    </div>
  );
}

export default Gameboard;