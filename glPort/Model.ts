import { Shader } from "./Shader";

class Vertex {

	pos: [number, number];
	color: [number, number, number];

	constructor(pos, color) {
		this.pos = pos;
		this.color = color;
	}

}

class Model {

	data: Vertex[];

	constructor(data: Vertex[]) {
		this.data = data;
	}

	compile(gl: WebGLRenderingContext, shader: Shader): CompiledModel {
		let posArray = new Float32Array(this.data.length * 2);
		let colArray = new Float32Array(this.data.length * 3);

		for (let i = 0;i < this.data.length;i++) {
			posArray[i*2 + 0] = this.data[i].pos[0];
			posArray[i*2 + 1] = this.data[i].pos[1];

			colArray[i*3 + 0] = this.data[i].color[0];
			colArray[i*3 + 1] = this.data[i].color[1];
			colArray[i*3 + 2] = this.data[i].color[2];
		}

		let posBuffer:WebGLBuffer = gl.createBuffer();
		let colBuffer:WebGLBuffer = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, posArray, gl.STATIC_DRAW);

		let posShaderLocation = shader.getAttribLocation("vertex");
		gl.enableVertexAttribArray(posShaderLocation);
		gl.vertexAttribPointer(posShaderLocation, 2, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, colArray, gl.STATIC_DRAW);

		let colShaderLocation = shader.getAttribLocation("color");
		gl.enableVertexAttribArray(colShaderLocation);
		gl.vertexAttribPointer(colShaderLocation, 3, gl.FLOAT, false, 0, 0);
		

		return new CompiledModel(posBuffer, posShaderLocation, colBuffer, colShaderLocation, this.data.length);
	}

}

class CompiledModel {

	posBuffer: WebGLBuffer;
	colBuffer: WebGLBuffer;

	posShaderLocation: number;
	colShaderLocation: number;

	numVertices: number;

	constructor(posBuffer: WebGLBuffer, posShaderLocation, colBuffer: WebGLBuffer, colShaderLocation, numVertices) {
		this.posBuffer = posBuffer;
		this.colBuffer = colBuffer;
		this.posShaderLocation = posShaderLocation;
		this.colShaderLocation = colShaderLocation;
		this.numVertices = numVertices;
	}

	draw(gl: WebGLRenderingContext) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
		gl.vertexAttribPointer(this.posShaderLocation, 2, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colBuffer);
		gl.vertexAttribPointer(this.colShaderLocation, 3, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
	}

}

export { Vertex, Model, CompiledModel };