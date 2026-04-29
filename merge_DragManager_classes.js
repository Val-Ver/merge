class BaseDragManager {
	manager = null;
	strategies = null;

	constructor(manager) {
		this.manager = manager;
	}

	addListenerMouseAndTouct() {
		throw new Error('start() нужно написать');
	}

	onMouseDown = (e) => {
		throw new Error('start() нужно написать');
	}

	onMouseMove = (e) => {
		throw new Error('move() нужно написать');
	}

	onMouseUp = (e) => {
		throw new Error('end() нужно написать');
	}

	onTouchStart = (e) => {
		throw new Error('start() нужно написать');
	}

	onTouchMove = (e) => {
		throw new Error('move() нужно написать');
	}

	onTouchEnd = (e) => {
		throw new Error('end() нужно написать');
	}
}

class DragManagerForGame extends BaseDragManager {
	itemManager = null;
	dragonManager = null;

	strategies = null;
	strategyInfo = null;
	currentStrategy = null;

	timerDblClick = null;
	timerLongClick = null;

	viewport = document.querySelector('.viewport-container');
	gamePlace = document.querySelector('.game-container');

	constructor(itemHandler, managerFlyer) {
		super(itemHandler, managerFlyer);
		this.itemHandler = itemHandler;
		this.flyerManager = managerFlyer;

		this.addListenerMouseAndTouct();
		this.strategies = {
			item:          new ItemDragStrategy(this.itemHandler),
			itemClick:     new ItemCLickStrategy(this.itemHandler),
			itemDblClick:  new ItemDblCLickStrategy(this.itemHandler), 
			itemLongClick: new ItemLongCLickStrategy(this.itemHandler),
			board:         new BoardPanoramaStrategy(this.itemHandler),
			flyer:	       new FlyerDragStrategy(this.flyerManager), // из-за этого надо делать класс общим в игре
			flyerClick:   new FlyerCLickStrategy(this.flyerManager) // не реализована
		}
	}

	addListenerMouseAndTouct() {
		this.viewport.addEventListener('mousedown', this.onMouseDown);
		this.viewport.addEventListener('touchstart', this.onTouchStart);
	}
	
	determineStrategyStart(clientX, clientY) {
		let elementsFromPoint = document.elementsFromPoint(clientX, clientY);
		for(let i = 0; i < elementsFromPoint.length; i++) {
			let currentElement = elementsFromPoint[i];
			if(currentElement.dataset.name == 'fly-item') { return null }

			if(currentElement.dataset.name == 'flyer') {
				return {
					strategy: this.strategies.flyer,
					element: currentElement,
					type: 'flyer',
					itemStartX: currentElement.getBoundingClientRect().left,
					itemStartY: currentElement.getBoundingClientRect().top
				}
			}


			if(currentElement.id == 'board-canvas') {
				const boardCoord = this.itemHandler.getCoordBoard(currentElement, clientX, clientY)
				const row = boardCoord.row;
				const col = boardCoord.col;

				const grid = this.itemHandler.itemPlacer.gameBoard.grid;
				let name = '';

				if(grid[row][col].landscape) {
					name = 'landscape';
				} else if(grid[row][col].fog.layer > 0) {
					name = 'fog';
				} else if(grid[row][col].item) { 
					name = 'item';
					const fakeElement = {
						dataset: {
							name: name,
							row: row,
							col: col,
							id: grid[row][col].item.id,
						},
						element: currentElement,
						grid: grid,
						coord: grid[row][col].item.coord, 
						item: grid[row][col].item,
					}

					const delayLongClick = 500;
					return {
						strategy: this.strategies.item,
						element: fakeElement,
						type: 'item',
						itemStartX: grid[row][col].item.coord.x,
						itemStartY: grid[row][col].item.coord.y,
						timeStart: Date.now(),
					}


				} else {
					name = 'cell';
				}

				const fakeElement = {
					dataset: {
						name: name,
						row: row,
						col: col,
					}
				}

				return {
					strategy: this.strategies.board,
					element: fakeElement,
					type: 'board',
					
				}

			}
		}
		return null;
	}

	onMouseDown = (e) => {
		this.strategyInfo = this.determineStrategyStart(e.clientX, e.clientY);
		if(!this.strategyInfo) { return }

		this.currentStrategy = this.strategyInfo.strategy;
		this.curretnElement = this.strategyInfo.element;
		
		this.currentStrategy.start(e.clientX, e.clientY, this.strategyInfo.element);

		this.gamePlace.addEventListener('mousemove', this.onMouseMove);
		this.gamePlace.addEventListener('mouseup', this.onMouseUp);
	}

	onMouseMove = (e) => {
		this.currentStrategy.move(e.clientX, e.clientY);
	}

	determineStrategyEnd(clientX, clientY) {
		if(this.strategyInfo.type === 'board') { return this.strategyInfo }
		if(this.strategyInfo.type === 'flyer') { 
			const minDistance = 1;
			const distance = Math.floor(Math.sqrt(
					(this.strategyInfo.itemStartX - this.strategyInfo.element.getBoundingClientRect().left)**2 + 
					(this.strategyInfo.itemStartY - this.strategyInfo.element.getBoundingClientRect().top)**2));

			if(distance > minDistance) { return this.strategyInfo }

			return {
				strategy: this.strategies.flyerClick,
				element:  this.strategyInfo.element,
				type: 'flyer-Click'
			}
		 }

		const minDistance = 1;
		const distance = Math.floor(Math.sqrt(
				(this.strategyInfo.itemStartX - this.strategyInfo.element.item.coord.x)**2 + 
				(this.strategyInfo.itemStartY - this.strategyInfo.element.item.coord.y)**2));

		if(distance > minDistance) { return this.strategyInfo }

		const delayDblClick = 300; 
		if(this.timerDblClick) {
			clearTimeout(this.timerDblClick);
			this.timerDblClick = null;
			return {
				strategy: this.strategies.itemDblClick,
				element:  this.strategyInfo.element,
				type: 'item-DblClick'
			}  
		} else {
			this.timerDblClick = setTimeout(() => {
				this.timerDblClick = null;
			}, delayDblClick)
		}

		const delayLongClick = 500;
		const timePeriod = Date.now() - this.strategyInfo.timeStart;
		if(timePeriod >= delayLongClick) {
			return {
				strategy: this.strategies.itemLongClick,
				element:  this.strategyInfo.element,
				type: 'item-LongClick'
			}
		}

		return {
			strategy: this.strategies.itemClick,
			element:  this.strategyInfo.element,
			type: 'item-click'
		}

 	}

	onMouseUp = (e) => {
		this.strategyInfo = this.determineStrategyEnd(e.clientX, e.clientY);

		if(this.strategyInfo) { 
			this.currentStrategy = this.strategyInfo.strategy;
			this.currentStrategy.end(e.clientX, e.clientY, this.strategyInfo.element);
		}

		this.gamePlace.removeEventListener('mousemove', this.onMouseMove);
		this.gamePlace.removeEventListener('mouseup', this.onMouseUp);
	}
	
	onTouchStart = (e) => {
		e.preventDefault();

		if(e.touches.length === 2) {
			this.currentStrategy = new BoardZoomStrategy(this);
			this.currentStrategy.start();
		} else {
			let clientX = e.touches[0].clientX
			let clientY = e.touches[0].clientY

			this.strategyInfo = this.determineStrategyStart(clientX, clientY);
			if(!this.strategyInfo) { return }

			this.currentStrategy = this.strategyInfo.strategy;
			this.curretnElement = this.strategyInfo.element;
		
			this.currentStrategy.start(clientX, clientY, this.strategyInfo.element);
		}
		this.gamePlace.addEventListener('touchmove', this.onTouchMove);
		this.gamePlace.addEventListener('touchend', this.onTouchEnd);
		this.gamePlace.addEventListener('touchcancel', this.onTouchEnd);
	}

	onTouchMove = (e) => {
		e.preventDefault();
		let clientX = e.touches[0].clientX
		let clientY = e.touches[0].clientY

		this.currentStrategy.move(clientX, clientY);
	}

	onTouchEnd = (e) => {
		e.preventDefault();
		let clientX = e.changedTouches[0].clientX
		let clientY = e.changedTouches[0].clientY

		this.strategyInfo = this.determineStrategyEnd(clientX, clientY);

		if(this.strategyInfo) { 
			this.currentStrategy = this.strategyInfo.strategy;
			this.currentStrategy.end(clientX, clientY, this.strategyInfo.element);
		}

		this.gamePlace.removeEventListener('touchmove', this.onTouchMove);
		this.gamePlace.removeEventListener('touchend', this.onTouchEnd);
		this.gamePlace.removeEventListener('touchcancel', this.onTouchEnd);
	}
}

class DragManagerForShop extends BaseDragManager {
	manager = null;
	strategy = null;
	elementHasListener = null;

	constructor(manager, element) {
		super(manager);
		this.manager = manager;
		this.elementHasListener = element;
		this.strategy = new ShopPanoramaStrategy(this, this.elementHasListener);
		this.addListenerMouseAndTouct();
	}

	addListenerMouseAndTouct() {
		this.elementHasListener.addEventListener('mousedown', this.onMouseDown);
		this.elementHasListener.addEventListener('touchstart', this.onTouchStart);
	}

	onMouseDown = (e) => {
		this.strategy.start(e.clientX, e.clientY);
		this.elementHasListener.addEventListener('mousemove', this.onMouseMove);
		this.elementHasListener.addEventListener('mouseup', this.onMouseUp);
	}

	onMouseMove = (e) => {
		this.strategy.move(e.clientX, e.clientY);
	}

	onMouseUp = (e) => {
		this.strategy.end(e, e.clientX, e.clientY);
		this.elementHasListener.removeEventListener('mousemove', this.onMouseMove);
		this.elementHasListener.removeEventListener('mouseup', this.onMouseUp)
	}

	onTouchStart = (e) => {
		e.preventDefault();
		let clientX = e.touches[0].clientX
		let clientY = e.touches[0].clientY
		this.strategy.start(clientX, clientY);
		this.elementHasListener.addEventListener('touchmove', this.onTouchMove);
		this.elementHasListener.addEventListener('touchend', this.onTouchEnd);
		this.elementHasListener.addEventListener('touchcancel', this.onTouchEnd);
	}

	onTouchMove = (e) => {
		e.preventDefault();
		let clientX = e.touches[0].clientX
		let clientY = e.touches[0].clientY
		this.strategy.move(clientX, clientY);
	}

	onTouchEnd = (e) => {
		e.preventDefault();
		let clientX = e.changedTouches[0].clientX
		let clientY = e.changedTouches[0].clientY
		this.strategy.end(e, clientX, clientY);
		this.elementHasListener.removeEventListener('touchmove', this.onTouchMove);
		this.elementHasListener.removeEventListener('touchend', this.onTouchEnd);
		this.elementHasListener.removeEventListener('touchcancel', this.onTouchEnd);
	}

	removeListenerMouseAndTouct() {
		this.elementHasListener.removeEventListener('mousedown', this.onMouseDown);
		this.elementHasListener.removeEventListener('touchstart', this.onTouchStart);
	}
	
}