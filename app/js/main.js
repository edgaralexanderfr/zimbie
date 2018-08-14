"use strict";
var GAME_WIDTH = 640;
var GAME_HEIGHT = 360;
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
            return 0.0;
        }
        util.damage = damage;
    })(util = exports.util || (exports.util = {}));
});
