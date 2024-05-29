document.addEventListener("DOMContentLoaded", function () {
    const settingsBtn = document.getElementById("settings-btn");
    const modal = document.getElementById("settings-modal");
    const closeModal = document.getElementById("close-modal");
    const volumeSlider = document.getElementById("volume");
    const transitionsCheckbox = document.getElementById("transitions");
    const sizeSelector = document.getElementById("size");
    const gradient1Picker = document.getElementById("gradient1");
    const gradient2Picker = document.getElementById("gradient2");
    const boardGradient1Picker = document.getElementById("board-gradient1");
    const boardGradient2Picker = document.getElementById("board-gradient2");
    const music = document.getElementById("background-music");
    const restartGameBtn = document.querySelectorAll(".restart-game");
    const winModal = document.getElementById("win-modal");
    const closeWinModal = document.getElementById("close-win-modal");

    restartGameBtn.forEach(button => button.addEventListener("click", () => {
        document.location.reload();
    }));

    settingsBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    volumeSlider.addEventListener("input", (e) => {
        music.volume = e.target.value / 100;
    });

    transitionsCheckbox.addEventListener("change", (e) => {
        const blocks = document.querySelectorAll(".rect_block");
        blocks.forEach(block => {
            block.style.transition = e.target.checked ? "0.5s" : "none";
        });
    });

    sizeSelector.addEventListener("change", (e) => {
        generateBoard(parseInt(e.target.value));
    });

    gradient1Picker.addEventListener("input", updateBackground);
    gradient2Picker.addEventListener("input", updateBackground);
    boardGradient1Picker.addEventListener("input", updateBoardBackground);
    boardGradient2Picker.addEventListener("input", updateBoardBackground);

    function updateBackground() {
        document.body.style.background = `linear-gradient(65deg, ${gradient1Picker.value}, ${gradient2Picker.value})`;
    }

    function updateBoardBackground() {
        const gameBoard = document.getElementById("game-board");
        gameBoard.style.background = `linear-gradient(65deg, ${boardGradient1Picker.value}, ${boardGradient2Picker.value})`;
    }

    music.play();
    restartGameBtn.forEach(button => button.addEventListener("click", () => {
        winModal.style.display = "none";
        generateBoard(parseInt(sizeSelector.value));
    }));

    closeWinModal.addEventListener("click", () => {
        winModal.style.display = "none";
    });

    generateBoard(4); // Initialize with default 4x4 grid
});

let final = false;
let moves;
let label_moves;
let index = 105;
let w, h;
let field = [];
let region = [];

function generateBoard(size) {
    moves = 0;
    label_moves = document.getElementById("moves-count");
    label_moves.innerHTML = "Количество ходов: 0";

    w = h = size;
    index = 420 / size; //Размер блока в зависимости от размера сетки

    region = new Array(h).fill(null).map(() => new Array(w).fill(0));

    //Инициализация доски с помощью последовательных номеров и нуля
    let number = 1;
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (number < size * size) {
                region[i][j] = number++;
            }
        }
    }
    region[h - 1][w - 1] = 0; // Пустое пространство

    shuffleBoard(region);

    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = ""; // Clear the board
    gameBoard.style.gridTemplateColumns = `repeat(${w}, ${index}px)`;
    gameBoard.style.gridTemplateRows = `repeat(${h}, ${index}px)`;

    field = [];
    let k = 0;
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (region[i][j] !== 0) {
                const block = document.createElement('div');
                block.classList.add('rect_block');
                block.dataset.blockId = k;
                block.textContent = region[i][j];
                block.style.left = `${20 + index * j}px`;
                block.style.top = `${20 + index * i}px`;
                gameBoard.appendChild(block);
                field[k] = { ix: j, iy: i, block };
                k++;
            }
        }
    }

    const blocks = document.getElementsByClassName("rect_block");
    for (const block of blocks) {
        block.style.width = `${index - 10}px`; // Настройка ширины
        block.style.height = `${index - 10}px`; // Регулировка высоты
        block.addEventListener("click", function () { moveBlock(this); });
    }
}

function shuffleBoard(region) {
    for (let i = h - 1; i > 0; i--) {
        for (let j = w - 1; j > 0; j--) {
            let i1 = Math.floor(Math.random() * (i + 1));
            let j1 = Math.floor(Math.random() * (j + 1));
            [region[i][j], region[i1][j1]] = [region[i1][j1], region[i][j]];
        }
    }
}

function moveBlock(element) {
    if (final) {
        return;
    }

    const blockId = element.dataset.blockId;
    const object = field[blockId];
    const ix = object.ix;
    const iy = object.iy;

    if (iy + 1 < h && region[iy + 1][ix] == 0) {
        swapBlocks(object, ix, iy, ix, iy + 1);
    }
    else if (iy - 1 > -1 && region[iy - 1][ix] == 0) {
        swapBlocks(object, ix, iy, ix, iy - 1);
    }
    else if (ix + 1 < w && region[iy][ix + 1] == 0) {
        swapBlocks(object, ix, iy, ix + 1, iy);
    }
    else if (ix - 1 > -1 && region[iy][ix - 1] == 0) {
        swapBlocks(object, ix, iy, ix - 1, iy);
    }

    label_moves.innerHTML = "Количество ходов: " + moves;
    checkWin();
}

function swapBlocks(block, x1, y1, x2, y2) {
    region[y2][x2] = region[y1][x1];
    region[y1][x1] = 0;
    block.block.style.left = `${20 + index * x2}px`;
    block.block.style.top = `${20 + index * y2}px`;
    block.ix = x2;
    block.iy = y2;
    moves++;
}

function checkWin() {
    let win = true;
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (i === h - 1 && j === w - 1) {
                continue;
            }
            if (region[i][j] !== i * w + j + 1) {
                win = false;
                break;
            }
        }
    }
    if (win) {
        final = true;
        document.getElementById("win-modal").style.display = "block";
    }
}
