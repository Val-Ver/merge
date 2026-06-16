class GameOptions {
	//game = null;
	shopManager = null;
	//saveGame = null;
	infoPanel = new InfoPanel();
	resources = new Resources();

	gameOptionsContainer = document.querySelector('.game-options-container');
	shopContainer = document.querySelector('.shop-container');
	divInfoMessage = document.querySelector('.div-info-message');
	infoMessageLacks = document.querySelector('.info-message-lacks');
	infoMessageBuy = document.querySelector('.info-message-buy');
	infoContainer = document.querySelector('.info-container');

	clickOnBuy = null;
	eventBus = EventBus.getInstance();

	constructor() {
		this.shopHandler = new ShopManager(this);
		this.addBtnInfoMessage();
		this.clickOnPlaceOnBoard();
		this.addBtnGameAgain();
	}

	updateResources(scoreGold, scoreWood, scoreCrystal) {
		this.resources.updateScore(scoreGold, scoreWood, scoreCrystal)
	}

	addBtnGameAgain() {
		const btn = document.getElementById('btn-game-again');
		const clickOnBtn = () => {
			this.eventBus.emit(EVENTS.CMD_GAME_AGAIN);
		}
		btn.addEventListener('click', clickOnBtn);
	}

	handleBuyItem(type, level, price, resource, breed = null) {
		if(this.resources[resource].score >= price) {
			this.shopHandler.shopContainer.style.display = 'none';

			this.gameOptionsContainer.style.display = 'flex';
			this.divInfoMessage.style.display = 'flex';
			this.infoMessageBuy.style.display = 'flex';

			this.addBtnBuy().then((res) => {
				if(res) {
					this.eventBus.emit(EVENTS.CMD_DECREASE_RESOURCE, resource, price);
					this.eventBus.emit(EVENTS.CMD_ADD_ITEM_IN_GAME, type, level, breed);
				}
				this.shopHandler.shopContainer.style.display = 'flex';
				this.btnBuy.removeEventListener('click', this.clickOnBuy);
				this.btnNo.removeEventListener('click', this.clickOnNo);
			})
		} else {
			this.shopHandler.showStartShop();
			this.shopHandler.shopContainer.style.display = 'none';

			this.gameOptionsContainer.style.display = 'flex';
			this.divInfoMessage.style.display = 'flex';
			this.infoMessageLacks.style.display = 'flex';
		}
	}
	
	addBtnInfoMessage() {
		const btnExit = document.getElementById('btn-exit-message');
		const clickOnExit = () => {
			this.gameOptionsContainer.style.display = 'none';
			this.divInfoMessage.style.display = 'none';
			this.infoMessageLacks.style.display = 'none';
		}
		btnExit.addEventListener('click', clickOnExit);
	}

	addBtnBuy() {
		return new Promise((resolve) => {
			this.btnBuy = document.getElementById('btn-buy-message');
			this.clickOnBuy = () => {
				//this.gameOptionsContainer.style.display = 'none';
				this.divInfoMessage.style.display = 'none';
				this.infoMessageBuy.style.display = 'none';
				resolve(true);

			}
			this.btnBuy.addEventListener('click', this.clickOnBuy);

			this.btnNo = document.getElementById('btn-no-message');
			this.clickOnNo = () => {
				//this.gameOptionsContainer.style.display = 'none';
				this.divInfoMessage.style.display = 'none';
				this.infoMessageBuy.style.display = 'none';
				resolve(false);

			}
			this.btnNo.addEventListener('click', this.clickOnNo);
		})
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