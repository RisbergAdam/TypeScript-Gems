import { Shader } from "./Shader";

class Matrix {

    array: Float32Array = new Float32Array(4*4);
    op: Float32Array = new Float32Array(4*4);
    opMult: Float32Array = new Float32Array(4*4);

    constructor() {
        this.identity();
    }

    identity() {
        this.identityArray(this.array);
    }

    scale(x, y, z) {
        this.array[0*4 + 0] *= x;
		this.array[1*4 + 1] *= y;
		this.array[2*4 + 2] *= z;
    }

    translate(x, y, z) {
        this.identityArray(this.op);
		this.op[3*4 + 0] = x;
		this.op[3*4 + 1] = y;
		this.op[3*4 + 2] = z;
		this.multiply(this.array, this.op, this.array);
    }

    rotate(angle, x, y, z) {
        this.identityArray(this.op);
        
		let sin = Math.sin(angle);
        let cos = Math.cos(angle);
        let invCos = 1.0 - cos;
        let op = this.op;
		
		op[0*4 + 0] = cos+x*x*invCos;
		op[1*4 + 0] = x*y*invCos-z*sin;
		op[2*4 + 0] = x*z*invCos+y*sin;
		
		op[0*4 + 1] = x*y*invCos+z*sin;
		op[1*4 + 1] = cos+y*y*invCos; 
		op[2*4 + 1] = y*z*invCos-x*sin;
		
		op[0*4 + 2] = x*z*invCos-y*sin;
		op[1*4 + 2] = y*z*invCos+x*sin;
		op[2*4 + 2] = cos+z*z*invCos;
		
		this.multiply(this.array, op, this.array);
    }

    perspective(fieldOfView, aspectRatio, nearPlane, farPlane) {
        let op = this.op;
        op.fill(0);

		let borderVert =  Math.tan(fieldOfView/2.0) * nearPlane;
		let borderHori = borderVert * aspectRatio;
		let frustumLength = farPlane - nearPlane;
		
		op[0+4*0] = nearPlane/borderHori;
		op[1+4*1] = nearPlane/borderVert;
		op[2+4*2] = -(farPlane+nearPlane)/frustumLength;
		op[3+4*2] = -1.0;
		op[2+4*3] = -2.0*(farPlane*nearPlane)/frustumLength;

		this.multiply(this.array, op, this.array);
    }

    upload(gl: WebGLRenderingContext, shaderVariable: string, shader: Shader) {
        let shaderLocation = shader.getUniformLocation(shaderVariable);
        console.log("shader location: " + shaderLocation as string);
        gl.uniformMatrix4fv(shaderLocation, false, this.array);
    }

    private identityArray(array: Float32Array) {
		for (var i = 0; i < 4*4; i++) {
			array[i] = i % 5 == 0 ? 1 : 0;
		}
	}


    private multiply(source1: Float32Array, source2: Float32Array, destination: Float32Array) {
		this.opMult.fill(0);
		
		for (var y = 0;y < 4;y++) {
			for (var x = 0;x < 4;x++) {
				for (var e = 0;e < 4;e++) {
					this.opMult[y*4 + x] += source1[e*4 + x] * source2[y*4 + e];
				}
			}
		}
		
		for (var i = 0;i < 4*4;i++) {
			destination[i] = this.opMult[i];
		}
	}
    

}

export { Matrix }; 