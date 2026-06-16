 class FogRendererCanvas {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	cell = GAME_CONFIG.BOARD_SIZE.CELL;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGHT;

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
	}


	createFogInCell(x, y, opacity) {
		if(opacity === 0) { return }
		this.ctx.fillStyle = `rgba(166, 81, 236, ${opacity})`;
		this.ctx.fillRect(x, y, this.cell, this.cell);
		this.ctx.strokeStyle = 'grey';
		this.ctx.strokeRect(x, y, this.cell, this.cell);
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
				this.createFogInCell(x, y, opacity);
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

		let isAnimation = true;
		let animationId = null

		let startTime = null;
		const duration = 1000;
		let progress = 0;

		const remove = (timeStamp) => {
			if(!isAnimation) { return }
			if(!startTime) { startTime = timeStamp } 
			const elapsed = timeStamp - startTime;
			progress = Math.min(1, elapsed / duration);

			const currentAlpha = opacity + (opacityNew - opacity) * progress;

			this.ctx.clearRect(x, y, this.cell, this.cell);
			this.createFogInCell(x, y, currentAlpha);
			this.createFogCounter(x, y, layerFogNew, currentAlpha);

			if(progress < 1) {
				animationId = requestAnimationFrame((timeStamp) => remove(timeStamp));
			} else {
				cancelAnimationFrame(animationId);
				isAnimation = false;
				animationId = null;

				this.ctx.clearRect(x, y, this.cell, this.cell);
				this.createFogInCell(x, y, opacityNew);
			}
		}
		animationId = requestAnimationFrame((timeStamp) => remove(timeStamp));
	}
	
	createFogCounter(x, y, layer) {
		let pi = Math.PI;
		const radius = this.cell * 0.25;
		const centerX = x + radius + 1;
		const centerY = y + radius + 1;

		const gradient = this.ctx.createRadialGradient(
						centerX, centerY, radius,
						centerX, centerY, radius-5);
		gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
		gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		this.ctx.beginPath();
		this.ctx.lineWidth = 1;
		//this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
		this.ctx.fillStyle = gradient;
		this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
	
		this.ctx.arc(centerX, centerY, radius, 0, 2*pi, true);
		this.ctx.stroke();
		this.ctx.fill();

		this.ctx.font = "10px Times New Roman, monospace";
		this.ctx.fillStyle = "rgba(255, 255, 255, 1)";

		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(`${layer}`,  centerX, centerY);
	}
}
