class Shader {

	gl: WebGLRenderingContext;
	vertexShader: string;
	fragmentShader: string;
	programId: WebGLProgram;

	constructor(gl: WebGLRenderingContext, vertexShader: string, fragmentShader: string) {
		this.gl = gl;
		this.vertexShader = vertexShader;
		this.fragmentShader = fragmentShader;		
	}

	compile(): boolean {
		console.log("shader.compile()");

		let gl = this.gl;

		this.programId = gl.createProgram();

		let vertId = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertId, this.vertexShader);
		gl.compileShader(vertId);

		if (gl.getShaderParameter(vertId, gl.COMPILE_STATUS) != 1) {
			console.error("ERROR: could not compile vertex shader, log:")
			console.error(gl.getShaderInfoLog(vertId));
			return false;
		}

		let fragId = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragId, this.fragmentShader);
		gl.compileShader(fragId);

		if (gl.getShaderParameter(fragId, gl.COMPILE_STATUS) != 1) {
			console.error("ERROR: could not compile fragment shader, log:")
			console.error(gl.getShaderInfoLog(fragId));
			return false;
		}

		gl.attachShader(this.programId, vertId);
		gl.attachShader(this.programId, fragId);
		gl.linkProgram(this.programId);

		return true;
	}

	use() {
		this.gl.useProgram(this.programId);
	}

	getUniformLocation(name: string): WebGLUniformLocation {
		return this.gl.getUniformLocation(this.programId, name);
	}

	getAttribLocation(name: string): number {
		return this.gl.getAttribLocation(this.programId, name);
	}

}

export { Shader }