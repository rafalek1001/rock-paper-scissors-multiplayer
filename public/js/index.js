// IMPORTY
import { Player } from "./classes/Player.mjs";
import { setLobbyStyles } from "./utils/setLobbyStyles.mjs";
import { getCurrentTime } from "./utils/getCurrentTime.mjs";
import { scrollToBottomChat } from "./utils/scrollToBottomChat.mjs";
import { setPlayerChoiceStyle } from "./utils/setPlayerChoiceStyle.mjs";
import { setGameBoardIconsStyles } from "./utils/setGameBoardIconsStyles.mjs";

// SOCKET
const socket = io();

// STAŁE
const PLAYER_NOT_READY_COLOR = 'red';
const PLAYER_READY_COLOR = 'green';
const GAME_START = 'black';
const BUTTON_JOIN_COLOR = 'lightgreen';
const BUTTON_LEAVE_COLOR = 'lightcoral';

// ZMIENNE ELEMENTÓW DOM
const entrance = document.querySelector('.entrance');
const entranceForm = document.querySelector('.entrance-form');
const entranceFormNickname = document.querySelector('#entrance-form-nickname');
const main = document.querySelector('.main');
const gameJoinButton1 = document.querySelector('.game-join-button1');
const gameJoinButton2 = document.querySelector('.game-join-button2');
const gamePlayer1 = document.querySelector('.game-player1');
const gamePlayer2 = document.querySelector('.game-player2');
const gamePlayer1Nickname = document.querySelector('.game-player1-nickname');
const gamePlayer2Nickname = document.querySelector('.game-player2-nickname');
const gamePlayer1Loader = document.querySelector('.game-player1-loader');
const gamePlayer2Loader = document.querySelector('.game-player2-loader');
const lobbyOnlineSpan = document.querySelector('.lobby-online-span');
const lobbyChatForm = document.querySelector('.lobby-chat-form');
const lobbyChatFormTextarea = document.querySelector('.lobby-chat-form-textarea');
const lobbyChatFormButton = document.querySelector('.lobby-chat-form-button');
const lobbyChatMessages = document.querySelector('.lobby-chat-messages');
const gameBoardCourse = document.querySelector('.game-board-course');
const gameBoardPlayer1 = document.querySelector('.game-board-player1');
const gameBoardPlayer2 = document.querySelector('.game-board-player2');
const gameBoardPlayer1Icon = document.querySelector('.game-board-player1-icon');
const gameBoardPlayer2Icon = document.querySelector('.game-board-player2-icon');
let gameBoardPlayer1IconRock = document.querySelector('.game-board-player1-icon-rock');
let gameBoardPlayer1IconPaper = document.querySelector('.game-board-player1-icon-paper');
let gameBoardPlayer1IconScissors = document.querySelector('.game-board-player1-icon-scissors');
let gameBoardPlayer2IconRock = document.querySelector('.game-board-player2-icon-rock');
let gameBoardPlayer2IconPaper = document.querySelector('.game-board-player2-icon-paper');
let gameBoardPlayer2IconScissors = document.querySelector('.game-board-player2-icon-scissors');
let gameBoardScore = document.querySelector('.game-board-score');
let gamePlayer1Weapons = document.querySelector('.game-player1-weapons');
let gamePlayer2Weapons = document.querySelector('.game-player2-weapons');

// ZMIENNE GLOBALNE
let lobbyChatFormTextareaFocused = false;

let isPlayer1 = false;
let isPlayer2 = false;

const players = {};

// SOCKET.ON
  // POKAZYWANIE FORMULARZA NAZWY GRACZA
socket.on('showEntranceForm', () => {
  entrance.style.display = 'block';
  entranceFormNickname.value = '';
  main.style.opacity = '0.3';
  main.style.pointerEvents = 'none';
});

  // CZYSZCZENIE CZATU
socket.on('clearChatMessages', () => {
  while (lobbyChatMessages.firstChild) {
    lobbyChatMessages.removeChild(lobbyChatMessages.firstChild);
  }
});

  // AKTUALIZACJA GRACZY (WEJŚCIE I WYJŚCIE)
socket.on('updatePlayers', backendPlayers => {
  for (const id in backendPlayers) {
    const backendPlayer = backendPlayers[id];
    if (!players[id]) {
      players[id] = new Player(backendPlayer.id, backendPlayer.nickname, backendPlayer.status);
    }
  }
  for (const id in players) {
    if (!backendPlayers[id]) {
      delete players[id];
    }
  }
  lobbyOnlineSpan.innerHTML = 'Online:';
  for (const id in players) {
    lobbyOnlineSpan.innerHTML += ` ${players[id].nickname};`;
  }
});

  // AKTUALIZACJA LOBBY
socket.on('updateLobby', lobbyStatus => {
  if (!lobbyStatus.gameStarted) {
    if (lobbyStatus.isPlayer1Ready) {
      setLobbyStyles(lobbyStatus, 1, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, PLAYER_READY_COLOR, 'hidden');
    } else {
      if (lobbyStatus.gameStarted) {
        setLobbyStyles(lobbyStatus, 1, 'hidden', 'Dołącz', BUTTON_LEAVE_COLOR, PLAYER_READY_COLOR, 'hidden');
      } else {
        setLobbyStyles(lobbyStatus, 1, 'visible', 'Dołącz', BUTTON_JOIN_COLOR, PLAYER_NOT_READY_COLOR, 'visible');
      }
    }
  
    if (lobbyStatus.isPlayer2Ready) {
      setLobbyStyles(lobbyStatus, 2, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, PLAYER_READY_COLOR, 'hidden');
    } else {
      if (lobbyStatus.gameStarted) {
        setLobbyStyles(lobbyStatus, 2, 'hidden', 'Dołącz', BUTTON_LEAVE_COLOR, PLAYER_READY_COLOR, 'hidden');
      } else {
        setLobbyStyles(lobbyStatus, 2, 'visible', 'Dołącz', BUTTON_JOIN_COLOR, PLAYER_NOT_READY_COLOR, 'visible');
      }
    }
  } else {
    if (lobbyStatus.round1Started) {
      setLobbyStyles(lobbyStatus, 1, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, GAME_START, 'hidden', 'hidden', 'none', 'block', 'block');
      setLobbyStyles(lobbyStatus, 2, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, GAME_START, 'hidden', 'hidden', 'none', 'block', 'block');
    } else {
      setLobbyStyles(lobbyStatus, 1, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, GAME_START, 'hidden', 'hidden', 'none', 'block', 'none');
      setLobbyStyles(lobbyStatus, 2, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, GAME_START, 'hidden', 'hidden', 'none', 'block', 'none');
    }
  }
});

  // AKTUALIZACJA GRACZA 1
socket.on('updatePlayer1', lobbyStatus => {
  if (!lobbyStatus.gameStarted) {
    if (lobbyStatus.isPlayer1Ready && !lobbyStatus.isPlayer2Ready) {
      setLobbyStyles(lobbyStatus, 1, 'visible', 'Opuść', BUTTON_LEAVE_COLOR, PLAYER_READY_COLOR, 'hidden');
      setLobbyStyles(lobbyStatus, 2, 'hidden', 'Dołącz', BUTTON_JOIN_COLOR, PLAYER_NOT_READY_COLOR, 'visible');
    } else if (lobbyStatus.isPlayer1Ready && lobbyStatus.isPlayer2Ready) {
      setLobbyStyles(lobbyStatus, 1, 'visible', 'Opuść', BUTTON_LEAVE_COLOR, PLAYER_READY_COLOR, 'hidden');
      setLobbyStyles(lobbyStatus, 2, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, PLAYER_READY_COLOR, 'hidden');
    }
  }
});

  // AKTUALIZACJA GRACZA 2
socket.on('updatePlayer2', lobbyStatus => {
  if (!lobbyStatus.gameStarted) {
    if (lobbyStatus.isPlayer2Ready && !lobbyStatus.isPlayer1Ready) {
      setLobbyStyles(lobbyStatus, 2, 'visible', 'Opuść', BUTTON_LEAVE_COLOR, PLAYER_READY_COLOR, 'hidden');
      setLobbyStyles(lobbyStatus, 1, 'hidden', 'Dołącz', BUTTON_JOIN_COLOR, PLAYER_NOT_READY_COLOR, 'visible');
    } else if (lobbyStatus.isPlayer2Ready && lobbyStatus.isPlayer1Ready){
      setLobbyStyles(lobbyStatus, 2, 'visible', 'Opuść', BUTTON_LEAVE_COLOR, PLAYER_READY_COLOR, 'hidden');
      setLobbyStyles(lobbyStatus, 1, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, PLAYER_READY_COLOR, 'hidden');
    }
  }
});

  // START GRY - GRACZ 1
socket.on('startGamePlayer1', lobbyStatus => {
  if (lobbyStatus.round1Started) {
    isPlayer1 = true;
    console.log(`isPlayer1: ${isPlayer1}`);
    setLobbyStyles(lobbyStatus, 1, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, GAME_START, 'hidden', 'visible', undefined, 'block', 'block');
    setLobbyStyles(lobbyStatus, 2, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, GAME_START, 'hidden', 'hidden', undefined, 'block', 'block');
    gamePlayer2Weapons.remove();
  } else {
    setLobbyStyles(lobbyStatus, 1, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, GAME_START, 'hidden', 'hidden', undefined, 'block', 'none');
    setLobbyStyles(lobbyStatus, 2, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, GAME_START, 'hidden', 'hidden', undefined, 'block', 'none');
  }
});

  // START GRY - GRACZ 2
socket.on('startGamePlayer2', lobbyStatus => {
  if (lobbyStatus.round1Started) {
    isPlayer2 = true;
    console.log(`isPlayer2: ${isPlayer2}`);
    setLobbyStyles(lobbyStatus, 1, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, GAME_START, 'hidden', 'hidden', undefined, 'block', 'block');
    setLobbyStyles(lobbyStatus, 2, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, GAME_START, 'hidden', 'visible', undefined, 'block', 'block');
    gamePlayer1Weapons.remove();
  } else {
    setLobbyStyles(lobbyStatus, 1, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, GAME_START, 'hidden', 'hidden', undefined, 'block', 'none');
    setLobbyStyles(lobbyStatus, 2, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, GAME_START, 'hidden', 'hidden', undefined, 'block', 'none');
  }
});

  // START GRY - LOBBY
socket.on('startGameLobby', lobbyStatus => {
  if (lobbyStatus.round1Started) {
    setLobbyStyles(lobbyStatus, 1, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, GAME_START, 'hidden', 'hidden', 'none', 'block', 'block');
    setLobbyStyles(lobbyStatus, 2, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, GAME_START, 'hidden', 'hidden', 'none', 'block', 'block');
  } else {
    setLobbyStyles(lobbyStatus, 1, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, GAME_START, 'hidden', 'hidden', 'none', 'block', 'none');
    setLobbyStyles(lobbyStatus, 2, 'hidden', 'Opuść', BUTTON_LEAVE_COLOR, GAME_START, 'hidden', 'hidden', 'none', 'block', 'none');
  }
});

  // AKTUALIZACJA WYBORU - GRACZ 1
socket.on('updatePlayer1ChoiceStyle', gameStatus => {
  if (gameStatus.player1Choice === 'rock') {
    setPlayerChoiceStyle(1, '4px solid green', 'none', 'none');
  } else if (gameStatus.player1Choice === 'paper') {
    setPlayerChoiceStyle(1, 'none', '4px solid green', 'none');
  } else if (gameStatus.player1Choice === 'scissors') {
    setPlayerChoiceStyle(1, 'none', 'none', '4px solid green');
  }
});

  // AKTUALIZACJA WYBORU - GRACZ 2
socket.on('updatePlayer2ChoiceStyle', gameStatus => {
  if (gameStatus.player2Choice === 'rock') {
    setPlayerChoiceStyle(2, '4px solid green', 'none', 'none');
  } else if (gameStatus.player2Choice === 'paper') {
    setPlayerChoiceStyle(2, 'none', '4px solid green', 'none');
  } else if (gameStatus.player2Choice === 'scissors') {
    setPlayerChoiceStyle(2, 'none', 'none', '4px solid green');
  }
});

  // POKAZANIE WYBORU GRACZY
socket.on('showPlayersChoice', gameStatus => {
  setGameBoardIconsStyles(gameStatus, 1, 'block', gameStatus.player1Choice, gameStatus.player1Choice);
  setGameBoardIconsStyles(gameStatus, 2, 'block', gameStatus.player2Choice, gameStatus.player2Choice);
});

  // PRZEBIEG GRY
socket.on('updateGameCourse', gameStatus => {
  gameBoardCourse.innerHTML = gameStatus.gameCourse;
});

  // AKTUALIZACJA WYNIKU
socket.on('updateGameScore', gameStatus => {
  gameBoardScore.innerHTML = `${gameStatus.player1Score} : ${gameStatus.player2Score}`;
});

  // AKTUALIZACJA ZMIENNEJ ISPLAYER1 PO ZAKOŃCZENIU GRY
socket.on('updateIsPlayer1', () => {
  isPlayer1 = false;
  console.log(`isPlayer1: ${isPlayer1}`);
  socket.emit('leavePlayer1RoomAndJoinLobbyRoom');
});

  // AKTUALIZACJA ZMIENNEJ ISPLAYER2 PO ZAKOŃCZENIU GRY
socket.on('updateIsPlayer2', () => {
  isPlayer2 = false;
  console.log(`isPlayer2: ${isPlayer2}`);
  socket.emit('leavePlayer2RoomAndJoinLobbyRoom');
});

  // TWORZENIE WIDOKU BRONI GRACZA 1 PO ZAKOŃCZENIU GRY
socket.on('createPlayer1WeaponsView', () => {
  gamePlayer1Weapons = document.createElement('div');
  gamePlayer1Weapons.classList.add('game-player1-weapons');
  gamePlayer1.appendChild(gamePlayer1Weapons);

  gameBoardPlayer1IconRock = document.createElement('img');
  gameBoardPlayer1IconPaper = document.createElement('img');
  gameBoardPlayer1IconScissors = document.createElement('img');

  gameBoardPlayer1IconScissors.src = 'img/scissors.png';
  gameBoardPlayer1IconPaper.src = 'img/paper.png';
  gameBoardPlayer1IconRock.src = 'img/rock.png';
  gameBoardPlayer1IconScissors.alt = 'scissors';
  gameBoardPlayer1IconPaper.alt = 'paper';
  gameBoardPlayer1IconRock.alt = 'rock';

  gamePlayer1Weapons.appendChild(gameBoardPlayer1IconRock);
  gamePlayer1Weapons.appendChild(gameBoardPlayer1IconPaper);
  gamePlayer1Weapons.appendChild(gameBoardPlayer1IconScissors);

  gameBoardPlayer1IconScissors.classList.add('game-player1-weapons-icon', 'game-board-player1-icon-scissors');
  gameBoardPlayer1IconPaper.classList.add('game-player1-weapons-icon', 'game-board-player1-icon-paper');
  gameBoardPlayer1IconRock.classList.add('game-player1-weapons-icon', 'game-board-player1-icon-rock');

  gamePlayer1.insertBefore(gamePlayer1Weapons, gameJoinButton1);

  gameBoardPlayer1IconRock.addEventListener('click', event => {
    isPlayer1 && socket.emit('player1ChooseRock', 'rock');
  });

  gameBoardPlayer1IconPaper.addEventListener('click', event => {
    isPlayer1 && socket.emit('player1ChoosePaper', 'paper');
  });

  gameBoardPlayer1IconScissors.addEventListener('click', event => {
    isPlayer1 && socket.emit('player1ChooseScissors', 'scissors');
  });
});

  // TWORZENIE WIDOKU BRONI GRACZA 2 PO ZAKOŃCZENIU GRY
socket.on('createPlayer2WeaponsView', () => {
  gamePlayer2Weapons = document.createElement('div');
  gamePlayer2Weapons.classList.add('game-player2-weapons');
  gamePlayer2.appendChild(gamePlayer2Weapons);

  gameBoardPlayer2IconScissors = document.createElement('img');
  gameBoardPlayer2IconPaper = document.createElement('img');
  gameBoardPlayer2IconRock = document.createElement('img');

  gameBoardPlayer2IconScissors.src = 'img/scissors.png';
  gameBoardPlayer2IconPaper.src = 'img/paper.png';
  gameBoardPlayer2IconRock.src = 'img/rock.png';
  gameBoardPlayer2IconScissors.alt = 'scissors';
  gameBoardPlayer2IconPaper.alt = 'paper';
  gameBoardPlayer2IconRock.alt = 'rock';

  gamePlayer2Weapons.appendChild(gameBoardPlayer2IconScissors);
  gamePlayer2Weapons.appendChild(gameBoardPlayer2IconPaper);
  gamePlayer2Weapons.appendChild(gameBoardPlayer2IconRock);

  gameBoardPlayer2IconScissors.classList.add('game-player2-weapons-icon', 'game-board-player2-icon-scissors');
  gameBoardPlayer2IconPaper.classList.add('game-player2-weapons-icon', 'game-board-player2-icon-paper');
  gameBoardPlayer2IconRock.classList.add('game-player2-weapons-icon', 'game-board-player2-icon-rock');

  gamePlayer2.insertBefore(gamePlayer2Weapons, gameJoinButton2);

  gameBoardPlayer2IconRock.addEventListener('click', event => {
    isPlayer2 && socket.emit('player2ChooseRock', 'rock');
  });

  gameBoardPlayer2IconPaper.addEventListener('click', event => {
    isPlayer2 && socket.emit('player2ChoosePaper', 'paper');
  });

  gameBoardPlayer2IconScissors.addEventListener('click', event => {
    isPlayer2 && socket.emit('player2ChooseScissors', 'scissors');
  });
});

  // RESET STYLI DLA LOBBY PO ZAKOŃCZONEJ GRZE
socket.on('resetLobbyStyles', (gameStatus) => {
  gamePlayer1Weapons.style.visibility = 'hidden';
  gamePlayer2Weapons.style.visibility = 'hidden';
  gameBoardCourse.innerHTML = gameStatus.gameCourse;
  gameBoardCourse.style.display = 'none';
  gameBoardPlayer1.style.display = 'none';
  gameBoardPlayer2.style.display = 'none';
  gameBoardScore.style.display = 'none';
  gamePlayer1Weapons.style.pointerEvents = 'auto';
  gamePlayer2Weapons.style.pointerEvents = 'auto';
  setPlayerChoiceStyle(1, 'none', 'none', 'none');
  setPlayerChoiceStyle(2, 'none', 'none', 'none');
});

  // WSTAWIANIE WIADOMOŚCI DO CZATU
socket.on('insertChatMessage', ({nickname, message, time, systemMessage}) => {
  const lobbyChatMessagesSpan = document.createElement("span");
  lobbyChatMessagesSpan.classList.add('lobby-chat-messages-span');

  if (nickname && !systemMessage) {
    lobbyChatMessagesSpan.innerHTML += `${time} <strong>${nickname}</strong>: ${message}`;
  } else {
    lobbyChatMessagesSpan.classList.add('lobby-chat-messages-span-system');
    lobbyChatMessagesSpan.innerHTML += `${time} ${message}`;
  }
  lobbyChatMessages.appendChild(lobbyChatMessagesSpan);
  scrollToBottomChat(lobbyChatMessages);
});

// EVENT LISTENERY
  // ZATWIERDZANIE NAZWY GRACZA
entranceForm.addEventListener('submit', event => {
  event.preventDefault();
  socket.emit('initPlayer', entranceFormNickname.value);
  entrance.style.display = 'none';
  main.style.opacity = '1';
  main.style.pointerEvents = 'auto';
});

  // PRZYCISK: DOŁĄCZANIE DO GRY / OPUSZCZANIE GRY JAKO GRACZ 1
gameJoinButton1.addEventListener('click', event => {
  socket.emit('player1Toggle');
});

  // PRZYCISK: DOŁĄCZANIE DO GRY / OPUSZCZANIE GRY JAKO GRACZ 2
gameJoinButton2.addEventListener('click', event => {
  socket.emit('player2Toggle');
});

  // WYSYŁANIE WIADOMOŚCI NA CZACIE
lobbyChatForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = {
    nickname: null,
    message: lobbyChatFormTextarea.value.replace(/\s+/g, ' '),
    time: getCurrentTime(),
    systemMessage: false,
  }
  socket.emit('sendChatMessage', data);
  lobbyChatFormTextarea.value = '';
});

  // FOCUS NA POLE WIADOMOŚCI CZATU
lobbyChatFormTextarea.addEventListener("focus", () => {
  lobbyChatFormTextareaFocused = true;
  lobbyChatFormTextarea.placeholder = '';
});

  // FOCUS OUT Z POLA WIADOMOŚCI CZATU
lobbyChatFormTextarea.addEventListener("focusout", () => {
  lobbyChatFormTextareaFocused = false;
  lobbyChatFormTextarea.placeholder = 'Twoja wiadomość...';
});

  // WYSYŁANIE WIADOMOŚCI NA CHACIE ZA POMOCĄ ENTERA
lobbyChatForm.addEventListener('keydown', event => {
    if (lobbyChatFormTextareaFocused) {
      if (event.key === 'Enter' && !event.shiftKey) {
        lobbyChatFormButton.click();
        event.preventDefault();
      }
    }
});

  // WYBÓR (KAMIEŃ) - GRACZ 1
gameBoardPlayer1IconRock.addEventListener('click', event => {
  isPlayer1 && socket.emit('player1ChooseRock', 'rock');
});

  // WYBÓR (PAPIER) - GRACZ 1
gameBoardPlayer1IconPaper.addEventListener('click', event => {
  isPlayer1 && socket.emit('player1ChoosePaper', 'paper');
});

  // WYBÓR (NOŻYCE) - GRACZ 1
gameBoardPlayer1IconScissors.addEventListener('click', event => {
  isPlayer1 && socket.emit('player1ChooseScissors', 'scissors');
});

  // WYBÓR (KAMIEŃ) - GRACZ 2
gameBoardPlayer2IconRock.addEventListener('click', event => {
  isPlayer2 && socket.emit('player2ChooseRock', 'rock');
});

  // WYBÓR (PAPIER) - GRACZ 2
gameBoardPlayer2IconPaper.addEventListener('click', event => {
  isPlayer2 && socket.emit('player2ChoosePaper', 'paper');
});

  // WYBÓR (NOŻYCE) - GRACZ 2
gameBoardPlayer2IconScissors.addEventListener('click', event => {
  isPlayer2 && socket.emit('player2ChooseScissors', 'scissors');
});