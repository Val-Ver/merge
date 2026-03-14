class GiftOnItemRenderer {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGTH;

	constructor() {
	}

	createDivForGifts(id, count) {
		const containerGift = document.getElementById(`item-${id}`);
		const divForGifts = document.createElement('div');
		divForGifts.id = `div-for-gift-${id}`;
		divForGifts.className = 'div-for-gift';
		divForGifts.style.gridTemplateColumns = `repeat(${count}, ${100/count}%)`;

		containerGift.appendChild(divForGifts);
		void divForGifts.offsetWidth;
	}

	createGiftOnItem(divId, itemId, pic) {
		const divForGifts = document.getElementById(`div-for-gift-${divId}`);
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
			this.createMagicEffect(item)
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

	removeGiftOnItem(id) {
		const divForGifts = document.getElementById(`div-for-gift-${id}`);
		if(divForGifts) {
			divForGifts.querySelector('.gift-on-item').remove();
		}
	}
}


