/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts" />

import AssetManager from "./AssetManager";

const GAME_WIDTH: number = 1350;
const GAME_HEIGHT: number = 650;

let game: Phaser.Game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "", {
  preload: preload,
  create: create
});

function preload(): void {
  AssetManager.loadMap(game);
}

function create(): void {
  game.load.onLoadComplete.add(init);
  AssetManager.load(game);
}

function init(): void {
  console.log("All assets loaded correctly.");
}
