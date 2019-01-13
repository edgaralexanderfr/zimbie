/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts" />

import AssetManager from "./AssetManager";
import Terrain from "./Terrain";
import Character from "./Character";
import { Key } from "phaser-ce";

const CAMERA_SPEED: number = 4;

let game: Phaser.Game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, "", {
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

let shadowsGroup: Phaser.Group;
let charactersGroup: Phaser.Group;
let character: Character;

function preload(): void {
  AssetManager.loadMap(game);
}

function create(): void {
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

  game.load.onLoadComplete.add(init);
  AssetManager.load(game);
}

function init(): void {
  let terrain: Terrain = new Terrain(game);
  terrain.generate();

  shadowsGroup = game.add.group();
  charactersGroup = game.add.group();

  character = new Character(game, shadowsGroup, charactersGroup, 2048, 2048);
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
  } else
  if (upKey.isDown && rightKey.isDown) {
    character.playAnimation("walkUpRight");
  } else
  if (downKey.isDown && leftKey.isDown) {
    character.playAnimation("walkDownLeft");
  } else
  if (downKey.isDown && rightKey.isDown) {
    character.playAnimation("walkDownRight");
  } else
  if (upKey.isDown) {
    character.playAnimation("walkUp");
  } else
  if (downKey.isDown) {
    character.playAnimation("walkDown");
  } else
  if (leftKey.isDown) {
    character.playAnimation("walkLeft");
  } else
  if (rightKey.isDown) {
    character.playAnimation("walkRight");
  }

  if (character) {
    character.update();
  }

  if (shadowsGroup) {
    shadowsGroup.sort('y', Phaser.Group.SORT_ASCENDING);
  }

  if (charactersGroup) {
    charactersGroup.sort('y', Phaser.Group.SORT_ASCENDING);
  }
}

function resizeGame(e: Event): void {
  game.scale.setGameSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
}

window.addEventListener("resize", resizeGame, false);
