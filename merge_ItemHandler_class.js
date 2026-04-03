
class ItemHandler {
	itemPlacer = null;

	dragManager = null;
	mergeManager = null;
	resources = null;
	infoPanel = null;

	constructor(itemPlacer, mergeManager) {
		this.itemPlacer = itemPlacer;
		this.mergeManager = mergeManager
		this.itemRegistry = itemPlacer.itemRegistry
		//this.dragManager = new DragManagerForGame(this);
	}

	addOptions(gameOptions) {
		this.resources = gameOptions.resources;
		this.infoPanel = gameOptions.infoPanel;
	}

	handleCell(itemId, row, col) {
		if(this.itemPlacer.gameBoard.canAddItem(row, col)) {
			this.itemPlacer.chengePlaceItemOnBoard(itemId, row, col);
			return;
		}  

		this.itemPlacer.stayBackItemOnBoard(itemId);
		return;
	}

	handleAfterDragItem(currentItemId, findItemId) { 
		if(this.mergeManager.canMargeItem(currentItemId, findItemId)) {
			this.mergeManager.createNewLevelItem();
			return;	
		} 
		this.itemPlacer.stayBackItemOnBoard(currentItemId);
		return;
	}

	openPoverSphere(sphere) {
		if(!this.itemPlacer.fogOnBoard.isFogOnBoard()) {
			this.infoPanel.showInfoPanel(sphere);
		} else {
			this.itemPlacer.removeItemFromGame(sphere);
			this.itemPlacer.fogOnBoard.clearFogBeforeOpenPoverSphere(sphere, this.giftFromItem, this.giftOnItem);
		}
	}

	handleItem(id) {
		const item = this.itemRegistry.getCurrentItem(id);
		
		if(item.countHasGiftOnItem && item.countHasGiftOnItem != 0) {
			this.itemPlacer.giftOnItem.createGiftOnBoardBeforeClick(item);
			return;
		}

		if(item.pover) {
			this.openPoverSphere(item);
			return;
		}

		if(item.type == 'gold') {
			const summ = item.level * 100;
			this.resources.increaseGold(summ);
			this.itemRegistry.removeItem(id);
			this.itemPlacer.gameBoard.clearItemInCell(item.row, item.col);
			this.itemPlacer.renderer.removeItem(item.element);
		}
	}

	handleOnShop(type, level) {
		const row = 3;
		const col = 10;
		const clearCellsCoordNearby = this.itemPlacer.gameBoard.findCoordClearCellsNearbyAll(row, col);
		const item = this.itemPlacer.addItemOnBoard(type, level, clearCellsCoordNearby[0].row, clearCellsCoordNearby[0].col);
		this.itemPlacer.renderer.placeItemOnBoardForBeginGame(item.element, clearCellsCoordNearby[0].row, clearCellsCoordNearby[0].col);
	}

	removeHighlightingItems(arrItems) { 
		this.itemPlacer.removeHighlightingItems(arrItems);
	}



	preformHighlightingItems(currentItemId, itemId) {
		return this.mergeManager.preformHighlightingItems(currentItemId, itemId);
	}

	createMergeCounter(currentElement, count) {
		this.itemPlacer.renderer.createMergeCounter(currentElement, count);
	}

	removeMergeCounter() {
		this.itemPlacer.renderer.removeMergeCounter();
	}

	stayBackItemOnBoard(itemId) {
		this.itemPlacer.stayBackItemOnBoard(itemId);
	}

	itemCallsDragon(itemId) {
		const item = this.itemRegistry.getCurrentItem(itemId);
		if(!item.giftCollect) { return }
		this.mergeManager.manager.itemCallsDragon(item)
	}
}