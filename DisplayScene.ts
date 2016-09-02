import { Graphics } from "./glPort/Graphics";
import { Shader } from "./glPort/Shader";
import { Model, getModelById } from "./glPort/Model";
import { Mesh, CompiledMesh, Vertex } from "./glPort/Mesh";
import { Instancing } from "./glPort/Instancing";
import { InstancedModel } from "./glPort/InstancedModel";
import { getCanvas } from "./Triangles";

import { build as buildSphere } from "./models/Sphere";
import { build as buildBrokenSphere } from "./models/BrokenSphere";
import { build as buildBluntSpikes } from "./models/BluntSpikes";
import { build as buildSpikes } from "./models/Spikes";
import { build as buildTorus } from "./models/Torus";
import { build as buildTeapot } from "./models/Teapot";
import { build as buildShard } from "./models/Shard";

let m1, m2, m3, m4, m5: Model;

let models: Model[];
let colors: [number, number, number][];
let rotationSpeeds: number[];

let xMouse, yMouse: number;
let clicked = false;

let dim = 0.2 / 256.0;

type Num3 = [number, number, number];

function mouseClick(event: MouseEvent) {
    clicked = true;
}

function mouseMove(event: MouseEvent) {
    xMouse = event.x - getCanvas().offsetLeft;
    yMouse = event.y - getCanvas().offsetTop;
}

function getMouseModel(graphics: Graphics): Model {
    let pixelArray = new Uint8Array(4);
    graphics.gl.readPixels(xMouse, graphics.height - yMouse, 1, 1, graphics.gl.RGBA, graphics.gl.UNSIGNED_BYTE, pixelArray);
    let id = pixelArray[3];
    return getModelById(id);
}

function loadScene(graphics: Graphics) {
    getCanvas().onmousemove = mouseMove;
    getCanvas().onmousedown = mouseClick;

    m1 = new Model(buildSphere(graphics));
    m2 = new Model(buildBrokenSphere(graphics));
    m3 = new Model(buildBluntSpikes(graphics));
    m4 = new Model(buildSpikes(graphics));
    m5 = new Model(buildTorus(graphics));
    let c5: Num3 = [171*0.7, 0, 46*0.7];
    let c4: Num3 = [132, 0, 66];
    let c3: Num3 = [112, 14, 113];
    let c2: Num3 = [96, 7, 128];
    let c1: Num3 = [81, 0, 137];

    colors = [c1, c2, c3, c4, c5];
    models = [m1, m2, m3, m4, m5];
    rotationSpeeds = [0.005, 0.005, 0.005, 0.005 ,0.005];

    let depth = 12;

    m1.getPosition()[0] = -5;
    m1.getPosition()[2] = depth;
    m1.getColor()[0] = c1[0]*dim;
    m1.getColor()[1] = c1[1]*dim;
    m1.getColor()[2] = c1[2]*dim;
    //m1.getColor()[1] = 0.8;

    m2.getPosition()[0] = -2.5;
    m2.getPosition()[2] = depth;
    m2.getColor()[0] = c2[0]*dim;
    m2.getColor()[1] = c2[1]*dim;
    m2.getColor()[2] = c2[2]*dim;

    m3.getPosition()[0] = 0;
    m3.getPosition()[2] = depth;
    m3.getColor()[0] = c3[0]*dim;
    m3.getColor()[1] = c3[1]*dim;
    m3.getColor()[2] = c3[2]*dim;

    m4.getPosition()[0] = 2.5;
    m4.getPosition()[2] = depth;
    m4.getColor()[0] = c4[0]*dim;
    m4.getColor()[1] = c4[1]*dim;
    m4.getColor()[2] = c4[2]*dim;

    m5.getPosition()[0] = 5.0;
    m5.getPosition()[2] = depth;
    m5.getColor()[0] = c5[0]*dim;
    m5.getColor()[1] = c5[1]*dim;
    m5.getColor()[2] = c5[2]*dim;
}

function drawScene(graphics: Graphics) {
    m1.getRotation()[1] += rotationSpeeds[0];
    m2.getRotation()[1] += rotationSpeeds[1];
    m3.getRotation()[1] += rotationSpeeds[2];
    m4.getRotation()[1] += rotationSpeeds[3];
    m5.getRotation()[1] += rotationSpeeds[4];

    m1.draw(graphics);
    m2.draw(graphics);
    m3.draw(graphics);
    m4.draw(graphics);
    m5.draw(graphics);

    let mouseModel = getMouseModel(graphics);
    if (mouseModel != null) {
        if (clicked) {
            for (var i = 0;i < models.length;i++) {
                if (models[i] == mouseModel) {
                    rotationSpeeds[i] = 1.0;
                }
            }
            clicked = false;
        } else {
            mouseModel.color[0] *= 1.1;
            mouseModel.color[1] *= 1.06;
            mouseModel.color[2] *= 1.06;
        }
    }

    for (var i = 0;i < models.length;i++) {
        let rDiff = models[i].color[0] - colors[i][0]*dim;
        let gDiff = models[i].color[1] - colors[i][1]*dim;
        let bDiff = models[i].color[2] - colors[i][2]*dim;
        models[i].color[0] = colors[i][0]*dim + rDiff * 0.9;
        models[i].color[1] = colors[i][1]*dim + gDiff * 0.9;
        models[i].color[2] = colors[i][2]*dim + bDiff * 0.9;

        let rotDiff = rotationSpeeds[i] - 0.005;
        rotationSpeeds[i] = 0.005 + rotDiff * 0.9;
    }
}

export { loadScene, drawScene };