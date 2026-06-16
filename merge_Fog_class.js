class Fog {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;
	grid = [];

	rendererCanvas = new FogRendererCanvas();
	eventBus = EventBus.getInstance();

	constructor(grid) {
		this.grid = grid;
		this.createGridFog();
		this.subscription();
	}

	subscription() {
		this.eventBus.on(EVENTS.CMD_CLEAR_FOG_AFTER_MERGE, (centerMerge, level, numberNewItems) => {
			this.clearFogBeforeMerge(centerMerge, level, numberNewItems);
		});

		this.eventBus.on(EVENTS.CMD_CLEAR_ALL_fOG_IN_CELL, (row, col) => {
			this.removeAllFog(row, col);
		})

		this.eventBus.on(EVENTS.CMD_CLEAR_FOG_AFTER_OPEN_SPHERE, (sphere) => {
			this.clearFogBeforeOpenPoverSphere(sphere);
		})


		this.eventBus.on(EVENTS.CMD_CLEAR_FOG_AFTER_MAGIC_WAY, (cell) => {
			this.clearFogAfterMagicWayInCell(cell);
		})
	}

	createGridFog() {
		for(let row = 0; row < this.rows; row++) {
			for(let col = 0; col < this.cols; col++) {
				this.grid[row][col].fog = { 
					layer: 0,
					isVisible: false
				};
			}
		}
	}

	updateGrid(grid) {
		this.grid = grid;
		this.eventBus.emit(EVENTS.CMD_RENDERING_FOG, this.grid);
	}

	isFogOnCell(row, col) {
		return this.grid[row][col].fog.layer != 0;
	}

	addFog(layer, row, col) {
		if(this.grid[row][col].landscape) { return }
		this.grid[row][col].fog.layer = layer;
		if(layer !== 0) {
			this.grid[row][col].fog.isVisible = true;
		}
	}

	removeFog(count, row, col) {
		if(this.grid[row][col].fog.layer == 0) { return }
		this.grid[row][col].fog.layer -= count;
	}

	removeAllFog(row, col) {
		if(this.grid[row][col].fog.layer == 0) { return }
		
		this.eventBus.emit(EVENTS.CMD_REMOVE_FOG_ON_CELL, this.grid[row][col].fog.layer, 0, row, col);
		this.grid[row][col].fog.layer = 0;
		this.grid[row][col].fog.isVisible = false;
	}

	isFogOnBoard() {
		for(let row = 0; row < this.rows; row++) {
			for(let col = 0; col < this.cols; col++) {
				if(this.grid[row][col].fog.layer != 0) { return true }
			}
		}
		return false;
	}

	clearFogBeforeOpenPoverSphere(sphere) {
		if(!this.isFogOnBoard()) { return }
		let cellsForClearOfFog = this.findCellsForClearOfFog(sphere.pover, sphere.row, sphere.col);
		this.clearFog(sphere.row, sphere.col, sphere.pover, cellsForClearOfFog);
	}

	clearFogBeforeMerge(centerMerge, level, numberNewItems) {
		if(!this.isFogOnBoard()) { return }

		const countCellsForClearOfFog = level * numberNewItems;
		let cellsForClearOfFog = this.findCellsForClearOfFog(countCellsForClearOfFog, centerMerge.row, centerMerge.col);
		this.clearFog(centerMerge.row, centerMerge.col, countCellsForClearOfFog, cellsForClearOfFog);
	}

	findCoordCellsUnderFogNearby(row, col, radius) {
		const cellsUnderFog =[];
		let radiusRow = radius
		if(radius > this.rows) { radiusRow = this.rows }

		for(let i = -radiusRow; i <= radiusRow; i++) {
			for(let j = -radius; j <= radius; j++) {
				if(row + i == row && col + j == col) { continue }
				if(row + i >= 0 && row + i < this.rows
				&& col + j >= 0 && col + j < this.cols) {
					if(this.grid[row + i][col + j].fog.layer != 0) {
						cellsUnderFog.push({row: row + i, col: col + j});
					}
				}
			}
		}
		return cellsUnderFog;
	}

	findCellsForClearOfFog(countCellsForClearOfFog, row, col) {
		let radius = 1;
		let cellsForClearOfFog = [];

		while(cellsForClearOfFog.length < countCellsForClearOfFog && radius < this.cols) {
			cellsForClearOfFog = this.findCoordCellsUnderFogNearby(row, col, radius);
			radius += 1;
		}

		cellsForClearOfFog.forEach((cell) => {
			cell.distance = Math.sqrt((cell.row - row)**2 + (cell.col - col)**2);
		})

		cellsForClearOfFog.sort((a,b) => a.distance - b.distance);
		return cellsForClearOfFog;
	}

	clearFog(row, col, power, cellsForClearOfFog) { 
		for(let i = 0; i < cellsForClearOfFog.length; i++) {
			if(power > 0) {
				const cell = cellsForClearOfFog[i];
				cell.layerFogStart = this.grid[cell.row][cell.col].fog.layer;
				
				if(power >= cell.layerFogStart) {
					this.removeFog(cell.layerFogStart, cell.row, cell.col);
					power -= cell.layerFogStart;
				} else {
					this.removeFog(power, cell.row, cell.col);
					power = 0;
				}
			}
		}
		const arrForClearOfFog = cellsForClearOfFog.filter((cell) => cell.layerFogStart);
		this.eventBus.emit(EVENTS.CMD_RENDERING_CREATE_MAGIC_WAY_EFFECT, row, col, arrForClearOfFog)
	}

	clearFogAfterMagicWayInCell(cell) {
		const layerFogStart = cell.layerFogStart;
		const layerFogEnd = this.grid[cell.row][cell.col].fog.layer;

		this.eventBus.emit(EVENTS.CMD_REMOVE_FOG_ON_CELL, layerFogStart, layerFogEnd,  cell.row,  cell.col);
					
		if(layerFogEnd === 0) {
			this.grid[cell.row][cell.col].fog.isVisible = false;
			const item = this.grid[cell.row][cell.col].item;
			this.eventBus.emit(EVENTS.CMD_GENERATE_GIFT, item);
			this.eventBus.emit(EVENTS.CMD_TRANSFORMED_ITEM, item);
		}
	}
}