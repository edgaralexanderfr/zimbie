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
define("Terrain", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Terrain = (function () {
        function Terrain(game) {
            this._game = game;
        }
        Object.defineProperty(Terrain.prototype, "game", {
            get: function () {
                return this._game;
            },
            set: function (game) {
                this._game = game;
            },
            enumerable: true,
            configurable: true
        });
        Terrain.prototype.generate = function () {
            var gameData = this.game.cache.getJSON("data-game");
            var gridData = [];
            var i;
            var j;
            for (i = 0; i < gameData.terrain.height; i++) {
                gridData[i] = [];
                for (j = 0; j < gameData.terrain.width; j++) {
                    gridData[i][j] = "";
                }
            }
            var terrainSize = gameData.terrain.width * gameData.terrain.height;
            var population = gameData.terrain.population;
            for (var _i = 0, population_1 = population; _i < population_1.length; _i++) {
                var populatedItem = population_1[_i];
                var maxTiles = Math.floor(terrainSize * populatedItem.seed);
                var remainingTiles = maxTiles;
                do {
                    var x = this.game.rnd.integerInRange(0, gameData.terrain.width - 1);
                    var y = this.game.rnd.integerInRange(0, gameData.terrain.height - 1);
                    gridData[y][x] = populatedItem.name;
                    remainingTiles--;
                } while (remainingTiles > 0);
            }
            var maxDirtTiles = Math.floor(terrainSize * gameData.terrain.dirt.seed);
            var minDirtSize = gameData.terrain.dirt.minWidth * gameData.terrain.dirt.minHeight;
            var remainingDirtTiles = maxDirtTiles;
            do {
                var width = this.game.rnd.integerInRange(gameData.terrain.dirt.minWidth, gameData.terrain.dirt.maxWidth);
                var height = this.game.rnd.integerInRange(gameData.terrain.dirt.minHeight, gameData.terrain.dirt.maxHeight);
                var x = this.game.rnd.integerInRange(0, gameData.terrain.width - width);
                var y = this.game.rnd.integerInRange(0, gameData.terrain.height - height);
                for (i = y; i < y + height; i++) {
                    for (j = x; j < x + width; j++) {
                        if (gridData[i][j] != "dirt") {
                            gridData[i][j] = "dirt";
                            remainingDirtTiles--;
                        }
                    }
                }
            } while (remainingDirtTiles >= minDirtSize);
            var texWidth = gameData.terrain.tileSize * gameData.terrain.width;
            var texHeight = gameData.terrain.tileSize * gameData.terrain.height;
            var data = this.game.add.bitmapData(texWidth, texHeight);
            for (i = 0; i < gameData.terrain.height; i++) {
                for (j = 0; j < gameData.terrain.width; j++) {
                    var x = j * gameData.terrain.tileSize;
                    var y = i * gameData.terrain.tileSize;
                    switch (gridData[i][j]) {
                        case "dirt":
                            var neighbors = this.getNeighbors(gridData, j, i, "dirt");
                            if (neighbors[3] != "dirt" && neighbors[1] != "dirt") {
                                data.context.drawImage(this.game.cache.getImage(gameData.terrain.dirt.assets[1]), x, y);
                            }
                            else if (neighbors[5] != "dirt" && neighbors[1] != "dirt") {
                                data.context.drawImage(this.game.cache.getImage(gameData.terrain.dirt.assets[2]), x, y);
                            }
                            else if (neighbors[3] != "dirt" && neighbors[7] != "dirt") {
                                data.context.drawImage(this.game.cache.getImage(gameData.terrain.dirt.assets[3]), x, y);
                            }
                            else if (neighbors[5] != "dirt" && neighbors[7] != "dirt") {
                                data.context.drawImage(this.game.cache.getImage(gameData.terrain.dirt.assets[4]), x, y);
                            }
                            else {
                                data.context.drawImage(this.game.cache.getImage(gameData.terrain.dirt.assets[0]), x, y);
                            }
                            break;
                        case "grass1":
                            data.context.drawImage(this.game.cache.getImage(gameData.terrain.population[0].asset), x, y);
                            break;
                        case "rocks1":
                            data.context.drawImage(this.game.cache.getImage(gameData.terrain.population[1].asset), x, y);
                            break;
                        default:
                            data.context.drawImage(this.game.cache.getImage(gameData.terrain.asset), x, y);
                            break;
                    }
                }
            }
            this.game.world.setBounds(0, 0, texWidth, texHeight);
            this.game.cache.addBitmapData("terrain", data);
            this.game.add.sprite(0, 0, this.game.cache.getBitmapData("terrain"));
        };
        Terrain.prototype.getNeighbors = function (gridData, j, i, defaultValue) {
            if (defaultValue === void 0) { defaultValue = ""; }
            var neighbors = [
                defaultValue, defaultValue, defaultValue,
                defaultValue, defaultValue, defaultValue,
                defaultValue, defaultValue, defaultValue
            ];
            var index = 0;
            var x;
            var y;
            for (y = i - 1; y <= i + 1; y++) {
                for (x = j - 1; x <= j + 1; x++) {
                    if (typeof gridData[y] != "undefined" && typeof gridData[y][x] != "undefined") {
                        neighbors[index] = gridData[y][x];
                    }
                    index++;
                }
            }
            return neighbors;
        };
        return Terrain;
    }());
    exports.default = Terrain;
});
define("main", ["require", "exports", "AssetManager", "Terrain"], function (require, exports, AssetManager_1, Terrain_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    AssetManager_1 = __importDefault(AssetManager_1);
    Terrain_1 = __importDefault(Terrain_1);
    var GAME_WIDTH = 1350;
    var GAME_HEIGHT = 650;
    var CAMERA_SPEED = 8;
    var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "", {
        preload: preload,
        create: create,
        update: update
    });
    var upKey;
    var downKey;
    var leftKey;
    var rightKey;
    function preload() {
        document.body.style.backgroundColor = "black";
        AssetManager_1.default.loadMap(game);
    }
    function create() {
        game.load.onLoadComplete.add(init);
        AssetManager_1.default.load(game);
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    }
    function init() {
        var terrain = new Terrain_1.default(game);
        terrain.generate();
    }
    function update() {
        if (upKey.isDown) {
            game.camera.y -= CAMERA_SPEED;
        }
        if (downKey.isDown) {
            game.camera.y += CAMERA_SPEED;
        }
        if (leftKey.isDown) {
            game.camera.x -= CAMERA_SPEED;
        }
        if (rightKey.isDown) {
            game.camera.x += CAMERA_SPEED;
        }
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
