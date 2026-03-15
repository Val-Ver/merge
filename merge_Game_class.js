window.addEventListener("load", main);

function main() {
	const game = new Game();
}

class Game {
	gameBoard = new Board();
	fogOnBoard = new Fog(this.gameBoard.grid);
	itemManager = new ItemManager(this.gameBoard, this.fogOnBoard);
	flyItemsManager = new FlyItemsManager(this.itemManager);
	
	gameOptions = null;
	saveGame = new SaveData();

	constructor() {
		this.gameOptions = new GameOptions(this);
		this.startGame(); // это надо
		//this.saveGame.saveBeforeUnload(this.gameBoard.grid);// это надо
	}

	startGame() {
		this.flyItemsManager.startFlyItem();
		if(this.saveGame.hasSaveVersion()) {
			this.gameBoard.updateGrid(this.saveGame.grid);
			this.fogOnBoard.updateGrid(this.saveGame.grid);
			this.itemManager.updateItemOnBoard(this.saveGame.grid);
		} else {
			this.startNewGame()		
		}
		// 	const count = document.body.querySelectorAll('*').length;
		// 	console.log(count);

		/*при старте рисует 8712 элементов... очень много (((( 
		теперь 6704 получше, но все же много( 
		можно убрать псевдо элемента, они все равно нужны только здесь для красоты
		псевдо элементы ни на что не влияют
		*/
	}

	startNewGame() {
		for(let i in FOG_ON_BOARD) {
			const fog = FOG_ON_BOARD[i];
			if(fog.layer == 0) {
				this.firstSetItemsOnClearBoard(fog.col, fog.col + fog.width-1, fog.row, fog.row + fog.height-1);
				break;
			}
			for(let row = fog.row; row < fog.row + fog.height; row++) {
				for(let col = fog.col; col < fog.col + fog.width; col++) {
					this.fogOnBoard.addFog(fog.layer, row, col);
					this.createSetItemsUnderFogLevel(fog.layer, row, col);
				}
			}
		}
	}

	createSetItemsUnderFogLevel(level, row, col) {
		if(this.gameBoard.grid[row][col].landscape) { return }
		let levelItem = 0;
		let type = '';
		switch(level) {
			case  1: 
			case  2:
			case  3: levelItem = this.getRandomInt(1, 3);
				 type = Math.random() > GAME_CONFIG.GENERATE_RULES.RANDOM_TYPE_CHANCE ? 'flowers' : 'trees';
				 break;
			case  4:
			case  5:
			case  6:
			case  7: levelItem = this.getRandomInt(3, 5);
				 type = Math.random() > GAME_CONFIG.GENERATE_RULES.RANDOM_TYPE_CHANCE ? 'flowers' : 'trees';
				 break;
			case  8:
			case  9:
			case 10:
			case 11: type = this.getTypeItem();
				 if(type == 'flowers' || type == 'trees') {
				 	levelItem = this.getRandomInt(5, 7);
				 } else {
					levelItem = this.getRandomInt(1, 3)
				 }
				 break;
			case 12:
			case 13:
			case 14:
			case 15: type = this.getTypeItem();
				 if(type == 'flowers' || type == 'trees') {
					levelItem = this.getRandomInt(7, 9); 
				 } else {
					levelItem = this.getRandomInt(3, 5);
				 }
				 break;
		}

		const itemGame = this.itemManager.itemPlacer.addItemOnBoard(type, levelItem, row, col);
		this.itemManager.itemPlacer.renderer.placeItemOnBoardForBeginGame(itemGame.element, row, col);
	}

	getTypeItem() {
		let chance = Math.random();
		if(chance <= 0.2) { return 'water' }
		if(chance > 0.2 && chance <= 0.6) { return 'flowers' }
		if(chance > 0.6 && chance <= 0.8) { return 'trees' }
		if(chance > 0.8) { return 'mushrooms' }
	}

	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	firstSetItemsOnClearBoard(minX, maxX, minY, maxY) {
		const countItem = GAME_CONFIG.GENERATE_RULES.COUNT_ITEMS_INITIAL;
		const level = GAME_CONFIG.GENERATE_RULES.LEVEL_ITEMS_INITIAL;
		const type = 'flowers';

		for(let i = 0; i < countItem; i++) {
			let place = false;

			while(!place) {
				let row = this.getRandomInt(minY, maxY);
				let col = this.getRandomInt(minX, maxX);

				if(this.gameBoard.canAddItem(row, col)) {
					const itemGame = this.itemManager.itemPlacer.addItemOnBoard(type, level, row, col);
					this.itemManager.itemPlacer.renderer.placeItemOnBoardForBeginGame(itemGame.element, row, col);
					place = true;	
				} 
			}
		}
	}
}


