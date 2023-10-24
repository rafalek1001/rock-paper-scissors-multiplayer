export const startCountdown = (io, gameStatus, seconds, finalText) => {
  return new Promise(async (resolve) => {
    const timeout = setTimeout(() => {
      let counter = seconds;
      const interval = setInterval(() => {
        gameStatus.gameCourse = counter;
        io.emit('updateGameCourse', gameStatus);
        counter--;

        if (counter < 0 ) {
          gameStatus.gameCourse = finalText;
          io.emit('updateGameCourse', gameStatus);
          clearInterval(interval);
          resolve();
        }
      }, 1000);
      clearTimeout(timeout);
    }, 3000);
  });
};