// Chess piece moves for 5x13 Escher Chess variant
export const escherChessMoves5x13 = {
    pawn: {
        white: {
            moves: [
                // Forward move (non-capturing)
                {move: [0, 1], jumpy: false, reqCapture: false},
                // Initial two-square move
                {move: [0, 2], jumpy: false, reqCapture: false, initialOnly: true},
                // Capture moves diagonally
                {move: [1, 1], jumpy: true, reqCapture: true},
                {move: [-1, 1], jumpy: true, reqCapture: true}
            ]
        },
        black: {
            moves: [
                // Forward move (non-capturing)
                {move: [0, -1], jumpy: false, reqCapture: false},
                // Initial two-square move
                {move: [0, -2], jumpy: false, reqCapture: false, initialOnly: true},
                // Capture moves diagonally
                {move: [2, -1], jumpy: true, reqCapture: true},
                {move: [-2, -1], jumpy: true, reqCapture: true}
            ]
        }
    },
    knight: {
        white: {
            moves: [
                {move: [2, 1], jumpy: true, reqCapture: false},
                {move: [2, -1], jumpy: true, reqCapture: false},
                {move: [-2, 1], jumpy: true, reqCapture: false},
                {move: [-2, -1], jumpy: true, reqCapture: false},
                {move: [1, 2], jumpy: true, reqCapture: false},
                {move: [1, -2], jumpy: true, reqCapture: false},
                {move: [-1, 2], jumpy: true, reqCapture: false},
                {move: [-1, -2], jumpy: true, reqCapture: false}
            ]
        },
        black: {
            moves: [
                {move: [-1, 1], jumpy: true, reqCapture: false},
                {move: [-1, -1], jumpy: true, reqCapture: false},
                {move: [1, 1], jumpy: true, reqCapture: false},
                {move: [1, -1], jumpy: true, reqCapture: false},
                {move: [2, 2], jumpy: true, reqCapture: false},
                {move: [2, -2], jumpy: true, reqCapture: false},
                {move: [-2, 2], jumpy: true, reqCapture: false},
                {move: [-2, -2], jumpy: true, reqCapture: false}
            ]
        }
    },
    bishop: {
        white: {
            moves: [
                // Limited to 2 spaces diagonally as specified
                {move: [1, 1], jumpy: true, reqCapture: false},
                {move: [2, 2], jumpy: true, reqCapture: false},
                {move: [-1, 1], jumpy: true, reqCapture: false},
                {move: [-2, 2], jumpy: true, reqCapture: false},
                {move: [1, -1], jumpy: true, reqCapture: false},
                {move: [2, -2], jumpy: true, reqCapture: false},
                {move: [-1, -1], jumpy: true, reqCapture: false},
                {move: [-2, -2], jumpy: true, reqCapture: false}
            ]
        },
        black: {
            moves: [
                // Limited to 2 spaces diagonally as specified
                {move: [2, 1], jumpy: true, reqCapture: false},
                {move: [-1, 2], jumpy: true, reqCapture: false},
                {move: [-2, 1], jumpy: true, reqCapture: false},
                {move: [1, 2], jumpy: true, reqCapture: false},
                {move: [2, -1], jumpy: true, reqCapture: false},
                {move: [-1, -2], jumpy: true, reqCapture: false},
                {move: [-2, -1], jumpy: true, reqCapture: false},
                {move: [1, -2], jumpy: true, reqCapture: false}
            ]
        }
    },
    rook: {
        white: {
            moves: [
                // Horizontal moves (jumpy as specified)
                {move: [1, 0], jumpy: true, reqCapture: false},
                {move: [2, 0], jumpy: true, reqCapture: false},
                {move: [-1, 0], jumpy: true, reqCapture: false},
                {move: [-2, 0], jumpy: true, reqCapture: false},
                // Vertical moves (not jumpy)
                {move: [0, 1], jumpy: false, reqCapture: false},
                {move: [0, 2], jumpy: false, reqCapture: false},
                {move: [0, 3], jumpy: false, reqCapture: false},
                {move: [0, 4], jumpy: false, reqCapture: false},
                {move: [0, 5], jumpy: false, reqCapture: false},
                {move: [0, 6], jumpy: false, reqCapture: false},
                {move: [0, 7], jumpy: false, reqCapture: false},
                {move: [0, 8], jumpy: false, reqCapture: false},
                {move: [0, 9], jumpy: false, reqCapture: false},
                {move: [0, 10], jumpy: false, reqCapture: false},
                {move: [0, 11], jumpy: false, reqCapture: false},
                {move: [0, 12], jumpy: false, reqCapture: false},
                {move: [0, -1], jumpy: false, reqCapture: false},
                {move: [0, -2], jumpy: false, reqCapture: false},
                {move: [0, -3], jumpy: false, reqCapture: false},
                {move: [0, -4], jumpy: false, reqCapture: false},
                {move: [0, -5], jumpy: false, reqCapture: false},
                {move: [0, -6], jumpy: false, reqCapture: false},
                {move: [0, -7], jumpy: false, reqCapture: false},
                {move: [0, -8], jumpy: false, reqCapture: false},
                {move: [0, -9], jumpy: false, reqCapture: false},
                {move: [0, -10], jumpy: false, reqCapture: false},
                {move: [0, -11], jumpy: false, reqCapture: false},
                {move: [0, -12], jumpy: false, reqCapture: false}
            ]
        },
        black: {
            moves: [
                // Horizontal moves (jumpy as specified)
                {move: [2, 0], jumpy: true, reqCapture: false},
                {move: [-1, 0], jumpy: true, reqCapture: false},
                {move: [-2, 0], jumpy: true, reqCapture: false},
                {move: [1, 0], jumpy: true, reqCapture: false},
                // Vertical moves (not jumpy)
                {move: [0, 1], jumpy: false, reqCapture: false},
                {move: [0, 2], jumpy: false, reqCapture: false},
                {move: [0, 3], jumpy: false, reqCapture: false},
                {move: [0, 4], jumpy: false, reqCapture: false},
                {move: [0, 5], jumpy: false, reqCapture: false},
                {move: [0, 6], jumpy: false, reqCapture: false},
                {move: [0, 7], jumpy: false, reqCapture: false},
                {move: [0, 8], jumpy: false, reqCapture: false},
                {move: [0, 9], jumpy: false, reqCapture: false},
                {move: [0, 10], jumpy: false, reqCapture: false},
                {move: [0, 11], jumpy: false, reqCapture: false},
                {move: [0, 12], jumpy: false, reqCapture: false},
                {move: [0, -1], jumpy: false, reqCapture: false},
                {move: [0, -2], jumpy: false, reqCapture: false},
                {move: [0, -3], jumpy: false, reqCapture: false},
                {move: [0, -4], jumpy: false, reqCapture: false},
                {move: [0, -5], jumpy: false, reqCapture: false},
                {move: [0, -6], jumpy: false, reqCapture: false},
                {move: [0, -7], jumpy: false, reqCapture: false},
                {move: [0, -8], jumpy: false, reqCapture: false},
                {move: [0, -9], jumpy: false, reqCapture: false},
                {move: [0, -10], jumpy: false, reqCapture: false},
                {move: [0, -11], jumpy: false, reqCapture: false},
                {move: [0, -12], jumpy: false, reqCapture: false}
            ]
        }
    },
    queen: {
        white: {
            moves: [
                // Horizontal moves (jumpy as specified)
                {move: [1, 0], jumpy: true, reqCapture: false},
                {move: [2, 0], jumpy: true, reqCapture: false},
                {move: [-1, 0], jumpy: true, reqCapture: false},
                {move: [-2, 0], jumpy: true, reqCapture: false},
                // Vertical moves (jumpy as specified)
                {move: [0, 1], jumpy: false, reqCapture: false},
                {move: [0, 2], jumpy: false, reqCapture: false},
                {move: [0, 3], jumpy: false, reqCapture: false},
                {move: [0, 4], jumpy: false, reqCapture: false},
                {move: [0, 5], jumpy: false, reqCapture: false},
                {move: [0, 6], jumpy: false, reqCapture: false},
                {move: [0, 7], jumpy: false, reqCapture: false},
                {move: [0, 8], jumpy: false, reqCapture: false},
                {move: [0, 9], jumpy: false, reqCapture: false},
                {move: [0, 10], jumpy: false, reqCapture: false},
                {move: [0, 11], jumpy: false, reqCapture: false},
                {move: [0, 12], jumpy: false, reqCapture: false},
                {move: [0, -1], jumpy: false, reqCapture: false},
                {move: [0, -2], jumpy: false, reqCapture: false},
                {move: [0, -3], jumpy: false, reqCapture: false},
                {move: [0, -4], jumpy: false, reqCapture: false},
                {move: [0, -5], jumpy: false, reqCapture: false},
                {move: [0, -6], jumpy: false, reqCapture: false},
                {move: [0, -7], jumpy: false, reqCapture: false},
                {move: [0, -8], jumpy: false, reqCapture: false},
                {move: [0, -9], jumpy: false, reqCapture: false},
                {move: [0, -10], jumpy: false, reqCapture: false},
                {move: [0, -11], jumpy: false, reqCapture: false},
                {move: [0, -12], jumpy: false, reqCapture: false},
                // Diagonal moves (jumpy as specified)
                {move: [1, 1], jumpy: true, reqCapture: false},
                {move: [2, 2], jumpy: true, reqCapture: false},
                {move: [-1, 1], jumpy: true, reqCapture: false},
                {move: [-2, 2], jumpy: true, reqCapture: false},
                {move: [1, -1], jumpy: true, reqCapture: false},
                {move: [2, -2], jumpy: true, reqCapture: false},
                {move: [-1, -1], jumpy: true, reqCapture: false},
                {move: [-2, -2], jumpy: true, reqCapture: false}
            ]
        },
        black: {
            moves: [
                // Horizontal moves (jumpy as specified)
                {move: [2, 0], jumpy: true, reqCapture: false},
                {move: [-1, 0], jumpy: true, reqCapture: false},
                {move: [-2, 0], jumpy: true, reqCapture: false},
                {move: [1, 0], jumpy: true, reqCapture: false},
                // Vertical moves (jumpy as specified)
                {move: [0, 1], jumpy: false, reqCapture: false},
                {move: [0, 2], jumpy: false, reqCapture: false},
                {move: [0, 3], jumpy: false, reqCapture: false},
                {move: [0, 4], jumpy: false, reqCapture: false},
                {move: [0, 5], jumpy: false, reqCapture: false},
                {move: [0, 6], jumpy: false, reqCapture: false},
                {move: [0, 7], jumpy: false, reqCapture: false},
                {move: [0, 8], jumpy: false, reqCapture: false},
                {move: [0, 9], jumpy: false, reqCapture: false},
                {move: [0, 10], jumpy: false, reqCapture: false},
                {move: [0, 11], jumpy: false, reqCapture: false},
                {move: [0, 12], jumpy: false, reqCapture: false},
                {move: [0, -1], jumpy: false, reqCapture: false},
                {move: [0, -2], jumpy: false, reqCapture: false},
                {move: [0, -3], jumpy: false, reqCapture: false},
                {move: [0, -4], jumpy: false, reqCapture: false},
                {move: [0, -5], jumpy: false, reqCapture: false},
                {move: [0, -6], jumpy: false, reqCapture: false},
                {move: [0, -7], jumpy: false, reqCapture: false},
                {move: [0, -8], jumpy: false, reqCapture: false},
                {move: [0, -9], jumpy: false, reqCapture: false},
                {move: [0, -10], jumpy: false, reqCapture: false},
                {move: [0, -11], jumpy: false, reqCapture: false},
                {move: [0, -12], jumpy: false, reqCapture: false},
                // Diagonal moves (jumpy as specified)
                {move: [2, 1], jumpy: true, reqCapture: false},
                {move: [-1, 2], jumpy: true, reqCapture: false},
                {move: [-2, 1], jumpy: true, reqCapture: false},
                {move: [1, 2], jumpy: true, reqCapture: false},
                {move: [2, -1], jumpy: true, reqCapture: false},
                {move: [-1, -2], jumpy: true, reqCapture: false},
                {move: [-2, -1], jumpy: true, reqCapture: false},
                {move: [1, -2], jumpy: true, reqCapture: false}
            ]
        }
    },
    king: {
        white: {
            moves: [
                // Surrounding squares
                {move: [0, 1], jumpy: false, reqCapture: false},
                {move: [0, -1], jumpy: false, reqCapture: false},
                {move: [1, 0], jumpy: true, reqCapture: false}, // Horizontal moves are jumpy
                {move: [-1, 0], jumpy: true, reqCapture: false}, // Horizontal moves are jumpy
                {move: [1, 1], jumpy: true, reqCapture: false},
                {move: [1, -1], jumpy: true, reqCapture: false},
                {move: [-1, 1], jumpy: true, reqCapture: false},
                {move: [-1, -1], jumpy: true, reqCapture: false}
            ]
        },
        black: {
            moves: [
                // Surrounding squares
                {move: [0, 1], jumpy: false, reqCapture: false},
                {move: [0, -1], jumpy: false, reqCapture: false},
                {move: [2, 0], jumpy: true, reqCapture: false}, // Horizontal moves are jumpy
                {move: [-2, 0], jumpy: true, reqCapture: false}, // Horizontal moves are jumpy
                {move: [2, 1], jumpy: true, reqCapture: false},
                {move: [2, -1], jumpy: true, reqCapture: false},
                {move: [-2, 1], jumpy: true, reqCapture: false},
                {move: [-2, -1], jumpy: true, reqCapture: false}
            ]
        }
    }
};

// Piece types
export const PIECE_TYPES = {
    WHITE_PAWN: 'pw',
    WHITE_KNIGHT: 'nw',
    WHITE_BISHOP: 'bw',
    WHITE_ROOK: 'rw',
    WHITE_KING: 'kw',
    WHITE_QUEEN: 'qw',
    BLACK_PAWN: 'pb',
    BLACK_KNIGHT: 'nb',
    BLACK_BISHOP: 'bb',
    BLACK_ROOK: 'rb',
    BLACK_KING: 'kb',
    BLACK_QUEEN: 'qb'
  };

// Initial board setup - can be easily modified
export const INITIAL_BOARD_CONFIG_5x13_ESCHER = [
    // This array defines the initial board configuration
    // Each element is an object with piece type and position
    // Format: { type: PIECE_TYPES.X, row: y, col: z }
    
    // White pieces (bottom of board)
    { type: PIECE_TYPES.WHITE_BISHOP, row: 0, col: 0 },
    { type: PIECE_TYPES.WHITE_ROOK, row: 0, col: 1 },
    { type: PIECE_TYPES.WHITE_KING, row: 0, col: 2 },
    { type: PIECE_TYPES.WHITE_ROOK, row: 0, col: 3 },
    { type: PIECE_TYPES.WHITE_BISHOP, row: 0, col: 4 },
    { type: PIECE_TYPES.WHITE_PAWN, row: 1, col: 0 },
    { type: PIECE_TYPES.WHITE_KNIGHT, row: 1, col: 1 },
    { type: PIECE_TYPES.WHITE_PAWN, row: 1, col: 2 },
    { type: PIECE_TYPES.WHITE_KNIGHT, row: 1, col: 3 },
    { type: PIECE_TYPES.WHITE_PAWN, row: 1, col: 4 },
    { type: PIECE_TYPES.WHITE_PAWN, row: 2, col: 0 },
    { type: PIECE_TYPES.WHITE_PAWN, row: 2, col: 1 },
    { type: PIECE_TYPES.WHITE_PAWN, row: 2, col: 2 },
    { type: PIECE_TYPES.WHITE_PAWN, row: 2, col: 3 },
    { type: PIECE_TYPES.WHITE_PAWN, row: 2, col: 4 },
    
    // Black pieces (top of board)
    { type: PIECE_TYPES.BLACK_KING, row: 12, col: 0 },
    { type: PIECE_TYPES.BLACK_BISHOP, row: 12, col: 1 },
    { type: PIECE_TYPES.BLACK_ROOK, row: 12, col: 2 },
    { type: PIECE_TYPES.BLACK_ROOK, row: 12, col: 3 },
    { type: PIECE_TYPES.BLACK_BISHOP, row: 12, col: 4 },
    { type: PIECE_TYPES.BLACK_PAWN, row: 11, col: 0 },
    { type: PIECE_TYPES.BLACK_PAWN, row: 11, col: 1 },
    { type: PIECE_TYPES.BLACK_KNIGHT, row: 11, col: 2 },
    { type: PIECE_TYPES.BLACK_KNIGHT, row: 11, col: 3 },
    { type: PIECE_TYPES.BLACK_PAWN, row: 11, col: 4 },
    { type: PIECE_TYPES.BLACK_PAWN, row: 10, col: 0 },
    { type: PIECE_TYPES.BLACK_PAWN, row: 10, col: 1 },
    { type: PIECE_TYPES.BLACK_PAWN, row: 10, col: 2 },
    { type: PIECE_TYPES.BLACK_PAWN, row: 10, col: 3 },
    { type: PIECE_TYPES.BLACK_PAWN, row: 10, col: 4 }
  ];