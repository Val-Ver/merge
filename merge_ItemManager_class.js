class ItemManager {
	mergeManager = null;
	itemPlacer = null;
	itemHandler = null;
	eventEmiter = null;	
	
	constructor(board, fogOnBoard, eventEmiter) {
		this.eventEmiter = eventEmiter;
		this.itemPlacer = new ItemPlacer(board, fogOnBoard);
		this.mergeManager = new MergeManager(this);
		this.itemHandler = new ItemHandler(this.itemPlacer, this.mergeManager);
	}
	
	createDragon(type, count, row, col) {
		this.eventEmiter.emit('dragonAppeared', type, count, row, col) 
	}

	itemPutOnBoardFromDragon(row, col) {
		this.itemPlacer.itemPutOnBoardFromDragon(row, col);
	}

	itemCollsDragon(item) {
		this.eventEmiter.emit('itemCollsDragon', item);
	}
//------------------------------------------

	getInfoAboutItemForSale(itemId) { // ItemRegistry // не нашла где используется
console.error('сработал getInfoAboutItemForSale')
		const item = this.itemRegistry.getCurrentItem(itemId);
		return { type: item.type, level: item.level }
	}

	clearItemInCell(row, col) {
console.error('сработал clearItemInCell')
		this.itemPlacer.gameBoard.clearItemInCell(row, col);
	}

	removeAllFog(row, col) {
console.error('сработал removeAllFog')
		this.itemPlacer.fogOnBoard.removeAllFog(row, col);
	}

	removeItem(itemId) {
console.error('сработал removeItem')
		this.itemHandler.itemRegistry.removeItem(itemId);
	}

//--------------------------------------------

	updateItemOnBoard(grid) {
		this.itemPlacer.updateItemOnBoard(grid);
	}

	getCurrentItem(itemId) {
		return this.itemPlacer.itemRegistry.getCurrentItem(itemId);
	}

	getGameBoard() {
		return this.itemPlacer.gameBoard.grid;
	}

	clearFogBeforeMerge(centerMerge, level, numberNewItems, giftFromItem, giftOnItem) {
		this.itemPlacer.fogOnBoard.clearFogBeforeMerge(centerMerge, level, numberNewItems, giftFromItem, giftOnItem);
	}

	createItemForPlaceAfterMerge(type, level, numberItems, centerMerge) {
		this.itemPlacer.createItemForPlaceAfterMerge(type, level, numberItems, centerMerge);
	}

	removeItemForMutable(itemsForMerge, centerMerge) {
		return this.itemPlacer.removeItemForMutable(itemsForMerge, centerMerge);
	}
	addHighlightingItems(arr) {
		this.itemPlacer.addHighlightingItems(arr); 
	}

	addOptions(gameOptions) {
		this.itemHandler.addOptions(gameOptions);
	}


}
