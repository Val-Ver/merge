class ItemRendererCanvas {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	cell = GAME_CONFIG.BOARD_SIZE.CELL;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGHT;

	canvas = document.getElementById("item-canvas");
	sizeCanvas = this.canvas.getBoundingClientRect();
	ctx = this.canvas.getContext('2d');

	canvasFofDragging = document.getElementById("dragging-canvas");
	ctxDrag = this.canvasFofDragging.getContext('2d');

	effectRenderer = null;

	eventBus = EventBus.getInstance();

	constructor(assetManager) {
		this.assetManager = assetManager;
		this.effectRenderer = new ItemEffectRenderer(this);
		this.subscription();
	}

	subscription() {
		this.eventBus.on(EVENTS.CMD_RENDERING_PLACE_ITEM_ON_BOARD, (grid) => {
			this.createAllItemsOnBoard(grid)
		})
		this.eventBus.on(EVENTS.CMD_RENDERING_ITEM, (item, x, y) => {
			this.createItem(item, x, y);
		})
		this.eventBus.on(EVENTS.CMD_RENDERING_CLEAR_ITEM_FOR_DRAG, (item) => {
			this.clearItemforDrag(item);
		})

		this.eventBus.on('cmd: move Item', (item, x, y) => {
			this.drawMoveItem(item, x, y);
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
		const img = this.assetManager.getImage(pic);

		if (img) {
			ctx.drawImage(img, x, y, sizeGift, sizeGift);
		} else {
			ctx.font = "5px Times New Roman, monospace";
			ctx.fillStyle = 'black';

			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			ctx.fillText(`${pic}`, itemX, itemY);

			ctx.strokeStyle = 'grey';
			ctx.strokeRect(x, y, sizeGift, sizeGift);
		}
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

	removeItem(item) {
		if(item.animationId) { 
			cancelAnimationFrame(item.animationId);
			item.animationId = null;
			this.ctxDrag.clearRect(item.coord.x - 5, item.coord.y - 5, this.cell + 10, this.cell + 10);
		}
		this.ctx.clearRect(item.coord.x, item.coord.y, this.cell, this.cell);
		//нужно добавить анимацию
	}



	removeGiftOnItem(item) {
		this.ctx.clearRect(item.col * this.cell, item.row * this.cell, this.cell, this.cell);
		this.createItem(item);
	}

	clearItemforDrag(item) {
		this.ctx.clearRect(item.coord.x, item.coord.y, this.cell, this.cell);
		this.createItem(item, item.coord.x, item.coord.y, this.ctxDrag);
	}

	drawMoveItem(item, x, y) {
		const indent = this.cell;
		this.ctxDrag.clearRect(item.coord.x - indent, item.coord.y - indent, this.cell + indent*2, this.cell + indent*2);
		this.createItem(item, x, y, this.ctxDrag);
	}



}