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
	manager = null;
	//baseStrategy = new ClickOnViewportStrategy();
	strategies = null;
	strategyInfo = null;
	currentStrategy = null;

	timerDblClick = null;
	timerLongClick = null;

	viewport = document.querySelector('.viewport-container');
	gamePlace = document.querySelector('.game-container');

	constructor(manager) {
		super(manager);
		this.manager = manager;
		this.addListenerMouseAndTouct();
		this.strategies = {
			item:          new ItemDragStrategy(this),
			itemClick:     new ItemCLickStrategy(this),
			//itemDblClick:  new ItemDblCLickStrategy(this), //это нужно, просто сейчас не используется
			itemLongClick: new ItemLongCLickStrategy(this),
			board:         new BoardPanoramaStrategy(this)
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
			if(currentElement.dataset.name == 'item') {
				const delayLongClick = 500;
				return {
					strategy: this.strategies.item,
					element: currentElement,
					type: 'item',
					itemStartX: currentElement.getBoundingClientRect().left,
					itemStartY: currentElement.getBoundingClientRect().top,
					timeStart: Date.now(),
				}
			}

			if(currentElement.dataset.name == 'fog'
			|| currentElement.dataset.name == 'cell'
			|| currentElement.dataset.name == 'landscape') {
				return {
					strategy: this.strategies.board,
					element: currentElement,
					type: 'board'
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

		const minDistance = 1;
		const distance = Math.floor(Math.sqrt(
				(this.strategyInfo.itemStartX - this.strategyInfo.element.getBoundingClientRect().left)**2 + 
				(this.strategyInfo.itemStartY - this.strategyInfo.element.getBoundingClientRect().top)**2));

		if(distance > minDistance) { return this.strategyInfo }

		/*const delayDblClick = 300; //это нужно, просто сейчас не используется
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
		}*/

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
		this.strategy.end(e.clientX, e.clientY);
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
		this.strategy.end(clientX, clientY);
		this.elementHasListener.removeEventListener('touchmove', this.onTouchMove);
		this.elementHasListener.removeEventListener('touchend', this.onTouchEnd);
		this.elementHasListener.removeEventListener('touchcancel', this.onTouchEnd);
	}

	removeListenerMouseAndTouct() {
		this.elementHasListener.removeEventListener('mousedown', this.onMouseDown);
		this.elementHasListener.removeEventListener('touchstart', this.onTouchStart);
	}
	
}