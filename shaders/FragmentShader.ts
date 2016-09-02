let source = `

precision mediump float;

varying vec4 vColor;
varying vec4 vNormal;
varying vec3 vPosition;
varying vec3 center;

uniform vec3 heatColor;
uniform int id;

float calcSpecular(vec3 ligth) {
    vec3 norm = normalize(vec3(vNormal));
    vec3 camera = normalize(vPosition);
    vec3 ligthReflected = reflect(ligth, norm);

    float diffuse = max(0.0, dot(norm, ligth));
    float specular = min(1.0, pow(max(0.0, dot(ligthReflected, camera)), 100.0) * 0.1);
    return specular + diffuse * 0.004;
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
    cameraToSurface = cameraToSurface * 0.8 + negNormal * 0.2;

    float heat2 = pow(max(0.0, dot(surfaceToCenter, cameraToSurface)) * 1.1, 6.0) + heat * 1.0;

    float specular = spec1 + spec2 + spec3 + spec4 + spec5 + spec6;

    float colorDim = 0.15;
    gl_FragColor = vec4(specular + heat2 * heatColor.r + heatColor.r * colorDim, 
                  specular + heat2 * heatColor.g + heatColor.g * colorDim, 
                  specular + heat2 * heatColor.b + heatColor.b * colorDim, 
                  float(id) / 255.0);
}

`

export { source }