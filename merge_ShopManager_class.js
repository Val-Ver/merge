class ShopManager {
	manager = null;
	productElement = null;
	currentItemsSet = null;

	dragManager = null;
	dragManagerForShop = null;

	gameOptionsContainer = null;
	shopContainer = null;
	shop = document.querySelector('.shop');
	shopItem = document.querySelector('.shop-item');
//shopItemType = document.querySelector('.shop-item-type');

	shopFlyers = document.querySelector('.shop-flyers');
	flyersGallery = document.querySelector('.flyers-gallery');
	
	btnBack = document.getElementById('btn-back');
	currentPage = null;

	renderer = new ShopRenderer(this.shop, this.shopItem);
	eventBus = EventBus.getInstance();

	constructor(manager) {
		this.manager = manager;

		this.gameOptionsContainer = manager.gameOptionsContainer;
		this.shopContainer = manager.shopContainer;

		this.renderer.createCellForShop();
		this.productElement = this.renderer.productForSave;
		this.dragManagerForShop = new DragManagerForShop(this, this.productElement);

		this.addListenersOnBtnShop();
		this.addListenerBtnExitShop();
		this.addListenerBtnBackShop();

	}

	addListenersOnBtnShop() {
		const btnShop = document.getElementById('btn-shop');
		btnShop.addEventListener('click', () => {
			this.gameOptionsContainer.style.display = 'flex';
			this.shopContainer.style.display = 'flex';
			this.addListenerBtnExitShop();
		});
	}

	showStartShop() {
		this.btnBack.style.display = 'none';
		this.shopItem.style.display = 'none';
		this.shopFlyers.style.display = 'none'; 
		this.flyersGallery.style.display = 'none';

		if(this.currentItemsSet) {
			this.currentItemsSet.style.display = 'none';
		}
		this.shop.style.display = 'grid';
		this.productElement.style.transform = `translate(0, 0)`;
		this.currentPage = 'shop';
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
			switch (this.currentPage) {
			case 'shop-item':	this.showStartShop(); 
						break;
			case 'shop-flyers':	this.shopFlyers.style.display = 'none'; 
						this.shop.style.display = 'grid';
					  	break;
			case 'flyers-gallery':	this.shopFlyers.style.display = 'grid';
						this.flyersGallery.style.display = 'none';
						this.currentPage = 'shop-flyers';
						break;
			}
		}
		btnBack.addEventListener('click', exitBack);
	}


	addListenersOnProduct(type) {
		this.shop.style.display = 'none';
		this.btnBack.style.display = 'block';
		this.shopItem.style.display = 'grid';

		if(type === 'eggs') {
			this.openFlyersGallery(type);
			return;
		}
		this.currentPage = 'shop-item';

		this.currentItemsSet = this.renderer.setItemsForSave[type];
		this.currentItemsSet.style.transform = `translate(0, 0)`;
		this.currentItemsSet.style.display = 'grid';
		this.dragManager = new DragManagerForShop(this, this.currentItemsSet);
	}
	
	openFlyersGallery(type) {
		this.shopItem.style.display = 'none';
		this.shopFlyers.style.display = 'grid';
		this.currentPage = 'shop-flyers';

		const element = document.querySelector('.type-flyers');
		this.eventBus.emit('cmd: createGalleryFlyerTypes', element);
		this.currentItemsSet = element;

		this.currentItemsSet.style.transform = `translate(0, 0)`;
		this.currentItemsSet.style.display = 'grid';				
		this.dragManager = new DragManagerForShop(this, this.currentItemsSet);
	}

	addListenersOnGallery(type) {
		this.shopFlyers.style.display = 'none';
		this.flyersGallery.style.display = 'grid';
		this.currentPage = 'flyers-gallery';

		const element = document.querySelector('.flyers-gallery-type');
		this.eventBus.emit('cmd: createGalleryFlyers', element, type);
		this.currentItemsSet = element;

		this.currentItemsSet.style.transform = `translate(0, 0)`;
		this.currentItemsSet.style.display = 'grid';				
		this.dragManager = new DragManagerForShop(this, this.currentItemsSet);
	}
}