document.addEventListener('DOMContentLoaded', () => {

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'styles.css';

    document.head.appendChild(link);

    const gameBoard = document.getElementById('game');
    let currentPlayer;
    let AI_strength = 50;
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
        if (!isPlayerTurn && isGameActive)
            botMove();
    }

    function highlightWinningCells(combination) {
        combination.forEach(index => {
            const cell = document.querySelector(`[cell-index='${index}']`);
            cell.classList.add('winComb');
        });
    }

    function botMove() {
        if(!VS_bot)
            return;
        let availableCells = gameState.map((cell, index) => cell === '' ? index : null).filter(cell => cell !== null);

        let botCellIndex;
        if(Math.floor(Math.random() * 101) < AI_strength)
            botCellIndex = AI(availableCells);        
        else
            botCellIndex = randomMove(availableCells);   

        console.log(`BOT ${currentPlayer}: ${botCellIndex}`);
        gameState[botCellIndex] = currentPlayer;
        document.querySelector(`[cell-index='${botCellIndex}']`).textContent = currentPlayer;
        isPlayerTurn = true;    
        winCheck();
    }

    function AI(availableCells){
        if(gameState[4] === '')
            return 4;
        for (let i = 0; i < winComb.length; i++) {
            const winCondition = winComb[i];
            let comb = [gameState[winCondition[0]],
                        gameState[winCondition[1]],
                        gameState[winCondition[2]]];
            if( comb.filter(i => i === currentPlayer).length === 2 &&
                comb.filter(i => i === ((currentPlayer === 'X') ? 'O' : 'X')).length === 0 )
                return winCondition[comb.findIndex(i => i === '')];
                
            else if (comb.filter(i => i === ((currentPlayer === 'X') ? 'O' : 'X')).length === 2 &&
                     comb.filter(i => i === '').length === 1)
                return winCondition[comb.findIndex(i => i === '')];
        }

        for (let i = 0; i < winComb.length; i++) {
            const winCondition = winComb[i];
            let comb = [gameState[winCondition[0]],
                        gameState[winCondition[1]],
                        gameState[winCondition[2]]];
            if(comb.filter(i => i === ((currentPlayer === 'X') ? 'O' : 'X')).length === 0 )
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

        const difficult = document.createElement('p');
        difficult.classList.add('sliderText');
        difficult.textContent = 'difficult';

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
        switchText.textContent = VS_bot ? 'vs bot' : 'vs human'; 
        
        // Events
        xBtn.addEventListener('click', function() {
            document.body.removeChild(background);
            isPlayerTurn = true;
            isGameActive = true;
        });
        oBtn.addEventListener('click', function() {
            document.body.removeChild(background);
            isPlayerTurn = false;
            isGameActive = true;
            botMove();
        });
        slider.addEventListener('input', (event) => {
            currentValue = event.target.value;
            AI_strength = slider.value;
        });
        switchBtn.addEventListener('change', function() {
            if (this.checked) {
                VS_bot = true;
                switchText.textContent = 'vs bot';
            } else {
                VS_bot = false;
                switchText.textContent = 'vs human';
            }
        });
        
        
        messageBox.appendChild(message);
        messageBox.appendChild(oBtn);
        messageBox.appendChild(xBtn);
        box.appendChild(messageBox);
        
        sliderBox.appendChild(difficult);
        sliderBox.appendChild(slider);
        box.appendChild(sliderBox);
        
        label.appendChild(switchBtn);
        label.appendChild(switchBack);
        label.appendChild(switchText);
        box.appendChild(label);    
        
        background.appendChild(box);
        document.body.appendChild(background);
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
        if(who !== '0'){
            whoWin.textContent = `${who} won!`;
        }
        else {
            whoWin.textContent = 'DRAW!';
        }

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
            createBoard();
        });

        noBtn.addEventListener('click', function() {
            document.body.removeChild(background);
            window.close();
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
        choose();
        gameBoard.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('cell-index', i);
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('mouseenter', handleCellHover);
            cell.addEventListener('mouseleave', handleCellLeave);
            gameBoard.appendChild(cell);
        }
    }
    createBoard();
});
