class SaveData {
	grid = [];
	constructor() {}
	
	hasSaveVersion() {
		let grid2 = localStorage.getItem('merge_grid');
		let grid3 = JSON.parse(grid2);
		if(grid3 !== null) { 
			this.grid = grid3;
		}

		return grid3 !== null;
	}

	conservationGrid(grid) {
		let grid1 = JSON.stringify(grid);
		localStorage.setItem('merge_grid', grid1);
	}

	saveBeforeUnload(grid) {
		window.addEventListener('beforeunload', () => {
			this.conservationGrid(grid);
		});
		window.addEventListener('pagehide', () => {
			this.conservationGrid(grid);
		})
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'hidden') {
				this.conservationGrid(grid);
			}
		})
	}
}