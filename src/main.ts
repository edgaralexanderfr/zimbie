/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts" />

import AssetManager from "./AssetManager";
import Terrain from "./Terrain";
import Character from "./Character";
import { Key } from "phaser-ce";

const GAME_WIDTH: number = 1350;
const GAME_HEIGHT: number = 650;
const CAMERA_SPEED: number = 4;

let game: Phaser.Game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "", {
  preload: preload,
  create: create,
  update: update
});

let upKey: Phaser.Key;
let downKey: Phaser.Key;
let leftKey: Phaser.Key;
let rightKey: Phaser.Key;
let zeroKey: Phaser.Key;
let oneKey: Phaser.Key;
let twoKey: Phaser.Key;
let threeKey: Phaser.Key;
let fourKey: Phaser.Key;
let fiveKey: Phaser.Key;

let character: Character;

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
  zeroKey = game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
  oneKey = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
  twoKey = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
  threeKey = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
  fourKey = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
  fiveKey = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
}

function init(): void {
  let terrain: Terrain = new Terrain(game);
  terrain.generate();

  character = new Character(game, 675, 325);
  character.setClothing("hair", 1);
  character.setClothing("jacket", 1);
  character.setClothing("shirt", 1);
  character.setClothing("pants", 1);
  character.setClothing("shoes", 1);
  game.camera.follow(character.body, Phaser.Camera.FOLLOW_LOCKON);
}

function update(): void {
  if (upKey.isDown) {
    character.body.y -= CAMERA_SPEED;
  }

  if (downKey.isDown) {
    character.body.y += CAMERA_SPEED;
  }

  if (leftKey.isDown) {
    character.body.x -= CAMERA_SPEED;
  }

  if (rightKey.isDown) {
    character.body.x += CAMERA_SPEED;
  }

  if (zeroKey.isDown) {
    let clothingName: any = prompt("Clothing name:");
    let clothingColor: any = prompt("Clothing colour:");
    character.setClothingColor(clothingName, +clothingColor);
  }

  if (oneKey.isDown) {
    character.nextClothing("hair");
  }

  if (twoKey.isDown) {
    character.nextClothing("jacket");
  }

  if (threeKey.isDown) {
    character.nextClothing("shirt");
  }

  if (fourKey.isDown) {
    character.nextClothing("pants");
  }

  if (fiveKey.isDown) {
    character.nextClothing("shoes");
  }

  // Update character animations:

  if (upKey.isDown && leftKey.isDown) {
    character.playAnimation("walkUpLeft");

    return;
  }

  if (upKey.isDown && rightKey.isDown) {
    character.playAnimation("walkUpRight");

    return;
  }

  if (downKey.isDown && leftKey.isDown) {
    character.playAnimation("walkDownLeft");

    return;
  }

  if (downKey.isDown && rightKey.isDown) {
    character.playAnimation("walkDownRight");

    return;
  }

  if (upKey.isDown) {
    character.playAnimation("walkUp");

    return;
  }

  if (downKey.isDown) {
    character.playAnimation("walkDown");

    return;
  }

  if (leftKey.isDown) {
    character.playAnimation("walkLeft");

    return;
  }

  if (rightKey.isDown) {
    character.playAnimation("walkRight");

    return;
  }
}
