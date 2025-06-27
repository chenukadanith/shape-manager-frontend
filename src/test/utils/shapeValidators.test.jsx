
import { parseCoordinates, isRectangleCoordinates } from '../../utils/shapeValidators';

// Describe block groups related tests together
describe('shapeValidators', () => {

  // --- Test parseCoordinates function ---
  describe('parseCoordinates', () => {
    test('should correctly parse valid coordinate strings with integers and floats', () => {
      const coordsString = '10,20;30.5,40;50,60.75';
      const expected = [
        { x: 10, y: 20 },
        { x: 30.5, y: 40 },
        { x: 50, y: 60.75 }
      ];
      expect(parseCoordinates(coordsString)).toEqual(expected);
    });

    test('should return null for malformed coordinate strings (incorrect format)', () => {
      expect(parseCoordinates('10,20;30;40,50')).toBeNull(); // Missing Y for a pair
      expect(parseCoordinates('10,abc;20,30')).toBeNull(); // Non-numeric coordinate
      expect(parseCoordinates('10.20')).toBeNull(); // Not a pair, missing semicolon
      expect(parseCoordinates('invalid string')).toBeNull();
    });

    test('should return null for coordinate strings containing negative values', () => {
      expect(parseCoordinates('10,-20;30,40')).toBeNull(); // Negative Y
      expect(parseCoordinates('-10,20;30,40')).toBeNull(); // Negative X
      expect(parseCoordinates('-5,-5')).toBeNull();       // Both negative
      expect(parseCoordinates('0,0;-1,0;0,1')).toBeNull(); // Mixed, but with negative
    });

    

    test('should return an array for a single valid coordinate pair', () => {
      expect(parseCoordinates('10,20')).toEqual([{ x: 10, y: 20 }]);
    });
  });

  // --- Test isRectangleCoordinates function ---
  describe('isRectangleCoordinates', () => {
    test('should return true for a perfectly axis-aligned rectangle', () => {
      const coords = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 5 },
        { x: 0, y: 5 }
      ];
      expect(isRectangleCoordinates(coords)).toBe(true);
    });

    test('should return true for a rotated rectangle (square)', () => {
      const coords = [
        { x: 0, y: 10 },
        { x: 10, y: 0 },
        { x: 20, y: 10 },
        { x: 10, y: 20 }
      ];
      expect(isRectangleCoordinates(coords)).toBe(true);
    });

    test('should return false if the input is not exactly 4 coordinates', () => {
      expect(isRectangleCoordinates([])).toBe(false); // 0 points
      expect(isRectangleCoordinates([{ x: 0, y: 0 }])).toBe(false); // 1 point
      expect(isRectangleCoordinates([{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }])).toBe(false); // 3 points (triangle)
      expect(isRectangleCoordinates([ // 5 points (pentagon)
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0.5, y: 1.5 }, { x: 0, y: 1 }
      ])).toBe(false);
    });

    test('should return false for a non-rectangular parallelogram (e.g., rhombus or general parallelogram)', () => {
      const rhombusCoords = [
        { x: 0, y: 0 },
        { x: 5, y: 0 },
        { x: 7, y: 3 }, // This point makes it a rhombus (sides equal, angles not 90)
        { x: 2, y: 3 }
      ];
      expect(isRectangleCoordinates(rhombusCoords)).toBe(false);

      const parallelogramCoords = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 15, y: 5 },
        { x: 5, y: 5 }
      ];
      expect(isRectangleCoordinates(parallelogramCoords)).toBe(false);
    });

    test('should return false for a trapezoid', () => {
        const trapezoidCoords = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 8, y: 5 },
            { x: 2, y: 5 }
        ];
        expect(isRectangleCoordinates(trapezoidCoords)).toBe(false);
    });

    test('should return false for a degenerate case (collinear points)', () => {
      const collinearCoords = [
        { x: 0, y: 0 },
        { x: 5, y: 0 },
        { x: 10, y: 0 }, // All on the same line
        { x: 5, y: 5 }
      ];
      expect(isRectangleCoordinates(collinearCoords)).toBe(false);

      const triangleWithDupCoords = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 0 }, // Duplicate point or on same line as previous
        { x: 5, y: 5 }
      ];
      expect(isRectangleCoordinates(triangleWithDupCoords)).toBe(false);
    });

    test('should handle floating point coordinates with small tolerance', () => {
      const coords = [
        { x: 0.0001, y: 0.0001 },
        { x: 10.0001, y: 0.0001 },
        { x: 10.0001, y: 5.0001 },
        { x: 0.0001, y: 5.0001 }
      ];
      expect(isRectangleCoordinates(coords)).toBe(true);

      const slightlyOffCoords = [ // Should still pass due to epsilon
        { x: 0, y: 0 },
        { x: 10.0000000001, y: 0 },
        { x: 10.0000000001, y: 5 },
        { x: 0, y: 5 }
      ];
      expect(isRectangleCoordinates(slightlyOffCoords)).toBe(true);
    });
  });
});