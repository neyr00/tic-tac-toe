document.addEventListener('DOMContentLoaded', () => {

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'styles.css';

    document.head.appendChild(link);

    const gameBoard = document.getElementById('game');
    let currentPlayer;
    let AI_strength = 50;
    let first;
    let isRestart = false;
    VS_bot = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];
    const winComb = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    let isGameActive = false;
    let isPlayerTurn;

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('cell-index'));

        if (gameState[clickedCellIndex] !== '' || !isGameActive || (!isPlayerTurn && VS_bot)) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        console.log(`PLAYER ${currentPlayer}: ${clickedCellIndex}`);
        clickedCell.classList.add('clicked');
        clickedCell.classList.remove('cell_hover');
        isPlayerTurn = false;
        winCheck();
    }

    function handleCellHover(event) {
        const cell = event.target;
        const cellIndex = parseInt(cell.getAttribute('cell-index'));

        if (gameState[cellIndex] === '') {
            cell.classList.add('cell_hover');
            cell.textContent = currentPlayer;
        }
    }

    function handleCellLeave(event) {
        const cell = event.target;

        if(cell.classList.contains('cell_hover')){
            cell.classList.remove('cell_hover');
            cell.textContent = '';
        }
    }

    function winCheck() {
        let roundWon = false;
        let winningCombination = null;
        for (let i = 0; i < winComb.length; i++) {
            const winCondition = winComb[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];
            if (a === '' || b === '' || c === '')
                continue;
            if (a === b && b === c) {
                roundWon = true;
                winningCombination = winCondition;
                break;
            }
        }

        if (roundWon) {
            isGameActive = false;
            highlightWinningCells(winningCombination);
            end(currentPlayer);
        }

        if (!gameState.includes('') && isGameActive) {
            isGameActive = false;
            end('0');
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (!isPlayerTurn && isGameActive && VS_bot)
            botMove();
    }

    function highlightWinningCells(combination) {
        combination.forEach(i => {
            const cell = document.querySelector(`[cell-index='${i}']`);
            cell.classList.add('winComb');
        });
    }

    function botMove() {
        let availableCells = gameState.map((cell, i) => cell === '' ? i : null).filter(cell => cell !== null);

        let botCellIndex;
        if(Math.floor(Math.random() * 101) < AI_strength)
            botCellIndex = AI(availableCells);        
        else
            botCellIndex = randomMove(availableCells);   

        console.log(`BOT ${currentPlayer}: ${botCellIndex}`);
        gameState[botCellIndex] = currentPlayer;
        
        const botCell = document.querySelector(`[cell-index='${botCellIndex}']`);
        botCell.textContent = currentPlayer;
        botCell.classList.add('clicked');
        isPlayerTurn = true;    
        winCheck();
    }

    function AI(availableCells){
        if(gameState[4] === '')
            return 4;
        else if(gameState[4] !== '' &&
                [0, 2, 6, 8].filter(i => gameState[i] === '').length === 4)
            return [0, 2, 6, 8][Math.floor(Math.random() * 4)];
        for (let i = 0; i < winComb.length; i++) {
            const winCondition = winComb[i];
            let comb = [gameState[winCondition[0]],
                        gameState[winCondition[1]],
                        gameState[winCondition[2]]];
            if (comb.filter(i => i === currentPlayer).length === 2 &&
                comb.includes(''))
                return winCondition[comb.findIndex(i => i === '')];
        }
        for (let i = 0; i < winComb.length; i++) {
            const winCondition = winComb[i];
            let comb = [gameState[winCondition[0]],
                        gameState[winCondition[1]],
                        gameState[winCondition[2]]];
            if (comb.filter(i => i === ((currentPlayer === 'X') ? 'O' : 'X')).length === 2 &&
                            comb.includes(''))
                return winCondition[comb.findIndex(i => i === '')];
        }
        for (let i = 0; i < winComb.length; i++) {
            const winCondition = winComb[i];
            let comb = [gameState[winCondition[0]],
                        gameState[winCondition[1]],
                        gameState[winCondition[2]]];
            if (comb.filter(i => i === '').length === 2  &&
                comb.includes(currentPlayer))
                return winCondition[comb.findIndex(i => i === '')];
        }
        
        return randomMove(availableCells);
    }

    function randomMove(availableCells){
        let randomIndex = Math.floor(Math.random() * availableCells.length);
        return availableCells[randomIndex];
    }

    function choose(){
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
        slider.value = AI_strength;
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
        switchBtn.checked = VS_bot;

        const switchBack = document.createElement('div');
        switchBack.classList.add('toggle');

        const switchText = document.createElement('div');
        switchText.classList.add('switchText');

        // VS 
        if(VS_bot){
            slider.classList.remove('off');
            oBtn.classList.remove('off');
            switchText.textContent = 'vs bot'; 
        }
        else{
            slider.classList.add('off');
            oBtn.classList.add('off');
            switchText.textContent = 'vs human'; 
        }

        // Events
        xBtn.addEventListener('click', function() {
            document.body.removeChild(background);
            isPlayerTurn = true;
            isGameActive = true;
            first = true;
        });
        oBtn.addEventListener('click', function() {
            document.body.removeChild(background);
            isPlayerTurn = false;
            isGameActive = true;
            first = false;
            botMove();
        });
        slider.addEventListener('input', function(event) {
            currentValue = event.target.value;
            AI_strength = slider.value;
        });
        switchBtn.addEventListener('change', function() {
            if (this.checked) {
                VS_bot = true;
                switchText.textContent = 'vs bot';
                oBtn.classList.remove('off');
                slider.classList.remove('off');
            } else {
                VS_bot = false;
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
        document.body.appendChild(background);
        //gameBoard.appendChild(background);
    }

    function end(who){
        const background = document.createElement('div');
        background.classList.add('background');

        const box = document.createElement('div');
        box.classList.add('box');

        // Message
        const messagebox = document.createElement('div');
        messagebox.classList.add('message-box');

        const whoWin = document.createElement('p');
        whoWin.classList.add('win');
        if(who !== '0')
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
        yesBtn.addEventListener('click', function() {
            document.body.removeChild(background);
            isRestart = true;
            createBoard();
        });

        noBtn.addEventListener('click', function() {
            document.body.removeChild(background);
            isRestart = false;
            choose();
            createBoard();
        });

        box.appendChild(whoWin);
        box.appendChild(messagebox);
        messagebox.appendChild(message);
        messagebox.appendChild(yesBtn);
        messagebox.appendChild(noBtn);
        background.appendChild(box);

        document.body.appendChild(background);
    }

    function createBoard() {
        console.clear();
        gameState = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        isPlayerTurn = first;
        gameBoard.innerHTML = '';
        isGameActive = true;
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('cell-index', i);
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('mouseenter', handleCellHover);
            cell.addEventListener('mouseleave', handleCellLeave);
            gameBoard.appendChild(cell);
        }
        if(isRestart && VS_bot && !isPlayerTurn)
            botMove();
    }
    choose();
    createBoard();
});
