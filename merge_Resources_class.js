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

	updateScore(scoreGold, scoreWood, scoreCrystal) {
		this.gold.updateScore(scoreGold);
		this.wood.updateScore(scoreWood);
		this.crystal.updateScore(scoreCrystal);
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
	}

	updateScore(score) {
		this.score = score;
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
}


class ResourcesWood {
	elementScore = document.getElementById('score-wood');
	score = 0;

	constructor() {
	}

	updateScore(score) {
		this.score = score;
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
}

class ResourcesCrystal {
	elementScore = document.getElementById('score-crystal');
	score = 0;

	constructor() {
	}

	updateScore(score) {
		this.score = score;
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
}