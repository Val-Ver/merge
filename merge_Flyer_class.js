
class Flyer {
	type = null;
	level = 0;

	id = '';
	maxLevel = 0; 
	pic = null;
	timeCollect = null;
	chanceToItem = 0;

	patrolAnimatedId = null;
	isPatrolling = false;
	currentTarget = null;

	progress = 0;

	startPos = null;
	tergetPos = null;
	startTime = 0;
	duration = 0;

	collectGift = null;
	mission = false;
	toItem = null;
	turnToItem = null;
	direction = null;

	route = {};
	size = {width: GAME_CONFIG.BOARD_SIZE.CELL, height: GAME_CONFIG.BOARD_SIZE.CELL}
	speed = GAME_CONFIG.ANIMATIONS.SPEED_FLYER;

	isCollect = false;
	startTimeCollect = null;
	//startTimeCollectGift = { up: null, down: null };
	isDraging = false;
	isGoUp = true;
	startTimeGoUp = { up: null, down: null };
	shadow = {radius: null, height: null}
	shadowStart = {radius: null, height: null};

	eventBus = EventBus.getInstance();

	constructor(manager, type, level) {
		this.manager = manager;
		this.type = type;
		this.level = level;

		this.id = this.generateId();
		this.maxLevel = flyers[this.type].maxLevel;
		this.pic = flyers[this.type].set[this.level].pic;
		this.timeCollect = flyers.allFlyers[this.level].timeCollect;
		this.chanceToItem = flyers.allFlyers[this.level].chanceToItem;
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

	clearAll() {
		this.mission = false;
		this.toItem = null;
		this.direction = null;

		this.currentTarget = null;
		this.startPos = null;
		this.targetPos = null;
		this.startTime = 0;
		this.duration = 0;
		this.speed = GAME_CONFIG.ANIMATIONS.SPEED_FLYER;
	}

	chooseNewRandomTarget() {
		const coordStart = this.route;

		if(this.turnToItem && !this.collectGift) {
			this.toItem = this.turnToItem;
			this.currentTarget = this.manager.flyerSideOfItem(this.toItem, coordStart);
			this.turnToItem = null;
		}
				
		const isDirectionToItem = this.currentTarget ? false : Math.random() < this.chanceToItem;
		if(isDirectionToItem && !this.collectGift) {
			const coordForFlyer = this.manager.findCoordItemsOnBoardForCollect(coordStart);
			this.toItem = coordForFlyer?.coordItem ?? null;
			this.currentTarget = coordForFlyer?.coordFlyer ?? null;
		}

		if(!this.currentTarget) {
			const newCoord = this.manager.getRandomCoord(coordStart);
			this.currentTarget = newCoord;//{ x: newCoord.x, y: newCoord.y };
		}
	}

	setNewTarget(x, y) {
		this.currentTarget = {x, y};
		this.startPos = null;
		this.targetPos = null;
		this.startTime = 0;
		this.duration = 0;
	}
	
	finishCurrentSegment() {
		this.route = { x: this.targetPos.x, y: this.targetPos.y };
		
		this.startPos = null;
		this.targetPos = null;
		this.startTime = 0;
		this.duration = 0;

		const isTargetReached = (this.currentTarget && this.route.x === this.currentTarget.x 
							    && this.route.y === this.currentTarget.y);

		if(isTargetReached) {
			const boardCoord = this.toItem ? this.toItem : this.manager.getCordBoard(this.route)
			if(this.toItem) {
				this.isGoUp = true;
				this.toItem = null;
			}

			this.startTimeGoUp = { up: null, down: null };

			const item = this.manager.findItemOnBoard(boardCoord.row, boardCoord.col);
			if(item && item.giftCollect && !this.collectGift) {

				this.manager.collectGiftFromItem(this, item);
			} else {
				this.currentTarget = null;
				if(this.mission) { 
					this.mission = false;
					this.speed = GAME_CONFIG.ANIMATIONS.SPEED_FLYER;
				}
				this.chooseNewRandomTarget();
			}		
		}
	}
}
