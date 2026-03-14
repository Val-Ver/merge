class ItemManager {
	//itemOnBoard = [];
	itemRegistry = new ItemRegistry();

	gameBoard = null;
	fogOnBoard = null;
	//renderer = new ItemRenderer();
	giftOnItem = null;
	giftFromItem = null;

	itemPlacer = null;
itemHandler = null;

	//dragManager = null;
	//mergeManager = null;
	//resources = null;
	//infoPanel = null;

	constructor(board, fogOnBoard) {

		this.itemPlacer = new ItemPlacer(board, fogOnBoard, this.itemRegistry);

		//this.gameBoard = board;
		//this.fogOnBoard = fogOnBoard;
		//this.giftOnItem = new GiftOnItem(this);
		//this.giftFromItem = new GiftFromItem(this);

		//this.dragManager = new DragManagerForGame(this);
		this.mergeManager = new MergeManager(this);

		this.itemHandler = new ItemHandler(this.itemPlacer, this.mergeManager);
	}


	
	getInfoAboutItemForSale(itemId) { // ItemRegistry // не нашла где используется
console.error('сработал getInfoAboutItemForSale')
		const item = this.itemRegistry.getCurrentItem(itemId);
		return { type: item.type, level: item.level }
	}



	updateItemOnBoard(grid) {
		this.itemPlacer.updateItemOnBoard(grid)
	}


	addOptions(gameOptions) {
		this.itemHandler.addOptions(gameOptions)
	}






}





	/*addOptions(gameOptions) { // вопрос думаю  в ItemHandler
		this.resources = gameOptions.resources;
		this.infoPanel = gameOptions.infoPanel;
	}*/


	/*handleCell(itemId, row, col) { //ItemHandler
		if(this.itemPlacer.gameBoard.canAddItem(row, col)) {
			this.itemPlacer.chengePlaceItemOnBoard(itemId, row, col);
			return;
		}  

		this.itemPlacer.stayBackItemOnBoard(itemId);
		return;
	}

	handleAfterDragItem(currentItemId, findItemId) { //ItemHandler
		if(this.mergeManager.canMargeItem(currentItemId, findItemId)) {
			this.mergeManager.createNewLevelItem();
			return;	
		} 
		this.itemPlacer.stayBackItemOnBoard(currentItemId);
		return;
	}


	openPoverSphere(sphere) { // вопрос думаю  в ItemHandler
		if(!this.itemPlacer.fogOnBoard.isFogOnBoard()) {
			this.infoPanel.showInfoPanel(sphere)
		} else {
			this.itemPlacer.removeItemFromGame(sphere);
			this.itemPlacer.fogOnBoard.clearFogBeforeOpenPoverSphere(sphere, this.giftFromItem, this.giftOnItem);
		}
	}

	handleItem(id) { // ItemHandler
		const item = this.itemRegistry.getCurrentItem(id);
		
		if(item.countHasGiftOnItem && item.countHasGiftOnItem != 0) {
			this.itemPlacer.giftOnItem.createGiftOnBoardBeforeClick(item);
			return
		}

		if(item.pover) {
			this.openPoverSphere(item);
			return
		}

		if(item.type == 'gold') {
			const summ = item.level * 100;
			this.resources.increaseGold(summ);
			this.itemRegistry.removeItem(id);
			this.itemPlacer.gameBoard.clearItemInCell(item.row, item.col);
			this.itemPlacer.renderer.removeItem(item.element);
		}
	}

	handleOnShop(type, level) { // ItemHandler
		const row = 3;
		const col = 10;
		const clearCellsCoordNearby = this.itemPlacer.gameBoard.findCoordClearCellsNearbyAll(row, col);
		const item = this.itemPlacer.addItemOnBoard(type, level, clearCellsCoordNearby[0].row, clearCellsCoordNearby[0].col);
		this.itemPlacer.renderer.placeItemOnBoardForBeginGame(item.element, clearCellsCoordNearby[0].row, clearCellsCoordNearby[0].col);
	}*/




	/*addHighlightingItems(arrItems) { // вопрос
		arrItems.forEach(item => {
			this.itemPlacer.renderer.addHighlightingItems(item.id);
		})
	}

	removeHighlightingItems(arrItems) { // вопрос
		arrItems.forEach(item => {
			this.itemPlacer.renderer.removeHighlightingItems(item.id);
		})
	}*/








	/*addItem(item) { // ItemRegistry
//console.error('a')
		this.itemOnBoard.push(item);
	}

	removeItem(itemId) { // ItemRegistry
//console.error('a')
		this.itemOnBoard = this.itemOnBoard.filter(itemOnBoard  => itemOnBoard.id != itemId);
	}

	getCurrentItem(itemId) { // ItemRegistry
//console.error('a')
		const findItem = this.itemOnBoard.filter(itemOnBoard  => itemOnBoard.id == itemId);
		return findItem[0];
	}*/





	/*updateItemOnBoard(grid) { // ItemPlacer
		this.itemOnBoard = [];
		for(let row = 0; row < this.gameBoard.rows; row++) {
			for(let col = 0; col < this.gameBoard.cols; col++) {
				if(grid[row][col].item) {
					const item = grid[row][col].item;
					this.itemOnBoard.push(item);
					this.renderer.createItem(item.id, item.pic);
					item.element = this.renderer.itemElementForSave;
					this.renderer.placeItemOnBoardForBeginGame(item.element, row, col);

					if(item.gift
					&& !this.fogOnBoard.isFogOnCell(row, col)) {
						this.giftFromItem.generateGiftFromItem(item);
					}
					if(item.giftOnItem
					&& !this.fogOnBoard.isFogOnCell(row, col)) {
						this.giftOnItem.updateGiftOnItem(item);
					}
				}
			}
		}
	}

	clearItemForDrag(itemId) { // ItemPlacer
console.error('a')
		const findItem = this.itemRegistry.getCurrentItem(itemId);
		this.gameBoard.clearItemInCell(findItem.row, findItem.col);
	}

	stayBackItemOnBoard(itemId) { // ItemPlacer
console.error('a')
		const findItem = this.itemRegistry.getCurrentItem(itemId);
		if(this.gameBoard.canAddItem(findItem.row, findItem.col)) {
			this.gameBoard.addItemInCell(findItem);
			this.renderer.showPutItemOnBoard(findItem.element, findItem.row, findItem.col);
		} else {
			const clearCellsCoordNearby = this.gameBoard.findCoordClearCellsNearbyAll(findItem.row, findItem.col);
			this.chengePlaceItemOnBoard(itemId, clearCellsCoordNearby[0].row, clearCellsCoordNearby[0].col);
		}
	}

	chengePlaceItemOnBoard(itemId, row, col) { // ItemPlacer
console.error('a')
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

	addItemOnBoard(type, level, row, col) { // ItemPlacer
console.error('a')
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
		&& !this.itemPlacer.fogOnBoard.isFogOnCell(row, col)) {
			this.giftFromItem.generateGiftFromItem(itemGame);
		}
		if(itemGame.giftOnItem 
		&& !this.fogOnBoard.isFogOnCell(row, col)) {
			this.giftOnItem.generateGiftOnItem(itemGame);
		}
		return itemGame;
	}

	removeItemFromGame(item) { // ItemPlacer
console.error('a')
		this.itemRegistry.removeItem(item.id);
		this.gameBoard.clearItemInCell(item.row, item.col);
		this.renderer.removeItem(item.element);
	}*/

