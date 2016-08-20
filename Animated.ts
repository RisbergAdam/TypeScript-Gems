import { Graphics } from "./glPort/Graphics";
import { CompiledModel } from "./glPort/Model";

class Animated {

	xStart: number;
	yStart: number;
	ticker: number = 0;
	model: CompiledModel;

	constructor(xStart: number, yStart: number, model: CompiledModel) {
		this.xStart = xStart;
		this.yStart = yStart;
		this.model = model;
	}

	tick(graphics: Graphics) {
		var offset = this.calc(this.xStart, this.yStart);

		let dist = this.dist(this.xStart, this.yStart);
		let d = this.density(this.xStart, this.yStart, 10);

		let c = 1.0 - dist*0.01 - 0.5 - (10.0 - d)/5.0;

		graphics.render(this.model,offset[0], offset[1], this.ticker * dist * 0.005, c, c, c);

		this.ticker += 0.08;
	}

	hypot([x1, y1], [x2, y2]) {
		let x = x1-x2;
		let y = y1-y2;
		return Math.sqrt(x*x+y*y);
	}

	density(x, y, rangle): number {
		let s0 = this.calc(x, y);
		let s1 = this.calc(x + rangle, y);
		let s2 = this.calc(x, y + rangle);
		let s3 = this.calc(x - rangle, y);
		let s4 = this.calc(x, y - rangle);
		let d = this.hypot(s0, s1) + this.hypot(s0, s2) + this.hypot(s0, s3) + this.hypot(s0, s4);
		return d / 4.0;
	}

	dist(x, y): number {
		return Math.sqrt(x*x+y*y) * 0.05;
	}

	calc(x, y): [number, number] {
		let dist = this.dist(x, y);

		var xAdd = Math.sin(this.ticker + dist*0.1) * 5.0 * dist;
		var yAdd = Math.cos(this.ticker + dist*0.1) * 5.0 * dist;

		return [x + xAdd, y + yAdd];
	}

}


export { Animated }