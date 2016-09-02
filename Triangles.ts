import { Graphics } from "./glPort/Graphics";
import { Shader } from "./glPort/Shader";
import { loadScene, drawScene} from "./DisplayScene";
//import { loadScene, drawScene, mouseClick, mouseMove } from "./InteractiveScene";
import { getModelById } from "./glPort/Model";

let fps = 50;
let frameTime = 1000/fps;

let gl:WebGLRenderingContext;
let graphics: Graphics;
let shader: Shader;
let canvas: HTMLCanvasElement;

/*let getPixel: boolean;
let x, y: number;

function mouseClick(event: MouseEvent) {
    mouseClic = true;
}

function mouseMove(event: MouseEvent) {
    x = event.x - canvas.offsetLeft;
    y = event.y - canvas.offsetTop;
}*/

function startGL() {
    canvas = document.getElementById("glCanvas") as HTMLCanvasElement;
    console.log("startGL(): " + canvas);

    gl = canvas.getContext("webgl") as WebGLRenderingContext;
    graphics = new Graphics(gl, canvas.width, canvas.height);
    graphics.init();
    //loadScene(graphics, canvas.offsetLeft, canvas.offsetTop);
    loadScene(graphics);
}

function draw() {
    graphics.begin();
    drawScene(graphics);
    graphics.end();

    setTimeout(draw, frameTime);
}

function getCanvas(): HTMLCanvasElement {
    return canvas;
}

startGL();
draw();

export { fps, frameTime, getCanvas };