let vertSource = `#version 300 es

layout(location=0) in vec3 position;

void main(void) {
    gl_Position = vec4(position, 1.0);
}

`

let fragSource = `#version 300 es

precision mediump float;

uniform sampler2D textureSampler;
layout(location=0) out vec4 fColor;

void main(void) {
    vec2 uv = vec2(gl_FragCoord.x / 800.0, gl_FragCoord.y / 800.0);
    vec4 t = texture(textureSampler, uv);
    fColor = vec4(vec3(t), 1);
}

`

export { vertSource, fragSource }