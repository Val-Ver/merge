class ItemEffectRenderer {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	cell = GAME_CONFIG.BOARD_SIZE.CELL;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGHT;

	canvas = null;
	ctx = null;

	canvasFofDraggingItem = null;
	ctxDrag = null;

	eventBus = EventBus.getInstance();

	constructor(itemRenderer) {
		this.itemRenderer = itemRenderer;

		this.canvas = itemRenderer.canvas;
		this.ctx = itemRenderer.ctx;

		this.canvasFofDragging = itemRenderer.canvasFofDragging;
		this.ctxDrag = itemRenderer.ctxDrag;
		
		this.subscription();
	}
	
	subscription() {
		this.eventBus.on(EVENTS.CMD_RENDERING_SHOW_ITEM_ON_BOARD, (item, row, col) => {
			this.putItemOnBoard(item, row, col);
		});

		this.eventBus.on(EVENTS.CMD_RENDERING_SHOW_BEFORE_REMOVE_ITEM, (coordCenter, item, resolve) => {
			return this.showBeforeRemoveItem(coordCenter, item, resolve);
		});
		this.eventBus.on(EVENTS.CMD_RENDERING_SHOW_ITEM_ON_BOARD_AFTER_MERGE, (item, fromRow, fromCol, row, col) => {
			this.showPutItemOnBoardAfterMerge1(item, fromRow, fromCol, row, col);
		});
		this.eventBus.on('afterMergeAddItem', (fromRow, fromCol, arrItems) => {
			this.showPutItemOnBoardAfterMerge(fromRow, fromCol, arrItems);
			
		});
		this.eventBus.on(EVENTS.CMD_RENDERING_ADD_HIGHLIGHTING_ITEM, (arrItems) => {
			this.addHighlightingItems(arrItems);
		})
		this.eventBus.on(EVENTS.CMD_RENDERING_REMOVE_HIGHLIGHTING_ITEM, (arrItems) => {
			this.removeHighlightingItems(arrItems);
		});
	}

	putItemOnBoard(item, row, col) {
		let isAnimation = true;
		item.animationId = null

		let startTime = null;
		const duration = GAME_CONFIG.ANIMATIONS.TIME_PUT_ITEM_ON_BOARD;
		let progress = 0;

		const endX = col * this.cell;
		const endY = row * this.cell;

		const startX = item.coord.x
		const startY = item.coord.y

		if(endX === startX 
		&& endY === startY) {
			this.ctxDrag.clearRect(item.coord.x, item.coord.y, this.cell, this.cell);
			this.itemRenderer.createItem(item);
			return;
		}

		const putOnBoard = (timeStamp) => {
			if(!isAnimation) { return }

			if(!startTime) { startTime = timeStamp } 
			const elapsed = timeStamp - startTime;
			progress = Math.min(1, elapsed / duration);

			const currentX = startX + (endX - startX) * progress;
			const currentY = startY + (endY - startY) * progress;
		
			this.ctxDrag.clearRect(item.coord.x - this.cell, item.coord.y - this.cell, this.cell + this.cell*2, this.cell + this.cell*2);
			this.itemRenderer.createItem(item, currentX, currentY, this.ctxDrag);

			if(progress < 1) {
				item.animationId = requestAnimationFrame((timeStamp) => putOnBoard(timeStamp));
			} else {
				cancelAnimationFrame(item.animationId);
				isAnimation = false;
				item.animationId = null;

				this.ctxDrag.clearRect(item.coord.x - this.cell, item.coord.y - this.cell, this.cell + this.cell*2, this.cell + this.cell*2);
				this.itemRenderer.createItem(item);
			}
		}
		item.animationId = requestAnimationFrame((timeStamp) => putOnBoard(timeStamp));
	}

	getCoordFieldForAnimation(itemsOnBoard) {
		//itemsOnBoard.sort((a, b) => a.row - b.row)
			
		//const rowMin = itemsOnBoard[0].row;
		//const rowMax = itemsOnBoard[itemsOnBoard.length-1].row;

		//itemsOnBoard.sort((a, b) => a.col - b.col)

		//const colMin = itemsOnBoard[0].col;
		//const colMax = itemsOnBoard[itemsOnBoard.length-1].col;
/********************************************************************************/
		const {rowMin, rowMax, colMin, colMax} = itemsOnBoard.reduce((acc, item) => ({
			rowMin: Math.min(acc.rowMin, item.row),
			rowMax: Math.max(acc.rowMax, item.row),
			colMin: Math.min(acc.colMin, item.col),
			colMax: Math.max(acc.colMax, item.col),
		}), {rowMin: Infinity, rowMax: -Infinity, colMin: Infinity, colMax: -Infinity})
/********************************************************************************/
		const fieldX = colMin * this.cell - this.cell;
		const fieldY = rowMin * this.cell - this.cell;
	
		const fieldWidth  = (colMax - colMin + 1) * this.cell + this.cell * 2;
		const fieldHeight = (rowMax - rowMin + 1) * this.cell + this.cell * 2;

		return { x: fieldX, y: fieldY, width: fieldWidth, height: fieldHeight }
	}	

	showBeforeRemoveItem(coordCenter, arrItems, resolve) {
		let isAnimation = true;
		let animationId = null;

		let startTime = null;
		const duration = GAME_CONFIG.ANIMATIONS.TIME_REMOVE_ITEM_TRANSITION * 1000;
		let progressSumm = 0;

		const endX = coordCenter.col * this.cell;
		const endY = coordCenter.row * this.cell;

		const itemsOnBoard = arrItems.filter((item) => !item.outside)
		const field = this.getCoordFieldForAnimation(itemsOnBoard);

		for(let i = 0; i < arrItems.length; i++) {
			if(!arrItems[i].outside) {
				this.ctx.clearRect(arrItems[i].coord.x, arrItems[i].coord.y, this.cell, this.cell);
			}
			arrItems[i].animation = {};
			arrItems[i].animation.startX = arrItems[i].coord.x
			arrItems[i].animation.startY = arrItems[i].coord.y
		}

		const removeItem = (timeStamp) => {
			if(!isAnimation) { return }
			if(!startTime) { startTime = timeStamp } 

			const elapsed = timeStamp - startTime;

			progressSumm = 0;
			this.ctxDrag.clearRect(field.x, field.y, field.width, field.height);


			for(let i = 0; i < arrItems.length; i++) {
				arrItems[i].animation.progress = Math.min(1, elapsed / duration);
				progressSumm += arrItems[i].animation.progress;

				if(arrItems[i].clear) { continue }

				const currentX = arrItems[i].animation.startX + (endX - arrItems[i].animation.startX) * arrItems[i].animation.progress;
				const currentY = arrItems[i].animation.startY + (endY - arrItems[i].animation.startY) * arrItems[i].animation.progress;

				this.itemRenderer.createItem(arrItems[i], currentX, currentY, this.ctxDrag);
				this.createHighlightingOnItem(arrItems[i]);

				if(arrItems[i].animation.progress >= 1) {
					arrItems[i].animation.clear = true;
				}
			}
			
			if(progressSumm < arrItems.length) {
				animationId = requestAnimationFrame((timeStamp) => removeItem(timeStamp));
			} else {
				cancelAnimationFrame(animationId);
				isAnimation = false;
				animationId = null;

				this.ctxDrag.clearRect(field.x, field.y, field.width, field.height);
				for(let i = 0; i < arrItems.length; i++) {
					delete arrItems[i].animation;
				}
				return resolve();
			}
		}
		animationId = requestAnimationFrame((timeStamp) => removeItem(timeStamp));	
	}

	showPutItemOnBoardAfterMerge1(item, fromRow, fromCol, row, col) {
		item.coord = { x: fromCol * this.cell, y: fromRow * this.cell } 
		this.putItemOnBoard(item, row, col);
	}

	showPutItemOnBoardAfterMerge(fromRow, fromCol, arrItems) {
		let isAnimation = true;
		let animationId = null;

		let startTime = null;
		const duration = GAME_CONFIG.ANIMATIONS.TIME_REMOVE_ITEM_TRANSITION * 1000;
		let progressSumm = 0;

		const startX = fromCol * this.cell;
		const startY = fromRow * this.cell;

		const field = this.getCoordFieldForAnimation(arrItems);

		for(let i = 0; i < arrItems.length; i++) {
			arrItems[i].coord = { x: fromCol * this.cell, y: fromRow * this.cell } 
			arrItems[i].animation = {};
			arrItems[i].animation.endX = arrItems[i].col * this.cell;
			arrItems[i].animation.endY = arrItems[i].row * this.cell;
		}

		const createItem = (timeStamp) => {
			if(!isAnimation) { return }
			if(!startTime) { startTime = timeStamp } 
			const elapsed = timeStamp - startTime;
			progressSumm = 0;

			this.ctxDrag.clearRect(field.x, field.y, field.width, field.height);

			for(let i = 0; i < arrItems.length; i++) {
				arrItems[i].animation.progress = Math.min(1, elapsed / duration);

				progressSumm += arrItems[i].animation.progress;
				if(arrItems[i].animation.put) { continue }
				
				const currentX = startX + (arrItems[i].animation.endX - startX) * arrItems[i].animation.progress;
				const currentY = startY + (arrItems[i].animation.endY - startY) * arrItems[i].animation.progress;

				this.itemRenderer.createItem(arrItems[i], currentX, currentY, this.ctxDrag);

				if(arrItems[i].animation.progress >= 1) {
					arrItems[i].animation.put = true;
					if(!arrItems[i].isDraging) {
						this.itemRenderer.createItem(arrItems[i]);
					}
				}
			}
			
			if(progressSumm < arrItems.length) {
				animationId = requestAnimationFrame((timeStamp) => createItem(timeStamp));
			} else {
				cancelAnimationFrame(animationId);
				isAnimation = false;
				animationId = null;
		
				this.ctxDrag.clearRect(field.x, field.y, field.width, field.height);
				for(let i = 0; i < arrItems.length; i++) {
					delete arrItems[i].animation;
				}

			}
		}
		animationId = requestAnimationFrame((timeStamp) => createItem(timeStamp));	
		
	}

	createHighlightingOnItem(item, ctx = this.ctxDrag) {
		const blurSize = 15;
		for(let i = blurSize; i >= 0; i--) {
			const alpha = 0.15 * (1 - i/blurSize);
			ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
			let lineWidth = 1; 
			ctx.strokeRect(item.coord.x+i/2+lineWidth/2, item.coord.y+i/2+lineWidth/2, this.cell-i-lineWidth, this.cell-i-lineWidth);
			//ctx.strokeRect(item.coord.x+i/2, item.coord.y+i/2, this.cell-i, this.cell-i);
			//ctx.strokeRect(item.coord.x-i/2, item.coord.y-i/2, this.cell+i, this.cell+i);
		}
		ctx.lineWidth = 1;
	}

	addHighlightingItems(arrItems) {
		const count = arrItems.length
		arrItems.forEach(item => {
			this.ctxDrag.clearRect(item.coord.x, item.coord.y, this.cell, this.cell);
			if(item.isDraging) {
				this.itemRenderer.createItem(item, item.coord.x, item.coord.y, this.ctxDrag);
				this.createMergeCounter(item.coord.x, item.coord.y, count)
			}
			this.createHighlightingOnItem(item);
		})
	}

	removeHighlightingItems(arrItems) {
		arrItems.forEach(item => {
			this.ctxDrag.clearRect(item.coord.x, item.coord.y, this.cell, this.cell);
			if(item.isDraging) {
				this.itemRenderer.createItem(item,item.coord.x, item.coord.y, this.ctxDrag);
			}
		})
	}

	createMergeCounter(x, y, count) {
		let pi = Math.PI;
		const radius = this.cell * 0.25;
		const centerX = x + radius + 1;
		const centerY = y + radius + 1;

		const gradient = this.ctx.createRadialGradient(
						centerX, centerY, radius,
						centerX, centerY, radius-5);
		gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
		gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		
		this.ctxDrag.beginPath();
		this.ctxDrag.lineWidth = 1;

		this.ctxDrag.fillStyle = gradient;
		this.ctxDrag.strokeStyle = "rgba(255, 255, 255, 1)";
	
		this.ctxDrag.arc(centerX, centerY, radius, 0, 2*pi, true);
		this.ctxDrag.stroke();
		this.ctxDrag.fill();

		this.ctxDrag.font = "10px Times New Roman, monospace";
		this.ctxDrag.fillStyle = "rgba(255, 255, 255, 1)";

		this.ctxDrag.textAlign = "center";
		this.ctxDrag.textBaseline = "middle";
		this.ctxDrag.fillText(`${count}`,  centerX, centerY);
	
	}


/*************************************************************************************/
//раньше была такая - перемещение по одному предмету, нужно на создание такое же написать

	showBeforeRemoveItem1(coordCenter, item, resolve) {
		this.ctx.clearRect(item.coord.x, item.coord.y, this.cell, this.cell);

		let isAnimation = true;
		item.animationId = null;

		let startTime = null;
		const duration = GAME_CONFIG.ANIMATIONS.TIME_REMOVE_ITEM_TRANSITION * 1000;
		let progress = 0;

		const startX = item.coord.x
		const startY = item.coord.y

		const endX = coordCenter.col * this.cell;
		const endY = coordCenter.row * this.cell;

		if(endX === startX 
		&& endY === startY) {
			this.ctxDrag.clearRect(item.coord.x, item.coord.y, this.cell, this.cell);
			return resolve();
		}

		const removeItem = (timeStamp) => {
			if(!isAnimation) { return }
			if(!startTime) { startTime = timeStamp } 
			const elapsed = timeStamp - startTime;
			progress = Math.min(1, elapsed / duration);

			const currentX = startX + (endX - startX) * progress;
			const currentY = startY + (endY - startY) * progress;

			this.ctxDrag.clearRect(item.coord.x - 5, item.coord.y - 5, this.cell + 10, this.cell + 10);
			this.itemRenderer.createItem(item, currentX, currentY, this.ctxDrag);

			if(progress < 1) {
				item.animationId = requestAnimationFrame((timeStamp) => removeItem(timeStamp));
			} else {
				cancelAnimationFrame(item.animationId);
				isAnimation = false;
				item.animationId = null;

				this.ctxDrag.clearRect(item.coord.x - 5, item.coord.y - 5, this.cell + 10, this.cell + 10);
				return resolve();
			}
		}
		item.animationId = requestAnimationFrame((timeStamp) => removeItem(timeStamp));	
	}

}