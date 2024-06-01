document.addEventListener("DOMContentLoaded", function () {
    const settingsBtn = document.getElementById("settings-btn");
    const modal = document.getElementById("settings-modal");
    const closeModal = document.getElementById("close-modal");
    const volumeSlider = document.getElementById("volume");
    const transitionsCheckbox = document.getElementById("transitions");
    const sizeSelector = document.getElementById("size");
    const blockColorPicker = document.getElementById("block-color");
    const gradient1Picker = document.getElementById("gradient1");
    const gradient2Picker = document.getElementById("gradient2");
    const boardGradient1Picker = document.getElementById("board-gradient1");
    const boardGradient2Picker = document.getElementById("board-gradient2");
    const resetSettingsBtn = document.getElementById("reset-settings");
    const soundOnBtn = document.getElementById("sound-on-btn");
    const soundOffBtn = document.getElementById("sound-off-btn");
    const backgroundMusic = document.getElementById("background-music");
    const moveSound = document.getElementById("move-sound");
    const gameBoard = document.getElementById("game-board");
    const movesCountElem = document.getElementById("moves-count");
    const winModal = document.getElementById("win-modal");
    const closeWinModal = document.getElementById("close-win-modal");

    let movesCount = 0;
    let size = 4;
    let blockColor = blockColorPicker.value;
    let soundEnabled = true;

    function initGame() {
        generateGameBoard(size);
        movesCount = 0;
        updateMovesCount();
        modal.style.display = "none";
        winModal.style.display = "none";
    }

    function generateGameBoard(size) {
        gameBoard.innerHTML = "";
        gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(${size}, 1fr)`;

        let numbers = [...Array(size * size).keys()].slice(1);
        numbers.sort(() => Math.random() - 0.5);
        numbers.push(0);

        numbers.forEach(number => {
            const block = document.createElement("div");
            if (number !== 0) {
                block.className = "rect_block"
                block.textContent = number;
                block.style.background = blockColor;
                block.addEventListener("click", () => moveBlock(block));
            }
            else {
                block.classList.add("empty");
            }
            gameBoard.appendChild(block);
        });
    }

    function moveBlock(block) {
        const emptyBlock = document.querySelector(".empty");
        const emptyIndex = Array.from(gameBoard.children).indexOf(emptyBlock);
        const blockIndex = Array.from(gameBoard.children).indexOf(block);

        const [emptyRow, emptyCol] = [Math.floor(emptyIndex / size), emptyIndex % size];
        const [blockRow, blockCol] = [Math.floor(blockIndex / size), blockIndex % size];

        const isAdjacent =
            (Math.abs(emptyRow - blockRow) === 1 && emptyCol === blockCol) ||
            (Math.abs(emptyCol - blockCol) === 1 && emptyRow === blockRow);

        if (isAdjacent) {
            // Заменить пустой блок на выбранный блок и наоборот
            const temp = document.createElement("div");
            gameBoard.replaceChild(temp, block);
            gameBoard.replaceChild(block, emptyBlock);
            gameBoard.replaceChild(emptyBlock, temp);

            movesCount++;
            updateMovesCount();

            if (soundEnabled) {
                moveSound.currentTime = 0; // Обнуляем время звука, чтобы он не прерывался при быстром нажатии
                moveSound.play();
            }

            if (checkWin()) {
                setTimeout(() => {
                    winModal.style.display = "block";
                }, 300);
            }
        }
    }

    function updateMovesCount() {
        movesCountElem.textContent = `Количество ходов: ${movesCount}`;
    }

    function checkWin() {
        const blocks = Array.from(gameBoard.children);
        return blocks.every((block, index) => {
            const number = parseInt(block.textContent);
            return block.classList.contains("empty") ? true : number === index + 1;
        });
    }

    settingsBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    closeWinModal.addEventListener("click", () => {
        winModal.style.display = "none";
    });

    soundOnBtn.addEventListener("click", () => {
        soundEnabled = false;
        backgroundMusic.pause();
        soundOnBtn.style.display = "none";
        soundOffBtn.style.display = "inline";
    });

    soundOffBtn.addEventListener("click", () => {
        soundEnabled = true;
        backgroundMusic.play();
        soundOnBtn.style.display = "inline";
        soundOffBtn.style.display = "none";
    });

    volumeSlider.addEventListener("input", () => {
        backgroundMusic.volume = volumeSlider.value / 100;
    });

    transitionsCheckbox.addEventListener("change", () => {
        const blocks = document.querySelectorAll(".rect_block");
        blocks.forEach(block => {
            block.style.transition = transitionsCheckbox.checked ? "left 0.5s, top 0.5s" : "none";
        });
    });

    sizeSelector.addEventListener("change", () => {
        size = parseInt(sizeSelector.value);
        initGame();
    });

    blockColorPicker.addEventListener("input", () => {
        blockColor = blockColorPicker.value;
        const blocks = document.querySelectorAll(".rect_block:not(.empty)");
        blocks.forEach(block => {
            block.style.backgroundColor = blockColor;
        });
    });

    gradient1Picker.addEventListener("input", () => {
        document.body.style.background = `linear-gradient(65deg, ${gradient1Picker.value}, ${gradient2Picker.value})`;
    });

    gradient2Picker.addEventListener("input", () => {
        document.body.style.background = `linear-gradient(65deg, ${gradient1Picker.value}, ${gradient2Picker.value})`;
    });

    boardGradient1Picker.addEventListener("input", () => {
        gameBoard.style.background = `linear-gradient(65deg, ${boardGradient1Picker.value}, ${boardGradient2Picker.value})`;
    });

    boardGradient2Picker.addEventListener("input", () => {
        gameBoard.style.background = `linear-gradient(65deg, ${boardGradient1Picker.value}, ${boardGradient2Picker.value})`;
    });

    resetSettingsBtn.addEventListener("click", () => {
        volumeSlider.value = 50;
        backgroundMusic.volume = 0.5;
        transitionsCheckbox.checked = true;
        sizeSelector.value = 4;
        blockColorPicker.value = "#87CEFA";
        gradient1Picker.value = "#f4511e";
        gradient2Picker.value = "#511ff4";
        boardGradient1Picker.value = "#0a365e";
        boardGradient2Picker.value = "#863a8b";
        document.body.style.background = `linear-gradient(65deg, ${gradient1Picker.value}, ${gradient2Picker.value})`;
        gameBoard.style.background = `linear-gradient(65deg, ${boardGradient1Picker.value}, ${boardGradient2Picker.value})`;
        blockColor = blockColorPicker.value;
        const blocks = document.querySelectorAll(".rect_block:not(.empty)");
        blocks.forEach(block => {
            block.style.backgroundColor = blockColor;
        });
        initGame();
    });

    const restartButtons = document.querySelectorAll(".restart-game");
    restartButtons.forEach(button => {
        button.addEventListener("click", () => {
            initGame();
        });
    });

    backgroundMusic.volume = 0.5;
    backgroundMusic.play();

    initGame();
});
