#version 300 es

const uint MAX_CONTROL_POINTS = 256u;

// Task 5: Declare an array of uniforms of the type vec2 with capacity of MAX_CONTROL_POINTS
uniform vec2 uControlPoints[MAX_CONTROL_POINTS];

uniform uint u_segments; // Number os segments per simple curve
uniform uint u_points; // Number of points 
in uint a_index; // 

// Calculate a simple B-Spline curve with 4 control points
vec2 calculate_curve(vec2 p0, vec2 p1, vec2 p2, vec2 p3, float t) {
    float t2 = t * t; // t squared
    float t3 = t * t * t; // t cubed
    return (p0 * (-t3 + 3.0f * t2 - 3.0f * t + 1.0f) + // B0(t) = (−t3 + 3t2 −3t+ 1) / 6
        p1 * (3.0f * t3 - 6.0f * t2 + 3.0f * t) + // B1(t) = (3t3 −6t2 + 4) / 6
        p2 * (-3.0f * t3 + 3.0f * t2) + // B2(t) = (−3t3 + 3t2 + 3t+ 1) / 6
        p3 * (t3)) / 6.0; // B3(t) = t3 / 6
}

void main() {
    int index = int(a_index);

    // Calculate 
    int troco = index / int(u_segments) * 3; //

    // Since vec2 is a pair of floats, every value from now on has to be
    // a float to be able to calculate
    float t = float(index % int(u_segments)) / float(u_segments);

    gl_PointSize = 2.0f;  // Size of the point

    // Get the next 4 control points to form the curve
    vec2 p0 = uControlPoints[troco];
    vec2 p1 = uControlPoints[(troco + 1)];
    vec2 p2 = uControlPoints[(troco + 2)];
    vec2 p3 = uControlPoints[(troco + 3)];

    gl_Position = vec4(calculate_curve(p0, p1, p2, p3, t), 0, 1);
}