class FlyerGalleryManager {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	eventBus = EventBus.getInstance();

	constructor(flyerManager) {
		this.flyerManager = flyerManager
		this.gameBoard = flyerManager.gameBoard;

		this.eventBus.on('cmd: createGalleryFlyerTypes', (element) => {
			this.createGalleryFlyerTypes(element);
		})
		this.eventBus.on('cmd: createGalleryFlyers', (element, type) => {
			this.createGalleryFlyers(element, type);
		})
	}

	createGalleryFlyerTypes(element) {
		const eggs = items.eggs.set[0];
		let setItems = [];
		for(let egg in eggs) {
			setItems.push(egg);
		}

		element.innerHTML = '';
		element.style.gridTemplateColumns = `repeat(${setItems.length}, ${100/(setItems.length)}%)`;

		for(let i = 0; i < setItems.length; i++) {
			const cell = document.createElement('div');
			cell.className = 'cell-for-shop';
			cell.dataset.name = 'gallery';
			const type = setItems[i]
			cell.dataset.type = `${type}`;
		
			const picture = this.createPictureCard(flyers[type].set[1].pic);
			const text = document.createElement('div');
			const name = this.createTextCard(setItems[i]);

			text.appendChild(name);

			cell.appendChild(picture);
			cell.appendChild(text);
			element.appendChild(cell);
		}
	}

	createGalleryFlyers(element, type) {
		const flyersAll = this.findAllFlyersAndEggs();
		const flyersType = flyersAll.filter((flyer) => 
			(flyer.level === 0 && flyer.breed === type) || flyer.type === type)

		const eggsForSale = items.eggs.set[0][type];

		element.innerHTML = ''
		element.style.gridTemplateColumns = `repeat(${flyersType.length + 1}, ${100/(flyersType.length + 1)}%)`;

		const cell = document.createElement('div');
		cell.className = 'cell-for-shop';
		cell.dataset.name = 'egg';
		cell.dataset.type = 'eggs';
		cell.dataset.breed = `${type}`;
		cell.dataset.level = '0';
		cell.dataset.price = `${eggsForSale.countPrice}`;
		cell.dataset.resource = `${eggsForSale.resource}`;

		const picture = this.createPictureCard(eggsForSale.pic);

		const text = document.createElement('div');
		const name = this.createTextCard(type);
		const level = this.createTextCard(`level ${0}`);
		const price = this.createTextCard(`${eggsForSale.countPrice} ${eggsForSale.resource}`);

		text.appendChild(name);
		text.appendChild(level);
		text.appendChild(price);

		cell.appendChild(picture);
		cell.appendChild(text);
		element.appendChild(cell);

		for(let i = 0; i < flyersType.length; i++) {
			const cell = document.createElement('div');
			cell.className = 'cell-for-shop';
			cell.dataset.name = 'flyer';
			cell.dataset.type = `${type}`;

			const picture = this.createPictureCard(flyersType[i].pic);

			const text = document.createElement('div');
			const name = this.createTextCard(type);
			const level = this.createTextCard(`level ${flyersType[i].level}`);

			text.appendChild(name);
			text.appendChild(level);

			cell.appendChild(picture);
			cell.appendChild(text);
			element.appendChild(cell);
		}
	}

	findAllFlyersAndEggs() {
		const eggs = this.findEggsOnBoard();
		const flyers = this.flyerManager.flyers;
		return [...eggs, ...flyers];
	}

	findEggsOnBoard() {
		const eggsOnBoard = []
		for(let row = 0; row < this.rows; row++) {
			for(let col = 0; col < this.cols; col++) {
				if(this.gameBoard.grid[row][col].fog.layer == 0
				&& this.gameBoard.grid[row][col].item
				&& this.gameBoard.grid[row][col].item.type === 'eggs') {
					eggsOnBoard.push(this.gameBoard.grid[row][col].item);
				}
			}
		}
		return eggsOnBoard;
	}

	createPictureCard(pic) {
		const picture = document.createElement('div');
		//picture.textContent = `${pic}`;
		console.log(pic)
		picture.style.backgroundImage = `url(${pic})`
		picture.className = 'picture-card';
		return picture;
	}

	createTextCard(type) {
		const name = document.createElement('div');
		name.textContent = `${type}`;
		name.className = 'text-card';
		return name;
	}
}