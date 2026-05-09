class BaseDragStrategy {
	dragManager = null;
	
	constructor(dragManager) {
		this.dragManager = dragManager;
	}
	
	start(e, element) {
		throw new Error('start() нужно написать');
	}

	move(e) {
		throw new Error('move() нужно написать');
	}

	end(e) {
		throw new Error('end() нужно написать');
	}	
}

class FlyerDragStrategy extends BaseDragStrategy {
	manager = null;

	currentElement = null;
	currentFlyer = null;

	offsetX = 0;
	offsetY = 0;
	elementStartX = 0;
	elementStartY = 0;

	itemsPref = [];

	isDragingItem = false;

	constructor(dragManager) {
		super(dragManager);
		this.manager = dragManager;
	}

	start(clientX, clientY, element) {
		this.isDraging = true;
		this.currentElement = element;

		this.currentFlyer = this.manager.getCurrentFlyer(this.currentElement.dataset.id);
		if(this.currentFlyer.collectGift) { this.manager.putItemOnBoard(this.currentFlyer) }

		this.elementStartX = Number(this.currentElement.style.left.split('px')[0]);
		this.elementStartY = Number(this.currentElement.style.top.split('px')[0]);

		this.offsetX = clientX - this.elementStartX;
		this.offsetY = clientY - this.elementStartY;
	}

	move(clientX, clientY) {
		if(!this.isDraging) { return }

		
		if(this.currentFlyer.mission) { this.currentFlyer.mission = false }
		this.currentFlyer.isDraging = true;

		this.currentElement.style.zIndex = '100';

		this.currentElement.style.left = (clientX - this.offsetX) +'px';
		this.currentElement.style.top = (clientY - this.offsetY) +'px';

		this.currentFlyer.route = { x: clientX - this.offsetX, y: clientY - this.offsetY }

	}

	end(clientX, clientY) {
		this.isDraging = false;

		this.currentFlyer = this.manager.getCurrentFlyer(this.currentElement.dataset.id);
		this.currentFlyer.isDraging = false;
	
		let elementsFromPoint = document.elementsFromPoint(clientX, clientY);

		const findFlyers = elementsFromPoint.filter((element) => {
			return element.dataset.name == 'flyer';
		})

		if(findFlyers.length >= 3) {
			this.manager.mergeFlyers(findFlyers);
			return;
		}

		for(let i = 0; i < elementsFromPoint.length; i++) {
			let element = elementsFromPoint[i];

			if(element.dataset.name == 'fog'
			|| element.id == 'board-canvas') {
			//|| element.dataset.name == 'landscape'
			//|| element.dataset.name == 'cell') { 
				this.manager.startPatrulFlyerAfterDraging(this.currentFlyer)
				break; 
			}

			if(element.dataset.name == 'item') {
				this.manager.collectItemAfterDraging(this.currentFlyer)
				break;
			}
		}
		this.currentElement.style.zIndex = '';		
	}
}

class FlyerCLickStrategy extends BaseDragStrategy {
	manager = null;

	constructor(dragManager) {
		super(dragManager);
		this.manager = dragManager;
	}

	end(clientX, clientY, element) {
		//console.log('будет: уронить предмет')
		//реализовала на mouseDown
	}
}






class ItemDragStrategy extends BaseDragStrategy {
	manager = null;
	eventBus = EventBus.getInstance();

	currentElement = null;
	offsetX = 0;
	offsetY = 0;
	elementStartX = 0;
	elementStartY = 0;

	itemsPref = [];

	isDragingItem = false;

	constructor(manager) {
		super(manager);
		this.manager = manager;
	}

	start(clientX, clientY, element) {
		this.isDragingItem = true;
		this.currentElement = element;

		//if(!this.manager.itemRegistry.getCurrentItem(this.currentElement.dataset.id)) { return }
		//this.manager.itemRegistry.getCurrentItem(this.currentElement.dataset.id).isDraging = true;

		this.elementStartX = this.currentElement.coord.x;
		this.elementStartY = this.currentElement.coord.y;

		this.offsetX = clientX - this.elementStartX;
		this.offsetY = clientY - this.elementStartY;

		this.manager.itemPlacer.clearItemForDrag(this.currentElement.dataset.id);
	}

	move(clientX, clientY) {
		if(!this.isDragingItem) { return }

		if(!this.manager.itemRegistry.getCurrentItem(this.currentElement.dataset.id)) { return }
		this.manager.itemRegistry.getCurrentItem(this.currentElement.dataset.id).isDraging = true;

		const x = (clientX - this.offsetX);
		const y = (clientY - this.offsetY);

		this.manager.moveItem(this.currentElement.item, x, y);

		const boardCoord = this.manager.getCoordBoard(this.currentElement.element, clientX, clientY);
		const row = boardCoord.row;
		const col = boardCoord.col;

		/*const grid = this.currentElement.grid;
		if(grid[row][col].fog.layer === 0 && grid[row][col].item) {
// надо рисовать 
			this.itemsPref = this.manager.preformHighlightingItems(this.currentElement.dataset.id, grid[row][col].item.id);
			if(this.itemsPref.length > 1) {
				this.manager.createMergeCounter(this.currentElement, this.itemsPref.length);
			}
			if(this.itemsPref.length > 1) {
				this.manager.removeMergeCounter();
				this.manager.removeHighlightingItems(this.itemsPref);
			}
		}*/
	}

	end(clientX, clientY) {
		this.isDragingItem = false;
		this.itemsPref = [];
		if(!this.manager.itemRegistry.getCurrentItem(this.currentElement.dataset.id)) { return }
		this.manager.itemRegistry.getCurrentItem(this.currentElement.dataset.id).isDraging = false;
			
		const boardCoord = this.manager.getCoordBoard(this.currentElement.element, clientX, clientY);
		const row = boardCoord.row;
		const col = boardCoord.col;

		const grid = this.currentElement.grid;
		if(grid[row][col].landscape || grid[row][col].fog.layer > 0) {
			this.manager.stayBackItemOnBoard(this.currentElement.dataset.id);
			return;
		}

		if(grid[row][col].item) {
			this.manager.handleAfterDragItem(this.currentElement.dataset.id, grid[row][col].item.id);
			return;
		}

		if(!grid[row][col].landscape && !grid[row][col].fog.layer > 0 && !grid[row][col].item) {
			this.manager.handleCell(this.currentElement.dataset.id, boardCoord.row, boardCoord.col);
			return;
		}
	}
}

class ItemCLickStrategy extends BaseDragStrategy {
	manager = null;

	constructor(dragManager) {
		super(dragManager);
		this.manager = dragManager;
	}

	end(clientX, clientY, element) {
		this.manager.stayBackItemAfterClick(element.dataset.id);
		this.manager.handleItem(element.dataset.id);
	}
}

class ItemLongCLickStrategy extends BaseDragStrategy {
	manager = null;

	constructor(dragManager) {
		super(dragManager);
		this.manager = dragManager;
	}

	end(clientX, clientY, element) {
		this.manager.showInfoPanel(element.dataset.id);
	}
}

class ItemDblCLickStrategy extends BaseDragStrategy {
	manager = null;

	constructor(dragManager) {
		super(dragManager);
		this.manager = dragManager; 
	}

	end(clientX, clientY, element) {
		this.manager.stayBackItemAfterClick(element.dataset.id);
		this.manager.itemCollsFlyer(element.dataset.id); 
	}
}

class BoardPanoramaStrategy extends BaseDragStrategy {
	viewport = document.querySelector('.viewport-container');
	board = document.querySelector('.board-container');
	container = document.querySelector('.container-for-panoram');

	boardStartX = 0;
	boardStartY = 0;
	boardTranslateX = 0;
	boardTranslateY = 0;

	isDragingBoard = false;

	constructor(dragManager) {
		super(dragManager);
	}

	start(clientX, clientY, element) {
		this.isDragingBoard = true;

		this.boardStartX = clientX - this.boardTranslateX;
		this.boardStartY = clientY - this.boardTranslateY;
	}

	move(clientX, clientY) {
		if(!this.isDragingBoard) { return }

		let coordX = clientX - this.boardStartX;
		let coordY = clientY - this.boardStartY;
		let indent = 10;
				
		const minX = (this.viewport.clientWidth - this.container.offsetWidth)/2 - indent;
		const maxX = (this.container.offsetWidth - this.viewport.clientWidth)/2 + indent;

		const minY = this.viewport.clientHeight - this.container.offsetHeight - indent;
		const maxY = 0 + indent;

		this.boardTranslateX = Math.max(minX, Math.min(coordX, maxX))
		this.boardTranslateY = Math.max(minY, Math.min(coordY, maxY))


		this.container.style.transform = `translate(${this.boardTranslateX}px, ${this.boardTranslateY}px)`;
	}

	end(clientX, clientY) {
		this.isDragingBoard = false;
	}
}

class BoardZoomStrategy extends BaseDragStrategy {
	viewport = document.querySelector('.viewport-container');
	board = document.querySelector('.board-container');
	items = document.querySelector('.item-container');
	fogs = document.querySelector('.effect-container');
	flyItems = document.querySelector('.fly-container');

	boardStartX = 0;
	boardStartY = 0;
	boardTranslateX = 0;
	boardTranslateY = 0;

	isZoomBoard = false;

	constructor(dragManager) {
		super(dragManager);
	}

	start(e) {
		
	}

	move(e) {
		
	}

	end(e) {
		
	}
}

class ShopPanoramaStrategy extends BaseDragStrategy {
	currentItemsSet = null;
	place = null;

	boardStartX = 0;
	boardStartY = 0;
	boardTranslateX = 0;
	boardTranslateY = 0;

	currentElement = null;
	itemStartX = 0;
	itemStartY = 0;

	isDragingSet = false;

	constructor(dragManager, element) {
		super(dragManager);
		this.currentItemsSet = element;
		this.manager = dragManager.manager
	}

	start(clientX, clientY) {
		this.isDragingSet = true;
		this.boardStartX = clientX - this.boardTranslateX;
		this.boardStartY = clientY - this.boardTranslateY;

		let elementsFromPoint = document.elementsFromPoint(clientX, clientY);
		for(let i = 0; i < elementsFromPoint.length; i++) {
			this.currentElement = elementsFromPoint[i];
			if(this.currentElement.dataset.name === 'item') {
				this.place = document.querySelector('.shop-item');
				this.itemStartX = this.currentElement.getBoundingClientRect().left;
				this.itemStartY = this.currentElement.getBoundingClientRect().top;
				break;
			}
			if(this.currentElement.dataset.name === 'product') {
				this.place = document.querySelector('.shop');
				this.itemStartX = this.currentElement.getBoundingClientRect().left;
				this.itemStartY = this.currentElement.getBoundingClientRect().top;
				break;
			}
		}
	}

	move(clientX, clientY) {
		if(!this.isDragingSet) { return }

		let coordX = clientX - this.boardStartX;
		let coordY = clientY - this.boardStartY;

		const minX = (this.place.clientWidth - this.currentItemsSet.offsetWidth);
		const maxX = 0;

		const minY = this.place.clientHeight - this.currentItemsSet.offsetHeight;
		const maxY = 0;

		this.boardTranslateX = Math.max(minX, Math.min(coordX, maxX));
		this.boardTranslateY = Math.max(minY, Math.min(coordY, maxY));

		this.currentItemsSet.style.transform = `translate(${this.boardTranslateX}px, ${this.boardTranslateY}px)`;
	}

	end(e, clientX, clientY) {
		this.isDragingBoard = false;
		let elementsFromPoint = document.elementsFromPoint(clientX, clientY);
		for(let i = 0; i < elementsFromPoint.length; i++) {
			let element = elementsFromPoint[i];

			if(element.dataset.name === 'item'
			&& element.dataset.level === this.currentElement.dataset.level) {
				const distance = Math.floor(Math.sqrt((this.itemStartX - element.getBoundingClientRect().left)**2 + 
						(this.itemStartY - element.getBoundingClientRect().top)**2));
				if(distance === 0) {
					this.manager.manager.handleBuyItem(element.dataset.type, Number(element.dataset.level), Number(element.dataset.price));
					this.manager.showStartShop();
					this.manager.shopContainer.style.display = 'none';
					break;
				}	
			}
			if(element.dataset.name === 'product'
			&& element.dataset.type === this.currentElement.dataset.type) {
				const distance = Math.floor(Math.sqrt((this.itemStartX - element.getBoundingClientRect().left)**2 +
					(this.itemStartY - element.getBoundingClientRect().top)**2));
				if(distance === 0) {
					this.manager.addListenersOnProduct(element.dataset.type);
					break;
				}
			}
		}
	}

	findCenterCellOfViewport() {
		
	}
}