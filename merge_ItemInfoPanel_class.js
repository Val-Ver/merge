class InfoPanel {
	manager = null;
	currentItem = null;
	infoPanel = document.querySelector('.info-container');
	items = document.querySelector('.item-container');

	btnRemove = document.getElementById('btn-remove');
	btnExit = document.getElementById('btn-no');

	constructor() {
		this.addListenersOnButtons();
		this.eventBus = EventBus.getInstance();
		this.subscription();
	}

	subscription() {
		this.eventBus.on(EVENTS.CMD_SHOW_MESSAGE_FOR_SALE, (item) => {
			this.showInfoPanel(item);
		})
	}

	showInfoPanel(item) {
		if(!item || item.type === 'gold') { return }
		this.currentItem = item;
		const price = this.currentItem.level !== 0 ? this.currentItem.level * GAME_CONFIG.SHOP.PRICE_ITEM : GAME_CONFIG.SHOP.MIN_PRICE_ITEM;
		document.getElementById('text-for-sale').textContent = `Sell ${this.currentItem.type} for ${price} gold?`;
		document.querySelector('.game-options-container').style.display = 'flex';		
		this.infoPanel.style.display = 'flex';
	}

	addListenersOnButtons() {
		const removeItem = (e) => {
			this.soldItem();
			this.infoPanel.style.display = 'none';
			document.querySelector('.game-options-container').style.display = 'none';
		}
		const exit = (e) => {
			this.infoPanel.style.display = 'none';
			document.querySelector('.game-options-container').style.display = 'none';
		}
		this.btnRemove.addEventListener('click', removeItem);
		this.btnExit.addEventListener('click', exit);
	}
	
	soldItem() {
		const price = this.currentItem.level !== 0 ? this.currentItem.level * GAME_CONFIG.SHOP.PRICE_ITEM : GAME_CONFIG.SHOP.MIN_PRICE_ITEM;
		this.eventBus.emit(EVENTS.CMD_INCREASE_GOLD, price);
		this.eventBus.emit(EVENTS.CMD_REMOVE_ITEM, this.currentItem);
		this.eventBus.emit(EVENTS.CMD_CLEAR_INTERVAL_CREATE_GIFT, this.currentItem);
	}

}