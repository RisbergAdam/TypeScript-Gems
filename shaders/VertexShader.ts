let source = `#version 300 es

layout(location=0) in vec3 position;
layout(location=1) in vec3 normal;
layout(location=2) in vec3 color;

uniform int isInstance;
uniform mat4 ModelInstance[100];

uniform mat4 Model;
uniform mat4 ProjectionView;

out vec4 vColor;

void main(void) {
    if (isInstance == 0) {
        gl_Position = ProjectionView * Model * vec4(position, 1.0);
        vColor = ProjectionView * Model * vec4(normal, 1.0);
    } else {
        gl_Position = ProjectionView * ModelInstance[gl_InstanceID] * vec4(position, 1.0);
        vColor = ProjectionView * Model * vec4(normal, 1.0);
    }
}

`

export { source };