const items = { 
	flyItem: { 
		flowers: { pic:  "*" , count: 3 }, 
		water:	 { pic: "<>" , count: 1 }
	},
	
	eggsDragon: { type: "eggsDragon", maxLevel: 1, set: {
			blackDragon: { pic: '(b)' },
			redDragon: { pic: '(r)' }
			}
	},

	flowers: { type: "flowers", maxLevel: 10, set: {
			0:  {level:  0, pic: "*" , time: 1 * 60 * 1000 }, 
			1:  {level:  1, pic: "f1", giftCollect: { type: 'sphere', level: 1 } },
			2:  {level:  2, pic: "f2", giftCollect: { type: 'sphere', level: 1 } },
			3:  {level:  3, pic: "f3", giftCollect: { type: 'sphere', level: 2 } },
			4:  {level:  4, pic: "f4", giftCollect: { type: 'sphere', level: 2 } },
			5:  {level:  5, pic: "f5",
				giftCollect: { type: 'sphere', level: 2 },
				giftOnItem:  { type: 'sphere', level: 1, time: 1 * 60 * 1000, count: 1 } 
			    },
			6:  {level:  6, pic: "f6",
				giftOnItem: {type: 'sphere', level: 2, time: 1 * 60 * 1000, count: 1} 
			    },			
			7:  {level:  7, pic: "f7",
				giftOnItem: {type: 'sphere', level: 3, time: 1 * 60 * 1000, count: 1} 
			    },
			8:  {level:  8, pic: "f8",
				giftOnItem: {type: 'sphere', level: 4, time: 1 * 60 * 1000, count: 1} 
			    },
			9:  {level:  9, pic: "f9",
				giftOnItem: {type: 'sphere', level: 5, time: 1 * 60 * 1000, count: 1} 
			    },
			10: {level: 10, pic: "f10",
				giftOnItem: {type: 'sphere', level: 6, time: 1 * 60 * 1000, count: 1} 
			    }
			}
	},
	sphere: {type: "sphere", maxLevel: 10, set: {
			1:  {level:  1, pic:  "(1)", pover:  1 }, 
			2:  {level:  2, pic:  "(2)", pover:  5 },
			3:  {level:  3, pic:  "(3)", pover:  9 },
			4:  {level:  4, pic:  "(4)", pover: 14 },
			5:  {level:  5, pic:  "(5)", pover: 18 },
			6:  {level:  6, pic:  "(6)", pover: 23 },
			7:  {level:  7, pic:  "(7)", pover: 27 },
			8:  {level:  8, pic:  "(8)", pover: 32 },
			9:  {level:  9, pic:  "(9)", pover: 36 },
			10: {level: 10, pic: "(10)", pover: 41 }
			}
	},
	water: { type: "water", maxLevel: 10, set: { 		
			0:  {level:  0, pic: "<>", time: 1 * 60 * 1000 }, //если лужа не объединена, то появляется гриб
			1:  {level:  1, pic: "w1"}, 
			2:  {level:  2, pic: "w2"},
			3:  {level:  3, pic: "w3"},
			4:  {level:  4, pic: "w4",  gift: {type: 'mushrooms', level: 1, time: 2 * 60 * 1000} },
			5:  {level:  5, pic: "w5",  gift: {type: 'mushrooms', level: 1, time: 1 * 60 * 1000} },
			6:  {level:  6, pic: "w6",  gift: {type: 'mushrooms', level: 2, time: 2 * 60 * 1000} },
			7:  {level:  7, pic: "w7",  gift: {type: 'mushrooms', level: 2, time: 1 * 60 * 1000} },
			8:  {level:  8, pic: "w8",  gift: {type: 'mushrooms', level: 3, time: 2 * 60 * 1000} },
			9:  {level:  9, pic: "w9",  gift: {type: 'mushrooms', level: 3, time: 1 * 60 * 1000} },
			10: {level: 10, pic: "w10", gift: {type: 'mushrooms', level: 4, time: 2 * 60 * 1000} }
			}
	},
	mushrooms: {type: "mushrooms", maxLevel: 10, set: {
			1:  {level:  1, pic: "m1" }, 
			2:  {level:  2, pic: "m2" },
			3:  {level:  3, pic: "m3" },
			4:  {level:  4, pic: "m4" },
			5:  {level:  5, pic: "m5" },
			6:  {level:  6, pic: "m6" },
			7:  {level:  7, pic: "m7" },
			8:  {level:  8, pic: "m8" },
			9:  {level:  9, pic: "m9" },
			10: {level: 10, pic: "m10"}
			}
	},
	trees: {type: "trees", maxLevel: 10, set: {
			0:  {level:  0, pic: "$", time: 6 * 60 * 1000 }, 
			1:  {level:  1, pic: "t1"},
			2:  {level:  2, pic: "t2"},
			3:  {level:  3, pic: "t3"}, 
			4:  {level:  4, pic: "t4",  // с 4го уровня создает плоды на себе, по клику скидывает на поле
				giftOnItem: {type: 'fruit', level: 1, time: 1 * 60 * 1000, count: 1} 
			    }, 
			5:  {level:  5, pic: "t5",  
				giftOnItem: {type: 'fruit', level: 2, time: 1 * 60 * 1000, count: 1} 
			    }, 
			6:  {level:  6, pic: "t6",
				gift: {type: 'flowers', level: 1, time: 2 * 60 * 1000 },
				giftOnItem: {type: 'fruit', level: 3, time: 1 * 60 * 1000, count: 2} 
			    }, 
			7:  {level:  7, pic: "t7",
				gift: {type: 'flowers', level: 2, time: 2 * 60 * 1000 },  
				giftOnItem: {type: 'fruit', level: 4, time: 1 * 60 * 1000, count: 2} 
			    },
			8:  {level:  8, pic: "t8",
				gift: {type: 'flowers', level: 3, time: 2 * 60 * 1000 },  
				giftOnItem: {type: 'fruit', level: 5, time: 1 * 60 * 1000, count: 3} 
			    },
			9:  {level:  9, pic: "t9",
				gift: {type: 'flowers', level: 4, time: 2 * 60 * 1000 },  
				giftOnItem: {type: 'fruit', level: 6, time: 1 * 60 * 1000, count: 3} 
			    },
			10: {level: 10, pic: "t10",
				gift: {type: 'flowers', level: 5, time: 2 * 60 * 1000 }, 
				giftOnItem: {type: 'fruit', level: 7, time: 1 * 60 * 1000, count: 4} 
			    }
			}
	},
	fruit: {type: "fruit", maxLevel: 7, set: { // теперь объединит
			1:  {level: 1, pic: "fr1"}, // при объединении дает золото до 4го уровня
			2:  {level: 2, pic: "fr2"},
			3:  {level: 3, pic: "fr3"},
			4:  {level: 4, pic: "fr4"},
			5:  {level: 5, pic: "fr5"},
			6:  {level: 6, pic: "fr6"},
			7:  {level: 7, pic: "fr7"}
			}
	},
	gold: {type: "gold", maxLevel: 10, set: {
			1:  {level:  1, pic:  "G1"},
			2:  {level:  2, pic:  "G2"},
			3:  {level:  3, pic:  "G3"},
			4:  {level:  4, pic:  "G4"},
			5:  {level:  5, pic:  "G5"},
			6:  {level:  6, pic:  "G6"},
			7:  {level:  7, pic:  "G7"},
			8:  {level:  8, pic:  "G8"},
			9:  {level:  9, pic:  "G9"},
			10: {level: 10, pic: "G10"}
			}
	}
}

