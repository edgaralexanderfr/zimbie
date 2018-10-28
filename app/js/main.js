var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("AssetManager", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AssetManager = (function () {
        function AssetManager() {
        }
        AssetManager.loadMap = function (game) {
            game.load.json("assets", "assets/assets.json");
        };
        AssetManager.load = function (game) {
            var assets = game.cache.getJSON("assets");
            var single = assets.single;
            var multiple = assets.multiple;
            var i;
            for (i = 0; i < single.length; i++) {
                var asset = single[i];
                this.loadFile(game, asset.type, asset.name, asset.uri);
            }
            for (i = 0; i < multiple.length; i++) {
                var asset = multiple[i];
                var count = void 0;
                for (count = 1; count <= asset.total; count++) {
                    var name_1 = asset.name + count;
                    var uri = asset.uri + count + asset.extension;
                    this.loadFile(game, asset.type, name_1, uri);
                }
            }
            game.load.start();
        };
        AssetManager.loadFile = function (game, type, name, uri) {
            switch (type) {
                case "image":
                    game.load.image(name, uri);
                    break;
                case "json":
                    game.load.json(name, uri);
                    break;
            }
        };
        return AssetManager;
    }());
    exports.default = AssetManager;
});
define("main", ["require", "exports", "AssetManager"], function (require, exports, AssetManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    AssetManager_1 = __importDefault(AssetManager_1);
    var GAME_WIDTH = 1350;
    var GAME_HEIGHT = 650;
    var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "", {
        preload: preload,
        create: create
    });
    function preload() {
        AssetManager_1.default.loadMap(game);
    }
    function create() {
        game.load.onLoadComplete.add(init);
        AssetManager_1.default.load(game);
    }
    function init() {
        console.log("All assets loaded correctly.");
    }
});
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
