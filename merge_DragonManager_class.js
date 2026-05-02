const dragons = {
	blackDragon: { type: 'blackDragon', maxLevel: 4, set: {
			1: { pic: 'image/items/dragons/black_dragon/black_dragon_1_level.png' },
			2: { pic: 'image/items/dragons/black_dragon/black_dragon_2_level.png' },
			3: { pic: 'image/items/dragons/black_dragon/black_dragon_3_level.png' },
			4: { pic: 'image/items/dragons/black_dragon/black_dragon_4_level.png' },
			}	
	},

	redDragon: { type: 'redDragon', maxLevel: 4, set: {
			1: { pic: 'image/items/dragons/red_dragon/red_dragon_1_level.png' },
			2: { pic: 'image/items/dragons/red_dragon/red_dragon_2_level.png' },
			3: { pic: 'image/items/dragons/red_dragon/red_dragon_3_level.png' },
			4: { pic: 'image/items/dragons/red_dragon/red_dragon_4_level.png' },
			}	
	}

}

class Dragon {
	type = null;
	level = 0;

	id = '';
	maxLevel = 0; 
	pic = null;

	element = null;

	collectGift = null;
	mission = false;
	direction = null;
	route = {};
	speed = 30

	isDraging = false;

	constructor(type, level) {
		this.type = type;
		this.level = level;

		this.id = this.generateId();
		this.maxLevel = dragons[this.type].maxLevel;
		this.pic = dragons[this.type].set[this.level].pic;
	}

	generateId() {
		const lengthId = 10;
		let p = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIKLMNOPQRSTUVWXYZ!@#$%^&*()';
		let id = '';
		for (let i = 0; i < lengthId; i++) {
			id += p[Math.floor(Math.random()*p.length)];
		} 
		return id;
	}
}

class DragonRenderer {
	cell = GAME_CONFIG.BOARD_SIZE.CELL;

	//rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	//cols = GAME_CONFIG.BOARD_SIZE.COLS;

	//boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	//boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGTH;
	
	dragonElementForSave = null;
	giftElementForSave = null;

	constructor() {}

	createDragon(id, pic, row, col) {
		const containerDragon = document.querySelector('.dragon-container');
		const dragon = document.createElement('div');
		dragon.className = 'dragon';
		dragon.id = `dragon-${id}`;
		dragon.dataset.name = 'dragon';
		dragon.dataset.id = `${id}`;

		dragon.style.backgroundImage = `url(${pic})`;

		// dragon.textContent = `${pic}`;
		// dragon.style.color = 'white';
		dragon.style.width = `${this.cell}px`;
		// const heightDragon = 20;
		dragon.style.left = `${this.cell * col}px`;
		dragon.style.top = `${this.cell * row}px`;
		containerDragon.appendChild(dragon);

		this.dragonElementForSave = dragon;
	}
	
	coordDragon(element) {
		return { x: Number(element.style.left.split('px')[0]), 
			 y: Number(element.style.top.split('px')[0])  }
	}

	updateCoordDragon(element, x, y) {
		element.style.left = `${x}px`;
		element.style.top = `${y}px`;
	}

	collectGiftFromItem(element, itemId, pic) {
		const item = document.createElement('div');
		item.className = 'gift-on-dragon';
		item.id = `item-${itemId}`;
		item.dataset.name = 'gift-on-dragon';
		item.dataset.id = `${itemId}`;

		item.style.backgroundImage = `url(${pic})`;
		// item.textContent = `${pic}`;

		const size = GAME_CONFIG.UI.SIZE_GIFT_ON_ITEM_OF_DRAGON;
		item.style.width = `${this.cell * size}px`;
		item.style.position = 'absolute';
		element.appendChild(item);

		this.giftElementForSave = item;
	}

	removeDragon(element) {
		element.remove();
	}	

	removeFlyItem(element, rowStart, colStart, rowEnd, colEnd) {

		return new Promise((resolve, reject) => {
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
				resolve();
			}
	
			element.style.transition = `left ${time}s ease-in-out, top ${time}s ease-in-out`
			element.style.left = `${this.cell * colEnd + this.cell / 2}px`;
			element.style.top  = `${this.cell * rowEnd + this.cell / 2}px`;
			element.style.zIndex = '100';

			element.addEventListener('transitionend', (event) => {
				element.remove();
				resolve();
			})
		})
	}
}

class DragonManager {
	renderer = new DragonRenderer();
	
	cell = GAME_CONFIG.BOARD_SIZE.CELL;

	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGTH;
	
	dragons = [];
	
	constructor(board, eventEmiter) {
		this.gameBoard = board;
		this.eventEmiter = eventEmiter;
	}
	
	createDragon(typeDragon, row, col, level = 1) {
		const dragon = new Dragon(typeDragon, level);
		this.dragons.push(dragon);

		this.renderer.createDragon(dragon.id, dragon.pic, row, col)
		dragon.element = this.renderer.dragonElementForSave;
		this.renderer.dragonElementForSave = null;

		dragon.route = this.renderer.coordDragon(dragon.element);
		this.renderer.dragonElementForSave = null;

		this.startPatrulDragon(dragon);
	}
	
	deleteDragon(currentDragon) {
		this.dragons = this.dragons.filter((dragon) => dragon.id != currentDragon.id);
		this.renderer.removeDragon(currentDragon.element);
	}


	startPatrulDragon(dragon) {
		const coordStart = dragon.route;

		let isPatrul = true;

		let startTimeWay = null;
		let progress = 0;

		let coordRandom = this.getRandomCoord(coordStart);

		const distanceX = coordRandom.x - coordStart.x;
		const distanceY = coordRandom.y - coordStart.y;
		const distance  = Math.sqrt(distanceX**2 + distanceY**2);
		//const speed = dragon.speed;
		//const duration = (distance / speed) * 1000;

		const patrul = () => {
			if(!isPatrul) { return } 
			if(dragon.isDraging) { return } 
			if(!dragon.element) { return }

			requestAnimationFrame((timeStamp) => {
				if(!startTimeWay) { startTimeWay = timeStamp };
				const deltaTime = timeStamp - startTimeWay;

				progress = Math.min(deltaTime/((distance / dragon.speed) * 1000), 1);
				
				//progress = Math.min(deltaTime/duration, 1);
				//progress = 1 - Math.pow(1-progress, 1.5);

				let coordPatrulX = coordStart.x + (coordRandom.x - coordStart.x) * progress;
				let coordPatrulY = coordStart.y + (coordRandom.y - coordStart.y) * progress;

				this.renderer.updateCoordDragon(dragon.element, coordPatrulX, coordPatrulY);
			});
			requestAnimationFrame(patrul);

			const coordEnd = this.renderer.coordDragon(dragon.element);
			dragon.route = coordEnd;

			if(dragon.direction !== null) { 
				coordStart.x = Math.floor(coordEnd.x);
				coordStart.y = Math.floor(coordEnd.y);

				coordRandom = dragon.direction
				dragon.direction = null;
				startTimeWay = null;
				progress = 0;
			} 

			if(coordEnd.x == coordRandom.x && coordEnd.y == coordRandom.y) {
				if(dragon.mission) { dragon.mission = false; dragon.speed = 30; }
				startTimeWay = null;
				progress = 0;

				coordStart.x = Math.floor(coordEnd.x);
				coordStart.y = Math.floor(coordEnd.y);

				const cordBoard = this.getCordBoard(coordStart);

				if(dragon.collectGift) {
					this.putItemOnBoard(dragon);
				}

				const gift = this.isHasItemGiftForCollect(cordBoard.row, cordBoard.col);

				if(gift && !dragon.collectGift) {
					isPatrul = false;
					this.collectGiftFromItem(dragon, gift);
					
				} else {
					coordRandom = this.getRandomCoord(coordStart);
				}
				if(dragon.mission) { dragon.mission = false }
			}
		}
		patrul();
	}

	findClearCellForGiftItem(row, col) { 
		const clearCellsCoordNearby = this.gameBoard.findCoordClearCellsNearbyAll(Number(row), Number(col));
		if(clearCellsCoordNearby.length == 0) { console.log('нет места'); return []; }
		
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

	isHasItemGiftForCollect(row, col) {
		return this.gameBoard.grid[row][col].item?.giftCollect;
	}

	collectGiftFromItem(dragon, gift) {
		const giftOnDragon = new Item(gift.type, gift.level);
		dragon.mission = true;

		const time = GAME_CONFIG.UI.TIME_COLLECT_GIFT_FROM_ITEM; // 2 * 1000;
		setTimeout(() => {
			this.renderer.collectGiftFromItem(dragon.element, giftOnDragon.id, giftOnDragon.pic);
			giftOnDragon.element = this.renderer.giftElementForSave;
			this.renderer.giftElementForSave = null;

			dragon.collectGift = giftOnDragon;
			dragon.mission = false;
			this.startPatrulDragon(dragon);
		}, time)
	}

	putItemOnBoard(dragon) {
		const cordBoard = this.getCordBoard(dragon.route) 
		const place = this.findClearCellForGiftItem(cordBoard.row, cordBoard.col);
		this.gameBoard.addItemInCell({ row: place.row, col: place.col });	
		
		this.renderer.removeFlyItem(dragon.collectGift.element, cordBoard.row, cordBoard.col, place.row, place.col)
			.then(() => {
				dragon.collectGift.row = place.row;
				dragon.collectGift.col = place.col;
				this.gameBoard.addItemInCell(dragon.collectGift);

				this.eventEmiter.emit('itemPutOnBoard', place.row, place.col) 
				dragon.collectGift = null;
			})

	}

	directDragonToItem(item) {
		if(this.dragons.length == 0) { return }

		const currentDragon = this.dragons.find((dragon) => { return dragon.mission == false })
		if(!currentDragon) { console.log('все драконы заняты'); return }

		currentDragon.direction = { x: item.col * this.cell, y: item.row * this.cell };
		currentDragon.mission = true;
		currentDragon.speed = 50;

		if(currentDragon.collectGift) {
			this.putItemOnBoard(currentDragon);
		}
	}

	getCurrentDargon(id) {
		const currentDragon = this.dragons.find((dragon) => { return dragon.id == id })
		return currentDragon;
	}
	
	collectItemAfterDraging(dragon) {
		const x = dragon.route.x + this.cell / 2;
		const y = dragon.route.y + this.cell / 2;
		const cordBoard = this.getCordBoard({ x: x, y: y });
		const gift = this.isHasItemGiftForCollect(cordBoard.row, cordBoard.col)
		if(gift) {
			this.collectGiftFromItem(dragon, gift)
		} else {
			setTimeout(() => {
				this.startPatrulDragon(dragon);
			}, 2000)
		}
	}

	startPatrulDragonAfterDraging(dragon) {
		setTimeout(() => {
			this.startPatrulDragon(dragon)
		}, 2000)
	}

	mergeDragons(arr) {
		const dragonForMerge = arr.map((element) => {
			return this.getCurrentDargon(element.dataset.id);
		}) 
console.log(dragonForMerge)

		const type = dragonForMerge[0].type;
		const level = dragonForMerge[0].level;

		const isCanMerge = dragonForMerge.every((dragon) => 
			dragon.type  == type &&
			dragon.level == level
		)

		if(!isCanMerge) { return }

		const coordCenter = this.getCordBoard(dragonForMerge[0].route);

		dragonForMerge.forEach((dragon) => {
			this.deleteDragon(dragon);
		})	
		
		this.createDragon(type, coordCenter.row, coordCenter.col, level + 1);


		/*let numberNewDragons = 0;
		let numberDragonsKeepOriginal = 0; //больше 3х ни разу не получилось объединить

		if(dragonForMerge.length >= GAME_CONFIG.MERGE_RULES.MIN_FOR_BONUS) {
			numberNewDragons = Math.trunc(dragonForMerge.length / GAME_CONFIG.MERGE_RULES.MIN_FOR_BONUS) * GAME_CONFIG.MERGE_RULES.BONUS_MULTIPLIER;
			numberDragonsKeepOriginal = Math.trunc(dragonForMerge.length % GAME_CONFIG.MERGE_RULES.MIN_FOR_BONUS);
		} else {
			numberNewDragons = Math.trunc(dragonForMerge.length / GAME_CONFIG.MERGE_RULES.MIN_FOR_MERGE);
			numberDragonsKeepOriginal = Math.trunc(dragonForMerge.length % GAME_CONFIG.MERGE_RULES.MIN_FOR_MERGE);
		}

		if(numberDragonsKeepOriginal >= GAME_CONFIG.MERGE_RULES.MIN_FOR_MERGE) {
			numberNewDragons += Math.trunc(numberItemsKeepOriginal / GAME_CONFIG.MERGE_RULES.MIN_FOR_MERGE); 
			numberDragonsKeepOriginal -= numberNewItems;
		}

		this.createNewDragonAfterMerge(type, level + 1, numberNewDragons, coordCenter.row, coordCenter.col);*/
	}

	createNewDragonAfterMerge(type, level, count, row, col) {
		for(let i = 0; i < count; i++) {
			this.createDragon(type, row, col, level);
		}
	}
}

class DragonGallery {
	
	constructor() {

	}
}
