var express = require('express');
var app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:8080",
      ],
        credentials: true,
        allowHeaders: "*"
    },
  });

// players
var players = {};

/* 
    Issues
    - on refresh socket.id is changed
*/


io.on("connection", function (socket) {
    // console.log("a user connected");

    const char = parseInt(socket.request._query['char']);
    const name = socket.request._query['playerName'];

    console.log(char);

    players[socket.id] = {
        name: name,
        x: 3,
        y: 4,
        playerId: socket.id,
        walkingAnimationMapping: char == undefined ? 0 : char,
        facingDirection: "down"
    };


    console.log(players);

    socket.emit("currentPlayers", players);


    socket.broadcast.emit("newPlayer", players[socket.id]);

    // socket.broadcast.emit('playerMovement', players[socket.id]);

    socket.on("playerMovement", (movementData) => {
        players[movementData.playerId].x = movementData.x;
        players[movementData.playerId].y = movementData.y;
        players[movementData.playerId].facingDirection = movementData.facingDirection;
        socket.broadcast.emit("playerMovement", movementData);
    });

    socket.on("disconnect", function () {
        console.log("user disconnected");
        delete players[socket.id];
        socket.broadcast.emit("removePlayer", socket.id);
    });
});


server.listen(3000, function () {
  console.log(`Listening on ${server.address().port}`);
});