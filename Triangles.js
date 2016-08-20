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
define("glPort/Model", ["require", "exports"], function (require, exports) {
    "use strict";
    var Vertex = (function () {
        function Vertex(pos, color) {
            this.pos = pos;
            this.color = color;
        }
        return Vertex;
    }());
    exports.Vertex = Vertex;
    var Model = (function () {
        function Model(data) {
            this.data = data;
        }
        Model.prototype.compile = function (gl, shader) {
            var posArray = new Float32Array(this.data.length * 2);
            var colArray = new Float32Array(this.data.length * 3);
            for (var i = 0; i < this.data.length; i++) {
                posArray[i * 2 + 0] = this.data[i].pos[0];
                posArray[i * 2 + 1] = this.data[i].pos[1];
                colArray[i * 3 + 0] = this.data[i].color[0];
                colArray[i * 3 + 1] = this.data[i].color[1];
                colArray[i * 3 + 2] = this.data[i].color[2];
            }
            var posBuffer = gl.createBuffer();
            var colBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, posArray, gl.STATIC_DRAW);
            var posShaderLocation = shader.getAttribLocation("vertex");
            gl.enableVertexAttribArray(posShaderLocation);
            gl.vertexAttribPointer(posShaderLocation, 2, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, colArray, gl.STATIC_DRAW);
            var colShaderLocation = shader.getAttribLocation("color");
            gl.enableVertexAttribArray(colShaderLocation);
            gl.vertexAttribPointer(colShaderLocation, 3, gl.FLOAT, false, 0, 0);
            return new CompiledModel(posBuffer, posShaderLocation, colBuffer, colShaderLocation, this.data.length);
        };
        return Model;
    }());
    exports.Model = Model;
    var CompiledModel = (function () {
        function CompiledModel(posBuffer, posShaderLocation, colBuffer, colShaderLocation, numVertices) {
            this.posBuffer = posBuffer;
            this.colBuffer = colBuffer;
            this.posShaderLocation = posShaderLocation;
            this.colShaderLocation = colShaderLocation;
            this.numVertices = numVertices;
        }
        CompiledModel.prototype.draw = function (gl) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            gl.vertexAttribPointer(this.posShaderLocation, 2, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colBuffer);
            gl.vertexAttribPointer(this.colShaderLocation, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
        };
        return CompiledModel;
    }());
    exports.CompiledModel = CompiledModel;
});
define("glPort/Graphics", ["require", "exports"], function (require, exports) {
    "use strict";
    var Graphics = (function () {
        function Graphics(gl, shader) {
            this.gl = gl;
            this.shader = shader;
        }
        Graphics.prototype.init = function () {
            console.log("graphics.init()");
            var gl = this.gl;
            gl.enable(gl.DEPTH_TEST);
            gl.clearDepth(500.0);
            gl.disable(gl.DEPTH_TEST);
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.viewport(0, 0, 800, 350);
            this.shader.compile();
            this.shader.use();
        };
        Graphics.prototype.begin = function () {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        };
        Graphics.prototype.render = function (model, x, y, angle, r, g, b) {
            this.gl.uniform3f(this.shader.getUniformLocation("position"), x, y, angle);
            this.gl.uniform3f(this.shader.getUniformLocation("baseColor"), r, g, b);
            model.draw(this.gl);
        };
        Graphics.prototype.end = function () {
        };
        return Graphics;
    }());
    exports.Graphics = Graphics;
});
define("Animated", ["require", "exports"], function (require, exports) {
    "use strict";
    var Animated = (function () {
        function Animated(xStart, yStart, model) {
            this.ticker = 0;
            this.xStart = xStart;
            this.yStart = yStart;
            this.model = model;
        }
        Animated.prototype.tick = function (graphics) {
            var offset = this.calc(this.xStart, this.yStart);
            var dist = this.dist(this.xStart, this.yStart);
            var d = this.density(this.xStart, this.yStart, 10);
            var c = 1.0 - dist * 0.01 - 0.5 - (10.0 - d) / 5.0;
            graphics.render(this.model, offset[0], offset[1], this.ticker * dist * 0.005, c, c, c);
            this.ticker += 0.08;
        };
        Animated.prototype.hypot = function (_a, _b) {
            var x1 = _a[0], y1 = _a[1];
            var x2 = _b[0], y2 = _b[1];
            var x = x1 - x2;
            var y = y1 - y2;
            return Math.sqrt(x * x + y * y);
        };
        Animated.prototype.density = function (x, y, rangle) {
            var s0 = this.calc(x, y);
            var s1 = this.calc(x + rangle, y);
            var s2 = this.calc(x, y + rangle);
            var s3 = this.calc(x - rangle, y);
            var s4 = this.calc(x, y - rangle);
            var d = this.hypot(s0, s1) + this.hypot(s0, s2) + this.hypot(s0, s3) + this.hypot(s0, s4);
            return d / 4.0;
        };
        Animated.prototype.dist = function (x, y) {
            return Math.sqrt(x * x + y * y) * 0.05;
        };
        Animated.prototype.calc = function (x, y) {
            var dist = this.dist(x, y);
            var xAdd = Math.sin(this.ticker + dist * 0.1) * 5.0 * dist;
            var yAdd = Math.cos(this.ticker + dist * 0.1) * 5.0 * dist;
            return [x + xAdd, y + yAdd];
        };
        return Animated;
    }());
    exports.Animated = Animated;
});
define("Triangles", ["require", "exports", "glPort/Graphics", "glPort/Shader", "Animated", "glPort/Model"], function (require, exports, Graphics_1, Shader_1, Animated_1, Model_1) {
    "use strict";
    var vertexSource = "\n    attribute vec2 vertex;\n    attribute vec3 color;\n\n    uniform vec3 position;\n    uniform vec3 baseColor;\n\n    varying vec4 vColor;\n\n    float atan2(in float y, in float x) {\n        bool s = (abs(x) > abs(y));\n        return mix(3.141589/2.0 - atan(x,y), atan(y,x), float(s));\n    }\n\n    void main(void) {\n        float angle = atan2(vertex.x, vertex.y) + position.z;\n        float length = length(vertex);\n\n        gl_Position = vec4(sin(angle) * length + position.x, cos(angle) * length + position.y, 0.0, 1.0);\n        gl_Position.x = gl_Position.x * 1.0/800.0;\n        gl_Position.y = gl_Position.y * 1.0/350.0;\n        vColor = vec4(color + baseColor, 1.0);\n    }\n";
    var fragmentSource = "\n    precision mediump float;\n\n    varying vec4 vColor;\n\n    void main(void) {\n        gl_FragColor = vColor;\n    }\n";
    var gl;
    var graphics;
    var shader;
    //let anim: Animated = new Animated(0.5, 0.5);
    var anims = [80, 35];
    var spacing = 50.0;
    var scale = 40;
    var anim = new Array(anims[0]);
    function startGL() {
        var canvas = document.getElementById("glCanvas");
        gl = canvas.getContext("webgl");
        shader = new Shader_1.Shader(gl, vertexSource, fragmentSource);
        graphics = new Graphics_1.Graphics(gl, shader);
        graphics.init();
        var triangleData = [new Model_1.Vertex([0.0, 0.5 * scale], [0.0, 0.0, 0.0]),
            new Model_1.Vertex([-0.5 * scale, -0.5 * scale], [0.0, 0.0, 0.0]),
            new Model_1.Vertex([0.5 * scale, -0.5 * scale], [0.0, 0.0, 0.0])];
        var triangle = new Model_1.Model(triangleData).compile(gl, shader);
        for (var x = 0; x < anims[0]; x++) {
            anim[x] = new Array(anims[1]);
            for (var y = 0; y < anims[1]; y++) {
                anim[x][y] = new Animated_1.Animated((x - anims[0] / 2.0) * spacing, (y - anims[1] / 2.0) * spacing, triangle);
            }
        }
    }
    function draw() {
        graphics.begin();
        for (var x = 0; x < anims[0]; x++) {
            for (var y = 0; y < anims[1]; y++) {
                anim[x][y].tick(graphics);
            }
        }
        graphics.end();
        setTimeout(draw, 20);
    }
    startGL();
    draw();
});
