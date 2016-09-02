import { Graphics } from "./glPort/Graphics";
import { Shader } from "./glPort/Shader";
import { Model, getModelById } from "./glPort/Model";
import { Mesh, CompiledMesh, Vertex } from "./glPort/Mesh";
import { Instancing } from "./glPort/Instancing";
import { InstancedModel } from "./glPort/InstancedModel";

import { build as buildSphere } from "./models/Sphere";
import { build as buildBroken } from "./models/BrokenSphere";
import { build as buildBlunt } from "./models/BluntSpikes";
import { build as buildSpikes } from "./models/Spikes";
import { build as buildTorus } from "./models/Torus";
import { build as buildSculpt } from "./models/Scuplt";

let mSphere: Model;

let xMouse, yMouse: number;
let clicked: boolean;

let stage: number = 0;
let localTime = 0;

let canvasOffsetLeft = 0, canvasOffsetTop = 0;
let mouseModel: Model;

function mouseClick(event: MouseEvent) {
    clicked = true;
}

function mouseMove(event: MouseEvent) {
    xMouse = event.x - canvasOffsetLeft;
    yMouse = event.y - canvasOffsetTop;
}

function loadScene(graphics: Graphics, offsetLeft: number, offsetTop: number) {
    mSphere = new Model(buildSculpt(graphics));
    canvasOffsetLeft = offsetLeft;
    canvasOffsetTop = offsetTop;
}

function drawScene(graphics: Graphics) {
    if (stage == 0) {
        sphere(graphics);
    }

    localTime++;
    mouseModel = getMouseModel(graphics);
}

function getMouseModel(graphics: Graphics): Model {
    let pixelArray = new Uint8Array(4);
    graphics.gl.readPixels(xMouse, graphics.height - yMouse, 1, 1, graphics.gl.RGBA, graphics.gl.UNSIGNED_BYTE, pixelArray);
    let id = pixelArray[3];
    return getModelById(id);
}


let sphereBaseColor = [81, 0, 137];
let sphereMouseTime = 0;
let rotationSpeed = 0.015;
let rotationAxis = [0, 1, 0];
let endTime = 0;

function sphere(graphics: Graphics) {
    if (localTime < 60) {
        let factor = (localTime) / 60;
        mSphere.getPosition()[0] = 0;
        mSphere.getPosition()[1] = 100 / (localTime*2.0 + 1.0) - 1 + Math.sin((localTime - 60)/20.0)*0.5 * factor;
        mSphere.getPosition()[2] = 4;
    }

    if (localTime >= 60) {
        mSphere.getPosition()[1] = -0.17 + Math.sin((localTime - 60)/20.0)*0.5;
    }

    console.log(mouseModel);

    if (mouseModel != null) {
        if (sphereMouseTime <= 7) {
            sphereMouseTime++;
        }
    } else if (sphereMouseTime > 0) {
        sphereMouseTime--;
    }

    mSphere.getColor()[0] = sphereBaseColor[0] / 255.0 * (0.1 + sphereMouseTime/18.0);
    mSphere.getColor()[1] = sphereBaseColor[1] / 255.0 * (0.1 + sphereMouseTime/18.0);
    mSphere.getColor()[2] = sphereBaseColor[2] / 255.0 * (0.1 + sphereMouseTime/18.0);

    rotationSpeed = 0.015 + sphereMouseTime/80.0;
    rotationAxis[0] = sphereMouseTime / 7 / 2;
    rotationAxis[1] = 1 - sphereMouseTime / 7.0;

    
    if (endTime > 0 || clicked) {
        endTime++;
        clicked = false;
        rotationSpeed += 0.003 * endTime;
    }

    mSphere.getRotation()[0] += rotationAxis[0] * rotationSpeed;
    mSphere.getRotation()[1] += rotationAxis[1] * rotationSpeed;
    mSphere.getRotation()[2] += rotationAxis[2] * rotationSpeed;
    mSphere.draw(graphics);
}

export { loadScene, drawScene, mouseClick, mouseMove };