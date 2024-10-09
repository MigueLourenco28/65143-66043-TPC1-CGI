#version 300 es

const uint MAX_CONTROL_POINTS = 256u;

uniform uint u_segments; // Number os segments per simple curve
uniform uint u_points; // Number of points 
in uint a_idx; // index of the first point in the segment array?

// Task 5: Declare an array of uniforms of the type vec2 with capacity of MAX_CONTROL_POINTS
uniform vec2 controlPoints[MAX_CONTROL_POINTS];

void main() {
    gl_Position = controlPoints[a_idx % u_points];
}

/**
for each curve {
    for each control point pi {
        get uniform location of p1
        send uniform pi
    }
    get uniform location of segments
    send uniform segments
    bind vertex array
    gl.drawArrays(gl.POINTS, 0, (N-3)*S + 1)
    unbind vertex array
}
*/