class Item {
	type = '';
	level = 0;
	row = 0;
	col = 0;
	element = null;

	id = '';
	maxLevel = 0; 
	pic = null;

	gift = null; 
	giftOnItem = null;
	pover = null;
	isDraging = false;
	countHasGiftOnItem = 0;

	constructor(type, level, row, col) {
		this.type = type;
		this.level = level;
		this.row = row;
		this.col = col;

		this.id = this.generateId();
		this.maxLevel = items[this.type].maxLevel;
		this.pic = items[this.type].set[this.level].pic;
		this.gift = items[this.type].set[this.level].gift ?? null;
		this.giftOnItem = items[this.type].set[this.level].giftOnItem ?? null;
		this.pover = items[this.type].set[this.level].pover ?? null;
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
