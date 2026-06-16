const flyers = {
	allFlyers: {
		1: { timeCollect: 6 * 1000, chanceToItem: 0.2 },
		2: { timeCollect: 4 * 1000, chanceToItem: 0.4 },
		3: { timeCollect: 2 * 1000, chanceToItem: 0.6 },
		4: { timeCollect: 1 * 1000, chanceToItem: 0.8 },
	},
	blackDragon: { type: 'blackDragon', maxLevel: 4, set: {
			1: { pic: ')black1(' },
			2: { pic: ')black2(' },
			3: { pic: ')black3(' },
			4: { pic: ')black4(' },
			},
	},

	redDragon: { type: 'redDragon', maxLevel: 4, set: {
			1: { pic: ')red1(' },
			2: { pic: ')red2(' },
			3: { pic: ')red3(' },
			4: { pic: ')red4(' },
			},
	},
	hillsDragon: { type: 'hillsDragon', maxLevel: 4, set: {
			1: { pic: ')hill1(' },
			2: { pic: ')hill2(' },
			3: { pic: ')hill3(' },
			4: { pic: ')hill4(' },
			},
	},
}

class FlyerManager {
	flyersAnimation = new FlyersAnimation();
	flyerGalleryManager = null;

	cell = GAME_CONFIG.BOARD_SIZE.CELL;

	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGHT;
	
	flyers = [];
	eventBus = EventBus.getInstance();
	
	constructor(board) {
		this.gameBoard = board;
		this.flyerGalleryManager = new FlyerGalleryManager(this)
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
		const x = col * this.cell;
		const y = row * this.cell;
		flyer.isPatrolling = true;

		this.eventBus.emit(EVENTS.CMD_RENDERING_CREATE_FLYER, flyer, x, y);
		this.flyers.push(flyer);

		this.flyersAnimation.startPatrol(this.flyers);
	}

	findCoordForDrag(x, y) {
		const element = document.getElementById("board-canvas");
		const rect = element.getBoundingClientRect();
		const scaleX = element.width / rect.width;
		const scaleY = element.height / rect.height; // важно если есть масштаб
		const canvasX = (x - rect.left) * scaleX;
		const canvasY = (y - rect.top) * scaleY;
		return {x: canvasX, y: canvasY }
	}

	findClearCellForGiftItem(row, col) { 
		const clearCellsCoordNearby = this.gameBoard.findCoordClearCellsNearbyAll(Number(row), Number(col));
		if(clearCellsCoordNearby.length == 0) { console.log('нет места'); return null; }
		return clearCellsCoordNearby[0];
	}

	getRandomCoord(coord) { // теперь корды не нужны
		let place = false;
		let newCoord = {};

		while(!place) {
			let coordX = Math.floor(this.getRandomInt(0, this.cols - 1) * this.cell);
			let coordY = Math.floor(this.getRandomInt(0, this.rows - 1) * this.cell);

			const cordBoard = this.getCordBoard({ x: coordX, y: coordY });
			let col = cordBoard.col;
			let row = cordBoard.row;

			if(this.gameBoard.grid[row][col].fog.layer == 0
			&& !this.gameBoard.grid[row][col].landscape && row != 0) {
				if (this.gameBoard.grid[row][col].item
				&& this.gameBoard.grid[row][col].item.giftCollect) {
					continue
				}
				newCoord.x = Math.floor(coordX);
				newCoord.y = Math.floor(coordY);
				place = true;
			}
		}
		return newCoord
	}

	getCordBoard(coord) {
		return { col: Math.floor((coord.x) / this.cell),
			 row: Math.floor((coord.y) / this.cell) }

// этот метод на потом, когда будем перебирать ячейки, нужно будет в ячейке хранить ее корды
		for(let row = 0; row < this.rows; row++) {
			for(let col = 0; col < this.cols; col++) {
				if(coord.y >= row * this.cell && coord.y < row * this.cell + this.cell
				&& coord.x >= col * this.cell && coord.x < col * this.cell + this.cell) {
					return { col: col, row: row }
				}
			}
		}
	}

	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	findItemOnBoard(row, col) { //для класса flyer
		return this.gameBoard.grid[row][col].item;
	}

	findCoordItemsOnBoardForCollect(currentCoordFlyer) {
		const coord = this.getCordBoard(currentCoordFlyer);

		const coordItemsForCollect = []
		for(let row = 0; row < this.rows; row++) {
			for(let col = 0; col < this.cols; col++) {
				if(this.gameBoard.grid[row][col].fog.layer == 0
				&& this.gameBoard.grid[row][col].item
				&& this.gameBoard.grid[row][col].item.giftCollect) {
					coordItemsForCollect.push({
						row: row, 
						col: col,
						distance: Math.sqrt((coord.row - row)**2 + (coord.col - col)**2)
					})
				}
			}
		}
		if(coordItemsForCollect.length == 0) { return null }
		const coordItem = coordItemsForCollect.reduce((coord, currentCoord) => 
			coord.distance < currentCoord.dictance ? coord : currentCoord, 
			coordItemsForCollect[0]
		)
		const coordFlyer = this.flyerSideOfItem(coordItem, currentCoordFlyer);

		return  {coordItem: coordItem, coordFlyer: coordFlyer};
	}

	collectGiftFromItem(flyer, item) {
		let gift = item.giftCollect;
		if(this.gameBoard.grid[item.row][item.col].fog.layer !== 0
		&& this.gameBoard.grid[item.row][item.col].fog.isVisible) { return }
		if(!gift) { return }

		if(item.giftCollectUniq && flyer.type === item.giftCollectUniq.breed) {
			gift = item.giftCollectUniq;
		}

		const giftOnFlyer = new Item(gift.type, gift.level);
		flyer.mission = true;
		flyer.isPatrolling = false;

		const time = flyer.timeCollect;
		flyer.isCollect = true;

		flyer.isCollectPeriod = setTimeout(() => {
			flyer.mission = false;
			flyer.toItem = null;
			flyer.speed = GAME_CONFIG.ANIMATIONS.SPEED_FLYER;

			if(!flyer.isCollect) { return }

			flyer.isCollect = false;
			flyer.collectGift = giftOnFlyer;

			const coordForGift = this.findCoordForGift(item);

			if(coordForGift) {
				flyer.direction = {x: coordForGift.col * this.cell, y: coordForGift.row * this.cell };
			}

			this.eventBus.emit(EVENTS.CMD_RENDERING_COLLECT_GIFT_FROM_ITEM, giftOnFlyer, flyer.route.x, flyer.route.y);
			flyer.isPatrolling = true;

			if(item && item.fullCollect) {
				this.eventBus.emit(EVENTS.CMD_REMOVE_ITEM, item);
			}
		}, time)
	}

	putItemOnBoard(flyer) {
		const cordBoard = this.getCordBoard(flyer.route);
		const place = this.findClearCellForGiftItem(cordBoard.row, cordBoard.col);
		if(!place) { return }

		this.gameBoard.addItemInCell(place)  //{ row: place.row, col: place.col });
		const gift = flyer.collectGift;
		gift.coord = flyer.route; //{ x: flyer.route.x, y: flyer.route.y };
		flyer.collectGift = null;
		flyer.isGoUp = true;

		new Promise((resolve, reject) => {
			this.eventBus.emit(EVENTS.CMD_RENDERING_PUT_GIFT_FROM_FLYER, gift, place.row, place.col, resolve);
		})
		.then(() => {
			gift.row = place.row;
			gift.col = place.col;
			delete gift.coord;

			this.eventBus.emit(EVENTS.CMD_ADD_ITEM_FROM_FLAYER, gift);
		})
	}

	directFlyerToItem(item) {
		if(this.flyers.length == 0) { 
			item.countOfClick = 0;
			return; 
		}

		let currentFlyers = this.flyers.filter((flyer) => flyer.mission == false && !flyer.collectGift);
		if(currentFlyers.length == 0) {
			currentFlyers = this.flyers.filter((flyer) => flyer.mission == false);
		}

		if(currentFlyers.length == 0) {
			console.log('все драконы заняты'); 
			//item.countOfClick = 0;
			return; 
		}

		currentFlyers.forEach((flyer) => {
			flyer.distance = Math.sqrt((flyer.route.x - item.col * this.cell)**2 + (flyer.route.y - item.row * this.cell)**2)
		})
		
		const currentFlyer = currentFlyers.reduce((nearFlyer, currentFlyer) => 
			nearFlyer.distance < currentFlyer.distance ? nearFlyer : currentFlyer,
			currentFlyers[0]
		) 

		currentFlyers.forEach((flyer) => {
			delete flyer.distance;
		})

		const targetCoord = this.flyerSideOfItem({ col: item.col , row: item.row }, currentFlyer.route);

		currentFlyer.direction = targetCoord;
		currentFlyer.mission = true;
		currentFlyer.toItem = { col: item.col , row: item.row };

		currentFlyer.speed = GAME_CONFIG.ANIMATIONS.SPEED_FLYER_FOR_DIRECTION;

		if(currentFlyer.collectGift) {
			this.putItemOnBoard(currentFlyer);
		}

		if(item.countOfClick > 2) {
			currentFlyer.turnToItem = currentFlyer.toItem;
		}
	}

	flyerSideOfItem(itemCoord, flyerCoord) { // очень много и очень непонятно 
		const centerItemX = itemCoord.col * this.cell + this.cell / 2;
		const centerItemY = itemCoord.row * this.cell + this.cell / 2;
	
		const centerFlyerX = flyerCoord.x + this.cell / 2;
		const centerFlyerY = flyerCoord.y + this.cell / 2;

/*************************************************************************************/
		/*const centerX = item.col * this.cell + this.cell / 2;
		const centerY = item.row * this.cell + this.cell / 2;
		const offset = this.cell * 0.2;
		const angle = Math.random() * Math.PI * 2 ;
		const offsetX = Math.cos(angle) * offset;
		const offsetY = Math.sin(angle) * offset;
//console.log('angle', angle)
		const halfCell = this.cell;
		const targetX = centerX - halfCell + offsetX;
		const targetY = centerY - halfCell + offsetY;*/

/**************************************************************************************/
				
		const distanceX = centerItemX - centerFlyerX;
		const distanceY = centerItemY - centerFlyerY;

		const angle = Math.atan2(distanceY, distanceX) * (180 / Math.PI)
		const offset = this.cell *(1 - 0.3);
		const offsetX = Math.cos(angle) * offset;
		const offsetY = Math.sin(angle) * offset;

//console.log('angle', angle)
//console.log('offset', offsetX, offsetY)
		
		const halfCell = this.cell / 2;
		const targetX = centerItemX - halfCell + offsetX;
		const targetY = centerItemY - halfCell + offsetY;

		const targetXnew = Math.floor(Math.max(0, Math.min(targetX, this.boardWidth  - this.cell)));
		const targetYnew = Math.floor(Math.max(0, Math.min(targetY, this.boardHeight - this.cell)));
		return { x: targetXnew, y: targetYnew }
	}

	getCurrentFlyer(id) {
		const currentFlyer = this.flyers.find((flyer) => { return flyer.id == id });
		return currentFlyer;
	}
	
	handlerFlyer(flyer) {
		flyer.clearAll();
		const x = flyer.route.x + this.cell / 2;
		const y = flyer.route.y + this.cell / 2;
 
		const cordBoard = this.getCordBoard({x: x, y: y });
		const item = this.gameBoard.grid[cordBoard.row][cordBoard.col].item;

		if(item && item.giftCollect) {
			this.collectGiftFromItem(flyer, item);
		} else {
			if(flyer.isCollectPeriod) { 
				clearTimeout(flyer.isCollectPeriod); 
				flyer.clearAll();
			}
			this.startPatrulFlyerAfterDraging(flyer);
		}
	}

	startPatrulFlyerAfterDraging(flyer) {
		flyer.isPatrolling = false;
		setTimeout(() => {
			flyer.isPatrolling = true;
		}, 2000)
	}

	mergeFlyers(arr) {
		const flyerForMerge = arr;

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
			this.flyers = this.flyers.filter((fl) => fl.id != flyer.id);
		})	
		this.createFlyer(type, coordCenter.row, coordCenter.col, level + 1);
	}

	createNewFlyerAfterMerge(type, level, count, row, col) {
		for(let i = 0; i < count; i++) {
			this.createFlyer(type, row, col, level);
		}
	}

	findCoordForGift(item) {
		const gift = item.giftCollect;
		let coordForGift = [];
		for(let row = 0; row < this.rows; row++) {
			for(let col = 0; col < this.cols; col++) {
				if(this.gameBoard.grid[row][col].fog.layer == 0
				&& this.gameBoard.grid[row][col].item
				&& this.gameBoard.grid[row][col].item.type == gift.type) {
					coordForGift.push({row: row, col: col});
				}
			}
		}

		if(coordForGift.length == 0) { return null; }

		coordForGift.forEach((coord) => {
			coord.distance = Math.sqrt((coord.row - item.row)**2 + (coord.col - item.col)**2);
		})

		const nearCoord = coordForGift.reduce((minDistToGift, distToGift) => 
			distToGift.distance < minDistToGift.distance ? distToGift : minDistToGift,
			coordForGift[0]
		) 

		const place = this.findClearCellForGiftItem(nearCoord.row, nearCoord.col);
		if(!place) { return null }
			
		return place;
	}

/********************************************************************************/
//если захочется ограничить перемещение flyer

	getRandomCoord1(coord) {
		let place = false;
		let newCoord = {};
		const radius = 10;
		while(!place) {
			let coordX = Math.floor(coord.x + this.getRandomInt(1, radius) * this.cell);
			let coordY = Math.floor(coord.y + this.getRandomInt(1, radius) * this.cell);

			let coordXnew = Math.max(0, Math.min(coordX, this.boardWidth  - this.cell));
			let coordYnew = Math.max(0, Math.min(coordY, this.boardHeight - this.cell));

			const cordBoard = this.getCordBoard({ x: coordXnew, y: coordYnew });
			let col = cordBoard.col;
			let row = cordBoard.row;

			if(this.gameBoard.grid[row][col].fog.layer == 0
			&& !this.gameBoard.grid[row][col].landscape) {
				newCoord.x = Math.floor(coordXnew);
				newCoord.y = Math.floor(coordYnew);
				place = true;
			}
		}
		return newCoord
	}
/********************************************************************************/

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

