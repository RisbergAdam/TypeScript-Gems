import { Graphics } from "./glPort/Graphics";
import { Shader } from "./glPort/Shader";
import { Model } from "./glPort/Model";
import { Mesh, CompiledMesh, Vertex } from "./glPort/Mesh";
import { Instancing } from "./glPort/Instancing";
import { InstancedModel } from "./glPort/InstancedModel";

import { build as buildSphere } from "./models/Sphere";
import { build as buildBrokenSphere } from "./models/BrokenSphere";
import { build as buildBluntSpikes } from "./models/BluntSpikes";
import { build as buildSpikes } from "./models/Spikes";
import { build as buildTorus } from "./models/Torus";
import { build as buildTeapot } from "./models/Teapot";
import { build as buildShard } from "./models/Shard";

let m1, m2, m3, m4, m5: Model;
let m6: CompiledMesh;
let instancing: Instancing;

function loadScene(graphics: Graphics) {
    m1 = new Model(buildSphere(graphics));
    m2 = new Model(buildBrokenSphere(graphics));
    m3 = new Model(buildBluntSpikes(graphics));
    m4 = new Model(buildSpikes(graphics));
    m5 = new Model(buildTorus(graphics));
    m6 = buildShard(graphics);

    m1.getPosition()[0] = -5;
    m1.getPosition()[2] = 15;
    m1.getColor()[0] = 0.5*0.3;
    m1.getColor()[1] = 0.2*0.3;
    m1.getColor()[2] = 0.05*0.3;
    //m1.getColor()[1] = 0.8;

    m2.getPosition()[0] = -2.5;
    m2.getPosition()[2] = 15;
    m2.getColor()[0] = 0.5*0.3;
    m2.getColor()[1] = 0.2*0.3;
    m2.getColor()[2] = 0.05*0.3;

    m3.getPosition()[0] = 0;
    m3.getPosition()[2] = 15;
    m3.getColor()[0] = 0.5*0.3;
    m3.getColor()[1] = 0.2*0.3;
    m3.getColor()[2] = 0.05*0.3;

    m4.getPosition()[0] = 2.5;
    m4.getPosition()[2] = 15;
    m4.getColor()[0] = 0.5*0.3;
    m4.getColor()[1] = 0.2*0.3;
    m4.getColor()[2] = 0.05*0.3;

    m5.getPosition()[0] = 5.0;
    m5.getPosition()[2] = 15;
    m5.getColor()[0] = 0.5*0.3;
    m5.getColor()[1] = 0.2*0.3;
    m5.getColor()[2] = 0.05*0.3;
}

function drawScene(graphics: Graphics) {
    m1.getRotation()[1] += 0.005;
    m2.getRotation()[1] += 0.005;
    m3.getRotation()[1] += 0.005;
    m4.getRotation()[1] += 0.005;
    m5.getRotation()[1] += 0.005;

    m1.draw(graphics);
    m2.draw(graphics);
    m3.draw(graphics);
    m4.draw(graphics);
    m5.draw(graphics);
}

export { loadScene, drawScene };