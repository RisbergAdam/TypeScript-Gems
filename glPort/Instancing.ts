import { CompiledMesh } from "./Mesh";
import { Matrix } from "./Matrix";
import { Graphics } from "./Graphics";
import { InstancedModel } from "./InstancedModel";

class Instancing {

    mesh: CompiledMesh;
    instances: InstancedModel[];
    array: Float32Array;

    constructor(mesh: CompiledMesh) {
        this.mesh = mesh;
        this.instances = [];
        this.array = new Float32Array(0);
    }

    create(): InstancedModel {
        let instance = new InstancedModel();
        this.instances.push(instance);
        return instance;
    }

    draw(graphics: Graphics) {
        let isShaderLocation = graphics.shader.getUniformLocation("isInstance");
        graphics.gl.uniform1i(isShaderLocation, 1);

        this.fillArray();
        let modelArrayLocation = graphics.shader.getUniformLocation("ModelInstance");
        graphics.gl.uniformMatrix4fv(modelArrayLocation, false, this.array);

        this.mesh.drawInstanced(graphics.gl, this.instances.length);
    }

    private fillArray() {
        let requiredLength = this.instances.length * 4*4;
        if (this.array.length < requiredLength) {
            this.array = new Float32Array(requiredLength);
        }

        for (var i = 0;i < this.instances.length;i++) {
            for (var j = 0;j < 4*4;j++) {
                this.array[i*4*4 + j] = this.instances[i].getMatrix().array[j];
            }
        }
    }

}

export { Instancing };