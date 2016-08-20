import { Graphics } from "./glPort/Graphics";
import { Shader } from "./glPort/Shader";
import { Animated } from "./Animated";
import { Model, CompiledModel, Vertex } from "./glPort/Model";

let vertexSource = `
    attribute vec2 vertex;
    attribute vec3 color;

    uniform vec3 position;
    uniform vec3 baseColor;

    varying vec4 vColor;

    float atan2(in float y, in float x) {
        bool s = (abs(x) > abs(y));
        return mix(3.141589/2.0 - atan(x,y), atan(y,x), float(s));
    }

    void main(void) {
        float angle = atan2(vertex.x, vertex.y) + position.z;
        float length = length(vertex);

        gl_Position = vec4(sin(angle) * length + position.x, cos(angle) * length + position.y, 0.0, 1.0);
        gl_Position.x = gl_Position.x * 1.0/800.0;
        gl_Position.y = gl_Position.y * 1.0/350.0;
        vColor = vec4(color + baseColor, 1.0);
    }
`;

let fragmentSource = `
    precision mediump float;

    varying vec4 vColor;

    void main(void) {
        gl_FragColor = vColor;
    }
`;

let gl:WebGLRenderingContext;
let graphics: Graphics;
let shader: Shader;

//let anim: Animated = new Animated(0.5, 0.5);
let anims = [80, 35];
let spacing = 50.0;
let scale = 40;

let anim: Array<Array<Animated>> = new Array(anims[0]);

function startGL() {
    let canvas:HTMLCanvasElement = document.getElementById("glCanvas") as HTMLCanvasElement;
    gl = canvas.getContext("webgl") as WebGLRenderingContext;

    shader = new Shader(gl, vertexSource, fragmentSource);
    graphics = new Graphics(gl, shader);
    
    graphics.init();

    let triangleData = [new Vertex([0.0, 0.5*scale], [0.0,0.0,0.0]),
						  new Vertex([-0.5*scale, -0.5*scale], [0.0,0.0,0.0]),
						  new Vertex([0.5*scale, -0.5*scale], [0.0,0.0,0.0])];
    let triangle = new Model(triangleData).compile(gl, shader);

    for (let x = 0;x < anims[0];x++) {
        anim[x] = new Array(anims[1]);
        for (let y = 0;y < anims[1];y++) {
            anim[x][y] = new Animated((x - anims[0]/2.0) * spacing, (y - anims[1]/2.0) * spacing, triangle);
        }
    }
}

function draw() {
    graphics.begin();

    for (let x = 0;x < anims[0];x++) {
        for (let y = 0;y < anims[1];y++) {
            anim[x][y].tick(graphics);
        }
    }

    graphics.end();

    setTimeout(draw, 20);
}

startGL();
draw();