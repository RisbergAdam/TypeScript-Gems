import { CompiledMesh } from "./Mesh";
import { Matrix } from "./Matrix";
import { Graphics } from "./Graphics";

let idGenerator = 0;
let idMapping: { [key:number]:Model; } = {};

function generateId(model: Model): number {
    idGenerator++;
    idMapping[idGenerator] = model;
    return idGenerator;
}

function getModelById(id: number) {
    return idMapping[id];
}

class Model {

    mesh: CompiledMesh;
    position: [number, number, number];
    rotation: [number, number, number];

    color: [number, number, number] = [0, 0, 0];

    matrix: Matrix = new Matrix();

    id: number;

    constructor(mesh: CompiledMesh) {
        this.mesh = mesh;
        this.position = [0,0,0];
        this.rotation = [0,0,0];
        this.id = generateId(this);
    }

    getPosition(): [number, number, number] {
        return this.position;
    }
    
    getRotation(): [number, number, number] {
        return this.rotation;
    }

    getColor(): [number, number, number] {
        return this.color;
    }

    draw(graphics: Graphics) {
        let isShaderLocation = graphics.shader.getUniformLocation("isInstance");
        graphics.gl.uniform1i(isShaderLocation, 0);

        let idLocation = graphics.shader.getUniformLocation("id");
        graphics.gl.uniform1i(idLocation, this.id);

        let heatColorLocation = graphics.shader.getUniformLocation("heatColor");
        graphics.gl.uniform3f(heatColorLocation, this.color[0], this.color[1], this.color[2]);

        this.getMatrix().upload(graphics.gl, "Model", graphics.shader);
		this.mesh.draw(graphics.gl);
    }

    private getMatrix(): Matrix {
        let matrix = this.matrix;
        matrix.identity();
        matrix.translate(this.position[0], this.position[1], this.position[2]);
		matrix.rotate(this.rotation[2], 0, 0, 1);
		matrix.rotate(this.rotation[1], 0, 1, 0);
		matrix.rotate(this.rotation[0], 1, 0, 0);
        return matrix;
    }

}

export { Model, getModelById };