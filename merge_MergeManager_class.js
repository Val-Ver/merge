class MergeManager {
	manager = null;
	itemsForMerge = [];
	centerMerge = null;

	eventBus = EventBus.getInstance();

	constructor(manager) {
		this.manager = manager;
	}

	preformHighlightingItems(curretnItemId, itemId) {
		const currentItem = this.manager.getCurrentItem(curretnItemId);
		const findItem = this.manager.getCurrentItem(itemId);
		let itemsPref = [];
		itemsPref = this.findNeighborCells(currentItem, findItem.row, findItem.col);
		if(itemsPref.length > 1) {
			itemsPref.push(currentItem);
			this.eventBus.emit(EVENTS.CMD_RENDERING_ADD_HIGHLIGHTING_ITEM, itemsPref);
		} 
		return itemsPref
	}

	canMargeItem(curretnItemId, itemId) {
		const currentItem = this.manager.getCurrentItem(curretnItemId);
		const findItem = this.manager.getCurrentItem(itemId);

		this.itemsForMerge = this.findNeighborCells(currentItem, findItem.row, findItem.col);
		if(this.itemsForMerge.length > 1) {
			this.centerMerge = {row: findItem.row, col: findItem.col};
			this.itemsForMerge.push(currentItem);
// надо нарисовать
			//this.eventBus.emit(EVENTS.CMD_RENDERING_ADD_HIGHLIGHTING_ITEM, this.itemsForMerge);
			return true;
		} 
		return false;
	}

	findNeighborCells(currentItem, row, col, grup = [], isVisitCells = []) {
		const grid = this.manager.getGameBoard()

		const key = `${row}-${col}`;
		if(isVisitCells.some(i => i == key)) { return grup }

		if(row < 0 || row >= grid.length
		|| col < 0 || col >= grid[0].length) { return grup }

		const findItem = grid[row][col].item;

		if(!findItem || currentItem.type != findItem.type
		|| currentItem.breed != findItem.breed
		|| currentItem.level != findItem.level
		|| (currentItem.maxLevel && currentItem.level == currentItem.maxLevel))  { return grup }

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
		await this.manager.removeItemForMutable(this.itemsForMerge, this.centerMerge);

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
		
		if(this.itemsForMerge[0].merge) {
			type = this.itemsForMerge[0].merge.type;
			level = this.itemsForMerge[0].merge.level - 1;
		}
		
		if(this.itemsForMerge[0].breed) {
			const typeFlyer = this.itemsForMerge[0].breed;
			this.eventBus.emit(EVENTS.CMD_CREATE_FLYER, typeFlyer, numberNewItems, this.itemsForMerge[0].row, this.itemsForMerge[0].col);
		} else {
			this.manager.createItemForPlaceAfterMerge(type, level + 1, numberNewItems, this.centerMerge);
		}

		if(numberItemsKeepOriginal > 0) {
			this.manager.createItemForPlaceAfterMerge(this.itemsForMerge[0].type, this.itemsForMerge[0].level, numberItemsKeepOriginal, this.centerMerge);
		}

		const magicMerge = this.itemsForMerge[0].magicMerge;
		if(magicMerge) { 
			const countMagicMerge = Math.random() < GAME_CONFIG.MERGE_RULES.MAGIC_MERGE_CHANCE ? 1 : 0;
			if(countMagicMerge > 0) {
				this.manager.createItemForPlaceAfterMerge(magicMerge.type, magicMerge.level, countMagicMerge, this.centerMerge);
			}
		}

		if(type == 'flowers' || type == 'sphere' ) {
			this.eventBus.emit(EVENTS.CMD_CLEAR_FOG_AFTER_MERGE, this.centerMerge, this.itemsForMerge[0].level, numberNewItems);
		}
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