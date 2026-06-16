class SaveData {
	currentVersion = GAME_CONFIG.VERSION_GAME;
	grid = [];
	flyers = [];
	gold = 0;
	wood = 0;
	crystal = 0;

	gridKey = 'merge_grid';
	flyersKey = 'merge_flyers';

	goldKey = 'merge_gold';
	woodKey = 'merge_wood';
	crystalKey = 'merge_crystal';

	versionKey = 'merge_version';
	eventBus = EventBus.getInstance();

	constructor() {
		this.ensureVersion();
		this.eventBus.on(EVENTS.CMD_GAME_AGAIN, () => {
			this.clearVersion()
		})
	}

	ensureVersion() {
		const savedVersion = localStorage.getItem(this.versionKey);
		if (Number(savedVersion) !== this.currentVersion) {
			//console.log('ensureVersion()', savedVersion);
			this.clearLocalStorage();
			//нужно показать кнопку обновления со сбросом прогресса, событие
		}
	}

	clearVersion() {
		localStorage.removeItem(this.versionKey);
		location.reload();
	}

	clearLocalStorage() {
		localStorage.removeItem(this.gridKey);
		localStorage.removeItem(this.flyersKey);
		localStorage.removeItem(this.goldKey);
		localStorage.removeItem(this.woodKey);
		localStorage.removeItem(this.crystalKey);
		localStorage.setItem('merge_version', this.currentVersion);
		location.reload();
	}

	hasSaveVersion() {
		let grid2 = localStorage.getItem(this.gridKey);
		let grid3 = JSON.parse(grid2);
		if(grid3 !== null) { 
			this.grid = grid3;
		}

		let flyers2 = localStorage.getItem(this.flyersKey);
		let flyers3 = JSON.parse(flyers2);
		if(flyers3 !== null) {
			this.flyers = flyers3;
		}

		let gold2 = localStorage.getItem(this.goldKey);
		let gold3 = JSON.parse(gold2);
		if(gold3 !== null) {
			this.gold = gold3;
		}

		let wood2 = localStorage.getItem(this.woodKey);
		let wood3 = JSON.parse(wood2);
		if(wood3 !== null) {
			this.wood = wood3;
		}

		let crystal2 = localStorage.getItem(this.crystalKey);
		let crystal3 = JSON.parse(crystal2);
		if(crystal3 !== null) {
			this.crystal = crystal3;
		}

		return grid3 !== null;
	}

	conservationGrid(grid, flyersManager, resources) {
		let gridData = JSON.stringify(grid);
		localStorage.setItem(this.gridKey, gridData);

		let flyers = flyersManager.flyers;
		let flyersClear = this.serializeFlyers(flyers);
		let flyersData = JSON.stringify(flyersClear);
		localStorage.setItem(this.flyersKey, flyersData);

		let gold = resources.gold.score;
		let goldData = JSON.stringify(gold);
		localStorage.setItem(this.goldKey, goldData);

		let wood = resources.wood.score;
		let woodData = JSON.stringify(wood);
		localStorage.setItem(this.woodKey, woodData);

		let crystal = resources.crystal.score;
		let crystalData = JSON.stringify(crystal);
		localStorage.setItem(this.crystalKey, crystalData);
	}

	serializeFlyers(flyers) {
		const cellSize = GAME_CONFIG.BOARD_SIZE.CELL;
		return flyers.map(flyer => ({
			type: flyer.type,
			level: flyer.level,
			row: Math.floor(flyer.route.y / cellSize),
			col: Math.floor(flyer.route.x / cellSize)
		}));
	}

	saveBeforeUnload(grid, flyersManager, resourcesGold) {
		window.addEventListener('beforeunload', () => {
			this.conservationGrid(grid, flyersManager, resourcesGold);
		});
		window.addEventListener('pagehide', () => {
			this.conservationGrid(grid, flyersManager, resourcesGold);
		})
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'hidden') {
				this.conservationGrid(grid, flyersManager, resourcesGold);
			}
		})
	}
}