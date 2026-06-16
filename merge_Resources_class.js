class Resources {
	gold = new ResourcesGold();
	wood = new ResourcesWood();
	crystal = new ResourcesCrystal();
	eventBus = EventBus.getInstance();

	constructor() {
		this.eventBus.on(EVENTS.CMD_INCREASE_RESOURCE, (resource, summ) => {
			this.increaseResources(resource, summ);
		})

		this.eventBus.on(EVENTS.CMD_DECREASE_RESOURCE, (resource, summ) => {
			this.decreaseResources(resource, summ);
		})
	}

	increaseResources(resource, summ) {
		switch(resource) {
			case "gold":    this.gold.increase(summ); break;
			case "wood":    this.wood.increase(summ); break;
			case "crystal": this.crystal.increase(summ); break;
		}
	}

	decreaseResources(resource, summ) {
		switch(resource) {
			case "gold":    this.gold.decrease(summ); break;
			case "wood":    this.wood.decrease(summ); break;
			case "crystal": this.crystal.decrease(summ); break;
		}
	}
}


class ResourcesGold {
	elementScore = document.getElementById('score-gold');
	score = 0;

	constructor() {
		//this.saveBeforeUnload(); //это надо
		this.updateScore();

	}

	updateScore() {
		let gold2 = localStorage.getItem('merge_gold');
		let gold3 = JSON.parse(gold2);
		if(gold3 !== null) {
			this.score = gold3;
		}
		this.elementScore.textContent = `${this.score}`;
	}

	increase(summ) {
		this.score += summ; 
		this.elementScore.textContent = `${this.score}`;
	}
	
	decrease(summ) {
		this.score -= summ;
		this.elementScore.textContent = `${this.score}`;
	}

	saveBeforeUnload() {	
		window.addEventListener('beforeunload', () => {
			let gold1 = JSON.stringify(this.score);
			localStorage.setItem('merge_gold', gold1);
		})
	}
}


class ResourcesWood {
	elementScore = document.getElementById('score-wood');
	score = 0;

	constructor() {
		//this.saveBeforeUnload(); //это надо
		this.updateScore();
	}

	updateScore() {
		let wood2 = localStorage.getItem('merge_wood');
		let wood3 = JSON.parse(wood2);
		if(wood3 !== null) {
			this.score = wood3;
		}
		this.elementScore.textContent = `${this.score}`;
	}

	increase(summ) {
		this.scoreWood += summ; 
		this.elementScore.textContent = `${this.score}`;
	}
	
	decrease(summ) {
		this.score -= summ;
		this.elementScore.textContent = `${this.score}`;
	}

	saveBeforeUnload() {	
		window.addEventListener('beforeunload', () => {
			let wood1 = JSON.stringify(this.score);
			localStorage.setItem('merge_wood', wood1);
		})
	}
}

class ResourcesCrystal {
	elementScore = document.getElementById('score-crystal');
	score = 0;

	constructor() {
		//this.saveBeforeUnload(); //это надо
		this.updateScore();
	}

	updateScore() {
		let crystal2 = localStorage.getItem('merge_crystal');
		let crystal3 = JSON.parse(crystal2);
		if(crystal3 !== null) {
			this.score = crystal3;
		}
		this.elementScore.textContent = `${this.score}`;
	}

	increase(summ) {
		this.score += summ; 
		this.elementScore.textContent = `${this.score}`;
	}
	
	decrease(summ) {
		this.score -= summ;
		this.elementScore.textContent = `${this.score}`;
	}

	saveBeforeUnload() {	
		window.addEventListener('beforeunload', () => {
			let crystal1 = JSON.stringify(this.score);
			localStorage.setItem('merge_crystal', crystal1);
		})
	}
}