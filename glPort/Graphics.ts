import { Shader } from "./Shader";
import { Model } from "./Model";
import { CompiledMesh } from "./Mesh";
import { Matrix } from "./Matrix";

class Graphics {

	gl: WebGLRenderingContext;
	shader: Shader;

	width: number;
	height: number;

	projectionView: Matrix;

	constructor(gl: WebGLRenderingContext, shader: Shader, width: number, height: number) {
		this.gl = gl;
		this.shader = shader;
		this.width = width;
		this.height = height;

		this.projectionView = new Matrix();
		this.projectionView.perspective(Math.PI / 2.0 * 0.5, width/height, 0.1, 100.0);
		this.projectionView.rotate(3.14159, 1, 0, 0);
	}

	init() {
		console.log("graphics.init()");

		let gl = this.gl;
    	gl.enable(gl.DEPTH_TEST);  
    	gl.clearDepth(500.0);
		gl.disable(gl.DEPTH_TEST);
   	 	gl.clearColor(0.0, 0.0, 0.0, 1.0);
    	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.viewport(0, 0, this.width, this.height);

		this.shader.compile();
		this.shader.use();
	}

	begin() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.projectionView.upload(this.gl, "ProjectionView", this.shader);
	}

	draw(model: Model) {
		model.getMatrix().upload(this.gl, "Model", this.shader);
		model.mesh.draw(this.gl);
	}

	end() {

	}

}

export { Graphics }