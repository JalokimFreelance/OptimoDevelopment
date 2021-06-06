import { Rectangle, Texture } from "pixi.js";
import PhysicsSprite from "./PhysicsSprite";
export default class Hero extends PhysicsSprite {
    constructor(props) {
        super(props);
        //starting stuff
        this.props = props;
        this.textures = [];
        this.resetForce("vX");
        this.addForce("vX", -4);
        this.anchor.set(0.5, 0.5);
        this.addTextures();
        this.scale.set(2);
        this.x = this.props.scene.width / 2;
        this.y = this.props.scene.height - this.height / 2;
        //animate every 300ms
        setInterval(() => {
            this.animate();
        }, 300);
    }
    //update the hero position
    update() {
        this.barriers();
        this.x += this.vX;
    }
    //logic for animation change
    animate() {
        let direction;
        if (this.getForce("vX") > 0) {
            direction = "right";
        }
        if (this.getForce("vX") < 0) {
            direction = "left";
        }
        for (let texture in this.textures) {
            if (direction + this.lastTexture === texture) {
                this.texture = this.textures[texture];
                if (this.lastTexture < 5)
                    this.lastTexture++;
                else
                    this.lastTexture = 1;
                return;
            }
        }
        this.resetAnimation(direction);
    }
    //reset the animation of the hero
    resetAnimation(direction) {
        this.lastTexture = 1;
        this.texture = this.textures[direction + "1"];
    }
    addTextures() {
        let { tileset } = this.props;
        let { width, height } = tileset;
        //positions of textures on the tileset
        let texturesPositions = {
            left1: {
                x: (5 * width) / 8,
                y: (2 * height) / 5,
            },
            left2: {
                x: (6 * width) / 8,
                y: (2 * height) / 5,
            },
            left3: {
                x: (7 * width) / 8,
                y: (2 * height) / 5,
            },
            left4: {
                x: (0 * width) / 8,
                y: (3 * height) / 5,
            },
            left5: {
                x: (1 * width) / 8,
                y: (3 * height) / 5,
            },
            right1: {
                x: (7 * width) / 8,
                y: (1 * height) / 5,
            },
            right2: {
                x: (0 * width) / 8,
                y: (2 * height) / 5,
            },
            right3: {
                x: (1 * width) / 8,
                y: (2 * height) / 5,
            },
            right4: {
                x: (2 * width) / 8,
                y: (2 * height) / 5,
            },
            right5: {
                x: (3 * width) / 8,
                y: (2 * height) / 5,
            },
        };
        //copy the textures
        for (let position in texturesPositions) {
            this.textures[position] = new Texture(this.texture.baseTexture);
        }
        //frame the textures
        for (let texture in this.textures) {
            let rect = new Rectangle(texturesPositions[texture].x, texturesPositions[texture].y, tileset.width / 8, tileset.height / 5);
            this.textures[texture].frame = rect;
        }
        this.texture = this.textures["left3"];
    }
    //check if the hero left the canvas
    barriers() {
        //hero goes to left
        if (this.x - this.width / 2 < 0) {
            this.resetForce("vX");
            this.addForce("vX", 4);
            this.x = this.width / 2;
            this.resetAnimation("right");
        }
        //hero goes to right
        if (this.x > this.props.app.renderer.width - this.width / 2) {
            this.resetForce("vX");
            this.addForce("vX", -4);
            this.x = this.props.app.renderer.width - this.width / 2;
            this.resetAnimation("left");
        }
    }
}
