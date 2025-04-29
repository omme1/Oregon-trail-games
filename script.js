// game.js
let currentPlayerPosition = 0;
const totalSpaces = 25;
const MIN_TURNS_TO_WIN = 8;
const eventCards = [
    { title: "Broken Wheel", description: "Lose 1 turn while you repair your wagon wheel.", effect: "skipTurn" },
    { title: "Hunting Success", description: "You shot a buffalo! Gain 50 lbs of food.", effect: "addFood", amount: 50 },
    { title: "River Crossing", description: "Pay 10 lbs of food to ferry across the river.", effect: "removeFood", amount: 10 },
    { title: "Illness Strikes", description: "A family member gets sick. Lose 20 lbs of food for medicine.", effect: "removeFood", amount: 20 },
    { title: "Friendly Trader", description: "A trader gives you 30 lbs of food.", effect: "addFood", amount: 30 },
    { title: "Bad Weather", description: "Storm delays your journey. Lose 2 turns.", effect: "skipTurn", amount: 2 },
    { title: "Native Guide", description: "A native guide helps you find a shortcut. Move ahead 3 spaces.", effect: "move", amount: 3 },
    { title: "Wrong Turn", description: "You took a wrong path. Move back 2 spaces.", effect: "move", amount: -2 },
    // New event cards
    { title: "Oxen Injury", description: "Your oxen are injured. Lose 15 health and 10 food.", effect: "multi", effects: [
        {type: "removeHealth", amount: 15},
        {type: "removeFood", amount: 10}
    ]},
    { title: "Abandoned Supplies", description: "You found abandoned supplies! Gain 25 food.", effect: "addFood", amount: 25 },
    { title: "Dysentery", description: "A family member contracts dysentery! Lose 30 health.", effect: "removeHealth", amount: 30 },
    { title: "Friendly Natives", description: "Natives share food with you. Gain 40 food.", effect: "addFood", amount: 40 },
    { title: "Snake Bite", description: "You're bitten by a rattlesnake! Lose 25 health.", effect: "removeHealth", amount: 25 },
    { title: "Gold Rush!", description: "You find gold! Gain 50 food and move ahead 1 space.", effect: "multi", effects: [
        {type: "addFood", amount: 50},
        {type: "move", amount: 1}
    ]},
    { title: "Wagon Fire", description: "Your wagon catches fire! Lose 20 food and 15 health.", effect: "multi", effects: [
        {type: "removeFood", amount: 20},
        {type: "removeHealth", amount: 15}
    ]},
    { title: "Miraculous Healing", description: "A traveling doctor helps your party. Gain 30 health.", effect: "addHealth", amount: 30 }
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

    const diceRoll = Math.floor(Math.random() * 3) + 1; // Now 1-3
    movePlayer(diceRoll);
    playerStats.turns++;
    updateStatus();
}

function movePlayer(spaces) {
    currentPlayerPosition += spaces;
    
    if (currentPlayerPosition >= totalSpaces) {
        if (playerStats.turns >= MIN_TURNS_TO_WIN) {
            currentPlayerPosition = totalSpaces;
            showPopup(`Congratulations! You've reached Oregon in ${playerStats.turns} turns and won the game!`);
        } else {
            const turnsNeeded = MIN_TURNS_TO_WIN - playerStats.turns;
            currentPlayerPosition = totalSpaces - 1;
            showPopup(`You arrived too quickly! Wait ${turnsNeeded} more turn(s) before you can settle.`);
        }
        return;
    }
    
    document.getElementById('status').textContent = `You rolled a ${spaces}! Moved to space ${currentPlayerPosition}.`;
    
    // 70% chance of event when landing on a space
    if (spaces > 0 && Math.random() < 0.7) {
        triggerEvent();
    }
}

function triggerEvent() {
    const randomCardIndex = Math.floor(Math.random() * eventCards.length);
    const card = eventCards[randomCardIndex];
    
    let message = `${card.title}: ${card.description}`;
    
    if (card.effect === "multi") {
        card.effects.forEach(effect => {
            applyEffect(effect, message);
        });
    } else {
        applyEffect({type: card.effect, amount: card.amount}, message);
    }
    
    showPopup(message);
    checkGameOver();
}

function applyEffect(effect, message) {
    switch(effect.type) {
        case "skipTurn":
            playerStats.skipTurns = effect.amount || 1;
            break;
        case "addFood":
            playerStats.food += effect.amount;
            message += ` You now have ${playerStats.food} lbs of food.`;
            break;
        case "removeFood":
            playerStats.food = Math.max(0, playerStats.food - effect.amount);
            message += ` You now have ${playerStats.food} lbs of food.`;
            break;
        case "addHealth":
            playerStats.health = Math.min(100, playerStats.health + effect.amount);
            message += ` Your health is now ${playerStats.health}%.`;
            break;
        case "removeHealth":
            playerStats.health = Math.max(0, playerStats.health - effect.amount);
            message += ` Your health is now ${playerStats.health}%.`;
            break;
        case "move":
            movePlayer(effect.amount);
            message += ` Moved to space ${currentPlayerPosition}.`;
            break;
    }
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
    statusElement.textContent = `Space: ${currentPlayerPosition}/${totalSpaces} | Food: ${playerStats.food} lbs | Health: ${playerStats.health}% | Turns: ${playerStats.turns} (Need ${MIN_TURNS_TO_WIN})`;
}

// Initialize the game
updateStatus();
