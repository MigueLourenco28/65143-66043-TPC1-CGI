import { buildProgramFromSources, loadShadersFromURLS, setupWebGL } from "../libs/utils.js";
import { vec2 } from "../libs/MV.js";

// Size of xpto
const MAX_SIZE = 60000;


var gl;
var canvas;
var aspect;

var draw_program;

// Saves the truth value of the curves being stationary 
var paused = false;
// Save the default amount of segments that a simple curve (troço) has
var nSegments = 6.0;
// Save the default speed of the curve
var defSpeed = 0.01;
// Save the index of the curve being drawn
var currentCurve = 0;
// Array that stores the control points of the current curve
var controlPoints = [];
// Matrix: Array that stores the array of points of each curve
var curvePoints = [];
// Matrix: Array that stores the array of speeds of each points of each curve
var curveSpeeds = [];

// Task 7 : Array of indexes of the control points of a curve
var xpto = new Uint32Array(MAX_SIZE);
// Task 7 : Initialize xpto
for (var i = 0; i < MAX_SIZE; i++) {
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
    
    // Get the attribute location for "a_index" attribute
    const a_index = gl.getAttribLocation(draw_program, "a_index");
    gl.useProgram(draw_program);
    // Get the attribute location for "u_segments" attribute
    const u_segments = gl.getUniformLocation(draw_program, "u_segments");
    gl.uniform1f(u_segments, nSegments); // send the number os segments to the shader

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
        controlPoints.push(get_pos_from_mouse_event(canvas, event));
        curvePoints[currentCurve] = controlPoints; // Add control point to curve
    });

    // Handle mouse move events and prints if its triggered
    window.addEventListener("mousemove", (event) => {
        if(mouseDown) {
            moved = true;
            controlPoints.push(get_pos_from_mouse_event(canvas, event));
            currentCurve[currentCurve] = controlPoints; // Add control point to curve
            // TODO: Handle the speeds of the current curve
            console.log("Drawing free curve");
        }
    })

    // Save the coordinates of the mouse up point
    var v_finish;
    // Handle mouse up events
    window.addEventListener("mouseup", (event) => {
        if(mouseDown && moved) { // If the mouse was pressed down and moved its a free drawn curve
            // TODO: atribute each point a different speed
            controlPoints = []; // Clear the control points of the current curve
            // TODO: clear speeds
            currentCurve++; // advance to the next curve set to be drawn
        } else { // Else we have a control point
            console.log("Control point: (${get_pos_from_mouse_event(canvas, event)[0]}, ${get_pos_from_mouse_event(canvas, event)[1]})");
        }
        mouseDown = false;
        moved = false;
    })

    // Bind vertex buffer to a_index attribute in shader.vert
    gl.vertexAttribPointer(a_index, 1, gl.UNSIGNED_INT, false, 0, 0);
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

    for (let i = 0; i < curvePoints.length; i++) { // Go through each curve
        if(curvePoints[i].length >= 4) { // We need 4 points on the curve to be able to draw a simple curve
            for (let j = 0; j < curvePoints[i].length; j++) { // Go through each point on the curve
                // Calculate the sample point with the control points inserted by sending to the vertex shader
                let samplePoints = gl.getUniformLocation(draw_program, "uControlPoints[" + j + "]");
                // Receive the sample points
                gl.uniform2fv(samplePoints, curvePoints[i][j]);
                // TODO: Implement the curve movement
            }
            gl.drawArrays(gl.LINE_STRIP, 0, segNum * Math.floor((curvePoints[i].length - 1) / 3));
            gl.drawArrays(gl.POINT, 0, segNum * Math.floor((curvePoints[i].length - 1) / 3));
        }
    }

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

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(draw_program);

    last_time = timestamp;
}

loadShadersFromURLS(["shader.vert", "shader.frag"]).then(shaders => setup(shaders))