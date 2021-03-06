/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts" />

/**
 * It manages the loading of all the game assets and resources along
 * the preload and creation states of the game in the lifecycle.
 *
 * Its main function is to facilitate the load of mapped assets
 * listed within the *assets/assets.json* file.
 *
 * **Created:** *10 28th 2018, 00:40*<br />
 * **Updated:** *01 04th 2019, 23:09*
 *
 * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
 */
export default class AssetManager {
  /**
   * Loads the *assets/assets.json* file and must
   * be called during the *preload* state.
   *
   * **Created:** *10 28th 2018, 00:41*<br />
   * **Updated:** *10 28th 2018, 00:41*
   *
   * @param game Instance of the game where to load the file.
   *
   * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
   */
  public static loadMap(game: Phaser.Game): void {
    game.load.json("assets", "assets/assets.json");
  }

  /**
   * Loads and maps all the assets listen within the *assets/assets.json*
   * file and must be called during the *create* state.
   *
   * **Created:** *10 28th 2018, 00:56*<br />
   * **Updated:** *01 04th 2019, 23:36*
   *
   * @param game Instance of the game where to load the assets.
   *
   * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
   */
  public static load(game: Phaser.Game): void {
    let assets: any = game.cache.getJSON("assets");
    let single: Array<any> = assets.single;
    let multiple: Array<any> = assets.multiple;
    let i: number;

    for (i = 0; i < single.length; i++) {
      let asset: any = single[ i ];

      this.loadFile(assets, game, asset.type, asset.name, asset.uri, asset);
    }

    for (i = 0; i < multiple.length; i++) {
      let asset: any = multiple[ i ];
      let count: number;

      for (count = 1; count <= asset.total; count++) {
        let name: string = asset.name + count;
        let uri: string = asset.uri + count + asset.extension;

        this.loadFile(assets, game, asset.type, name, uri, asset);
      }
    }

    game.load.start();
  }

  /**
   * Loads a specific file depending on its type within the provided
   * game instance.
   *
   * **Created:** *10 28th 2018, 10:16*<br />
   * **Updated:** *01 04th 2019, 23:10*
   *
   * @param assets Object containing the info from *assets/assets.json* configuration file.
   * @param type   Type of the file to load (ex: `"image" | "json"`).
   * @param name   Name of the file to assign within the game context.
   * @param uri    URI of the file to load.
   * @param asset  Object containing the asset info.
   *
   * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
   */
  private static loadFile(assets: any, game: Phaser.Game, type: string, name: string, uri: string, asset: any)
  {
    // FIXME: We can avoid the use of **name** and **uri** params by just using the **asset** parameter...
    switch (type) {
      case "image":
        game.load.image(name, uri);
        break;
      case "json":
        game.load.json(name, uri);
        break;
      case "spritesheet":
        let spriteWidth: number = assets.spritesheets.spriteWidth;
        let spriteHeight: number = assets.spritesheets.spriteHeight;
        let spriteMax: number | undefined = undefined;

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
  }
}
