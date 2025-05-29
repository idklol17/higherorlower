body {
    font-family: 'Arial', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    background: linear-gradient(to right, #4CAF50, #8BC34A); /* Green gradient background */
    color: #fff; /* White text color */
    text-align: center;
    overflow: hidden; /* Prevent scrolling */
}

.game-container {
    background-color: rgba(0, 0, 0, 0.4); /* Semi-transparent dark background */
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    width: 90%; /* Responsive width */
    max-width: 400px; /* Max width for larger screens */
    box-sizing: border-box; /* Include padding in width */
    animation: fadeIn 1s ease-out; /* Simple fade-in animation */
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

h1 {
    font-size: 2.2em;
    margin-bottom: 15px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.score {
    font-size: 1.3em;
    margin-bottom: 20px;
}

.number-circle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 120px;
    background-color: #FFC107; /* Amber color for the number */
    border-radius: 50%; /* Makes it a circle */
    margin: 20px auto;
    font-size: 3.5em;
    font-weight: bold;
    color: #333; /* Dark text for the number */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s ease-out; /* Smooth transition for number update */
}

.number-circle.grow {
    animation: growAndShrink 0.4s ease-in-out;
}

@keyframes growAndShrink {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.buttons-container {
    display: flex;
    justify-content: space-around;
    margin-top: 25px;
    margin-bottom: 20px;
}

.game-button {
    background-color: #007bff; /* Blue button */
    color: white;
    padding: 15px 25px;
    border: none;
    border-radius: 8px;
    font-size: 1.2em;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.1s ease;
    width: 45%; /* Make buttons take up almost half the width */
    box-sizing: border-box;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.game-button:hover {
    background-color: #0056b3; /* Darker blue on hover */
    transform: translateY(-2px); /* Slight lift effect */
}

.game-button:active {
    transform: translateY(0); /* Press effect */
}

.start-button {
    background-color: #28a745; /* Green for start button */
    width: 60%;
    margin-top: 15px;
}

.start-button:hover {
    background-color: #218838;
}

.message {
    font-size: 1.1em;
    margin-top: 15px;
    font-weight: bold;
    min-height: 1.5em; /* Reserve space to prevent layout shift */
    color: #ffeb3b; /* Yellow for messages */
}

/* Media queries for smaller screens (e.g., older phones or landscape mode) */
@media (max-width: 360px) {
    .game-container {
        padding: 15px;
    }

    h1 {
        font-size: 1.8em;
    }

    .number-circle {
        width: 100px;
        height: 100px;
        font-size: 3em;
    }

    .game-button {
        font-size: 1em;
        padding: 12px 20px;
    }
}

/* Leaderboard Section Styling */
.leaderboard-section {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.leaderboard-section h2 {
    font-size: 1.8em;
    margin-bottom: 15px;
    color: #FFC107; /* Amber color for leaderboard title */
}

.leaderboard-loading {
    font-style: italic;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 10px;
}

.leaderboard-list {
    list-style: none; /* Remove bullet points */
    padding: 0;
    margin: 0;
    max-height: 200px; /* Limit height to allow scrolling on mobile */
    overflow-y: auto; /* Enable vertical scrolling */
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: 10px;
}

.leaderboard-list li {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 1.1em;
    color: #fff;
}

.leaderboard-list li:last-child {
    border-bottom: none; /* No border for the last item */
}

.leaderboard-list li span:first-child {
    font-weight: bold;
    color: #8BC34A; /* Green for player name */
}

.leaderboard-list li span:last-child {
    font-weight: bold;
    color: #007bff; /* Blue for score */
}

/* Hide when JavaScript is running */
.leaderboard-list.hidden,
.leaderboard-loading.hidden {
    display: none;
}
