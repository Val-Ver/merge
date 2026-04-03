class GiftOnItem {
	renderer = new GiftOnItemRenderer();
	manager = null;

	constructor(manager) {
		this.manager = manager;
	}

	generateGiftOnItem(item) {
		this.renderer.createDivForGifts(item.element, item.giftOnItem.count);
		item.elementHasGiftOnItem = this.renderer.elementForSave;
		this.renderer.elementForSave = null;

		for(let i = 0; i < item.giftOnItem.count; i++) {
			setTimeout(() =>{
			const currentItem = this.manager.itemRegistry.getCurrentItem(item.id)
				if(currentItem) { 
					this.addGiftOnItem(currentItem);
				} 
			}, (i + 1) * item.giftOnItem.time)
		}
	}

	updateGiftOnItem(item) {
		this.renderer.createDivForGifts(item.element, item.giftOnItem.count);
		item.elementHasGiftOnItem = this.renderer.elementForSave;
		this.renderer.elementForSave = null;

		for(let i = 0; i < item.countHasGiftOnItem; i++) {
			const itemOnItem = new Item(item.giftOnItem.type, item.giftOnItem.level, item.row, item.col);
			this.renderer.createGiftOnItem(item.elementHasGiftOnItem, itemOnItem.id, itemOnItem.pic);
		}

		for(let i = item.countHasGiftOnItem; i < item.giftOnItem.count; i++) {
			const timePeriod = item.giftOnItem.count - i;
			this.generateGiftOnItemBeforeClick(timePeriod, item)
		}
	}

	addGiftOnItem(item) {
		item.countHasGiftOnItem++
		const itemOnItem = new Item(item.giftOnItem.type, item.giftOnItem.level, item.row, item.col);
		this.renderer.createGiftOnItem(item.elementHasGiftOnItem, itemOnItem.id, itemOnItem.pic);
	}

	removeGiftOnItem(item) {
		item.countHasGiftOnItem--
		const itemGifts = this.renderer.removeGiftOnItem(item.elementHasGiftOnItem);
	}

	createGiftOnBoardBeforeClick(item) {
		const clearCellsCoordNearby = this.manager.gameBoard.findCoordClearCellsNearbyAll(item.row, item.col);
		if(clearCellsCoordNearby.length == 0) { console.log('нет места'); return }

		this.removeGiftOnItem(item);

		const gift = item.giftOnItem;
		const itemGame = this.manager.addItemOnBoard(gift.type, gift.level, clearCellsCoordNearby[0].row, clearCellsCoordNearby[0].col);
		this.manager.renderer.placeItemOnBoardForBeginGame(itemGame.element, clearCellsCoordNearby[0].row, clearCellsCoordNearby[0].col);

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