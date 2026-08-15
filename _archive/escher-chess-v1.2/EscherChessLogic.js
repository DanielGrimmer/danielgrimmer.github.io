console.log("EscherChessLogic.js loaded");

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, getDoc, runTransaction } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { firebaseConfig } from './firebaseConfig.js';
import { gameRoomNames, getOldestRoomName, isValidRoomName } from './EscherChessGameRooms.js';
import { demoChessMoves5x13, PIECE_TYPES, INITIAL_BOARD_CONFIG_5x13 } from './DemoChessMoves5x13.js';
import { demoChessMoves8x8, INITIAL_BOARD_CONFIG_8x8 } from './DemoChessMoves8x8.js';
import { escherChessMoves5x13, INITIAL_BOARD_CONFIG_5x13_ESCHER } from './EscherChessMoves5x13.js';
import { escherChessMoves8x8, INITIAL_BOARD_CONFIG_8x8_ESCHER } from './EscherChessMoves8x8.js';
import { 
  create5x5PermutationMatrix,
  create8x8PermutationMatrix,
  applyPermutation,
  create5x5InversePermutationMatrix,
  create8x8InversePermutationMatrix
} from './PermutationMatrices.js';
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized");

// Constants for board setup
const BOARD_DIMENSIONS = {
  "5x13": { width: 5, height: 13 },
  "8x8": { width: 8, height: 8 }
};

// Add a storage event listener to trigger when localStorage is changed in other tabs
window.addEventListener('storage', (event) => {
  console.log('Storage event triggered:', event);
  if (event.key === 'boardSize' && escherChessGame) {
    console.log(`Board size changed in another tab from ${escherChessGame.boardSize} to ${event.newValue}`);
    // Only update if the board size is actually different
    if (event.newValue !== escherChessGame.boardSize) {
      console.log('Updating board size from storage event');
      escherChessGame.boardSize = event.newValue;
      escherChessGame.boardSizeSource = "localStorage (sync from other tab)";
      escherChessGame.initializeBoard();
      escherChessGame.renderBoard();
      escherChessGame.updateBoardSizeDisplay();
      escherChessGame.updateRulesText();
    }
  }
});

// Helper function to get piece symbol
function getPieceSymbol(piece) {
  switch(piece) {
    case PIECE_TYPES.WHITE_KING: return '♔';
    case PIECE_TYPES.WHITE_QUEEN: return '♕';
    case PIECE_TYPES.WHITE_ROOK: return '♖';
    case PIECE_TYPES.WHITE_BISHOP: return '♗';
    case PIECE_TYPES.WHITE_KNIGHT: return '♘';
    case PIECE_TYPES.WHITE_PAWN: return '♙';
    case PIECE_TYPES.BLACK_KING: return '♚';
    case PIECE_TYPES.BLACK_QUEEN: return '♛';
    case PIECE_TYPES.BLACK_ROOK: return '♜';
    case PIECE_TYPES.BLACK_BISHOP: return '♝';
    case PIECE_TYPES.BLACK_KNIGHT: return '♞';
    case PIECE_TYPES.BLACK_PAWN: return '♟';
    default: return '';
  }
}

// Standalone function to render any game state
function renderChessBoard(boardState, elementId, selectedPiece = null, validMoves = [], clickHandler = null) {
  const boardElement = document.getElementById(elementId);
  if (!boardElement) return;
  
  const dimensions = BOARD_DIMENSIONS[escherChessGame.boardSize || "5x13"];
  
  boardElement.innerHTML = '';
  
  // Set CSS variables for board dimensions
  boardElement.style.setProperty('--board-width', dimensions.width);
  boardElement.style.setProperty('--board-height', dimensions.height);
  
  // Check if we need to apply permutation
  const isGamePage = document.getElementById('rulesText2') !== null;
  const isBlackPlayer = escherChessGame && escherChessGame.userType === 'black';
  let displayBoardState = JSON.parse(JSON.stringify(boardState)); // Deep copy
  console.log("Render conditions:", {
    isGamePage,
    isBlackPlayer,
    boardSize: dimensions.width,
    userType: escherChessGame?.userType
  });
  
  if (isGamePage && isBlackPlayer) {
    console.log("Applying permutation for black player on game page");
    // Get the appropriate permutation matrix based on board size
    const permutationMatrix = dimensions.width === 5 ? 
        create5x5PermutationMatrix() : 
        create8x8PermutationMatrix();
    
    console.log("Using permutation matrix:", permutationMatrix);
    console.log("Original board state before permutation:", displayBoardState.map(row => [...row]));
    
    // Apply permutation to each row using a direct method without numeric conversion
    displayBoardState = displayBoardState.map(row => {
        // Create a new permuted row
        const permutedRow = new Array(row.length).fill(null);
        
        // For each position in the original row
        for (let i = 0; i < row.length; i++) {
            // Find where this position gets mapped to
            for (let j = 0; j < permutationMatrix.length; j++) {
                if (permutationMatrix[j][i] === 1) {
                    // When we find a 1 in the matrix, that's where i gets mapped to
                    permutedRow[j] = row[i];
                    break;
                }
            }
        }
        
        return permutedRow;
    });
    
    console.log("Permuted board state:", displayBoardState);
    
    // Apply permutation to file labels
    const fileLabels = dimensions.width === 5 ? 
        ['D', 'R', 'E', 'A', 'M'] : 
        ['E', 'D', 'S', 'U', 'C', 'A', 'H', 'L'];
   
   if (isBlackPlayer) {
        fileLabels.reverse();
        console.log("Reversed Files");
    }
    
        // Create permuted labels array using direct permutation
    const permutedLabels = new Array(dimensions.width).fill(null);
    fileLabels.forEach((label, i) => {
        // Find where this position gets mapped to in the permutation matrix
        for (let j = 0; j < permutationMatrix.length; j++) {
            if (permutationMatrix[j][i] === 1) {
                // When we find a 1 in the matrix, that's where i gets mapped to
                permutedLabels[j] = label;
                break;
            }
        }
    });

    console.log("File labels permutation:", {
        original: fileLabels,
        permuted: permutedLabels
    });
  }
  
  // Create a container for the board with rank and file labels
  const boardContainer = document.createElement('div');
  boardContainer.className = 'board-container';
  
  // Create file labels container only if on game page
  if (isGamePage) {
    const fileLabelsContainer = document.createElement('div');
    fileLabelsContainer.className = 'file-labels';
    
    // Define file labels based on board size
    let fileLabels = dimensions.width === 5 ? 
        ['D', 'R', 'E', 'A', 'M'] : 
        ['E', 'D', 'S', 'U', 'C', 'A', 'H', 'L'];
    
    if (isBlackPlayer) {
          fileLabels.reverse();
          console.log("Reversed Files");
      }

    // Apply permutation to labels if black player
    if (isBlackPlayer) {
        const permutationMatrix = dimensions.width === 5 ? 
            create5x5PermutationMatrix() : 
            create8x8PermutationMatrix();
        
        const permutedLabels = new Array(dimensions.width).fill(null);
        fileLabels.forEach((label, i) => {
            // Find where this position gets mapped to in the permutation matrix
            for (let j = 0; j < permutationMatrix.length; j++) {
                if (permutationMatrix[j][i] === 1) {
                    // When we find a 1 in the matrix, that's where i gets mapped to
                    permutedLabels[j] = label;
                    break;
                }
            }
        });
        fileLabels = permutedLabels;
        console.log("Applied permutation to file labels:", fileLabels);
    }

    // Add file labels
    for (let i = 0; i < dimensions.width; i++) {
        const fileLabel = document.createElement('div');
        fileLabel.className = 'file-label';
        fileLabel.textContent = fileLabels[i];
        fileLabelsContainer.appendChild(fileLabel);
    }

    boardContainer.appendChild(fileLabelsContainer);
  }
  
  // Create the actual chess board
  const chessBoard = document.createElement('div');
  chessBoard.className = 'chess-board-inner';
  
  // Add rank labels (1-13 or 1-8 depending on board size)
  const rankLabelsContainer = document.createElement('div');
  rankLabelsContainer.className = 'rank-labels';
  
  // Update rank label rendering based on player perspective
  for (let i = 0; i < dimensions.height; i++) {
    const rankLabel = document.createElement('div');
    rankLabel.className = 'rank-label';
    // For black player, count from bottom to top
    const rankNumber = isBlackPlayer ? (i + 1) : (dimensions.height - i);
    rankLabel.textContent = rankNumber;
    rankLabelsContainer.appendChild(rankLabel);
  }
  
  // Loop through each cell position
  for (let i = 0; i < dimensions.height; i++) {
    // Calculate the actual row index based on player perspective
    const row = isBlackPlayer ? i : (dimensions.height - 1 - i);
    
    for (let j = 0; j < dimensions.width; j++) {
      // Calculate the actual column index based on player perspective
      const col = isBlackPlayer ? j : (dimensions.width - 1 - j);
      
      const cell = document.createElement('div');
      cell.className = `chess-cell ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
      
      // Check if this cell is the selected piece
      let isSelected = false;
      if (selectedPiece) {
        isSelected = selectedPiece.visualRow === row && selectedPiece.visualCol === col;
      }
      
      if (isSelected) {
        cell.classList.add('selected');
      }
      
      // Check if this cell is a valid move
      const isValidMove = validMoves.some(move => move.visualRow === row && move.visualCol === col);
      if (isValidMove) {
        cell.classList.add('valid-move');
      }
      
      // Get the piece at this position on the displayed board state
      const piece = displayBoardState[row][col];
      
      if (piece) {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'chess-piece';
        pieceElement.textContent = getPieceSymbol(piece);
        pieceElement.style.color = piece.charAt(0) === 'w' ? 'white' : 'black';
        cell.appendChild(pieceElement);
      }
      
      // Add click event listener if provided
      if (clickHandler) {
        cell.addEventListener('click', () => clickHandler(row, col));
      }
      
      chessBoard.appendChild(cell);
    }
  }
  
  // Assemble the board with labels
  boardContainer.appendChild(rankLabelsContainer);
  boardContainer.appendChild(chessBoard);
  boardElement.appendChild(boardContainer);
  
  return boardElement;
}

// Game state management
class EscherChessGame {
  constructor() {
    this.gameRoomId = null;
    this.gameDocRef = null;
    this.boardState = this.createEmptyBoard();
    this.selectedPiece = null;
    this.validMoves = [];
    this.isWhiteTurn = true;
    this.userType = null;
    
    // Add timestamp to track initialization order
    this.initTimestamp = new Date().toISOString();
    
    // Initialize board size with a fallback
    this.boardSize = localStorage.getItem("boardSize") || "5x13"; // Default to "5x13"
    console.log(`[${this.initTimestamp}] Constructor: boardSize from localStorage =`, this.boardSize);
    
    // Ensure the board size is valid
    if (!BOARD_DIMENSIONS[this.boardSize]) {
      console.error(`Invalid board size: ${this.boardSize}. Defaulting to 5x13.`);
      this.boardSize = "5x13"; // Fallback to default
      localStorage.setItem("boardSize", this.boardSize);
    }
    
    // Store the source of the board size for debugging
    this.boardSizeSource = "localStorage";
  }

  // Helper function to create an empty board
  createEmptyBoard() {
    const dimensions = this.getCurrentDimensions();
    const board = new Array(dimensions.height);
    for (let i = 0; i < dimensions.height; i++) {
      board[i] = new Array(dimensions.width).fill(null);
    }
    return board;
  }

  // Method to get current dimensions based on board size
  getCurrentDimensions() {
    return BOARD_DIMENSIONS[this.boardSize] || BOARD_DIMENSIONS["5x13"]; // Fallback to default dimensions
  }

  // Initialize the game
  async init() {
    console.log("Initializing game...");
    console.log("Initial board size from localStorage:", localStorage.getItem("boardSize"));
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Get or set game room
    this.gameRoomId = localStorage.getItem("gameRoomId");
    
    // Make sure we're using a valid room from our predefined list
    if (!this.gameRoomId || !isValidRoomName(this.gameRoomId)) {
        this.gameRoomId = gameRoomNames[0];
        localStorage.setItem("gameRoomId", this.gameRoomId);
        console.log("Setting initial game room to:", this.gameRoomId);
    }
    
    this.updateCurrentRoomDisplay();
    
    // Set document reference with room ID based on page type
    const isGamePage = document.getElementById('rulesText2') !== null;
    const docPrefix = isGamePage ? 'game_' : 'demo_';
    this.gameDocRef = doc(db, "EscherChessGames", `${docPrefix}${this.gameRoomId}`);

    // Load game state from Firebase
    await this.loadGameStateFromFirebase();
    console.log("After Firebase load, final board size is:", this.boardSize);

    // Assign user type
    await this.assignUserType();
    this.updatePlayerTypeDisplay();
    
    // Listen for real-time updates
    this.setupRealtimeUpdates();

    // Update all UI elements
    this.renderBoard();
    this.updateTurnDisplay();
    this.updateRulesText();
    this.updateBoardSizeDisplay();
    this.updateGameStatus();
    
    console.log("Initialization complete");
  }

  // Initialize board with starting positions
  initializeBoard() {
    return this.createConfiguredBoard();
  }

  // Setup event listeners
  setupEventListeners() {
    // Room management buttons
    const nextRoomButton = document.getElementById('nextRoomButton');
    if (nextRoomButton) {
      nextRoomButton.addEventListener('click', () => this.handleNextRoom());
    }
    
    const joinRoomButton = document.getElementById('joinRoomButton');
    if (joinRoomButton) {
      joinRoomButton.addEventListener('click', () => this.handleJoinRoom());
    }
    
    const roomInput = document.getElementById('roomInput');
    if (roomInput) {
      roomInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleJoinRoom();
        }
      });
    }
    
    // Game control buttons
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
      resetButton.addEventListener('click', () => this.resetGame());
    }
    
    const changePlayerTypeButton = document.getElementById('changePlayerTypeButton');
    if (changePlayerTypeButton) {
      changePlayerTypeButton.addEventListener('click', () => this.changePlayerType());
    }

    const changeBoardSizeButton = document.getElementById('changeBoardSizeButton');
    if (changeBoardSizeButton) {
      changeBoardSizeButton.addEventListener('click', () => {
        this.boardSize = this.boardSize === "5x13" ? "8x8" : "5x13";
        localStorage.setItem("boardSize", this.boardSize);
        console.log("Board size updated in local storage to:", this.boardSize);
        this.resetGame();
        this.updateBoardSizeDisplay();
        this.updateRulesText();
        this.initializeBoard();
      });
    }
  }

  // Handle clicking on next room button
  async handleNextRoom() {
    try {
      // Get the oldest room and update local storage
      const oldestRoom = await getOldestRoomName();
      if (oldestRoom && oldestRoom !== this.gameRoomId) {
        localStorage.setItem('gameRoomId', oldestRoom);
        this.gameRoomId = oldestRoom;
        this.updateCurrentRoomDisplay();
        console.log("Switching to room:", oldestRoom);
        location.reload(); // Reload to update Firebase references
      } else {
        console.log("Oldest room:", oldestRoom, "Current room:", this.gameRoomId);
      }
    } catch (error) {
      console.error("Error getting oldest room:", error);
    }
  }

  // Handle joining a specific room
  handleJoinRoom() {
    const input = document.getElementById('roomInput');
    const roomName = input.value.trim();
    if (isValidRoomName(roomName)) {
      if (roomName !== this.gameRoomId) {
        localStorage.setItem('gameRoomId', roomName);
        this.gameRoomId = roomName;
        this.updateCurrentRoomDisplay();
        input.value = '';
        console.log("Joining room:", roomName);
        location.reload(); // Reload to update Firebase references
      } else {
        console.log("Already in this room:", roomName);
      }
    } else {
      alert('Invalid room name. Please try again with one of: ' + gameRoomNames.join(', '));
    }
  }

  // Update the display showing current room
  updateCurrentRoomDisplay() {
    const display = document.getElementById('currentRoom');
    if (display) {
      display.textContent = this.gameRoomId ? `Current Room: ${this.gameRoomId}` : 'No room selected';
    }
    
    // Update game link with current room if it exists
    const gameLink = document.getElementById('gameLink');
    if (gameLink && this.gameRoomId) {
      gameLink.href = `EscherChessGameV1.0.html?room=${this.gameRoomId}`;
    }
  }

  // Assign user type (white/black)
  async assignUserType() {
    try {
      const isGamePage = document.getElementById('rulesText2') !== null;
      const docPrefix = isGamePage ? 'game_visitors_' : 'demo_visitors_';
      const visitorDocRef = doc(db, "EscherChessGames", `${docPrefix}${this.gameRoomId}`);
      
      // Check if user type already assigned
      this.userType = localStorage.getItem("userType");
      if (this.userType) return;
      
      // Use transaction to safely increment visitor count
      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(visitorDocRef);
        let visitorNumber = docSnap.exists() ? docSnap.data().count : 0;
        const newVisitorNumber = visitorNumber + 1;
        const newUserType = newVisitorNumber % 2 === 0 ? "black" : "white";
        transaction.set(visitorDocRef, { count: newVisitorNumber });
        localStorage.setItem("userType", newUserType);
        this.userType = newUserType;
      });
    } catch (error) {
      console.error("Error assigning user type:", error);
    }
  }

  // Update the player type display
  updatePlayerTypeDisplay() {
    const playerTypeDisplay = document.getElementById('playerTypeDisplay');
    if (playerTypeDisplay) {
      playerTypeDisplay.textContent = `You are playing as ${this.userType === "white" ? 'White' : 'Black'}`;
    }
  }

  // Change player type (toggle white/black)
  changePlayerType() {
    this.userType = this.userType === "white" ? "black" : "white";
    localStorage.setItem("userType", this.userType);
    this.updatePlayerTypeDisplay();
    this.renderBoard();
  }

  // Check if it's the current player's turn
  isPlayersTurn() {
    return (this.userType === "white" && this.isWhiteTurn) || 
           (this.userType === "black" && !this.isWhiteTurn);
  }

  // Update turn display
  updateTurnDisplay() {
    const turnDisplay = document.getElementById('turnDisplay');
    if (turnDisplay) {
      turnDisplay.textContent = `Current turn: ${this.isWhiteTurn ? 'White' : 'Black'}`;
    }
  }

  // Load game state from Firebase
  async loadGameStateFromFirebase() {
    try {
      const isGamePage = document.getElementById('rulesText2') !== null;
      console.log(`[${this.initTimestamp}] Loading ${isGamePage ? 'game' : 'demo'} state from Firebase:`, this.gameDocRef.id);
      console.log(`[${this.initTimestamp}] Current board size before load:`, this.boardSize, `(from ${this.boardSizeSource})`);
      console.log(`[${this.initTimestamp}] localStorage.boardSize =`, localStorage.getItem("boardSize"));
      
      const docSnap = await getDoc(this.gameDocRef);
      if (docSnap.exists()) {
        console.log(`[${this.initTimestamp}] Game state found in Firebase`);
        const data = docSnap.data();
        
        // ALWAYS prioritize localStorage for boardSize
        const storedBoardSize = localStorage.getItem("boardSize");
        if (storedBoardSize) {
          // Store the old board size for logging
          const oldBoardSize = this.boardSize;
          this.boardSize = storedBoardSize;
          this.boardSizeSource = "localStorage (prioritized)";
          console.log(`[${this.initTimestamp}] Prioritizing localStorage boardSize: ${oldBoardSize} -> ${this.boardSize}`);
        } else if (data.boardSize) {
          this.boardSize = data.boardSize;
          localStorage.setItem("boardSize", this.boardSize);
          this.boardSizeSource = "Firebase";
          console.log(`[${this.initTimestamp}] No localStorage boardSize found, using Firebase boardSize:`, this.boardSize);
        }
        
        // Create empty board with current dimensions
        const dimensions = this.getCurrentDimensions();
        const newBoardState = this.createEmptyBoard();
        
        if (data.boardState) {
          Object.entries(data.boardState).forEach(([key, value]) => {
            const [row, col] = key.split('-').map(Number);
            if (row < dimensions.height && col < dimensions.width) {
              newBoardState[row][col] = value;
            }
          });
        }
        
        this.boardState = newBoardState;
        this.isWhiteTurn = data.isWhiteTurn;
      } else {
        console.log(`[${this.initTimestamp}] No existing game state found, initializing new game`);
        this.boardState = this.initializeBoard();
        this.isWhiteTurn = true;
        await this.updateGameStateOnFirebase();
      }
      
      console.log(`[${this.initTimestamp}] Board size after Firebase load:`, this.boardSize, `(from ${this.boardSizeSource})`);
      console.log(`[${this.initTimestamp}] localStorage.boardSize =`, localStorage.getItem("boardSize"));
      this.updateBoardSizeDisplay();
      
    } catch (error) {
      console.error(`[${this.initTimestamp}] Error loading game state:`, error);
    }
  }

  // Setup real-time updates from Firebase
  setupRealtimeUpdates() {
    // Set up real-time updates from Firebase
    console.log(`[${this.initTimestamp}] Setting up real-time updates for document:`, this.gameDocRef.id);
    
    onSnapshot(this.gameDocRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log(`[${this.initTimestamp}] Received real-time update from Firebase`);
        const data = docSnap.data();
        
        // Check current localStorage board size
        const currentLocalStorageSize = localStorage.getItem("boardSize");
        console.log(`[${this.initTimestamp}] Current localStorage boardSize =`, currentLocalStorageSize);
        console.log(`[${this.initTimestamp}] Current instance boardSize =`, this.boardSize);
        console.log(`[${this.initTimestamp}] Firebase boardSize =`, data.boardSize);
        
        // ALWAYS prioritize localStorage for board size
        // Only update from Firebase if localStorage doesn't have a value
        if (!currentLocalStorageSize && data.boardSize) {
          console.log(`[${this.initTimestamp}] No localStorage boardSize, using Firebase value:`, data.boardSize);
          this.boardSize = data.boardSize;
          localStorage.setItem("boardSize", this.boardSize);
          this.boardSizeSource = "Firebase (realtime update)";
        } else if (currentLocalStorageSize) {
          console.log(`[${this.initTimestamp}] Using localStorage boardSize:`, currentLocalStorageSize);
          if (this.boardSize !== currentLocalStorageSize) {
            console.log(`[${this.initTimestamp}] Updating instance boardSize to match localStorage:`, currentLocalStorageSize);
            this.boardSize = currentLocalStorageSize;
            this.boardSizeSource = "localStorage (realtime sync)";
          }
        }
        
        // Create empty board with current dimensions
        const dimensions = this.getCurrentDimensions();
        const newBoardState = this.createEmptyBoard();
        
        if (data.boardState) {
          Object.entries(data.boardState).forEach(([key, value]) => {
            const [row, col] = key.split('-').map(Number);
            if (row < dimensions.height && col < dimensions.width) {
              newBoardState[row][col] = value;
            }
          });
        }
        
        this.boardState = newBoardState;
        this.isWhiteTurn = data.isWhiteTurn;
        
        // Update all UI elements
        this.renderBoard();
        this.updateTurnDisplay();
        this.updateBoardSizeDisplay();
        this.updateRulesText();
        this.updateGameStatus();
        
        console.log(`[${this.initTimestamp}] Real-time update complete with board size:`, this.boardSize);
      }
    });
  }

  // Update game state on Firebase
  async updateGameStateOnFirebase() {
    try {
      console.log(`[${this.initTimestamp}] Updating game state on Firebase with board size:`, this.boardSize);
      console.log(`[${this.initTimestamp}] localStorage.boardSize =`, localStorage.getItem("boardSize"));
      
      // Make sure localStorage is in sync with the current board size
      if (localStorage.getItem("boardSize") !== this.boardSize) {
        console.log(`[${this.initTimestamp}] Updating localStorage to match current board size:`, this.boardSize);
        localStorage.setItem("boardSize", this.boardSize);
      }
      
      // Get current dimensions
      const dimensions = this.getCurrentDimensions();
      
      // Convert 2D board array to flat object for Firebase storage
      const flatBoardState = {};
      for (let row = 0; row < dimensions.height; row++) {
        for (let col = 0; col < dimensions.width; col++) {
          if (this.boardState[row] && this.boardState[row][col] !== null) {
            // Only store non-null values and check if row exists
            flatBoardState[`${row}-${col}`] = this.boardState[row][col];
          }
        }
      }

      // Always include the board size in Firebase document
      await setDoc(this.gameDocRef, {
        boardState: flatBoardState,
        isWhiteTurn: this.isWhiteTurn,
        lastUpdated: new Date(),
        lastUsed: new Date(),
        boardSize: this.boardSize, // Store the current board size
        boardSizeSource: this.boardSizeSource // Store source for debugging
      });
      
      console.log(`[${this.initTimestamp}] Game state saved successfully with board size:`, this.boardSize);
    } catch (error) {
      console.error(`[${this.initTimestamp}] Error updating game state:`, error);
    }
  }

  // Reset the game
  async resetGame() {
    console.log("Resetting game with board size:", this.boardSize);
    this.boardState = this.initializeBoard();
    this.isWhiteTurn = true;
    this.selectedPiece = null;
    this.validMoves = [];
    
    // Update all UI elements
    this.renderBoard();
    this.updateTurnDisplay();
    this.updateRulesText();
    this.updateBoardSizeDisplay();
    this.updateGameStatus();
    
    await this.updateGameStateOnFirebase();
    console.log("Game reset complete with board size:", this.boardSize);
  }

  // Render the chess board using the standalone function
  renderBoard() {
    const chessBoardElement = document.getElementById('chessBoard');
    if (!chessBoardElement) return;
    
    console.log("Rendering board with selected piece:", this.selectedPiece);
    console.log("Valid moves:", this.validMoves);
    
    renderChessBoard(
      this.boardState, 
      'chessBoard', 
      this.selectedPiece, 
      this.validMoves, 
      this.handleCellClick.bind(this)
    );
  }

  // Handle clicking on a cell
  handleCellClick(row, col) {
    // Check if it's this player's turn
    if (!this.isPlayersTurn()) {
      console.log("Not your turn!");
      return;
    }
    
    console.log(`Clicked cell at visual position: [${row},${col}]`);
    
    // For white player, visual coordinates are the same as logical coordinates
    // For black player on game page, we need to unpermute the column
    const dimensions = this.getCurrentDimensions();
    const isGamePage = document.getElementById('rulesText2') !== null;
    const isBlackPlayer = this.userType === 'black';
    
    // Map visual position to logical position in board state
    let logicalRow = row;
    let logicalCol = col;
    
    // Only transform coordinates for black player
    if (isBlackPlayer && isGamePage) {
      // Apply inverse permutation to column
      const inversePermutationMatrix = dimensions.width === 5 ? 
        create5x5InversePermutationMatrix() : 
        create8x8InversePermutationMatrix();
      
      for (let j = 0; j < inversePermutationMatrix.length; j++) {
        if (inversePermutationMatrix[j][logicalCol] === 1) {
          logicalCol = j;
          break;
        }
      }
    }
    
    console.log(`Logical board position: [${logicalRow},${logicalCol}]`);
    
    // Get the piece at the logical position
    const clickedPiece = this.boardState[logicalRow][logicalCol];
    console.log(`Piece at position: ${clickedPiece || 'empty'}`);
    
    // If a piece is already selected
    if (this.selectedPiece) {
      // Find a valid move that matches the visual position clicked
      const validMove = this.validMoves.find(move => move.visualRow === row && move.visualCol === col);
      
      if (validMove) {
        console.log(`Valid move found to logical position: [${validMove.row},${validMove.col}]`);
        
        // Test the move before making it
        const srcRow = this.selectedPiece.logicalRow;
        const srcCol = this.selectedPiece.logicalCol;
        const targetRow = validMove.row;
        const targetCol = validMove.col;
        
        const originalPiece = this.boardState[targetRow][targetCol];
        const originalPosition = this.boardState[srcRow][srcCol];
        
        // Make temporary move
        this.boardState[targetRow][targetCol] = this.selectedPiece.piece;
        this.boardState[srcRow][srcCol] = null;
        
        // Check if the move would put/leave own king in check
        const wouldBeInCheck = this.isKingInCheck(this.isWhiteTurn);
        
        // Undo temporary move
        this.boardState[srcRow][srcCol] = originalPosition;
        this.boardState[targetRow][targetCol] = originalPiece;
        
        if (wouldBeInCheck) {
          console.log("Cannot move into check!");
          return;
        }
        
        console.log(`Moving ${this.selectedPiece.piece} from [${srcRow},${srcCol}] to [${targetRow},${targetCol}]`);
        
        // Make the actual move
        this.boardState[srcRow][srcCol] = null;
        this.boardState[targetRow][targetCol] = this.selectedPiece.piece;
        
        // Toggle turn
        this.isWhiteTurn = !this.isWhiteTurn;
        
        // Clear selection
        this.selectedPiece = null;
        this.validMoves = [];
        
        // Update game state
        this.updateGameStateOnFirebase();
      } else {
        // If clicked on own piece, select it
        if (this.isOwnPiece(clickedPiece)) {
          console.log(`Selecting new piece: ${clickedPiece}`);
          this.selectedPiece = null;
          this.validMoves = [];
          this.selectPiece(logicalRow, logicalCol, clickedPiece, row, col);
        } else {
          // Deselect if clicked elsewhere
          console.log("Deselecting piece");
          this.selectedPiece = null;
          this.validMoves = [];
        }
      }
    } else {
      // No piece selected yet, select if it's own piece
      if (this.isOwnPiece(clickedPiece)) {
        console.log(`Selecting piece: ${clickedPiece}`);
        this.selectPiece(logicalRow, logicalCol, clickedPiece, row, col);
      }
    }
    
    // Re-render the board
    this.renderBoard();
  }

  // Check if a piece belongs to the current player
  isOwnPiece(piece) {
    if (!piece) return false;
    
    const isPieceWhite = piece.endsWith('w');
    return (this.isWhiteTurn && isPieceWhite) || (!this.isWhiteTurn && !isPieceWhite);
  }

  // Select a piece and calculate valid moves
  selectPiece(logicalRow, logicalCol, piece, visualRow, visualCol) {
    // Store both logical (board state) and visual (screen) positions
    this.selectedPiece = { 
      logicalRow, 
      logicalCol, 
      visualRow,
      visualCol,
      piece 
    };
    
    console.log(`Selecting piece at logical position [${logicalRow},${logicalCol}], visual position [${visualRow},${visualCol}]: ${piece}`);
    
    // Get valid moves based on logical position
    this.validMoves = this.getValidMoves(logicalRow, logicalCol, piece);
    console.log("Valid moves (logical coordinates):", JSON.stringify(this.validMoves));
    
    // For white player, visual coordinates are the same as logical coordinates
    // For black player on game page, we need to permute the column
    const dimensions = this.getCurrentDimensions();
    const isGamePage = document.getElementById('rulesText2') !== null;
    const isBlackPlayer = this.userType === 'black';
    
    // Add visual coordinates to each valid move
    this.validMoves.forEach(move => {
      // Store the original logical position
      move.row = move.row;
      move.col = move.col;
      
      if (isBlackPlayer) {
        // For black player, rows are displayed as-is
        move.visualRow = move.row;
        
        // If on game page, apply permutation to column
        if (isGamePage) {
          const permutationMatrix = dimensions.width === 5 ? 
            create5x5PermutationMatrix() : 
            create8x8PermutationMatrix();
          
          // Find the permuted column
          for (let j = 0; j < permutationMatrix.length; j++) {
            if (permutationMatrix[j][move.col] === 1) {
              move.visualCol = j;
              break;
            }
          }
        } else {
          // Without permutation, visual col is same as logical col
          move.visualCol = move.col;
        }
      } else {
        // For white player, visual coordinates are the same as logical coordinates
        move.visualRow = move.row;
        move.visualCol = move.col;
      }
    });
    
    console.log("Valid moves (with visual coordinates):", JSON.stringify(this.validMoves));
  }

  // Get valid moves for a piece
  getValidMoves(row, col, piece) {
    const moves = [];
    const isPieceWhite = piece.endsWith('w');
    const pieceType = piece.substring(0, piece.length - 1);
    
    // Determine if we're on the game page
    const isGamePage = document.getElementById('rulesText2') !== null;
    
    // Get the piece's move data based on board size and page type
    const moveSet = isGamePage ? 
        (this.boardSize === "8x8" ? escherChessMoves8x8 : escherChessMoves5x13) :
        (this.boardSize === "8x8" ? demoChessMoves8x8 : demoChessMoves5x13);
    
    let pieceMoves;
    let color = isPieceWhite ? 'white' : 'black';
    
    switch(pieceType) {
      case 'p':
        pieceMoves = moveSet.pawn[color].moves;
        break;
      case 'n':
        pieceMoves = moveSet.knight[color].moves;
        break;
      case 'b':
        pieceMoves = moveSet.bishop[color].moves;
        break;
      case 'r':
        pieceMoves = moveSet.rook[color].moves;
        break;
      case 'q':
        pieceMoves = moveSet.queen[color].moves;
        break;
      case 'k':
        pieceMoves = moveSet.king[color].moves;
        break;
      default:
        return [];
    }
    
    // Calculate valid moves based on the piece's move patterns
    for (const moveData of pieceMoves) {
      const [fileOffset, rankOffset] = moveData.move;
      // Skip initial-only moves if not in starting position
      if (moveData.initialOnly) {
        let startingRows;
        // Set starting rows based on board size
        if (BOARD_DIMENSIONS[this.boardSize].width === 5) {
            // White pawns start on rows 1 and 2
            // Black pawns start on rows 10 and 11
            startingRows = isPieceWhite ? [1, 2] : [10, 11];
        } else if (BOARD_DIMENSIONS[this.boardSize].width === 8) {
            // Adjust starting rows for 8x8 configuration
            startingRows = isPieceWhite ? [1] : [6]; // Example: White on 1 and Black on 6
        }

        if (!startingRows.includes(row)) continue;
      }
      
      // For pawns, we need to check diagonal captures and forward movement separately
      if (pieceType === 'p') {
        if (moveData.reqCapture) {
          // This is a diagonal capture move
          const newRow = row + rankOffset;
          const newCol = (col + fileOffset + BOARD_DIMENSIONS[this.boardSize].width) % BOARD_DIMENSIONS[this.boardSize].width; // Apply modulo for horizontal wrapping
          
          if (this.isValidPosition(newRow, newCol)) {
            const targetPiece = this.boardState[newRow][newCol];
            if (targetPiece && !this.isOwnPiece(targetPiece)) {
              moves.push({ row: newRow, col: newCol });
            }
          }
        } else {
          // This is a forward move (non-capturing)
          const newRow = row + rankOffset;
          const newCol = col; // Pawns don't move horizontally for non-captures
          
          if (this.isValidPosition(newRow, newCol)) {
            const targetPiece = this.boardState[newRow][newCol];
            
            // Can only move forward if the square is empty
            if (!targetPiece) {
              moves.push({ row: newRow, col: newCol });
              
              // For two-square initial move, also check if the path is clear
              if (moveData.initialOnly) {
                const intermediateRow = isPieceWhite ? row + 1 : row - 1;
                const intermediatePiece = this.boardState[intermediateRow][newCol];
                
                if (intermediatePiece) {
                  // Remove the two-square move if the path is blocked
                  moves.pop();
                }
              }
            }
          }
        }
      } else {
        // Handle periodic boundaries for horizontal movement
        let newRow = row + rankOffset;
        let newCol = (col + fileOffset + BOARD_DIMENSIONS[this.boardSize].width) % BOARD_DIMENSIONS[this.boardSize].width; // Apply modulo for horizontal wrapping
        
        if (this.isValidPosition(newRow, newCol)) {
          const targetPiece = this.boardState[newRow][newCol];
          
          // Handle jumpy moves (can't be blocked)
          if (moveData.jumpy) {            
            // Check capture requirements
            if (moveData.reqCapture) {
              // Move requires a capture
              if (targetPiece && !this.isOwnPiece(targetPiece)) {
                moves.push({ row: newRow, col: newCol });
              }
            } else {
              // Move doesn't require a capture
              if (!targetPiece || !this.isOwnPiece(targetPiece)) {
                moves.push({ row: newRow, col: newCol });
              }
            }
          } 
          // Handle non-jumpy moves (can be blocked)
          else {
            // Log when processing non-jumpy moves
            if (pieceType === 'b') {
              console.log('Processing non-jumpy bishop move (this should not happen):', moveData);
            }
            
            // Check for obstacles in the path
            let isPathClear = true;
            
            // Only check path for sliding pieces (bishop, rook) with moves of distance > 1
            if (Math.abs(fileOffset) > 1 || Math.abs(rankOffset) > 1) {
              const rowStep = Math.sign(rankOffset);
              const colStep = Math.sign(fileOffset);
              let checkRow = row + rowStep;
              let checkCol = (col + colStep + BOARD_DIMENSIONS[this.boardSize].width) % BOARD_DIMENSIONS[this.boardSize].width;
              
              // Check each square in the path
              while ((checkRow !== newRow || checkCol !== newCol) && isPathClear) {
                if (this.boardState[checkRow][checkCol] !== null) {
                  isPathClear = false;
                }
                checkRow += rowStep;
                checkCol = (checkCol + colStep + BOARD_DIMENSIONS[this.boardSize].width) % BOARD_DIMENSIONS[this.boardSize].width;
              }
            }
            
            if (isPathClear) {
              // Check capture requirements
              if (moveData.reqCapture) {
                // Move requires a capture
                if (targetPiece && !this.isOwnPiece(targetPiece)) {
                  moves.push({ row: newRow, col: newCol });
                }
              } else {
                // Move doesn't require a capture
                if (!targetPiece || !this.isOwnPiece(targetPiece)) {
                  moves.push({ row: newRow, col: newCol });
                }
              }
            }
          }
        }
      }
    }
    
    return moves;
  }

  // Check if a position is valid on the board
  isValidPosition(row, col) {
    // Col is always valid due to periodic boundaries
    return row >= 0 && row < BOARD_DIMENSIONS[this.boardSize].height;
  }

  updateBoardSizeDisplay() {
    const boardSizeDisplay = document.getElementById('boardSizeDisplay');
    if (boardSizeDisplay) {
      boardSizeDisplay.textContent = `Current Board Size: ${this.boardSize}`;
    }
  }

  // Update createConfiguredBoard to handle configuration safely
  createConfiguredBoard() {
    const board = this.createEmptyBoard();
    const isGamePage = document.getElementById('rulesText2') !== null;
    console.log("Is game page:", isGamePage);
    const config = isGamePage ?
        (this.boardSize === "8x8" ? INITIAL_BOARD_CONFIG_8x8_ESCHER : INITIAL_BOARD_CONFIG_5x13_ESCHER) :
        (this.boardSize === "8x8" ? INITIAL_BOARD_CONFIG_8x8 : INITIAL_BOARD_CONFIG_5x13);
    
    if (!config) {
      console.error(`No configuration found for board size ${this.boardSize}`);
      return board;
    }
    
    config.forEach(piece => {
      if (piece && piece.row !== undefined && piece.col !== undefined && piece.type) {
        // Check if the position is within bounds
        if (piece.row < board.length && piece.col < board[0].length) {
          board[piece.row][piece.col] = piece.type;
        } else {
          console.error(`Invalid position in config: row ${piece.row}, col ${piece.col}`);
        }
      } else {
        console.error('Invalid piece configuration:', piece);
      }
    });
    
    return board;
  }

  // Update the rules text when board size changes
  updateRulesText() {
    // Try to find either rulesText (demo page) or rulesText2 (game page)
    const rulesContainer = document.getElementById('rulesText') || document.getElementById('rulesText2');
    if (!rulesContainer) {
        console.error('Rules container not found! Looking for element with id "rulesText" or "rulesText2"');
        return;
    }
    rulesContainer.innerHTML = this.getRulesText();
  }

  // Get the rules text based on board size
  getRulesText() {
    console.log("Getting rules text for board size:", this.boardSize);
    // Check if we're on the game page by looking for rulesText2
    const isGamePage = document.getElementById('rulesText2') !== null;

    if (isGamePage) {
        if (this.boardSize === "8x8") {
            return `
                <p style="text-align: justify; max-width: 600px; margin: 20px auto; padding: 10px;">
                    Welcome to the real game of Escher Chess! The rules here are similar to what you learned in the demo, but with a twist.
                    The black player's pieces will move in ways that may seem strange at first. Trust your eyes and experiment with your moves.
                    Remember that this is still a complete information game - all the information you need is visible on your screen.
                    <br><br>
                    The files are labeled: E, D, S, U, C, A, H, L
                    <br><br>
                    Your goal remains the same: capture your opponent's king to win the game.
                </p>
            `;
        } else {
            return `
                <p style="text-align: justify; max-width: 600px; margin: 20px auto; padding: 10px;">
                    Welcome to the real game of Escher Chess! The rules here are similar to what you learned in the demo, but with a twist.
                    The black player's pieces will move in ways that may seem strange at first. Trust your eyes and experiment with your moves.
                    Remember that this is still a complete information game - all the information you need is visible on your screen.
                    <br><br>
                    The files are labeled: D, R, E, A, M
                    <br><br>
                    Your goal remains the same: capture your opponent's king to win the game.
                </p>
            `;
        }
    } else {
        // Return the original demo page text
        if (this.boardSize === "8x8") {
            return `
        <p style="text-align: justify; max-width: 600px; margin: 20px auto; padding: 10px;">
          Regular Chess Rules Apply:
          <br><br>
          This is a standard 8x8 chess board configuration. All pieces move according to traditional chess rules:
          <br><br>
          • Pawns move forward one square at a time, or two squares on their first move
          <br>
          • Knights move in an L-shape pattern
          <br>
          • Bishops move diagonally any number of squares
          <br>
          • Rooks move horizontally or vertically any number of squares
          <br>
          • Kings move one square in any direction
          <br><br>
          Standard chess rules for check, checkmate, and piece capture apply.
        </p>
      `;
        } else {
            return `
        <p style="text-align: justify; max-width: 600px; margin: 20px auto; padding: 10px;"> 
          Escher Chess Rules:
          <br><br>
          In this variant of chess, one player's pieces will move a little bit strangely whereas the other player's pieces will move very bizarrely. Who is who
          will be decided later. To start, however, let's learn all of the rules which both players will have in common. Both players should start by moving 
          one of their knights around the field. This reveals the first oddity of Escher Chess: 
          <br><br>
          Rule 1: This game is played on a cylindrical board (a.k.a., a Pac-Man-style world). That is, the left edge of your board should be thought of as being
          adjacent to its right edge and vice versa.
          <br><br>
          Next, both players should advance their front-center pawns either one or two spaces forward in order to free up one of their bishops. Moving this 
          bishop out into the open reveals the second rule of Escher Chess:
          <br><br>
          Rule 2: All diagonal movement is short-ranged. Bishops (and Queens, if there were any) can only move two spaces diagonally.
          <br><br>
          Once you are comfortable with how this bishop moves, try to move your other bishop. Perhaps surprisingly it can move! This is a specific instance of
          a more general rule:
          <br><br>    
          Rule 3: All horizontal movement is jumpy (e.g., like a knight's move). This rule also applies to rooks, but only when they are moving horizontally 
          (try it out for yourself).
          <br><br>
          Lastly there are a few simplifying rules worth mentioning briefly:
          <br><br>    
          Rule 4: There is no en passant in Escher Chess. There is no castling. There are no queens, and there is no promotion to queens.
          <br><br>
          Feel free now to reset the demo game in order to get more familiar with these rules. Or if you feel comfortable with these rules already then you can
          go ahead and proceed to the real game (linked below).     
        </p>
      `;
        }
    }
  }

  // Check if a king is in check
  isKingInCheck(isWhiteKing) {
    // Find the king's position
    let kingRow = -1, kingCol = -1;
    const kingPiece = isWhiteKing ? PIECE_TYPES.WHITE_KING : PIECE_TYPES.BLACK_KING;
    
    for (let row = 0; row < this.boardState.length; row++) {
      for (let col = 0; col < this.boardState[row].length; col++) {
        if (this.boardState[row][col] === kingPiece) {
          kingRow = row;
          kingCol = col;
          break;
        }
      }
      if (kingRow !== -1) break;
    }
    
    // Check if any opponent's piece can capture the king
    for (let row = 0; row < this.boardState.length; row++) {
      for (let col = 0; col < this.boardState[row].length; col++) {
        const piece = this.boardState[row][col];
        if (piece && (piece.endsWith('w') !== isWhiteKing)) {
          const moves = this.getValidMoves(row, col, piece);
          if (moves.some(move => move.row === kingRow && move.col === kingCol)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // Check if a king is in checkmate
  isKingInCheckmate(isWhiteKing) {
    if (!this.isKingInCheck(isWhiteKing)) return false;
    
    // Try all possible moves for all pieces of the king's color
    for (let row = 0; row < this.boardState.length; row++) {
      for (let col = 0; col < this.boardState[row].length; col++) {
        const piece = this.boardState[row][col];
        if (piece && (piece.endsWith('w') === isWhiteKing)) {
          const moves = this.getValidMoves(row, col, piece);
          
          // Try each move
          for (const move of moves) {
            // Make temporary move
            const originalPiece = this.boardState[move.row][move.col];
            const originalPosition = this.boardState[row][col];
            this.boardState[move.row][move.col] = piece;
            this.boardState[row][col] = null;
            
            // Check if king is still in check
            const stillInCheck = this.isKingInCheck(isWhiteKing);
            
            // Undo move
            this.boardState[row][col] = originalPosition;
            this.boardState[move.row][move.col] = originalPiece;
            
            // If any move gets out of check, not checkmate
            if (!stillInCheck) return false;
          }
        }
      }
    }
    return true;
  }

  // Update game status display
  updateGameStatus() {
    const statusDisplay = document.getElementById('gameStatus');
    if (!statusDisplay) return;
    
    const whiteInCheck = this.isKingInCheck(true);
    const blackInCheck = this.isKingInCheck(false);
    const whiteInCheckmate = this.isKingInCheckmate(true);
    const blackInCheckmate = this.isKingInCheckmate(false);
    
    let statusText = '';
    if (whiteInCheckmate) {
      statusText = 'White is in checkmate! Black wins!';
    } else if (blackInCheckmate) {
      statusText = 'Black is in checkmate! White wins!';
    } else if (whiteInCheck) {
      statusText = 'White is in check!';
    } else if (blackInCheck) {
      statusText = 'Black is in check!';
    }
    
    statusDisplay.textContent = statusText;
  }

  // Modify the changeBoardSize method to update rules text
  changeBoardSize() {
    console.log("Changing board size from", this.boardSize);
    this.boardSize = this.boardSize === "5x13" ? "8x8" : "5x13";
    console.log("New board size:", this.boardSize);
    
    // Always update localStorage immediately
    localStorage.setItem("boardSize", this.boardSize);
    console.log("Updated localStorage boardSize to:", this.boardSize);
    console.log("localStorage.boardSize now =", localStorage.getItem("boardSize"));
    
    // Reset game with new board size
    console.log("Resetting game with new board size");
    this.boardState = this.initializeBoard();
    this.isWhiteTurn = true;
    this.selectedPiece = null;
    this.validMoves = [];
    
    // Update all UI elements
    this.updateBoardSizeDisplay();
    console.log("Calling updateRulesText from changeBoardSize");
    this.updateRulesText();
    this.renderBoard();
    this.updateTurnDisplay();
    this.updateGameStatus();
    
    // Save to Firebase with the new board size
    this.updateGameStateOnFirebase().then(() => {
      console.log("Game state updated on Firebase with new board size:", this.boardSize);
    });
  }

  // Modify the renderBoard method to update game status
  renderBoard() {
    renderChessBoard(
      this.boardState, 
      'chessBoard', 
      this.selectedPiece, 
      this.validMoves,
      this.handleCellClick.bind(this)
    );
    this.updateGameStatus();
  }
}

// Initialize and export the game instance
export const escherChessGame = new EscherChessGame();

// Export the standalone rendering function for reuse
export { renderChessBoard };

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded, initializing game...");
  escherChessGame.init().then(() => {
    console.log("Game initialized successfully");
  }).catch(error => {
    console.error("Error initializing game:", error);
  });
});