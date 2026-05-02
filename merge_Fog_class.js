class Fog {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;
	grid = [];
	renderer = new FogRenderer();
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
	}

	createGridFog() {
		for(let row = 0; row < this.rows; row++) {
			for(let col = 0; col < this.cols; col++) {
				this.grid[row][col].fog = { 
					layer: 0,
					element: null
				};
			}
		}
	}

	updateGrid(grid) {
		this.grid = grid;
		/*for(let row = 0; row < this.rows; row++) {
			for(let col = 0; col < this.cols; col++) {
				if(this.grid[row][col].fog.layer != 0) {
					//this.eventBus.emit(EVENTS.CMD_RENDERING_FOG, this.grid[row][col].fog.layer, row, col, this.grid);
				}
			}
		}*/
		this.eventBus.emit(EVENTS.CMD_RENDERING_FOG, this.grid);
	}

	isFogOnCell(row, col) {
		return this.grid[row][col].fog.layer != 0;
	}

	addFog(layer, row, col) {
		if(this.grid[row][col].landscape) { return }
		this.grid[row][col].fog.layer = layer;
	}

	removeFog(row, col) {
		if(this.grid[row][col].fog.layer == 0) { return }
		this.grid[row][col].fog.layer -= 1;
	}

	removeAllFog(row, col) {
		if(this.grid[row][col].fog.layer == 0) { return }
		
		this.eventBus.emit(EVENTS.CMD_REMOVE_FOG_ON_CELL, this.grid[row][col].fog.layer, 0, row, col);
		this.grid[row][col].fog.layer = 0;
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
		for(let i = -radius; i <= radius; i++) {
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

		while(cellsForClearOfFog.length < countCellsForClearOfFog && radius < this.rows) {
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
				const layerFog = this.grid[cell.row][cell.col].fog.layer;

				const fogElement = this.grid[cell.row][cell.col].fog.element;
				if(power >= layerFog) {
					this.removeFog1(layerFog, cell.row, cell.col);
					power -= layerFog;
				} else {
					this.removeFog1(power, cell.row, cell.col);
					power = 0;
				}

				// const layerFogNew = this.grid[cell.row][cell.col].fog.layer;
				//
				// if(layerFogNew === 0) {
				// 	const item = this.grid[cell.row][cell.col].item;
				// 	this.eventBus.emit(EVENTS.CMD_GENERATE_GIFT, item);
				// }

				new Promise((resolve, reject) => {
					this.eventBus.emit(EVENTS.CMD_RENDERING_CREATE_MAGIC_WAY_EFFECT, row, col, cell.row, cell.col, resolve)
				})
				.then(() => {
					const layerFogNew = this.grid[cell.row][cell.col].fog.layer;
					if(layerFogNew === 0) {
						const item = this.grid[cell.row][cell.col].item;
						this.eventBus.emit(EVENTS.CMD_GENERATE_GIFT, item);
					}
					this.eventBus.emit(EVENTS.CMD_REMOVE_FOG_ON_CELL, layerFog, layerFogNew,  cell.row,  cell.col);
				})
			}
		}
	}


//------------------------------------------------
// были такие:

	removeFog1(count, row, col) {
		if(this.grid[row][col].fog.layer == 0) { return }
		this.grid[row][col].fog.layer -= count;
	}

	clearFog1(row, col, countCellsForClearOfFog, cellsForClearOfFog, giftFromItem, giftOnItem) {
		for(let i = 0; i < countCellsForClearOfFog; i++) {
			if(cellsForClearOfFog[i]) {
				const layerFog = this.grid[cellsForClearOfFog[i].row][cellsForClearOfFog[i].col].fog.layer
				const fogElement = this.grid[cellsForClearOfFog[i].row][cellsForClearOfFog[i].col].fog.element
				this.removeFog(cellsForClearOfFog[i].row, cellsForClearOfFog[i].col);

				if(!this.isFogOnCell(cellsForClearOfFog[i].row, cellsForClearOfFog[i].col)) {
					const item = this.grid[cellsForClearOfFog[i].row][cellsForClearOfFog[i].col].item;
					this.eventBus.emit(EVENTS.CMD_GENERATE_GIFT, item);
				}

				this.renderer.createMagicWayEffect(row, col, cellsForClearOfFog[i].row, cellsForClearOfFog[i].col)
				.then(() => {
					this.renderer.removeFogOnCell(layerFog, fogElement);
				})
			}
		}
	}
}