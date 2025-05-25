function generateHexagonPoints(cx, cy, r) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = 2 * Math.PI / 6 * i;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(" ");
}

function generateRandomHexagons(numHexagons, gridSize = 1280) {
  const hexagons = [];
  const cappedNumHexagons = Math.min(numHexagons, 666);

  for (let i = 0; i < cappedNumHexagons; i++) {
    const cx = Math.random() * gridSize; // Random center x
    const cy = Math.random() * gridSize; // Random center y
    const r = Math.random() * (gridSize / 10); // Random radius (adjust as needed)
    hexagons.push({ cx, cy, r });
  }
  return hexagons;
}

const hexagonsMobile = generateRandomHexagons(180);

export default hexagonsMobile;
