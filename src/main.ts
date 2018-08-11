/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts" />

const GAME_WIDTH: number = 640;
const GAME_HEIGHT: number = 360;

let game: Phaser.Game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "", {
  preload: preload
});

function preload(): void {
  console.log("Preloaded...");
}
