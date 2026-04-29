
class Flyer {
	type = null;
	level = 0;

	id = '';
	maxLevel = 0; 
	pic = null;
	element = null;

	patrolAnimatedId = null;
	isPatrolling = false;
	currentTarget = null;
	currentProgress = 0;

	startPos = null;
	tergetPos = null;
	startTime= 0;
	duration = 0;

	collectGift = null;
	mission = false;
	direction = null;
	route = {};
	speed = GAME_CONFIG.ANIMATIONS.SPEED_FLYER;

	isDraging = false;
	eventBus = EventBus.getInstance();

	constructor(manager, type, level) {
		this.manager = manager;
		this.type = type;
		this.level = level;

		this.id = this.generateId();
		this.maxLevel = flyers[this.type].maxLevel;
		this.pic = flyers[this.type].set[this.level].pic;
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

	stopPatrol() {
		if(this.patrolAnimatedId !== null) {
			cancelAnimationFrame(this.patrolAnimatedId);
			this.patrolAnimatedId = null;
		}
		this.isPatrolling = false;
	}

	startPatrol() {
		if(this.patrolAnimatedId !== null) { this.stopPatrol() }
		this.isPatrolling = true;
		this.patrolAnimatedId = requestAnimationFrame((timeStamp) => this.patrolStep(timeStamp));
	}
	
	patrolStep(now) {
		if(!this.isPatrolling || this.isDraging) {
			this.patrolAnimatedId = requestAnimationFrame((ts) => this.patrolStep(ts));
			this.startPos = null;
			this.targetPos = null;
			this.startTime = 0;
			this.duration = 0;
			return;
		}

		if(!this.currentTarget && !this.direction) {
			this.chooseNewRandomTarget();
		}

		if(this.direction) {
			this.setNewTarget(this.direction.x, this.direction.y);
			this.direction = null;
		}

		if(this.startPos === null || this.targetPos === null) {
			this.startPos = { x: this.route.x, y: this.route.y }
			this.targetPos = { x: this.currentTarget.x, y: this.currentTarget.y }
	
			const distanceX = this.targetPos.x - this.startPos.x;
			const distanceY = this.targetPos.y - this.startPos.y;
			const distance = Math.sqrt(distanceX**2 + distanceY**2);
			this.duration = distance === 0 ? 0 : (distance / this.speed) * 1000;
			this.startTime = now;
			this.currentProgress = 0;
		}
	
		if(this.duration === 0) {
			this.finishCurrentSegment();
			this.patrolAnimatedId = requestAnimationFrame((ts) => this.patrolStep(ts));
			return;
		}

		const elapsed = now - this.startTime;
		let t = Math.min(1, elapsed / this.duration);
		//t = 1 - Math.pow(1-t, 1.5);
		const newX = this.startPos.x + (this.targetPos.x - this.startPos.x) * t;
		const newY = this.startPos.y + (this.targetPos.y - this.startPos.y) * t;

		this.eventBus.emit(EVENTS.CMD_RENDERING_UPDATE_COORD_FLYER, this.element, newX, newY);
		this.route = { x: newX, y: newY };

		if(t >= 1) {
			if(this.collectGift) {
				this.manager.putItemOnBoard(this);
			} 
			this.finishCurrentSegment();
		}

		this.patrolAnimatedId = requestAnimationFrame((ts) => this.patrolStep(ts));	
	}

	chooseNewRandomTarget() {
		const coordStart = this.route;
		const newCoord = this.manager.getRandomCoord(coordStart);
		this.currentTarget = { x: newCoord.x, y: newCoord.y };
		
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
		this.eventBus.emit(EVENTS.CMD_RENDERING_UPDATE_COORD_FLYER, this.element, this.route.x, this.route.y);
		this.startPos = null;
		this.targetPos = null;
		this.startTime = 0;
		this.duration = 0;

		/*const isTargetReached = (this.currentTarget && Math.abs(this.route.x - this.currentTarget.x) < 0.1 
							    && Math.abs(this.route.y - this.currentTarget.y) < 0.1);*/

		const isTargetReached = (this.currentTarget && this.route.x === this.currentTarget.x 
							    && this.route.y === this.currentTarget.y);

		if(isTargetReached) {
			const boardCoord = this.manager.getCordBoard(this.route);

			const item = this.manager.findItemOnBoard(boardCoord.row, boardCoord.col);
			if(item && item.giftCollect && !this.collectGift) {
				this.stopPatrol();
				this.manager.collectGiftFromItem(this, item);
			} else {
				this.currentTarget = null;
				this.chooseNewRandomTarget();
			}
		}
	}
}
