function generateRandomCircles(numCircles, gridSize = 1280) {
  const circles = [];
  const cappedNumCircles = Math.min(numCircles, 1000);

  for (let i = 0; i < cappedNumCircles; i++) {
    const cx = Math.random() * gridSize; // Random center x
    const cy = Math.random() * gridSize; // Random center y
    const r = Math.random() * (gridSize / 8); // Random radius (adjust as needed)
    circles.push({ cx, cy, r });
  }
  return circles;
}

const circlesMobile = generateRandomCircles(180);

export default circlesMobile;
