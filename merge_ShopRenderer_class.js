class ShopRenderer {
	shop = null;
	shopItem = null;

	setItemsForSave = {}

	constructor(shop, shopItem) {
		this.shop = shop;
		this.shopItem = shopItem;
	}

	createCellForShop() {
		const setItems = GAME_CONFIG.SHOP.SET_ITEM_FOR_SHOP;

		this.shop.style.gridTemplateColumns = `repeat(${setItems.length}, ${100/setItems.length}%)`;
		for(let i = 0; i < setItems.length; i++) {
			const cell = document.createElement('div');
			cell.className = 'cell-for-shop';
			cell.dataset.name = 'product';
			cell.dataset.type = `${setItems[i]}`;

			const picture = this.createPictureCard(items[setItems[i]].set[1].pic);
			const name = this.createTextCard(setItems[i]);

			this.createCellItemForShop(setItems[i]);
			cell.appendChild(picture);
			cell.appendChild(name);
			this.shop.appendChild(cell);
		}
	}

	createPictureCard(pic) {
		const picture = document.createElement('div');
		picture.textContent = `${pic}`;
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
		const setItems = items[type];

		const containerType = document.createElement('div');
		containerType.className = 'shop-item-type';
		containerType.id = `shop-item-${type}`;
		containerType.style.gridTemplateColumns = `repeat(${setItems.maxLevel-1}, ${100/(setItems.maxLevel-1)}%)`;

		for(let i = 1; i < setItems.maxLevel; i++) {
			const cell = document.createElement('div');
			cell.className = 'cell-for-shop';
			cell.dataset.name = 'item';
			cell.dataset.type = `${setItems.type}`;
			cell.dataset.level = `${i}`;
			const priceItem = GAME_CONFIG.SHOP.PRICE_ITEM * i;
			cell.dataset.price = priceItem;

			const picture = this.createPictureCard(setItems.set[i].pic);

			const text = document.createElement('div');
			const name = this.createTextCard(setItems.type);
			const level = this.createTextCard(`level ${i}`);
			const price = this.createTextCard(`${priceItem} gold`);

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