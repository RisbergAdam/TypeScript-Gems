import { Graphics } from "./glPort/Graphics";
import { Shader } from "./glPort/Shader";
import { Model } from "./glPort/Model";
import { Mesh, CompiledMesh, Vertex } from "./glPort/Mesh";
import { Instancing } from "./glPort/Instancing";
import { InstancedModel } from "./glPort/InstancedModel";

import { build as buildShard } from "./models/Shard";

let instancing: Instancing;
let inst: InstancedModel[];
let m1: Model;

function loadScene(graphics: Graphics) {
    let shardMesh = buildShard(graphics);
    instancing = new Instancing(shardMesh);
    instancing.getColor()[0] = 0.015;
    instancing.getColor()[1] = 0.005;
    inst = [];

    m1 = new Model(shardMesh);
    m1.getPosition()[2] = 15;

    for (var i = 0;i < 100;i++) {
        let shard = instancing.create();
        shard.getPosition()[0] = i - 50;
        shard.getPosition()[2] = 50;
        inst.push(shard);
    }

}

function drawScene(graphics: Graphics) {
    instancing.draw(graphics);
    //m1.draw(graphics);
}

export { loadScene, drawScene };