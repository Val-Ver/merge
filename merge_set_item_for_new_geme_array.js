const SET_ITEM_FOR_START_GAME = { 
	1: [ 	{ type: 'flowers', chance: 0.55, levelMin: 1, levelMax: 3 },
	     	{ type: 'hills',   chance: 0.4,  levelMin: 1, levelMax: 2 },
		{ type: 'eggs',    chance: 0.05, levelMin: 0, levelMax: 0, breed: ['blackDragon', 'redDragon'] },
	   ],

	2: [ 	{ type: 'flowers', chance: 0.3,  levelMin: 3, levelMax: 5 },
		{ type: 'hills',   chance: 0.25, levelMin: 2, levelMax: 3 },
		{ type: 'hazel',   chance: 0.25, levelMin: 0, levelMax: 2 },
		{ type: 'trees',   chance: 0.15, levelMin: 0, levelMax: 2 }, 
		{ type: 'eggs',    chance: 0.05, levelMin: 0, levelMax: 0, breed: ['blackDragon', 'redDragon'] },
	   ],

	3: [ 	{ type: 'flowers', chance: 0.2,  levelMin: 5, levelMax: 7 },
		{ type: 'hills',   chance: 0.15, levelMin: 3, levelMax: 4 }, 
		{ type: 'hazel',   chance: 0.15, levelMin: 2, levelMax: 3 },
		{ type: 'trees',   chance: 0.15, levelMin: 2, levelMax: 3 }, 
		{ type: 'water',   chance: 0.15, levelMin: 0, levelMax: 2 },
		{ type: 'fir',     chance: 0.15, levelMin: 0, levelMax: 2 }, 
		{ type: 'eggs',    chance: 0.05, levelMin: 0, levelMax: 0, breed: ['blackDragon', 'redDragon'] },
	   ],

	4: [ 	{ type: 'flowers', chance: 0.15, levelMin: 7, levelMax: 9 },
		{ type: 'hills',   chance: 0.12, levelMin: 4, levelMax: 5 }, 
		{ type: 'hazel',   chance: 0.12, levelMin: 3, levelMax: 4 },
		{ type: 'trees',   chance: 0.12, levelMin: 3, levelMax: 4 }, 
		{ type: 'water',   chance: 0.11, levelMin: 2, levelMax: 3 },
		{ type: 'fir',     chance: 0.11, levelMin: 2, levelMax: 3 }, 
		{ type: 'reed',    chance: 0.11, levelMin: 1, levelMax: 2 },
		{ type: 'oak',     chance: 0.11, levelMin: 0, levelMax: 1 }, 
		{ type: 'eggs',    chance: 0.05, levelMin: 0, levelMax: 0, breed: ['blackDragon', 'redDragon'] },
	   ],

	5: [ 	{ type: 'flowers', chance: 0.1,  levelMin: 7, levelMax: 9 }, // мах
		{ type: 'hills',   chance: 0.1,  levelMin: 5, levelMax: 6 }, // мах
		{ type: 'hazel',   chance: 0.1,  levelMin: 4, levelMax: 5 },
		{ type: 'trees',   chance: 0.1,  levelMin: 4, levelMax: 5 }, 
		{ type: 'water',   chance: 0.1,  levelMin: 3, levelMax: 4 },
		{ type: 'fir',     chance: 0.09, levelMin: 3, levelMax: 4 }, 
		{ type: 'reed',    chance: 0.09, levelMin: 2, levelMax: 3 },
		{ type: 'oak',     chance: 0.09, levelMin: 1, levelMax: 3 }, 
		{ type: 'fossil',  chance: 0.09, levelMin: 1, levelMax: 3 }, 
		{ type: 'stone',   chance: 0.09, levelMin: 1, levelMax: 3 }, 
		{ type: 'eggs',    chance: 0.05, levelMin: 0, levelMax: 0, breed: ['blackDragon', 'redDragon'] },
	   ],

	6: [ 	{ type: 'flowers', chance: 0.1,  levelMin: 7, levelMax: 9 }, // мах
		{ type: 'hills',   chance: 0.1,  levelMin: 5, levelMax: 6 }, // мах 
		{ type: 'hazel',   chance: 0.1,  levelMin: 5, levelMax: 6 }, // мах 
		{ type: 'trees',   chance: 0.1,  levelMin: 5, levelMax: 6 }, // мах 
		{ type: 'water',   chance: 0.1,  levelMin: 4, levelMax: 5 },
		{ type: 'fir',     chance: 0.09, levelMin: 4, levelMax: 5 }, 
		{ type: 'reed',    chance: 0.09, levelMin: 3, levelMax: 4 },
		{ type: 'oak',     chance: 0.09, levelMin: 2, levelMax: 4 }, 
		{ type: 'fossil',  chance: 0.09, levelMin: 2, levelMax: 4 }, 
		{ type: 'stone',   chance: 0.09, levelMin: 2, levelMax: 4 }, 
		{ type: 'eggs',    chance: 0.05, levelMin: 0, levelMax: 0, breed: ['blackDragon', 'redDragon'] },
	   ]
}

