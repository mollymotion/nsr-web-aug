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
  const gridSizeX = viewportWidth * 1.5; // Example: Make it slightly larger than the viewport
  const gridSizeY = viewportHeight * 2.5; // Example: Make it slightly larger than the viewport
  const triangleSize = viewportWidth / 2; // Example: Adjust triangle size relative to viewport
  const numTriangles = 100;
  return generateUniformTriangles(numTriangles, gridSizeX, gridSizeY, triangleSize);
};

export default polygonsMobile;
