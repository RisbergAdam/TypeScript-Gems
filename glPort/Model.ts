import { CompiledMesh } from "./Mesh";
import { Matrix } from "./Matrix";

class Model {

    mesh: CompiledMesh;
    position: [number, number, number];
    rotation: [number, number, number];

    matrix: Matrix = new Matrix();

    constructor(mesh: CompiledMesh, position: [number, number, number], rotation: [number, number, number]) {
        this.mesh = mesh;
        this.position = position;
        this.rotation = rotation;
    }

    getPosition(): [number, number, number] {
        return this.position;
    }
    
    getRotation(): [number, number, number] {
        return this.rotation;
    }

    getMatrix(): Matrix {
        let matrix = this.matrix;
        matrix.identity();
        matrix.translate(this.position[0], this.position[1], this.position[2]);
		matrix.rotate(this.rotation[2], 0, 0, 1);
		matrix.rotate(this.rotation[1], 0, 1, 0);
		matrix.rotate(this.rotation[0], 1, 0, 0);
        return matrix;
    }

}

export { Model };