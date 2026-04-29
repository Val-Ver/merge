class Board {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;
	cell = GAME_CONFIG.BOARD_SIZE.CELL;

	grid = [];
	//renderer = new BoardRenderer(); 
	renderer = new BoardRendererCanvas();

	centerCell = {};
	eventBus = EventBus.getInstance();

	constructor() {

		this.createGameBoard();
		this.eventBus.emit(EVENTS.CMD_CREATE_BOARD, this.grid);
		//this.rendererCanvas.createGameBoard(this.grid);
	}

	createGameBoard() {
		for(let row = 0; row < this.rows; row++) {
			this.grid[row] = [];
			for(let col = 0; col < this.cols; col++) {
				this.grid[row][col] = { 
					item: null
				}
			}
		}
		this.createBoardLandscape();
	}

	createBoardLandscape() {
		for(let row in BOARD_LANDSCAPE) {
			for(let i = 0; i < BOARD_LANDSCAPE[row].length; i++) {
				let col = BOARD_LANDSCAPE[row][i]
				this.grid[row][col].landscape = true;
			}
		}
	}

	updateGrid(grid) {
		this.grid = grid;
	}

	findCenterCell() {
		const style = this.renderer.getCenterCellCoord();
		const cell = {
				col: Math.floor(style.left / this.cell),
				row: Math.floor(style.top  / this.cell)
			}
		return cell
	}
	
	findCoordClearCellsNearbyAll(row, col, numberItems = 1) {
		let radius = 1;
		let clearCellsCoordNearby = []; 

		while(clearCellsCoordNearby.length < numberItems && radius < this.rows) {
			clearCellsCoordNearby = this.findCoordClearCellsNearby(row, col, radius);
			radius += 1;
		}

		clearCellsCoordNearby.forEach((cell) => {
			cell.distance = Math.sqrt((cell.row - row)**2 + (cell.col - col)**2)
		})

		clearCellsCoordNearby.sort((a,b) => a.distance - b.distance)

		return clearCellsCoordNearby;
	}

	findCoordClearCellsNearby(row, col, radius = 1) {
		const clearCells = [];
		if(this.canAddItem(row, col)) {
			clearCells.push({row: row, col: col});
		}
		for(let i = -radius; i <= radius; i++) {
			for(let j = -radius; j <= radius; j++) {
				if(row + i == row && col + j == col) { continue }
				if(row + i >= 0 && row + i < this.rows
				&& col + j >= 0 && col + j < this.cols) {
					if(this.canAddItem(row + i, col + j)) {
						clearCells.push({row: row + i, col: col + j});
					}
				}
			}
		}
		return clearCells;
	}

	canAddItem(row, col) {
		if(this.grid[row][col].item ||
		this.grid[row][col].landscape) { return false }
		return true
	}

	addItemInCell(item) {
		this.grid[item.row][item.col].item = item;
	}

	clearItemInCell(row, col) {
		this.grid[row][col].item = null;
	}

	findItemOnBoard(row, col) {
		return this.grid[row][col].item;
	}
}
