import FoodSprite from "./FoodSprite";
import { randomInt } from "./Helpers";
import { Application, Container, Texture } from "pixi.js";
import Hero from "./Hero";

interface Props {
  scene: Container;
  tileset: Texture;
  loseLife: Function;
  addPoint: Function;
  hero: Hero;
  app: Application;
}

export default class Food {
  sprites: [FoodSprite?];
  props: Props;
  foodSpawn: number;

  constructor(props) {
    this.props = props;
    this.sprites = [];

    //start interval for spawning food sprites
    this.spawnFood(true);

    //stop spawning food if user leaves the browser
    document.addEventListener("visibilitychange", (e) => {
      if (document.visibilityState === "visible") {
        this.spawnFood(true);
      } else {
        this.spawnFood(false);
      }
    });
  }

  //function to start/clear interval for spawning food
  spawnFood(state: boolean): void {
    clearInterval(this.foodSpawn);
    if (state) {
      this.foodSpawn = setInterval(() => {
        this.createFoodSprite();
      }, 2000);
    }
  }

  //create a food sprite
  createFoodSprite() {
    let { tileset, scene, loseLife, addPoint, app } = this.props;

    //spawn a new food sprite
    let sprite: FoodSprite = new FoodSprite({
      tileset: tileset,
      scene: scene,
      loseLife: loseLife,
      app: app,
    });

    //set anchor to the center
    sprite.anchor.set(0.5, 0.5);

    sprite.scale.set(2);

    //give a random position for food sprite and add to stage
    sprite.x = randomInt(
      50 + sprite.width / 2,
      scene.width - sprite.width / 2 - 50
    );
    scene.addChild(sprite);

    //add sprite to array
    this.sprites.push(sprite);
  }

  //update the food
  update() {
    for (let i = this.sprites.length - 1; i >= 0; i--) {
      //update the sprite
      this.sprites[i].update();

      //check if sprite collides with hero,
      if (this.sprites[i].collides(this.props.hero)) {
        //delete the sprite from sprites array, make it invisible and stop updating
        if (this.sprites[i].visible) {
          this.props.addPoint();
        }
        this.sprites[i].visible = false;
        this.sprites[i].stopUpdating();

        this.sprites.slice(i, 1);
      }
    }
  }
}
