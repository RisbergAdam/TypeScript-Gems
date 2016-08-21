import { Graphics } from "./glPort/Graphics";
import { Shader } from "./glPort/Shader";
//import { loadScene, drawScene } from "./DisplayScene";
import { loadScene, drawScene } from "./DisplayScene";
import { getModelById } from "./glPort/Model";

let gl:WebGLRenderingContext;
let graphics: Graphics;
let shader: Shader;
let canvas: HTMLCanvasElement;

let getPixel: boolean;
let x, y: number;

function mouseClick(event: MouseEvent) {
    x = event.x - canvas.offsetLeft;
    y = event.y - canvas.offsetTop;
    getPixel = true;
}

function mouseMove(event: Event) {
    //console.log("move!");
}

function startGL() {
    canvas = document.getElementById("glCanvas") as HTMLCanvasElement;

    canvas.onclick = mouseClick;
    canvas.onmousemove = mouseMove;

    gl = canvas.getContext("webgl2") as WebGLRenderingContext;
    graphics = new Graphics(gl, canvas.width, canvas.height);
    graphics.init();
    loadScene(graphics);
}

function draw() {
    graphics.begin();
    drawScene(graphics);
    graphics.end();

    if (getPixel) {
        let pixelArray = new Uint8Array(4);
        graphics.gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelArray);
        let id = pixelArray[3];
        getModelById(id).getColor()[2] = 0.4;
        getPixel = false;
    }

    setTimeout(draw, 20);
}

startGL();
draw();