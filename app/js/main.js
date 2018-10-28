"use strict";
var GAME_WIDTH = 1350;
var GAME_HEIGHT = 650;
var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "", {
    preload: preload
});
function preload() {
    console.log("Preloaded...");
}
define("util/damage", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util;
    (function (util) {
        function damage(attack, defense) {
            return attack * (1.0 - defense);
        }
        util.damage = damage;
    })(util = exports.util || (exports.util = {}));
});
