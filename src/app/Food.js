import FoodSprite from "./FoodSprite";
import { randomInt } from "./Helpers";
export default class Food {
    constructor(props) {
        this.props = props;
        this.sprites = [];
        //start interval for spawning food sprites
        this.spawnFood(true);
        //stop spawning food if user leaves the browser
        document.addEventListener("visibilitychange", (e) => {
            if (document.visibilityState === "visible") {
                this.spawnFood(true);
            }
            else {
                this.spawnFood(false);
            }
        });
    }
    //function to start/clear interval for spawning food
    spawnFood(state) {
        clearInterval(this.foodSpawn);
        if (state) {
            this.foodSpawn = setInterval(() => {
                this.createFoodSprite();
            }, 2000);
        }
    }
    //create a food sprite
    createFoodSprite() {
        let { tileset, scene, loseLife, app } = this.props;
        //spawn a new food sprite
        let sprite = new FoodSprite({
            tileset: tileset,
            scene: scene,
            loseLife: loseLife,
            app: app,
        });
        //set anchor to the center
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(2);
        //give a random position for food sprite and add to stage
        sprite.x = randomInt(50 + sprite.width / 2, scene.width - sprite.width / 2 - 50);
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
                this.sprites[i].visible = false;
                this.sprites[i].stopUpdating();
                //remove from food array
                this.sprites.slice(i, 1);
            }
        }
    }
}
