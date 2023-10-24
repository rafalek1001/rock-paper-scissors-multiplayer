export const setLobbyStyles = (lobbyStatus, playerNumber, buttonVisibility, buttonText, buttonColor, playerBorder, loaderVisibility, weaponsVisibility, weaponsEvents, gameBoardCourseDisplay, gameBoardScoreDisplay) => {
  const gameJoinButton = document.querySelector(`.game-join-button${playerNumber}`);
  const gamePlayer = document.querySelector(`.game-player${playerNumber}`);
  const gamePlayerNickname = document.querySelector(`.game-player${playerNumber}-nickname`);
  const gamePlayerLoader = document.querySelector(`.game-player${playerNumber}-loader`);
  const gamePlayerWeapons = document.querySelector(`.game-player${playerNumber}-weapons`);
  const gameBoardCourse = document.querySelector('.game-board-course');
  const gameBoardScore = document.querySelector('.game-board-score');

  if (buttonVisibility && buttonText && buttonColor) {
    gameJoinButton.style.visibility = buttonVisibility;
    gameJoinButton.innerHTML = buttonText;
    gameJoinButton.style.backgroundColor = buttonColor;
  }

  if (playerBorder) {
    gamePlayer.style.border = `solid ${playerBorder} 4px`;
  }

  if (lobbyStatus) {
    if (lobbyStatus[`player${playerNumber}Nickname`] === null) {
      gamePlayerNickname.innerHTML = 'Oczekiwanie na gracza';
    } else {
      const nickname = lobbyStatus[`player${playerNumber}Nickname`];
      gamePlayerNickname.innerHTML = `<b>${nickname}</b>`;
    }
  }

  if (loaderVisibility) {
    gamePlayerLoader.style.visibility = loaderVisibility;
  }

  if (weaponsVisibility) {
    gamePlayerWeapons.style.visibility = weaponsVisibility;
  }

  if (weaponsEvents) {
    gamePlayerWeapons.style.pointerEvents = weaponsEvents;
  }

  if (gameBoardCourseDisplay) {
    gameBoardCourse.style.display = gameBoardCourseDisplay;
  }

  if (gameBoardScoreDisplay) {
    gameBoardScore.style.display = gameBoardScoreDisplay;
  }
};