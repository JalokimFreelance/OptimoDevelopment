import { Container, Graphics } from "pixi.js";

//class that extends PIXI.container to create a container with minimal fixed width and height and with color as a background
export default class FixedContainer extends Container {
  constructor(width: number, height: number, color: number, alpha = 1) {
    super();
    let rect = new Graphics();
    rect.beginFill(color);
    rect.drawRect(0, 0, width, height);
    rect.endFill();
    rect.alpha = alpha;
    this.addChild(rect);
  }
}
