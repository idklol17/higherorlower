// --- JSONBin.io Leaderboard Configuration ---
const JSONBIN_BIN_ID = '683805bc8960c979a5a28af2'; // Your provided Bin ID
const JSONBIN_SECRET_KEY = '$2a$10$f70uReJz0DPw8f.h9AN4fu0XspUA3cs3pKerRqXOLGB4Na9PFTare'; // *** IMPORTANT: Replace this with your actual Master Key from your JSONBin.io account settings ***
const LEADERBOARD_API_URL = `https://api.jsonbin.io/v3/b/${683805bc8960c979a5a28af2}`;
const MAX_LEADERBOARD_ENTRIES = 10; // Display top 10 scores
// ------------------------------------------

// Get references to HTML elements
const currentNumberDisplay = document.getElementById('current-number');
const scoreDisplay = document.getElementById('score');
const higherBtn = document.getElementById('higher-btn');
const lowerBtn = document.getElementById('lower-btn');
const startBtn = document.getElementById('start-btn');
const messageDisplay = document.getElementById('message');

// Leaderboard HTML elements
const leaderboardList = document.getElementById('leaderboard-list');
const leaderboardLoading = document.getElementById('leaderboard-loading');


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

    // Hide leaderboard while game is active
    leaderboardList.classList.add('hidden');
    leaderboardLoading.classList.add('hidden');
}

// Function to handle a player's guess
function handleGuess(guessType) {
    if (!gameActive) {
        return; // Do nothing if game is not active
    }

    const nextNumber = getRandomNumber();
    let correct = false;

    // Determine if the guess is correct (allowing equal numbers to be correct)
    if (guessType === 'higher') {
        correct = (nextNumber >= currentNumber);
    } else if (guessType === 'lower') {
        correct = (nextNumber <= currentNumber);
    }

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

            // Handle score submission to leaderboard
            if (score > 0) { // Only prompt for name if score is greater than 0
                promptForNameAndSubmitScore(score);
            } else {
                displayLeaderboard(); // Just display if score is 0
            }
        }
    }, 400); // Small delay to allow animation to play
}

// Function to add and remove animation class for the number display
function addNumberAnimation() {
    currentNumberDisplay.classList.remove('grow'); // Remove in case it's still there
    // Trigger reflow to restart animation (important for CSS animations)
    void currentNumberDisplay.offsetWidth;
    currentNumberDisplay.classList.add('grow');
}

// Function to prompt for name and submit score
async function promptForNameAndSubmitScore(finalScore) {
    let playerName = prompt(`You scored ${finalScore}! Enter your name for the leaderboard:`);

    if (playerName === null || playerName.trim() === '') {
        playerName = 'Anonymous'; // Default name if cancelled or empty
    } else {
        playerName = playerName.trim().substring(0, 20); // Limit name length to 20 characters
    }

    await submitScore(playerName, finalScore);
    await displayLeaderboard(); // Refresh leaderboard after submission
}

// Function to submit score to JSONBin.io
async function submitScore(playerName, finalScore) {
    try {
        // 1. Fetch current leaderboard data (the entire bin content object)
        const response = await fetch(LEADERBOARD_API_URL, {
            headers: {
                'X-Master-Key': JSONBIN_SECRET_KEY, // Required for reading
                'X-Bin-Meta': 'false' // Don't return metadata, just the data
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        let binContent = await response.json(); // Get the whole JSON object from the bin
        // Access the 'leaderboard' array from within the bin content object
        let leaderboardData = binContent.leaderboard || []; 

        // Ensure leaderboardData is an array, initialize if not
        if (!Array.isArray(leaderboardData)) {
            leaderboardData = [];
        }

        // 2. Add new score
        leaderboardData.push({
            name: playerName,
            score: finalScore,
            date: new Date().toISOString() // Store date (useful for tie-breaking or display)
        });

        // 3. Sort by score (descending)
        leaderboardData.sort((a, b) => b.score - a.score);

        // 4. Keep only top N entries
        if (leaderboardData.length > MAX_LEADERBOARD_ENTRIES) {
            leaderboardData = leaderboardData.slice(0, MAX_LEADERBOARD_ENTRIES);
        }

        // 5. Update the bin with the new data
        const updateResponse = await fetch(LEADERBOARD_API_URL, {
            method: 'PUT', // Use PUT to overwrite the bin's content
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_SECRET_KEY // Crucial for writing/updating
            },
            // Wrap the updated leaderboardData array back into the 'leaderboard' key of an object
            body: JSON.stringify({ leaderboard: leaderboardData }) 
        });

        if (!updateResponse.ok) {
            throw new Error(`Failed to update leaderboard: ${updateResponse.status} - ${updateResponse.statusText}`);
        }

        console.log('Score submitted successfully!');

    } catch (error) {
        console.error('Error submitting score:', error);
        messageDisplay.textContent = 'Error updating leaderboard. Check console.';
    }
}

// Function to fetch and display the leaderboard
async function displayLeaderboard() {
    leaderboardLoading.classList.remove('hidden'); // Show loading message
    leaderboardList.classList.add('hidden'); // Hide list while loading
    leaderboardList.innerHTML = ''; // Clear previous entries

    try {
        const response = await fetch(LEADERBOARD_API_URL, {
            headers: {
                'X-Master-Key': JSONBIN_SECRET_KEY, // For reading private bins (or consistent auth for this API)
                'X-Bin-Meta': 'false' // Don't return metadata
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        const binContent = await response.json(); // Get the whole JSON object
        const leaderboardData = binContent.leaderboard || []; // Access the 'leaderboard' array

        if (Array.isArray(leaderboardData) && leaderboardData.length > 0) {
            leaderboardData.forEach((entry, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<span>${index + 1}. ${entry.name}</span> <span>${entry.score}</span>`;
                leaderboardList.appendChild(listItem);
            });
            leaderboardList.classList.remove('hidden'); // Show the list
            leaderboardLoading.classList.add('hidden'); // Hide loading
        } else {
            leaderboardList.innerHTML = '<li>No scores yet! Be the first!</li>';
            leaderboardList.classList.remove('hidden');
            leaderboardLoading.classList.add('hidden');
        }

    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        leaderboardList.innerHTML = '<li>Error loading leaderboard.</li>';
        leaderboardList.classList.remove('hidden');
        leaderboardLoading.classList.add('hidden');
    }
}

// Event Listeners
startBtn.addEventListener('click', startGame);
higherBtn.addEventListener('click', () => handleGuess('higher'));
lowerBtn.addEventListener('click', () => handleGuess('lower'));

// Initial setup: hide game buttons and show start button
higherBtn.style.display = 'none';
lowerBtn.style.display = 'none';
messageDisplay.textContent = 'Press Start to Play!';

// Load leaderboard on page load
displayLeaderboard();
