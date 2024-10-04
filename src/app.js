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
    const v_start = null;
    // Handle mouse down events
    window.addEventListener("mousedown", (event) => {
        const p1 = get_pos_from_mouse_event(canvas, event);
        // Print the mouses input position
        console.log(`Mouse down at position: (${p1[0]}, ${p1[1]})`);
    });

    // True if the mouse moved
    var movement = false;
    // Handle mouse move events
    window.addEventListener("mousemove", (event) => {
        movement = true;
    });

    // Check if the mouse moved
    if(movement)
        console.log("Mouse moved")
    else 
        console.log("Mouse not moved");

    // Save the coordinates of the mouse up point
    const v_finish = null;
    // Handle mouse up events
    window.addEventListener("mouseup", (event) => {
        const p2 = get_pos_from_mouse_event(canvas, event);
        // Print the mouses input position
        console.log(`Mouse up at position: (${p2[0]}, ${p2[1]})`);
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

loadShadersFromURLS(["shader.vert", "shader.frag"]).then(shaders => setup(shaders))