import { buildProgramFromSources, loadShadersFromURLS, setupWebGL } from "../../libs/utils.js";
import { vec2 , flatten} from "../../libs/MV.js";

// Size of xpto
const BUFF_SIZE = 60000;


var gl;
var canvas;
var aspect;

var draw_program;

// Saves the truth value of the curves being stationary 
var paused = false;

// Save the default amount of segments that a simple curve (troço) has
var nSegments = 6.0;

// Save the default speed of the curve
var defSpeed = 2.0;

// Stores every curves that has been drawn
const completeCurves = [];
// Array that stores the control points of a curve
var controlPoints = [];
// Array that stores the points of a curve : sample points (pontos amostrais)
var curvePoints = [];
// Task 7 : Array of indexes of the control points of a curve
var xpto = new Uint32Array(BUFF_SIZE);

// Task 7 : Initialize xpto
for (var i = 0; i < BUFF_SIZE; i++) {
    xpto[i] = i;
}

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

    // Task 7 : Create buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint32Array(xpto), gl.STATIC_DRAW);

    // Handle resize events 
    window.addEventListener("resize", (event) => {
        resize(event.target);
    });

    // Get the attribute location for "a_index" attribute
    const a_index = gl.getAttribLocation(draw_program, "a_index");
    // Get the attribute location for "

    function get_pos_from_mouse_event(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / canvas.width * 2 - 1;
        const y = -((event.clientY - rect.top) / canvas.height * 2 - 1);

        return vec2(x, y);
    }

    // Command interpreter for every function available
    window.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "z":
                // TODO: Implement the complete curve command: empty the controlPoints array
                // 
                console.log("z key pressed");
                break;
            case "c":
                // TODO: Implement the clear command
                xpto.length = 0;
                console.log("c key pressed");
                break;
            case "+":
                // TODO: Implement the increase segments command
                if (nSegments < 100)    
                    nSegments++;
                console.log(nSegments + " segments");
                console.log("+ key pressed");
                break;
            case "-":
                // TODO: Implement the lower segments command
                if(nSegments > 1)
                    nSegments--;
                console.log(nSegments + " segments")
                console.log("- key pressed");
                break;
            case ">":
                // TODO: Implement speed up command
                console.log("> key pressed");
                break;
            case "<":
                // TODO: Implement slow down command
                console.log("< key pressed");
                break;
            case " ":
                // TODO: Implement the pause/play command
                if(paused)
                    paused = false;
                else
                    paused = true;
                console.log("space key pressed");
                break;
            case "p":
                // TODO: Implement the show/hide control points command
                console.log("p key pressed");
                break;
            case "l":
                // TODO: Implement the show/hide curves command
                console.log("l key pressed");
                break;
            // TODO: Implement the curve modes
            case "x":
                //TODO: Implement the bonus command zombie mode
                console.log("x key pressed");
                break;
            default:
                break;
        }
    });

    // Task 4: Save the coordinates of the mouse down point
    var v_start;
    let mouseDown = false;
    let moved = false;
    // Task 4: Handle mouse down events
    window.addEventListener("mousedown", (event) => {
        mouseDown = true;
        v_start = get_pos_from_mouse_event(canvas, event);
        // Print the mouses input position
        console.log(`Mouse down at position: (${v_start[0]}, ${v_start[1]})`);
    });

    // Handle mouse move events and prints if its triggered
    window.addEventListener("mousemove", (event) => {
        if(mouseDown) {
            moved = true;
            controlPoints.push(get_pos_from_mouse_event(canvas, event));
            // Draw a free curve until mouseup event
            console.log("Mouse moved");
        }
        // TODO: mark the coordinates of the point per frame that the mouse is in
    });

    // Save the coordinates of the mouse up point
    var v_finish;
    // Handle mouse up events
    window.addEventListener("mouseup", (event) => {
        if(mouseDown && !moved) { // If the mouse was pressed down but didn't move then we have a control point
            // Send control point to vertex shader and make the curve move
            controlPoints.push(v_start);
            console.log("Sending control points...");
        } else { // Else we have a free curve being drawn and v_finish is the last sampling point
            v_finish = get_pos_from_mouse_event(canvas, event);
            controlPoints.push(get_pos_from_mouse_event(canvas, event));
            
            // 

            // Print the mouseup input position
            console.log("Mouse up at position: (${v_finish[0]}, ${v_finish[1]})");
        }
        mouseDown = false;
        moved = false;
    });

    // Bind vertex buffer to 'position' (a_index) attribute in shader
    gl.vertexAtribPointer(a_index, 1, gl.UNSIGNED_INT, false, 0, 0);
    gl.enableVertexAttribArray(a_index);

    resize(window);

    gl.clearColor(0.0, 0.0, 0.0, 1);

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

    /**
    for each curve {
        for each control point pi {
            get uniform location of pi
            send uniform pi
        }
        get uniform location of segments
        send uniform segments
        bind vertex array
        gl.drawArrays(gl.POINTS, 0, (N-3)*S + 1)
        unbind vertex array
    }
    */



    last_time = timestamp;
}

loadShadersFromURLS(["shader.vert", "shader.frag"]).then(shaders => setup(shaders))