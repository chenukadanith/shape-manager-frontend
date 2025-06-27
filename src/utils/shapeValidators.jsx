// src/utils/shapeValidators.jsx

// Helper to parse coordinate string into an array of {x, y} objects
export const parseCoordinates = (coordinatesString) => {
    try {
      const pairs = coordinatesString.split(';');
      const parsed = pairs.map(pair => {
        const [x, y] = pair.split(',').map(Number); 
        if (isNaN(x) || isNaN(y)) {
          throw new Error('Invalid number format in coordinates');
        }
       
        if (x < 0 || y < 0) {
          throw new Error('Coordinates cannot be negative.');
        }
        return { x, y };
      });
      return parsed;
    } catch (e) {
      console.error("Error parsing coordinates:", e.message);
      return null; 
    }
  };
  
  const calculateDistanceSq = (p1, p2) => {
    return (p2.x - p1.x)**2 + (p2.y - p1.y)**2;
  };
  
  const calculateDotProduct = (v1, v2) => {
    return v1.x * v2.x + v1.y * v2.y;
  };
  
  const isCollinear = (p1, p2, p3) => {
      const epsilon = 1e-9; 
      return Math.abs((p2.y - p1.y) * (p3.x - p2.x) - (p3.y - p2.y) * (p2.x - p1.x)) < epsilon;
  };
  
  // Helper to determine if 4 points form a rectangle
  export const isRectangleCoordinates = (coords) => {
      if (coords.length !== 4) return false;
  
      if (isCollinear(coords[0], coords[1], coords[2]) ||
          isCollinear(coords[0], coords[1], coords[3]) ||
          isCollinear(coords[0], coords[2], coords[3]) ||
          isCollinear(coords[1], coords[2], coords[3])) {
          return false;
      }
  
      const d01_sq = calculateDistanceSq(coords[0], coords[1]);
      const d12_sq = calculateDistanceSq(coords[1], coords[2]);
      const d23_sq = calculateDistanceSq(coords[2], coords[3]);
      const d30_sq = calculateDistanceSq(coords[3], coords[0]);
  
      const d02_sq = calculateDistanceSq(coords[0], coords[2]); // Diagonal 1
      const d13_sq = calculateDistanceSq(coords[1], coords[3]); // Diagonal 2
  
      const epsilon = 1e-9;
  
      const isParallelogram = (Math.abs(d01_sq - d23_sq) < epsilon && Math.abs(d12_sq - d30_sq) < epsilon);
      const hasEqualDiagonals = Math.abs(d02_sq - d13_sq) < epsilon;
  
      if (!isParallelogram || !hasEqualDiagonals) {
          return false;
      }
  
      const vecP0P1 = { x: coords[1].x - coords[0].x, y: coords[1].y - coords[0].y };
      const vecP0P3 = { x: coords[3].x - coords[0].x, y: coords[3].y - coords[0].y };
  
      const dotProductAtP0 = calculateDotProduct(vecP0P1, vecP0P3);
  
      return Math.abs(dotProductAtP0) < epsilon;
  };