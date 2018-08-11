"use strict";
var GAME_WIDTH = 640;
var GAME_HEIGHT = 360;
var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "", {
    preload: preload
});
function preload() {
    console.log("Preloaded...");
}
