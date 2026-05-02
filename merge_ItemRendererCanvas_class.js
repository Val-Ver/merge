class ItemRendererCanvas {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	cell = GAME_CONFIG.BOARD_SIZE.CELL;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGTH;

	canvas = document.getElementById("item-canvas");
	sizeCanvas = this.canvas.getBoundingClientRect();
	ctx = this.canvas.getContext('2d');

	canvasForDraggingItem = document.getElementById("item-draging-canvas");
	ctxDrag = this.canvasForDraggingItem.getContext('2d');

	eventBus = EventBus.getInstance();

	constructor(assetManager) {
		this.assetManager = assetManager;

		this.eventBus.on(EVENTS.CMD_RENDERING_ITEM, (item, x, y) => {
			this.createItem(item, x, y);
		})
		this.eventBus.on('cmd: move Item', (item, x, y) => {
			this.drawMoveItem(item, x, y);
		})

		this.eventBus.on(EVENTS.CMD_RENDERING_SHOW_ITEM_ON_BOARD, (item, row, col) => {
			this.putItemOnBoard(item, row, col);
		})

		this.eventBus.on(EVENTS.CMD_RENDERING_SHOW_BEFORE_REMOVE_ITEM, (coordCenter, item, resolve) => {
			return this.showBeforeRemoveItem(coordCenter, item, resolve);
		})

		this.eventBus.on(EVENTS.CMD_RENDERING_SHOW_ITEM_ON_BOARD_AFTER_MERGE, (item, fromRow, fromCol, row, col) => {
			this.showPutItemOnBoardAfterMerge(item, fromRow, fromCol, row, col);
		})

		this.eventBus.on(EVENTS.CMD_RENDERING_REMOVE_ITEM, (item) => {
			this.removeItem(item);
		})


		this.eventBus.on(EVENTS.CMD_RENDERING_GIFT_ON_ITEM, (item) => {
			this.createGiftOnItem(item);
		})

		this.eventBus.on(EVENTS.CMD_RENDERING_REMOVE_GIFT_ON_ITEM, (item) => {
			this.removeGiftOnItem(item);
		})
	}

	createGiftOnItem(item, ctx = this.ctx) {
		const distance = this.cell / item.giftOnItem.count;
		const size = GAME_CONFIG.UI.SIZE_GIFT_ON_ITEM_OF_ITEM;
		const sizeGift = this.cell * size;
		
		const distanceGift = (distance - sizeGift) / 2

		const x = item.coord.x + ((item.countHasGiftOnItem - 1) * distance) + distanceGift;
		const y = item.coord.y + this.cell - sizeGift;

		const itemX = x + sizeGift / 2;
		const itemY = y + sizeGift / 2;

		const pic = items[item.giftOnItem.type].set[item.giftOnItem.level].pic

		ctx.font = "5px Times New Roman, monospace";
		ctx.fillStyle = 'black';

		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		ctx.fillText(`${pic}`, itemX, itemY);
		
		ctx.strokeStyle = 'grey';
		ctx.strokeRect(x, y, sizeGift, sizeGift);
	}

	removeGiftOnItem(item) {
		this.ctx.clearRect(item.col * this.cell, item.row * this.cell, this.cell, this.cell);
		this.createItem(item);
	}

	drawMoveItem(item, x, y) {
		this.ctx.clearRect(item.col * this.cell, item.row * this.cell, this.cell, this.cell); //я бы перенесла

		this.ctxDrag.clearRect(item.coord.x - 5, item.coord.y - 5, this.cell + 10, this.cell + 10);
		this.createItem(item, x, y, this.ctxDrag);
	}

	createAllItemsOnBoard(grid) {
		this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
		for(let row = 0; row < this.rows; row++) {
			for(let col = 0; col < this.cols; col++) {
				if(grid[row][col].item) {
					this.createItem(grid[row][col].item)
				}
			}
		}
	}

	createItem(item, x = item.col * this.cell, y = item.row * this.cell, ctx = this.ctx) {
		const itemX = x  + this.cell / 2;
		const itemY = y  + this.cell / 2;

		const img = this.assetManager.getImage(item.pic);
		if (img) {
			ctx.drawImage(img, x, y, this.cell, this.cell);
		} else {
			// fallback: текст или пустота
			ctx.font = "25px Times New Roman, monospace";
			ctx.fillStyle = 'black';

			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(`${item.pic}`, itemX, itemY);

			ctx.strokeStyle = 'grey';
			ctx.strokeRect(x, y, this.cell, this.cell);
		}

		if(item.countHasGiftOnItem > 0) {
			let count = item.countHasGiftOnItem;
			item.countHasGiftOnItem = 0;
			for(let i = 1; i <= count; i++) {
				item.countHasGiftOnItem++;
				this.createGiftOnItem(item, ctx);
			}
		}
		item.coord = { x: x, y: y }
	}

	putItemOnBoard(item, row, col) {
		let isAnimation = true;
		let animationId = null

		let startTime = null;
		const duration = GAME_CONFIG.ANIMATIONS.TIME_PUT_ITEM_ON_BOARD;
		let progress = 0;

		const endX = col * this.cell;
		const endY = row * this.cell;

		const startX = item.coord.x
		const startY = item.coord.y

		const putOnBoard = (timeStamp) => {
			if(!isAnimation) { return }

			if(!startTime) { startTime = timeStamp } 
			const elapsed = timeStamp - startTime;
			progress = Math.min(1, elapsed / duration);

			const currentX = startX + (endX - startX) * progress;
			const currentY = startY + (endY - startY) * progress;

			this.ctxDrag.clearRect(item.coord.x - 5, item.coord.y - 5, this.cell + 10, this.cell + 10);
			this.createItem(item, currentX, currentY, this.ctxDrag);

			if(progress < 1) {
				animationId = requestAnimationFrame((timeStamp) => putOnBoard(timeStamp));
			} else {
				cancelAnimationFrame(animationId);
				isAnimation = false;
				animationId = null;

				this.ctxDrag.clearRect(item.coord.x - 5, item.coord.y - 5, this.cell + 10, this.cell + 10);
				this.createItem(item)
			}
		}
		animationId = requestAnimationFrame((timeStamp) => putOnBoard(timeStamp));
	}

	showBeforeRemoveItem(coordCenter, item, resolve) {
		this.ctx.clearRect(item.coord.x, item.coord.y, this.cell, this.cell);

		let isAnimation = true;
		let animationId = null

		let startTime = null;
		const duration = GAME_CONFIG.ANIMATIONS.TIME_REMOVE_ITEM_TRANSITION * 1000;
		let progress = 0;

		const startX = item.coord.x
		const startY = item.coord.y

		const endX = coordCenter.col * this.cell;
		const endY = coordCenter.row * this.cell;

		const removeItem = (timeStamp) => {
			if(!isAnimation) { return }
			if(!startTime) { startTime = timeStamp } 
			const elapsed = timeStamp - startTime;
			progress = Math.min(1, elapsed / duration);

			const currentX = startX + (endX - startX) * progress;
			const currentY = startY + (endY - startY) * progress;

			this.ctxDrag.clearRect(item.coord.x - 5, item.coord.y - 5, this.cell + 15, this.cell + 15);
			this.createItem(item, currentX, currentY, this.ctxDrag);

			if(progress < 1) {
				animationId = requestAnimationFrame((timeStamp) => removeItem(timeStamp));
			} else {
				cancelAnimationFrame(animationId);
				isAnimation = false;
				animationId = null;

				this.ctxDrag.clearRect(item.coord.x - 5, item.coord.y - 5, this.cell + 15, this.cell + 15);
				return resolve();
			}
		}
		animationId = requestAnimationFrame((timeStamp) => removeItem(timeStamp));	
	}

	showPutItemOnBoardAfterMerge(item, fromRow, fromCol, row, col) {
		item.coord = { x: fromCol * this.cell, y: fromRow * this.cell } 
		this.putItemOnBoard(item, row, col);
	}

	removeItem(item) {
		this.ctx.clearRect(item.coord.x, item.coord.y, this.cell, this.cell);
		//нужно добавить анимацию
	}
	

}