const flyers = {
	blackDragon: { type: 'blackDragon', maxLevel: 4, set: {
			1: { pic: ')black1(' },
			2: { pic: ')black2(' },
			3: { pic: ')black3(' },
			4: { pic: ')black4(' },
			}	
	},

	redDragon: { type: 'redDragon', maxLevel: 4, set: {
			1: { pic: ')red1(' },
			2: { pic: ')red2(' },
			3: { pic: ')red3(' },
			4: { pic: ')red4(' },
			}	
	}
}

class FlyerRenderer {
	cell = GAME_CONFIG.BOARD_SIZE.CELL;
	eventBus = EventBus.getInstance();

	constructor() {
		this.eventBus.on(EVENTS.CMD_RENDERING_CREATE_FLYER, (flyerGame, row, col) => {
			this.createFlyer(flyerGame, row, col);
		})
		this.eventBus.on(EVENTS.CMD_RENDERING_REMOVE_FLYER, (element) => {
			this.removeFlyer(element);
		})
		this.eventBus.on(EVENTS.CMD_RENDERING_UPDATE_COORD_FLYER, (element, x, y) => {
			this.updateCoordFlyer(element, x, y);
		})
		this.eventBus.on(EVENTS.CMD_RENDERING_GET_COORD_FLYER, (flyerGame) => {
			this.coordFlyer(flyerGame);
		})
		this.eventBus.on(EVENTS.CMD_RENDERING_COLLECT_GIFT_FROM_ITEM, (element, giftOnFlyer) => {
			this.collectGiftFromItem(element, giftOnFlyer);
		})

		this.eventBus.on(EVENTS.CMD_RENDERING_PUT_GIFT_FROM_FLYER, (element, rowStart, colStart, rowEnd, colEnd, resolve) => {
			return this.removeFlyItem(element, rowStart, colStart, rowEnd, colEnd, resolve);
		})
	}

	createFlyer(flyerGame,row, col) {
		const containerFlyer = document.querySelector('.flyer-container');
		const flyer = document.createElement('div');
		flyer.className = 'flyer';
		flyer.id = `dragon-${flyerGame.id}`;
		flyer.dataset.name = 'flyer';
		flyer.dataset.id = `${flyerGame.id}`;
		flyer.textContent = `${flyerGame.pic}`;
		flyer.style.color = 'white';
		flyer.style.width = `${this.cell}px`;
		const heightDragon = 20;
		flyer.style.left = `${this.cell * col}px`;
		flyer.style.top = `${this.cell * row}px`;
		containerFlyer.appendChild(flyer);

		flyerGame.element = flyer;
		this.coordFlyer(flyerGame);
	}
	
	coordFlyer(flyerGame) {
		const element = flyerGame.element;
		flyerGame.route =  { x: Number(element.style.left.split('px')[0]), 
				     y: Number(element.style.top.split('px')[0])  }
	}

	updateCoordFlyer(element, x, y) {
		element.style.left = `${x}px`;
		element.style.top = `${y}px`;
	}

	collectGiftFromItem(element, giftOnFlyer) {
		const item = document.createElement('div');
		item.className = 'gift-on-flyer';
		item.id = `item-${giftOnFlyer.id}`;
		item.dataset.name = 'gift-on-flyer';
		item.dataset.id = `${giftOnFlyer.id}`;
		item.textContent = `${giftOnFlyer.pic}`;
		const size = GAME_CONFIG.UI.SIZE_GIFT_ON_ITEM_OF_FLYER;
		item.style.width = `${this.cell * size}px`;
		item.style.position = 'absolute';
		element.appendChild(item);

		giftOnFlyer.element = item;
	}

	removeFlyer(element) {
		element.remove();
	}	

	removeFlyItem(element, rowStart, colStart, rowEnd, colEnd, resolve) {
		const time = GAME_CONFIG.ANIMATIONS.TIME_PUT_ITEM_FROM_DRAGON;

		element.style.position = 'absolute';
		element.style.left = `${this.cell * colStart + this.cell / 2}px`;
		element.style.top  = `${this.cell * rowStart + this.cell / 2}px`;

		document.querySelector('.item-container').appendChild(element);
		void element.offsetWidth //это ВАЖНО, без этого не работает

		const startLeft = this.cell * colStart			
		const startTop = this.cell * rowStart

		const endLeft = this.cell * colEnd			
		const endTop = this.cell * rowEnd

		if(startLeft == endLeft 
		&& startTop == endTop) {
			element.remove();
			return resolve();
		}
	
		element.style.transition = `left ${time}s ease-in-out, top ${time}s ease-in-out`
		element.style.left = `${this.cell * colEnd + this.cell / 2}px`;
		element.style.top  = `${this.cell * rowEnd + this.cell / 2}px`;
		element.style.zIndex = '100';

		element.addEventListener('transitionend', (event) => {
			element.remove();
			return resolve();
		})
	}
}

class FlyerManager {
	renderer = new FlyerRenderer();
	
	cell = GAME_CONFIG.BOARD_SIZE.CELL;

	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGTH;
	
	flyers = [];
	eventBus = EventBus.getInstance();
	
	constructor(board) {
		this.gameBoard = board;
		this.subscription();
	}

	subscription() {
		this.eventBus.on(EVENTS.CMD_CREATE_FLYER, (type, count, row, col) => {
			for(let i = 0; i < count; i++) {
				this.createFlyer(type, row, col);
			}
		})

		this.eventBus.on(EVENTS.CMD_CHANGE_DIRECTION_FLYER, (item) => {
			this.directFlyerToItem(item);
		})
	}

	createFlyer(typeFlyer, row, col, level = 1) {
		const flyer = new Flyer(this, typeFlyer, level);
		this.flyers.push(flyer);

		this.eventBus.emit(EVENTS.CMD_RENDERING_CREATE_FLYER, flyer, row, col);
		flyer.startPatrol();
	}
	
	deleteFlyer(currentFlyer) {
		this.flyers = this.flyers.filter((flyer) => flyer.id != currentFlyer.id);
		currentFlyer.stopPatrol();
		this.eventBus.emit(EVENTS.CMD_RENDERING_REMOVE_FLYER, currentFlyer.element);
	}

	findClearCellForGiftItem(row, col) { 
		const clearCellsCoordNearby = this.gameBoard.findCoordClearCellsNearbyAll(Number(row), Number(col));
		if(clearCellsCoordNearby.length == 0) { console.log('нет места'); return null; }
		
		return clearCellsCoordNearby[0];
	}

	getRandomCoord(coord) {
		let place = false;
		let newCoord = {};

		while(!place) {
			let coordX = Math.floor(coord.x + this.getRandomInt(-this.cols+1, this.cols-1) * this.cell);
			let coordY = Math.floor(coord.y + this.getRandomInt(-this.rows+1, this.rows-1) * this.cell);

			let coordXnew = Math.max(0, Math.min(coordX, this.boardWidth  - this.cell));
			let coordYnew = Math.max(0, Math.min(coordY, this.boardHeight - this.cell));

			const cordBoard = this.getCordBoard({ x: coordXnew, y: coordYnew });
			let col = cordBoard.col;
			let row = cordBoard.row;

			if(this.gameBoard.grid[row][col].fog.layer == 0
			&& !this.gameBoard.grid[row][col].landscape) {
				newCoord.x = Math.floor(coordXnew)
				newCoord.y = Math.floor(coordYnew)
				place = true;
			}
		}
		return newCoord
	}
	
	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	getCordBoard(coord) {
		return { col: Math.floor((coord.x) / this.cell),
			 row: Math.floor((coord.y) / this.cell) }
	}

	findItemOnBoard(row, col) {
		return this.gameBoard.grid[row][col].item;
	}

	collectGiftFromItem(flyer, item) {
		const gift = item.giftCollect
		if(!gift) { return }

		const giftOnFlyer = new Item(gift.type, gift.level);
		flyer.mission = true;

		const time = GAME_CONFIG.UI.TIME_COLLECT_GIFT_FROM_ITEM; // 2 * 1000;
		setTimeout(() => {
			this.eventBus.emit(EVENTS.CMD_RENDERING_COLLECT_GIFT_FROM_ITEM, flyer.element, giftOnFlyer);

			flyer.collectGift = giftOnFlyer;
			flyer.mission = false;

			flyer.speed = GAME_CONFIG.ANIMATIONS.SPEED_FLYER; //30;
			flyer.startPatrol();

			if(item && item.fullCollect) {
				this.eventBus.emit(EVENTS.CMD_REMOVE_ITEM, item);
			}
		}, time)
	}

	putItemOnBoard(flyer) {
		const cordBoard = this.getCordBoard(flyer.route) 
		const place = this.findClearCellForGiftItem(cordBoard.row, cordBoard.col);
		if(!place) { return }

		this.gameBoard.addItemInCell({ row: place.row, col: place.col });
		const gift = flyer.collectGift;
		flyer.collectGift = null;

		new Promise((resolve, reject) => {
			this.eventBus.emit(EVENTS.CMD_RENDERING_PUT_GIFT_FROM_FLYER, gift.element, cordBoard.row, cordBoard.col, place.row, place.col, resolve);
		}).then(() => {
			gift.row = place.row;
			gift.col = place.col;
				
			this.eventBus.emit(EVENTS.CMD_ADD_ITEM_FROM_FLAYER, gift) 
		})
	}

	directFlyerToItem(item) {
		if(this.flyers.length == 0) { return }

		const currentFlyer = this.flyers.find((flyer) => { return flyer.mission == false})
		if(!currentFlyer) { console.log('все драконы заняты'); return }

		currentFlyer.direction = { x: item.col * this.cell, y: item.row * this.cell };
		currentFlyer.mission = true;
		currentFlyer.speed = GAME_CONFIG.ANIMATIONS.SPEED_FLYER_FOR_DIRECTION; //100;

		if(currentFlyer.collectGift) {
			this.putItemOnBoard(currentFlyer);
		}
	}

	getCurrentFlyer(id) {
		const currentFlyer = this.flyers.find((flyer) => { return flyer.id == id })
		return currentFlyer;
	}
	
	collectItemAfterDraging(flyer) {
		const x = flyer.route.x + this.cell / 2;
		const y = flyer.route.y + this.cell / 2;
		const cordBoard = this.getCordBoard({ x: x, y: y });

		const item = this.findItemOnBoard(cordBoard.row, cordBoard.col)
		if(item) {
			flyer.stopPatrol();
			this.collectGiftFromItem(flyer, item);
			
		} else {
			this.startPatrulFlyerAfterDraging(flyer)
		}
	}

	startPatrulFlyerAfterDraging(flyer) {
		flyer.isPatrolling = false;
		setTimeout(() => {
			flyer.isPatrolling = true;
		}, 2000)
	}

	mergeFlyers(arr) {
		const flyerForMerge = arr.map((element) => {
			return this.getCurrentFlyer(element.dataset.id);
		}) 

		const type = flyerForMerge[0].type;
		const level = flyerForMerge[0].level;

		const isCanMerge = flyerForMerge.every((flyer) => 
			flyer.type  == type &&
			flyer.level == level
		)

		if(!isCanMerge) { return }

		const coordCenter = this.getCordBoard(flyerForMerge[0].route);

		flyerForMerge.forEach((flyer) => {
			if(flyer.collectGift) { this.putItemOnBoard(flyer) }
			this.deleteFlyer(flyer);
		})	
		
		this.createFlyer(type, coordCenter.row, coordCenter.col, level + 1);
	}

	createNewFlyerAfterMerge(type, level, count, row, col) {
		for(let i = 0; i < count; i++) {
			this.createFlyer(type, row, col, level);
		}
	}
}


class FlyerGallery {
	
	constructor() {

	}
		/*let numberNewDragons = 0;
		let numberFlyersKeepOriginal = 0; //больше 3х ни разу не получилось объединить

		if(flyerForMerge.length >= GAME_CONFIG.MERGE_RULES.MIN_FOR_BONUS) {
			numberNewFlyers = Math.trunc(flyerForMerge.length / GAME_CONFIG.MERGE_RULES.MIN_FOR_BONUS) * GAME_CONFIG.MERGE_RULES.BONUS_MULTIPLIER;
			numberDFlyersKeepOriginal = Math.trunc(flyerForMerge.length % GAME_CONFIG.MERGE_RULES.MIN_FOR_BONUS);
		} else {
			numberNewFlyers = Math.trunc(flayerForMerge.length / GAME_CONFIG.MERGE_RULES.MIN_FOR_MERGE);
			numberFlyersKeepOriginal = Math.trunc(flyerForMerge.length % GAME_CONFIG.MERGE_RULES.MIN_FOR_MERGE);
		}

		if(numberFlyersKeepOriginal >= GAME_CONFIG.MERGE_RULES.MIN_FOR_MERGE) {
			numberNewFlyers += Math.trunc(numberItemsKeepOriginal / GAME_CONFIG.MERGE_RULES.MIN_FOR_MERGE); 
			numberFlyersKeepOriginal -= numberNewItems;
		}

		this.createNewFlyerAfterMerge(type, level + 1, numberNewFlyers, coordCenter.row, coordCenter.col);*/
}
