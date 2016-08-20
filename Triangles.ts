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
    var inst = instancing.create();
    inst.getPosition()[2] = 15.0;
    inst.getPosition()[0] = 3.0;

    inst = instancing.create();
    inst.getPosition()[2] = 15.0;
    inst.getPosition()[0] = 0;
}

function draw() {
    graphics.begin();
    
    model.getRotation()[0] += 0.01;
    model.draw(graphics);

    instancing.draw(graphics);

    graphics.end();

    setTimeout(draw, 20);
}

startGL();
draw();