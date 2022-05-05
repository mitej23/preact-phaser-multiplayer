import Phaser from "phaser";
import GridEngine from "grid-engine";

import GameScene from "./GameScene.js";

const setup = (props) => {
  
  const name = props.name;
  const npc = props.npc;

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
    parent: "game",
    backgroundColor: "#48C4F8",
  });

  game.charName = name;
  game.char = npc;
};

export default setup;