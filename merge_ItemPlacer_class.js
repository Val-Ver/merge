class ItemPlacer {
	gameBoard = null;
	fogOnBoard = null;

	giftOnItem = null;
	giftFromItem = null;

	itemRegistry = new ItemRegistry();
	eventBus = EventBus.getInstance();

	constructor(board, fogOnBoard) {
		this.gameBoard = board;
		this.fogOnBoard = fogOnBoard;
		this.subscription();
	}

	subscription() {
		this.eventBus.on(EVENTS.CMD_ADD_ITEM_FROM_FLAYER, (item) => {
			this.addItemToGame(item);
		})
		this.eventBus.on(EVENTS.CMD_REMOVE_ITEM, (item) => {
			this.removeItemFromGame(item);
		})
	}

	updateItemOnBoard(grid) {
		this.itemRegistry.itemOnBoard = [];
		for(let row = 0; row < this.gameBoard.rows; row++) {
			for(let col = 0; col < this.gameBoard.cols; col++) {
				if(grid[row][col].item) {
					const item = grid[row][col].item;
					//this.gameBoard.addItemInCell(item);
					this.itemRegistry.addItem(item);

					//this.eventBus.emit(EVENTS.EVENT_ADD_ITEM_ON_BOARD, item);

					if(!this.fogOnBoard.isFogOnCell(row, col)) {
						this.eventBus.emit(EVENTS.CMD_UPDATE_GIFT, item);
					}
				}
			}
		}
		this.eventBus.emit(EVENTS.CMD_RENDERING_PLACE_ITEM_ON_BOARD, grid);
	}

	getCurrentItem(itemId) {
		return this.itemRegistry.getCurrentItem(itemId);
	}

	getGameBoard() {
		return this.gameBoard.grid;
	}

	getCoordBoard(element, clientX, clientY) {
		const rect = element.getBoundingClientRect();
		const scaleX = element.width / rect.width;
		const scaleY = element.height / rect.height; // важно если есть масштаб
		const canvasX = (clientX - rect.left) * scaleX;
		const canvasY = (clientY - rect.top) * scaleY;

		const col = Math.floor(canvasX / this.gameBoard.cell);
		const row = Math.floor(canvasY / GAME_CONFIG.BOARD_SIZE.CELL);
		
		return { row: row, col: col }
	}

	clearItemForDrag(itemId) {
		const findItem = this.itemRegistry.getCurrentItem(itemId);
		this.gameBoard.clearItemInCell(findItem.row, findItem.col);
	}

	stayBackItemAfterClick(itemId) {
		const findItem = this.itemRegistry.getCurrentItem(itemId);
		this.gameBoard.addItemInCell(findItem);
	}

	stayBackItemOnBoard(itemId) {
		const findItem = this.itemRegistry.getCurrentItem(itemId);
		if(this.gameBoard.canAddItem(findItem.row, findItem.col)) {
			this.gameBoard.addItemInCell(findItem);
			this.eventBus.emit(EVENTS.CMD_RENDERING_SHOW_ITEM_ON_BOARD, findItem, findItem.row, findItem.col, this.gameBoard.grid);
		} else {
			const clearCellsCoordNearby = this.gameBoard.findCoordClearCellsNearbyAll(findItem.row, findItem.col);
			this.chengePlaceItemOnBoard(itemId, clearCellsCoordNearby[0].row, clearCellsCoordNearby[0].col);
		}
	}

	chengePlaceItemOnBoard(itemId, row, col) {
		const currentItem = this.itemRegistry.getCurrentItem(itemId);

		currentItem.row = Number(row);
		currentItem.col = Number(col);
		this.gameBoard.addItemInCell(currentItem);

		this.eventBus.emit(EVENTS.CMD_RENDERING_SHOW_ITEM_ON_BOARD, currentItem, row, col, this.gameBoard.grid);
		this.eventBus.emit(EVENTS.CMD_CREATE_TRANSFORM_ITEM, currentItem)
	}

	addItemToGame(item) {
		this.addItemOnBoard(item);
		this.eventBus.emit(EVENTS.CMD_RENDERING_ITEM, item);
	}

	addItemOnBoard(itemGame) { 
		if(this.itemRegistry.itemOnBoard.length == this.gameBoard.rows * this.gameBoard.cols) { 
			console.log('нет места'); //неверная проверка
			return;
		}
		
		this.gameBoard.addItemInCell(itemGame);
		this.itemRegistry.addItem(itemGame);

		if(!this.fogOnBoard.isFogOnCell(itemGame.row, itemGame.col)) {
			this.eventBus.emit(EVENTS.CMD_GENERATE_GIFT, itemGame);
		}
	}

	addItemToGameForBegin(type, level, row, col, breed) {//надо бы переименовать createItemToGameForBegin
		const itemGame = new Item(type, level, row, col, breed);
		this.addItemOnBoard(itemGame);
		this.eventBus.emit(EVENTS.CMD_RENDERING_ITEM, itemGame);
		
		return itemGame
	}

	createItemForPlaceAfterMerge(type, level, numberItems = 1, centerMerge, breed = null) {
		const clearCellsCoordNearby = this.gameBoard.findCoordClearCellsNearbyAll(centerMerge.row, centerMerge.col, numberItems);

		for(let i = 0; i < numberItems; i++) {
			let row = clearCellsCoordNearby[i].row;
			let col = clearCellsCoordNearby[i].col;

			if(this.gameBoard.canAddItem(row, col)) {
				const itemGame = new Item(type, level, row, col, breed);
				this.addItemOnBoard(itemGame);
				this.eventBus.emit(EVENTS.CMD_RENDERING_SHOW_ITEM_ON_BOARD_AFTER_MERGE, itemGame, centerMerge.row, centerMerge.col, row, col);
			}
		}
	}

	removeItemForMutable(itemsForMerge, centerMerge) { //async можно поставить перед методом, здесь работает и так, а вообще надо
		itemsForMerge.forEach(item => {
			this.gameBoard.clearItemInCell(item.row, item.col);
			this.itemRegistry.removeItem(item.id);

			this.eventBus.emit(EVENTS.CMD_CLEAR_ALL_fOG_IN_CELL, item.row, item.col);
			this.eventBus.emit(EVENTS.CMD_CLEAR_INTERVAL_CREATE_GIFT, item)
		})
 		const promises = itemsForMerge 
			.map((item) => {
				return new Promise((resolve) => {
					this.eventBus.emit(EVENTS.CMD_RENDERING_SHOW_BEFORE_REMOVE_ITEM, centerMerge, item, resolve);
				})
			})
		return Promise.all(promises);
	}

	removeItemFromGame(item) {
		this.itemRegistry.removeItem(item.id);
		this.gameBoard.clearItemInCell(item.row, item.col);

		this.eventBus.emit(EVENTS.CMD_RENDERING_REMOVE_ITEM, item);
	}

	findCenterCell() {
		return this.gameBoard.findCenterCell()
	}

}
