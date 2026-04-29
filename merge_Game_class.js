window.addEventListener("load", main);

function main() {
	//window.MergeGame = window.MergeGAme || {}
	//window.MergeGame.eventBus = new EventBus();
	const game = new Game();
}

class EventBus {
	static #instance = null;
	listeners = {};

	constructor() {
		if(EventBus.#instance) {
			return EventBus.#instance;
		}
		EventBus.#instance = this;
	}

	static getInstance() {
		if(!EventBus.#instance) {
			EventBus.#instance = new EventBus();
		}
		return EventBus.#instance
	}

	on(event, fn) {
		if(this.listeners[event] == null) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(fn);

		return () => {
			const index = this.listeners[event].indexOf(fn);
			if(index !== -1) {
				this.listeners[event].splice(index, 1);
			}
		}
	}
	
	of(event, fn) {
		if(!this.listeners[event] == null) { return }
		this.listeners[event] = this.listeners[event].filter(f => f !== fn)
	}
	
	emit(event, ...arg) {
		if(this.listeners[event] == null) { return }
		this.listeners[event].forEach(fn => { fn(...arg) });
	}
}

class Game {
	eventBus = EventBus.getInstance();
	gameBoard = new Board();
	fogOnBoard = new Fog(this.gameBoard.grid);

	itemPlacer = new ItemPlacer(this.gameBoard, this.fogOnBoard);
	itemRenderer = new ItemRenderer();
	itemRendererCanvas = new ItemRendererCanvas();
	giftFromItem = new GiftFromItem(this.itemPlacer);
	giftOnItem = new GiftOnItem(this.itemPlacer);

	mergeManager = new MergeManager(this.itemPlacer);
	itemHandler = new ItemHandler(this.itemPlacer, this.mergeManager);

	flyItemsManager = new FlyItemsManager(this.itemPlacer);
	flyerManager = new FlyerManager(this.gameBoard);

	dragManager = new DragManagerForGame(this.itemHandler, this.flyerManager);

	gameOptions = new GameOptions();
	saveGame = new SaveData();

	constructor() {
		this.startGame(); // это надо
		//this.saveGame.saveBeforeUnload(this.gameBoard.grid);// это надо
	}

	startGame() {
		this.flyItemsManager.startFlyItem();
		if(this.saveGame.hasSaveVersion()) {
			this.gameBoard.updateGrid(this.saveGame.grid);
			this.fogOnBoard.updateGrid(this.saveGame.grid);
			this.itemPlacer.updateItemOnBoard(this.saveGame.grid);
		} else {
			this.startNewGame();	
		}

		//const count = document.body.querySelectorAll('*').length;
		//console.log(count); 

		/*при старте рисует 8712 элементов... очень много (((( 
		теперь 6704 получше, но все же много( 
		можно убрать псевдо элемента, они все равно нужны только здесь для красоты

		перенесла поле на канвас -  стало 4254
		получше, переносим дальше

		перенесла туман стало - 2249

		частично перенесла предметы стало - 237
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
		this.eventBus.emit(EVENTS.CMD_RENDERING_FOG, this.fogOnBoard.grid);
	}

	createSetItemsUnderFogLevel(level, row, col) {
		if(this.gameBoard.grid[row][col].landscape) { return }
		let propertyItem  = {}
		let levelItem = 0;
		let type = '';
		let breed = null;
		switch(level) {
			case  1: 
			case  2:
			case  3: propertyItem = this.getPropertyItem(1)

				 levelItem = propertyItem.level;
				 type = propertyItem.type;
				 breed = propertyItem.breed;
				 break;
			case  4:
			case  5:
			case  6: propertyItem = this.getPropertyItem(2)

				 levelItem = propertyItem.level;
				 type = propertyItem.type;
				 breed = propertyItem.breed;
				 break;
			case  7:
			case  8:
			case  9: propertyItem = this.getPropertyItem(3)

				 levelItem = propertyItem.level;
				 type = propertyItem.type;
				 breed = propertyItem.breed;
				 break;
			case 10:
			case 11:
			case 12: propertyItem = this.getPropertyItem(4)

				 levelItem = propertyItem.level;
				 type = propertyItem.type;
				 breed = propertyItem.breed;
				 break;
			case 13:
			case 14:
			case 15: propertyItem = this.getPropertyItem(5)

				 levelItem = propertyItem.level;
				 type = propertyItem.type;
				 breed = propertyItem.breed;
				 break;
		}
		const itemGame = this.itemPlacer.addItemToGameForBegin(type, levelItem, row, col, breed);
	}

	getPropertyItem(value) {
		const setPropertyItem = SET_ITEM_FOR_START_GAME[value]
		let propertyItem = {};
		const chance = Math.random();

		let chanceSet = 0
		for(let i = 0; i < setPropertyItem.length; i++) {
			const set = setPropertyItem[i];
			chanceSet += set.chance;

			if(chanceSet >= chance) {
				propertyItem.type = set.type;
				propertyItem.level = this.getRandomInt(set.levelMin, set.levelMax);
				propertyItem.breed = null;
				if(set.breed) {
					propertyItem.breed = set.breed[this.getRandomInt(0, set.breed.length-1)];
				}
				return propertyItem
			}
		}

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
		this.generateItemOnBoard(countItem, level, type, minX, maxX, minY, maxY);

		this.generateItemOnBoard(3, 0, 'eggs', minX, maxX, minY, maxY, 'blackDragon');

//this.generateItemOnBoard(1, 1, 'watermill', minX, maxX, minY, maxY);
//this.generateItemOnBoard(1, 2, 'watermill', minX, maxX, minY, maxY);
//this.generateItemOnBoard(1, 4, 'trees', minX, maxX, minY, maxY);
//this.generateItemOnBoard(1, 6, 'trees', minX, maxX, minY, maxY);
//this.generateItemOnBoard(1, 8, 'trees', minX, maxX, minY, maxY);
//this.generateItemOnBoard(1, 10, 'trees', minX, maxX, minY, maxY);
//this.generateItemOnBoard(2, 6, 'fossil', minX, maxX, minY, maxY);
//this.generateItemOnBoard(10, 10, 'sphere', minX, maxX, minY, maxY);	
//this.generateItemOnBoard(3, 6, 'gold', minX, maxX, minY, maxY);		
//this.generateItemOnBoard(3, 6, 'hills', minX, maxX, minY, maxY);
	}

	generateItemOnBoard(countItem, level, type, minX, maxX, minY, maxY, breed) {
		for(let i = 0; i < countItem; i++) {
			let place = false;

			while(!place) {
				let row = this.getRandomInt(minY, maxY);
				let col = this.getRandomInt(minX, maxX);

				if(this.gameBoard.canAddItem(row, col)) {
					const itemGame = this.itemPlacer.addItemToGameForBegin(type, level, row, col, breed);
					place = true;	
				} 
			}
		}
	}
}

