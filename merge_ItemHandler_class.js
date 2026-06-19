class ItemHandler {
	itemPlacer = null;

	dragManager = null;
	mergeManager = null;
	resources = null;
	infoPanel = null;

	constructor(itemPlacer, mergeManager) {
		this.itemPlacer = itemPlacer;
		this.mergeManager = mergeManager;
		this.itemRegistry = itemPlacer.itemRegistry;

		this.eventBus = EventBus.getInstance();
	}

	getCoordBoard(element, clientX, clientY) {
		return 	this.itemPlacer.getCoordBoard(element, clientX, clientY);
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
			this.eventBus.emit(EVENTS.CMD_SHOW_MESSAGE_FOR_SALE, sphere);
		} else {
			this.itemPlacer.removeItemFromGame(sphere);
			this.eventBus.emit(EVENTS.CMD_CLEAR_FOG_AFTER_OPEN_SPHERE, sphere);
		}
	}

	showInfoPanel(id) {
		const item = this.itemPlacer.itemRegistry.getCurrentItem(id);
		this.itemPlacer.gameBoard.addItemInCell(item);
		this.eventBus.emit(EVENTS.CMD_SHOW_MESSAGE_FOR_SALE, item);
	}

	handleItem(id) {
		const item = this.itemRegistry.getCurrentItem(id);
		
		if(item.countHasGiftOnItem && item.countHasGiftOnItem !== 0) {
			this.eventBus.emit(EVENTS.CMD_CREATE_GIFT_BEFORE_CLICK, item);
			return;
		}

		if(item.pover) {
			this.openPoverSphere(item);
			return;
		}

		if(item.price) {
			const summ = item.price;
			this.eventBus.emit(EVENTS.CMD_INCREASE_RESOURCE, item.type, summ);
			this.itemPlacer.removeItemFromGame(item);
			return;
		}

		if(item.giftsAfterClickOnItem) {
			this.eventBus.emit(EVENTS.CMD_CREATE_GIFT_FROM_CLICK_ON_ITEM, item);
			return;
		}
		if(item.giftsFromClickOnItemForOneTime) {
			this.eventBus.emit(EVENTS.CMD_CREATE_GIFT_FROM_CLICK_ON_ITEM, item);
			return;
		}
	}

	removeHighlightingItems(arrItems) { 
		this.eventBus.emit(EVENTS.CMD_RENDERING_REMOVE_HIGHLIGHTING_ITEM, arrItems);
	}

	preformHighlightingItems(currentItem, item) {
		return this.mergeManager.preformHighlightingItems(currentItem, item);
	}

	stayBackItemOnBoard(itemId) {
		this.itemPlacer.stayBackItemOnBoard(itemId);
	}

	clearItemOnBoardForDrag(item) {
		this.eventBus.emit(EVENTS.CMD_RENDERING_CLEAR_ITEM_FOR_DRAG, item);
	}

	itemCollsFlyer(itemId) {
		const item = this.itemRegistry.getCurrentItem(itemId);
		if(!item.giftCollect && !item.magicCollect) { return }

		const beforeClickOnItem = this.itemRegistry.itemOnBoard.filter(itemOnBoard  => 
			itemOnBoard.id != itemId && itemOnBoard.countOfClick > 0
		)
		.forEach(clickItem => { clickItem.countOfClick = 0 })

		item.countOfClick++

		if(item.magicCollect) {
			item.giftCollect = Math.random() > GAME_CONFIG.GENERATE_RULES.RANDOM_TYPE_CHANCE ? item.magicCollect[0] : item.magicCollect[1];
		}

		for(let i = 0; i < item.countOfClick; i++) {
			const time = GAME_CONFIG.GENERATE_RULES.TIMEOUT_COLL_FLYER_ON_ITEM;
			item.timeOutCollsFlyer = setTimeout(() => {
				this.eventBus.emit(EVENTS.CMD_CHANGE_DIRECTION_FLYER, item);
			}, i * time)
		}
	}
}