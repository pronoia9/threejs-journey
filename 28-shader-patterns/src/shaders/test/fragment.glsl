#define PI 3.14159265359

varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
vec2 fade(vec2 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float cnoise(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x, gy.x);
    vec2 g10 = vec2(gx.y, gy.y);
    vec2 g01 = vec2(gx.z, gy.z);
    vec2 g11 = vec2(gx.w, gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 *
        vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main() {
    float x = vUv.x;
    float y = vUv.y;
    float strength = 0.0;

    // pattern #1: blue, cyan, pink gradient
    gl_FragColor = vec4(x, y, 1.0, 1.0);

    // pattern #2: black, green, yellow, red gradient
    gl_FragColor = vec4(vUv, 0, 1.0);

    // pattern #2.5: blue, green, yellow, red gradient ❤️
    gl_FragColor = vec4(vUv, 0, 1.0);

    // pattern #3: black to white (left to right) gradient
    gl_FragColor = vec4(x, x, x, 1.0);

    // pattern #4: black to white (bottom to top) gradient
    gl_FragColor = vec4(y, y, y, 1.0);

    // pattern #5: black to white (top to bottom) gradient
    strength = 1.0 - y;

    // pattern #6: black (VERY small) to white (bottom to top) gradient
    strength = y * 10.0;

    // pattern #7: multiple black-white gradients (like shutters)
    strength = mod(y * 10.0, 1.0);

    // pattern #8: like #7 but no gradient, just white and black
    // strength = strength < 0.5 ? 0.0 : 1.0;
    strength = step(0.5, mod(y * 10.0, 1.0));

    // pattern #9: like #8 but inverted colors
    strength = step(0.8, mod(y * 10.0, 1.0));

    // pattern #10: like #9 but inverted axis
    strength = step(0.8, mod(x * 10.0, 1.0));

    // pattern #11: like a grid with no left or bottom lines
    strength = step(0.8, mod(x * 10.0, 1.0)) + step(0.8, mod(y * 10.0, 1.0));

    // pattern #12: just dots, like a grid with no lines except a dot where they intersect
    strength = step(0.8, mod(x * 10.0, 1.0)) * step(0.8, mod(y * 10.0, 1.0));

    // pattern #13: like #12 but dots are like short lines
    strength = step(0.8, mod(y * 10.0, 1.0)) - step(0.5, mod(x * 10.0, 1.0));
    strength = step(0.5, mod(x * 10.0, 1.0)) * step(0.8, mod(y * 10.0, 1.0));

    // pattern #14:
    float barX = step(0.4, mod(x * 10.0, 1.0)) * step(0.8, mod(y * 10.0, 1.0));
    float barY = step(0.8, mod(x * 10.0, 1.0)) * step(0.4, mod(y * 10.0, 1.0));
    strength = barX + barY;

    // pattern #14.5: #14 but faces the other way 
    strength = step(0.5, mod(x * 10.0, 1.0)) * step(0.5, mod(y * 10.0, 1.0)) - 
        step(0.65, mod(x * 10.0, 1.0)) * step(0.65, mod(y * 10.0, 1.0));

    // pattern #15: like dots but dots are plus
    barX = step(0.4, mod(x * 10.0, 1.0)) * step(0.8, mod(y * 10.0 + 0.2, 1.0));
    barY = step(0.8, mod(x * 10.0 + 0.2, 1.0)) * step(0.4, mod(y * 10.0, 1.0));
    strength = barX + barY;

    // pattern #16: gradient again! gray on the sides and a small vertical black middle
    strength = abs(x - 0.5);

    // pattern #17: like #16 but also a horizontal black line + diagonal (x4) lighter lines
    strength = min(abs(x - 0.5), abs(y - 0.5));

    // pattern #18: like #17 but inverted
    strength = max(abs(x - 0.5), abs(y - 0.5));


    // pattern #19: white background and a small black square in the middle
    strength = step(0.2, max(abs(x - 0.5), abs(y - 0.5)));

    // pattern #20: like #19 but a bigger black square
    float square1 = step(0.2, max(abs(x - 0.5), abs(y - 0.5))), square2 = 1.0 - step(0.25, max(abs(x - 0.5), abs(y - 0.5)));
    strength = square1 * square2;

    // pattern #20.5: like #20 but a bigger object
    strength = step(0.4, max(abs(x - 0.5), abs(y - 0.5)));

    // pattern #21: color palette (from black to white, left to right, vertial lines)
    strength = floor(x * 10.0) / 10.0;

    // pattern #22: like #21 but squares instead of whole lines (black (bottom left) to white (top right))
    strength = floor(x * 10.0) / 10.0 * floor(y * 10.0) / 10.0;

    // pattern #23: static screen, like old tv
    strength = random(vUv);

    // pattern #24: like static but MUCH bigger suqares/pixels-like (using #22 formulas)
    vec2 gridUv = vec2(floor(x * 10.0) / 10.0, floor(y * 10.0) / 10.0);
    strength = random(gridUv);

    // pattern #25: #24 but offset
    gridUv = vec2(floor(x * 10.0) / 10.0, floor((y + x * 0.5) * 10.0) / 10.0);
    gridUv = vec2(floor(x * 10.0) / 10.0, floor(y * 10.0 + x * 5.0) / 10.0);
    strength = random(gridUv); 

    // pattern #26: white with a black bottom left corner (spot)
    strength = length(vUv);

    // pattern #27:black spot on the center
    strength = length(vUv - 0.5);
    strength = distance(vUv, vec2(0.5));

    // pattern #28: white spot in the center this time (gray background)
    strength = 1.0 - length(vUv - 0.5);
    strength = 1.0 - distance(vUv, vec2(0.5));

    // pattern #29: black-ish background + tiny sharp white spot in the center (pearl) ❤️
    strength = 0.02 / distance(vUv, vec2(0.5));

    // clear white circle in the middle of complete blackness
    strength = step(0.5, 1.0 - distance(vUv, vec2(0.5)) * 10.0);

    // pattern #30: like #29 but stretched horizontally
    vec2 lightUv = vec2(x * 0.1 + 0.45, y * 0.5 + 0.25);
    strength = 0.015 / distance(lightUv, vec2(0.5));
    lightUv = vec2(x, (y - 0.5) * 5.0 + 0.5);
    strength = 0.15 / distance(lightUv, vec2(0.5));

    // pattern #31: a star?
    vec2 lightUvX = vec2(x * 0.1 + 0.45, y * 0.5 + 0.25);
    float lightX = 0.015 / distance(lightUvX, vec2(0.5));
    vec2 lightUvY = vec2(y * 0.1 + 0.45, x * 0.5 + 0.25);
    float lightY = 0.015 / distance(lightUvY, vec2(0.5));
    strength = lightX * lightY;

    // pattern #32: #31 star but rotated
    vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));
    lightUvX = vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25);
    lightX = 0.015 / distance(lightUvX, vec2(0.5));
    lightUvY = vec2(rotatedUv.y * 0.1 + 0.45, rotatedUv.x * 0.5 + 0.25);
    lightY = 0.015 / distance(lightUvY, vec2(0.5));
    strength = lightX * lightY;

    // pattern #33: white background + black sharp circle in center
    strength = step(0.25, distance(vUv, vec2(0.5)));

    // pattern #34: gray background + black circle + gray circle inside black circle (centered)
    strength = abs(distance(vUv, vec2(0.5)) - 0.25);

    // pattern #35: white background and black circle outline in the middle
    strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // pattern #36: opposite of #35 (inverted colors)
    strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // pattern #37: like #36 but a warped circle
    vec2 wavedUv = vec2(x, y + sin(x * 30.0) * 0.1);
    strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    // pattern #38: like one of those weird shapes shrinks ask you what it is
    wavedUv = vec2(x + sin(y * 30.0) * 0.1, y + sin(x * 30.0) * 0.1);
    strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    // pattern #39: kinda like the kree things in agents of shield but not really
    wavedUv = vec2(x + sin(y * 100.0) * 0.1, y + sin(x * 100.0) * 0.1);
    strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    // pattern #40: ANGLES! white bg and an angled black from left side but its more gradient going up
    float angle = atan(x, y);
    strength = angle;

    // pattern #41: same as #40 but starting from center
    angle = atan(x - 0.5, y - 0.5);
    strength = angle;

    // pattern #42: #41 + the left side is not pitch black
    angle /= PI * 2.0;
    angle += 0.5;
    strength = angle;

    // pattern #43: psychedelic something
    angle *= 20.0;
    angle = mod(angle, 1.0);
    strength = angle;

    // pattern #44: same as #43 but sharper color change and inverted?
    angle = atan(x - 0.5, y - 0.5) / (PI * 2.0) + 0.5;
    strength = sin(angle * 100.0);

    // pattern #45: like a cookie cutter, wavy circle (circle from #36)
    float sinusoid = sin((atan(x - 0.5, y - 0.5) / (PI * 2.0) + 0.5) * 100.0);
    float radius = 0.25 + sinusoid * 0.02;
    strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

    // pattern #46: whats this shape? idk... watercolor? clouds? its a... perlin noise!
    strength = cnoise(vUv * 10.0);

    // pattern #47: more perlin noise!
    strength = step(0.0, cnoise(vUv * 10.0));

    // pattern #48: more perlin noise! shiny!!
    strength = 1.0 - abs(cnoise(vUv * 10.0));

    // pattern #49: more perlin noise!
    strength = sin(cnoise(vUv * 10.0) * 20.0);

    // pattern #50: more perlin noise!!!!
    strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

    // limit strength to stay between 0.0 and 1.0
    strength = clamp(strength, 0.0, 1.0);

    // Black/White version
    gl_FragColor = vec4(strength, strength, strength, 1.0);

    // COLOR VERSION!!!
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 1.0);
    // vec3 uvColor = vec3(vUv, 0.5);
    vec3 mixedColor = mix(blackColor, uvColor, strength);

    
    gl_FragColor = vec4(mixedColor, 1.0);
}