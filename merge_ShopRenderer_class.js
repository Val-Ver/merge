class ShopRenderer {

	constructor() {}

	createCellForShop() {
		const setItems = GAME_CONFIG.SHOP.SET_ITEM_FOR_SHOP;
		const container = document.querySelector('.shop');

		container.style.gridTemplateColumns = `repeat(${setItems.length}, ${100/setItems.length}%)`;
		for(let i = 0; i < setItems.length; i++) {
			const cell = document.createElement('div');
			cell.className = 'cell-for-shop';
			cell.dataset.name = 'product';
			cell.dataset.type = `${setItems[i]}`;

			const picture = this.createPictureCard(items[setItems[i]].set[1].pic);
			const name = this.createNameCard(setItems[i]);

			this.createCellItemForShop(setItems[i])
			cell.appendChild(picture);
			cell.appendChild(name);
			container.appendChild(cell);
		}
	}

	createNameCard(type) {
		const name = document.createElement('div');
		name.textContent = `${type}`//, level 1 ${GAME_CONFIG.SHOP.PRICE_ITEM} gold`;
		name.className = 'name-card';
		return name;
	}

	createLevelCard(level) {
		const levelItem = document.createElement('div');
		levelItem.textContent = `level ${level}`;
		levelItem.className = 'name-card';
		return levelItem;
	}
	createPriceCard(price) {
		const priceItem = document.createElement('div');
		priceItem.textContent = `${price} gold`;
		priceItem.className = 'name-card';
		return price;
	}

	createPictureCard(pic) {
		const picture = document.createElement('div');
		// picture.textContent = `${pic}`;
		picture.style.backgroundImage = `url(${pic})`

		picture.className = 'picture-card';
		return picture;
	}

	createCellItemForShop(type) {
		const setItems = items[type]
		const container = document.querySelector('.shop-item');

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
			const name = this.createNameCard(setItems.type);
			const level = this.createNameCard(`level ${i}`);
			const price = this.createNameCard(`${priceItem} gold`);

			text.appendChild(name);
			text.appendChild(level);
			text.appendChild(price);

			cell.appendChild(picture);
			cell.appendChild(text);
			containerType.appendChild(cell);
		}
		container.appendChild(containerType);
	}
}