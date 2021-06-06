import * as PIXI from "pixi.js";
import knightTilesetImage from "./assets/knightTileset.png";
import foodTilesetImage from "./assets/foodTileset.png";
import musicFile from "./assets/music.mp3";
import Food from "./app/Food";
import Hero from "./app/Hero";
import FixedContainer from "./app/FixedContainer";
// import { sound } from "@pixi/sound";

let { Application, loader, Container, TextStyle, Text, Graphics, Texture } =
  PIXI;
let { TextureCache } = PIXI.utils;

//Create a Pixi Application
let app = new Application({
  width: 1000,
  height: 800,
  antialias: true,
});

app.renderer.backgroundColor = 0xaaaaaa;

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

loader.add([foodTilesetImage, knightTilesetImage, musicFile]).load(setup);

let food: Food;
let hero: Hero;
let lives = 10;
let audio: HTMLAudioElement;
let gameOverScene: PIXI.Container;
let gameScene: PIXI.Container;
let startingScene: PIXI.Container;
let foodTilesetTexture: PIXI.Texture;
let knightTilesetTexture: PIXI.Texture;
let livesText: PIXI.Text;

//setup function after loading the assets
function setup(): void {
  //tilesets
  foodTilesetTexture = TextureCache[foodTilesetImage];
  knightTilesetTexture = TextureCache[knightTilesetImage];

  //new audio object
  audio = new Audio(loader.resources[musicFile].name);

  //create starting scene and add interactivity to it
  startingScene = createStartingScene();
  startingScene.interactive = true;

  app.stage.addChild(startingScene);

  //start a new game on click
  startingScene.on("click", () => {
    //hide starting scene
    startingScene.interactive = false;
    startingScene.visible = false;

    //loop the audio
    audio.play();
    audio.loop = true;

    //create the new game scene
    gameScene = createGameScene();
    app.stage.addChild(gameScene);

    //add game loop
    app.ticker.add((delta) => gameLoop(delta));
  });

  //create game over screen and hide it
  gameOverScene = createGameOverScene();
  gameOverScene.visible = false;

  app.stage.addChild(gameOverScene);
}

//standard ticker function
function gameLoop(delta: number): void {
  if (gameScene.visible === true) {
    food.update();
    hero.update();
  }
}

//this function will be called after the food sprite leaves the canvas
function loseLife(): void {
  //lose life
  lives--;
  livesText.text = `Lives left: ${lives}`;

  //logic for switching the scenes after lose
  if (lives <= 0) {
    //stop spawning food
    food.spawnFood(false);

    //hide the game scene
    gameScene.visible = false;

    //show game over scene
    gameOverScene.visible = true;
    gameOverScene.interactive = true;

    //start a new game on click
    gameOverScene.on("click", () => {
      //logic for resetting the game
      gameOverScene.visible = false;
      gameOverScene.interactive = false;
      food.spawnFood(false);
      gameScene.destroy();
      gameScene = createGameScene();
      app.stage.addChild(gameScene);
      lives = 10;
      livesText.text = `Lives left: ${lives}`;
    });
  }
}

//add mouse interactivity for hero
function addInteractivity(): void {
  app.stage.interactive = true;
  app.stage.hitArea = app.renderer.screen;

  app.stage.on("click", (e) => {
    let pos = e.data.global;
    if (pos.x < app.view.width && pos.y < app.view.height) {
      //hero goes to left
      if (pos.x > hero.x) {
        hero.resetForce("vX");
        hero.addForce("vX", 4);
        hero.resetAnimation("right");
      }
      //hero goes to right
      if (pos.x < hero.x) {
        hero.resetForce("vX");
        hero.addForce("vX", -4);
        hero.resetAnimation("left");
      }
    }
  });
}

//graphic stuff for scenes here (texts, backgrounds, etc.):

//create starting screen
function createStartingScene(): PIXI.Container {
  let startingScene = new FixedContainer(
    app.renderer.width,
    app.renderer.height,
    0x05b384
  );

  startingScene.width = app.renderer.width;
  startingScene.height = app.renderer.height;

  let style = new TextStyle({
    fontFamily: "Futura",
    fontSize: 64,
    fill: "white",
    dropShadow: true,
    dropShadowColor: 0x03634a,
  });
  let message = new Text("Click to start!", style);
  message.anchor.set(0.5, 0.5);
  message.x = app.renderer.width / 2;
  message.y = app.renderer.height / 2;

  startingScene.addChild(message);

  return startingScene;
}

//create a new game scene
function createGameScene(): PIXI.Container {
  let gameScene = new FixedContainer(
    app.renderer.width,
    app.renderer.height,
    0xef476f
  );

  let style = new TextStyle({
    fontFamily: "Futura",
    fontSize: 64,
    fill: "white",
    dropShadow: true,
    dropShadowColor: 0x555555,
  });

  livesText = new Text(`Lives left: ${lives}`, style);
  livesText.anchor.set(0.5, 0.5);
  livesText.x = app.renderer.width / 2;
  livesText.y = app.renderer.height / 2;

  gameScene.addChild(livesText);

  hero = new Hero({
    scene: gameScene,
    tileset: knightTilesetTexture,
    app: app,
  });

  food = new Food({
    scene: gameScene,
    tileset: foodTilesetTexture,
    loseLife: loseLife,
    hero: hero,
    app: app,
  });

  gameScene.addChild(hero);

  addInteractivity();

  return gameScene;
}

//create a game over scene
function createGameOverScene(): PIXI.Container {
  let gameOverScene = new FixedContainer(
    app.renderer.width,
    app.renderer.height,
    0x1d3f5e
  );

  gameOverScene.width = app.renderer.width;
  gameOverScene.height = app.renderer.height;

  let style = new TextStyle({
    fontFamily: "Futura",
    fontSize: 64,
    fill: "white",
    dropShadow: true,
    dropShadowColor: 0x555555,
  });
  let message = new Text("Game Over!\nClick the canvas to start again", style);
  message.anchor.set(0.5, 0.5);
  message.x = app.renderer.width / 2;
  message.y = app.renderer.height / 2;

  gameOverScene.addChild(message);

  return gameOverScene;
}
