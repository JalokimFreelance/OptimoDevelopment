import { Rectangle, Texture } from "pixi.js";
import { randomInt } from "./Helpers";
import PhysicsSprite from "./PhysicsSprite";
export default class FoodSprite extends PhysicsSprite {
    constructor(props) {
        super(props.tileset);
        this.props = props;
        //copy tileset to create a new texture
        this.texture = new Texture(props.tileset.baseTexture);
        this.shouldUpdate = true;
        this.resetForce("vY");
        this.addForce("vY", 1);
        //get a random small texture from tileset
        let rect = new Rectangle(randomInt(0, this.texture.width / 16 - 1) * 16, randomInt(0, this.texture.width / 16 - 1) * 16, 16, 16);
        this.texture.frame = rect;
    }
    //function for updating the sprite
    update() {
        let { app } = this.props;
        //leave the function if sprite shouldn't update anymore
        if (!this.shouldUpdate)
            return;
        //update y position
        this.y += this.vY;
        //check if sprite has left the game area
        if (this.y > app.renderer.height) {
            //stop updating the sprite, make it invisible and trigger loseLife function
            this.visible = false;
            this.props.loseLife();
            this.stopUpdating();
        }
    }
    //stop updating the sprite
    stopUpdating() {
        this.shouldUpdate = false;
    }
    //check if sprite collides with rectangle object (assuming both objects anchors are [0.5, 0.5])
    collides(object) {
        return (this.x - this.width / 2 < object.x + object.width / 2 &&
            this.x + this.width / 2 > object.x - object.width / 2 &&
            this.y - this.height / 2 < object.y + object.height / 2 &&
            this.y + this.height / 2 > object.y - object.height / 2);
    }
}
