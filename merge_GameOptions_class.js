class GameOptions {
	game = null;
	shopManager = null;
	infoPanel = null;
	resources = new Resources();

	gameOptionsContainer = document.querySelector('.game-options-container');
	shopContainer = document.querySelector('.shop-container');
	divInfoMessage = document.querySelector('.div-info-message');
	infoContainer = document.querySelector('.info-container');

	constructor(game) {
		this.game = game;
		this.infoPanel = new ItemInfoPanel(this);
		this.shopHandler = new ShopManager(this);
		this.game.itemManager.addOptions(this);
		this.addBtnInfoMessage();
		this.clickOnPlaceOnBoard();
	}

	sellItem(summ) {
		this.resources.increaseGold(summ);
	}

	buyItem(summ) {
		this.resources.decreaseGold(summ);
	}

	handleSellItem(item) {
		const price = item.level * GAME_CONFIG.SHOP.PRICE_ITEM;
		this.resources.increaseGold(price);
		this.game.itemManager.itemPlacer.removeItemFromGame(item);
	}

	handleBuyItem(type, level, price) {
		if(this.resources.scoreGold >= price) {
			this.resources.decreaseGold(price);
			this.game.itemManager.itemHandler.handleOnShop(type, level);
		} else {
			this.gameOptionsContainer.style.display = 'flex';
			this.divInfoMessage.style.display = 'flex';
		}
	}
	
	addBtnInfoMessage() {
		const btnExit = document.getElementById('btn-exit-message');
		const clickOnDoc = () => {
			this.gameOptionsContainer.style.display = 'none';
			this.divInfoMessage.style.display = 'none';
		}
		btnExit.addEventListener('click', clickOnDoc)
	}

	clickOnPlaceOnBoard() {
		const clickOnBoard = (e) => {
//сделать что бы клик дальше не шел
			const elementsFromPoint = document.elementsFromPoint(e.clientX, e.clientY);
			for(let i = 0; i < elementsFromPoint.length; i++) {
				const element = elementsFromPoint[i];
				if(element.className != 'game-options-container') { 
					e.stopPropagation();
					break;
				}
				if(element.className == 'game-options-container') { 
					this.shopContainer.style.display = 'none';
					this.divInfoMessage.style.display = 'none';
					this.infoContainer.style.display = 'none';
					this.gameOptionsContainer.style.display = 'none';
					e.stopPropagation();
					break;
				}
			}
		}
		this.gameOptionsContainer.addEventListener('click', clickOnBoard)
	}
}