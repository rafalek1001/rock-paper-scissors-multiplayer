export const showWinner = (io, gameStatus, seconds, playerNumber) => {
  return new Promise(async (resolve) => {
    const timeout = setTimeout(() => {
      let counter = seconds;
      const interval = setInterval(() => {
        if (playerNumber === 1) {
          gameStatus.gameCourse = `Pojedynek wygrywa gracz <strong>${gameStatus.player1Nickname}</strong>`;
        } else if (playerNumber === 2) {
          gameStatus.gameCourse = `Pojedynek wygrywa gracz <strong>${gameStatus.player2Nickname}</strong>`;
        }
        io.emit('updateGameCourse', gameStatus);
        counter--;

        if (counter < 0 ) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
      clearTimeout(timeout);
    }, 1000);
  });
};