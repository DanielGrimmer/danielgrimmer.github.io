// List of available game room names
// To add more game rooms, you have to add them to the list below and then change the firebase rules to allow for creating new data.
// Then manually initialize all of the games and then change the firebase possitions back to disallow creating new data.

export const gameRoomNames = [
    "RelativityRoom",
    "MobiusCheck",
    "ImpossibleCastle",
    "WaterfallWar",
    "MysteriousMoves",
    "ParadoxPawn",
    "InfiniteKnight",
    "MirroredGambit",
    "TessellatedTactics",
    "RecursiveRook"
];

import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { firebaseConfig } from './firebaseConfig.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getOldestRoomName() {
  const currentRoom = localStorage.getItem('gameRoomId'); // Get the current room from local storage
  let oldestRoom = null; // Initialize oldestRoom as null
  let oldestTimestamp = Infinity;

  for (const room of gameRoomNames) {
    // Skip the current room
    if (room === currentRoom) {
      continue;
    }

    const roomDocRef = doc(db, "EscherChessGames", `demo_${room}`);
    const docSnap = await getDoc(roomDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const lastUsed = data.lastUsed ? data.lastUsed.toMillis() : 0;
      if (lastUsed < oldestTimestamp) {
        oldestTimestamp = lastUsed;
        oldestRoom = room; // Update oldestRoom if a new oldest is found
      }
    } else {
      // If the room does not exist, you can choose to return it or skip it
      // For this case, we will skip it
      continue;
    }
  }

  // If no valid oldest room was found, return the current room or a default
  return oldestRoom || currentRoom; // Return the oldest room or the current room if none found
}

// Function to validate if a room name exists
export function isValidRoomName(roomName) {
    return gameRoomNames.includes(roomName);
}