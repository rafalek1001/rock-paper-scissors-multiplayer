export const updateGameScore = (io, gameStatus) => {
  if (gameStatus.player1Choice === 'rock' && gameStatus.player2Choice === 'rock') {
    gameStatus.gameCourse = 'Remis';
  } else if (gameStatus.player1Choice === 'rock' && gameStatus.player2Choice === 'paper') {
    gameStatus.player2Score++;
    gameStatus.gameCourse = `Punkt zdobywa gracz <strong>${gameStatus.player2Nickname}</strong>`;
  } else if (gameStatus.player1Choice === 'rock' && gameStatus.player2Choice === 'scissors') {
    gameStatus.player1Score++;
    gameStatus.gameCourse = `Punkt zdobywa gracz <strong>${gameStatus.player1Nickname}</strong>`;
  } else if (gameStatus.player1Choice === 'paper' && gameStatus.player2Choice === 'rock') {
    gameStatus.player1Score++;
    gameStatus.gameCourse = `Punkt zdobywa gracz <strong>${gameStatus.player1Nickname}</strong>`;
  } else if (gameStatus.player1Choice === 'paper' && gameStatus.player2Choice === 'paper') {
    gameStatus.gameCourse = 'Remis';
  } else if (gameStatus.player1Choice === 'paper' && gameStatus.player2Choice === 'scissors') {
    gameStatus.player2Score++;
    gameStatus.gameCourse = `Punkt zdobywa gracz <strong>${gameStatus.player2Nickname}</strong>`;
  } else if (gameStatus.player1Choice === 'scissors' && gameStatus.player2Choice === 'rock') {
    gameStatus.player2Score++;
    gameStatus.gameCourse = `Punkt zdobywa gracz <strong>${gameStatus.player2Nickname}</strong>`;
  } else if (gameStatus.player1Choice === 'scissors' && gameStatus.player2Choice === 'paper') {
    gameStatus.player1Score++;
    gameStatus.gameCourse = `Punkt zdobywa gracz <strong>${gameStatus.player1Nickname}</strong>`;
  } else if (gameStatus.player1Choice === 'scissors' && gameStatus.player2Choice === 'scissors') {
    gameStatus.gameCourse = 'Remis';
  } else if (gameStatus.player1Choice === 'qmark' && gameStatus.player2Choice === 'qmark') {
    gameStatus.gameCourse = 'Remis';
  } else if (gameStatus.player1Choice === 'qmark' && gameStatus.player2Choice === 'rock') {
    gameStatus.player2Score++;
    gameStatus.gameCourse = `Punkt zdobywa gracz <strong>${gameStatus.player2Nickname}</strong>`;
  } else if (gameStatus.player1Choice === 'qmark' && gameStatus.player2Choice === 'paper') {
    gameStatus.player2Score++;
    gameStatus.gameCourse = `Punkt zdobywa gracz <strong>${gameStatus.player2Nickname}</strong>`;
  } else if (gameStatus.player1Choice === 'qmark' && gameStatus.player2Choice === 'scissors') {
    gameStatus.player2Score++;
    gameStatus.gameCourse = `Punkt zdobywa gracz <strong>${gameStatus.player2Nickname}</strong>`;
  } else if (gameStatus.player1Choice === 'rock' && gameStatus.player2Choice === 'qmark') {
    gameStatus.player1Score++;
    gameStatus.gameCourse = `Punkt zdobywa gracz <strong>${gameStatus.player1Nickname}</strong>`;
  } else if (gameStatus.player1Choice === 'paper' && gameStatus.player2Choice === 'qmark') {
    gameStatus.player1Score++;
    gameStatus.gameCourse = `Punkt zdobywa gracz <strong>${gameStatus.player1Nickname}</strong>`;
  } else if (gameStatus.player1Choice === 'scissors' && gameStatus.player2Choice === 'qmark') {
    gameStatus.player1Score++;
    gameStatus.gameCourse = `Punkt zdobywa gracz <strong>${gameStatus.player1Nickname}</strong>`;
  }

  gameStatus.round++;

  io.emit('showPlayersChoice', gameStatus);
  io.emit('updateGameScore', gameStatus);
  io.emit('updateGameCourse', gameStatus);
};