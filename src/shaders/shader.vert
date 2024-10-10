#version 300 es

const uint MAX_CONTROL_POINTS = 256u;

//gl_PointSize = ;

// Task 5: Declare an array of uniforms of the type vec2 with capacity of MAX_CONTROL_POINTS
uniform vec2 controlPoints[MAX_CONTROL_POINTS];

uniform uint u_segments; // Number os segments per simple curve
uniform uint u_points; // Number of points 
in uint a_idx; // index of the first point in the segment array

void main() {
    gl_Position = vec4(controlPoints[a_idx % u_points], 0, 1);
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