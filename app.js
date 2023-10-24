// IMPORTY
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer} from 'socket.io';
import { getCurrentTime } from './utils/getCurrentTime.js';
import { startCountdown } from './utils/startCountdown.js';
import { updateGameScore } from './utils/updateGameScore.js';
import { showRoundNumber } from './utils/showRoundNumber.js';
import { showWinner } from './utils/showWinner.js';
import { resetLobbyAndGameStatus } from './utils/resetLobbyAndGameStatus.js';

// APP, SERVER, IO
const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, { pingInterval: 2000, pingTimeout: 5000 });

// PORT
const port = process.env.PORT || 3000;

// EXPRESS
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

// STAŁE
const ROOM_LOBBY = 'lobby';
const ROOM_PLAYER1 = 'player1';
const ROOM_PLAYER2 = 'player2';

const EMPTY_PLAYER_ID = null;
const EMPTY_PLAYER_NICKNAME = null;
const WAITING_FOR_PLAYER = null;

// ZMIENNE GLOBALNE
const backendPlayers = {};

const lobbyStatus = {
  isPlayer1Ready: false,
  player1Id: EMPTY_PLAYER_ID,
  player1Nickname: WAITING_FOR_PLAYER,
  isPlayer2Ready: false,
  player2Id: EMPTY_PLAYER_ID,
  player2Nickname: WAITING_FOR_PLAYER,
  gameStarted: false,
  round1Started: false,
};

const gameStatus = {
  player1Id: EMPTY_PLAYER_ID,
  player1Nickname: EMPTY_PLAYER_NICKNAME,
  player1Choice: 'qmark',
  player1Score: 0,
  player2Id: EMPTY_PLAYER_ID,
  player2Nickname: EMPTY_PLAYER_NICKNAME,
  player2Choice: 'qmark',
  player2Score: 0,
  round: 1,
  gameCourse: 'Zaczynamy grę!',
}

// IO.ON
io.on('connection', socket => {
  // DOŁĄCZANIE DO POKOJU LOBBY
  socket.join(ROOM_LOBBY);

  // POKAZYWANIE FORMULARZA NAZWY GRACZA
  socket.emit('showEntranceForm');

  // INICJOWANIE GRACZA
  socket.on('initPlayer', nickname => {
    backendPlayers[socket.id] = {
      id: socket.id,
      nickname,
    }
    socket.emit('clearChatMessages');
    io.emit('updatePlayers', backendPlayers);
    io.to(ROOM_LOBBY).emit('updateLobby', lobbyStatus);
    io.to(ROOM_LOBBY).emit('updatePlayer1ChoiceStyle', gameStatus);
    io.to(ROOM_LOBBY).emit('updatePlayer2ChoiceStyle', gameStatus);
    io.to(ROOM_LOBBY).emit('updateGameScore', gameStatus);

    const data = {
      message: `Gracz <strong>${nickname}</strong> dołączył do lobby.`,
      time: getCurrentTime(),
      systemMessage: true,
    }
    io.emit('insertChatMessage', data);
  });

  // DOŁĄCZANIE DO GRY / OPUSZCZANIE GRY GRACZA 1
  socket.on('player1Toggle', () => {
    try {
      if (!lobbyStatus.isPlayer1Ready && backendPlayers[socket.id].nickname) {
        lobbyStatus.isPlayer1Ready = true;
        lobbyStatus.player1Id = socket.id;
        lobbyStatus.player1Nickname = backendPlayers[socket.id].nickname;
        socket.join(ROOM_PLAYER1);
        socket.leave(ROOM_LOBBY);
  
        const data = {
          message: `Gracz <strong>${backendPlayers[socket.id].nickname}</strong> jest gotowy do gry.`,
          time: getCurrentTime(),
          systemMessage: true,
        }

        io.emit('insertChatMessage', data);
        io.to(ROOM_LOBBY).emit('updateLobby', lobbyStatus);
        io.to(ROOM_PLAYER1).emit('updatePlayer1', lobbyStatus);
        io.to(ROOM_PLAYER2).emit('updatePlayer2', lobbyStatus);

        if (lobbyStatus.isPlayer1Ready && lobbyStatus.isPlayer2Ready) {
          lobbyStatus.gameStarted = true;

          gameStatus.player1Id = lobbyStatus.player1Id;
          gameStatus.player1Nickname = lobbyStatus.player1Nickname;
          gameStatus.player2Id = lobbyStatus.player2Id;
          gameStatus.player2Nickname = lobbyStatus.player2Nickname;

          const data = {
            message: `Gracze <strong>${gameStatus.player1Nickname}</strong> i <strong>${gameStatus.player2Nickname}</strong> zaczynają grę.`,
            time: getCurrentTime(),
            systemMessage: true,
          }

          io.emit('insertChatMessage', data);
          io.to(ROOM_PLAYER1).emit('startGamePlayer1', lobbyStatus);
          io.to(ROOM_PLAYER2).emit('startGamePlayer2', lobbyStatus);
          io.to(ROOM_LOBBY).emit('startGameLobby', lobbyStatus);

          // START GRY
          (async () => {
            await startCountdown(io, gameStatus, 3, 'START<br>Gra do 3 wygranych punktów (max 20 rund)');
            lobbyStatus.round1Started = true;
            io.to(ROOM_PLAYER1).emit('startGamePlayer1', lobbyStatus);
            io.to(ROOM_PLAYER2).emit('startGamePlayer2', lobbyStatus);
            io.to(ROOM_LOBBY).emit('startGameLobby', lobbyStatus);

            while (gameStatus.player1Score < 3 && gameStatus.player2Score < 3 && gameStatus.round < 21 && lobbyStatus.player1Id !== null && lobbyStatus.player2Id !== null) {
              await showRoundNumber(io, gameStatus, 1);
              await startCountdown(io, gameStatus, 10, '');
              updateGameScore(io, gameStatus);
            }
          // KONIEC GRY
            gameStatus.round = gameStatus.round - 1;

            if (lobbyStatus.player1Id === null) {
              const data = {
                message: `Gracz <strong>${gameStatus.player2Nickname}</strong> wygrywa walkowerem, ponieważ gracz <strong>${gameStatus.player1Nickname}</strong> wyszedł z gry.`,
                time: getCurrentTime(),
                systemMessage: true,
              }
              io.emit('insertChatMessage', data);
            }

            if (lobbyStatus.player2Id === null) {
              const data = {
                message: `Gracz <strong>${gameStatus.player1Nickname}</strong> wygrywa walkowerem, ponieważ gracz <strong>${gameStatus.player2Nickname}</strong> wyszedł z gry.`,
                time: getCurrentTime(),
                systemMessage: true,
              }
              io.emit('insertChatMessage', data);
            }

            if (gameStatus.round === 6) {
              const data = {
                message: 'Przekroczona liczba 20 rund. Żaden z graczy nie wygrał.',
                time: getCurrentTime(),
                systemMessage: true,
              }
              io.emit('insertChatMessage', data);
            }

            if (gameStatus.player1Score === 3) {
              await showWinner(io, gameStatus, 1, 1);
              const data = {
                message: `Gracz <strong>${gameStatus.player1Nickname}</strong> wygrywa pojedynek z graczem <strong>${gameStatus.player2Nickname}</strong> wynikiem <strong>${gameStatus.player1Score}:${gameStatus.player2Score}</strong> w ${gameStatus.round} rundach.`,
                time: getCurrentTime(),
                systemMessage: true,
              }
              io.emit('insertChatMessage', data);
            } else if (gameStatus.player2Score === 3) {
              await showWinner(io, gameStatus, 1, 2);
              const data = {
                message: `Gracz <strong>${gameStatus.player2Nickname}</strong> wygrywa pojedynek z graczem <strong>${gameStatus.player1Nickname}</strong> wynikiem <strong>${gameStatus.player2Score}:${gameStatus.player1Score}</strong> w ${gameStatus.round} rundach.`,
                time: getCurrentTime(),
                systemMessage: true,
              }
              io.emit('insertChatMessage', data);
            }
            resetLobbyAndGameStatus(lobbyStatus, gameStatus, EMPTY_PLAYER_ID, WAITING_FOR_PLAYER, EMPTY_PLAYER_NICKNAME);
            io.to(ROOM_PLAYER1).emit('updateIsPlayer1');
            io.to(ROOM_PLAYER2).emit('updateIsPlayer2');
          })();
        }
      } else if (lobbyStatus.isPlayer1Ready && backendPlayers[socket.id].nickname && !lobbyStatus.isPlayer2Ready) {
        lobbyStatus.isPlayer1Ready = false;
        lobbyStatus.player1Id = EMPTY_PLAYER_ID;
        lobbyStatus.player1Nickname = WAITING_FOR_PLAYER;
        socket.leave(ROOM_PLAYER1);
        socket.join(ROOM_LOBBY);
  
        const data = {
          message: `Gracz <strong>${backendPlayers[socket.id].nickname}</strong> rezygnuje z gry.`,
          time: getCurrentTime(),
          systemMessage: true,
        }

        io.emit('insertChatMessage', data);
        io.to(ROOM_LOBBY).emit('updateLobby', lobbyStatus);
        io.to(ROOM_PLAYER1).emit('updatePlayer1', lobbyStatus);
        io.to(ROOM_PLAYER2).emit('updatePlayer2', lobbyStatus);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      socket.disconnect();
    }
  });

  // DOŁĄCZANIE DO GRY / OPUSZCZANIE GRY GRACZA 2
  socket.on('player2Toggle', () => {
    try {
      if (!lobbyStatus.isPlayer2Ready && backendPlayers[socket.id].nickname) {
        lobbyStatus.isPlayer2Ready = true;
        lobbyStatus.player2Id = socket.id;
        lobbyStatus.player2Nickname = backendPlayers[socket.id].nickname;
        socket.join(ROOM_PLAYER2);
        socket.leave(ROOM_LOBBY);
  
        const data = {
          message: `Gracz <strong>${backendPlayers[socket.id].nickname}</strong> jest gotowy do gry.`,
          time: getCurrentTime(),
          systemMessage: true,
        }

        io.emit('insertChatMessage', data);
        io.to(ROOM_LOBBY).emit('updateLobby', lobbyStatus);
        io.to(ROOM_PLAYER2).emit('updatePlayer2', lobbyStatus);
        io.to(ROOM_PLAYER1).emit('updatePlayer1', lobbyStatus);

        if (lobbyStatus.isPlayer2Ready && lobbyStatus.isPlayer1Ready) {
          lobbyStatus.gameStarted = true;

          gameStatus.player1Id = lobbyStatus.player1Id;
          gameStatus.player1Nickname = lobbyStatus.player1Nickname;
          gameStatus.player2Id = lobbyStatus.player2Id;
          gameStatus.player2Nickname = lobbyStatus.player2Nickname;

          const data = {
            message: `Gracze <strong>${gameStatus.player1Nickname}</strong> i <strong>${gameStatus.player2Nickname}</strong> zaczynają grę.`,
            time: getCurrentTime(),
            systemMessage: true,
          }

          io.emit('insertChatMessage', data);
          io.to(ROOM_PLAYER1).emit('startGamePlayer1', lobbyStatus);
          io.to(ROOM_PLAYER2).emit('startGamePlayer2', lobbyStatus);
          io.to(ROOM_LOBBY).emit('startGameLobby', lobbyStatus);

          // START GRY
          (async () => {
            await startCountdown(io, gameStatus, 3, 'START<br>Gra do 3 wygranych punktów (max 20 rund)');
            lobbyStatus.round1Started = true;
            io.to(ROOM_PLAYER1).emit('startGamePlayer1', lobbyStatus);
            io.to(ROOM_PLAYER2).emit('startGamePlayer2', lobbyStatus);
            io.to(ROOM_LOBBY).emit('startGameLobby', lobbyStatus);

            while (gameStatus.player1Score < 3 && gameStatus.player2Score < 3 && gameStatus.round < 21 && lobbyStatus.player1Id !== null && lobbyStatus.player2Id !== null) {
              await showRoundNumber(io, gameStatus, 1);
              await startCountdown(io, gameStatus, 10, '');
              updateGameScore(io, gameStatus);
            }
          // KONIEC GRY
            gameStatus.round = gameStatus.round - 1;

            if (lobbyStatus.player1Id === null) {
              const data = {
                message: `Gracz <strong>${gameStatus.player2Nickname}</strong> wygrywa walkowerem, ponieważ gracz <strong>${gameStatus.player1Nickname}</strong> wyszedł z gry.`,
                time: getCurrentTime(),
                systemMessage: true,
              }
              io.emit('insertChatMessage', data);
            }

            if (lobbyStatus.player2Id === null) {
              const data = {
                message: `Gracz <strong>${gameStatus.player1Nickname}</strong> wygrywa walkowerem, ponieważ gracz <strong>${gameStatus.player2Nickname}</strong> wyszedł z gry.`,
                time: getCurrentTime(),
                systemMessage: true,
              }
              io.emit('insertChatMessage', data);
            }

            if (gameStatus.round === 20) {
              const data = {
                message: 'Przekroczona liczba 20 rund. Żaden z graczy nie wygrał.',
                time: getCurrentTime(),
                systemMessage: true,
              }
              io.emit('insertChatMessage', data);
            }

            if (gameStatus.player1Score === 3) {
              await showWinner(io, gameStatus, 1, 1);
              const data = {
                message: `Gracz <strong>${gameStatus.player1Nickname}</strong> wygrywa pojedynek z graczem <strong>${gameStatus.player2Nickname}</strong> wynikiem <strong>${gameStatus.player1Score}:${gameStatus.player2Score}</strong> w ${gameStatus.round} rundach.`,
                time: getCurrentTime(),
                systemMessage: true,
              }
              io.emit('insertChatMessage', data);
            } else if (gameStatus.player2Score === 3) {
              await showWinner(io, gameStatus, 1, 2);
              const data = {
                message: `Gracz <strong>${gameStatus.player2Nickname}</strong> wygrywa pojedynek z graczem <strong>${gameStatus.player1Nickname}</strong> wynikiem <strong>${gameStatus.player2Score}:${gameStatus.player1Score}</strong> w ${gameStatus.round} rundach.`,
                time: getCurrentTime(),
                systemMessage: true,
              }
              io.emit('insertChatMessage', data);
            }
            resetLobbyAndGameStatus(lobbyStatus, gameStatus, EMPTY_PLAYER_ID, WAITING_FOR_PLAYER, EMPTY_PLAYER_NICKNAME);
            io.to(ROOM_PLAYER1).emit('updateIsPlayer1');
            io.to(ROOM_PLAYER2).emit('updateIsPlayer2');
          })();
        }
      } else if (lobbyStatus.isPlayer2Ready && backendPlayers[socket.id].nickname && !lobbyStatus.isPlayer1Ready) {
        lobbyStatus.isPlayer2Ready = false;
        lobbyStatus.player2Id = EMPTY_PLAYER_ID;
        lobbyStatus.player2Nickname = WAITING_FOR_PLAYER;
        socket.leave(ROOM_PLAYER2);
        socket.join(ROOM_LOBBY);
  
        const data = {
          message: `Gracz <strong>${backendPlayers[socket.id].nickname}</strong> rezygnuje z gry.`,
          time: getCurrentTime(),
          systemMessage: true,
        }

        io.emit('insertChatMessage', data);
        io.to(ROOM_LOBBY).emit('updateLobby', lobbyStatus);
        io.to(ROOM_PLAYER2).emit('updatePlayer2', lobbyStatus);
        io.to(ROOM_PLAYER1).emit('updatePlayer1', lobbyStatus);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      socket.disconnect();
    }
  });

  // WYBÓR GRACZA 1 - KAMIEŃ
  socket.on('player1ChooseRock', rock => {
    gameStatus.player1Choice = rock;
    io.to(ROOM_PLAYER1).to(ROOM_LOBBY).emit('updatePlayer1ChoiceStyle', gameStatus);
  });

  // WYBÓR GRACZA 1 - PAPIER
  socket.on('player1ChoosePaper', paper => {
    gameStatus.player1Choice = paper;
    io.to(ROOM_PLAYER1).to(ROOM_LOBBY).emit('updatePlayer1ChoiceStyle', gameStatus);
  });

  // WYBÓR GRACZA 1 - NOŻYCE
  socket.on('player1ChooseScissors', scissors => {
    gameStatus.player1Choice = scissors;
    io.to(ROOM_PLAYER1).to(ROOM_LOBBY).emit('updatePlayer1ChoiceStyle', gameStatus);
  });

  // WYBÓR GRACZA 2 - KAMIEŃ
  socket.on('player2ChooseRock', rock => {
    gameStatus.player2Choice = rock;
    io.to(ROOM_PLAYER2).to(ROOM_LOBBY).emit('updatePlayer2ChoiceStyle', gameStatus);
  });

  // WYBÓR GRACZA 2 - PAPIER
  socket.on('player2ChoosePaper', paper => {
    gameStatus.player2Choice = paper;
    io.to(ROOM_PLAYER2).to(ROOM_LOBBY).emit('updatePlayer2ChoiceStyle', gameStatus);
  });

  // WYBÓR GRACZA 2 - NOŻYCE
  socket.on('player2ChooseScissors', scissors => {
    gameStatus.player2Choice = scissors;
    io.to(ROOM_PLAYER2).to(ROOM_LOBBY).emit('updatePlayer2ChoiceStyle', gameStatus);
  });

  // OPUSZCZANIE POKOJU GRACZA 1 PO ZAKOŃCZONEJ GRZE I DOŁĄCZANIE DO LOBBY ORAZ RESET STYLI DLA LOBBY
  socket.on('leavePlayer1RoomAndJoinLobbyRoom', () => {
    io.to(ROOM_PLAYER1).emit('createPlayer2WeaponsView');
    io.socketsLeave(ROOM_PLAYER1);
    socket.join(ROOM_LOBBY);
    io.to(ROOM_LOBBY).emit('updateLobby', lobbyStatus);
    io.to(ROOM_LOBBY).emit('updateGameScore', gameStatus);
    io.to(ROOM_LOBBY).emit('resetLobbyStyles', gameStatus);
  });

  // OPUSZCZANIE POKOJU GRACZA 2 PO ZAKOŃCZONEJ GRZE I DOŁĄCZANIE DO LOBBY ORAZ RESET STYLI DLA LOBBY
  socket.on('leavePlayer2RoomAndJoinLobbyRoom', () => {
    io.to(ROOM_PLAYER2).emit('createPlayer1WeaponsView');
    io.socketsLeave(ROOM_PLAYER2);
    socket.join(ROOM_LOBBY);
    io.to(ROOM_LOBBY).emit('updateLobby', lobbyStatus);
    io.to(ROOM_LOBBY).emit('updateGameScore', gameStatus);
    io.to(ROOM_LOBBY).emit('resetLobbyStyles', gameStatus);
  });

  // ODBIERANIE WIADOMOŚCI CZATU I WSTAWIANIE JEJ NA CZAT
  socket.on('sendChatMessage', data => {
    try {
      data.nickname = backendPlayers[socket.id].nickname;
      io.emit('insertChatMessage', data);
    } catch (error) {
      console.log(`Error: ${error}`);
      socket.disconnect();
    }
  });

  // ROZŁĄCZANIE GRACZA
  socket.on('disconnect', reason => {
    try {
      if (backendPlayers[socket.id].id == lobbyStatus.player1Id) {
        const data = {
          message: `Gracz <strong>${backendPlayers[socket.id].nickname}</strong> rezygnuje z gry.`,
          time: getCurrentTime(),
          systemMessage: true,
        }
        io.emit('insertChatMessage', data);

        lobbyStatus.isPlayer1Ready = false;
        lobbyStatus.player1Id = EMPTY_PLAYER_ID;
        lobbyStatus.player1Nickname = WAITING_FOR_PLAYER;
      }
      if (backendPlayers[socket.id].id == lobbyStatus.player2Id) {
        const data = {
          message: `Gracz <strong>${backendPlayers[socket.id].nickname}</strong> rezygnuje z gry.`,
          time: getCurrentTime(),
          systemMessage: true,
        }
        io.emit('insertChatMessage', data);

        lobbyStatus.isPlayer2Ready = false;
        lobbyStatus.player2Id = EMPTY_PLAYER_ID;
        lobbyStatus.player2Nickname = WAITING_FOR_PLAYER;
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      socket.disconnect();
    }
    try {
      const data = {
        message: `Gracz <strong>${backendPlayers[socket.id].nickname}</strong> wyszedł z lobby.`,
        time: getCurrentTime(),
        systemMessage: true,
      }
      io.emit('insertChatMessage', data);
    } catch (error) {
      console.log(`Error: ${error}`);
      socket.disconnect();
    }

    delete backendPlayers[socket.id];
    io.emit('updatePlayers', backendPlayers);
    io.to(ROOM_LOBBY).emit('updateLobby', lobbyStatus);
    io.to(ROOM_PLAYER1).emit('updatePlayer1', lobbyStatus);
    io.to(ROOM_PLAYER2).emit('updatePlayer2', lobbyStatus);
  });
});

// SERVER LISTEN
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
});