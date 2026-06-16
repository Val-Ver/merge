class GiftOnItem {
	manager = null;
	eventBus = EventBus.getInstance();

	constructor(manager) {
		this.manager = manager;
		this.subscription();
	}

	subscription() {
		this.eventBus.on(EVENTS.CMD_GENERATE_GIFT, (item) => {
			this.generateGiftOnItem(item);
		})

		this.eventBus.on(EVENTS.CMD_UPDATE_GIFT, (item) => {
			this.updateGiftOnItem(item);
		})

		this.eventBus.on(EVENTS.CMD_CREATE_GIFT_BEFORE_CLICK, (item) => {
			this.createGiftOnBoardBeforeClick(item);
		})
	}

	generateGiftOnItem(item) {
		if(!item.giftOnItem) { return }

		for(let i = 0; i < item.giftOnItem.count; i++) {
			setTimeout(() => {
			const currentItem = this.manager.itemRegistry.getCurrentItem(item.id)
				if(currentItem) { 
					this.addGiftOnItem(currentItem);
				} 
			}, (i + 1) * item.giftOnItem.time)
		}
	}

	updateGiftOnItem(item) {
		if(!item.giftOnItem) { return }

		for(let i = 0; i < item.countHasGiftOnItem; i++) {
			const itemOnItem = new Item(item.giftOnItem.type, item.giftOnItem.level, item.row, item.col);
			this.eventBus.emit(EVENTS.CMD_RENDERING_GIFT_ON_ITEM, item);
		}

		for(let i = item.countHasGiftOnItem; i < item.giftOnItem.count; i++) {
			const timePeriod = item.giftOnItem.count - i;
			this.generateGiftOnItemBeforeClick(timePeriod, item)
		}
	}

	addGiftOnItem(item) {
		item.countHasGiftOnItem++
		const itemOnItem = new Item(item.giftOnItem.type, item.giftOnItem.level, item.row, item.col);
		this.eventBus.emit(EVENTS.CMD_RENDERING_GIFT_ON_ITEM, item);
	}

	removeGiftOnItem(item) {
		item.countHasGiftOnItem--;
		this.eventBus.emit(EVENTS.CMD_RENDERING_REMOVE_GIFT_ON_ITEM, item)
	}

	createGiftOnBoardBeforeClick(item) {
		const clearCellsCoordNearby = this.manager.gameBoard.findCoordClearCellsNearbyAll(item.row, item.col);
		if(clearCellsCoordNearby.length == 0) { console.log('нет места'); return }
		this.removeGiftOnItem(item);

		const gift = item.giftOnItem;
		const typeGift = gift.type == 'bucket' ? 'water' : gift.type; 
		const itemGame = this.manager.addItemToGameForBegin(typeGift, gift.level, clearCellsCoordNearby[0].row, clearCellsCoordNearby[0].col);
		const timePeriod = gift.count - item.countHasGiftOnItem;

		this.generateGiftOnItemBeforeClick(timePeriod, item)
	}

	generateGiftOnItemBeforeClick(timer, item) {
		const generateGift = setTimeout(() =>{
			if(item) { 
				this.addGiftOnItem(item);
			}
		}, timer * item.giftOnItem.time)
	}
}