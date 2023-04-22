uniform float uLightPointStrength;

varying vec3 vColor;

void main() {
  // Disc pattern (sharp circle)
  // // get the distance between gl_PointCoord and the center (circle in a square)
  // float strength = distance(gl_PointCoord, vec2(0.5));
  // // apply a step function to get 0.0 if the distance is below 0.5 and 1.0 if the distance is above 0.5 (sharpens the circle)
  // strength = step(0.5, strength);
  // // invert the value (removes the square bg and makes the circle the bg)
  // strength = 1.0 - strength;

  // Diffuse point (smooth circle, faded edges, more natural)
  // float strength = distance(gl_PointCoord, vec2(0.5));
  // // multiply by 2.0 so it reaches 1.0 before touching the edge
  // strength *= 2.0;
  // strength = 1.0 - strength;

  // Light point pattern (huge concentration of light in the center, and it fades way faster)
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength;
  strength *= pow(strength, uLightPointStrength);

  // Final color
  vec3 color = mix(vec3(0.0), vColor, strength);

  gl_FragColor = vec4(color, 1.0);
}