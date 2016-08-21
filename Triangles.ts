import { Graphics } from "./glPort/Graphics";
import { Shader } from "./glPort/Shader";
import { source as vertexSource } from "./shaders/VertexShader";
import { source as fragmentSource } from "./shaders/FragmentShader";
import { loadScene, drawScene } from "./Scene";

let gl:WebGLRenderingContext;
let graphics: Graphics;
let shader: Shader;

function startGL() {
    let canvas:HTMLCanvasElement = document.getElementById("glCanvas") as HTMLCanvasElement;
    gl = canvas.getContext("webgl2") as WebGLRenderingContext;

    shader = new Shader(vertexSource, fragmentSource);
    graphics = new Graphics(gl, shader, canvas.width, canvas.height);
    
    graphics.init();

    loadScene(graphics);

    /*let mesh = buildSphere(graphics);

    model = new Model(mesh, [0,0,0], [0,0,0]);
    model.getPosition()[2] = 15.0;
    model.getPosition()[0] = -3;
    model.getColor()[0] = 1.0;

    instancing = new Instancing(mesh);

    inst1 = instancing.create();
    inst1.getPosition()[2] = 15.0;
    inst1.getPosition()[0] = 3.0;

    inst2 = instancing.create();
    inst2.getPosition()[2] = 15.0;
    inst2.getPosition()[0] = 0;*/
}

function draw() {
    graphics.begin();
    drawScene(graphics);
    graphics.end();

    setTimeout(draw, 20);
    
    /*model.getRotation()[0] += 0.02;
    model.getColor()[0] = (model.getColor()[0] + 0.02) % 1.0;
    model.draw(graphics);

    inst1.getRotation()[1] += 0.02;
    inst2.getRotation()[2] += 0.02;

    instancing.draw(graphics);*/
}

startGL();
draw();