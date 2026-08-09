// Function to create a permutation matrix for 5x5 board
// Using x -> 2x-1 mod 5
export function create5x5PermutationMatrix() {
    const n = 5;
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let x = 0; x < n; x++) {
        const newPos = ((-2 * x + 2) % n + n) % n; // Ensure positive modulo
        matrix[newPos][x] = 1;
    }
    
    return matrix;
}

// Function to create inverse 5x5 permutation matrix
export function create5x5InversePermutationMatrix() {
    const n = 5;
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let x = 0; x < n; x++) {
        // To find inverse, solve y ≡ -2x + 2 (mod 5) for x
        // x ≡ (y+1)/2 (mod 5)
        const newPos = (((x - 2) * 2) % n + n) % n; // Multiply by 3 instead of dividing by 2
        matrix[newPos][x] = 1;
    }
    
    return matrix;
}

// Function to create a permutation matrix for 8x8 board
// Using x -> -3x+4 mod 8
export function create8x8PermutationMatrix() {
    const n = 8;
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let x = 0; x < n; x++) {
        const newPos = ((3 * x -1) % n + n) % n; // Ensure positive modulo
        matrix[newPos][x] = 1;
    }
    
    return matrix;
}

// Function to create inverse 8x8 permutation matrix
export function create8x8InversePermutationMatrix() {
    const n = 8;
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let x = 0; x < n; x++) {
        // To find inverse, solve y ≡ 3x-1 (mod 8) for x
        // x ≡ -(y-4)/3 (mod 8)
        const newPos = (((x + 1) * 3) % n + n) % n;
        matrix[newPos][x] = 1;
    }
    
    return matrix;
}

// Helper function to multiply a matrix by a vector
export function applyPermutation(matrix, vector) {
    return matrix.map(row => 
        row.reduce((sum, val, i) => sum + val * vector[i], 0)
    );
}

// Helper function to verify if a matrix is a valid permutation matrix
export function verifyPermutationMatrix(matrix) {
    const n = matrix.length;
    
    // Check if square matrix
    if (!matrix.every(row => row.length === n)) return false;
    
    // Check if each row and column has exactly one 1 and rest 0s
    for (let i = 0; i < n; i++) {
        const rowSum = matrix[i].reduce((a, b) => a + b, 0);
        let colSum = 0;
        for (let j = 0; j < n; j++) colSum += matrix[j][i];
        if (rowSum !== 1 || colSum !== 1) return false;
    }
    
    return true;
}
