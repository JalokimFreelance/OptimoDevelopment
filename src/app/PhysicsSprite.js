import { Sprite } from "pixi.js";
//class that adds some basic Physic to Sprite class
export default class PhysicsSprite extends Sprite {
    constructor(props) {
        super(props.tileset);
    }
    //returns value for a chosen force
    getForce(force) {
        return this[force];
    }
    //resets a chosen force
    resetForce(force) {
        this[force] = 0;
    }
    //adds the value to a chosen force
    addForce(force, value) {
        this[force] += value;
    }
    //multiplies a chosen force by the value
    multiplyForce(force, value) {
        this[force] *= value;
    }
}
