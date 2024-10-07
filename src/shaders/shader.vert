#version 300 es

in uint index;

// Task 5: MAX_CONTROL_POINTS = 256;

uniform float segments;

// Task 5: Declare an array of uniforms of the type vec2 with capacity of MAX_CONTROL_POINTS
// uniform vec2 controlPoints[MAX_CONTROL_POINTS];

void main() {
    gl_Position = vec4(0.0f, 0.0f, 0.0f, 1.0f);
    //vec2 interpolatedPosition = bezier(index, controlPoints, segments);  
}