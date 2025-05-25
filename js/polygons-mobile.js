function generateUniformTriangles(numTriangles, gridSizeX, gridSizeY, triangleSize) {
  const triangles = [];
  const cappedNumTriangles = Math.min(numTriangles, 666);

  for (let i = 0; i < cappedNumTriangles; i++) {
    const x = Math.random() * gridSizeX; // Random x position
    const y = Math.random() * gridSizeY; // Random y position
    const rotation = Math.random() * 272; // Random rotation angle

    // Define the basic triangle points
    const p1x = 0;
    const p1y = 0;
    const p2x = triangleSize;
    const p2y = 0;
    const p3x = 0;
    const p3y = triangleSize;

    // Apply rotation to the triangle points
    const rotate = (x, y, angle) => {
      const radians = (Math.PI / 180) * angle;
      const newX = x * Math.cos(radians) - y * Math.sin(radians);
      const newY = x * Math.sin(radians) + y * Math.cos(radians);
      return { x: newX, y: newY };
    };

    const rotatedP1 = rotate(p1x, p1y, rotation);
    const rotatedP2 = rotate(p2x, p2y, rotation);
    const rotatedP3 = rotate(p3x, p3y, rotation);

    triangles.push(`${x + rotatedP1.x - triangleSize/2},${y + rotatedP1.y - triangleSize/2} ${x + rotatedP2.x - triangleSize/2},${y + rotatedP2.y - triangleSize/2} ${x + rotatedP3.x - triangleSize/2},${y + rotatedP3.y - triangleSize/2}`);
  }
  return triangles;
}

const polygonsMobile = (viewportWidth, viewportHeight) => {
  const numberOfTriangles = 35;
  const minSize = Math.min(viewportWidth, viewportHeight) * 0.1;
  const maxSize = Math.min(viewportWidth, viewportHeight) * 0.4;

  let polygons = [];

  for (let i = 0; i < numberOfTriangles; i++) {
    let x1 = Math.random() * viewportWidth;
    let y1 = Math.random() * viewportHeight;

    let size = minSize + Math.random() * (maxSize - minSize);

    let x2 = x1 + (Math.random() - 0.5) * size;
    let y2 = y1 + (Math.random() - 0.5) * size;

    let x3 = x1 + (Math.random() - 0.5) * size;
    let y3 = y1 + (Math.random() - 0.5) * size;

    polygons.push(`${x1},${y1} ${x2},${y2} ${x3},${y3}`);
  }

  return polygons;
};

export default polygonsMobile;
