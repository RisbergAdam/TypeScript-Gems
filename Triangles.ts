import { Graphics } from "./glPort/Graphics";
import { Shader } from "./glPort/Shader";
import { Model } from "./glPort/Model";
import { Mesh, CompiledMesh, Vertex } from "./glPort/Mesh";
import { Instancing } from "./glPort/Instancing";
import { InstancedModel } from "./glPort/InstancedModel";
import { source as vertexSource } from "./shaders/VertexShader";
import { source as fragmentSource } from "./shaders/FragmentShader";
import { build as buildSphere } from "./models/Sphere";

let gl:WebGLRenderingContext;
let graphics: Graphics;
let shader: Shader;
let model: Model;
let instancing: Instancing;
let inst1: InstancedModel;
let inst2: InstancedModel;

function startGL() {
    let canvas:HTMLCanvasElement = document.getElementById("glCanvas") as HTMLCanvasElement;
    gl = canvas.getContext("webgl2") as WebGLRenderingContext;

    shader = new Shader(vertexSource, fragmentSource);
    graphics = new Graphics(gl, shader, canvas.width, canvas.height);
    
    graphics.init();

    let mesh = buildSphere(graphics);

    model = new Model(mesh, [0,0,0], [0,0,0]);
    model.getPosition()[2] = 15.0;
    model.getPosition()[0] = -3;

    instancing = new Instancing(mesh);

    inst1 = instancing.create();
    inst1.getPosition()[2] = 15.0;
    inst1.getPosition()[0] = 3.0;

    inst2 = instancing.create();
    inst2.getPosition()[2] = 15.0;
    inst2.getPosition()[0] = 0;
}

function draw() {
    graphics.begin();
    
    model.getRotation()[0] += 0.02;
    model.draw(graphics);

    inst1.getRotation()[1] += 0.02;
    inst2.getRotation()[2] += 0.02;

    instancing.draw(graphics);

    graphics.end();

    setTimeout(draw, 20);
}

startGL();
draw();