import { buildProgramFromSources, loadShadersFromURLS, setupWebGL } from "../../libs/utils.js";
import { vec2 } from "../../libs/MV.js";

var gl;
var canvas;
var aspect;

var draw_program;


/**
 * Resize event handler
 * 
 * @param {*} target - The window that has resized
 */
function resize(target) {
    // Aquire the new window dimensions
    const width = target.innerWidth;
    const height = target.innerHeight;

    // Set canvas size to occupy the entire window
    canvas.width = width;
    canvas.height = height;

    // Set the WebGL viewport to fill the canvas completely
    gl.viewport(0, 0, width, height);
}

function setup(shaders) {
    canvas = document.getElementById("gl-canvas");
    gl = setupWebGL(canvas, { alpha: true });

    // Create WebGL programs
    draw_program = buildProgramFromSources(gl, shaders["shader.vert"], shaders["shader.frag"]);


    // Enable Alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Handle resize events 
    window.addEventListener("resize", (event) => {
        resize(event.target);
    });

    function get_pos_from_mouse_event(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / canvas.width * 2 - 1;
        const y = -((event.clientY - rect.top) / canvas.height * 2 - 1);

        return vec2(x, y);
    }

    // Save the coordinates of the mouse down point
    var v_start;
    // Handle mouse down events
    window.addEventListener("mousedown", (event) => {
        v_start = get_pos_from_mouse_event(canvas, event);
        // Print the mouses input position
        console.log(`Mouse down at position: (${v_start[0]}, ${v_start[1]})`);
    });

    // Handle mouse move events and prints if its triggered
    window.addEventListener("mousemove", (event) => {
        console.log("Mouse moved");
    });

    // Save the coordinates of the mouse up point
    var v_finish;
    // Handle mouse up events
    window.addEventListener("mouseup", (event) => {
        v_finish = get_pos_from_mouse_event(canvas, event);
        // Print the mouses input position
        console.log(`Mouse up at position: (${v_finish[0]}, ${v_finish[1]})`);
    });

    resize(window);

    gl.clearColor(0.0, 0.0, 0.0, 1);

    // Enable Alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    window.requestAnimationFrame(animate);
}

let last_time;

function animate(timestamp) {
    window.requestAnimationFrame(animate);

    if (last_time === undefined) {
        last_time = timestamp;
    }
    // Elapsed time (in miliseconds) since last time here
    const elapsed = timestamp - last_time;


    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(draw_program);

    gl.useProgram(null);

    last_time = timestamp;
}
// Delay the animation so that the movement of the mouse draws dots spaced out
setInterval(animate, 100);

loadShadersFromURLS(["shader.vert", "shader.frag"]).then(shaders => setup(shaders))