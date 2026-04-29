class ItemRenderer {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGTH;
	
	itemElementForSave = null;
	mergeCounter = null;

	eventBus = EventBus.getInstance();

	constructor() {
		/*this.eventBus.on(EVENTS.CMD_RENDERING_ITEM, (item) => {
			this.createItem(item);
		})*/

		/*this.eventBus.on(EVENTS.CMD_RENDERING_SHOW_ITEM_ON_BOARD, (currentElement, row, col) => {
			this.showPutItemOnBoard(currentElement, row, col);
		})*/

		this.eventBus.on(EVENTS.CMD_RENDERING_PLACE_ITEM_ON_BOARD, (currentElement, row, col) => {
			this.placeItemOnBoardForBeginGame(currentElement, row, col);
		})

		/*this.eventBus.on(EVENTS.CMD_RENDERING_SHOW_ITEM_ON_BOARD_AFTER_MERGE, (itemElement, fromRow, fromCol, row, col) => {
			this.showPutItemOnBoardAfterMerge(itemElement, fromRow, fromCol, row, col);
		})*/


		/*this.eventBus.on(EVENTS.CMD_RENDERING_SHOW_BEFORE_REMOVE_ITEM, (coordCenter, element, resolve) => {
			return this.showBeforeRemoveItem(coordCenter, element, resolve);
		})*/


		/*this.eventBus.on(EVENTS.CMD_RENDERING_REMOVE_ITEM, (element) => {
			this.removeItem(element);
		})*/

		this.eventBus.on(EVENTS.CMD_RENDERING_ADD_HIGHLIGHTING_ITEM, (arrItems) => {
			this.addHighlightingItems(arrItems);
		})
		this.eventBus.on(EVENTS.CMD_RENDERING_REMOVE_HIGHLIGHTING_ITEM, (arrItems) => {
			this.removeHighlightingItems(arrItems);
		})
		this.eventBus.on(EVENTS.CMD_RENDERING_CREATE_MERGE_COUNTER, (element, count) => {
			this.createMergeCounter(element, count);
		})
		this.eventBus.on(EVENTS.CMD_RENDERING_REMOVE_MERGE_COUNTER, () => {
			this.removeMergeCounter();
		})

	}

	createItem(itemGame) {
		const containerItem = document.querySelector('.item-container');
		const item = document.createElement('div');
		item.className = 'item';
		item.id = `item-${itemGame.id}`;
		item.dataset.name = 'item';
		item.dataset.id = `${itemGame.id}`;
		item.textContent = `${itemGame.pic}`;
		item.style.setProperty(`--after-content`, `"${itemGame.pic}"`);
		item.style.width = `${this.boardWidth/this.cols}px`;
		containerItem.appendChild(item);

		itemGame.element = item;
	}

	placeItemOnBoardForBeginGame(itemElement, row, col) {
		itemElement.style.left = `${this.boardWidth/this.cols * col}px`;
		itemElement.style.top = `${this.boardHeight/this.rows * row}px`;
	}

	showPutItemOnBoardAfterMerge(itemElement, fromRow, fromCol, row, col) {
		let time = GAME_CONFIG.ANIMATIONS.TIME_PUT_ITEM_ON_BOARD_AFTER_MERGE_TRANSITION;

		this.placeItemOnBoardForBeginGame(itemElement, fromRow, fromCol);

		if(this.boardWidth/this.cols  * fromCol == this.boardWidth/this.cols  * col
		&& this.boardHeight/this.rows * fromRow == this.boardHeight/this.rows * row) {
			return;
		}

		setTimeout(() => {
			this.showPutItemOnBoard(itemElement, row, col, time);
		}, time);
	}


	showPutItemOnBoard(currentElement, row, col, time = GAME_CONFIG.ANIMATIONS.TIME_PUT_ITEM_ON_BOARD_TRANSITION) {
		const elementStartX = Number(currentElement.style.left.split('px')[0]);
		const elementStartY = Number(currentElement.style.top.split('px')[0]);

		if(elementStartX == this.boardWidth/this.cols  * col 
		&& elementStartY == this.boardHeight/this.rows * row) { return }

		currentElement.style.transition = `left ${time}s ease-in-out, top ${time}s ease-in-out`
		currentElement.style.left = `${this.boardWidth/this.cols  * col}px`;
		currentElement.style.top  = `${this.boardHeight/this.rows * row}px`;

		const transitionNone = (event) => {
			currentElement.style.transition = 'none';
			currentElement.removeEventListener('transitionend', transitionNone);
		}
		currentElement.addEventListener('transitionend', transitionNone);
	}


	showBeforeRemoveItem(coordCenter, element, resolve) {
		//return new Promise((resolve, reject) => {
			const centerElement = document.getElementById(`cell-${coordCenter.row}-${coordCenter.col}`)

			let time = GAME_CONFIG.ANIMATIONS.TIME_REMOVE_ITEM_TRANSITION;

			const elementStartX = Number(element.style.left.split('px')[0]);
			const elementStartY = Number(element.style.top.split('px')[0]);

			const centerElementX = Math.floor(this.boardWidth/this.cols  * coordCenter.col);
			const centerElementY = Math.floor(this.boardHeight/this.rows * coordCenter.row);

			if(elementStartX == centerElementX 
			&& elementStartY == centerElementY) {
				setTimeout(() => {
					element.remove();
					return resolve();
				}, time * 1000)
			}

			element.style.transition = `left ${time}s ease-in-out, top ${time}s ease-in-out`;
			element.style.left = `${centerElementX}px`;
			element.style.top = `${centerElementY}px`;
			
			element.addEventListener('transitionend', (event) => {
				element.remove();
				return resolve();
			})
		//})
	}

	removeItem(element) { //при обновлении не работает анимация
		if(element) { 
			const time = 1;
			element.classList.add('magic-effect');
			element.dataset.name = 'magic';
			element.textContent = "*";
			element.style.setProperty(`--after-content`, `"*"`);
			element.style.border = 'none';
			element.style.transition = `opacity ${time}s ease-in-out, transform  ${time}s ease-in-out`;
			element.style.opacity = '0.01'
			element.style.transform = 'scale(5)';

			element.addEventListener('transitionend', (event) => {
				element.remove(); 
			})
		}
	}

	addHighlightingItems(arrItems) {
		arrItems.forEach(item => {
			const itemElement = document.getElementById(`item-${item.id}`);
			if(itemElement.classList.contains('highlight')) { return }
			itemElement.classList.add('highlight');
		})
	}

	removeHighlightingItems(arrItems) {
		arrItems.forEach(item => {
			const itemElement = document.getElementById(`item-${item.id}`);
			if(!itemElement.classList.contains('highlight')) { return }
			itemElement.classList.remove('highlight');
		})
	}

	createMergeCounter(element, count) {
		if(this.mergeCounter) {
			this.mergeCounter.textContent = `${count}`;
			return;
		}
		this.mergeCounter = document.createElement('div');
		this.mergeCounter.textContent = `${count}`
		this.mergeCounter.className = 'merge-counter';
		element.appendChild(this.mergeCounter);
	}

	removeMergeCounter() {
		if(!this.mergeCounter) { return }
		this.mergeCounter.remove();
		this.mergeCounter = null;
	}
}


