class SaveData {
	currentVersion = GAME_CONFIG.VERSION_GAME;
	grid = [];
	flyers = [];
	gold = 0;

	gridKey = 'merge_grid';
	flyersKey = 'merge_flyers';
	goldKey = 'merge_gold'
	versionKey = 'merge_version';

	constructor() {
		this.ensureVersion();
	}

	ensureVersion() {
		const savedVersion = localStorage.getItem(this.versionKey);
		if (Number(savedVersion) !== this.currentVersion) {
			//console.log('ensureVersion()', savedVersion);
			this.clearLocalStorage();
			//нужно показать кнопку обновления со сбросом прогресса, событие
		}
	}

	clearLocalStorage() {
		localStorage.removeItem(this.gridKey);
		localStorage.removeItem(this.flyersKey);
		localStorage.removeItem(this.goldKey);
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
		return grid3 !== null;
	}


	conservationGrid(grid, flyersManager, resourcesGold) {
		let gridData = JSON.stringify(grid);
		localStorage.setItem(this.gridKey, gridData);

		let flyers = flyersManager.flyers;
		let flyersClear = this.serializeFlyers(flyers);
		let flyersData = JSON.stringify(flyersClear);
		localStorage.setItem(this.flyersKey, flyersData);

		let gold = resourcesGold.scoreGold
		let goldData = JSON.stringify(gold);
		localStorage.setItem(this.goldKey, goldData);
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