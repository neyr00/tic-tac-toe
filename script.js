class TicTacToe {
    constructor(container) {
        this.container = container;
        this.AI_strength = 50;
        this.first = true;
        this.winComb = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        this.VS_bot = true;
        this.isRestart = false;
        this.init();
    }

    init() {
        this.currentPlayer = 'X'; 
        this.gameState = ['', '', '', '', '', '', '', '', ''];
        this.isGameActive = true;
        this.isPlayerTurn = this.first;
        this.createGameBoard();
        if(!this.isRestart)
            this.choose();
        else if (this.VS_bot && !this.isPlayerTurn)
            this.botMove();
    }

    createGameBoard() {
        this.container.innerHTML = '';
        const gameBoard = document.createElement('div');
        gameBoard.classList.add('grid');
        this.container.appendChild(gameBoard);

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('cell-index', i);
            cell.addEventListener('click', this.handleCellClick.bind(this));
            cell.addEventListener('mouseenter', this.handleCellHover.bind(this));
            cell.addEventListener('mouseleave', this.handleCellLeave.bind(this));

            cell.addEventListener('touchstart', this.handleCellHover.bind(this));
            cell.addEventListener('touchend', this.handleCellLeave.bind(this));
            cell.addEventListener('touchcancel', this.handleCellLeave.bind(this));

            gameBoard.appendChild(cell);
        }

        this.gameBoard = gameBoard;
    }

    handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('cell-index'));

        if (this.gameState[clickedCellIndex] !== '' || !this.isGameActive || (!this.isPlayerTurn && this.VS_bot)) {
            return;
        }

        this.gameState[clickedCellIndex] = this.currentPlayer;
        clickedCell.textContent = this.currentPlayer;
        clickedCell.classList.add('clicked');
        clickedCell.classList.remove('cell_hover');
        this.winCheck();
    }

    handleCellHover(event) {
        const cell = event.target;
        const cellIndex = parseInt(cell.getAttribute('cell-index'));

        if (this.gameState[cellIndex] === '') {
            cell.classList.add('cell_hover');
            cell.textContent = this.currentPlayer;
        }
    }

    handleCellLeave(event) {
        const cell = event.target;

        if (cell.classList.contains('cell_hover')) {
            cell.classList.remove('cell_hover');
            cell.textContent = '';
        }
    }

    winCheck() {
        let roundWon = false;
        let winningCombination = null;
        for (let i = 0; i < this.winComb.length; i++) {
            const winCondition = this.winComb[i];
            let a = this.gameState[winCondition[0]];
            let b = this.gameState[winCondition[1]];
            let c = this.gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') continue;
            if (a === b && b === c) {
                roundWon = true;
                winningCombination = winCondition;
                break;
            }
        }

        if (roundWon) {
            this.isGameActive = false;
            this.highlightWinningCells(winningCombination);
            this.end(this.currentPlayer);
            return;
        }

        if (!this.gameState.includes('')) {
            this.isGameActive = false;
            this.end('0'); 
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.isPlayerTurn = !this.isPlayerTurn;

        if (this.VS_bot && !this.isPlayerTurn) 
            this.botMove();
        else
            this.isPlayerTurn = true;
    }

    highlightWinningCells(combination) {
        combination.forEach(i => {
            const cell = this.gameBoard.querySelector(`[cell-index='${i}']`);
            cell.classList.add('winComb');
        });
    }

    botMove() {
        let availableCells = this.gameState.map((cell, i) => cell === '' ? i : null).filter(cell => cell !== null);

        let botCellIndex;
        if (Math.floor(Math.random() * 101) < this.AI_strength)
            botCellIndex = this.AI(availableCells);
        else
            botCellIndex = this.randomMove(availableCells);

        this.gameState[botCellIndex] = this.currentPlayer;

        const botCell = this.gameBoard.querySelector(`[cell-index='${botCellIndex}']`);
        botCell.textContent = this.currentPlayer;
        botCell.classList.add('clicked');
        this.winCheck();
    }

    AI(availableCells) {
        if (this.gameState[4] === '')
            return 4;
        else if (this.gameState[4] !== '' &&
            [0, 2, 6, 8].filter(i => this.gameState[i] === '').length === 4)
            return [0, 2, 6, 8][Math.floor(Math.random() * 4)];
        for (let i = 0; i < this.winComb.length; i++) {
            const winCondition = this.winComb[i];
            let comb = [this.gameState[winCondition[0]],
            this.gameState[winCondition[1]],
            this.gameState[winCondition[2]]];
            if (comb.filter(i => i === this.currentPlayer).length === 2 &&
                comb.includes(''))
                return winCondition[comb.findIndex(i => i === '')];
        }
        for (let i = 0; i < this.winComb.length; i++) {
            const winCondition = this.winComb[i];
            let comb = [this.gameState[winCondition[0]],
            this.gameState[winCondition[1]],
            this.gameState[winCondition[2]]];
            if (comb.filter(i => i === ((this.currentPlayer === 'X') ? 'O' : 'X')).length === 2 &&
                comb.includes(''))
                return winCondition[comb.findIndex(i => i === '')];
        }
        for (let i = 0; i < this.winComb.length; i++) {
            const winCondition = this.winComb[i];
            let comb = [this.gameState[winCondition[0]],
            this.gameState[winCondition[1]],
            this.gameState[winCondition[2]]];
            if (comb.filter(i => i === '').length === 2 &&
                comb.includes(this.currentPlayer))
                return winCondition[comb.findIndex(i => i === '')];
        }

        return this.randomMove(availableCells);
    }

    randomMove(availableCells) {
        let randomIndex = Math.floor(Math.random() * availableCells.length);
        return availableCells[randomIndex];
    }

    choose() {
        const background = document.createElement('div');
        background.classList.add('background');

        const box = document.createElement('div');
        box.classList.add('box');

        // Message
        const messageBox = document.createElement('div');
        messageBox.classList.add('message-box');

        const message = document.createElement('p');
        message.textContent = 'CHOOSE';
        message.classList.add('message');

        // Buttons
        const xBtn = document.createElement('button');
        xBtn.textContent = 'X';

        const oBtn = document.createElement('button');
        oBtn.textContent = 'O';

        // Slider
        const sliderBox = document.createElement('div');
        sliderBox.classList.add('message-box');

        const slider = document.createElement('input');
        slider.classList.add('slider');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '100';
        slider.value = this.AI_strength;
        slider.id = 'slider';

        const difficulty = document.createElement('p');
        difficulty.classList.add('sliderText');
        difficulty.textContent = 'difficulty';

        // CheckBox
        const label = document.createElement('label');
        label.classList.add('switchField');

        const switchBtn = document.createElement('input');
        switchBtn.type = 'checkbox';
        switchBtn.id = 'switchBtn';
        switchBtn.checked = this.VS_bot;

        const switchBack = document.createElement('div');
        switchBack.classList.add('toggle');

        const switchText = document.createElement('div');
        switchText.classList.add('switchText');

        // VS 
        if (this.VS_bot) {
            slider.classList.remove('off');
            oBtn.classList.remove('off');
            switchText.textContent = 'vs bot';
        }
        else {
            slider.classList.add('off');
            oBtn.classList.add('off');
            switchText.textContent = 'vs human';
        }

        // Events
        xBtn.addEventListener('click', () => {
            this.container.removeChild(background);
            this.isPlayerTurn = true;
            this.first = true;
        });
        xBtn.addEventListener('touchstart', () => xBtn.classList.add('active'));
        xBtn.addEventListener('touchend', () => xBtn.classList.remove('active'));
        xBtn.addEventListener('touchcancel', () => xBtn.classList.remove('active'));    
        oBtn.addEventListener('click', () => {
            this.container.removeChild(background);
            this.isPlayerTurn = false;
            this.first = false;
            this.botMove();
        });
        oBtn.addEventListener('touchstart', () => oBtn.classList.add('active'));
        oBtn.addEventListener('touchend', () => oBtn.classList.remove('active'));
        oBtn.addEventListener('touchcancel', () => oBtn.classList.remove('active'));
        slider.addEventListener('input', (event) => {
            this.AI_strength = event.target.value;
        });
        switchBtn.addEventListener('change', () => {
            if (switchBtn.checked) {
                this.VS_bot = true;
                switchText.textContent = 'vs bot';
                oBtn.classList.remove('off');
                slider.classList.remove('off');
            } else {
                this.VS_bot = false;
                switchText.textContent = 'vs human';
                oBtn.classList.add('off');
                slider.classList.add('off');
            }
        });

        messageBox.appendChild(message);
        messageBox.appendChild(oBtn);
        messageBox.appendChild(xBtn);
        box.appendChild(messageBox);

        sliderBox.appendChild(difficulty);
        sliderBox.appendChild(slider);
        box.appendChild(sliderBox);

        label.appendChild(switchBtn);
        label.appendChild(switchBack);
        label.appendChild(switchText);
        box.appendChild(label);

        background.appendChild(box);
        this.container.appendChild(background);
    }

    end(who) {
        const background = document.createElement('div');
        background.classList.add('background');

        const box = document.createElement('div');
        box.classList.add('box');

        // Message
        const messagebox = document.createElement('div');
        messagebox.classList.add('message-box');

        const whoWin = document.createElement('p');
        whoWin.classList.add('win');
        if (who !== '0')
            whoWin.textContent = `${who} won!`;
        else
            whoWin.textContent = 'DRAW!';

        const message = document.createElement('p');
        message.classList.add('message');
        message.textContent = 'RESTART?';

        // Buttons
        const yesBtn = document.createElement('button');
        yesBtn.classList.add('yes');
        yesBtn.textContent = 'YES';

        const noBtn = document.createElement('button');
        noBtn.classList.add('no');
        noBtn.textContent = 'NO';

        // Events
        yesBtn.addEventListener('click', () => {
            this.container.removeChild(background);
            this.isRestart = true;
            this.init();
        });

        noBtn.addEventListener('click', () => {
            this.container.removeChild(background);
            this.isRestart = false;
            this.init();
        });

        box.appendChild(whoWin);
        box.appendChild(messagebox);
        messagebox.appendChild(message);
        messagebox.appendChild(yesBtn);
        messagebox.appendChild(noBtn);
        background.appendChild(box);

        this.container.appendChild(background);
    }
}

// Automatically initialize games for all <ttt> tags
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('ttt').forEach(tag => {
        new TicTacToe(tag);
    });
});
