let source = `

precision mediump float;

varying vec4 vColor;

void main(void) {
    gl_FragColor = vColor;
}

`

export { source }