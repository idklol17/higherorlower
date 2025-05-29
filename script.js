document.addEventListener('DOMContentLoaded', () => {
    const playerNameInput = document.getElementById('playerName');
    const startGameButton = document.getElementById('startGameButton');
    const nameSetupDiv = document.getElementById('name-setup');
    const gamePlayDiv = document.getElementById('game-play');
    const displayPlayerNameSpan = document.getElementById('displayPlayerName');
    const clickCountSpan = document.getElementById('clickCount');
    const clickButton = document.getElementById('clickButton');
    const leaderboardList = document.getElementById('leaderboard-list');
    const submitScoreButton = document.getElementById('submitScoreButton'); // Get the new button

    let playerName = "Anonymous";
    let clickCount = 0;

    // --- JSONBin.io Configuration ---
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
        clickButton.disabled = false; // Ensure click button is enabled for new game
        submitScoreButton.style.display = 'block'; // Make submit button visible
        clickCount = 0; // Reset clicks for new game
        clickCountSpan.textContent = clickCount; // Update display
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
                    'X-Master-Key': JSONBIN_MASTER_KEY,
                    'X-Bin-Meta': 'false'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const scores = data.scores && Array.isArray(data.scores) ? data.scores : [];

                scores.sort((a, b) => {
                    if (b.score !== a.score) {
                        return b.score - a.score;
                    }
                    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                });

                leaderboardList.innerHTML = '';
                scores.slice(0, 10).forEach((entry, index) => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <span>#${index + 1} ${entry.name}</span>
                        <span>${entry.score} Clicks</span>
                    `;
                    leaderboardList.appendChild(listItem);
                });
            } else {
                console.error('Failed to load leaderboard from JSONBin:', response.statusText);
                leaderboardList.innerHTML = '<li>No scores yet. Be the first!</li>';
            }
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            leaderboardList.innerHTML = '<li>Error loading leaderboard.</li>';
        }
    }

    async function saveScore() {
        try {
            const getResponse = await fetch(JSONBIN_URL, {
                method: 'GET',
                headers: {
                    'X-Master-Key': JSONBIN_MASTER_KEY,
                    'X-Bin-Meta': 'false'
                }
            });

            let currentScores = [];
            let binContent = {};

            if (getResponse.ok) {
                const data = await getResponse.json();
                binContent = data;
                currentScores = data.scores && Array.isArray(data.scores) ? data.scores : [];
            } else if (getResponse.status !== 404) {
                console.error('Failed to retrieve current scores before saving:', getResponse.statusText);
                alert('Failed to get current scores. Please try again.');
                return;
            }

            if (clickCount > 0) { // Only add score if clicks are positive
                currentScores.push({ name: playerName, score: clickCount, timestamp: new Date().toISOString() });
            }

            currentScores.sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            });
            currentScores = currentScores.slice(0, 100);

            binContent.scores = currentScores;

            const updateResponse = await fetch(JSONBIN_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_MASTER_KEY,
                    'Content-Length': JSON.stringify(binContent).length
                },
                body: JSON.stringify(binContent)
            });

            if (updateResponse.ok) {
                console.log('Score saved successfully to JSONBin!');
                loadLeaderboard();
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
    // The endGame function now handles the logic after submission
    function endGame() {
        clickButton.disabled = true; // Disable the click button
        submitScoreButton.style.display = 'none'; // Hide submit button after click
        
        if (clickCount > 0) { // Only submit if clicks are positive
            saveScore();
            alert(`Game Over! You clicked ${clickCount} times. Your score has been submitted.`);
        } else {
            alert("You didn't click anything! No score to submit.");
        }

        // Reset game after a short delay
        setTimeout(() => {
            clickCount = 0;
            clickCountSpan.textContent = 0;
            playerNameInput.value = ''; // Clear name input
            nameSetupDiv.style.display = 'block'; // Show name setup again
            gamePlayDiv.style.display = 'none'; // Hide game play
        }, 2000); // Wait 2 seconds before resetting UI
    }

    // Event listener for the new "Submit Score" button
    submitScoreButton.addEventListener('click', endGame); // Calls endGame when clicked

    // Hide the submit button initially (before game starts)
    submitScoreButton.style.display = 'none';
});
