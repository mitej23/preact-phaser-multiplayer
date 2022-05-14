import Phaser from "phaser";
import GridEngine from "grid-engine";

import GameScene from "./GameScene.js";

const setup = (props,refresh) => {


  // room is already created - note

  // start new game 

  // continue game

  const player = props[0];

  console.log(player);
  
  const {id, name, player_id, room_id, sprite, x, y, facing_direction} = player;


  const game = new Phaser.Game({
    title: "GridEngineExample",
    render: {
      antialias: false,
    },
    type: Phaser.AUTO,
    plugins: {
      scene: [
        {
          key: "gridEngine",
          plugin: GridEngine,
          mapping: "gridEngine",
        },
      ],
    },
    scale: {
      width: 720,
      height: 528,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [GameScene],
    parent: "app",
    backgroundColor: "#48C4F8",
  });

  

  game.id = id;
  game.name = name;
  game.player_id = player_id;
  game.room_id = room_id;
  game.sprite = sprite;
  game.x = x;
  game.y = y;
  game.facing_direction = facing_direction;  
  game.refresh = refresh;
};

export default setup;