import {
  Universe,
  Cell
} from "game-of-life";
import {
  memory
} from "game-of-life/game_of_life_bg";

const CELL_SIZE = 5; // px
const CELL_SIZE_ = CELL_SIZE + 1;
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

// Construct the universe, and get its width and height
const universe = Universe.new();
const width = universe.width();
const height = universe.height();

// Get 2D context of our sized canvas DOM object
const canvas = document.getElementById("game-of-life-canvas");
// Give the canvas room for all of our cells and a 1px border around each of them.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = CELL_SIZE_ * height + 1;
canvas.width = CELL_SIZE_ * width + 1;

const ctx = canvas.getContext('2d');

const fps = new class {
  constructor() {
    this.fps = document.getElementById("fps");
    this.frames = [];
    this.lastFrameTimeStamp = performance.now();
  }

  render() {
    // Convert the delta time since the last frame render into a measure
    // of frames per second.
    const now = performance.now();
    const delta = now - this.lastFrameTimeStamp;
    this.lastFrameTimeStamp = now;
    const fps = 1 / delta * 1000;

    // Save only the latest 100 timings.
    this.frames.push(fps);
    if (this.frames.length > 100) {
      this.frames.shift();
    }

    // Find the max, min, and mean of our 100 latest timings.
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    for (let i = 0; i < this.frames.length; i++) {
      sum += this.frames[i];
      min = Math.min(this.frames[i], min);
      max = Math.max(this.frames[i], max);
    }
    let mean = sum / this.frames.length;

    // Render the statistics.
    this.fps.textContent = `
Frames per Second:
         latest = ${Math.round(fps)}
avg of last 100 = ${Math.round(mean)}
min of last 100 = ${Math.round(min)}
max of last 100 = ${Math.round(max)}
`.trim();
  }
};

let animationId = null;

const renderLoop = () => {
  fps.render();

  drawGrid();
  drawCells();

  for (let i = 0; i < 9; i++) {
    universe.tick();
  }

  animationId = requestAnimationFrame(renderLoop);
};

// Draw equal-distant overlapping vertical and horizontal lines to create the grid overlay
const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;
  
    // Define constant coordinates
    const x_begin = 0;
    const x_end = CELL_SIZE_ * width + 1;

    const y_begin = 0;
    const y_end = CELL_SIZE_ * height + 1;
    
    // Draw vertical lines
    for (let i = 0; i <= width; i++) {
        const X = i * CELL_SIZE_ + 1;
        ctx.moveTo(X, y_begin);
        ctx.lineTo(X, y_end);
    }
  
    // Draw horizontal lines
    for (let j = 0; j <= height; j++) {
        const Y = j * CELL_SIZE_ + 1;
        ctx.moveTo(x_begin, Y);
        ctx.lineTo(x_end, Y);
    }
  
    ctx.stroke();
};

const renderLoop = () => {
    universe.tick();

    drawGrid();
    drawCells();

    requestAnimationFrame(renderLoop);
}

// Start loop
requestAnimationFrame(renderLoop);