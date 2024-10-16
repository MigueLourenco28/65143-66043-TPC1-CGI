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
// Saves the truth value of the points being shown 
var showPoints = true;
// Saves the truth value of the curves being shown
var showCurves = true;
// Save the default amount of segments that a simple curve (troço) has
var nSegments = 5.0;
// Save the default speed of the curve
var defSpeed = 0.01;
// Adjustable speed additive to the default one
var varSpeed = 0.001;
// Save the index of the curve being drawn
var currentCurve = 0;
// Array that stores the control points of the current curve
var controlPoints = [];
// Matrix: Array that stores the array of points of each curve
var curvePoints = [];
// Matrix: Array that stores the array of speeds of each points of each 
// curve in the corresponding index
var curveSpeeds = [];

// Task 7 : Array of indexes of the control points of a curve
var xpto = new Uint32Array(MAX_SIZE);
// Task 7 : Initialize xpto
for (let i = 0; i < MAX_SIZE; i++) {
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

    function get_pos_from_mouse_event(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / canvas.width * 2 - 1;
        const y = -((event.clientY - rect.top) / canvas.height * 2 - 1);

        return vec2(x, y);
    }

    // Handle resize events 
    window.addEventListener("resize", (event) => {
        resize(event.target);
    });

    // Command interpreter for every function available
    window.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "z":
                curvePoints[currentCurve] = controlPoints;
                // Initialize the speeds when z is pressed
                let rand = Math.random()*0.01;
                curveSpeeds[currentCurve] = controlPoints.map(() => vec2(defSpeed+rand, defSpeed+rand));
                currentCurve++;
                controlPoints = [];
                console.log("z key pressed");
                break;
            case "c":
                // Implement the clear command
                curvePoints = [];
                controlPoints = [];
                currentCurve = 0;
                console.log("c key pressed");
                break;
            case "+":
                // Implement the increase segments command
                if (nSegments < 100)    
                    nSegments++;
                gl.uniform1fv(u_segments, nSegments);
                console.log(nSegments + " segments");
                console.log("+ key pressed");
                break;
            case "-":
                // Implement the lower segments command
                if(nSegments > 1)
                    nSegments--;
                gl.uniform1fv(u_segments, nSegments);
                console.log(nSegments + " segments");
                console.log("- key pressed");
                break;
            case ">":
                // Implement speed up command
                console.log("> key pressed");
                varSpeed = Math.min(0.002, varSpeed+0.0001);
                break;
            case "<":
                // Implement slow down command
                console.log("< key pressed");
                varSpeed = Math.max(0.0001, varSpeed-0.0001);
                break;
            case " ":
                // Implement the pause/play command
                if(paused)
                    paused = false;
                else
                    paused = true;
                console.log("space key pressed");
                break;
            case "p":
                // Implement the show/hide control points command
                if(showPoints)    
                    showPoints = false;
                else
                    showPoints = true;
                console.log("p key pressed");
                break;
            case "l":
                // Implement the show/hide curves command
                if(showCurves)    
                    showCurves = false;
                else
                    showCurves = true;
                console.log("l key pressed");
                break;
            default:
                break;
        }
    });

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
            curvePoints[currentCurve] = controlPoints; // Add control point to curve
        }
    });

    // Handle mouse up events
    window.addEventListener("mouseup", (event) => {
        if(mouseDown && moved) { // If the mouse was pressed down and moved its a free drawn curve
            let rand = Math.random()*0.01;
            // Initialize the speeds when the curve being drawn has finished
            curveSpeeds[currentCurve] = curvePoints[currentCurve].map(() => vec2(defSpeed+rand, defSpeed+rand));
            controlPoints = []; // Clear the control points of the current curve
            currentCurve++; // advance to the next curve set to be drawn
        } else { // Else we have a control point
            console.log("Control point");
        }
        mouseDown = false;
        moved = false;
    });

    // Bind vertex buffer to a_index attribute in shader.vert
    gl.vertexAttribPointer(a_index, 1, gl.UNSIGNED_INT, false, 0, 0);
    gl.enableVertexAttribArray(a_index);

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

    gl.clear(gl.COLOR_BUFFER_BIT);

    if (last_time === undefined) {
        last_time = timestamp;
    }
    // Elapsed time (in miliseconds) since last time here
    const elapsed = timestamp - last_time;

    gl.useProgram(draw_program);

    for (let i = 0; i < curvePoints.length; i++) { // Go through each curve
        if(curvePoints[i].length >= 4) { // We need 4 points on the curve to be able to draw a simple curve
            for (let j = 0; j < curvePoints[i].length; j++) { // Go through each point on the curve
                // Calculate the sample point with the control points inserted by sending to the vertex shader
                let samplePoint = gl.getUniformLocation(draw_program, "uControlPoints[" + j + "]");
                // Receive the sample point
                gl.uniform2fv(samplePoint, curvePoints[i][j]);
                // Implement the curve movement
                if (!paused && curveSpeeds[i]) { // Check if it's paused and if the speeds have been initialized
                    // Apply velocities to each point
                    for (let j = 0; j < curvePoints[i].length; j++) {
                        // Update the point with the corresponding speed
                        curvePoints[i][j][0] += curveSpeeds[i][j][0] * elapsed * varSpeed; // Update on x
                        curvePoints[i][j][1] += curveSpeeds[i][j][1] * elapsed * varSpeed; // Update on y
                
                        // Checks when the point reaches the canvas border, inverting the speed
                        if (curvePoints[i][j][0] > 1 || curvePoints[i][j][0] < -1) {
                            curveSpeeds[i][j][0] *= -1; // Invert the direction on x
                        }
                        if (curvePoints[i][j][1] > 1 || curvePoints[i][j][1] < -1) {
                            curveSpeeds[i][j][1] *= -1; // Invert the direction on y
                        }
                    }
                }
            }
            if(showCurves) 
                // Draw each line
                gl.drawArrays(gl.LINE_STRIP, 0, nSegments * (curvePoints[i].length - 3));
            if(showPoints)    
                // Draw each point
                gl.drawArrays(gl.POINT, 0, nSegments * (curvePoints[i].length - 3));
        }
    }

    last_time = timestamp;
}

loadShadersFromURLS(["shader.vert", "shader.frag"]).then(shaders => setup(shaders))