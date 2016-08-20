import { Shader } from "./Shader";
import { Model, CompiledModel, Vertex } from "./Model";

class Graphics {

	gl: WebGLRenderingContext;
	posBuffer: WebGLBuffer;
	shader: Shader

	constructor(gl: WebGLRenderingContext, shader: Shader) {
		this.gl = gl;
		this.shader = shader;
	}

	init() {
		console.log("graphics.init()");

		let gl = this.gl;
    gl.enable(gl.DEPTH_TEST);  
    gl.clearDepth(500.0);
		gl.disable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.viewport(0, 0, 800, 350);

		this.shader.compile();
		this.shader.use();
	}

	begin() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}

	render(model: CompiledModel, x: number, y: number, angle: number, r, g, b) {
		this.gl.uniform3f(this.shader.getUniformLocation("position"), x, y, angle);
		this.gl.uniform3f(this.shader.getUniformLocation("baseColor"), r, g, b);
		model.draw(this.gl);
	}

	end() {

	}

}

export { Graphics }