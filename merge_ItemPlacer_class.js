class ItemPlacer {
	gameBoard = null;
	fogOnBoard = null;

	giftOnItem = null;
	giftFromItem = null;
	renderer = new ItemRenderer();

	itemRegistry = null;

	constructor(board, fogOnBoard, registry) {
		this.gameBoard = board;
		this.fogOnBoard = fogOnBoard;
		this.itemRegistry = registry; //кажется нужен единственный экземпляр
		this.giftOnItem = new GiftOnItem(this);
		this.giftFromItem = new GiftFromItem(this);
	}

	updateItemOnBoard(grid) {
		this.itemOnBoard = [];
		for(let row = 0; row < this.gameBoard.rows; row++) {
			for(let col = 0; col < this.gameBoard.cols; col++) {
				if(grid[row][col].item) {
					const item = grid[row][col].item;
					this.renderer.createItem(item.id, item.pic);
					item.element = this.renderer.itemElementForSave;
					this.itemRegistry.addItem(item);
					this.renderer.placeItemOnBoardForBeginGame(item.element, row, col);

					if(item.gift
					&& !this.fogOnBoard.isFogOnCell(row, col)) {
						this.giftFromItem.generateGiftFromItem(item);
					}
					if(item.giftOnItem
					&& !this.fogOnBoard.isFogOnCell(row, col)) {
						this.giftOnItem.updateGiftOnItem(item);
					}
					if(item.level == 0) {
						this.giftFromItem.createTransformItem(item);
					}
				}
			}
		}
	}

	clearItemForDrag(itemId) {
		const findItem = this.itemRegistry.getCurrentItem(itemId);
		this.gameBoard.clearItemInCell(findItem.row, findItem.col);
	}

	stayBackItemOnBoard(itemId) {
		const findItem = this.itemRegistry.getCurrentItem(itemId);
		if(this.gameBoard.canAddItem(findItem.row, findItem.col)) {
			this.gameBoard.addItemInCell(findItem);
			this.renderer.showPutItemOnBoard(findItem.element, findItem.row, findItem.col);
		} else {
			const clearCellsCoordNearby = this.gameBoard.findCoordClearCellsNearbyAll(findItem.row, findItem.col);
			this.chengePlaceItemOnBoard(itemId, clearCellsCoordNearby[0].row, clearCellsCoordNearby[0].col);
		}
	}

	chengePlaceItemOnBoard(itemId, row, col) {
		const currentItem = this.itemRegistry.getCurrentItem(itemId);
		this.itemRegistry.removeItem(itemId);

		currentItem.row = Number(row);
		currentItem.col = Number(col);
		this.gameBoard.addItemInCell(currentItem);
		this.itemRegistry.addItem(currentItem);
		this.renderer.showPutItemOnBoard(currentItem.element, row, col);

		if(this.giftFromItem.itemForTransformation 
		&& currentItem.id == this.giftFromItem.itemForTransformation.id) {
			this.giftFromItem.itemForTransformation = null;
			this.giftFromItem.createTransformItem(currentItem);
		}
	}

	addItemOnBoard(type, level, row, col) {
		if(this.itemRegistry.itemOnBoard.length == this.gameBoard.rows * this.gameBoard.cols) { 
			console.log('нет места');
			return;
		}

		const itemGame = new Item(type, level, row, col);
		this.renderer.createItem(itemGame.id, itemGame.pic);
		itemGame.element = this.renderer.itemElementForSave;
		this.renderer.itemElementForSave = null;

		this.gameBoard.addItemInCell(itemGame);
		this.itemRegistry.addItem(itemGame);

		if(itemGame.gift
		&& !this.fogOnBoard.isFogOnCell(row, col)) {
			this.giftFromItem.generateGiftFromItem(itemGame);
		}
		if(itemGame.giftOnItem 
		&& !this.fogOnBoard.isFogOnCell(row, col)) {
			this.giftOnItem.generateGiftOnItem(itemGame);
		}
		return itemGame;
	}
	removeItemFromGame(item) {
		this.itemRegistry.removeItem(item.id);
		this.gameBoard.clearItemInCell(item.row, item.col);
		this.renderer.removeItem(item.element);
	}
}
