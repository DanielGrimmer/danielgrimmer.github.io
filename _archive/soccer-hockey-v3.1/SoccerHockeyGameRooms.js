// List of available game room names
// To add more game rooms, you have to add them to the list below and then change the firebase rules to allow for creating new data.
// Then manually initialize all of the games and then change the firebase possitions back to disallow creating new data.

export const gameRoomNames = [
    "RedPuck",
    "BlueGoal",
    "GreenField",
    "GoldMedal",
    "SilverStick",
    "BronzeBall",
    "PurpleNet",
    "OrangeRink",
    "WhiteStripes",
    "BlackSkates"
];

// Function to get the next room name in the cycle
export function getNextRoomName(currentRoom) {
    if (!currentRoom) return gameRoomNames[0];
    const currentIndex = gameRoomNames.indexOf(currentRoom);
    if (currentIndex === -1) return gameRoomNames[0];
    return gameRoomNames[(currentIndex + 1) % gameRoomNames.length];
}

// Function to validate if a room name exists
export function isValidRoomName(roomName) {
    return gameRoomNames.includes(roomName);
} 