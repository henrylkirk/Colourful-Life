let particles = [];
let grid;
let gridWidth;
let gridHeight;
let gridSize = 5;
let fluidSimulation;
let drawState;

const SAND = 1;
const LIFE = 2;
const sandColor = "#FFD700";
const lifeColor = "#00FF00";
const TOOL = {
  SAND: "sand",
  LIFE: "life",
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  gridWidth = Math.floor(width / gridSize);
  gridHeight = Math.floor(height / gridSize);
  grid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(0));

  // Set up fluid simulation
  fluidSimulation = new FluidSimulation({
    canvas: createGraphics(windowWidth, windowHeight),
    simulationSize: Math.min(gridWidth, gridHeight),
  });

  drawState = TOOL.SAND;
}

function draw() {
  background(0);

  // Update fluid simulation
  fluidSimulation.update();

  // Add a particle at the mouse position
  if (mouseIsPressed) {
    const x = Math.floor(mouseX / gridSize);
    const y = Math.floor(mouseY / gridSize);
    grid[y][x] = drawState === TOOL.SAND ? SAND : LIFE;
  }

  // Update particles
  particles.push(new Particle(mouseX, mouseY, random(2, 5)));
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isOffScreen()) {
      particles.splice(i, 1);
      i--;
    }
  }

  update();

  // Draw grid
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (grid[y][x] === SAND) {
        fill(sandColor);
        rect(x * gridSize, y * gridSize, gridSize, gridSize);
      } else if (grid[y][x] === LIFE) {
        fill(lifeColor);
        rect(x * gridSize, y * gridSize, gridSize, gridSize);
      }
    }
  }

  // Render fluid simulation
  image(fluidSimulation.canvas, 0, 0, windowWidth, windowHeight);
}

class Particle {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = r;
    this.lifespan = 255;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    this.lifespan -= 2;
  }

  display() {
    stroke(255, this.lifespan);
    strokeWeight(this.r);
    point(this.pos.x, this.pos.y);
  }

  isOffScreen() {
    return (
      this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  gridWidth = Math.floor(width / gridSize);
  gridHeight = Math.floor(height / gridSize);
  grid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(0));
}

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
