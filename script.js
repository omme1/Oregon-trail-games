// game.js
let currentPlayerPosition = 0;
const totalSpaces = 25;
const eventCards = [
    { title: "Broken Wheel", description: "Lose 1 turn while you repair your wagon wheel.", effect: "skipTurn" },
    { title: "Hunting Success", description: "You shot a buffalo! Gain 50 lbs of food.", effect: "addFood", amount: 50 },
    { title: "River Crossing", description: "Pay 10 lbs of food to ferry across the river.", effect: "removeFood", amount: 10 },
    { title: "Illness Strikes", description: "A family member gets sick. Lose 20 lbs of food for medicine.", effect: "removeFood", amount: 20 },
    { title: "Friendly Trader", description: "A trader gives you 30 lbs of food.", effect: "addFood", amount: 30 },
    { title: "Bad Weather", description: "Storm delays your journey. Lose 2 turns.", effect: "skipTurn", amount: 2 },
    { title: "Native Guide", description: "A native guide helps you find a shortcut. Move ahead 3 spaces.", effect: "move", amount: 3 },
    { title: "Wrong Turn", description: "You took a wrong path. Move back 2 spaces.", effect: "move", amount: -2 }
];

let playerStats = {
    food: 100,
    health: 100,
    turns: 0,
    skipTurns: 0
};

function rollDice() {
    if (playerStats.skipTurns > 0) {
        playerStats.skipTurns--;
        document.getElementById('status').textContent = `Skipping turn (${playerStats.skipTurns} left). Cannot move this turn.`;
        return;
    }

    const diceRoll = Math.floor(Math.random() * 3) + 1; // 1-6
    movePlayer(diceRoll);
    playerStats.turns++;
    updateStatus();
}

function movePlayer(spaces) {
    currentPlayerPosition += spaces;
    
    if (currentPlayerPosition >= totalSpaces) {
        currentPlayerPosition = totalSpaces;
        showPopup("Congratulations! You've reached Oregon and won the game!");
        return;
    }
    
    document.getElementById('status').textContent = `You rolled a ${spaces}! Moved to space ${currentPlayerPosition}.`;
    
    // Trigger event card when landing on a space
    if (spaces > 0) {
        triggerEvent();
    }
}

function triggerEvent() {
    const randomCardIndex = Math.floor(Math.random() * eventCards.length);
    const card = eventCards[randomCardIndex];
    
    let message = `${card.title}: ${card.description}`;
    
    switch(card.effect) {
        case "skipTurn":
            playerStats.skipTurns = card.amount || 1;
            break;
        case "addFood":
            playerStats.food += card.amount;
            message += ` You now have ${playerStats.food} lbs of food.`;
            break;
        case "removeFood":
            playerStats.food = Math.max(0, playerStats.food - card.amount);
            message += ` You now have ${playerStats.food} lbs of food.`;
            break;
        case "move":
            movePlayer(card.amount);
            message += ` Moved to space ${currentPlayerPosition}.`;
            break;
    }
    
    showPopup(message);
    checkGameOver();
}

function showPopup(message) {
    document.getElementById('popupText').textContent = message;
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

function checkGameOver() {
    if (playerStats.food <= 0) {
        showPopup("Game Over! You've run out of food and starved to death.");
    } else if (playerStats.health <= 0) {
        showPopup("Game Over! Your health has deteriorated too much.");
    }
}

function updateStatus() {
    const statusElement = document.getElementById('status');
    statusElement.textContent = `Space: ${currentPlayerPosition} | Food: ${playerStats.food} lbs | Health: ${playerStats.health}% | Turns: ${playerStats.turns}`;
}

// Initialize the game
updateStatus();
