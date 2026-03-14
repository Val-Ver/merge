class ItemInfoPanel {
	manager = null;
	currentItem = null;
	infoPanel = document.querySelector('.info-container');
	items = document.querySelector('.item-container');

	btnRemove = document.getElementById('btn-remove');
	btnExit = document.getElementById('btn-no');

	constructor(manager) {
		this.manager = manager;
		this.addListenersOnButtons();
	}

	showInfoPanel(item) {
		if(item) {this.currentItem = item} 
		const price = this.currentItem.level * GAME_CONFIG.SHOP.PRICE_ITEM;
		document.getElementById('text-for-sale').textContent = `Sell ${this.currentItem.type} for ${price} gold?`;
		document.querySelector('.game-options-container').style.display = 'flex';		
		this.infoPanel.style.display = 'flex';
	}

	addListenersOnButtons() {
		const removeItem = (e) => {
			this.manager.handleSellItem(this.currentItem);
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
}