class FlyItemsManager {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGTH;

	manager = null;
	intervalCreateFlyItems = null;
	eventBus = EventBus.getInstance();

	constructor(itemPlacer) {
		this.itemPlacer = itemPlacer;
		this.addListenersWindow();
	}

	startFlyItem() {
		const time = GAME_CONFIG.GENERATE_RULES.TIME_SET_FLY_ITEMS_GENERATION; 

		this.intervalCreateFlyItems = setInterval(() => {
			const type = Math.random() > GAME_CONFIG.GENERATE_RULES.RANDOM_TYPE_CHANCE ? 'flowers' : 'water';  //items[0].type : items[1].type; 
			this.generateFlyItem(type);
		}, time) 
	}

	addListenersWindow() {
		document.addEventListener('visibilitychange', () => {
			if(document.visibilityState === 'hidden') {
				clearInterval(this.intervalCreateFlyItems);
			} else {
				this.startFlyItem();
			}
		})
	}

	generateFlyItem(type) {
		const countFlyItems = this.getCountFlyItems(type)
		const time = GAME_CONFIG.GENERATE_RULES.TIME_FLY_ITEM_GENERATION;

		const heightCellBoard = this.boardHeight/this.rows;
		const heightBoard = this.boardHeight - heightCellBoard;
		const diapasonHeightItem = heightCellBoard / 2;
		const heightItems = Math.floor(Math.random() * heightBoard) + heightCellBoard / 2;

		for(let i = 0; i < countFlyItems; i++) {
			setTimeout(() => {
				const height = heightItems + Math.floor(Math.random() * diapasonHeightItem);
				const flyItem = new FlyItem(this, type, height);
			}, i * time);
		}
	}

	getCountFlyItems(type) {
		switch (type) {
			case 'flowers': return items.flyItem.flowers.count;
			case 'water':   return items.flyItem.water.count;
		}
	}

	findClearCellForFlyItem(row, col) {
		const clearCellsCoordNearby = this.itemPlacer.gameBoard.findCoordClearCellsNearbyAll(Number(row), Number(col))
		if(clearCellsCoordNearby.length == 0) { console.log('нет места'); return []; }
		this.itemPlacer.gameBoard.addItemInCell({row: clearCellsCoordNearby[0].row, col: clearCellsCoordNearby[0].col})
		return clearCellsCoordNearby[0];
	}
	
	createGiftFromFlyItem(type, level, row, col) {
		this.itemPlacer.gameBoard.clearItemInCell(row, col)
		this.eventBus.emit(EVENTS.CMD_CREATE_GIFT, type, level, {row: row, col: col});
		//this.manager.giftFromItem.createGift(type, level, {row: row, col: col});
	}

}