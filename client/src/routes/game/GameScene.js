import Phaser from "phaser";
import { io } from "socket.io-client";

class GameScene extends Phaser.Scene {

  constructor(){
    super("Game");
  }  

  // playerId; oldPosition; oldDirection;
  id;name;roomId;

  // new player
  gridEngineConfig; cloudCityTilemap; 

  init(data){
  
    if(data // 👈 null and undefined check
       && Object.keys(data).length === 0
       && Object.getPrototypeOf(data) === Object.prototype
      ){
      this.initData ={
        map: "cloud-city-map",
      };
    }

    if(this.gridEngine == null){
      // refresh the page
      window.location.reload();
    }
    
  }
  
  preload() {
    this.load.image("tiles", "assets/cloud_tileset.png");
    this.load.tilemapTiledJSON("cloud-city-map", "assets/cloud-city.json");
    this.load.tilemapTiledJSON("mini-map", "assets/cloud-city.json");
    this.load.spritesheet("player", "assets/characters.png", {
      frameWidth: 26,
      frameHeight: 36,
    });
  }
  
  create() {
  
    var self = this;
    this.name = this.game.name;

    // connect to ws
    self.socket = io.connect("http://localhost:3000/",{
      query: "id=" + self.game.id + "&name=" + self.game.name + "&roomId=" + self.game.room_id + "&refresh=" + self.game.refresh,
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "my-custom-header-value",
      },
    });
  
    const {map} = this.initData;
  
    this.cloudCityTilemap = this.make.tilemap({ key: map });
    this.cloudCityTilemap.addTilesetImage("Cloud City", "tiles");
    for (let i = 0; i < this.cloudCityTilemap.layers.length; i++) {
      const layer = this.cloudCityTilemap.createLayer(i, "Cloud City", 0, 0);
      layer.scale = 3;
    }
  
    this.socket.on('currentPlayers', function (players) {
      console.log("current Players")
      console.log(players);
      Object.keys(players).forEach(function (id) {
        let playerSprite = self.add.sprite(0, 0, "player");
        playerSprite.scale = 3;
        playerSprite.id = players[id].socket_id;
  
        self.gridEngine.addCharacter({
          id: players[id].name,
          sprite: playerSprite,
          walkingAnimationMapping: players[id].sprite,
          startPosition: { x: players[id].x, y: players[id].y },
          facingDirection: players[id].facing_direction,
        });
  
        if (players[id].name === self.name) {
          self.cameras.main.startFollow(playerSprite, true);
          self.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height);
          self.id = players[id].id;
          self.name = players[id].name;
          self.roomId = players[id].room_id;
          // localStorage.setItem("roomId", self.roomId);
          // console.log(players[id].playerId)
        }
      });
      console.log(self.gridEngine);
    });
  
    this.socket.on('newPlayer', function (playerInfo) {
      console.log("new Player to be added : ",playerInfo)
      console.log(self.gridEngineConfig)
      let playerSprite = self.add.sprite(0, 0, "player");
      playerSprite.scale = 3;
      playerSprite.id = playerInfo.playerId;
  
      self.gridEngine.addCharacter({
        id: playerInfo.name,
        sprite: playerSprite,
        walkingAnimationMapping: playerInfo.sprite,
        startPosition: { x: playerInfo.x, y: playerInfo.y },
        facingDirection: playerInfo.facing_direction,
      });
      // console.log(self.gridEngine);
    });
  
    this.socket.on('removePlayer', function(playerId){
      console.log("remove Player",playerId)
      self.gridEngine.getSprite(playerId).destroy();
      self.gridEngine.removeCharacter(playerId);
    });
  
    this.socket.on('playerMovement', function (playerInfo) {
      console.log("playerMovement")
      console.log(playerInfo)
      console.log(self.gridEngine);
      
      if(playerInfo.x !== self.gridEngine.getPosition(playerInfo.name).x || playerInfo.y !== self.gridEngine.getPosition(playerInfo.name).y){
        self.gridEngine.moveTo(playerInfo.name, { x: playerInfo.x, y: playerInfo.y });
      }else{
        self.gridEngine.turnTowards(playerInfo.name, playerInfo.facingDirection);
      } 
    });
  
    this.gridEngineConfig = {
      characters : [ ]
    };   
  

      
    this.gridEngine.create(this.cloudCityTilemap, this.gridEngineConfig);
  

  
    // EXPOSE TO EXTENSION
    window.__GRID_ENGINE__ = this.gridEngine;
  }
  
  update() {
    if(this.id && this.name && this.roomId){
      const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.gridEngine.move(this.name, "left");
    } else if (cursors.right.isDown) {
      this.gridEngine.move(this.name, "right");
    } else if (cursors.up.isDown) {
      this.gridEngine.move(this.name, "up");
    } else if (cursors.down.isDown) {
      this.gridEngine.move(this.name, "down");
    } else if(cursors.space.isDown && cursors.space.shiftKey) {
      console.log(this.roomId)
    }  
    if(this.name !== undefined){
      if(this.oldDirection !== this.gridEngine.getFacingDirection(this.name) || this.oldPosition.x !== this.gridEngine.getPosition(this.name).x || this.oldPosition.y !== this.gridEngine.getPosition(this.name).y){
        this.socket.emit('playerMovement', {
          id: this.id,
          name: this.name,
          x: this.gridEngine.getPosition(this.name).x,
          y: this.gridEngine.getPosition(this.name).y,
          roomId: this.roomId,
          facingDirection: this.gridEngine.getFacingDirection(this.name),
        });
        this.oldDirection = this.gridEngine.getFacingDirection(this.name);
        this.oldPosition = this.gridEngine.getPosition(this.name); 
      }
    }
    }
    
    
  }
  
  
}

export default GameScene;