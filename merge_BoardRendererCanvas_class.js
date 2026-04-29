class BoardRendererCanvas {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	cell = GAME_CONFIG.BOARD_SIZE.CELL;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGTH;

	canvas = document.getElementById("board-canvas");
	sizeCanvas = this.canvas.getBoundingClientRect();
	ctx = this.canvas.getContext('2d');

	containerForPanoram = document.querySelector('.container-for-panoram');
	viewport = document.querySelector('.viewport-container');

	eventBus = EventBus.getInstance();

	constructor() {
		this.eventBus.on(EVENTS.CMD_CREATE_BOARD, (grid) => {
			this.createGameBoard(grid);
		})
	}

	createGameBoard(grid) {
		this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
		for(let row = 0; row < this.rows; row++) {
			for(let col = 0; col < this.cols; col++) {
				const cell = grid[row][col];
				const x = col * this.cell;
				const y = row * this.cell;	
				if(cell.landscape) {
					this.ctx.fillStyle = 'grey';
				} else {
					this.ctx.fillStyle = 'green';
				}
				this.ctx.fillRect(x, y, this.cell, this.cell);
				this.ctx.strokeStyle = 'grey';
				this.ctx.strokeRect(x, y, this.cell, this.cell);				
			}
		}

		this.positionToCenter();
	}

	positionToCenter() {
		const containerForPanoram = document.querySelector('.container-for-panoram');
		const viewport = document.querySelector('.viewport-container');
		containerForPanoram.style.left = `${this.viewport.clientWidth/2 -  this.boardWidth/2}px`;
	}

	getCenterCellCoord() {
		const text = this.containerForPanoram.style.transform;
		//const regex = /\d+/g;
		//const result = text.match(regex);
		//const resultNumber = result ? result.map(number => Number(number)) : "";

		const regex = /(-\d+|\d+)/g
		const result = text.match(regex);
		const resultNumber = result ? result.map(number => Number(number)) : "";

		return { 
			left: Math.abs(Number(this.containerForPanoram.style.left.split('px')[0])) + this.viewport.clientWidth/2  - (resultNumber[0] ? resultNumber[0] : 0),
			top:  Math.abs(Number(this.containerForPanoram.style.top.split('px')[0]))  + this.viewport.clientHeight/2 - (resultNumber[1] ? resultNumber[1] : 0)
			}
	}
}