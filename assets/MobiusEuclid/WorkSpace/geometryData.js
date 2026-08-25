// Data structure for 3D geometry objects (cylinders and lines)

// Main container object for all geometry
export const geometryData = {
    // Array to hold cylinder objects
    cylinders: [
      {
        position: { x: 0, y: 0, z: 0 },  // Cartesian coordinates (x,y,z)
        height: 1,                            // Height of cylinder
        radius: 5                              // Radius of cylinder
      },
      {
        position: { x: 0, y: 0, z: 1 },
        height: 1,
        radius: 2
      },
      {
        position: { x: 0, y: 3, z: 1 },
        height: 2,
        radius: 0.5
      }
    ],
    
    // Array to hold line objects in polar coordinates
    lines: [
      {
        polarPosition: { 
          r: 5.2,          // Distance from origin
          theta: 0.785,    // Angle in radians (45 degrees)
          z: 2             // Height position
        },
        height: 1.0,       // Vertical length of the line
        thickness: 0.25      // Line thickness/width
      },
      {
        polarPosition: { 
          r: 1,
          theta: 2.356,     // Angle in radians (135 degrees)
          z: 1
        },
        height: 0.25,
        thickness: 3
      }
    ],
    
    // Utility functions for working with the data
    
    // Convert polar to Cartesian coordinates
    polarToCartesian: function(r, theta) {
      return {
        x: r * Math.cos(theta),
        y: r * Math.sin(theta)
      };
    },
    
    // Get Cartesian coordinates for a specific line
    getLineCartesianPosition: function(lineIndex) {
      const line = this.lines[lineIndex];
      if (!line) return null;
      
      const xy = this.polarToCartesian(line.polarPosition.r, line.polarPosition.theta);
      return {
        x: xy.x,
        y: xy.y,
        z: line.polarPosition.z
      };
    },
    
    // Add a new cylinder to the collection
    addCylinder: function(x, y, z, height, radius) {
      this.cylinders.push({
        position: { x, y, z },
        height,
        radius
      });
    },
    
    // Add a new line to the collection
    addLine: function(r, theta, z, height, thickness) {
      this.lines.push({
        polarPosition: { r, theta, z },
        height,
        thickness
      });
    }
  };
  
  // Export the data structure as default
  export default geometryData;