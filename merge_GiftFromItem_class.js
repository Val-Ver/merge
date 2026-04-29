class GiftFromItem {
	manager = null;
	intervalCreateGiftItems = [];
	itemForTransformation = null;
	eventBus = EventBus.getInstance();

	constructor(manager) {
		this.manager = manager;
		this.subscription();
	}

	subscription() {
		this.eventBus.on(EVENTS.CMD_GENERATE_GIFT, (item) => {
			this.generateGiftFromItem(item);
			
			
		})

		this.eventBus.on(EVENTS.CMD_UPDATE_GIFT, (item) => {
			this.generateGiftFromItem(item);
			this.createTransformItem(item);
		})

		this.eventBus.on(EVENTS.CMD_CREATE_TRANSFORM_ITEM, (item) => {
			this.createTransformItemAfterDrag(item)
		})

		this.eventBus.on(EVENTS.CMD_CLEAR_INTERVAL_CREATE_GIFT, (item) => {
			this.clearIntervalCreateGift(item);
		})
		this.eventBus.on(EVENTS.CMD_CREATE_GIFT, (type, level, cellObj) => {
			this.createGift(type, level, cellObj);
		})
	}

	generateGiftFromItem(item) {
		if(!item.gift) { return }
		const intervalCreateGift = setInterval(() => {
			const currentItem = item;
			const clearCellsCoordNearby = this.manager.gameBoard.findCoordClearCellsNearby(currentItem.row, currentItem.col);

			if(clearCellsCoordNearby.length == 0) { console.log('нет места'); return; }
			this.createGift(currentItem.gift.type, currentItem.gift.level, clearCellsCoordNearby[0]);
		}, item.gift.time)

		this.intervalCreateGiftItems.push({interval: intervalCreateGift, id: item.id})
	}


	createGift(type, level, cellObj) {
		const itemGame = this.manager.addItemToGameForBegin(type, level, cellObj.row, cellObj.col);
		this.transformedItem(itemGame);
	}

	transformedItem(itemGame) {
		if(!itemGame.transformed) { return }
		//const itemGame = this.manager.addItemToGameForBegin(type, level, cellObj.row, cellObj.col);
		const time = this.getTimeForTransformation(itemGame);
		
		setTimeout(() => {
			const itemAfterTime = this.manager.itemRegistry.getCurrentItem(itemGame.id);
			if(itemAfterTime && itemAfterTime.transformed) {
			//if(itemAfterTime && itemAfterTime.level == 0) {
				if(itemAfterTime.isDraging) {
					this.itemForTransformation = itemAfterTime;
				} else {
					this.createTransformItem(itemAfterTime);
				}
			}
		}, time)
	}

	getTimeForTransformation(item) {
		//if(!item.transformed) { return }
		return item.transformed.time;
	}

	createTransformItem(item) {
		if(!item.transformed) { return }
		//if(item.level !== 0) { return }
		const typeItem = item.transformed.type
		const level = item.transformed.level
		//const typeItem = item.type == 'water' ? "mushrooms" : item.type;
		this.eventBus.emit(EVENTS.CMD_REMOVE_ITEM, item);
		const itemGame = this.manager.addItemToGameForBegin(typeItem, level, item.row, item.col);
		//const itemGame = this.manager.addItemToGameForBegin(typeItem, item.level + 1, item.row, item.col);
	}

	createTransformItemAfterDrag(item) { 
		if(item.level !== 0 ) { return }
		if (this.itemForTransformation
		&& item.id === this.itemForTransformation.id ) { 
			this.itemForTransformation = null;
			this.createTransformItem(item);
		}
	}

	clearIntervalCreateGift(item) {
		if(!item.gift) { return }
		const id = item.id;
		const findInterval = this.intervalCreateGiftItems.filter(interval => interval.id == id);
		if(findInterval[0].interval) { 
			clearInterval(findInterval[0].interval);
			this.intervalCreateGiftItems = this.intervalCreateGiftItems.filter(interval => interval.id != id)
		}
	}
}
