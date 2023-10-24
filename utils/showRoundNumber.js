export const showRoundNumber = (io, gameStatus, seconds) => {
  return new Promise(async (resolve) => {
    const timeout = setTimeout(() => {
      let counter = seconds;
      const interval = setInterval(() => {
        gameStatus.gameCourse = `Runda ${gameStatus.round}`;
        io.emit('updateGameCourse', gameStatus);
        counter--;

        if (counter < 0 ) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
      clearTimeout(timeout);
    }, 2000);
  });
};