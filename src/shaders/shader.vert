#version 300 es

in uint index;

const int MAX_CONTROL_POINTS = 256;

// Number os segments per simple curve
uniform float segments;

// Task 5: Declare an array of uniforms of the type vec2 with capacity of MAX_CONTROL_POINTS
uniform vec2 controlPoints[MAX_CONTROL_POINTS];

void main() {
    gl_Position = vec4(0.0f, 0.0f, 0.0f, 1.0f);
}