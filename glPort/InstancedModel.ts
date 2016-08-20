import { Matrix } from "./Matrix";

class InstancedModel {

    position: [number, number, number];
    rotation: [number, number, number];
    matrix: Matrix;

    constructor() {
        this.position = [0,0,0];
        this.rotation = [0,0,0];
        this.matrix = new Matrix();
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

export { InstancedModel };