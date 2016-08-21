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


function loadScene(graphics: Graphics) {
    m1 = new Model(buildSphere(graphics));
    m2 = new Model(buildBrokenSphere(graphics));
    m3 = new Model(buildBluntSpikes(graphics));
    m4 = new Model(buildSpikes(graphics));
    m5 = new Model(buildTorus(graphics));

    let dim = 0.4 / 256.0;
    let c5 = [171, 0, 46];
    let c4 = [132, 0, 66];
    let c3 = [112, 14, 113];
    let c2 = [96, 7, 128];
    let c1 = [81, 0, 137];

    m1.getPosition()[0] = -5;
    m1.getPosition()[2] = 15;
    m1.getColor()[0] = c1[0]*dim;
    m1.getColor()[1] = c1[1]*dim;
    m1.getColor()[2] = c1[2]*dim;
    //m1.getColor()[1] = 0.8;

    m2.getPosition()[0] = -2.5;
    m2.getPosition()[2] = 15;
    m2.getColor()[0] = c2[0]*dim;
    m2.getColor()[1] = c2[1]*dim;
    m2.getColor()[2] = c2[2]*dim;

    m3.getPosition()[0] = 0;
    m3.getPosition()[2] = 15;
    m3.getColor()[0] = c3[0]*dim;
    m3.getColor()[1] = c3[1]*dim;
    m3.getColor()[2] = c3[2]*dim;

    m4.getPosition()[0] = 2.5;
    m4.getPosition()[2] = 15;
    m4.getColor()[0] = c4[0]*dim;
    m4.getColor()[1] = c4[1]*dim;
    m4.getColor()[2] = c4[2]*dim;

    m5.getPosition()[0] = 5.0;
    m5.getPosition()[2] = 15;
    m5.getColor()[0] = c5[0]*dim*0.7;
    m5.getColor()[1] = c5[1]*dim*0.7;
    m5.getColor()[2] = c5[2]*dim*0.7;
}

function drawScene(graphics: Graphics) {
    m1.getRotation()[1] += 0.05;
    m2.getRotation()[1] += 0.05;
    m3.getRotation()[1] += 0.05;
    m4.getRotation()[1] += 0.05;
    m5.getRotation()[1] += 0.05;

    m1.draw(graphics);
    m2.draw(graphics);
    m3.draw(graphics);
    m4.draw(graphics);
    m5.draw(graphics);
}

export { loadScene, drawScene };