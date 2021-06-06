import { Sprite } from "pixi.js";

//class that adds some basic Physic to Sprite class
export default class PhysicsSprite extends Sprite {
  constructor(props) {
    super(props.tileset);
  }

  //returns value for a chosen force
  getForce(force: string): number {
    return this[force];
  }

  //resets a chosen force
  resetForce(force: string): void {
    this[force] = 0;
  }

  //adds the value to a chosen force
  addForce(force: string, value: number): void {
    this[force] += value;
  }

  //multiplies a chosen force by the value
  multiplyForce(force: string, value: number): void {
    this[force] *= value;
  }
}
