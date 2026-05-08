class ResourcesGold {
	elementScoreGold = document.getElementById('score-gold');
	scoreGold = 0;
	eventBus = EventBus.getInstance();

	constructor() {
		//this.saveBeforeUnload(); //это надо
		//this.updateScoreGolg();
		//this.updateElementScoreGold();

		this.subscription();
	}

	subscription() {
		this.eventBus.on(EVENTS.CMD_INCREASE_GOLD, (summ) => {
			this.increaseGold(summ);
		})

		this.eventBus.on(EVENTS.CMD_DECREASE_GOLD, (summ) => {
			this.decreaseGold(summ);
		})
	}


	updateScoreGolg(scoreGold) {
		// let gold2 = localStorage.getItem('merge_gold');
		// let gold3 = JSON.parse(gold2);
		// if(gold3 !== null) {
		//	this.scoreGold = gold3;
		//}
		this.scoreGold = scoreGold;
		this.updateElementScoreGold();
	}

	updateElementScoreGold() {
		this.elementScoreGold.textContent = `${this.scoreGold}`;
	}

	increaseGold(summ) {
		this.scoreGold += summ; 
		this.updateElementScoreGold();
	}
	
	decreaseGold(summ) {
		this.scoreGold -= summ;
		this.updateElementScoreGold();
	}

	// saveBeforeUnload() {	
	// 	window.addEventListener('beforeunload', () => {
	// 		let gold1 = JSON.stringify(this.scoreGold);
	// 		localStorage.setItem('merge_gold', gold1);
	// 	})
	// 	window.addEventListener('pagehide', () => {
	// 		let gold1 = JSON.stringify(this.scoreGold);
	// 		localStorage.setItem('merge_gold', gold1);
	// 	})
	// 	document.addEventListener('visibilitychange', () => {
	// 		if (document.visibilityState === 'hidden') {
	// 			let gold1 = JSON.stringify(this.scoreGold);
	// 			localStorage.setItem('merge_gold', gold1);
	// 		}
	// 	})
	// }

}