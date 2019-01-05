/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts" />

/**
 * Structure that contains an sprite and its colour for character's parts and clothing.
 *
 * **Created:** *01 05th 2019, 11:48*<br />
 * **Updated:** *01 05th 2019, 11:48*
 *
 * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
 */
interface CharacterSpriteI {
  sprite: Phaser.Sprite | null;
  color: number;
}

/**
 * Structure that manages multiple character's parts and selected elements.
 *
 * **Created:** *01 05th 2019, 11:48*<br />
 * **Updated:** *01 05th 2019, 11:48*
 *
 * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
 */
interface CharacterSpriteArrayI {
  spriteArray: Array<CharacterSpriteI | null>;
  selectedSprite: number;
}

/**
 * Keeps a character's information as its clothes, its clothes colours, customisation, etc.
 *
 * **Created:** *01 04th 2019, 22:20*<br />
 * **Updated:** *01 04th 2019, 22:20*
 *
 * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
 */
export default class Character {
  private _game: Phaser.Game;
  private _body: Phaser.Sprite;
  private _sprites: any = {};
  private _lastAnimationPlayed: string = "";

  get game(): Phaser.Game {
    return this._game;
  }

  set game(game: Phaser.Game) {
    this._game = game;
  }

  get body(): Phaser.Sprite {
    return this._body;
  }

  /**
   * Constructs a new character instance and calls the **this#create(number, number)** method.
   *
   * **Created:** *01 05th 2019, 00:10*<br />
   * **Updated:** *01 05th 2019, 00:10*
   *
   * @param game Reference to the **Phaser.Game**
   * @param x    Character's X start coordinate.
   * @param y    Character's Y start coordinate
   *
   * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
   */
  constructor(game: Phaser.Game, x: number = 0.0, y: number = 0.0) {
    this._game = game;
    this._body = this._game.add.sprite(x, y, "sprite-character-body");

    this.create(x, y);
  }

  /**
   * Sets the index for the specified desired clothing.
   *
   * **Created:** *01 05th 2019, 12:52*<br />
   * **Updated:** *01 05th 2019, 12:52*
   *
   * @param name  Name of the clothing to change.
   * @param index Index of the clothing to set.
   *
   * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
   */
  public setClothing(name: string, index: number): void {
    let spriteArray: CharacterSpriteArrayI = this._sprites[name];
    let selectedCharacterSprite: CharacterSpriteI | null = spriteArray.spriteArray[spriteArray.selectedSprite];
    let characterSpriteToSelect: CharacterSpriteI | null = spriteArray.spriteArray[index];
    spriteArray.selectedSprite = index;

    if (selectedCharacterSprite && selectedCharacterSprite.sprite) {
      selectedCharacterSprite.sprite.visible = false;
    }

    if (characterSpriteToSelect && characterSpriteToSelect.sprite) {
      characterSpriteToSelect.sprite.tint = characterSpriteToSelect.color;
      characterSpriteToSelect.sprite.visible = true;
    }

    let lastAnimationPlayed: string = this._lastAnimationPlayed;
    this._lastAnimationPlayed = "";
    this.playAnimation(lastAnimationPlayed);
  }

  /**
   * Selects the previous index for the specified desired clothing.
   *
   * **Created:** *01 05th 2019, 12:56*<br />
   * **Updated:** *01 05th 2019, 12:56*
   *
   * @param name Name of the clothing to change.
   *
   * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
   */
  public previousClothing(name: string): void {
    let spriteArray: CharacterSpriteArrayI = this._sprites[name];
    let nextIndex: number = spriteArray.selectedSprite - 1;

    if (nextIndex < 0) {
      nextIndex = spriteArray.spriteArray.length - 1;
    }

    this.setClothing(name, nextIndex);
  }

  /**
   * Selects the next index for the specified desired clothing.
   *
   * **Created:** *01 05th 2019, 12:56*<br />
   * **Updated:** *01 05th 2019, 12:56*
   *
   * @param name Name of the clothing to change.
   *
   * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
   */
  public nextClothing(name: string): void {
    let spriteArray: CharacterSpriteArrayI = this._sprites[name];
    let nextIndex: number = spriteArray.selectedSprite + 1;

    if (nextIndex >= spriteArray.spriteArray.length) {
      nextIndex = 0;
    }

    this.setClothing(name, nextIndex);
  }

  /**
   * Updates the colour/tint of the desired given clothing.
   *
   * **Created:** *01 05th 2019, 13:23*<br />
   * **Updated:** *01 05th 2019, 13:23*
   *
   * @param name  Name of the clothing to colorise.
   * @param color Color to use for the desired clothing item.
   *
   * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
   */
  public setClothingColor(name: string, color: number = 0xffffff): void {
    let spriteArray: CharacterSpriteArrayI = this._sprites[name];
    let selectedCharacterSprite: CharacterSpriteI | null = spriteArray.spriteArray[spriteArray.selectedSprite];

    if (selectedCharacterSprite) {
      selectedCharacterSprite.color = color;

      if (selectedCharacterSprite.sprite) {
        selectedCharacterSprite.sprite.tint = color;
      }
    }
  }

  /**
   * Plays the specified animation for each character's sprite.
   *
   * **Created:** *01 05th 2019, 12:05*<br />
   * **Updated:** *01 05th 2019, 12:05*
   *
   * @param animationName Name of the animation to play.
   *
   * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
   */
  public playAnimation(animationName: string): void {
    if (animationName == this._lastAnimationPlayed) {
      return;
    }

    this._lastAnimationPlayed = animationName;

    for (let name in this._sprites) {
      let spriteArray: CharacterSpriteArrayI = this._sprites[name];
      let characterSprite: CharacterSpriteI | null = spriteArray.spriteArray[spriteArray.selectedSprite];

      if (characterSprite && characterSprite.sprite) {
        characterSprite.sprite.animations.stop();
        characterSprite.sprite.animations.play(animationName);
      }
    }
  }

  /**
   * Creates all the sprites related to the character according to clothing, animation and stuff.
   *
   * **Created:** *01 05th 2019, 00:13*<br />
   * **Updated:** *01 05th 2019, 00:13*
   *
   * @param x Character's X start coordinate.
   * @param y Character's Y start coordinate
   *
   * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
   */
  private create(x: number = 0.0, y: number = 0.0): void {
    let gameData: any = this.game.cache.getJSON("data-game");

    // Create body animations:

    this._body.anchor.set(0.5, 0.5);
    this.addAnimation(gameData, this._body);

    let characterSprite: CharacterSpriteI = {
      sprite: this._body,
      color: 0xffffff
    };

    let characterSpriteArray: CharacterSpriteArrayI = {
      spriteArray: [characterSprite],
      selectedSprite: 0
    };

    this._sprites["body"] = characterSpriteArray;

    // Create every configured clothing/stuff and parent it into the body:
    for (let clothing of gameData.character.clothing) {
      if (clothing["single"]) {
        let sprite: Phaser.Sprite = this._game.make.sprite(0, 0, "sprite-character-" + clothing.name);
        sprite.anchor.set(0.5, 0.5);
        this.addAnimation(gameData, sprite);
        this._body.addChild(sprite);

        let characterSprite: CharacterSpriteI = {
          sprite: sprite,
          color: 0xffffff
        };

        let characterSpriteArray: CharacterSpriteArrayI = {
          spriteArray: [characterSprite],
          selectedSprite: 0
        };

        this._sprites[clothing.name] = characterSpriteArray;
      } else {
        let spriteArray: Array<CharacterSpriteI | null> = [null];

        for (let c = 1; c <= clothing.total; c++) {
          let sprite: Phaser.Sprite = this._game.make.sprite(0, 0, "sprite-character-" + clothing.name + c);
          sprite.anchor.set(0.5, 0.5);
          sprite.visible = false;
          this.addAnimation(gameData, sprite);
          this._body.addChild(sprite);

          let characterSprite: CharacterSpriteI = {
            sprite: sprite,
            color: 0xffffff
          };

          spriteArray.push(characterSprite);
        }

        let characterSpriteArray: CharacterSpriteArrayI = {
          spriteArray: spriteArray,
          selectedSprite: 0
        };

        this._sprites[clothing.name] = characterSpriteArray;
      }
    }
  }

  /**
   * Creates the animations for the provided sprite using the info configurated in *game.json* file.
   *
   * **Created:** *01 05th 2019, 01:56*<br />
   * **Updated:** *01 05th 2019, 01:56*
   *
   * @param gameData Game config taken from the *game.json* file
   * @param sprite   **Phaser.Sprite** object.
   *
   * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
   */
  private addAnimation(gameData: any, sprite: Phaser.Sprite): void {
    let spriteIndex: number = 0;

    for (let animation of gameData.character.sprites.animations) {
      for (let direction of gameData.character.sprites.directions) {
        let frames: Array<number> = [];

        for (let frameIndex: number = 0; frameIndex < gameData.character.sprites.totalFrames; frameIndex++) {
          frames.push(spriteIndex);
          spriteIndex++;
        }

        sprite.animations.add(animation.name + direction, frames, animation.frameRate, animation.loop);
      }
    }
  }
}
