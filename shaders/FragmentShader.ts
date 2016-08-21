let source = `#version 300 es

precision mediump float;

in vec4 vColor;
in vec4 vNormal;
in vec3 vPosition;
in vec3 center;

out vec4 fColor;

float calcSpecular(vec3 ligth) {
    vec3 norm = vec3(vNormal);
    vec3 camera = normalize(vPosition);
    vec3 ligthReflected = reflect(ligth, norm);

    float diffuse = max(0.0, dot(norm, ligth));
    float specular = min(1.0, pow(max(0.0, dot(ligthReflected, camera)), 300.0) * 10.0);
    return specular * 0.3 + diffuse * 0.04;
}

void main(void) {
    float spec1 = calcSpecular(normalize(vec3(0.0, -1.0, 0.2)));
    float spec2 = calcSpecular(normalize(vec3(-0.5, 0.3, 0.2)));
    float spec3 = calcSpecular(normalize(vec3(0.5, 0.3, 0.2)));

    float dist = distance(center, vPosition);
    float heat = pow(1.0 / (dist + 1.0) * 1.2, 10.0) * 5.0;

    vec3 surfaceToCenter = normalize(center - vPosition);
    vec3 cameraToSurface = normalize(vPosition);
    vec3 negNormal = vec3(vNormal) * -1.0;
    cameraToSurface = cameraToSurface * 0.5 + negNormal * 0.5;

    float heat2 = pow(max(0.0, dot(surfaceToCenter, cameraToSurface)) * 0.6, 4.0) + heat * 0.2;

    float specular = spec1 + spec2 + spec3 + 0.005;

    //fColor = vec4(specular + heat2, specular + heat2 * 0.4, specular + heat2 * 0.1, 1.0);
    fColor = vec4(specular + heat2 * vColor.r, specular + heat2 * vColor.g, specular + heat2 * vColor.b, 1.0);
}

`

export { source }