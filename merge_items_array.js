const items = { 
	flyItem: {
		flowers: { pic:  'image/items/flyItem/flyItem_flower.png', count: 3 },
		water:   { pic:  'image/items/flyItem/flyItem_water.png',  count: 1 }
	},

	eggsDragon: { type: "eggsDragon", maxLevel: 1, set: {
			blackDragon: { pic: 'image/items/dragon_eggs/blackDragon_0_level.png' },
			redDragon: { pic: 'image/items/dragon_eggs/redDragon_0_level.png' }
			}
	},

	flowers: { type: "flowers", maxLevel: 10, set: {
			0: { level:  0, pic: 'image/items/flowers/flower_0_level.png', time: 1 * 60 * 1000 },
			1: { level:  1, pic: 'image/items/flowers/flower_1_level.png' },
			2: { level:  2, pic: 'image/items/flowers/flower_2_level.png', giftCollect: { type: 'sphere', level: 1 }, },
			3: { level:  3, pic: 'image/items/flowers/flower_3_level.png', giftCollect: { type: 'sphere', level: 1 }, },
			4: { level:  4, pic: 'image/items/flowers/flower_4_level.png', giftCollect: { type: 'sphere', level: 2 }, },
			5:  {level:  5, pic: 'image/items/flowers/flower_5_level.png',
				giftCollect: { type: 'sphere', level: 2 },
				//giftOnItem: {type: 'sphere', level: 1, time: 1 * 60 * 1000, count: 1}
			},
			6:  {level:  6, pic: 'image/items/flowers/flower_6_level.png',
				giftCollect: { type: 'sphere', level: 3 },
				//giftOnItem: {type: 'sphere', level: 2, time: 1 * 60 * 1000, count: 1}
			},
			7:  {level:  7, pic: 'image/items/flowers/flower_7_level.png',
				giftCollect: { type: 'sphere', level: 4 },
				//giftOnItem: {type: 'sphere', level: 3, time: 1 * 60 * 1000, count: 1}
			},
			8:  {level:  8, pic: 'image/items/flowers/flower_8_level.png',
				giftCollect: { type: 'sphere', level: 5 },
				//giftOnItem: {type: 'sphere', level: 4, time: 1 * 60 * 1000, count: 1}
			},
			9:  {level:  9, pic: 'image/items/flowers/flower_9_level.png',
				giftCollect: { type: 'sphere', level: 6 },
				//giftOnItem: {type: 'sphere', level: 5, time: 1 * 60 * 1000, count: 1}
			},
			10: {level: 10, pic: 'image/items/flowers/flower_10_level.png',
				giftCollect: { type: 'sphere', level: 7 },
				//giftOnItem: {type: 'sphere', level: 6, time: 1 * 60 * 1000, count: 1}
			}
		}
	},
	sphere: {type: "sphere", maxLevel: 10, set: {
			1:  {level:  1, pic: 'image/items/sphere/sphere_1_level.png',  pover:  1 },
			2:  {level:  2, pic: 'image/items/sphere/sphere_2_level.png',  pover:  5 },
			3:  {level:  3, pic: 'image/items/sphere/sphere_3_level.png',  pover:  9 },
			4:  {level:  4, pic: 'image/items/sphere/sphere_4_level.png',  pover: 14 },
			5:  {level:  5, pic: 'image/items/sphere/sphere_5_level.png',  pover: 18 },
			6:  {level:  6, pic: 'image/items/sphere/sphere_6_level.png',  pover: 23 },
			7:  {level:  7, pic: 'image/items/sphere/sphere_7_level.png',  pover: 27 },
			8:  {level:  8, pic: 'image/items/sphere/sphere_8_level.png',  pover: 32 },
			9:  {level:  9, pic: 'image/items/sphere/sphere_9_level.png',  pover: 36 },
			10: {level: 10, pic: 'image/items/sphere/sphere_10_level.png', pover: 41 }
			}
	},
	water: { type: "water", maxLevel: 10, set: {
			0: { level:  0, pic: 'image/items/water/water_0_level.png', time: 1 * 60 * 1000 }, // если лужа объединена, то появляется вода
			1: { level:  1, pic: 'image/items/water/water_1_level.png' }, // gift: {type: 'trees', level: 10, time: 0.5 * 60 * 1000 },
			2: { level:  2, pic: 'image/items/water/water_2_level.png' },
			3: { level:  3, pic: 'image/items/water/water_3_level.png' },
			4:  {level:  4, pic: 'image/items/water/water_4_level.png',
				gift: {type: 'mushrooms', level: 1, time: 2 * 60 * 1000}
			},
			5:  {level:  5, pic: 'image/items/water/water_5_level.png',
				gift: {type: 'mushrooms', level: 1, time: 1 * 60 * 1000}
			},
			6:  {level:  6, pic: 'image/items/water/water_6_level.png',
				gift: {type: 'mushrooms', level: 2, time: 2 * 60 * 1000}
			},
			7:  {level:  7, pic: 'image/items/water/water_7_level.png',
				gift: {type: 'mushrooms', level: 2, time: 1 * 60 * 1000}
			},
			8:  {level:  8, pic: 'image/items/water/water_8_level.png',
				gift: {type: 'mushrooms', level: 3, time: 2 * 60 * 1000}
			},
			9:  {level:  9, pic: 'image/items/water/water_9_level.png',
				gift: {type: 'mushrooms', level: 3, time: 1 * 60 * 1000}
			},
			10: {level: 10, pic: 'image/items/water/water_10_level.png',
				gift: {type: 'mushrooms', level: 4, time: 2 * 60 * 1000}
			}
			}
	},
	mushrooms: {type: "mushrooms", maxLevel: 10, set: {
			1: { level:  1, pic: 'image/items/mushrooms/mushroom_1_level.png' },
			2: { level:  2, pic: 'image/items/mushrooms/mushroom_2_level.png' },
			3: { level:  3, pic: 'image/items/mushrooms/mushroom_3_level.png' },
			4: { level:  4, pic: 'image/items/mushrooms/mushroom_4_level.png' },
			5: { level:  5, pic: 'image/items/mushrooms/mushroom_5_level.png' },
			6: { level:  6, pic: 'image/items/mushrooms/mushroom_6_level.png' },
			7: { level:  7, pic: 'image/items/mushrooms/mushroom_7_level.png' },
			8: { level:  8, pic: 'image/items/mushrooms/mushroom_8_level.png' },
			9: { level:  9, pic: 'image/items/mushrooms/mushroom_9_level.png' },
			10:{ level: 10, pic: 'image/items/mushrooms/mushroom_10_level.png'}
			}
	},
	trees: {type: "trees", maxLevel: 10, set: {
			0:  {level:  0, pic: "$", time: 6 * 60 * 1000 }, // а надо ли??
			1: { level: 1, pic: 'image/items/trees/tree_1_level.png' },
			2: { level: 2, pic: 'image/items/trees/tree_2_level.png' },
			3: { level: 3, pic: 'image/items/trees/tree_3_level.png' },
			4:  {level:  4, pic: 'image/items/trees/tree_4_level.png',  // с 4го уровня создает плоды на себе, по клику скидывает на поле
					giftOnItem: {type: 'fruit', level: 1, time: 1 * 60 * 1000, count: 1}
			    }, 
			5:  {level:  5, pic: 'image/items/trees/tree_5_level.png',
					giftOnItem: {type: 'fruit', level: 2, time: 1 * 60 * 1000, count: 1}
			    }, 
			6:  {level:  6, pic: "image/items/trees/tree_6_level.png",
					gift: {type: 'flowers', level: 1, time: 2 * 60 * 1000 },
					giftOnItem: {type: 'fruit', level: 3, time: 1 * 60 * 1000, count: 2}
			    }, 
			7:  {level:  7, pic: 'image/items/trees/tree_7_level.png',
					gift: {type: 'flowers', level: 2, time: 2 * 60 * 1000 },
					giftOnItem: {type: 'fruit', level: 4, time: 1 * 60 * 1000, count: 2}
			    },
			8:  {level:  8, pic: 'image/items/trees/tree_8_level.png',
					gift: {type: 'flowers', level: 3, time: 2 * 60 * 1000 },
					giftOnItem: {type: 'fruit', level: 5, time: 1 * 60 * 1000, count: 3}
			    },
			9:  {level:  9, pic: 'image/items/trees/tree_9_level.png',
					gift: {type: 'flowers', level: 4, time: 2 * 60 * 1000 },
					giftOnItem: {type: 'fruit', level: 6, time: 1 * 60 * 1000, count: 3}
			    },
			10: {level: 10, pic: 'image/items/trees/tree_10_level.png',
					gift: {type: 'flowers', level: 5, time: 2 * 60 * 1000 },
					giftOnItem: {type: 'fruit', level: 7, time: 1 * 60 * 1000, count: 4}
			    }
			}
	},
	fruit: {type: "fruit", maxLevel: 7, set: { // теперь объединит
			1: { level: 1, pic: 'image/items/fruits/fruit_1_level.png' }, // при объединении дает золото до 4го уровня
			2: { level: 2, pic: 'image/items/fruits/fruit_2_level.png' },
			3: { level: 3, pic: 'image/items/fruits/fruit_3_level.png' },
			4: { level: 4, pic: 'image/items/fruits/fruit_4_level.png' },
			5: { level: 5, pic: 'image/items/fruits/fruit_5_level.png' },
			6: { level: 6, pic: 'image/items/fruits/fruit_6_level.png' },
			7: { level: 7, pic: 'image/items/fruits/fruit_7_level.png' }
			}
	},
	gold: {type: "gold", maxLevel: 10, set: {
			 1: { level:  1, pic: 'image/items/gold/gold_1_level.png' },
			 2: { level:  2, pic: 'image/items/gold/gold_2_level.png' },
			 3: { level:  3, pic: 'image/items/gold/gold_3_level.png' },
			 4: { level:  4, pic: 'image/items/gold/gold_4_level.png' },
			 5: { level:  5, pic: 'image/items/gold/gold_5_level.png' },
			 6: { level:  6, pic: 'image/items/gold/gold_6_level.png' },
			 7: { level:  7, pic: 'image/items/gold/gold_7_level.png' },
			 8: { level:  8, pic: 'image/items/gold/gold_8_level.png' },
			 9: { level:  9, pic: 'image/items/gold/gold_9_level.png' },
			10: { level: 10, pic: 'image/items/gold/gold_10_level.png'}
			}
	}
}

