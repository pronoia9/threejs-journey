uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main() {
  // Position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Spin
  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  // calculate offset angle
  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
  // add angleoffset to the base angle
  angle += angleOffset;
  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;
  // add randomness
  modelPosition.xyz += aRandomness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;

  // Size
  gl_PointSize = uSize * aScale;
  gl_PointSize *= (1.0 / -viewPosition.z);

  vColor = color;
}