/**
 * Helps to generate and keep all the map information.
 *
 * **Created:** *10 28th 2018, 11:54*<br />
 * **Updated:** *10 28th 2018, 11:54*
 *
 * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
 */
export default class Terrain {
  private _game: Phaser.Game;

  get game(): Phaser.Game {
    return this._game;
  }

  set game(game: Phaser.Game) {
    this._game = game;
  }

  constructor(game: Phaser.Game) {
    this._game = game;
  }

  /**
   * Generates a random terrain texture based on the
   * constraints listed under "terrain" section within
   * *assets/data/game.json* configuration file.
   *
   * **Created:** *10 28th 2018, 11:56*<br />
   * **Updated:** *01 10th 2019, 15:41*
   *
   * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
   */
  public generate(): void {
    let gameData: any = this.game.cache.getJSON("data-game");
    let gridData: string[][] = [];
    let i: number;
    let j: number;

    // Initialise data grid array with empty strings:
    for (i = 0; i < gameData.terrain.height; i++) {
      gridData[i] = [];

      for (j = 0; j < gameData.terrain.width; j++) {
        gridData[i][j] = "";
      }
    }

    // We populate terrain items
    let terrainSize: number = gameData.terrain.width * gameData.terrain.height;
    let population: any = gameData.terrain.population;

    for (let populatedItem of population) {
      let maxTiles: number = Math.floor(terrainSize * populatedItem.seed);
      let remainingTiles = maxTiles;

      do {
        let x: number = this.game.rnd.integerInRange(0, gameData.terrain.width - 1);
        let y: number = this.game.rnd.integerInRange(0, gameData.terrain.height - 1);

        gridData[y][x] = populatedItem.name;

        remainingTiles--;
      } while (remainingTiles > 0);
    }

    // We assign the grid blocks for dirt:
    // FIXME: When dirt.seed is 1.0 the game freezes and crashes and when it's 0.0
    //        it still creates dirt...
    let maxDirtTiles: number = Math.floor(terrainSize * gameData.terrain.dirt.seed);
    let minDirtSize: number = gameData.terrain.dirt.minWidth * gameData.terrain.dirt.minHeight;
    let remainingDirtTiles = maxDirtTiles;

    do {
      let width: number = this.game.rnd.integerInRange(gameData.terrain.dirt.minWidth, gameData.terrain.dirt.maxWidth);
      let height: number = this.game.rnd.integerInRange(gameData.terrain.dirt.minHeight, gameData.terrain.dirt.maxHeight);
      let x: number = this.game.rnd.integerInRange(0, gameData.terrain.width - width);
      let y: number = this.game.rnd.integerInRange(0, gameData.terrain.height - height);

      for (i = y; i < y + height; i++) {
        for (j = x; j < x + width; j++) {
          if (gridData[i][j] != "dirt") {
            gridData[i][j] = "dirt";
            remainingDirtTiles--;
          }
        }
      }

      // FIXME: We gotta check how we prevent extra dirt
      //        from being created when it's above the
      //        minDirtSize
    } while (remainingDirtTiles >= minDirtSize);

    // We generate the terrain texture and build the bitmap:
    let texWidth: number = gameData.terrain.tileSize * gameData.terrain.width;
    let texHeight: number = gameData.terrain.tileSize * gameData.terrain.height;
    let data: Phaser.BitmapData = this.game.add.bitmapData(texWidth, texHeight);

    for (i = 0; i < gameData.terrain.height; i++) {
      for (j = 0; j < gameData.terrain.width; j++) {
        let x: number = j * gameData.terrain.tileSize;
        let y: number = i * gameData.terrain.tileSize;

        switch (gridData[i][j]) {
          case "dirt":
            let neighbors: Array<string> = this.getNeighbors(gridData, j, i, "dirt");

            // We check if it's a rounded dirty corner or a regular dirty
            // zone:
            if (neighbors[3] != "dirt" && neighbors[1] != "dirt") {
              data.context.drawImage(this.game.cache.getImage(gameData.terrain.dirt.assets[1]), x, y);
            } else
            if (neighbors[5] != "dirt" && neighbors[1] != "dirt") {
              data.context.drawImage(this.game.cache.getImage(gameData.terrain.dirt.assets[2]), x, y);
            } else
            if (neighbors[3] != "dirt" && neighbors[7] != "dirt") {
              data.context.drawImage(this.game.cache.getImage(gameData.terrain.dirt.assets[3]), x, y);
            } else
            if (neighbors[5] != "dirt" && neighbors[7] != "dirt") {
              data.context.drawImage(this.game.cache.getImage(gameData.terrain.dirt.assets[4]), x, y);
            } else {
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

    // We assign the buffered result into the game context and create the
    // final "background" object that will hold the terrain texture:
    this.game.world.setBounds(0, 0, texWidth, texHeight);
    this.game.cache.addBitmapData("terrain", data);
    this.game.add.tileSprite(0, 0, texWidth, texHeight, this.game.cache.getBitmapData("terrain"));
  }

  /**
   * Returns an array with length of 9 filled with terrain data
   * presets and that surrounds the specified tile coordinate.
   *
   * This is helpful for avoid checking unexisting indexes within
   * gridData, it simplifies generation code and also provides
   * a controlled way to fill the default tile values.
   *
   * **Created:** *10 28th 2018, 15:24*<br />
   * **Updated:** *10 28th 2018, 15:24*
   *
   * @param gridData     Grid data where to check and copy the occupied tiles.
   * @param i            X tile coordinate to inspect.
   * @param j            Y tile coordinate to inspect.
   * @param defaultValue A provided value to initialise each position of the array.
   *
   * @returns A string array with length of 9 specifying which tile
   *          ends up using each neighbor from current coordinate.
   *          Index 4 is where the origin to inspect is being located.
   *
   * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
   */
  private getNeighbors(gridData: string[][], j: number, i: number, defaultValue: string = ""): Array<string> {
    let neighbors: Array<string> = [
      defaultValue, defaultValue, defaultValue,
      defaultValue, defaultValue, defaultValue,
      defaultValue, defaultValue, defaultValue
    ];

    let index: number = 0;
    let x: number;
    let y: number;

    for (y = i - 1; y <= i + 1; y++) {
      for (x = j - 1; x <= j + 1; x++) {
        if (typeof gridData[y] != "undefined" && typeof gridData[y][x] != "undefined") {
          neighbors[index] = gridData[y][x];
        }

        index++;
      }
    }

    return neighbors;
  }
}
