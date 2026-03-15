class FlyItem {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGTH;

	centerWidth = (document.querySelector('.viewport-container')).clientWidth/2 -  this.boardWidth/2;

	animatedFlying = null;
	animatedRemove = null;

	constructor(manager, type, top) {
		this.manager = manager;
		this.createFlyItem(type, top);
	}

	createFlyItem(type, top) {
		const containerItem = document.querySelector('.fly-container');
		// const item = document.createElement('div');

		const item = document.createElement('img');
		item.className = 'fly-item';
		item.dataset.name = 'fly-item';
		item.dataset.type = `${type}`;
		item.style.width = `${this.boardWidth/this.cols}px`;

		const pic = type == 'flowers' ? items.flyItem.flowers.pic : items.flyItem.water.pic;

		item.src = `${pic}`;
		item.style.backgroundColor = 'transparent';
		item.draggable = false

		// item.textContent = `${pic}`;
		// const color = type == 'flowers' ? 'yellow' : 'blue';
		// item.style.color = `${color}`;

		item.style.left = '0';
		item.style.top = `${top}px`;

		containerItem.appendChild(item);
		
		this.flyingItem(item);
		this.addListenerClick(item);
	}

	flyingItem(element) {
		let time = GAME_CONFIG.ANIMATIONS.TIME_FLY_ITEM_TRANSITION; //40;
		void element.offsetWidth //это ВАЖНО, без этого не работает
		element.style.transition = `left ${time}s linear`;
		element.style.left = `${this.boardWidth}px`;

		this.animatedFlying = () => {
			element.removeEventListener('transitionend', this.animatedFlying)
			if(element) { element.remove() }
		}
		element.addEventListener('transitionend', this.animatedFlying)
	}

	removeFlyItem(element, row, col) {
		return new Promise((resolve, reject) => {
			const time = GAME_CONFIG.ANIMATIONS.TIME_PUT_FlY_ITEM;

			element.style.transition = `left ${time}s ease-in-out, top ${time}s ease-in-out`
			element.style.left = `${this.boardWidth/this.cols  * col + this.boardWidth/this.cols * 0.4 /*+ this.centerWidth*/}px`;
			element.style.top  = `${this.boardHeight/this.rows * row + this.boardHeight/this.rows * 0.4}px`;

			this.animatedRemove = () => {
				element.removeEventListener('transitionend', this.animatedRemove)
				element.remove();
				resolve();
			}
			element.addEventListener('transitionend', this.animatedRemove)
		})
	}

	addListenerClick(element) {
		const clickOnFlyItem = (e) => {
			element.removeEventListener('pointerdown', clickOnFlyItem);
			element.removeEventListener('transitionend', this.animatedFlying)
			const type = element.dataset.type;

			let elementsFromPoint = document.elementsFromPoint(e.clientX, e.clientY);
			for(let i = 0; i < elementsFromPoint.length; i++) {
				let elementDiv = elementsFromPoint[i];
				if(elementDiv.dataset.name == 'cell' ||
				elementDiv.dataset.name == 'landscape') {

					const place = this.manager.findClearCellForFlyItem(elementDiv.dataset.row, elementDiv.dataset.col)//[0];
					this.removeFlyItem(element, place.row, place.col)
						.then(() => {
							this.manager.createGiftFromFlyItem(type, 0, place.row, place.col)
						})
					break;
				}
			}
		}
		element.addEventListener('pointerdown', clickOnFlyItem);
	}
}