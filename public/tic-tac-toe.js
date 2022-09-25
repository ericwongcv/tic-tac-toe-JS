// Your code here

let turn = "X";
let marked = {};

// Load js after DOM is loaded
document.addEventListener('DOMContentLoaded', e => {
    // generate grid
    createGrid();
    
    // Execute previous game if existing
    if (executeLocalStorage()) {
        toggleButtons();
        executeLocalStorage();
    } else {
        // Initialize New Game
        newGame();
    };
});

function newGame() {
    // Set all mapped keys to undefined
    Object.keys(marked).map(pair => marked[pair] = undefined);
    
    const gameContainer = document.getElementsByClassName("game-container")[0].children;

    // Remove all grid divs and images
    if (gameContainer.length > 0) removeGrid();

    // Create grid divs
    createGrid();
    changeHeading("Tic-Tac-Toe");

    // Disable New Game button during the start
    toggleButtons();

    // Mark board with click events
    document.addEventListener("click", gameEvent);
}

function giveUp() {
    const winner = turn === "X" ? "O" : "X";
    document.removeEventListener("click", gameEvent);
    changeHeading("Winner: " + winner);
    localStorage.setItem("winner", winner);
    turn = "X";
    toggleButtons();
}

function toggleButtons() {
    const buttons = document.getElementsByTagName("button");
    newGameButton = buttons[0];
    giveUpButton = buttons[1];

    newGameButton.disabled ? newGameButton.disabled = false : newGameButton.disabled = true;
    newGameButton.disabled ? giveUpButton.disabled = false : giveUpButton.disabled = true;

    if (!newGameButton.disabled) {
        // Add click listener for New Game button
        newGameButton.addEventListener("click", newGame);
    };
    if (!giveUpButton.disabled) {
        // Add click listener for Give Up button
        giveUpButton.addEventListener("click", giveUp);
    };
}

// event run inside active listener. Inside newGame()
function gameEvent(event) {
    const target = event.target;
    
    if (target.dataset["row"] && target.dataset["col"]) {
        const row = target.dataset["row"];
        const col = target.dataset["col"];
        // const xImage = "<img src='./public/player-x.png' alt='X' width='150' />";
        // const oImage = "<img src='./public/player-o.png' alt='O' width='150' />";
        const xImage = 'X';
        const oImage = 'O';
        
        if (!marked[[row, col]]) {
            // mark row and col as filled
            marked[[row, col]] = turn;

            // Set coordinate mark in localstorage
            localStorage.setItem([row, col], turn);

            //mark the div with with an attribute and either X or O. Enter image in webpage.
            target.setAttribute("data-mark", turn);
            turn === "X" ? target.innerHTML = xImage : target.innerHTML = oImage;
            // get keys of all marked coordinates
            const markedPairs = Object.keys(marked);

            if (checkWin(target)) {
                document.removeEventListener("click", gameEvent);
                // Enable New Game button
                toggleButtons();
                // change the header to indicate winner
                return changeHeading(`Winner: ${turn}`);
            // Return draw if there is no Winner
            } else if (markedPairs.length === 9 && markedPairs.every(key => marked[key] !== undefined)) {
                changeHeading("Winner: None");
                localStorage.setItem("winner", "none");
                toggleButtons();
            }

            // Change player turn
            changeTurn();

            // Set next player turn in localstorage
            localStorage.setItem("turn", turn);
        };
    };
};

function checkWin(target) {
    if (scanRow(target) || scanCol(target) || scanDiag(target)) {
        localStorage.setItem("winner", turn);
        return true;
    };
    return false;
}

function changeTurn() {
    turn === "X" ? turn = "O" : turn = "X";
}

function changeHeading(text) {
    const heading = document.getElementById("heading");
    heading.innerText = text;
}

function scanRow(target) {
    const row = target.dataset["row"];
    for (let col = 0; col < 3; col++) {
        if (marked[[row, col]] !== target.dataset["mark"]) return false;
    };
    return true;
}

function scanCol(target) {
    const col = target.dataset["col"];
    for (let row = 0; row < 3; row++) {
        if (marked[[row, col]] !== target.dataset["mark"]) return false;
    };
    return true;
}

function scanDiag(target) {
    const setOne = [[0, 0], [1, 1], [2, 2]];
    const setTwo = [[2, 0], [1, 1], [0, 2]];

    if (setOne.every( pair => marked[pair] === target.dataset["mark"])) return true;
    if (setTwo.every( pair => marked[pair] === target.dataset["mark"])) return true;
    return false;
}

function createGrid() {
    // Assign game container div element
    const gameDiv = document.getElementsByClassName("game-container");

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const newDiv = document.createElement("div");
            newDiv.className = "box";
            newDiv.setAttribute("data-row", row);
            newDiv.setAttribute("data-col", col);

            // Create border style
            const borderStyle = "5px solid white";

            // Create horizontal lines
            if (row === 0) {
                newDiv.style.borderBottom = borderStyle;
            } else if (row === 1) {
                newDiv.style.borderBottom = borderStyle;                
            };
            //Create vertical lines
            if (col === 0) {
                newDiv.style.borderRight = borderStyle;
            } else if (col === 1) {
                newDiv.style.borderRight = borderStyle;                
            };
            // append new div in the grid div
            gameDiv[0].appendChild(newDiv);
        };
    };
}

function removeGrid() {
    for (let i = 0; i < 9; i++) {
        // Remove all images from blocks
        const gameContainerDiv = document.getElementsByClassName("game-container")[0];
        gameContainerDiv.children[0].remove();
    };
    // remove local storage
    localStorage.clear();
}

function executeLocalStorage() {
    let existingGame = false;
    // const xImage = "<img src='./player-x.png' alt='X' width='150' />";
    // const oImage = "<img src='./player-o.png' alt='O' width='150' />";
    const xImage = 'X';
    const oImage = 'O';

    const divBoxes = document.getElementsByClassName("box");
    let i = 0;

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (localStorage[[row,col]] === "X") {
                marked[[row, col]] = "X"
                existingGame = true;
                divBoxes[i].innerHTML = xImage;
            } else if (localStorage[[row,col]] === "O") { 
                marked[[row, col]] = "O"
                existingGame = true;
                divBoxes[i].innerHTML = oImage;
            };
            i++;
        };
    };

    if (localStorage["turn"]) turn = localStorage["turn"];

    if (localStorage["winner"]) {
        toggleButtons();
        newGame();
    } else {
        // Mark board with click events
        document.addEventListener("click", gameEvent);
    }

    return existingGame;
};
