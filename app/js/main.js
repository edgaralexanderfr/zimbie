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
                this.loadFile(assets, game, asset.type, asset.name, asset.uri, asset);
            }
            for (i = 0; i < multiple.length; i++) {
                var asset = multiple[i];
                var count = void 0;
                for (count = 1; count <= asset.total; count++) {
                    var name_1 = asset.name + count;
                    var uri = asset.uri + count + asset.extension;
                    this.loadFile(assets, game, asset.type, name_1, uri, asset);
                }
            }
            game.load.start();
        };
        AssetManager.loadFile = function (assets, game, type, name, uri, asset) {
            switch (type) {
                case "image":
                    game.load.image(name, uri);
                    break;
                case "json":
                    game.load.json(name, uri);
                    break;
                case "spritesheet":
                    var spriteWidth = assets.spritesheets.spriteWidth;
                    var spriteHeight = assets.spritesheets.spriteHeight;
                    var spriteMax = undefined;
                    if (asset["spriteWidth"]) {
                        spriteWidth = asset["spriteWidth"];
                    }
                    if (asset["spriteHeight"]) {
                        spriteWidth = asset["spriteHeight"];
                    }
                    if (asset["spriteMax"]) {
                        spriteMax = asset["spriteMax"];
                    }
                    game.load.spritesheet(name, uri, spriteWidth, spriteHeight, spriteMax);
                    break;
            }
        };
        return AssetManager;
    }());
    exports.default = AssetManager;
});
define("Character", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Character = (function () {
        function Character(game, x, y) {
            if (x === void 0) { x = 0.0; }
            if (y === void 0) { y = 0.0; }
            this._sprites = {};
            this._lastAnimationPlayed = "";
            this._game = game;
            this._body = this._game.add.sprite(x, y, "sprite-character-body");
            this.create(x, y);
        }
        Object.defineProperty(Character.prototype, "game", {
            get: function () {
                return this._game;
            },
            set: function (game) {
                this._game = game;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Character.prototype, "body", {
            get: function () {
                return this._body;
            },
            enumerable: true,
            configurable: true
        });
        Character.prototype.setClothing = function (name, index) {
            var spriteArray = this._sprites[name];
            var selectedCharacterSprite = spriteArray.spriteArray[spriteArray.selectedSprite];
            var characterSpriteToSelect = spriteArray.spriteArray[index];
            spriteArray.selectedSprite = index;
            if (selectedCharacterSprite && selectedCharacterSprite.sprite) {
                selectedCharacterSprite.sprite.visible = false;
            }
            if (characterSpriteToSelect && characterSpriteToSelect.sprite) {
                characterSpriteToSelect.sprite.tint = characterSpriteToSelect.color;
                characterSpriteToSelect.sprite.visible = true;
            }
            var lastAnimationPlayed = this._lastAnimationPlayed;
            this._lastAnimationPlayed = "";
            this.playAnimation(lastAnimationPlayed);
        };
        Character.prototype.previousClothing = function (name) {
            var spriteArray = this._sprites[name];
            var nextIndex = spriteArray.selectedSprite - 1;
            if (nextIndex < 0) {
                nextIndex = spriteArray.spriteArray.length - 1;
            }
            this.setClothing(name, nextIndex);
        };
        Character.prototype.nextClothing = function (name) {
            var spriteArray = this._sprites[name];
            var nextIndex = spriteArray.selectedSprite + 1;
            if (nextIndex >= spriteArray.spriteArray.length) {
                nextIndex = 0;
            }
            this.setClothing(name, nextIndex);
        };
        Character.prototype.setClothingColor = function (name, color) {
            if (color === void 0) { color = 0xffffff; }
            var spriteArray = this._sprites[name];
            var selectedCharacterSprite = spriteArray.spriteArray[spriteArray.selectedSprite];
            if (selectedCharacterSprite) {
                selectedCharacterSprite.color = color;
                if (selectedCharacterSprite.sprite) {
                    selectedCharacterSprite.sprite.tint = color;
                }
            }
        };
        Character.prototype.playAnimation = function (animationName) {
            if (animationName == this._lastAnimationPlayed) {
                return;
            }
            this._lastAnimationPlayed = animationName;
            for (var name_2 in this._sprites) {
                var spriteArray = this._sprites[name_2];
                var characterSprite = spriteArray.spriteArray[spriteArray.selectedSprite];
                if (characterSprite && characterSprite.sprite) {
                    characterSprite.sprite.animations.stop();
                    characterSprite.sprite.animations.play(animationName);
                }
            }
        };
        Character.prototype.create = function (x, y) {
            if (x === void 0) { x = 0.0; }
            if (y === void 0) { y = 0.0; }
            var gameData = this.game.cache.getJSON("data-game");
            this._body.anchor.set(0.5, 0.5);
            this.addAnimation(gameData, this._body);
            var characterSprite = {
                sprite: this._body,
                color: 0xffffff
            };
            var characterSpriteArray = {
                spriteArray: [characterSprite],
                selectedSprite: 0
            };
            this._sprites["body"] = characterSpriteArray;
            for (var _i = 0, _a = gameData.character.clothing; _i < _a.length; _i++) {
                var clothing = _a[_i];
                if (clothing["single"]) {
                    var sprite = this._game.make.sprite(0, 0, "sprite-character-" + clothing.name);
                    sprite.anchor.set(0.5, 0.5);
                    this.addAnimation(gameData, sprite);
                    this._body.addChild(sprite);
                    var characterSprite_1 = {
                        sprite: sprite,
                        color: 0xffffff
                    };
                    var characterSpriteArray_1 = {
                        spriteArray: [characterSprite_1],
                        selectedSprite: 0
                    };
                    this._sprites[clothing.name] = characterSpriteArray_1;
                }
                else {
                    var spriteArray = [null];
                    for (var c = 1; c <= clothing.total; c++) {
                        var sprite = this._game.make.sprite(0, 0, "sprite-character-" + clothing.name + c);
                        sprite.anchor.set(0.5, 0.5);
                        sprite.visible = false;
                        this.addAnimation(gameData, sprite);
                        this._body.addChild(sprite);
                        var characterSprite_2 = {
                            sprite: sprite,
                            color: 0xffffff
                        };
                        spriteArray.push(characterSprite_2);
                    }
                    var characterSpriteArray_2 = {
                        spriteArray: spriteArray,
                        selectedSprite: 0
                    };
                    this._sprites[clothing.name] = characterSpriteArray_2;
                }
            }
        };
        Character.prototype.addAnimation = function (gameData, sprite) {
            var spriteIndex = 0;
            for (var _i = 0, _a = gameData.character.sprites.animations; _i < _a.length; _i++) {
                var animation = _a[_i];
                for (var _b = 0, _c = gameData.character.sprites.directions; _b < _c.length; _b++) {
                    var direction = _c[_b];
                    var frames_1 = [];
                    for (var frameIndex = 0; frameIndex < gameData.character.sprites.totalFrames; frameIndex++) {
                        frames_1.push(spriteIndex);
                        spriteIndex++;
                    }
                    sprite.animations.add(animation.name + direction, frames_1, animation.frameRate, animation.loop);
                }
            }
        };
        return Character;
    }());
    exports.default = Character;
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
                        case "grass2":
                            data.context.drawImage(this.game.cache.getImage(gameData.terrain.population[2].asset), x, y);
                            break;
                        case "sticks1":
                            data.context.drawImage(this.game.cache.getImage(gameData.terrain.population[3].asset), x, y);
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
define("main", ["require", "exports", "AssetManager", "Terrain", "Character"], function (require, exports, AssetManager_1, Terrain_1, Character_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    AssetManager_1 = __importDefault(AssetManager_1);
    Terrain_1 = __importDefault(Terrain_1);
    Character_1 = __importDefault(Character_1);
    var GAME_WIDTH = 1350;
    var GAME_HEIGHT = 650;
    var CAMERA_SPEED = 4;
    var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "", {
        preload: preload,
        create: create,
        update: update
    });
    var upKey;
    var downKey;
    var leftKey;
    var rightKey;
    var zeroKey;
    var oneKey;
    var twoKey;
    var threeKey;
    var fourKey;
    var fiveKey;
    var character;
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
        zeroKey = game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
        oneKey = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        twoKey = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        threeKey = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        fourKey = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        fiveKey = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
    }
    function init() {
        var terrain = new Terrain_1.default(game);
        terrain.generate();
        character = new Character_1.default(game, 675, 325);
        character.setClothing("hair", 1);
        character.setClothing("jacket", 1);
        character.setClothing("shirt", 1);
        character.setClothing("pants", 1);
        character.setClothing("shoes", 1);
        game.camera.follow(character.body, Phaser.Camera.FOLLOW_LOCKON);
    }
    function update() {
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
            var clothingName = prompt("Clothing name:");
            var clothingColor = prompt("Clothing colour:");
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
