let source = `#version 300 es

precision mediump float;

in vec4 vColor;
in vec4 vNormal;
in vec4 vPosition;

out vec4 fColor;

float calcSpecular(vec3 ligth) {
    vec3 norm = vec3(vNormal);
    vec3 camera = normalize(vec3(vPosition));
    vec3 ligthReflected = reflect(ligth, norm);

    float diffuse = max(0.0, dot(norm, ligth));
    float specular = min(1.0, pow(max(0.0, dot(ligthReflected, camera)), 300.0) * 10.0);
    return specular * 0.3 + diffuse * 0.04;
}

void main(void) {
    float spec1 = calcSpecular(normalize(vec3(0.0, -1.0, 0.2)));
    float spec2 = calcSpecular(normalize(vec3(-0.5, 0.3, 0.2)));
    float spec3 = calcSpecular(normalize(vec3(0.5, 0.3, 0.2)));

    float specular = spec1 + spec2 + spec3 + 0.005;

    fColor = vec4(specular, specular, specular, 1.0);
}

`

export { source }