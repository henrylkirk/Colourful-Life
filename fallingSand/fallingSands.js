const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 5;
const gridWidth = Math.floor(canvas.width / gridSize);
const gridHeight = Math.floor(canvas.height / gridSize);
let grid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(0));

const SAND = 1;
const LIFE = 2;
const sandColour = "#FFD700";
const lifeColour = "#00FF00";

const TOOL = { SAND: 1, LIFE: 2 };

let mouseDown = false;
let drawState = TOOL.SAND;

function getNeighbors(x, y) {
  const neighbors = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
        neighbors.push(grid[ny][nx]);
      }
    }
  }
  return neighbors;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (grid[y][x] === SAND) {
        ctx.fillStyle = sandColour;
        ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
      } else if (grid[y][x] === LIFE) {
        ctx.fillStyle = lifeColour;
        ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
      }
    }
  }
}

function update() {
  let newGrid = grid.map((row) => row.slice());

  for (let y = gridHeight - 1; y >= 0; y--) {
    for (let x = 0; x < gridWidth; x++) {
      // Falling Sands logic
      if (grid[y][x] === SAND) {
        if (y < gridHeight - 1 && grid[y + 1][x] === 0) {
          newGrid[y][x] = 0;
          newGrid[y + 1][x] = SAND;
        }
      }

      // Conway's Game of Life logic
      const neighbors = getNeighbors(x, y);
      const liveNeighbors = neighbors.filter((n) => n === LIFE).length;

      if (grid[y][x] === LIFE) {
        if (liveNeighbors < 2 || liveNeighbors > 3) {
          newGrid[y][x] = 0;
        }
      } else {
        if (liveNeighbors === 3) {
          newGrid[y][x] = LIFE;
        }
      }
    }
  }

  grid = newGrid;
}

function drawParticle(e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / gridSize);
    const y = Math.floor((e.clientY - rect.top) / gridSize);
    grid[y][x] = drawState;
}


function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

canvas.addEventListener("mouseup", () => {
  mouseDown = false;
});

// canvas.addEventListener("mousedown", (e) => {
//     mouseDown = true;
//     drawParticle(e);
// });

canvas.addEventListener("mousemove", (e) => {
    if (mouseDown) {
        drawParticle(e);
    }
});


canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / gridSize);
    const y = Math.floor((e.clientY - rect.top) / gridSize);
    grid[y][x] = drawState;
    drawParticle(e);
});


canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

const selectSandBtn = document.getElementById("selectSand");
const selectLifeBtn = document.getElementById("selectLife");

selectSandBtn.addEventListener("click", () => {
    drawState = TOOL.SAND;
    selectSandBtn.classList.add("active");
    selectLifeBtn.classList.remove("active");
});

selectLifeBtn.addEventListener("click", () => {
    drawState = TOOL.LIFE;
    selectSandBtn.classList.remove("active");
    selectLifeBtn.classList.add("active");
});



gameLoop();
