var express = require('express');
var app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

// get utils.js
const {createRoom, createPlayer, getRoom, getRoomByEmail, updatePlayer, getPlayerByEmail, getPlayerBySocketId,getPlayersFromRoom, removePlayerBySocketId, removeRoom, updateNameAndSocketId, disconnectPlayer, getPlayerByPlayerId, removePlayerByPlayerId, updatePlayerPosition} = require('./utils');


const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:8080",
      ],
        credentials: true,
        allowHeaders: "*"
    },
  });

const removePlayer = async (id) => {
  const [player, error] = await getPlayerByPlayerId(id);
  console.log("remove player")

  if(error){
    console.log(error);
  }

  if(player.length > 0){
    if(!player[0].connected){
      console.log("player to be remove" + player[0].name);
      await removePlayerByPlayerId(id);
    }else{
      console.log("player is connected");
    }
  }else{
    console.log("player does not exists")
  }

}


io.on("connection", async function (socket) {

    const id = parseInt(socket.request._query['id']);
    const roomId = socket.request._query['roomId'];
    const refresh = socket.request._query['refresh'];
    const name = socket.request._query['name'];

    console.log(id,roomId,name,refresh);

    socket.join(roomId);

    const [player,error] = await updateNameAndSocketId(id, name, socket.id);

    const [playersInRoom, playersInRoomError] = await getPlayersFromRoom(roomId);
    socket.emit("currentPlayers", playersInRoom);
    

    if(!refresh){
      console.log("new player joined")
    }

    if(player.length > 0) {
      socket.to(roomId).emit("newPlayer", player[0]);
    }

    

    socket.on("playerMovement", async (player) => {

      socket.to(player.roomId).emit("playerMovement", player);
      await updatePlayerPosition(player.id, player.x,player.y,player.facingDirection);
    });

    socket.on("disconnect", async function () {
      console.log("user disconnected");

      const [disconnectedUser, disconnectError] = await disconnectPlayer(socket.id);
      socket.to(disconnectedUser[0].room_id).emit("removePlayer", disconnectedUser[0].name);
      setTimeout(removePlayer, 5000, disconnectedUser[0].id);
      

      // const [room, roomError] = await getRoom(playerData.room_id);

      // console.log(room);

      // if(room.length > 0) {
      //   console.log("room still has players");
      // }else{
      //   console.log("room is empty");
      //   const [roomData, roomError] = await removeRoom(playerData[0].room_id);
      //   console.log("room deleted");
      // }

    });
});


server.listen(3000, function () {
  console.log(`Listening on ${server.address().port}`);
});