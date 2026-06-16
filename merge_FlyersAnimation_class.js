class FlyersAnimation {
	//rows = GAME_CONFIG.BOARD_SIZE.ROWS;
	//cols = GAME_CONFIG.BOARD_SIZE.COLS;

	cell = GAME_CONFIG.BOARD_SIZE.CELL;

	boardWidth = GAME_CONFIG.BOARD_SIZE.BOARD_WIDTH;
	boardHeight = GAME_CONFIG.BOARD_SIZE.BOARD_HEIGHT;

	canvas = document.getElementById("flyer-canvas");
	sizeCanvas = this.canvas.getBoundingClientRect();
	ctx = this.canvas.getContext('2d');

	renderer = new FlyerRendererCanvas();

	constructor() {}
	
	startPatrol(arrFlyers) {
		let isAnimation = true;
		let animationId = null;
		let progressSumm = 0;
		
		const radiusUp = GAME_CONFIG.UI.SIZE_FLYER_SHADOW_RADIUS_UP;
		const radiusDown = GAME_CONFIG.UI.SIZE_FLYER_SHADOW_RADIUS_DOWN;

		const heightDown = GAME_CONFIG.UI.SIZE_FLYER_SHADOW_HEIGHT_DOWN;

		let heightFlyer = this.cell;
		let heightFlyerUp = heightFlyer;
		let heightFlyerDown = heightFlyer;

		const patrolStep = (timeStamp) => {
			this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);

			for(let i = 0; i < arrFlyers.length; i++) {
				const flyer = arrFlyers[i];
				if(!flyer.isPatrolling || flyer.isDraging) {

					if(!flyer.isPatrolling && flyer.isCollect) {
						if(!flyer.startTimeCollect) {flyer.startTimeCollect = timeStamp}
						const elapsed = timeStamp - flyer.startTimeCollect;

						flyer.shadow.radius = radiusDown;
						this.renderer.createFlyer(flyer, flyer.route.x, flyer.route.y, flyer.shadow.radius, 0.1);

						const progress = Math.min(1, elapsed / flyer.timeCollect);
						const width = 0 + (this.cell * 0.6 - 0 ) * progress;
						this.renderer.createLoaderForCollect(flyer, width);
					} else {
						flyer.shadow.radius = Math.max(radiusUp, flyer.shadow.radius - 1);
						flyer.shadow.height = Math.min(heightFlyer, flyer.shadow.height + 1);

						this.renderer.createFlyer(flyer, flyer.route.x, flyer.route.y, flyer.shadow.radius, flyer.shadow.height);

						if(flyer.isDraging) {
							flyer.collectGift = false;
							flyer.isGoUp = false;
							flyer.toItem = false;
							flyer.afterDrag = true;
						}
					}
 
 					flyer.startPos = null;
					flyer.targetPos = null;
					this.startTime = 0;
					flyer.duration = 0;
					continue;
				}

				if(!flyer.currentTarget && !flyer.direction) {
					flyer.chooseNewRandomTarget();
				}

				if(flyer.direction) {
					flyer.setNewTarget(flyer.direction.x, flyer.direction.y);
					flyer.direction = null;
				}

				if(flyer.startPos === null || flyer.targetPos === null) {
					flyer.startPos = { x: flyer.route.x, y: flyer.route.y }
					flyer.targetPos = { x: flyer.currentTarget.x, y: flyer.currentTarget.y }
	
					const distanceX = flyer.targetPos.x - flyer.startPos.x;
					const distanceY = flyer.targetPos.y - flyer.startPos.y;
					flyer.distance = Math.sqrt(distanceX**2 + distanceY**2);

					flyer.duration = flyer.distance === 0 ? 0 : (flyer.distance / flyer.speed) * 1000;
					flyer.startTime = timeStamp;
					flyer.progress = 0;
				}

				if(flyer.duration === 0) {
					flyer.finishCurrentSegment();
					continue;
				}

				if(!flyer.isCollect) { 
					flyer.startTimeCollect = null;
				}

				if(flyer.mission) {
					if(!flyer.shadowStart.radius) {
						flyer.shadowStart.radius = flyer.shadow.radius;
					}

					const radiusStart = flyer.shadowStart.radius;
					flyer.shadow.radius = radiusStart + (radiusDown - radiusStart) * flyer.progress;

					if(!flyer.missionStart) {
						flyer.missionStart = flyer.coordPic;
					}
					const heightStart = flyer.missionStart
					const heightEnd = 0//this.cell * 0.5;
					flyer.shadow.height = heightStart + (heightEnd - heightStart) * flyer.progress;

					heightFlyer = 0;
					heightFlyerUp = 0;
					heightFlyerDown = 0;
				} else {
					flyer.shadowStart = {radius: null, height: null};
					flyer.missionStart = null;
					heightFlyer = this.cell;
					flyer.shadow.height = 0;
				}

				if((flyer.isGoUp || flyer.toItem) && !flyer.mission) {
					const currentTargetX = flyer.currentTarget ? flyer.currentTarget.x : flyer.route.x;
					const currentTargetY = flyer.currentTarget ? flyer.currentTarget.y : flyer.route.y;

					const distanceX = currentTargetX - flyer.route.x;
					const distanceY = currentTargetY - flyer.route.y;
					const distance = Math.sqrt(distanceX**2 + distanceY**2);
					const findDistance = flyer.distance ? flyer.distance * 0.2 : 0;

					const duration = (findDistance / flyer.speed) * 1000;
					
					if(!flyer.startTimeGoUp.up) {flyer.startTimeGoUp.up = timeStamp};
					const elapsedUp = timeStamp - flyer.startTimeGoUp.up;
					const progressUp = Math.min(1, elapsedUp / duration);

					

					if(flyer.isGoUp) {
						if(distance > findDistance && distance > 0) {
							flyer.shadow.radius = radiusDown + (radiusUp - radiusDown) * progressUp;
						}
						heightFlyerUp = 0;
					} else {
						flyer.shadow.radius = radiusUp;
						heightFlyerUp = heightFlyer;
					}

					if(flyer.toItem || flyer.collectGift) {
						if(distance < findDistance && distance > 0) {
							if(!flyer.startTimeGoUp.down) {flyer.startTimeGoUp.down = timeStamp};	
							const elapsedDown = timeStamp - flyer.startTimeGoUp.down;
							const progressDown = Math.min(1, elapsedDown / duration);

							flyer.shadow.radius = radiusUp + (radiusDown - radiusUp) * progressDown;
						} 
						heightFlyerDown = 0;
					} else {
						flyer.shadow.radius = radiusDown + (radiusUp - radiusDown) * progressUp;
						heightFlyerUp = 0;
						heightFlyerDown = heightFlyer;
					} 
				} else {
					flyer.startTimeGoUp = { up: null, down: null };
					heightFlyerUp = heightFlyer;
					heightFlyerDown = heightFlyer;
				}
							
				const elapsed = timeStamp - flyer.startTime;

				flyer.progress = Math.min(1, elapsed / flyer.duration);
				//t = 1 - Math.pow(1-t, 1.5);

				if(flyer.afterDrag) {
					flyer.startPos.y += heightFlyer;
					flyer.afterDrag = false;
				}

				const shadowX = flyer.startPos.x + (flyer.targetPos.x - flyer.startPos.x) * flyer.progress;
				const shadowY = flyer.startPos.y + (flyer.targetPos.y - flyer.startPos.y) * flyer.progress;

				let flyerStart = {x: flyer.startPos.x, y: flyer.startPos.y - heightFlyerUp};
				let heightUpControl = {x: flyer.startPos.x, y: flyer.startPos.y - heightFlyer};
				let heightDownControl = {x: flyer.targetPos.x, y: flyer.targetPos.y - heightFlyer};
				let flyerEnd = {x: flyer.targetPos.x, y: flyer.targetPos.y - heightFlyerDown};

				const flyerX = Math.pow(1 - flyer.progress, 3) * flyerStart.x  
					+ 3 * Math.pow(1 - flyer.progress, 2) * flyer.progress * heightUpControl.x
					+ 3 * (1 - flyer.progress) * Math.pow(flyer.progress, 2) * heightDownControl.x
					+ Math.pow(flyer.progress, 3) * flyerEnd.x

				const flyerY = Math.pow(1 - flyer.progress, 3) * flyerStart.y  
					+ 3 * Math.pow(1 - flyer.progress, 2) * flyer.progress * heightUpControl.y
					+ 3 * (1 - flyer.progress) * Math.pow(flyer.progress, 2) * heightDownControl.y
					+ Math.pow(flyer.progress, 3) * flyerEnd.y

				flyer.coordPic = shadowY - flyerY;

				this.renderer.createFlyer(flyer, flyerX, flyerY);
				this.renderer.createShadow(flyer, flyerX, shadowY, flyer.shadow.radius, flyer.shadow.height);

				if(flyer.progress >= 1) {
					flyer.isGoUp = false;
					if(flyer.collectGift) {
						flyer.manager.putItemOnBoard(flyer);
					} 
					flyer.finishCurrentSegment();
				}
			}
			if(arrFlyers.length > 0) {
				animationId = requestAnimationFrame((timeStamp) => patrolStep(timeStamp));
			}
		}
		animationId = requestAnimationFrame((timeStamp) => patrolStep(timeStamp));
	}
}