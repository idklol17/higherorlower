// Get references to HTML elements
const currentNumberDisplay = document.getElementById('current-number');
const scoreDisplay = document.getElementById('score');
const higherBtn = document.getElementById('higher-btn');
const lowerBtn = document.getElementById('lower-btn');
const startBtn = document.getElementById('start-btn');
const messageDisplay = document.getElementById('message');

// Game state variables
let currentNumber = 0;
let score = 0;
let gameActive = false; // To control if the game is currently running

// Function to generate a random number between 1 and 100
function getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

// Function to start or restart the game
function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    currentNumber = getRandomNumber();
    currentNumberDisplay.textContent = currentNumber;
    messageDisplay.textContent = 'Guess higher or lower!';
    gameActive = true;
    startBtn.style.display = 'none'; // Hide start button during gameplay
    higherBtn.style.display = 'inline-block'; // Show game buttons
    lowerBtn.style.display = 'inline-block';
    addNumberAnimation(); // Add animation to the starting number
}

// Function to handle a player's guess
function handleGuess(guessType) {
    if (!gameActive) {
        return; // Do nothing if game is not active
    }

    const nextNumber = getRandomNumber();
    let correct = false;

    if (guessType === 'higher') {
        correct = (nextNumber >= currentNumber); // If next is higher or equal, it's correct
    } else if (guessType === 'lower') {
        correct = (nextNumber <= currentNumber); // If next is lower or equal, it's correct
    }

    // Display the next number quickly before setting it as current
    currentNumberDisplay.textContent = nextNumber;
    addNumberAnimation(); // Add animation to the number display

    // Give a brief moment for the animation/user to see the next number
    setTimeout(() => {
        if (correct) {
            score++;
            scoreDisplay.textContent = score;
            currentNumber = nextNumber; // Update current number for the next round
            messageDisplay.textContent = 'Correct!';
        } else {
            messageDisplay.textContent = `Game Over! Your score: ${score}`;
            gameActive = false; // End the game
            startBtn.textContent = 'Play Again'; // Change button text
            startBtn.style.display = 'block'; // Show start button
            higherBtn.style.display = 'none'; // Hide game buttons
            lowerBtn.style.display = 'none';
        }
    }, 400); // Small delay to allow animation to play
}

// Function to add and remove animation class for the number display
function addNumberAnimation() {
    currentNumberDisplay.classList.remove('grow'); // Remove in case it's still there
    // Trigger reflow to restart animation
    void currentNumberDisplay.offsetWidth; 
    currentNumberDisplay.classList.add('grow');
}

// Event Listeners
startBtn.addEventListener('click', startGame);
higherBtn.addEventListener('click', () => handleGuess('higher'));
lowerBtn.addEventListener('click', () => handleGuess('lower'));

// Initial setup: hide game buttons and show start button
higherBtn.style.display = 'none';
lowerBtn.style.display = 'none';
messageDisplay.textContent = 'Press Start to Play!';
