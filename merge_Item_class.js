class Item {
	type = '';
	level = 0;
	row = 0;
	col = 0;
	breed = null;
	element = null;
	coord = {};	


	id = '';
	maxLevel = 0; 
	pic = null;

	gift = null; 
	giftOnItem = null;
	giftCollect = null;
	magicCollect = null;
	merge = null;
	magicMerge = null;
	pover = null;

	fullCollect = null;
	isDraging = false;

	countHasGiftOnItem = 0;
	elementHasGiftOnItem = null;

	constructor(type, level, row, col, breed = null) {
		this.type = type;
		this.level = level;
		this.row = row;
		this.col = col;

		this.breed = breed;
		this.id = this.generateId();
		this.maxLevel = items[this.type].maxLevel;
		if(this.breed) { 
			this.pic = items[this.type].set[this.level][this.breed].pic;
		} else {
			this.pic = items[this.type].set[this.level].pic;
		}
		this.transformed = items[this.type].set[this.level].transformed ?? null;
		this.gift = items[this.type].set[this.level].gift ?? null;
		this.giftOnItem = items[this.type].set[this.level].giftOnItem ?? null;
		this.giftCollect = items[this.type].set[this.level].giftCollect ?? null;
		this.magicCollect = items[this.type].set[this.level].magicCollect ?? null;
		this.merge = items[this.type].set[this.level].merge ?? null;
		this.magicMerge = items[this.type].set[this.level].magicMerge ?? null;
		this.pover = items[this.type].set[this.level].pover ?? null;
		this.fullCollect = items[this.type].fullCollect ?? false;
	}
	
	generateId() {
		const lengthId = 10;
		let p = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIKLMNOPQRSTUVWXYZ!@#$%^&*()';
		let id = '';
		for (let i = 0; i < lengthId; i++) {
			id += p[Math.floor(Math.random()*p.length)];
		} 
		return id;
	}
}
