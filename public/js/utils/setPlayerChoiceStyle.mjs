export const setPlayerChoiceStyle = (playerNumber, rockBorder, paperBorder, scissorsBorder) => {
  const gameBoardPlayerIconRock = document.querySelector(`.game-board-player${playerNumber}-icon-rock`);
  const gameBoardPlayerIconPaper = document.querySelector(`.game-board-player${playerNumber}-icon-paper`);
  const gameBoardPlayerIconScissors = document.querySelector(`.game-board-player${playerNumber}-icon-scissors`);

  if (rockBorder) {
    gameBoardPlayerIconRock.style.border = rockBorder;
  }

  if (paperBorder) {
    gameBoardPlayerIconPaper.style.border = paperBorder;
  }

  if (scissorsBorder) {
    gameBoardPlayerIconScissors.style.border = scissorsBorder;
  }
};