class FlyerRendererCanvas {
	rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	cols = GAME_CONFIG.BOARD_SIZE.COLS;

	cell = GAME_CONFIG.BOARD_SIZE.CELL;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGHT;

	canvas = document.getElementById("flyer-canvas");
	sizeCanvas = this.canvas.getBoundingClientRect();
	ctx = this.canvas.getContext('2d');

	canvasForDragging = document.getElementById("dragging-canvas");
	sizeCanvasDrag = this.canvasForDragging.getBoundingClientRect();
	ctxDrag = this.canvasForDragging.getContext('2d');

	
	eventBus = EventBus.getInstance();

	constructor() {
		this.subscription();
	}	

	subscription() {
		this.eventBus.on(EVENTS.CMD_RENDERING_CREATE_FLYER, (flyer, x, y) => {
			this.createFlyer(flyer, x, y);
		})

		this.eventBus.on(EVENTS.CMD_RENDERING_COLLECT_GIFT_FROM_ITEM, (flyer, giftOnFlyer) => {
			this.collectGiftFromItem(flyer, giftOnFlyer);
		})

		this.eventBus.on(EVENTS.CMD_RENDERING_PUT_GIFT_FROM_FLYER, (item, rowEnd, colEnd, resolve) => {
			return this.removeFlyItem(item, rowEnd, colEnd, resolve);
		})
	}	

	createFlyer(flyer, x, y, radiusShadow, heightShadow = 0) {
		const centerX = x  + this.cell / 2;
		const centerY = y  + this.cell / 2; // + heightShadow;
		const centerShadowY = centerY + this.cell / 2;
		
		const pi = Math.PI;
		const radius = this.cell / 2;

		this.ctx.lineWidth = 1;

		this.ctx.beginPath();
/**********/
//вот так надо дома
		this.ctx.fillStyle = "rgba(255, 255, 255, 0)";
		this.ctx.strokeStyle = "rgba(255, 255, 255, 0)";

		//this.ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
		//this.ctx.strokeStyle = "grey";
/**********/
		this.ctx.arc(centerX, centerY, radius, 0, 2*pi, true);
		this.ctx.stroke();
		this.ctx.fill();
		if(radiusShadow && heightShadow) {
			this.createShadow(flyer, x, y, radiusShadow, heightShadow);
		}
		this.ctx.font = "10px Times New Roman, monospace";
		this.ctx.fillStyle = 'white';

		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(`${flyer.pic}`, centerX, centerY);

		if(flyer.collectGift) {
			this.collectGiftFromItem(flyer.collectGift, flyer.route.x, flyer.route.y);
		}

		flyer.route = { x: x, y: y }; 
	}

	createShadow(flyer, x, y, radiusX, heightShadowY = 0) {
		const centerX = x + this.cell / 2;
		const centerY = y + this.cell * 0.7 +  heightShadowY; 

		const pi = Math.PI;
		this.ctx.lineWidth = 1;
		this.ctx.beginPath();

		this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
		this.ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";

		const radiusY = radiusX / 2;

		this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2*pi, true);
		this.ctx.stroke();
		this.ctx.fill();
		flyer.shadow = { radius: radiusX, height: heightShadowY };
	}

	collectGiftFromItem(gift, x, y, ctx = this.ctx) {
		const size = GAME_CONFIG.UI.SIZE_GIFT_ON_ITEM_OF_FLYER;
		const pi = Math.PI;
		const radius = this.cell * size ;

		const centerX = x + this.cell / 2;
		const centerY = y + this.cell / 2 + this.cell / 4;

		ctx.beginPath();
		ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
		ctx.strokeStyle = "rgba(255, 255, 255, 1)";
	
		ctx.arc(centerX, centerY, radius, 0, 2*pi, true);
		ctx.stroke();
		ctx.fill();

		ctx.font = "10px Times New Roman, monospace";
		ctx.fillStyle = "rgba(255, 255, 255, 1)";

		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(`${gift.pic}`, centerX, centerY);
	}

	createLoaderForCollect(flyer, width) {
		const x = flyer.route.x + this.cell * 0.2;
		const y = flyer.route.y + this.cell * 0.7;
		const height = this.cell * 0.2;

		this.ctx.fillStyle = "green";
		this.ctx.fillRect(x, y, this.cell * 0.6, height)

		this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
		this.ctx.fillRect(x, y, width, height);

		this.ctx.strokeStyle = 'grey';
		this.ctx.strokeRect(x, y, this.cell * 0.6, height);
	}

	removeFlyItem(item, rowEnd, colEnd, resolve) {

		let isAnimation = true;
		let animationId = null;
		const indent = 5;

		let startTime = null;
		const duration = GAME_CONFIG.ANIMATIONS.TIME_PUT_ITEM_FROM_DRAGON;
		let progress = 0;

		const endX = colEnd * this.cell;
		const endY = rowEnd * this.cell;

		const startX = item.coord.x;
		const startY = item.coord.y;

		if(endX === startX 
		&& endY === startY) {
			this.ctxDrag.clearRect(item.coord.x - indent, item.coord.y - indent, this.cell + indent * 2, this.cell + indent * 2);
			return resolve();
		}

		const putOnBoard = (timeStamp) => {
			if(!isAnimation) { return }

			if(!startTime) { startTime = timeStamp } 
			const elapsed = timeStamp - startTime;
			progress = Math.min(1, elapsed / duration);

			const currentX = startX + (endX - startX) * progress;
			const currentY = startY + (endY - startY) * progress;
		
			this.ctxDrag.clearRect(currentX - indent, currentY - indent, this.cell + indent * 2, this.cell + indent * 2);
			this.collectGiftFromItem(item, currentX, currentY, this.ctxDrag);

			if(progress < 1) {
				animationId = requestAnimationFrame((timeStamp) => putOnBoard(timeStamp));
			} else {
				cancelAnimationFrame(animationId);
				isAnimation = false;
				animationId = null;

				this.ctxDrag.clearRect(endX - indent, endY - indent, this.cell + indent * 2, this.cell + indent * 2);
				return resolve();
			}
		}
		animationId = requestAnimationFrame((timeStamp) => putOnBoard(timeStamp));
	}
}