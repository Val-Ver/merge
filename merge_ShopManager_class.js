class ShopManager {
	shopWindow = document.querySelector('.shop-container');
	manager = null;
	currentItemsSet = null;
	renderer = new ShopRenderer();
	dragManager = null;

	constructor(manager) {
		this.manager = manager;
		this.renderer.createCellForShop();
		this.addListenersOnBtnShop();
		this.addListenersOnProduct();
		this.addListenerBtnExitShop();
		this.addListenerBtnBackShop();
	}


	addListenersOnBtnShop() {
		const btnShop = document.getElementById('btn-shop');
		btnShop.addEventListener('click', () => {
			//this.showStartShop();
			document.querySelector('.game-options-container').style.display = 'flex';
			this.shopWindow.style.display = 'flex';
			this.addListenerBtnExitShop();
		});
	}

	showStartShop() {
			document.getElementById('btn-back').style.display = 'none';
			document.querySelector('.shop-item').style.display = 'none';
			if(this.currentItemsSet) {
				this.currentItemsSet.style.display = 'none';
			}
			document.querySelector('.shop').style.display = 'grid';
			if(this.dragManager) { this.dragManager.removeListenerMouseAndTouct() }
	}

	addListenerBtnExitShop() {
		const btnExit = document.getElementById('btn-exit-shop');
		const exitShop = () => {
			this.showStartShop();
			this.shopWindow.style.display = 'none';
			document.querySelector('.game-options-container').style.display = 'none';
		}
		btnExit.addEventListener('click', exitShop);
	}

	addListenerBtnBackShop() {
		const btnBack = document.getElementById('btn-back');

		const exitBack = (e) => {
			this.showStartShop();
		}
		btnBack.addEventListener('click', exitBack);
	}

	addListenersOnProduct() {
		const container = document.querySelectorAll('.cell-for-shop');
		const choice = (e) => {
			const elementsFromPoint = document.elementsFromPoint(e.clientX, e.clientY);
			for(let i = 0; i < elementsFromPoint.length; i++) {
				const cardItem = elementsFromPoint[i];
				if(cardItem.dataset.name == 'product') { 

					document.querySelector('.shop').style.display = 'none';
					document.getElementById('btn-back').style.display = 'block';
					document.querySelector('.shop-item').style.display = 'grid';
					this.currentItemsSet = document.getElementById(`shop-item-${cardItem.dataset.type}`);
					this.currentItemsSet.style.transform = `translate(0, 0)`;
					this.currentItemsSet.style.display = 'grid';				
					this.dragManager = new DragManagerForShop(this, this.currentItemsSet)
					break;
				}
			}
		}
		container.forEach((card) => {
			card.addEventListener('click', choice)
		})
	}
}