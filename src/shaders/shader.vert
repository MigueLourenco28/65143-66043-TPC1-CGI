#version 300 es

const uint MAX_CONTROL_POINTS = 256u;

// Task 5: Declare an array of uniforms of the type vec2 with capacity of MAX_CONTROL_POINTS
uniform vec2 controlPoints[MAX_CONTROL_POINTS];

uniform uint u_segments; // Number os segments per simple curve
uniform uint u_points; // Number of points 
in uint a_index; // index of the first point in the segment array

// Draw a Bezier with 4 control points
vec2 calculate_curve(vec p0, vec p1, vec p2, vec p3) {
    return vec2(0, 0, 0, 0);
}

void main() {
    gl_Position = calculate_curve();
    //gl_Position = vec4(controlPoints[a_idx % u_points], 0, 1);
    //gl_PointSize = 1.0; // Define the size of the point
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