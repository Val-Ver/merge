class MergeManager {
	manager = null;
	itemsForMerge = [];
	centerMerge = null;

	constructor(manager) {
		this.manager = manager;
	}

	preformHighlightingItems(curretnItemId, itemId) {
		const currentItem = this.manager.itemRegistry.getCurrentItem(curretnItemId);
		const findItem = this.manager.itemRegistry.getCurrentItem(itemId);
		let itemsPref = [];
		itemsPref = this.findNeighborCells(currentItem, findItem.row, findItem.col);
		if(itemsPref.length > 1) {
			itemsPref.push(currentItem);
			this.manager.itemHandler.addHighlightingItems(itemsPref);
		} 
		return itemsPref
	}

	canMargeItem(curretnItemId, itemId) {
		const currentItem = this.manager.itemRegistry.getCurrentItem(curretnItemId);
		const findItem = this.manager.itemRegistry.getCurrentItem(itemId);

		this.itemsForMerge = this.findNeighborCells(currentItem, findItem.row, findItem.col);
		if(this.itemsForMerge.length > 1) {
			this.centerMerge = {row: findItem.row, col: findItem.col};
			this.itemsForMerge.push(currentItem);
			this.manager.itemHandler.addHighlightingItems(this.itemsForMerge)
			return true;
		} 
		return false;
	}

	findNeighborCells(currentItem, row, col, grup = [], isVisitCells = []) {
		const grid = this.manager.itemPlacer.gameBoard.grid;
		
		const key = `${row}-${col}`;
		if(isVisitCells.some(i => i == key)) { return grup }

		if(row < 0 || row >= grid.length
		|| col < 0 || col >= grid[0].length) { return grup }

		const findItem = grid[row][col].item;

		if(!findItem || currentItem.type != findItem.type
		|| currentItem.level != findItem.level
		|| currentItem.level == currentItem.maxLevel)  { return grup }

		isVisitCells.push(key);
		grup.push(findItem);
 
		const directions = [
			[ 0, -1],
			[-1,  0],
			[ 0,  1],
			[ 1,  0]
		]

		for(let i = 0; i < directions.length; i++) {
			const x = row + directions[i][0];
			const y = col + directions[i][1];
			this.findNeighborCells(currentItem, x, y, grup, isVisitCells);
		}
		return grup;
	}

	async createNewLevelItem() { 
		await this.removeItemForMutable();

		let numberNewItems = 0;
		let numberItemsKeepOriginal = 0;

		if(this.itemsForMerge.length >= GAME_CONFIG.MERGE_RULES.MIN_FOR_BONUS) {
			numberNewItems = Math.trunc(this.itemsForMerge.length / GAME_CONFIG.MERGE_RULES.MIN_FOR_BONUS) * GAME_CONFIG.MERGE_RULES.BONUS_MULTIPLIER;
			numberItemsKeepOriginal = Math.trunc(this.itemsForMerge.length % GAME_CONFIG.MERGE_RULES.MIN_FOR_BONUS);
		} else {
			numberNewItems = Math.trunc(this.itemsForMerge.length / GAME_CONFIG.MERGE_RULES.MIN_FOR_MERGE);
			numberItemsKeepOriginal = Math.trunc(this.itemsForMerge.length % GAME_CONFIG.MERGE_RULES.MIN_FOR_MERGE);
		}

		if(numberItemsKeepOriginal >= GAME_CONFIG.MERGE_RULES.MIN_FOR_MERGE) {
			numberNewItems += Math.trunc(numberItemsKeepOriginal / GAME_CONFIG.MERGE_RULES.MIN_FOR_MERGE); 
			numberItemsKeepOriginal -= numberNewItems;
		}

		let type = this.itemsForMerge[0].type;
		let level = this.itemsForMerge[0].level;
		
		if(type == 'fruit') {
			type = 'gold';
			level = this.getLevelForGold(this.itemsForMerge[0].level) - 1;
		}

		this.createItemForPlace(type, level + 1, numberNewItems);

		if(numberItemsKeepOriginal > 0) {
			this.createItemForPlace(this.itemsForMerge[0].type, this.itemsForMerge[0].level, numberItemsKeepOriginal);
		}

		if(type == 'flowers' || type == 'sphere' ) {
			this.manager.itemPlacer.fogOnBoard.clearFogBeforeMerge(this.centerMerge, this.itemsForMerge[0].level, numberNewItems, this.manager.giftFromItem, this.manager.giftOnItem);
		}
	}

	createItemForPlace(type, level, numberItems = 1) {
		const clearCellsCoordNearby = this.manager.itemPlacer.gameBoard.findCoordClearCellsNearbyAll(this.centerMerge.row, this.centerMerge.col, numberItems);

		for(let i = 0; i < numberItems; i++) {
			let row = clearCellsCoordNearby[i].row;
			let col = clearCellsCoordNearby[i].col;

			if(this.manager.itemPlacer.gameBoard.canAddItem(row, col)) {
				const itemGame = this.manager.itemPlacer.addItemOnBoard(type, level, row, col);
				this.manager.itemPlacer.renderer.showPutItemOnBoardAfterMerge(itemGame.element, this.centerMerge.row, this.centerMerge.col, row, col);
			}
		}
	}
	
	removeItemForMutable() { //async можно поставить перед методом, здесь работает и так, а вообще надо
		this.itemsForMerge.forEach(item => {
			this.manager.itemPlacer.gameBoard.clearItemInCell(item.row, item.col);
			this.manager.itemRegistry.removeItem(item.id);

			if(this.manager.itemPlacer.fogOnBoard.isFogOnCell(item.row, item.col)) {
				this.manager.itemPlacer.fogOnBoard.removeAllFog(item.row, item.col);
			}

			if(item.gift) {
				this.manager.itemPlacer.giftFromItem.clearIntervalCreateGift(item.id);
			}

		})
 		const promises = this.itemsForMerge 
			.map((item) => {
				return this.manager.itemPlacer.renderer.showBeforeRemoveItem(this.centerMerge, item.element);
			})
		return Promise.all(promises);
	}

	getLevelForGold(levelItem) {
		switch(levelItem) {
			case 1: return 1;  
			case 2: return 1;
			case 3: return 2;
			case 4: return 2;
			case 5: return 3;
			case 6: return 3;
			case 7: return 4;
		}
	}
}