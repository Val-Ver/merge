 class FogRenderer {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGTH;

	containerEffect = document.querySelector('.effect-container')
	fogElementForSave = null;

	constructor() {}

	createFogDiv(layer, row, col) {
		const fog = document.createElement('div');
		//const fog = document.createElement('img');

		fog.className = 'fog';
		fog.id = `fog-${row}-${col}`;
		fog.dataset.cell = `fog-${row}-${col}`;
		fog.dataset.name = 'fog';
		fog.style.width = `${this.boardWidth/this.cols}px`;
		fog.style.left = `${this.boardWidth/this.cols * col}px`;
		fog.style.top = `${this.boardHeight/this.rows * row}px`;

		fog.style.backgroundImage = 'url(image/effects/fog/fog.jpeg)';


		// fog.src = 'image/effects/fog/fog.jpeg';
		// fog.style.backgroundColor = 'transparent';
		// fog.draggable = false

		let opacity = this.getOpacityFog(layer);
		fog.style.opacity = `${opacity}`

		this.containerEffect.appendChild(fog);
		this.fogElementForSave = fog;
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

	createFogCounter(element, layer) {
		const fogCounter = document.createElement('div');
		fogCounter.id = `layer-${element.id}`;
		fogCounter.textContent = `${layer-1}`
		fogCounter.className = 'layer-fog';
		element.appendChild(fogCounter);
		return fogCounter
	}

	removeFogOnCell(layerFog, element) {
		let time = GAME_CONFIG.ANIMATIONS.TIME_REMOVE_FOG_TRANSITION;
		const fogCounter = this.createFogCounter(element, layerFog);
		let opacity = this.getOpacityFog(layerFog - 1);

		if(Number(element.style.opacity) == opacity) {
			setTimeout(() => {
				fogCounter.remove();
			}, time)
			return;
		} 

		element.style.transition = `opacity ${time}s ease-in-out`;
		element.style.opacity = `${opacity}`

		element.addEventListener('transitionend', (event) => {
			fogCounter.remove();
			if(layerFog - 1 == 0) { element.remove(); }
		})
	}
	
	removeAllFogOnCell(element) {
		let time = GAME_CONFIG.ANIMATIONS.TIME_REMOVE_FOG_TRANSITION;
		element.style.transition = `opacity ${time}s ease-in-out`;
		element.style.opacity = '0';

		element.addEventListener('transitionend', (event) => {
			element.remove();
		})
	}

	createMagicWayEffect(fromRow, fromCol, row, col) {
		// const magicWay = document.createElement('div');
		const magicWay = document.createElement('img');

		magicWay.className = 'magic-effect';
		magicWay.style.width = `${this.boardWidth/this.cols}px`;
		// magicWay.style.backgroundImage = 'url(image/effects/magic_way.png)';
		// magicWay.textContent = "*";

		magicWay.src = 'image/effects/magic_way.png';
		magicWay.style.backgroundColor = 'transparent';
		magicWay.draggable = false

		magicWay.style.left = `${this.boardWidth/this.cols * fromCol}px`;
		magicWay.style.top = `${this.boardHeight/this.rows * fromRow}px`;

		// magicWay.style.left = `${this.boardWidth/this.cols  * fromCol + this.boardWidth/this.cols  * 0.4}px`; //почему центр не в половине???
		// magicWay.style.top  = `${this.boardHeight/this.rows * fromRow + this.boardHeight/this.rows * 0.4}px`;
		this.containerEffect.appendChild(magicWay);

		return this.removeMagicWayEffect(magicWay, row, col);
	}

	removeMagicWayEffect(element, row, col) {
		let time = GAME_CONFIG.ANIMATIONS.TIME_REMOVE_MAGIC_WAY_TRANSITION;
		const distanceX = Number(element.style.left.split('px')[0]) - (this.boardWidth/this.cols  * col + this.boardWidth/this.cols)
		const distanceY = Number(element.style.top.split('px')[0])  - (this.boardHeight/this.rows * row + this.boardHeight/this.rows)
		const distance = Math.sqrt(distanceX**2 + distanceY**2)		

		if(distance > GAME_CONFIG.BOARD_SIZE.CELL) {
			time *= Math.floor(distance / GAME_CONFIG.BOARD_SIZE.CELL)
		}
		return new Promise((resolve, reject) => {
			void element.offsetWidth //это ВАЖНО, без этого не работает

			element.style.transition = `left ${time}s ease-in-out, 
						    top ${time}s ease-in-out,
						    opacity ${time}s ease-in-out,
						    transform  ${time}s ease-in-out`

			element.style.left = `${this.boardWidth/this.cols  * col }px`;
			element.style.top  = `${this.boardHeight/this.rows * row }px`;

			// element.style.left = `${this.boardWidth/this.cols  * col + this.boardWidth/this.cols * 0.2}px`;
			// element.style.top  = `${this.boardHeight/this.rows * row + this.boardHeight/this.rows * 0.2}px`;

			// element.style.left = `${this.boardWidth/this.cols  * col + this.boardWidth/this.cols  * 0.4}px`;
			// element.style.top  = `${this.boardHeight/this.rows * row + this.boardHeight/this.rows * 0.4}px`;

			element.style.opacity = '0.05'
			element.style.transform = 'scale(2)';

			element.addEventListener('transitionend', (event) => {
				element.remove(); 
				resolve();
			})
		})
	}
}