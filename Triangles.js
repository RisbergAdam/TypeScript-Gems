define("glPort/Shader", ["require", "exports"], function (require, exports) {
    "use strict";
    var Shader = (function () {
        function Shader(gl, vertexShader, fragmentShader) {
            this.gl = gl;
            this.vertexShader = vertexShader;
            this.fragmentShader = fragmentShader;
        }
        Shader.prototype.compile = function () {
            console.log("shader.compile()");
            var gl = this.gl;
            this.programId = gl.createProgram();
            var vertId = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertId, this.vertexShader);
            gl.compileShader(vertId);
            if (gl.getShaderParameter(vertId, gl.COMPILE_STATUS) != 1) {
                console.error("ERROR: could not compile vertex shader, log:");
                console.error(gl.getShaderInfoLog(vertId));
                return false;
            }
            var fragId = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragId, this.fragmentShader);
            gl.compileShader(fragId);
            if (gl.getShaderParameter(fragId, gl.COMPILE_STATUS) != 1) {
                console.error("ERROR: could not compile fragment shader, log:");
                console.error(gl.getShaderInfoLog(fragId));
                return false;
            }
            gl.attachShader(this.programId, vertId);
            gl.attachShader(this.programId, fragId);
            gl.linkProgram(this.programId);
            return true;
        };
        Shader.prototype.use = function () {
            this.gl.useProgram(this.programId);
        };
        Shader.prototype.getUniformLocation = function (name) {
            return this.gl.getUniformLocation(this.programId, name);
        };
        Shader.prototype.getAttribLocation = function (name) {
            return this.gl.getAttribLocation(this.programId, name);
        };
        return Shader;
    }());
    exports.Shader = Shader;
});
define("glPort/Mesh", ["require", "exports"], function (require, exports) {
    "use strict";
    var Vertex = (function () {
        function Vertex(pos, norm, color) {
            this.pos = pos;
            this.norm = norm;
            this.color = color;
        }
        return Vertex;
    }());
    exports.Vertex = Vertex;
    var Mesh = (function () {
        function Mesh(data) {
            this.data = data;
        }
        Mesh.prototype.compile = function (gl, against) {
            var posArray = new Float32Array(this.data.length * 3);
            var normArray = new Float32Array(this.data.length * 3);
            var colArray = new Float32Array(this.data.length * 3);
            for (var i = 0; i < this.data.length; i++) {
                posArray[i * 3 + 0] = this.data[i].pos[0];
                posArray[i * 3 + 1] = this.data[i].pos[1];
                posArray[i * 3 + 2] = this.data[i].pos[2];
                normArray[i * 3 + 0] = this.data[i].norm[0];
                normArray[i * 3 + 1] = this.data[i].norm[1];
                normArray[i * 3 + 2] = this.data[i].norm[2];
                colArray[i * 3 + 0] = this.data[i].color[0];
                colArray[i * 3 + 1] = this.data[i].color[1];
                colArray[i * 3 + 2] = this.data[i].color[2];
            }
            var posBuffer = gl.createBuffer();
            var normBuffer = gl.createBuffer();
            var colBuffer = gl.createBuffer();
            // upload data for vertex positions
            gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, posArray, gl.STATIC_DRAW);
            var posShaderLocation = against.getAttribLocation("position");
            gl.enableVertexAttribArray(posShaderLocation);
            gl.vertexAttribPointer(posShaderLocation, 3, gl.FLOAT, false, 0, 0);
            // upload data for vertex positions
            gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, normArray, gl.STATIC_DRAW);
            var normShaderLocation = against.getAttribLocation("normal");
            gl.enableVertexAttribArray(normShaderLocation);
            gl.vertexAttribPointer(normShaderLocation, 3, gl.FLOAT, false, 0, 0);
            // upload data for vertex colors
            gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, colArray, gl.STATIC_DRAW);
            var colShaderLocation = against.getAttribLocation("color");
            gl.enableVertexAttribArray(colShaderLocation);
            gl.vertexAttribPointer(colShaderLocation, 3, gl.FLOAT, false, 0, 0);
            return new CompiledMesh(posBuffer, posShaderLocation, normBuffer, normShaderLocation, colBuffer, colShaderLocation, this.data.length);
        };
        return Mesh;
    }());
    exports.Mesh = Mesh;
    var CompiledMesh = (function () {
        function CompiledMesh(posBuffer, posShaderLocation, normBuffer, normShaderLocation, colBuffer, colShaderLocation, numVertices) {
            this.posBuffer = posBuffer;
            this.normBuffer = normBuffer;
            this.colBuffer = colBuffer;
            this.posShaderLocation = posShaderLocation;
            this.normShaderLocation = normShaderLocation;
            this.colShaderLocation = colShaderLocation;
            this.numVertices = numVertices;
        }
        CompiledMesh.prototype.draw = function (gl) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            gl.vertexAttribPointer(this.posShaderLocation, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
            gl.vertexAttribPointer(this.normShaderLocation, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colBuffer);
            gl.vertexAttribPointer(this.colShaderLocation, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
        };
        return CompiledMesh;
    }());
    exports.CompiledMesh = CompiledMesh;
});
define("glPort/Matrix", ["require", "exports"], function (require, exports) {
    "use strict";
    var Matrix = (function () {
        function Matrix() {
            this.array = new Float32Array(4 * 4);
            this.op = new Float32Array(4 * 4);
            this.opMult = new Float32Array(4 * 4);
            this.identity();
        }
        Matrix.prototype.identity = function () {
            this.identityArray(this.array);
        };
        Matrix.prototype.scale = function (x, y, z) {
            this.array[0 * 4 + 0] *= x;
            this.array[1 * 4 + 1] *= y;
            this.array[2 * 4 + 2] *= z;
        };
        Matrix.prototype.translate = function (x, y, z) {
            this.identityArray(this.op);
            this.op[3 * 4 + 0] = x;
            this.op[3 * 4 + 1] = y;
            this.op[3 * 4 + 2] = z;
            this.multiply(this.array, this.op, this.array);
        };
        Matrix.prototype.rotate = function (angle, x, y, z) {
            this.identityArray(this.op);
            var sin = Math.sin(angle);
            var cos = Math.cos(angle);
            var invCos = 1.0 - cos;
            var op = this.op;
            op[0 * 4 + 0] = cos + x * x * invCos;
            op[1 * 4 + 0] = x * y * invCos - z * sin;
            op[2 * 4 + 0] = x * z * invCos + y * sin;
            op[0 * 4 + 1] = x * y * invCos + z * sin;
            op[1 * 4 + 1] = cos + y * y * invCos;
            op[2 * 4 + 1] = y * z * invCos - x * sin;
            op[0 * 4 + 2] = x * z * invCos - y * sin;
            op[1 * 4 + 2] = y * z * invCos + x * sin;
            op[2 * 4 + 2] = cos + z * z * invCos;
            this.multiply(this.array, op, this.array);
        };
        Matrix.prototype.perspective = function (fieldOfView, aspectRatio, nearPlane, farPlane) {
            var op = this.op;
            op.fill(0);
            var borderVert = Math.tan(fieldOfView / 2.0) * nearPlane;
            var borderHori = borderVert * aspectRatio;
            var frustumLength = farPlane - nearPlane;
            op[0 + 4 * 0] = nearPlane / borderHori;
            op[1 + 4 * 1] = nearPlane / borderVert;
            op[2 + 4 * 2] = -(farPlane + nearPlane) / frustumLength;
            op[3 + 4 * 2] = -1.0;
            op[2 + 4 * 3] = -2.0 * (farPlane * nearPlane) / frustumLength;
            this.multiply(this.array, op, this.array);
        };
        Matrix.prototype.upload = function (gl, shaderVariable, shader) {
            var shaderLocation = shader.getUniformLocation(shaderVariable);
            console.log("shader location: " + shaderLocation);
            gl.uniformMatrix4fv(shaderLocation, false, this.array);
        };
        Matrix.prototype.identityArray = function (array) {
            for (var i = 0; i < 4 * 4; i++) {
                array[i] = i % 5 == 0 ? 1 : 0;
            }
        };
        Matrix.prototype.multiply = function (source1, source2, destination) {
            this.opMult.fill(0);
            for (var y = 0; y < 4; y++) {
                for (var x = 0; x < 4; x++) {
                    for (var e = 0; e < 4; e++) {
                        this.opMult[y * 4 + x] += source1[e * 4 + x] * source2[y * 4 + e];
                    }
                }
            }
            for (var i = 0; i < 4 * 4; i++) {
                destination[i] = this.opMult[i];
            }
        };
        return Matrix;
    }());
    exports.Matrix = Matrix;
});
define("glPort/Model", ["require", "exports", "glPort/Matrix"], function (require, exports, Matrix_1) {
    "use strict";
    var Model = (function () {
        function Model(mesh, position, rotation) {
            this.matrix = new Matrix_1.Matrix();
            this.mesh = mesh;
            this.position = position;
            this.rotation = rotation;
        }
        Model.prototype.getPosition = function () {
            return this.position;
        };
        Model.prototype.getRotation = function () {
            return this.rotation;
        };
        Model.prototype.getMatrix = function () {
            var matrix = this.matrix;
            matrix.identity();
            matrix.translate(this.position[0], this.position[1], this.position[2]);
            matrix.rotate(this.rotation[2], 0, 0, 1);
            matrix.rotate(this.rotation[1], 0, 1, 0);
            matrix.rotate(this.rotation[0], 1, 0, 0);
            return matrix;
        };
        return Model;
    }());
    exports.Model = Model;
});
define("glPort/Graphics", ["require", "exports", "glPort/Matrix"], function (require, exports, Matrix_2) {
    "use strict";
    var Graphics = (function () {
        function Graphics(gl, shader, width, height) {
            this.gl = gl;
            this.shader = shader;
            this.width = width;
            this.height = height;
            this.projectionView = new Matrix_2.Matrix();
            this.projectionView.perspective(Math.PI / 2.0 * 0.5, width / height, 0.1, 100.0);
            this.projectionView.rotate(3.14159, 1, 0, 0);
        }
        Graphics.prototype.init = function () {
            console.log("graphics.init()");
            var gl = this.gl;
            gl.enable(gl.DEPTH_TEST);
            gl.clearDepth(500.0);
            gl.disable(gl.DEPTH_TEST);
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.viewport(0, 0, this.width, this.height);
            this.shader.compile();
            this.shader.use();
        };
        Graphics.prototype.begin = function () {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.projectionView.upload(this.gl, "ProjectionView", this.shader);
        };
        Graphics.prototype.draw = function (model) {
            model.getMatrix().upload(this.gl, "Model", this.shader);
            model.mesh.draw(this.gl);
        };
        Graphics.prototype.end = function () {
        };
        return Graphics;
    }());
    exports.Graphics = Graphics;
});
define("shaders/VertexShader", ["require", "exports"], function (require, exports) {
    "use strict";
    var source = "\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec3 color;\n\nuniform mat4 Model;\nuniform mat4 ProjectionView;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n    gl_Position = ProjectionView * Model * vec4(position, 1.0);\n    vColor = vec4(color, 1.0);\n}\n\n";
    exports.source = source;
});
define("shaders/FragmentShader", ["require", "exports"], function (require, exports) {
    "use strict";
    var source = "\n\nprecision mediump float;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n    gl_FragColor = vColor;\n}\n\n";
    exports.source = source;
});
define("Triangles", ["require", "exports", "glPort/Graphics", "glPort/Shader", "glPort/Model", "glPort/Mesh", "shaders/VertexShader", "shaders/FragmentShader"], function (require, exports, Graphics_1, Shader_1, Model_1, Mesh_1, VertexShader_1, FragmentShader_1) {
    "use strict";
    var gl;
    var graphics;
    var shader;
    var model;
    function startGL() {
        var canvas = document.getElementById("glCanvas");
        gl = canvas.getContext("webgl");
        shader = new Shader_1.Shader(gl, VertexShader_1.source, FragmentShader_1.source);
        graphics = new Graphics_1.Graphics(gl, shader, canvas.width, canvas.height);
        graphics.init();
        var triangleData = [new Mesh_1.Vertex([0.0, -0.5, 0.0], [0.0, 0.0, 0.0], [1.0, 0.0, 0.0]),
            new Mesh_1.Vertex([-0.5, 0.5, 0.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]),
            new Mesh_1.Vertex([0.5, 0.5, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 1.0])];
        var mesh = new Mesh_1.Mesh(triangleData).compile(graphics.gl, graphics.shader);
        model = new Model_1.Model(mesh, [0, 0, 0], [0, 0, 0]);
        model.getPosition()[2] = 5.0;
    }
    function draw() {
        graphics.begin();
        graphics.draw(model);
        graphics.end();
        setTimeout(draw, 20);
    }
    startGL();
    draw();
});
