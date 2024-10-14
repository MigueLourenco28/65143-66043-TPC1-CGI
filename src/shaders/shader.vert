#version 300 es

const uint MAX_CONTROL_POINTS = 256u;

// Task 5: Declare an array of uniforms of the type vec2 with capacity of MAX_CONTROL_POINTS
uniform vec2 uControlPoints[MAX_CONTROL_POINTS];

uniform float u_segments; // Number os segments per simple curve
uniform float u_points; // Number of points 
in float a_index; // 

// Calculate a simple B-Spline curve with 4 control points
vec2 sample_point(vec2 p0, vec2 p1, vec2 p2, vec2 p3, float t) {
    return (p0 * (-t * t * t + 3.0 * t * t - 3.0 * t + 1.0) + // B0(t) = (−t3 + 3t2 −3t+ 1) / 6
        p1 * (3.0 * t * t * t - 6.0 * t * t + 4.0) + // B1(t) = (3t3 −6t2 + 4) / 6
        p2 * (-3.0 * t * t * t + 3.0 * t * t + 3.0 * t +1.0) + // B2(t) = (−3t3 + 3t2 + 3t+ 1) / 6
        p3 * (t * t * t)) / 6.0; // B3(t) = t3 / 6
}

void main() {
    int index = int(a_index);

    // Calculate 
    int troco = index / int(u_segments); //

    // Since vec2 is a pair of floats, every value from now on has to be
    // a float to be able to calculate
    float t = float(index % int(u_segments)) / float(u_segments);

    // Get the next 4 control points to form the curve
    vec2 cp0 = uControlPoints[troco];
    vec2 cp1 = uControlPoints[(troco + 1)];
    vec2 cp2 = uControlPoints[(troco + 2)];
    vec2 cp3 = uControlPoints[(troco + 3)];

    gl_PointSize = 3.0f;  // Size of the point
    // Return the resulting sample point
    gl_Position = vec4(sample_point(cp0, cp1, cp2, cp3, t), 0, 1);
}