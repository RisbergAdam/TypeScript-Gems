let source = `

attribute vec3 position;
attribute vec3 normal;
attribute vec3 color;

uniform mat4 Model;
uniform mat4 ProjectionView;

varying vec4 vColor;

void main(void) {
    gl_Position = ProjectionView * Model * vec4(position, 1.0);
    vColor = ProjectionView * Model * vec4(normal, 1.0);
}

`

export { source };