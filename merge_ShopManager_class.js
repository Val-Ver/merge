class ShopManager {
	manager = null;
	productsElement = null;
	currentItemsSet = null;

	dragManager = null;
	dragManagerForShop = null;

	gameOptionsContainer = null;
	shopContainer = null;
	shop = document.querySelector('.shop');
	shopItem = document.querySelector('.shop-item');
	btnBack = document.getElementById('btn-back');

	renderer = new ShopRenderer(this.shop, this.shopItem);

	constructor(manager) {
		this.manager = manager;

		this.gameOptionsContainer = manager.gameOptionsContainer;
		this.shopContainer = manager.shopContainer;

		this.renderer.createCellForShop();
		this.productsElement = this.renderer.setProductForSave;
		this.dragManagerForShop = new DragManagerForShop(this, this.productsElement);

		this.addListenersOnBtnShop();
		// this.addListenersOnProduct();
		this.addListenerBtnExitShop();
		this.addListenerBtnBackShop();
	}


	addListenersOnBtnShop() {
		const btnShop = document.getElementById('btn-shop');
		btnShop.addEventListener('click', () => {
			//this.showStartShop();
			this.gameOptionsContainer.style.display = 'flex';
			this.shopContainer.style.display = 'flex';
			this.addListenerBtnExitShop();
		});
	}

	showStartShop() {
			this.btnBack.style.display = 'none';
			this.shopItem.style.display = 'none';
			if(this.currentItemsSet) {
				this.currentItemsSet.style.display = 'none';
			}
			this.shop.style.display = 'grid';
			this.productsElement.style.transform = `translate(0, 0)`;

			if(this.dragManager) { this.dragManager.removeListenerMouseAndTouct() }
	}

	addListenerBtnExitShop() {
		const btnExit = document.getElementById('btn-exit-shop');
		const exitShop = () => {
			this.showStartShop();
			this.shopContainer.style.display = 'none';
			this.gameOptionsContainer.style.display = 'none';
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

	addListenersOnProduct(type) {
		this.shop.style.display = 'none';
		this.btnBack.style.display = 'block';
		this.shopItem.style.display = 'grid';

		this.currentItemsSet = this.renderer.setItemsForSave[type];
		this.currentItemsSet.style.transform = `translate(0, 0)`;
		this.currentItemsSet.style.display = 'grid';

		this.dragManager = new DragManagerForShop(this, this.currentItemsSet)
	}
}