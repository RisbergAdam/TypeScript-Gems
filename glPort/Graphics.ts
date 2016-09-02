import { Shader } from "./Shader";
import { Model } from "./Model";
import { CompiledMesh, Mesh, Vertex } from "./Mesh";
import { Matrix } from "./Matrix";
import { source as vertexSource } from "../shaders/VertexShader";
import { source as fragmentSource } from "../shaders/FragmentShader";
import { fragSource as screenFragSource, vertSource as screenVertSource } from "../shaders/ScreenShader";

class Graphics {

	gl: WebGLRenderingContext;
	shader: Shader;
	screenShader: Shader;

	width: number;
	height: number;

	projectionView: Matrix;

	renderOutput: WebGLRenderbuffer;
	outputTexture: WebGLTexture;

	screenMesh: CompiledMesh;

	constructor(gl: WebGLRenderingContext, width: number, height: number) {
		this.gl = gl;
		this.width = width;
		this.height = height;
		this.shader = new Shader(vertexSource, fragmentSource);
		this.screenShader = new Shader(screenVertSource, screenFragSource);

		this.projectionView = new Matrix();
		this.projectionView.perspective(Math.PI / 2.0 * 0.5, width/height, 0.1, 100.0);
		this.projectionView.rotate(3.14159, 1, 0, 0);
	}

	init() {
		console.log("graphics.init()");

		let gl = this.gl;
    	gl.enable(gl.DEPTH_TEST);  
    	gl.clearDepth(500.0);
   	 	gl.clearColor(0.0, 0.0, 0.0, 1.0);
    	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.viewport(0, 0, this.width, this.height);

		// initializer shaders
		this.shader.compile(this.gl);
		this.screenShader.compile(this.gl);
		this.shader.use();

		// create framebuffer
		this.renderOutput = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.renderOutput);

		// create depth for framebuffer
		let depthBuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

		// create texture for framebuffer
		this.outputTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.outputTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(this.width * this.height * 4));
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.outputTexture, 0);

		// create quad for screen
		let vertices: [Vertex, Vertex, Vertex][] = [
			[new Vertex([-1, -1, 0], [0, 0, 0], [0, 0, 0]),
			 new Vertex([1, -1, 0], [0, 0, 0], [0, 0, 0]),
			 new Vertex([1, 1, 0], [0, 0, 0], [0, 0, 0])],
			[new Vertex([-1, -1, 0], [0, 0, 0], [0, 0, 0]),
			 new Vertex([-1, 1, 0], [0, 0, 0], [0, 0, 0]),
			 new Vertex([1, 1, 0], [0, 0, 0], [0, 0, 0])]
		];
		this.screenMesh = new Mesh(vertices).compile(this.gl, this.screenShader);
	}

	begin() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.shader.use();
		this.projectionView.upload(this.gl, "ProjectionView", this.shader);
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.renderOutput);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.outputTexture);
	}

	end() {
		this.screenShader.use();
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.outputTexture);
		this.screenMesh.draw(this.gl);
	}

}

export { Graphics }