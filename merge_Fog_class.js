class Fog {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;
	grid = [];
	renderer = new FogRenderer(); 

	constructor(grid) {
		this.grid = grid;
		this.createGridFog();
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
		for(let row = 0; row < this.rows; row++) {
			for(let col = 0; col < this.cols; col++) {
				if(this.grid[row][col].fog.layer != 0) {
					this.renderer.createFogDiv(this.grid[row][col].fog.layer, row, col);
					this.grid[row][col].fog.element = this.renderer.fogElementForSave;
					this.renderer.fogElementForSave = null;
				}
			}
		}
	}

	isFogOnCell(row, col) {
		return this.grid[row][col].fog.layer != 0;
	}

	addFog(layer, row, col) {
		if(this.grid[row][col].landscape) { return }
		this.grid[row][col].fog.layer = layer;
		this.renderer.createFogDiv(layer, row, col);
		this.grid[row][col].fog.element = this.renderer.fogElementForSave;
		this.renderer.fogElementForSave = null;
	}

	removeFog(row, col) {
		if(this.grid[row][col].fog.layer == 0) { return }
		this.grid[row][col].fog.layer -= 1;

	}

	removeAllFog(row, col) {
		if(this.grid[row][col].fog.layer == 0) { return }
		this.grid[row][col].fog.layer = 0;
		this.renderer.removeAllFogOnCell(this.grid[row][col].fog.element);
	}

	isFogOnBoard() {
		for(let row = 0; row < this.rows; row++) {
			for(let col = 0; col < this.cols; col++) {
				if(this.grid[row][col].fog.layer != 0) { return true }
			}
		}
		return false;
	}

	clearFogBeforeOpenPoverSphere(sphere, giftFromItem, giftOnItem) {
		if(!this.isFogOnBoard()) { return }
		let cellsForClearOfFog = this.findCellsForClearOfFog(sphere.pover, sphere.row, sphere.col);
		this.clearFog(sphere.row, sphere.col, sphere.pover, cellsForClearOfFog, giftFromItem, giftOnItem);
	}

	clearFogBeforeMerge(centerMerge, level, numberNewItems, giftFromItem, giftOnItem) {
		if(!this.isFogOnBoard()) { return }

		const countCellsForClearOfFog = level * numberNewItems;
		let cellsForClearOfFog = this.findCellsForClearOfFog(countCellsForClearOfFog, centerMerge.row, centerMerge.col);
		this.clearFog(centerMerge.row, centerMerge.col, countCellsForClearOfFog, cellsForClearOfFog, giftFromItem, giftOnItem);
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
			cellsForClearOfFog = this.findCoordCellsUnderFogNearby(row, col, radius)
			radius += 1;
		}

		cellsForClearOfFog.forEach((cell) => {
			cell.distance = Math.sqrt((cell.row - row)**2 + (cell.col - col)**2)
		})

		cellsForClearOfFog.sort((a,b) => a.distance - b.distance)
		return cellsForClearOfFog;
	}

	clearFog(row, col, countCellsForClearOfFog, cellsForClearOfFog, giftFromItem, giftOnItem) {
		for(let i = 0; i < countCellsForClearOfFog; i++) {
			if(cellsForClearOfFog[i]) {
				const layerFog = this.grid[cellsForClearOfFog[i].row][cellsForClearOfFog[i].col].fog.layer
				const fogElement = this.grid[cellsForClearOfFog[i].row][cellsForClearOfFog[i].col].fog.element
				this.removeFog(cellsForClearOfFog[i].row, cellsForClearOfFog[i].col);

				if(!this.isFogOnCell(cellsForClearOfFog[i].row, cellsForClearOfFog[i].col)) {
					const item = this.grid[cellsForClearOfFog[i].row][cellsForClearOfFog[i].col].item;
					if(item.gift) {
						giftFromItem.generateGiftFromItem(item);
					}
					if(item.giftOnItem) {
						giftOnItem.generateGiftOnItem(item);
					}
				}

				this.renderer.createMagicWayEffect(row, col, cellsForClearOfFog[i].row, cellsForClearOfFog[i].col)
				.then(() => {
					this.renderer.removeFogOnCell(layerFog, fogElement);
				})
			}
		}
	}
}