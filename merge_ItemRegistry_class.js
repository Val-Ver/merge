class ItemRegistry {
	itemOnBoard = [];

	constructor() {}

	addItem(item) {
		this.itemOnBoard.push(item);
	}

	removeItem(itemId) {
		this.itemOnBoard = this.itemOnBoard.filter(itemOnBoard  => itemOnBoard.id != itemId);
	}

	getCurrentItem(itemId) {
		const findItem = this.itemOnBoard.filter(itemOnBoard  => itemOnBoard.id == itemId);
		return findItem[0];
	}

	getInfoAboutItemForSale(itemId) { // не нашла где используется
		const item = this.getCurrentItem(itemId);
		return { type: item.type, level: item.level }
	}
}