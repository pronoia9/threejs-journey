uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;
attribute vec2 uv;
// attribute float aRandom;

varying vec2 vUv;
varying float vElevation;

// varying float vRandom;

void main() {
  // Combined
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

  // Separate
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // modelPosition.z += sin(modelPosition.x * 10.0) * 0.1; // make it wave-y like a flag
  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1; 
  // modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  // modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
  modelPosition.z += elevation;
  // modelPosition.z += aRandom * 0.1; // get spikes

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  // vRandom = aRandom;  // send aRandom to fragment
  vUv = uv;
  vElevation = elevation;
}