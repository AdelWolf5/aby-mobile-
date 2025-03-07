// script.js

const gameModesSection = document.getElementById('game-modes');
const gameContainerSection = document.getElementById('game-container');
const settingsSection = document.getElementById('settings');
const backToModesButton = document.getElementById('back-to-modes-btn');
const gameCanvas = document.getElementById('game-canvas');
const ctx = gameCanvas.getContext('2d');
const scoreValueDisplay = document.getElementById('score-value');
const levelValueDisplay = document.getElementById('level-value');
const originSelect = document.getElementById('origin');

let currentMode = null;
let maze = null;
let playerPos = null;
let gridSize = 20; // Size of each grid cell in pixels
let score = 0;
let level = 1;
let animationFrameId;

// --- Event Listeners for Game Mode Buttons ---
document.getElementById('levels-mode-btn').addEventListener('click', () => startGameMode('levels'));
document.getElementById('arena-mode-btn').addEventListener('click', () => startGameMode('arena'));
document.getElementById('infinite-mode-btn').addEventListener('click', () => startGameMode('infinite'));
document.getElementById('multiplayer-mode-btn').addEventListener('click', () => alert('Mode Multijoueur en développement!')); // Placeholder

// --- Event Listener for Back to Modes Button ---
backToModesButton.addEventListener('click', showGameModes);

// --- Function to Show Game Modes Section ---
function showGameModes() {
    gameContainerSection.classList.add('hidden');
    settingsSection.classList.add('hidden');
    gameModesSection.classList.remove('hidden');
    currentMode = null;
    stopGameLoop(); // Stop any running game loop
}

// --- Function to Start a Game Mode ---
function startGameMode(mode) {
    currentMode = mode;
    gameModesSection.classList.add('hidden');
    settingsSection.classList.add('hidden');
    gameContainerSection.classList.remove('hidden');
    resetGame();
    if (mode === 'arena') {
        startArenaMode();
    } else if (mode === 'levels') {
        startLevelsMode();
    } else if (mode === 'infinite') {
        startInfiniteMode();
    }
}

// --- Reset Game State ---
function resetGame() {
    score = 0;
    level = 1;
    scoreValueDisplay.textContent = score;
    levelValueDisplay.textContent = level;
    generateMaze();
    placePlayerAtStart();
}

// --- Stop Game Loop ---
function stopGameLoop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

// --- Start Arena Mode ---
function startArenaMode() {
    console.log("Arena Mode Started");
    startGameLoop(); // Start the game loop for Arena mode
}
// --- Start Levels Mode ---
function startLevelsMode() {
    console.log("Levels Mode Started");
    startGameLoop(); // Start the game loop for Levels mode
}
// --- Start Infinite Mode ---
function startInfiniteMode() {
    console.log("Infinite Mode Started");
    startGameLoop(); // Start the game loop for Infinite mode
}


// --- Game Loop (Basic for now - to be enhanced) ---
function startGameLoop() {
    function gameLoop() {
        updateGame();
        drawGame();
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    gameLoop();
}

// --- Update Game State ---
function updateGame() {
    if (currentMode === 'arena') {
        score += 1; // Example: Score increases over time in Arena mode
        scoreValueDisplay.textContent = score;
    }
    // Add more game logic updates here (e.g., player movement, collision, etc.)
}

// --- Draw Game on Canvas ---
function drawGame() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Clear canvas
    drawMaze();
    drawPlayer();
    // Draw other game elements (fruits, enemies, etc.)
}

// --- Maze Generation (Simple Example - can be improved) ---
function generateMaze() {
    const mazeWidth = 20; // Maze dimensions in cells
    const mazeHeight = 20;
    maze = [];
    for (let y = 0; y < mazeHeight; y++) {
        maze[y] = [];
        for (let x = 0; x < mazeWidth; x++) {
            // Simple random maze: 70% path, 30% wall
            maze[y][x] = Math.random() < 0.7 ? 0 : 1; // 0: path, 1: wall
        }
    }
    // Ensure start and end are always paths (for simplicity)
    maze[0][0] = 0;
    maze[mazeHeight - 1][mazeWidth - 1] = 0;
}


// --- Draw Maze on Canvas ---
function drawMaze() {
    if (!maze) return;

    const cellWidth = gameCanvas.width / maze[0].length;
    const cellHeight = gameCanvas.height / maze.length;

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 1) { // Wall
                ctx.fillStyle = '#333'; // Dark grey walls
                ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
            } else { // Path
                ctx.fillStyle = '#eee'; // Light grey path
                ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
            }
        }
    }
}

// --- Place Player at Start (Top-Left Corner for now) ---
function placePlayerAtStart() {
    playerPos = {x: 0, y: 0};
}

// --- Draw Player on Canvas ---
function drawPlayer() {
    if (!playerPos) return;
    const cellWidth = gameCanvas.width / maze[0].length;
    const cellHeight = gameCanvas.height / maze.length;
    const playerRadius = Math.min(cellWidth, cellHeight) * 0.4; // Player size relative to cell

    ctx.fillStyle = 'red'; // Red player
    ctx.beginPath();
    ctx.arc(playerPos.x * cellWidth + cellWidth / 2, playerPos.y * cellHeight + cellHeight / 2, playerRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}


// --- Basic Keyboard Input Handling ---
document.addEventListener('keydown', (event) => {
    if (!currentMode || !playerPos || !maze) return; // Game mode must be active and maze generated

    let newX = playerPos.x;
    let newY = playerPos.y;

    switch (event.key) {
        case 'ArrowUp':
        case 'z': // French keyboard layout compatibility
            newY--;
            break;
        case 'ArrowDown':
        case 's':
            newY++;
            break;
        case 'ArrowLeft':
        case 'q':
            newX--;
            break;
        case 'ArrowRight':
        case 'd':
            newX++;
            break;
        default:
            return; // Ignore other keys
    }

    if (isValidMove(newX, newY)) {
        playerPos.x = newX;
        playerPos.y = newY;
    }
});


// --- Check if a Move is Valid ---
function isValidMove(x, y) {
    if (!maze) return false;
    if (y < 0 || y >= maze.length || x < 0 || x >= maze[0].length) return false; // Out of bounds
    return maze[y][x] === 0; // Check if it's a path (0)
}


// --- Populate Origin Select (Placeholder - Replace with actual country data) ---
function populateOriginSelect() {
    const countries = [
        "France", "États-Unis", "Canada", "Royaume-Uni", "Japon", "Chine", "Allemagne", "Italie", "Espagne", "Brésil", "Australie", "Inde", "Afrique du Sud", "Argentine", "Mexique"
        // ... add more countries or load from a data source
    ];
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        originSelect.appendChild(option);
    });
}

// --- Show Settings Section ---
function showSettings() {
    gameModesSection.classList.add('hidden');
    gameContainerSection.classList.add('hidden');
    settingsSection.classList.remove('hidden');
}

// --- Event listener for Settings button (if you add one later) ---
// (Example: document.getElementById('settings-button').addEventListener('click', showSettings); )

// --- Initialize game on page load ---
function initializeGame() {
    populateOriginSelect(); // Populate the origin dropdown
    showGameModes(); // Start with game modes visible
}

initializeGame();
