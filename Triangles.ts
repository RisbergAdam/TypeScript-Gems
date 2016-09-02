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

function startGL() {
    canvas = document.getElementById("glCanvas") as HTMLCanvasElement;
    let canvasStyle = window.getComputedStyle(canvas);
    canvas.setAttribute("width", canvasStyle.width);
    canvas.setAttribute("height", canvasStyle.height);

    gl = canvas.getContext("webgl") as WebGLRenderingContext;
    graphics = new Graphics(gl, canvas.width, canvas.height);
    graphics.init();
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