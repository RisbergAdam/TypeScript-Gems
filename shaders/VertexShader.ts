let source = `#version 300 es

layout(location=0) in vec3 position;
layout(location=1) in vec3 normal;
layout(location=2) in vec3 color;

uniform int isInstance;
uniform mat4 ModelInstance[100];

uniform mat4 Model;
uniform mat4 ProjectionView;

out vec4 vColor;
out vec4 vNormal;
out vec3 vPosition;
out vec3 center;

void main(void) {
    if (isInstance == 0) {
        gl_Position = ProjectionView * Model * vec4(position, 1.0);
        vNormal = transpose(inverse(Model)) * vec4(normal, 1.0);
        center = vec3(Model[3]);
        vPosition = vec3(Model * vec4(position, 1.0));
    } else {
        gl_Position = ProjectionView * ModelInstance[gl_InstanceID] * vec4(position, 1.0);
        vNormal =  transpose(inverse(ModelInstance[gl_InstanceID])) * vec4(normal, 1.0);
        center = vec3(ModelInstance[gl_InstanceID][3]);
        vPosition = vec3(ModelInstance[gl_InstanceID] * vec4(position, 1.0));
    }

    vColor = vec4(color, 1.0);
}

`

export { source };