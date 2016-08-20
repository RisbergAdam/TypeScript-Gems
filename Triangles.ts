import { Graphics } from "./glPort/Graphics";
import { Shader } from "./glPort/Shader";
import { Model } from "./glPort/Model";
import { Mesh, CompiledMesh, Vertex } from "./glPort/Mesh";
import { source as vertexSource } from "./shaders/VertexShader";
import { source as fragmentSource } from "./shaders/FragmentShader";

let gl:WebGLRenderingContext;
let graphics: Graphics;
let shader: Shader;
let model: Model;

function startGL() {
    let canvas:HTMLCanvasElement = document.getElementById("glCanvas") as HTMLCanvasElement;
    gl = canvas.getContext("webgl") as WebGLRenderingContext;

    shader = new Shader(gl, vertexSource, fragmentSource);
    graphics = new Graphics(gl, shader, canvas.width, canvas.height);
    
    graphics.init();

     let triangleData = [new Vertex([0.0, -0.5, 0.0], [0.0, 0.0, 0.0], [1.0,0.0,0.0]),
						 new Vertex([-0.5, 0.5, 0.0], [0.0, 0.0, 0.0], [0.0,1.0,0.0]),
						 new Vertex([0.5, 0.5, 0.0], [0.0, 0.0, 0.0], [0.0,0.0,1.0])];

    let mesh = new Mesh(triangleData).compile(graphics.gl, graphics.shader);
    model = new Model(mesh, [0, 0, 0], [0, 0, 0]);
    model.getPosition()[2] = 5.0;
}

function draw() {
    graphics.begin();
    
    graphics.draw(model);

    graphics.end();

    setTimeout(draw, 20);
}

startGL();
draw();