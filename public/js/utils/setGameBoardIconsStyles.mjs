export const setGameBoardIconsStyles = (gameStatus, playerNumber, gameBoardPlayerDisplay, iconSrc, iconAlt) => {
  const gameBoardPlayer = document.querySelector(`.game-board-player${playerNumber}`);
  const gameBoardPlayerIcon = document.querySelector(`.game-board-player${playerNumber}-icon`);

  if (gameBoardPlayerDisplay) {
    gameBoardPlayer.style.display = gameBoardPlayerDisplay;
  }

  if (iconSrc) {
    gameBoardPlayerIcon.src = `img/${iconSrc}.png`;
  }

  if (iconAlt) {
    gameBoardPlayerIcon.alt = iconAlt;
  }

  if (gameStatus.player1Choice === 'rock' && gameStatus.player2Choice === 'rock') {
    gameBoardPlayerIcon.style.border = '8px solid gray';
    gameBoardPlayerIcon.style.backgroundColor = 'lightgrey';
  } else if (gameStatus.player1Choice === 'rock' && gameStatus.player2Choice === 'paper') {
    if (playerNumber === 1) {
      gameBoardPlayerIcon.style.border = '8px solid red';
      gameBoardPlayerIcon.style.backgroundColor = 'lightcoral';
    } else if (playerNumber === 2) {
      gameBoardPlayerIcon.style.border = '8px solid green';
      gameBoardPlayerIcon.style.backgroundColor = 'lightgreen';
    }
  } else if (gameStatus.player1Choice === 'rock' && gameStatus.player2Choice === 'scissors') {
    if (playerNumber === 1) {
      gameBoardPlayerIcon.style.border = '8px solid green';
      gameBoardPlayerIcon.style.backgroundColor = 'lightgreen';
    } else if (playerNumber === 2) {
      gameBoardPlayerIcon.style.border = '8px solid red';
      gameBoardPlayerIcon.style.backgroundColor = 'lightcoral';
    }
  } else if (gameStatus.player1Choice === 'paper' && gameStatus.player2Choice === 'rock') {
    if (playerNumber === 1) {
      gameBoardPlayerIcon.style.border = '8px solid green';
      gameBoardPlayerIcon.style.backgroundColor = 'lightgreen';
    } else if (playerNumber === 2) {
      gameBoardPlayerIcon.style.border = '8px solid red';
      gameBoardPlayerIcon.style.backgroundColor = 'lightcoral';
    }
  } else if (gameStatus.player1Choice === 'paper' && gameStatus.player2Choice === 'paper') {
    gameBoardPlayerIcon.style.border = '8px solid gray';
    gameBoardPlayerIcon.style.backgroundColor = 'lightgrey';
  } else if (gameStatus.player1Choice === 'paper' && gameStatus.player2Choice === 'scissors') {
    if (playerNumber === 1) {
      gameBoardPlayerIcon.style.border = '8px solid red';
      gameBoardPlayerIcon.style.backgroundColor = 'lightcoral';
    } else if (playerNumber === 2) {
      gameBoardPlayerIcon.style.border = '8px solid green';
      gameBoardPlayerIcon.style.backgroundColor = 'lightgreen';
    }
  } else if (gameStatus.player1Choice === 'scissors' && gameStatus.player2Choice === 'rock') {
    if (playerNumber === 1) {
      gameBoardPlayerIcon.style.border = '8px solid red';
      gameBoardPlayerIcon.style.backgroundColor = 'lightcoral';
    } else if (playerNumber === 2) {
      gameBoardPlayerIcon.style.border = '8px solid green';
      gameBoardPlayerIcon.style.backgroundColor = 'lightgreen';
    }
  } else if (gameStatus.player1Choice === 'scissors' && gameStatus.player2Choice === 'paper') {
    if (playerNumber === 1) {
      gameBoardPlayerIcon.style.border = '8px solid green';
      gameBoardPlayerIcon.style.backgroundColor = 'lightgreen';
    } else if (playerNumber === 2) {
      gameBoardPlayerIcon.style.border = '8px solid red';
      gameBoardPlayerIcon.style.backgroundColor = 'lightcoral';
    }
  } else if (gameStatus.player1Choice === 'scissors' && gameStatus.player2Choice === 'scissors') {
    gameBoardPlayerIcon.style.border = '8px solid gray';
    gameBoardPlayerIcon.style.backgroundColor = 'lightgrey';
  } else if (gameStatus.player1Choice === 'qmark' && gameStatus.player2Choice === 'qmark') {
    gameBoardPlayerIcon.style.border = '8px solid gray';
    gameBoardPlayerIcon.style.backgroundColor = 'lightgrey';
  } else if (gameStatus.player1Choice === 'qmark' && gameStatus.player2Choice === 'rock') {
    if (playerNumber === 1) {
      gameBoardPlayerIcon.style.border = '8px solid red';
      gameBoardPlayerIcon.style.backgroundColor = 'lightcoral';
    } else if (playerNumber === 2) {
      gameBoardPlayerIcon.style.border = '8px solid green';
      gameBoardPlayerIcon.style.backgroundColor = 'lightgreen';
    }
  } else if (gameStatus.player1Choice === 'qmark' && gameStatus.player2Choice === 'paper') {
    if (playerNumber === 1) {
      gameBoardPlayerIcon.style.border = '8px solid red';
      gameBoardPlayerIcon.style.backgroundColor = 'lightcoral';
    } else if (playerNumber === 2) {
      gameBoardPlayerIcon.style.border = '8px solid green';
      gameBoardPlayerIcon.style.backgroundColor = 'lightgreen';
    }
  } else if (gameStatus.player1Choice === 'qmark' && gameStatus.player2Choice === 'scissors') {
    if (playerNumber === 1) {
      gameBoardPlayerIcon.style.border = '8px solid red';
      gameBoardPlayerIcon.style.backgroundColor = 'lightcoral';
    } else if (playerNumber === 2) {
      gameBoardPlayerIcon.style.border = '8px solid green';
      gameBoardPlayerIcon.style.backgroundColor = 'lightgreen';
    }
  } else if (gameStatus.player1Choice === 'rock' && gameStatus.player2Choice === 'qmark') {
    if (playerNumber === 1) {
      gameBoardPlayerIcon.style.border = '8px solid green';
      gameBoardPlayerIcon.style.backgroundColor = 'lightgreen';
    } else if (playerNumber === 2) {
      gameBoardPlayerIcon.style.border = '8px solid red';
      gameBoardPlayerIcon.style.backgroundColor = 'lightcoral';
    }
  } else if (gameStatus.player1Choice === 'paper' && gameStatus.player2Choice === 'qmark') {
    if (playerNumber === 1) {
      gameBoardPlayerIcon.style.border = '8px solid green';
      gameBoardPlayerIcon.style.backgroundColor = 'lightgreen';
    } else if (playerNumber === 2) {
      gameBoardPlayerIcon.style.border = '8px solid red';
      gameBoardPlayerIcon.style.backgroundColor = 'lightcoral';
    }
  } else if (gameStatus.player1Choice === 'scissors' && gameStatus.player2Choice === 'qmark') {
    if (playerNumber === 1) {
      gameBoardPlayerIcon.style.border = '8px solid green';
      gameBoardPlayerIcon.style.backgroundColor = 'lightgreen';
    } else if (playerNumber === 2) {
      gameBoardPlayerIcon.style.border = '8px solid red';
      gameBoardPlayerIcon.style.backgroundColor = 'lightcoral';
    }
  }

  if (gameStatus.player2Choice === 'qmark' && playerNumber === 2) {
    gameBoardPlayerIcon.style.transform = 'scaleX(1)';
  } else if (gameStatus.player2Choice !== 'qmark' && playerNumber === 2) {
    gameBoardPlayerIcon.style.transform = 'scaleX(-1)';
  }
};