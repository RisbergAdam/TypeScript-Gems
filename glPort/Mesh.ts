import { Shader } from "./Shader";
import { Graphics } from "./Graphics";

class Vertex {

	pos: [number, number, number];
	norm: [number, number, number];
	color: [number, number, number];

	constructor(pos: [number, number, number], norm: [number, number, number], color: [number, number, number]) {
		this.pos = pos;
		this.norm = norm;
		this.color = color;
	}

}

class Mesh {

	triangles: [Vertex, Vertex, Vertex][];

	constructor(triangles: [Vertex, Vertex, Vertex][]) {
		this.triangles = triangles;
	}

	compile(gl: WebGLRenderingContext, against: Shader): CompiledMesh {
		let posArray = new Float32Array(this.triangles.length * 3*3);
		let normArray = new Float32Array(this.triangles.length * 3*3);
		let colArray = new Float32Array(this.triangles.length * 3*3);

		for (let i = 0;i < this.triangles.length;i++) {
			for (let j = 0;j < 3;j++) {
				posArray[i*3*3 + j*3 + 0] = this.triangles[i][j].pos[0];
				posArray[i*3*3 + j*3 + 1] = this.triangles[i][j].pos[1];
				posArray[i*3*3 + j*3 + 2] = this.triangles[i][j].pos[2];

				normArray[i*3*3 + j*3 + 0] = this.triangles[i][j].norm[0];
				normArray[i*3*3 + j*3 + 1] = this.triangles[i][j].norm[1];
				normArray[i*3*3 + j*3 + 2] = this.triangles[i][j].norm[2];

				colArray[i*3*3 + j*3 + 0] = this.triangles[i][j].color[0];
				colArray[i*3*3 + j*3 + 1] = this.triangles[i][j].color[1];
				colArray[i*3*3 + j*3 + 2] = this.triangles[i][j].color[2];
			}
		}

		let posBuffer:WebGLBuffer = gl.createBuffer();
		let normBuffer:WebGLBuffer = gl.createBuffer();
		let colBuffer:WebGLBuffer = gl.createBuffer();

		// upload data for vertex positions
		gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, posArray, gl.STATIC_DRAW);

		let posShaderLocation = against.getAttribLocation("position");
		gl.enableVertexAttribArray(posShaderLocation);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
		//glExt.vertexAttribDivisorANGLE(posShaderLocation, 0);

		// upload data for vertex positions
		gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, normArray, gl.STATIC_DRAW);

		let normShaderLocation = against.getAttribLocation("normal");
		gl.enableVertexAttribArray(normShaderLocation);
		gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
		//glExt.vertexAttribDivisorANGLE(normShaderLocation, 0);

		// upload data for vertex colors
		gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, colArray, gl.STATIC_DRAW);

		let colShaderLocation = against.getAttribLocation("color");
		gl.enableVertexAttribArray(colShaderLocation);
		gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
		//glExt.vertexAttribDivisorANGLE(colShaderLocation, 0);

		return new CompiledMesh(posBuffer, posShaderLocation, normBuffer, normShaderLocation, colBuffer, colShaderLocation, this.triangles.length * 3);
	}

}

class CompiledMesh {

	posBuffer: WebGLBuffer;
	normBuffer: WebGLBuffer;
	colBuffer: WebGLBuffer;

	posShaderLocation: number;
	normShaderLocation: number;
	colShaderLocation: number;

	numVertices: number;

	constructor(posBuffer: WebGLBuffer, posShaderLocation, normBuffer: WebGLBuffer, normShaderLocation, colBuffer: WebGLBuffer, colShaderLocation, numVertices) {
		this.posBuffer = posBuffer;
		this.normBuffer = normBuffer;
		this.colBuffer = colBuffer;
		this.posShaderLocation = posShaderLocation;
		this.normShaderLocation = normShaderLocation;
		this.colShaderLocation = colShaderLocation;
		this.numVertices = numVertices;
	}

	private bindBuffers(gl: WebGLRenderingContext) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
		gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colBuffer);
		gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
	}

	drawInstanced(gl: WebGLRenderingContext, count: number) {
		this.bindBuffers(gl);
		let gll: any = gl as any;
		gll.drawArraysInstanced(gl.TRIANGLES, 0, this.numVertices, count);
	}

	draw(gl: WebGLRenderingContext) {
		this.bindBuffers(gl);
		let gll: any = gl as any;
		//gll.drawArraysInstanced(gl.TRIANGLES, 0, this.numVertices, 1);
		gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
	}

}

export { Vertex, Mesh, CompiledMesh };