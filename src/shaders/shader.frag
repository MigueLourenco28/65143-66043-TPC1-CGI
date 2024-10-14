#version 300 es

precision mediump float;

out vec4 frag_color;

void main() {
    // Generate a value based on the fragment's coordinates
    float randomValue = mod(gl_FragCoord.x * 0.1 + gl_FragCoord.y * 0.1, 3.0);
    
    // Set frag_color based on the randomValue
    if (randomValue < 1.0) {
        frag_color = vec4(1.0, 0.0, 0.0, 1.0); // Red
    } else if (randomValue < 2.0) {
        frag_color = vec4(0.0, 1.0, 0.0, 1.0); // Green
    } else {
        frag_color = vec4(0.0, 0.0, 1.0, 1.0); // Blue
    }
}