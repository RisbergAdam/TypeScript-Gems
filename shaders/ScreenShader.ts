let vertSource = `

attribute vec3 position;

void main(void) {
    gl_Position = vec4(position, 1.0);
}

`

let fragSource = `

precision mediump float;

uniform sampler2D textureSampler;

void main(void) {
    vec2 uv = vec2(gl_FragCoord.x / 800.0, gl_FragCoord.y / 800.0);
    vec4 t = texture2D(textureSampler, uv);
    gl_FragColor = vec4(vec3(t), 1);
}

`

export { vertSource, fragSource }