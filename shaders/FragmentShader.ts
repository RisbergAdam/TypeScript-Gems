let source = `#version 300 es

precision mediump float;

in vec4 vColor;
in vec4 vNormal;
in vec3 vPosition;
in vec3 center;

uniform vec3 heatColor;

out vec4 fColor;

float calcSpecular(vec3 ligth) {
    vec3 norm = normalize(vec3(vNormal));
    vec3 camera = normalize(vPosition);
    vec3 ligthReflected = reflect(ligth, norm);

    float diffuse = max(0.0, dot(norm, ligth));
    float specular = min(1.0, pow(max(0.0, dot(ligthReflected, camera)), 100.0) * 0.08);
    return specular + diffuse * 0.005;
}

void main(void) {
    float spec1 = calcSpecular(normalize(vec3(1.0, 0.0, 0.8)));
    float spec2 = calcSpecular(normalize(vec3(0.86, 0.5, 0.8)));
    float spec3 = calcSpecular(normalize(vec3(-0.86, 0.5, 0.8)));
    float spec4 = calcSpecular(normalize(vec3(-1.0, 0.0, 0.8)));
    float spec5 = calcSpecular(normalize(vec3(0.86, -0.5, 0.8)));
    float spec6 = calcSpecular(normalize(vec3(-0.86, -0.5, 0.8)));

    spec1 += calcSpecular(normalize(vec3(1.0, 0.0, -0.8)));
    spec2 += calcSpecular(normalize(vec3(0.86, 0.5, -0.8)));
    spec3 += calcSpecular(normalize(vec3(-0.86, 0.5, -0.8)));
    spec4 += calcSpecular(normalize(vec3(-1.0, 0.0, -0.8)));
    spec5 += calcSpecular(normalize(vec3(0.86, -0.5, -0.8)));
    spec6 += calcSpecular(normalize(vec3(-0.86, -0.5, -0.8)));

    float dist = distance(center, vPosition);
    float heat = pow(1.0 / (dist + 1.0) * 1.2, 10.0) * 5.0;

    vec3 surfaceToCenter = normalize(center - vPosition);
    vec3 cameraToSurface = normalize(vPosition);
    vec3 negNormal = normalize(vec3(vNormal)) * -1.0;
    cameraToSurface = cameraToSurface * 0.5 + negNormal * 0.5;

    float heat2 = pow(max(0.0, dot(surfaceToCenter, cameraToSurface)) * 1.1, 5.0) + heat * 1.0;

    float specular = spec1 + spec2 + spec3 + spec4 + spec5 + spec6;

    //fColor = vec4(specular + heat2, specular + heat2 * 0.4, specular + heat2 * 0.1, 1.0);
    fColor = vec4(specular + heat2 * heatColor.r, specular + heat2 * heatColor.g, specular + heat2 * heatColor.b, 1.0);
}

`

export { source }