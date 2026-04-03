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

class DragonDragStrategy extends BaseDragStrategy {
	manager = null;

	currentElement = null;
	currentDragon = null;

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

		this.currentDragon = this.manager.getCurrentDargon(this.currentElement.dataset.id);
		if(this.currentDragon.collectGift) { this.manager.putItemOnBoard(this.currentDragon) }

		this.elementStartX = Number(this.currentElement.style.left.split('px')[0]);
		this.elementStartY = Number(this.currentElement.style.top.split('px')[0]);

		this.offsetX = clientX - this.elementStartX;
		this.offsetY = clientY - this.elementStartY;
	}

	move(clientX, clientY) {
		if(!this.isDraging) { return }

		
		if(this.currentDragon.mission) { this.currentDragon.mission = false }
		this.currentDragon.isDraging = true;

		this.currentElement.style.zIndex = '100';

		this.currentElement.style.left = (clientX - this.offsetX) +'px';
		this.currentElement.style.top = (clientY - this.offsetY) +'px';

		this.currentDragon.route = { x: clientX - this.offsetX, y: clientY - this.offsetY }

	}

	end(clientX, clientY) {
		this.isDraging = false;

		this.currentDragon = this.manager.getCurrentDargon(this.currentElement.dataset.id);
		this.currentDragon.isDraging = false;
	
		let elementsFromPoint = document.elementsFromPoint(clientX, clientY);

		const findDragons = elementsFromPoint.filter((element) => {
			return element.dataset.name == 'dragon';
		})

		if(findDragons.length >= 3) {
			this.manager.mergeDragons(findDragons);

			return;
		}

		for(let i = 0; i < elementsFromPoint.length; i++) {
			let element = elementsFromPoint[i];

			if(element.dataset.name == 'fog'
			|| element.dataset.name == 'landscape'
			|| element.dataset.name == 'cell') { 
				this.manager.startPatrulDragonAfterDraging(this.currentDragon)
				break; 
			}

			if(element.dataset.name == 'item') {
				this.manager.collectItemAfterDraging(this.currentDragon)
				break;
			}
		}
		this.currentElement.style.zIndex = '';		
	}
}

class DragonCLickStrategy extends BaseDragStrategy {
	manager = null;

	constructor(dragManager) {
		super(dragManager);
		this.manager = dragManager;
	}

	end(clientX, clientY, element) {
		console.log('будет: уронить предмет')
		//уронить предмет
	}
}









class ItemDragStrategy extends BaseDragStrategy {
	manager = null;

	currentElement = null;
	offsetX = 0;
	offsetY = 0;
	elementStartX = 0;
	elementStartY = 0;

	itemsPref = [];

	isDragingItem = false;

	constructor(dragManager) {
		super(dragManager);
		this.manager = dragManager.itemHandler;
	}

	start(clientX, clientY, element) {
		this.isDragingItem = true;
		this.currentElement = element;

		if(!this.manager.itemRegistry.getCurrentItem(this.currentElement.dataset.id)) { return }
		this.manager.itemRegistry.getCurrentItem(this.currentElement.dataset.id).isDraging = true;

		this.elementStartX = Number(this.currentElement.style.left.split('px')[0]);
		this.elementStartY = Number(this.currentElement.style.top.split('px')[0]);

		this.offsetX = clientX - this.elementStartX;
		this.offsetY = clientY - this.elementStartY;

		this.manager.itemPlacer.clearItemForDrag(this.currentElement.dataset.id);
	}

	move(clientX, clientY) {
		if(!this.isDragingItem) { return }
		this.currentElement.style.zIndex = '100';

		this.currentElement.style.left = (clientX - this.offsetX) +'px';
		this.currentElement.style.top = (clientY - this.offsetY) +'px';

		let elementsFromPoint = document.elementsFromPoint(clientX, clientY);
		for(let i = 0; i < elementsFromPoint.length; i++) {
			let element = elementsFromPoint[i];

			if(element.dataset.name == 'fog') { break; }
			if(element.dataset.name == 'item' 
			&& element.dataset.id != this.currentElement.dataset.id) {	
				this.itemsPref = this.manager.preformHighlightingItems(this.currentElement.dataset.id, element.dataset.id);
				if(this.itemsPref.length > 1) {
					//this.manager.itemPlacer.renderer.createMergeCounter(this.currentElement, this.itemsPref.length);
					this.manager.createMergeCounter(this.currentElement, this.itemsPref.length);
				}
				break;
			}
			if(this.itemsPref.length > 1) {
				this.manager.removeMergeCounter();
				this.manager.removeHighlightingItems(this.itemsPref);
			}
		}
	}

	end(clientX, clientY) {
		this.isDragingItem = false;
		this.itemsPref = [];

		if(!this.manager.itemRegistry.getCurrentItem(this.currentElement.dataset.id)) { return }
		this.manager.itemRegistry.getCurrentItem(this.currentElement.dataset.id).isDraging = false;
			
		let elementsFromPoint = document.elementsFromPoint(clientX, clientY);
		for(let i = 0; i < elementsFromPoint.length; i++) {
			let element = elementsFromPoint[i];

			if(element.dataset.name == 'fog'
			|| element.dataset.name == 'landscape') { 
				this.manager.stayBackItemOnBoard(this.currentElement.dataset.id);
				break; 
			}

			if(element.dataset.name == 'item' 
			&& element.dataset.id != this.currentElement.dataset.id) {
				this.manager.handleAfterDragItem(this.currentElement.dataset.id, element.dataset.id);
				break;
			}

			if(element.dataset.name == 'cell') {
				this.manager.handleCell(this.currentElement.dataset.id, element.dataset.row, element.dataset.col);
				break;
			} 
		}
		this.currentElement.style.zIndex = '';		
	}
}

class ItemCLickStrategy extends BaseDragStrategy {
	manager = null;

	constructor(dragManager) {
		super(dragManager);
		this.manager = dragManager.itemHandler;
	}

	end(clientX, clientY, element) {
		//this.manager.itemPlacer.stayBackItemOnBoard(element.dataset.id);
		this.manager.stayBackItemOnBoard(element.dataset.id);
		this.manager.handleItem(element.dataset.id);
	}
}

class ItemLongCLickStrategy extends BaseDragStrategy {
	manager = null;

	constructor(dragManager) {
		super(dragManager);
		this.manager = dragManager.itemHandler;
	}

	end(clientX, clientY, element) {
		const item = this.manager.itemRegistry.getCurrentItem(element.dataset.id);
		this.manager.itemPlacer.gameBoard.addItemInCell(item);
		this.manager.infoPanel.showInfoPanel(item);
	}
}

class ItemDblCLickStrategy extends BaseDragStrategy {
	manager = null;

	constructor(dragManager) {
		super(dragManager);
		this.manager = dragManager.itemHandler;
	}

	end(clientX, clientY, element) {
		this.manager.stayBackItemOnBoard(element.dataset.id);
		this.manager.itemCallsDragon(element.dataset.id) //возможно не понадобится
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
	place = document.querySelector('.shop-item');

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
			if(this.currentElement.dataset.name == 'item') {
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
			if(element.dataset.name == 'item'
			&& element.dataset.level == this.currentElement.dataset.level) { 
				const distance = Math.floor(Math.sqrt((this.itemStartX - element.getBoundingClientRect().left)**2 + 
						(this.itemStartY - element.getBoundingClientRect().top)**2));
				if(distance == 0) {
e.stopPropagation();
					this.manager.manager.handleBuyItem(element.dataset.type, element.dataset.level, Number(element.dataset.price));
					this.manager.showStartShop();
					this.manager.shopContainer.style.display = 'none';
					break;
				}	
			}
		}
	}
}