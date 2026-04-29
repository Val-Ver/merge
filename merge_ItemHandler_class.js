
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

		this.eventBus = EventBus.getInstance();
		this.subscription();
	}

	subscription() {
		this.eventBus.on(EVENTS.CMD_ADD_ITEM_IN_GAME, (type, level) => {
			this.handleOnShop(type, level);
		})
	}

	getCoordBoard(element, clientX, clientY) {
		return 	this.itemPlacer.getCoordBoard(element, clientX, clientY)
	
	}

	moveItem(item, x, y) {
		this.eventBus.emit('cmd: move Item', item, x, y);
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
			this.eventBus.emit(EVENTS.CMD_SHOW_MESSAGE_FOR_SALE, sphere)
		} else {
			this.itemPlacer.removeItemFromGame(sphere);
			this.eventBus.emit(EVENTS.CMD_CLEAR_FOG_AFTER_OPEN_SPHERE , sphere);
		}
	}

	showInfoPanel(id) {
		const item = this.itemPlacer.itemRegistry.getCurrentItem(id);
		this.itemPlacer.gameBoard.addItemInCell(item);
		this.eventBus.emit(EVENTS.CMD_SHOW_MESSAGE_FOR_SALE, item)
	}

	handleItem(id) {
		const item = this.itemRegistry.getCurrentItem(id);
		
		if(item.countHasGiftOnItem && item.countHasGiftOnItem != 0) {
			this.eventBus.emit(EVENTS.CMD_CREATE_GIFT_BEFORE_CLICK, item);
			return;
		}

		if(item.pover) {
			this.openPoverSphere(item);
			return;
		}

		if(item.type == 'gold') {
			const summ = item.level * 100;
			this.eventBus.emit(EVENTS.CMD_INCREASE_GOLD, summ);
			this.itemPlacer.removeItemFromGame(item);
			return;
		}
	}

	removeHighlightingItems(arrItems) { 
		this.eventBus.emit(EVENTS.CMD_RENDERING_REMOVE_HIGHLIGHTING_ITEM, arrItems);
	}

	preformHighlightingItems(currentItemId, itemId) {
		return this.mergeManager.preformHighlightingItems(currentItemId, itemId);
	}

	createMergeCounter(currentElement, count) {
		this.eventBus.emit(EVENTS.CMD_RENDERING_CREATE_MERGE_COUNTER, currentElement, count);
	}

	removeMergeCounter() {
		this.eventBus.emit(EVENTS.CMD_RENDERING_REMOVE_MERGE_COUNTER, );
	}
	stayBackItemOnBoard(itemId) {
		this.itemPlacer.stayBackItemOnBoard(itemId);
	}

	stayBackItemAfterClick(itemId) {
		this.itemPlacer.stayBackItemAfterClick(itemId);
	}

	handleOnShop(type, level) {
		const centerCell = this.itemPlacer.findCenterCell();
		const clearCellsCoordNearby = this.itemPlacer.gameBoard.findCoordClearCellsNearbyAll(centerCell.row, centerCell.col);
		const item = this.itemPlacer.addItemToGameForBegin(type, level, clearCellsCoordNearby[0].row, clearCellsCoordNearby[0].col);
	}

	itemCollsFlyer(itemId) {
		const item = this.itemRegistry.getCurrentItem(itemId);
		if(!item.giftCollect && !item.magicCollect) { return }
		if(item.magicCollect) {
			item.giftCollect = Math.random() > GAME_CONFIG.GENERATE_RULES.RANDOM_TYPE_CHANCE ? item.magicCollect[0] : item.magicCollect[1];
		}
		this.eventBus.emit(EVENTS.CMD_CHANGE_DIRECTION_FLYER, item);
	}
}