console.log("MobiusEuclidLogic.js loaded");

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, getDoc, runTransaction } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { firebaseConfig } from './firebaseConfig.js';
import { gameRoomNames, getOldestRoomName, isValidRoomName } from './MobiusEuclidGameRooms.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized");

class MobiusEuclidSetup {
  constructor() {
    // Initialize properties
    this.gameRoomId = localStorage.getItem('gameRoomId') || '';
    this.userType = localStorage.getItem('userType') || 'mobius'; // Default to "mobius"
    this.userPersp = localStorage.getItem('userPersp') || 'mobius';
    
    // Initialize the game
    this.init();
  }

  init() {
    // Get or set game room
    this.gameRoomId = localStorage.getItem("gameRoomId");
    
    // Make sure we're using a valid room from our predefined list
    if (!this.gameRoomId || !isValidRoomName(this.gameRoomId)) {
        this.gameRoomId = gameRoomNames[0];
        localStorage.setItem("gameRoomId", this.gameRoomId);
        console.log("Setting initial game room to:", this.gameRoomId);
    }
    // Set up event listeners when the DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.setupEventListeners();
      this.updateCurrentRoomDisplay();
      this.updatePlayerTypeDisplay();
    });
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
      roomInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
          this.handleJoinRoom();
        }
      });
    }

    // Player type button
    const changePlayerTypeButton = document.getElementById('changePlayerTypeButton');
    if (changePlayerTypeButton) {
      changePlayerTypeButton.addEventListener('click', () => this.changePlayerType());
    }
  }

  // Handle clicking on next room button
  async handleNextRoom() {
    try {
      // Get the oldest room and update local storage
      const oldestRoom = await getOldestRoomName();
      if (oldestRoom) {
        this.gameRoomId = oldestRoom;
        localStorage.setItem('gameRoomId', oldestRoom);
        console.log(`Joined room: ${oldestRoom}`);
        this.updateCurrentRoomDisplay();
      } else {
        console.error('No available room found');
        alert('No available rooms found. Please try again later.');
      }
    } catch (error) {
      console.error('Error getting next room:', error);
      alert('Error getting next room. Please try again.');
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
      gameLink.href = `MobiusEuclidGameV1.0.html?room=${this.gameRoomId}`;
    }
  }

  // Update the player type display
  updatePlayerTypeDisplay() {
    const playerTypeDisplay = document.getElementById('playerTypeDisplay');
    if (playerTypeDisplay) {
      playerTypeDisplay.textContent = `You are playing as ${this.userType === "mobius" ? 'Mobius' : 'Euclid'}`;
    }
  }
  
  // Change player type (toggle between mobius and euclid)
  changePlayerType() {
    this.userType = this.userType === "mobius" ? "euclid" : "mobius";
    this.userPersp = this.userType;
    localStorage.setItem("userType", this.userType);
    localStorage.setItem("userPersp", this.userPersp);
    this.updatePlayerTypeDisplay();
    console.log(`Player type changed to: ${this.userType}`);
  }
}

// Initialize the game when the script loads
const game = new MobiusEuclidSetup();