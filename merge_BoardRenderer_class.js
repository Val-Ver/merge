class BoardRenderer {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	cell = GAME_CONFIG.BOARD_SIZE.CELL;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGTH;

	constructor() {
	}

	createGameBoard() {
		this.positionToCenter(document.querySelector('.container-for-panoram'));

		const container = document.querySelector('.board-container');
		container.style.width = `${this.boardWidth}px`;
		container.dataset.rows = `${this.rows}`;
		container.dataset.cols = `${this.cols}`;
		container.style.gridTemplateColumns = `repeat(${this.cols}, ${100/this.cols}%)`;
		container.style.gridTemplateRows = `repeat(${this.rows}, ${100/this.rows}%)`;
		container.innerHTML = '';

		for(let row = 0; row < this.rows; row++) {
			for(let col = 0; col < this.cols; col++) {
				const cell = document.createElement('div');
				cell.className = 'cell';
				cell.id = `cell-${row}-${col}`;
				cell.dataset.name = 'cell';
				cell.dataset.row = `${row}`;
				cell.dataset.col = `${col}`;
				this.createBoardLandscape(cell, row, col);
				container.appendChild(cell);
			}
		}
	}

	positionToCenter(element) {
		const viewport = document.querySelector('.viewport-container');
		element.style.left = `${viewport.clientWidth/2 -  this.boardWidth/2}px`;
	
	}

	createBoardLandscape(element, row, col) {
		for(let row1 in BOARD_LANDSCAPE) {
			for(let i = 0; i < BOARD_LANDSCAPE[row1].length; i++) {
				let col1 = BOARD_LANDSCAPE[row1][i];
				if(row == row1 && col == col1) {
					element.classList.add('landscape');
					element.dataset.name = 'landscape';
				}
			}
		}
	}
}