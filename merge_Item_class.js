class Item {
	type = '';
	level = 0;
	row = 0;
	col = 0;
	breed = null;
	coord = {};	

	id = '';
	maxLevel = 0; 
	pic = null;

	gift = null; 
	giftOnItem = null;
	setFromClickOnItem = null;
	giftsAfterClickOnItem = null;

	setFromItemForOneTime = null;
	setFromClickOnItemForOneTime = null
	giftsFromClickOnItemForOneTime = null;

	giftCollect = null;
	giftCollectUniq = null;
	magicCollect = null;
	fullCollect = null;

	merge = null;
	magicMerge = null;

	pover = null;
	price = null;

	isDraging = false;
	animationId = null;
	outside = false;

	countHasGiftOnItem = 0;
	countOfClick = 0;
	timeOutCollsFlyer = 0;

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
		this.setFromClickOnItem = items[this.type].set[this.level].setFromClickOnItem ?? null
		this.setFromItemForOneTime = items[this.type].set[this.level].setFromItemForOneTime ?? null
		this.setFromClickOnItemForOneTime = items[this.type].set[this.level].setFromClickOnItemForOneTime ?? null

		this.giftCollect = items[this.type].set[this.level].giftCollect ?? null;
		this.giftCollectUniq = items[this.type].set[this.level].giftCollectUniq ?? null;
		this.fullCollect = items[this.type].fullCollect ?? false;
		this.magicCollect = items[this.type].set[this.level].magicCollect ?? null;

		this.merge = items[this.type].set[this.level].merge ?? null;
		this.magicMerge = items[this.type].set[this.level].magicMerge ?? null;

		this.pover = items[this.type].set[this.level].pover ?? null;
		this.price = items[this.type].set[this.level].price ?? null;

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
