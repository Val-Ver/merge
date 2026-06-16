class MagicWayRendererCanvas {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	cell = GAME_CONFIG.BOARD_SIZE.CELL;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGHT;

	eventBus = EventBus.getInstance();

	constructor() {
		this.eventBus.on(EVENTS.CMD_RENDERING_CREATE_MAGIC_WAY_EFFECT, (fromRow, fromCol, arrCell) => {
			return this.magicWayEffect(fromRow, fromCol, arrCell);
		});
	}

	createCanvas() {
		const containerMagicWay = document.querySelector('.container-for-panoram');
		const canvas = document.createElement('canvas');
		canvas.className = 'magic-way-canvas';
		canvas.width = '2400';
		canvas.height = '1600';
			
		containerMagicWay.appendChild(canvas);
		return canvas;
	}

	createMagicWayEffect(ctx, x, y, fontSize, opacity) {
		const textX = x  + this.cell / 2;
		const textY = y  + this.cell / 2;

		ctx.font = `${fontSize}px Times New Roman, monospace`;
		ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;

		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText('*', textX, textY);
	}

	magicWayEffect(fromRow, fromCol, arrCell) {
		const canvas = this.createCanvas();
		const ctx = canvas.getContext('2d');

		let isAnimation = true;
		let animationId = null;

		let startTime = null;
		let progressSumm = 0;

		const startX = fromCol * this.cell;
		const startY = fromRow * this.cell;

		const fontSizeStart = 0;
		const fontSizeEnd = 50;

		let opacityStart = 1;
		let opacityEnd = 0;

		const indent = 5;

		for(let i = 0; i < arrCell.length; i++) {
			arrCell[i].endX = arrCell[i].col * this.cell;
			arrCell[i].endY = arrCell[i].row * this.cell;

			arrCell[i].duration = GAME_CONFIG.ANIMATIONS.TIME_REMOVE_MAGIC_WAY_TRANSITION * 1000;
			const distanceX = startX - (arrCell[i].endX + this.cell);
			const distanceY = startY - (arrCell[i].endY + this.cell);
			arrCell[i].distance = Math.sqrt(distanceX**2 + distanceY**2);	

			if(arrCell[i].distance > GAME_CONFIG.BOARD_SIZE.CELL) {
				arrCell[i].duration *= Math.floor(arrCell[i].distance / GAME_CONFIG.BOARD_SIZE.CELL);
			}
		}

		const magicWay = (timeStamp) => {
			if(!isAnimation) { return }
			if(!startTime) { startTime = timeStamp } 
			const elapsed = timeStamp - startTime;

			progressSumm = 0;
			ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);

			for(let i = 0; i < arrCell.length; i++) {
				arrCell[i].progress = Math.min(1, elapsed / arrCell[i].duration);
				progressSumm += arrCell[i].progress;

				if(arrCell[i].clear) { continue }

				const currentX = startX + (arrCell[i].endX - startX) * arrCell[i].progress;
				const currentY = startY + (arrCell[i].endY - startY) * arrCell[i].progress;

				const opacity = opacityStart + (opacityEnd - opacityStart) * arrCell[i].progress;
				const fontSize = fontSizeStart + (fontSizeEnd - fontSizeStart) * arrCell[i].progress;

				this.createMagicWayEffect(ctx, currentX, currentY, fontSize, opacity);

				if(arrCell[i].progress >= 1) {
					arrCell[i].clear = true;
					this.eventBus.emit(EVENTS.CMD_CLEAR_FOG_AFTER_MAGIC_WAY, arrCell[i]);
				}
			}
			
			if(progressSumm < arrCell.length) {
				animationId = requestAnimationFrame((timeStamp) => magicWay(timeStamp));
			} else {
				cancelAnimationFrame(animationId);
				isAnimation = false;
				animationId = null;
				ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);	
				canvas.remove();			
			}
		}
		animationId = requestAnimationFrame((timeStamp) => magicWay(timeStamp));
	}


/******************************************************************************************/
// для одного magic way

	magicWayEffect1(fromRow, fromCol,  row, col, resolve) {
		let isAnimation = true;
		let animationId = null;

		let startTime = null;
		let progress = 0;

		const startX = fromCol * this.cell;
		const startY = fromRow * this.cell;

		const endX = col * this.cell;
		const endY = row * this.cell;

		const fontSizeStart = 0;
		const fontSizeEnd = 50;

		let opacityStart = 1;
		let opacityEnd = 0;

		let duration = GAME_CONFIG.ANIMATIONS.TIME_REMOVE_MAGIC_WAY_TRANSITION * 1000;
		const distanceX = startX - (endX + this.cell);
		const distanceY = startY - (endY + this.cell);
		const distance = Math.sqrt(distanceX**2 + distanceY**2);	

		if(distance > GAME_CONFIG.BOARD_SIZE.CELL) {
			duration *= Math.floor(distance / GAME_CONFIG.BOARD_SIZE.CELL)
		}

		const indent = 5;

		const magicWay = (timeStamp) => {
			if(!isAnimation) { return }
			if(!startTime) { startTime = timeStamp } 
			const elapsed = timeStamp - startTime;
			progress = Math.min(1, elapsed / duration);

			const currentX = startX + (endX - startX) * progress;
			const currentY = startY + (endY - startY) * progress;

			const opacity = opacityStart + (opacityEnd - opacityStart) * progress;
			const fontSize = fontSizeStart + (fontSizeEnd - fontSizeStart) * progress;

			//this.ctx.clearRect(currentX - indent, currentY - indent, this.cell + indent*2, this.cell + indent*2);
			this.createMagicWayEffect(currentX, currentY, fontSize, opacity);

			if(progress < 1) {
				animationId = requestAnimationFrame((timeStamp) => magicWay(timeStamp));
			} else {
				cancelAnimationFrame(animationId);
				isAnimation = false;
				animationId = null;

				this.ctx.clearRect(currentX - indent, currentY - indent, this.cell + indent*2, this.cell + indent*2);
				return resolve();
			}
		}
		animationId = requestAnimationFrame((timeStamp) => magicWay(timeStamp));
	}

}