document.addEventListener('DOMContentLoaded', () => {
    const playerNameInput = document.getElementById('playerName');
    const startGameButton = document.getElementById('startGameButton');
    const nameSetupDiv = document.getElementById('name-setup');
    const gamePlayDiv = document.getElementById('game-play');
    const displayPlayerNameSpan = document.getElementById('displayPlayerName');
    const clickCountSpan = document.getElementById('clickCount');
    const clickButton = document.getElementById('clickButton');
    const leaderboardList = document.getElementById('leaderboard-list');

    let playerName = "Anonymous";
    let clickCount = 0;

    // --- JSONBin.io Configuration ---
    // Make sure your Bin ID and Master Key are correctly set here
    const JSONBIN_BIN_ID = '683805bc8960c979a5a28af2'; // Your provided Bin ID
    const JSONBIN_MASTER_KEY = '$2a$10$f70uReJz0DPw8f.h9AN4fu0XspUA3cs3pKerRqXOLGB4Na9PFTare'; // Your provided Secret Key
    const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

    // --- Game Initialization ---
    startGameButton.addEventListener('click', () => {
        const inputName = playerNameInput.value.trim();
        if (inputName) {
            playerName = inputName;
        }
        displayPlayerNameSpan.textContent = playerName;
        nameSetupDiv.style.display = 'none';
        gamePlayDiv.style.display = 'block';
        loadLeaderboard(); // Load leaderboard when game starts
    });

    // --- Click Logic ---
    clickButton.addEventListener('click', () => {
        clickCount++;
        clickCountSpan.textContent = clickCount;
    });

    // --- Leaderboard Interaction with JSONBin.io ---

    async function loadLeaderboard() {
        try {
            const response = await fetch(JSONBIN_URL, {
                method: 'GET',
                headers: {
                    'X-Master-Key': JSONBIN_MASTER_KEY, // Use Master Key for read access
                    'X-Bin-Meta': 'false' // Get only the content, not metadata
                }
            });

            if (response.ok) {
                const scores = await response.json(); // Data should be directly the array if X-Bin-Meta is false

                // Ensure scores is an array, in case the bin is empty or malformed
                const validScores = Array.isArray(scores) ? scores : [];

                // Sort scores (descending by score, then ascending by timestamp for tie-breaking)
                validScores.sort((a, b) => {
                    if (b.score !== a.score) {
                        return b.score - a.score;
                    }
                    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                });

                leaderboardList.innerHTML = ''; // Clear existing list
                validScores.slice(0, 10).forEach((entry, index) => { // Display top 10
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <span>#${index + 1} ${entry.name}</span>
                        <span>${entry.score} Clicks</span>
                    `;
                    leaderboardList.appendChild(listItem);
                });
            } else {
                console.error('Failed to load leaderboard from JSONBin:', response.statusText);
                // If the bin is empty or not found, it might return a 404 or other error.
                // In this case, just clear the leaderboard or show a message.
                leaderboardList.innerHTML = '<li>No scores yet. Be the first!</li>';
            }
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            leaderboardList.innerHTML = '<li>Error loading leaderboard.</li>';
        }
    }

    async function saveScore() {
        // First, get the current scores to update it
        try {
            const getResponse = await fetch(JSONBIN_URL, {
                method: 'GET',
                headers: {
                    'X-Master-Key': JSONBIN_MASTER_KEY,
                    'X-Bin-Meta': 'false' // Get only the content
                }
            });

            let currentScores = [];
            if (getResponse.ok) {
                const data = await getResponse.json();
                currentScores = Array.isArray(data) ? data : []; // Ensure it's an array
            } else if (getResponse.status !== 404) { // 404 means bin is empty/not found, which is fine
                console.error('Failed to retrieve current scores before saving:', getResponse.statusText);
                alert('Failed to get current scores. Please try again.');
                return;
            }

            // Add the new score only if it's not zero and a valid number
            if (clickCount > 0) {
                currentScores.push({ name: playerName, score: clickCount, timestamp: new Date().toISOString() });
            }

            // OPTIONAL: Limit the number of entries in the leaderboard to keep it manageable
            // Sort to keep top scores, then slice
            currentScores.sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(); // Keep earlier timestamp for ties
            });
            currentScores = currentScores.slice(0, 100); // Keep only top 100 entries

            // Update the bin with the new array of scores
            const updateResponse = await fetch(JSONBIN_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_MASTER_KEY, // Master Key is required for PUT operations
                    'Content-Length': JSON.stringify(currentScores).length // Important for JSONBin.io PUT requests
                },
                body: JSON.stringify(currentScores)
            });

            if (updateResponse.ok) {
                console.log('Score saved successfully to JSONBin!');
                loadLeaderboard(); // Reload leaderboard after saving
            } else {
                console.error('Failed to save score to JSONBin:', updateResponse.statusText);
                const errorData = await updateResponse.text();
                console.error('JSONBin Error Details:', errorData);
                alert('Failed to save your score. Please try again.');
            }
        } catch (error) {
            console.error('Error saving score:', error);
            alert('An unexpected error occurred while saving your score.');
        }
    }

    // --- Game End and Score Submission ---
    // Create a "Submit Score" button dynamically and append it
    const submitScoreButton = document.createElement('button');
    submitScoreButton.textContent = 'Submit Score';
    submitScoreButton.style.marginTop = '20px';
    submitScoreButton.style.display = 'none'; // Hide initially
    gamePlayDiv.appendChild(submitScoreButton);

    // This function can be called when your game's "round" ends (e.g., after a timer)
    function endGame() {
        clickButton.disabled = true; // Disable the click button
        alert(`Game Over! You clicked ${clickCount} times. Click 'Submit Score' to add your result to the leaderboard.`);
        submitScoreButton.style.display = 'block'; // Show submit button
    }

    // Event listener for the "Submit Score" button
    submitScoreButton.addEventListener('click', () => {
        if (clickCount > 0) { // Only submit if clicks are greater than 0
            saveScore();
            submitScoreButton.style.display = 'none'; // Hide after submitting
            // Optionally, reset the game or show a "Play Again" button here
            setTimeout(() => {
                // Reset for a new game
                clickCount = 0;
                clickCountSpan.textContent = 0;
                clickButton.disabled = false;
                nameSetupDiv.style.display = 'block'; // Show name setup again
                gamePlayDiv.style.display = 'none'; // Hide game play
            }, 2000); // Give a brief moment after submission
        } else {
            alert("You didn't click anything! No score to submit.");
            submitScoreButton.style.display = 'none';
            // Reset for a new game
            clickCount = 0;
            clickCountSpan.textContent = 0;
            clickButton.disabled = false;
            nameSetupDiv.style.display = 'block';
            gamePlayDiv.style.display = 'none';
        }
    });

    // Example of how you might trigger endGame (e.g., after a set time)
    // For now, let's keep it manual or integrate into a more complex game logic.
    // To test the end game: uncomment the following line and the submit button will appear after 10 seconds.
    // setTimeout(endGame, 10000); // Ends game after 10 seconds for testing purposes
});
