import SandSimulation from "./sand_simulation.js";

const sketch = (p) => {
  let gridWidth;
  let gridHeight;
  let gridSize = 5;
  let sandSim;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    gridWidth = Math.floor(p.width / gridSize);
    gridHeight = Math.floor(p.height / gridSize);
    sandSim = new SandSimulation(gridWidth, gridHeight);
  };

  p.draw = () => {
    p.background(0);

    if (p.mouseIsPressed) {
      const x = Math.floor(p.mouseX / gridSize);
      const y = Math.floor(p.mouseY / gridSize);
      sandSim.addParticle(x, y);
    }

    sandSim.update();
    sandSim.render(p, gridSize);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    gridWidth = Math.floor(p.width / gridSize);
    gridHeight = Math.floor(p.height / gridSize);
    sandSim = new SandSimulation(gridWidth, gridHeight);
  };
};

new p5(sketch);
