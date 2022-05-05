import Phaser from "phaser";
import { io } from "socket.io-client";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class GameScene extends Phaser.Scene {

  constructor(){
    super("Game");
  }  

  playerId; oldPosition; oldDirection;

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

    // connect to ws
    self.socket = io.connect("http://localhost:3000/",{
      query: "playerName="+this.game.charName+"&char="+this.game.char, 
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
        playerSprite.id = players[id].playerId;
  
        self.gridEngine.addCharacter({
          id: players[id].playerId,
          sprite: playerSprite,
          walkingAnimationMapping: players[id].walkingAnimationMapping,
          startPosition: { x: players[id].x, y: players[id].y },
          facingDirection: players[id].facingDirection,
        });
  
        if (players[id].playerId === self.socket.id) {
          self.cameras.main.startFollow(playerSprite, true);
          self.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height);
          self.playerId = players[id].playerId;
          // console.log(players[id].playerId)
        }
      });
    });
  
    this.socket.on('newPlayer', function (playerInfo) {
      console.log("new Player")
      let playerSprite = self.add.sprite(0, 0, "player");
      playerSprite.scale = 3;
      playerSprite.id = playerInfo.playerId;
  
      self.gridEngine.addCharacter({
        id: playerInfo.playerId,
        sprite: playerSprite,
        walkingAnimationMapping: playerInfo.walkingAnimationMapping,
        startPosition: { x: playerInfo.x, y: playerInfo.y },
        facingDirection: playerInfo.facingDirection,
      });
    });
  
    this.socket.on('removePlayer', function(playerId){
      console.log("remove Player")
      self.gridEngine.getSprite(playerId).destroy();
      self.gridEngine.removeCharacter(playerId);
    });
  
    this.socket.on('playerMovement', function (playerInfo) {
      console.log("playerMovement")
      self.gridEngine.moveTo(playerInfo.playerId, { x: playerInfo.x, y: playerInfo.y });
      self.gridEngine.turnTowards(playerInfo.playerId, playerInfo.facingDirection);
    });
  
    this.gridEngineConfig = {
      characters : [
        
      ]
    };   
  
    // for(let i = 12; i < 15; i++) {
    //   const spr = this.add.sprite(0,0,"player");
    //   spr.scale = 3;
    //   this.gridEngineConfig.characters.push({
    //     id: "enemy" + i,
    //     sprite: spr,
    //     walkingAnimationMapping: i - 12,
    //     startPosition:{x: i,y: i},
    //   });
    // }
      
    this.gridEngine.create(this.cloudCityTilemap, this.gridEngineConfig);
  
    // for(let i = 12; i < 15; i++) {
    //   this.gridEngine.moveRandomly("enemy" + i , getRandomInt(0,1500));
    // }
  
  
  
    // check if player is in front of door then teleport
    // this.gridEngine.positionChangeStarted()
    //                .subscribe(({charId,enterTile}) => {                  
    //                   if(enterTile.x === 13 && enterTile.y === 6){
    //                     this.cameras.main.fadeOut(300);
    //                     this.time.delayedCall(300,()=>{
    //                       this.scene.restart({
    //                         map: "mini-map",
    //                         charPosition: {x:14,y:15},
    //                       })
    //                       this.cameras.main.fadeIn(300);
    //                     });
    //                   }
    //                })
  
  
    // EXPOSE TO EXTENSION
    window.__GRID_ENGINE__ = this.gridEngine;
  }
  
  update() {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.gridEngine.move(this.playerId, "left");
    } else if (cursors.right.isDown) {
      this.gridEngine.move(this.playerId, "right");
    } else if (cursors.up.isDown) {
      this.gridEngine.move(this.playerId, "up");
    } else if (cursors.down.isDown) {
      this.gridEngine.move(this.playerId, "down");
    } else if(cursors.space.isDown && cursors.space.shiftKey) {
      // if(!newPlayer){
  
        // const newPlayerSprite = this.add.sprite(0, 0, "player");
        // newPlayerSprite.scale = 3;
      //   this.gridEngine.addCharacter({
      //     id: "newPlayer",
      //     sprite: newPlayerSprite,
      //     walkingAnimationMapping: 7,
      //     startPosition: { x: 3, y: 3 },
      //   });
  
      //   newPlayer = true;
      
  
        
      //   this.gridEngine.moveRandomly("newPlayer" , getRandomInt(0,1500));
        
        
      //   newPlayer = true;
      // }
    }
  
    // if(this.gridEngine.isMoving(playerId)){
    //   console.log("moving")
    // }
  
    if(this.playerId !== undefined){
      if(this.oldDirection !== this.gridEngine.getFacingDirection(this.playerId) || this.oldPosition.x !== this.gridEngine.getPosition(this.playerId).x || this.oldPosition.y !== this.gridEngine.getPosition(this.playerId).y){
        this.socket.emit('playerMovement', {
          playerId: this.playerId,
          x: this.gridEngine.getPosition(this.playerId).x,
          y: this.gridEngine.getPosition(this.playerId).y,
          facingDirection: this.gridEngine.getFacingDirection(this.playerId),
        });
        this.oldDirection = this.gridEngine.getFacingDirection(this.playerId);
        this.oldPosition = this.gridEngine.getPosition(this.playerId); 
      }
    }
    
  }
  
  
}

export default GameScene;