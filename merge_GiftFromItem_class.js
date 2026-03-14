class GiftFromItem {
	manager = null;
	intervalCreateGiftItems = [];
	itemForTransformation = null;

	constructor(manager) {
		this.manager = manager;
	}

	getTimeForTransformation(type) {
		switch(type) {
			case 'flowers': return items.flowers.set[0].time;
			case 'water':   return items.water.set[0].time;
			case 'trees':   return items.trees.set[0].time;
		}
	}

	generateGiftFromItem(item) {
		const intervalCreateGift = setInterval(() => {
			const currentItem = this.manager.itemRegistry.getCurrentItem(item.id)
			const clearCellsCoordNearby = this.manager.gameBoard.findCoordClearCellsNearby(currentItem.row, currentItem.col);

			if(clearCellsCoordNearby.length == 0) { console.log('нет места'); return; }
			this.createGift(currentItem.gift.type, currentItem.gift.level, clearCellsCoordNearby[0])
		}, item.gift.time)

		this.intervalCreateGiftItems.push({interval: intervalCreateGift, id: item.id})
	}

	createGift(type, level, cellObj) {
		const itemGame = this.manager.addItemOnBoard(type, level, cellObj.row, cellObj.col);
		this.manager.renderer.placeItemOnBoardForBeginGame(itemGame.element, cellObj.row, cellObj.col);
		
		const time = this.getTimeForTransformation(type);
		//const findItem = this.manager.gameBoard.findItemOnBoard(cellObj.row, cellObj.col);


		setTimeout(() => {
			//const itemBeforeTime = this.manager.itemRegistry.getCurrentItem(findItem.id);

			const itemBeforeTime = this.manager.itemRegistry.getCurrentItem(itemGame.id);
			if(itemBeforeTime && itemBeforeTime.level == 0) {
				if(itemBeforeTime.isDraging) {
					this.itemForTransformation = itemBeforeTime;
				} else {
					this.createTransformItem(itemBeforeTime);
				}
			}
		}, time)
	}
	
	createTransformItem(item) {
		const typeItem = item.type == 'water' ? "mushrooms" : item.type;
		this.manager.gameBoard.clearItemInCell(item.row, item.col);
		this.manager.itemRegistry.removeItem(item.id);
		this.manager.renderer.removeItem(item.element); //при обновлении не работает анимация

		const itemGame = this.manager.addItemOnBoard(typeItem, item.level + 1, item.row, item.col);
		this.manager.renderer.placeItemOnBoardForBeginGame(itemGame.element, item.row, item.col);
	}
	
	clearIntervalCreateGift(id) {
		const findInterval = this.intervalCreateGiftItems.filter(interval => interval.id == id);

		if(findInterval[0].interval) { 
			clearInterval(findInterval[0].interval);
			this.intervalCreateGiftItems = this.intervalCreateGiftItems.filter(interval => interval.id != id)
		}
	}
}
