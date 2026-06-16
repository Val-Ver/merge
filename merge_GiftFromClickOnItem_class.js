class GiftFromClickOnItem {
	eventBus = EventBus.getInstance();

	constructor(manager) {
		this.manager = manager;
		this.subscription();
	}

	subscription() {
		this.eventBus.on(EVENTS.CMD_GENERATE_GIFT, (item) => {
			this.generateGiftFromClickOnItem(item);			
		})
		this.eventBus.on(EVENTS.CMD_CREATE_GIFT_FROM_CLICK_ON_ITEM, (item) => {
			this.createGiftOnBoardAfterClickOnItem(item)
		}) 
	}

	generateGiftFromClickOnItem(item) {
		//if(item.level != item.maxLevel) { return }
		if(!item.setFromClickOnItem) { return }

		const count = item.setFromClickOnItem.count;
		item.giftsAfterClickOnItem = [];

		for(let i = 0; i < count; i++) {
			const chance = Math.random() < (count - i) / count;
			const gift = chance ? item.setFromClickOnItem.start : item.setFromClickOnItem.end
			item.giftsAfterClickOnItem.push(gift);
		}
	}

	createGiftOnBoardAfterClickOnItem(item) {
		if(!item.giftsAfterClickOnItem) { return }
		const gifts = item.giftsAfterClickOnItem.shift();
		gifts.forEach((gift) => {
			const clearCellsCoordNearby = this.manager.gameBoard.findCoordClearCellsNearbyAll(item.row, item.col);
			if(clearCellsCoordNearby.length == 0) { console.log('нет места'); return; }
			const cellForGift = clearCellsCoordNearby[0];

			let breed = null;
			if(gift.breed) {breed = gift.breed}
			const itemGame = this.manager.addItemToGameForBegin(gift.type, gift.level, cellForGift.row, cellForGift.col, breed);
		})

		if(item.giftsAfterClickOnItem.length == 0) {
			item.giftsAfterClickOnItem = null;
			if(!item.setFromClickOnItem.leaveOnBoard) {
				this.eventBus.emit(EVENTS.CMD_REMOVE_ITEM, item)
			}
		}
	}
}

class GiftFromItemForOneTime {
	eventBus = EventBus.getInstance();

	constructor(manager) {
		this.manager = manager;
		this.subscription();
	}

	subscription() {
		this.eventBus.on(EVENTS.CMD_GENERATE_GIFT, (item) => {
			this.generateGiftFromItemForOneTime(item);			
		}) 
	}

	generateGiftFromItemForOneTime(item) {
		if(!item.setFromItemForOneTime) { return }

		const count = item.setFromItemForOneTime.count;

		const gift = { 
			type:  item.setFromItemForOneTime.type,
			level: item.setFromItemForOneTime.level, 
			breed: item.setFromItemForOneTime.breed ? item.setFromItemForOneTime.breed : null
		}

		let time = 0;
		for(let i = 0; i < count; i++) {
			time += item.setFromItemForOneTime.time
			setTimeout(() => {
				const clearCellsCoordNearby = this.manager.gameBoard.findCoordClearCellsNearbyAll(item.row, item.col);
				if(clearCellsCoordNearby.length == 0) { console.log('нет места'); return; }
				const cellForGift = clearCellsCoordNearby[0];

				const itemGame = this.manager.addItemToGameForBegin(gift.type, gift.level, cellForGift.row, cellForGift.col, gift.breed);
			}, time)
		}
	}
}

class GiftFromClickOnItemForOneTime {
	eventBus = EventBus.getInstance();

	constructor(manager) {
		this.manager = manager;
		this.subscription();
	}

	subscription() {
		this.eventBus.on(EVENTS.CMD_GENERATE_GIFT, (item) => {
			this.generateGiftFromClickOnItemForOneTime(item);			
		}) 
		this.eventBus.on(EVENTS.CMD_CREATE_GIFT_FROM_CLICK_ON_ITEM, (item) => {
			this.createGiftOnBoardAfterClickOnItem(item)
		}) 
	}

	generateGiftFromClickOnItemForOneTime(item) {
		if(!item.setFromClickOnItemForOneTime) { return }
		item.giftsFromClickOnItemForOneTime = [];
	
		for(let i = 0; i < item.setFromClickOnItemForOneTime.count; i++) {
			const chance = Math.floor(Math.random() * item.setFromClickOnItemForOneTime.count);
			item.giftsFromClickOnItemForOneTime.push(item.setFromClickOnItemForOneTime.set[chance]);
		}
	}

	createGiftOnBoardAfterClickOnItem(item) {
		if(!item.giftsFromClickOnItemForOneTime) { return }
		const gifts = item.giftsFromClickOnItemForOneTime
		gifts.forEach((gift) => {
			const clearCellsCoordNearby = this.manager.gameBoard.findCoordClearCellsNearbyAll(item.row, item.col);
			if(clearCellsCoordNearby.length == 0) { console.log('нет места'); return; }
			const cellForGift = clearCellsCoordNearby[0];

			let breed = null;
			if(gift.breed) {breed = gift.breed}
			const itemGame = this.manager.addItemToGameForBegin(gift.type, gift.level, cellForGift.row, cellForGift.col, breed);
		})

		this.eventBus.emit(EVENTS.CMD_REMOVE_ITEM, item);
	}
}
