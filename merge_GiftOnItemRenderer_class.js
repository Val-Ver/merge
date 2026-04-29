class GiftOnItemRenderer {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGTH;

	elementForSave = null;
	eventBus = EventBus.getInstance();

	constructor() {
		/*this.eventBus.on(EVENTS.CMD_RENDERING_DIV_FOR_GIFTS, (item) => {
			this.createDivForGifts(item);
		})*/
		/*this.eventBus.on(EVENTS.CMD_RENDERING_GIFT_ON_ITEM, (divForGifts, itemId, pic) => {
			this.createGiftOnItem(divForGifts, itemId, pic);
		})*/
		/*this.eventBus.on(EVENTS.CMD_RENDERING_REMOVE_GIFT_ON_ITEM, (divForGifts) => {
			this.removeGiftOnItem(divForGifts);
		})*/
	}

	createDivForGifts(item) {
		const divForGifts = document.createElement('div');
		divForGifts.id = `div-for-gift-${item.id}`;
		divForGifts.className = 'div-for-gift';
		divForGifts.style.gridTemplateColumns = `repeat(${item.giftOnItem.count}, ${100/item.giftOnItem.count}%)`;
		item.element.appendChild(divForGifts);

		//void divForGifts.offsetWidth;
		item.elementHasGiftOnItem = divForGifts;
		//this.elementForSave = divForGifts;
	}

	createGiftOnItem(divForGifts, itemId, pic) {
		const item = document.createElement('div');
		item.className = 'gift-on-item';
		item.id = `item-${itemId}`;
		item.dataset.name = 'gift-on-item';
		item.dataset.id = `${itemId}`;
		item.textContent = `${pic}`;

		const size = GAME_CONFIG.UI.SIZE_GIFT_ON_ITEM_OF_ITEM;
		item.style.width = `${this.boardWidth/this.cols * size}px`;
		if(divForGifts) {
			divForGifts.appendChild(item);
			this.createMagicEffect(item);
		}
	}

	createMagicEffect(element) {
		const effect = document.createElement('div');
		effect.className = 'magic-effect';
		effect.textContent = '+';
		element.appendChild(effect);

		this.removeMagicEffect(effect);
	}

	removeMagicEffect(element) {
		const time = 1
		void element.offsetWidth;
		element.style.transition = `opacity ${time}s ease-in-out,
					    transform  ${time}s ease-in-out`;
		element.style.opacity = '0.01'
		element.style.transform = 'scale(10)';
		element.addEventListener('transitionend', (event) => {
			element.remove();
		})
	}

	removeGiftOnItem(divForGifts) {
		if(divForGifts) {
			divForGifts.querySelector('.gift-on-item').remove();
		}
	}
}


