 class FogRendererCanvas {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	cell = GAME_CONFIG.BOARD_SIZE.CELL;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGTH;

	canvas = document.getElementById("fog-canvas");
	sizeCanvas = this.canvas.getBoundingClientRect();
	ctx = this.canvas.getContext('2d');

	eventBus = EventBus.getInstance();

	constructor() {
		this.eventBus.on(EVENTS.CMD_RENDERING_FOG, (grid) => {
			this.createFullFogOnBoard(grid);
		});
		this.eventBus.on(EVENTS.CMD_REMOVE_FOG_ON_CELL, (layerFog, layerFogNew, row, col) => {
			this.removeFogOnCell(layerFog, layerFogNew, row, col);
		});

		/*this.eventBus.on(EVENTS.CMD_REMOVE_ALL_FOG_ON_CELL, (element) => {
			this.removeFogOnCell(layerFog, layerFogNew, row, col);
		});*/
	}

	createFullFogOnBoard(grid) {
		this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
		for(let row = 0; row < this.rows; row++) {
			for(let col = 0; col < this.cols; col++) {
				const cell = grid[row][col];
				if(cell.fog.layer == 0 ) { continue }
				const x = col * this.cell;
				const y = row * this.cell;	

				let opacity = this.getOpacityFog(cell.fog.layer);

				this.ctx.fillStyle = `rgba(166, 81, 236, ${opacity})`;
				this.ctx.fillRect(x, y, this.cell, this.cell);
				this.ctx.strokeStyle = 'grey';
				this.ctx.strokeRect(x, y, this.cell, this.cell);
			}
		}
	}

	getOpacityFog(layer) {
		const opacityMin = 0.7;
		if(layer >= 4) { return 1; } 
		if(layer > 0) {
			return opacityMin + (layer - 1) / 10;
		}
		if(layer == 0) { return 0; }
		return opacityMin;
	}

	removeFogOnCell(layerFog, layerFogNew, row, col) {
		const x = col * this.cell;
		const y = row * this.cell;
		let opacity = this.getOpacityFog(layerFog);
		let opacityNew = this.getOpacityFog(layerFogNew);

		//this.ctx.clearRect(x, y, this.cell, this.cell);

		let isAnimation = true;
		let animationId = null

		let startTime = null;
		const duration = 1000;
		let progress = 0;

		const remove = (timeStamp) => {
			if(!isAnimation) { return }
			//requestAnimationFrame((timeStamp) => {
				if(!startTime) { startTime = timeStamp } 
				const elapsed = timeStamp - startTime;
				progress = Math.min(1, elapsed / duration);

				const currentAlpha = opacity + (opacityNew - opacity) * progress;

				this.ctx.clearRect(x, y, this.cell, this.cell);
				this.ctx.fillStyle = `rgba(166, 81, 236, ${currentAlpha})`;
				this.ctx.fillRect(x, y, this.cell, this.cell);
				this.ctx.strokeStyle = 'grey';
				this.ctx.strokeRect(x, y, this.cell, this.cell);
			//});

			if(progress < 1) {
				animationId = requestAnimationFrame((timeStamp) => remove(timeStamp));
			} else {
				cancelAnimationFrame(animationId);
				isAnimation = false;
				animationId = null;
			}
		}
		animationId = requestAnimationFrame((timeStamp) => remove(timeStamp));
	}
	

}
