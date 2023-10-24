export const resetLobbyAndGameStatus = (lobbyStatus, gameStatus, EMPTY_PLAYER_ID, WAITING_FOR_PLAYER, EMPTY_PLAYER_NICKNAME) => {
  lobbyStatus.isPlayer1Ready = false;
  lobbyStatus.player1Id = EMPTY_PLAYER_ID;
  lobbyStatus.player1Nickname = WAITING_FOR_PLAYER;
  lobbyStatus.isPlayer2Ready = false;
  lobbyStatus.player2Id = EMPTY_PLAYER_ID;
  lobbyStatus.player2Nickname = WAITING_FOR_PLAYER;
  lobbyStatus.gameStarted = false;
  lobbyStatus.round1Started = false;
  
  gameStatus.player1Id = EMPTY_PLAYER_ID;
  gameStatus.player1Nickname = EMPTY_PLAYER_NICKNAME;
  gameStatus.player1Choice = 'qmark';
  gameStatus.player1Score = 0;
  gameStatus.player2Id = EMPTY_PLAYER_ID;
  gameStatus.player2Nickname = EMPTY_PLAYER_NICKNAME;
  gameStatus.player2Choice = 'qmark';
  gameStatus.player2Score = 0;
  gameStatus.round = 1;
  gameStatus.gameCourse = 'Zaczynamy grę!';
};