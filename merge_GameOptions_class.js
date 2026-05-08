class GameOptions {
	game = null;
	shopManager = null;
	infoPanel = new InfoPanel();
	resourcesGold = new ResourcesGold();

	gameOptionsContainer = document.querySelector('.game-options-container');
	shopContainer = document.querySelector('.shop-container');
	divInfoMessage = document.querySelector('.div-info-message');
	infoContainer = document.querySelector('.info-container');
	updateContainer = document.querySelector('.update-container');

	constructor() {
		this.shopHandler = new ShopManager(this);

		this.addBtnInfoMessage();
		this.clickOnPlaceOnBoard();

		this.eventBus = EventBus.getInstance();
	}


//----------------------------------------------------------------------
	sellItem(summ) {
console.error('сработал sellItem в GameOptions')
		this.resourcesGold.increaseGold(summ);
	}

	buyItem(summ) {
console.error('сработал buyItem в GameOptions')
		this.resourcesGold.decreaseGold(summ);
	}
//----------------------------------------------------------------------
	

	updateResourcesGold(scoreGold) {
		this.resourcesGold.updateScoreGolg(scoreGold)
	}

	handleBuyItem(type, level, price) {
		if(this.resourcesGold.scoreGold >= price) {
			this.resourcesGold.decreaseGold(price);
			this.eventBus.emit(EVENTS.CMD_ADD_ITEM_IN_GAME, type, level);
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
		btnExit.addEventListener('click', clickOnDoc);
	}

	// showUpdateContainer(item) {
	// 	this.updateContainer.style.display = 'flex';
	// 	this.addBtnInfoMessage();
	// }
	// addBtnUpdateGame() {
	// 	const updateGame = (e) => {
	// 		this.soldItem();
	// 		this.infoPanel.style.display = 'none';
	// 		document.querySelector('.game-options-container').style.display = 'none';
	// 	}
	// 	const continueGame = (e) => {
	// 		this.infoPanel.style.display = 'none';
	// 		document.querySelector('.game-options-container').style.display = 'none';
	// 	}
	// 	document.getElementById('btn-update').addEventListener('click', updateGame);
	// 	document.getElementById('btn-no-update').addEventListener('click', continueGame);
	// }

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