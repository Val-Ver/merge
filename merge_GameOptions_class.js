class GameOptions {
	game = null;
	shopManager = null;
	infoPanel = null;
	resources = new Resources();

	constructor(game) {
		this.game = game;
		this.infoPanel = new ItemInfoPanel(this);
		this.shopManager = new ShopManager(this);
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
			document.querySelector('.game-options-container').style.display = 'flex';
			const message = document.querySelector('.info-message');
			message.style.display = 'flex';
		}
	}
	
	addBtnInfoMessage() {
		const btnExit = document.getElementById('btn-exit-message');
		const clickOnDoc = () => {
			const message = document.querySelector('.info-message');
			document.querySelector('.game-options-container').style.display = 'none';
			message.style.display = 'none';
			//btnExit.removeEventListener('click', clickOnDoc);
		}
		btnExit.addEventListener('click', clickOnDoc)
	}

	clickOnPlaceOnBoard() {
		const container = document.querySelector('.game-options-container');
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
					document.querySelector('.shop-container').style.display = 'none';
					document.querySelector('.info-message').style.display = 'none';
					document.querySelector('.info-container').style.display = 'none';
					container.style.display = 'none';
					e.stopPropagation();
					break;
				}
			}
		}
		container.addEventListener('click', clickOnBoard)
	}
}