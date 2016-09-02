let vertSource = `

attribute vec3 position;

void main(void) {
    gl_Position = vec4(position, 1.0);
}

`

let fragSource = `

precision mediump float;

uniform sampler2D textureSampler;

uniform vec2 screenSize;

void main(void) {
    vec2 uv = vec2(gl_FragCoord.x / screenSize.x, gl_FragCoord.y / screenSize.y);
    vec4 t = texture2D(textureSampler, uv);
    gl_FragColor = vec4(vec3(t), 1);
}

`

export { vertSource, fragSource }