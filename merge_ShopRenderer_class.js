class ShopRenderer {
	shop = null;
	shopItem = null;

	setItemsForSave = {}
	productForSave = null;

	eventBus = EventBus.getInstance();

	constructor(shop, shopItem) {
		this.shop = shop;
		this.shopItem = shopItem;
	}

	createCellForShop() {
		const setItems = GAME_CONFIG.SHOP.SET_ITEM_FOR_SHOP;

		const containerProduct = document.createElement('div');
		containerProduct.className = 'shop-product';
		containerProduct.id = `shop-product`;
		containerProduct.style.gridTemplateColumns = `repeat(${setItems.length}, ${100/setItems.length}%)`;

		for(let i = 0; i < setItems.length; i++) {
			const cell = document.createElement('div');
			cell.className = 'cell-for-shop';
			cell.dataset.name = 'product';
			cell.dataset.type = `${setItems[i]}`;

			const picture = this.createPictureCard(items.itemsForShop[setItems[i]].pic);
			const name = this.createTextCard(setItems[i]);

			this.createCellItemForShop(setItems[i]);
			cell.appendChild(picture);
			cell.appendChild(name);
			containerProduct.appendChild(cell);
		}
		this.shop.appendChild(containerProduct);
		this.productForSave = containerProduct;
	}

	createPictureCard(pic) {
		const picture = document.createElement('div');
		 picture.textContent = `${pic}`;
		//picture.style.backgroundImage = `url(${pic})`
		picture.className = 'picture-card';
		return picture;
	}

	createTextCard(type) {
		const name = document.createElement('div');
		name.textContent = `${type}`;
		name.className = 'text-card';
		return name;
	}

	createCellItemForShop(type) {
		if(type === 'eggs') { return } 

		let setItems = [];
		const levelItems = items.itemsForShop[type].level;
		const chests = items.itemsForShop[type].type;

		const containerType = document.createElement('div');
		containerType.className = 'shop-item-type';
		containerType.style.gridTemplateColumns = `repeat(${chests.length}, ${100/(chests.length)}%)`;

		for(let i = 0; i < chests.length; i++) {
			const chest = items[chests[i]].set[levelItems]
			const cell = document.createElement('div');
			cell.className = 'cell-for-shop';
			cell.dataset.name = 'item';
			cell.dataset.type = `${chest.type}`;
			cell.dataset.level = `${levelItems}`;

			const priceItem = chest.countPrice;
			cell.dataset.price = priceItem;

			const resource = chest.resource;
			cell.dataset.resource = resource;

			const picture = this.createPictureCard(chest.pic);

			const text = document.createElement('div');
			const name = this.createTextCard(chests[i]);
			const level = this.createTextCard(`level ${levelItems}`);
			const price = this.createTextCard(`${priceItem} ${resource}`);

			text.appendChild(name);
			text.appendChild(level);
			text.appendChild(price);

			cell.appendChild(picture);
			cell.appendChild(text);
			containerType.appendChild(cell);
		}
		this.shopItem.appendChild(containerType);
		this.setItemsForSave[type] = containerType;
	}
}