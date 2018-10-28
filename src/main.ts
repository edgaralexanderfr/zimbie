/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts" />

import AssetManager from "./AssetManager";
import Terrain from "./Terrain";

const GAME_WIDTH: number = 1350;
const GAME_HEIGHT: number = 650;

let game: Phaser.Game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "", {
  preload: preload,
  create: create,
  update: update
});

let upKey: Phaser.Key;
let downKey: Phaser.Key;
let leftKey: Phaser.Key;
let rightKey: Phaser.Key;

function preload(): void {
  document.body.style.backgroundColor = "black";

  AssetManager.loadMap(game);
}

function create(): void {
  game.load.onLoadComplete.add(init);
  AssetManager.load(game);

  upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
}

function init(): void {
  let terrain: Terrain = new Terrain(game);
  terrain.generate();
}

function update(): void {
  if (upKey.isDown) {
    game.camera.y -= 64;
  }

  if (downKey.isDown) {
    game.camera.y += 64;
  }

  if (leftKey.isDown) {
    game.camera.x -= 64;
  }

  if (rightKey.isDown) {
    game.camera.x += 64;
  }
}
