class SandSimulation {

  constructor(width, height) {
    this.SAND = 1;
    this.LIFE = 2;
    this.sandColor = "#FFD700";
    this.lifeColor = "#00FF00";
    this.width = width;
    this.height = height;
    this.grid = Array.from({ length: height }, () => Array(width).fill(0));
    // Add any necessary setup for fluid simulation here
  }

  addParticle(x, y, particleType) {
    this.grid[y][x] = particleType;
  }

  update() {
    // Add the fluid simulation update logic here

    let newGrid = this.grid.map((row) => row.slice());

    for (let y = this.height - 1; y >= 0; y--) {
      for (let x = 0; x < this.width; x++) {
        // Falling Sands logic
        if (this.grid[y][x] === this.SAND) {
          const newY = y + 1;

          if (newY < this.height && newGrid[newY][x] === 0) {
            newGrid[y][x] = 0;
            newGrid[newY][x] = this.SAND;
          }
        }

        // Conway's Game of Life logic
        const neighbors = this.getNeighbors(x, y);
        const liveNeighbors = neighbors.filter((n) => n === this.LIFE).length;

        if (this.grid[y][x] === this.LIFE) {
          if (liveNeighbors < 2 || liveNeighbors > 3) {
            newGrid[y][x] = 0;
          }
        } else {
          if (liveNeighbors === 3) {
            newGrid[y][x] = this.LIFE;
          }
        }
      }
    }

    this.grid = newGrid;
  }

  getNeighbors(x, y) {
    const neighbors = [];

    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      for (let xOffset = -1; xOffset <= 1; xOffset++) {
        if (yOffset === 0 && xOffset === 0) {
          continue;
        }

        const newY = y + yOffset;
        const newX = x + xOffset;

        if (newY >= 0 && newY < this.height && newX >= 0 && newX < this.width) {
          neighbors.push(this.grid[newY][newX]);
        }
      }
    }

    return neighbors;
  }

  render(p, gridSize) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x] === this.SAND) {
          p.fill(sandColor);
          p.rect(x * gridSize, y * gridSize, gridSize, gridSize);
        } else if (this.grid[y][x] === this.LIFE) {
          p.fill(lifeColor);
          p.rect(x * gridSize, y * gridSize, gridSize, gridSize);
        }
      }
    }
  }

}

export default SandSimulation;
