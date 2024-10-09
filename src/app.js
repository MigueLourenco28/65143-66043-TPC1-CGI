import { buildProgramFromSources, loadShadersFromURLS, setupWebGL } from "../../libs/utils.js";
import { vec2 } from "../../libs/MV.js";

var gl;
var canvas;
var aspect;

var draw_program;

// Tarefa 7
const xpto = Array.from({ length: 60000 }, (_, i) => i);

// Task 4: Save the coordinates of the mouse when the user clicks with it
const controlPoints = [];

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
    /**
     * Task 2
     * TODO: What does the resize() do?
     */
    window.addEventListener("resize", (event) => {
        resize(event.target);
    });

    function get_pos_from_mouse_event(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / canvas.width * 2 - 1;
        const y = -((event.clientY - rect.top) / canvas.height * 2 - 1);

        return vec2(x, y);
    }

    // Save the amount of segments that a simple curve has
    let nSegments = 6;

    let defSpeed = 2;

    // Command interpreter for every function available
    window.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "z":
                // TODO: Implement the complete curve command: empty the controlPoints array
                controlPoints.length = 0;
                console.log("z key pressed");
                break;
            case "c":
                // TODO: Implement the clear command
                controlPoints.length = 0;
                console.log("c key pressed");
                break;
            case "+":
                // TODO: Implement the increase segments command
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
                // TODO: Implement  speed up command
                console.log("> key pressed");
                break;
            case "<":
                // TODO: Implement slow down command
                console.log("< key pressed");
                break;
            case " ":
                // TODO: Implement the pause/play command
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
            case "r":
                // TODO: Implement the resize browser window command
                resize(event.target);
                console.log("r key pressed");
                break;
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
            // Draw a free curve until mouseup event
            console.log("Mouse moved");
        }
        // TODO: mark the coordinates of the point per frame that the mouse is in
    });

    // Save the coordinates of the mouse up point
    var v_finish;
    // Handle mouse up events
    window.addEventListener("mouseup", (event) => {
        if(mouseDown && !moved) // If the mouse was pressed down but didn't move then we have a control point
            controlPoints.push(v_start);
        else { // Else we have a free curve being drawn and v_finish is the last sampling point
            v_finish = get_pos_from_mouse_event(canvas, event);
            // Print the mouseup input position
            console.log(`Mouse up at position: (${v_finish[0]}, ${v_finish[1]})`);
        }
        mouseDown = false;
        moved = false;
    });

    // Task 7
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint32Array(xpto), gl.STATIC_DRAW);

    /**
     * TODO: if the user presses the key "Z" on the keyboard
    */
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

    /**
    // Draw the curve with control points if there are enough
    if (controlPoints.length >= 4) {
        let numPoints = nSegments * (controlPoints.length - 3) + 1;
        if (numPoints > xpto.length) {
            numPoints = xpto.length;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribIPointer(indexLoc, 1, gl.UNSIGNED_INT, 0, 0);
        gl.enableVertexAttribArray(indexLoc);

        // Desenhar os pontos
        gl.drawArrays(gl.POINTS, 0, numPoints);

        gl.disableVertexAttribArray(indexLoc);
    }
    */

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(draw_program);

    gl.useProgram(null);

    last_time = timestamp;
}
// Delay the animation so that the movement of the mouse draws dots spaced out
setInterval(animate, 100);

loadShadersFromURLS(["shader.vert", "shader.frag"]).then(shaders => setup(shaders))