const items = { 
	flyItem: { 
		flowers: { pic:  "*" , count: 3 }, 
		water:	 { pic: "<>" , count: 1 }
	},
	
	/*eggsDragon: { type: "eggsDragon", maxLevel: null, set: {
			blackDragon: { pic: '(b)' },
			redDragon: { pic: '(r)' }
			}
	},*/

	eggs: { type: "eggs", maxLevel: null, set: {
			0: { blackDragon: { pic: '(b)' },
			     redDragon:   { pic: '(r)' }
			    }
			}
	},

	flowers: { type: "flowers", maxLevel: 10, set: {
			0:  { level:  0, pic:  "*" , transformed: { type: 'flowers', level: 1, time: 1 * 60 * 1000 } }, 
			1:  { level:  1, pic:  "f1" },
			2:  { level:  2, pic:  "f2", giftCollect: { type: 'sphere', level: 1 } },
			3:  { level:  3, pic:  "f3", giftCollect: { type: 'sphere', level: 1 } },
			4:  { level:  4, pic:  "f4", giftCollect: { type: 'sphere', level: 1 } },
			5:  { level:  5, pic:  "f5", giftCollect: { type: 'sphere', level: 2 } },
			6:  { level:  6, pic:  "f6", giftCollect: { type: 'sphere', level: 2 } },			
			7:  { level:  7, pic:  "f7", giftCollect: { type: 'sphere', level: 2 } },
			8:  { level:  8, pic:  "f8", giftCollect: { type: 'sphere', level: 3 } },
			9:  { level:  9, pic:  "f9", giftCollect: { type: 'sphere', level: 3 } },
			10: { level: 10, pic: "f10", giftCollect: { type: 'sphere', level: 3 } },
			11: { level: 11, pic: "f11", giftCollect: { type: 'sphere', level: 4 } },
			12: { level: 12, pic: "f12", giftCollect: { type: 'sphere', level: 4 } },
			13: { level: 13, pic: "f13", giftCollect: { type: 'sphere', level: 4 } },
			14: { level: 14, pic: "f14", giftCollect: { type: 'sphere', level: 5 } },
			15: { level: 15, pic: "f15", giftCollect: { type: 'sphere', level: 5 } },
			16: { level: 16, pic: "f16", giftCollect: { type: 'sphere', level: 5 } },
			17: { level: 17, pic: "f17", giftCollect: { type: 'sphere', level: 6 } },
			18: { level: 18, pic: "f18", giftCollect: { type: 'sphere', level: 6 } },
			19: { level: 19, pic: "f19", giftCollect: { type: 'sphere', level: 6 } },
			20: { level: 20, pic: "f20", giftCollect: { type: 'sphere', level: 7 } } //тут надо что-то крутое генерить
			}
	},

	/*sphere: {type: "sphere", maxLevel: 10, set: {
			1:  {level:  1, pic:  "(1)", pover:      1 }, // ооооооочень сильно тормозит при отрисовке такого количества анимации
			2:  {level:  2, pic:  "(2)", pover:      4 },
			3:  {level:  3, pic:  "(3)", pover:     16 },
			4:  {level:  4, pic:  "(4)", pover:     64 },
			5:  {level:  5, pic:  "(5)", pover:    256 },
			6:  {level:  6, pic:  "(6)", pover:   1024 },
			7:  {level:  7, pic:  "(7)", pover:   4096 },
			8:  {level:  8, pic:  "(8)", pover:  16384 },
			9:  {level:  9, pic:  "(9)", pover:  65536 },
			10: {level: 10, pic: "(10)", pover: 262144 }
			}
	},*/

	sphere: {type: "sphere", maxLevel: 10, set: {
			1:  {level:  1, pic:  "(1)", pover:  1 }, //старые значения пока просто сохранила
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

	water: { type: "water", maxLevel: 10, set: { //озеро, убрать из первоначальной раскладки
			0:  {level:  0, pic: "<>", transformed: { type: 'mushrooms', level: 1, time: 1 * 60 * 1000 } }, //если лужа не объединена, то появляется гриб
			1:  {level:  1, pic:  "w1" }, 
			2:  {level:  2, pic:  "w2" },
			3:  {level:  3, pic:  "w3" },
			4:  {level:  4, pic:  "w4", gift: {type: 'reed', level: 1, time: 2 * 60 * 1000} },
			5:  {level:  5, pic:  "w5", gift: {type: 'reed', level: 1, time: 1 * 60 * 1000} },
			6:  {level:  6, pic:  "w6", gift: {type: 'reed', level: 2, time: 2 * 60 * 1000} },
			7:  {level:  7, pic:  "w7", gift: {type: 'reed', level: 2, time: 1 * 60 * 1000} },
			8:  {level:  8, pic:  "w8", gift: {type: 'reed', level: 3, time: 2 * 60 * 1000} },
			9:  {level:  9, pic:  "w9", gift: {type: 'reed', level: 3, time: 1 * 60 * 1000} },
			10: {level: 10, pic: "w10", gift: {type: 'reed', level: 4, time: 2 * 60 * 1000} } //фантазия: яйца водяного дракона
			}
	},

	reed: { type: "reed", maxLevel: 10, set: { //камыш, из него начинаются дубы
			 0: {level:  0, pic:  "r0", transformed: { type: 'reed', level: 1, time: 1 * 60 * 1000 } }, //фантазия: если не объединена, то появляется грязь
			 1: {level:  1, pic:  "r1" },
			 2: {level:  2, pic:  "r2" },
			 3: {level:  3, pic:  "r3" },
			 4: {level:  4, pic:  "r4", giftCollect: { type: 'oak', level: 0 } },
			 5: {level:  5, pic:  "r5", giftCollect: { type: 'oak', level: 0 } },
			 6: {level:  6, pic:  "r6", giftCollect: { type: 'oak', level: 1 } },
			 7: {level:  7, pic:  "r7", giftCollect: { type: 'oak', level: 1 } },
			 8: {level:  8, pic:  "r8", giftCollect: { type: 'oak', level: 2 } },
			 9: {level:  9, pic:  "r9", giftCollect: { type: 'oak', level: 2 } },
			10: {level: 10, pic: "r10", giftCollect: { type: 'oak', level: 3 } },
			}
	},

	oak: { type: "oak", maxLevel: 10, set: { //дуб, из него начинается древесина (ресурс)
			  0: {level:  0, pic:  "oak0", transformed: { type: 'oak', level: 1, time: 1 * 60 * 1000 } },
			  1: {level:  1, pic:  "oak1" },
			  2: {level:  2, pic:  "oak2" },
			  3: {level:  3, pic:  "oak3", giftCollect: { type: 'wood', level: 1 } },
			  4: {level:  4, pic:  "oak4", giftCollect: { type: 'wood', level: 1 } },
			  5: {level:  5, pic:  "oak5", giftCollect: { type: 'wood', level: 2 } },
			  6: {level:  6, pic:  "oak6", giftCollect: { type: 'wood', level: 2 } },
			  7: {level:  7, pic:  "oak7", giftCollect: { type: 'wood', level: 3 } },
			  8: {level:  8, pic:  "oak8", giftCollect: { type: 'wood', level: 3 } },
			  9: {level:  9, pic:  "oak9", giftCollect: { type: 'wood', level: 4 } },
			 10: {level: 10, pic: "oak10", giftCollect: { type: 'wood', level: 4 } }
			 }
	},

	wood: { type: "wood", maxLevel: 10, set: { //древесина // реализовать ресурс
			 1: {level:  1, pic:  "wd1"},
			 2: {level:  2, pic:  "wd2"},
			 3: {level:  3, pic:  "wd3"},
			 4: {level:  4, pic:  "wd4"},
			 5: {level:  5, pic:  "wd5"},
			 6: {level:  6, pic:  "wd6"},
			 7: {level:  7, pic:  "wd7"},
			 8: {level:  8, pic:  "wd8"},
			 9: {level:  9, pic:  "wd9"},
			10: {level: 10, pic: "wd10"}
			}
	},
	
	hills: { type: "hills", maxLevel: 10, set: { //холмы
			 1: {level:  1, pic:  "h1" },
			 2: {level:  2, pic:  "h2" },
			 3: {level:  3, pic:  "h3", giftCollect: { type: 'hills', level: 1 } },
			 4: {level:  4, pic:  "h4", giftCollect: { type: 'hills', level: 1 } },
			 5: {level:  5, pic:  "h5", 
					magicCollect: { // думаю лучше сделать массив - для простоты расширения
						0: { type: 'hills', level: 1 },
						1: { type: 'hazel', level: 0 }
					}
			    }, 
			 6: {level:  6, pic:  "h6", 
					magicCollect: {  
						0: { type: 'hills', level: 1 },
						1: { type: 'hazel', level: 0 }
					},
					magicMerge: { type: 'watermill', level: 1 } //случайность при merge 
			    }, 
			 7: {level:  7, pic:  "h7", 
					magicCollect: { 
						0: { type: 'hills', level: 1 },
						1: { type: 'hazel', level: 1 }
					},
					magicMerge: { type: 'watermill', level: 1 } 
			    },
			 8: {level:  8, pic:  "h8", 
					magicCollect: { 
						0: { type: 'hills', level: 1 },
						1: { type: 'hazel', level: 1 }
					},
					magicMerge: { type: 'watermill', level: 2 } 
			    },
			 9: {level:  9, pic:  "h9",
					magicCollect: { 
						0: { type: 'hills', level: 1 },
						1: { type: 'hazel', level: 1 }
					},
					magicMerge: { type: 'watermill', level: 2 } 
			    }, 
			10: {level: 10, pic: "h10",
					magicCollect: { 
						0: { type: 'hills', level: 1 },
						1: { type: 'hazel', level: 1 }
					} 
			   }	
			}	
	},
	
	hazel: { type: "hazel", maxLevel: 10, set: { //орешник
			 0: {level:  0, pic:  "hz0", transformed: { type: 'hazel', level: 1, time: 1 * 60 * 1000 } },
			 1: {level:  1, pic:  "hz1" },
			 2: {level:  2, pic:  "hz2" },
			 3: {level:  3, pic:  "hz3" , giftCollect: { type: 'hazel', level: 0 } },
			 4: {level:  4, pic:  "hz4" , giftCollect: { type: 'hazel', level: 0 } },
			 5: {level:  5, pic:  "hz5" , 
					giftCollect: { type: 'hazel', level: 1 }, 
					magicMerge: { type: 'fir', level: 1 }
			    },
			 6: {level:  6, pic:  "hz6" , 
					giftCollect: { type: 'hazel', level: 1 }, 
					magicMerge: { type: 'fir', level: 1 }
			     },
			 7: {level:  7, pic:  "hz7" ,  
					giftCollect: { type: 'hazel', level: 1 }, 
					magicMerge: { type: 'fir', level: 1 }
			     },
			 8: {level:  8, pic:  "hz8" ,  
					giftCollect: { type: 'hazel', level: 2 }, 
					magicMerge: { type: 'fir', level: 1 }
			     },
			 9: {level:  9, pic:  "hz9" ,  
					giftCollect: { type: 'hazel', level: 2 }, 
					magicMerge: { type: 'fir', level: 2 }
			     },
			10: {level: 10, pic: "hz10" , giftCollect: { type: 'hazel', level: 3 } }
			}
	},  

	fir: { type: "fir", maxLevel: 10, set: { //ель
			 0: {level:  0, pic:  "fir0", transformed: { type: 'fossil', level: 1, time: 10 * 60 * 1000 } },
			 1: {level:  1, pic:  "fir1" },
			 2: {level:  2, pic:  "fir2" },
			 3: {level:  3, pic:  "fir3", giftCollect: { type: 'countryHouse', level: 1 } },
			 4: {level:  4, pic:  "fir4", giftCollect: { type: 'countryHouse', level: 1 } },
			 5: {level:  5, pic:  "fir5", 
					gift: { type: "fir", level: 0, time: 5 * 60 * 1000 }, 
					giftCollect: { type: 'countryHouse', level: 1 } },
			 6: {level:  6, pic:  "fir6", 
					gift: { type: "fir", level: 0, time: 5 * 60 * 1000 }, 
					giftCollect: { type: 'countryHouse', level: 1 } 
				},
			 7: {level:  7, pic:  "fir7", 
					gift: { type: "fir", level: 0, time: 5 * 60 * 1000 }, 
					giftCollect: { type: 'countryHouse', level: 1 } 
				},
			 8: {level:  8, pic:  "fir8",  
					gift: { type: "fir", level: 0, time: 5 * 60 * 1000 }, 
					giftCollect: { type: 'countryHouse', level: 1 } 
				},
			 9: {level:  9, pic:  "fir9",  
					gift: { type: "fir", level: 0, time: 5 * 60 * 1000 }, 
					giftCollect: { type: 'countryHouse', level: 1 } 
				},
			10: {level: 10, pic: "fir10",  
					gift: { type: "fir", level: 0, time: 5 * 60 * 1000 }, 
					giftCollect: { type: 'countryHouse', level: 1 } 
				},
			}
	},

	fossil: { type: "fossil", maxLevel: 10, set: { //окаменелость, руины
			 1: {level:  1, pic:  "fos1" },
			 2: {level:  2, pic:  "fos2", giftCollect: { type: 'stone', level: 0 } },
			 3: {level:  3, pic:  "fos3", giftCollect: { type: 'stone', level: 0 } },
			 4: {level:  4, pic:  "fos4", 
					giftCollect: { type: 'stone', level: 0 }, 
					magicMerge: { type: 'fossil', level: 1 } 
				},
			 5: {level:  5, pic:  "fos5", 
					giftCollect: { type: 'stone', level: 0 }, 
					magicMerge: { type: 'fossil', level: 1 } 
				},
			 6: {level:  6, pic:  "fos6", 
					giftCollect: { type: 'stone', level: 0 },
					gift: { type: "cockleshell", level: 1, time: 1 * 60 * 1000 },
					magicMerge: { type: 'fossil', level: 2 },
				},
			 7: {level:  7, pic:  "fos7",  
					giftCollect: { type: 'stone', level: 0 },
					gift: { type: "cockleshell", level: 1, time: 5 * 60 * 1000 },
					magicMerge: { type: 'fossil', level: 2 } 
				},
			 8: {level:  8, pic:  "fos8",   
					giftCollect: { type: 'stone', level: 0 },
					gift: { type: "cockleshell", level: 1, time: 4 * 60 * 1000 },
					magicMerge: { type: 'fossil', level: 3 } 
				},
			 9: {level:  9, pic:  "fos9",   
					giftCollect: { type: 'stone', level: 0 },
					gift: { type: "cockleshell", level: 1, time: 4 * 60 * 1000 },
					magicMerge: { type: 'fossil', level: 3 } 
				},
			10: {level: 10, pic: "fos10",
  					giftCollect: { type: 'stone', level: 0 },
					gift: { type: "cockleshell", level: 1, time: 3 * 60 * 1000 }
				},
			}
	},
	
	cockleshell: { type: "cockleshell", maxLevel: null, fullCollect: true, set: { //скорлупка
			 1: {level:  1, pic:  "st1",  
					merge: { type: 'gold', level: 4 },
					giftCollect: { type: 'gold', level: 4 }
				}, 
			}
	},

	stone: { type: "stone", maxLevel: 10, set: { //хочу камни медитации с сакурой
			 0: {level:  0, pic:  "st0", giftCollect: { type: 'stone', level: 1 } },
			 1: {level:  1, pic:  "st1" },
			 2: {level:  2, pic:  "st2" },
			 3: {level:  3, pic:  "st3" },
			 4: {level:  4, pic:  "st4" },
			 5: {level:  5, pic:  "st5" },
			 6: {level:  6, pic:  "st6" },
			 7: {level:  7, pic:  "st7" },
			 8: {level:  8, pic:  "st8" },
			 9: {level:  9, pic:  "st9" },
			10: {level: 10, pic: "st10" } // летающие предметы после сферы - золото
			}
	},

	countryHouse: { type: "countryHouse", maxLevel: 5, set: { //дачный домик
			 1: {level:  1, pic:  "ch1" },
			 2: {level:  2, pic:  "ch2" },
			 3: {level:  3, pic:  "ch3" },
			 4: {level:  4, pic:  "ch4" },
			 5: {level:  5, pic:  "ch4" }, //выдает по клику ограниченное количество типов, но рандомное количество
			}
	},
	
	watermill: { type: "watermill", maxLevel: 2, set: {
			 1: { level:  1, pic:  "wm1", 
				gift: { type: "water", level: 0, time: 1 * 60 * 1000 },
				giftOnItem: { type: 'bucket', level: 0, time: 1 * 60 * 1000, count: 2 } //подумать над количеством 
			    },
			 2: { level:  2, pic:  "wm2",  
				gift: { type: "water", level:  0, time: 1 * 60 * 1000 },
				giftOnItem: { type: 'bucket', level: 0, time: 1 * 60 * 1000, count: 4 } 
			    },
			}
	},

	bucket: { type: "bucket", maxLevel: 0, set: {
			 0: { level: 0, pic: "b1" , transformed: { type: 'water', level: 0, time: 0 * 60 * 1000 } } 
			 //1: { level: 1, pic: "b1" , setItems: { type: 'water', level: 0, count: 4 } } //на подумать: клик по ведру - сразу 4 лужи - так быстрее собрать
		}	
	},

	mushrooms: { type: "mushrooms", maxLevel: 10, set: { //тупик: сам себя создает, убрать из первоначальной раскладки => получать только из лужи
			1:  {level:  1, pic:  "m1" }, 
			2:  {level:  2, pic:  "m2" },
			3:  {level:  3, pic:  "m3" },
			4:  {level:  4, pic:  "m4" , giftCollect: { type: 'mushrooms', level: 1 } },
			5:  {level:  5, pic:  "m5" , giftCollect: { type: 'mushrooms', level: 2 } },
			6:  {level:  6, pic:  "m6" , giftCollect: { type: 'mushrooms', level: 3 } },
			7:  {level:  7, pic:  "m7" , giftCollect: { type: 'mushrooms', level: 4 } },
			8:  {level:  8, pic:  "m8" , giftCollect: { type: 'mushrooms', level: 5 } },
			9:  {level:  9, pic:  "m9" , giftCollect: { type: 'mushrooms', level: 6 } },
			10: {level: 10, pic: "m10"} // тут надо что-то классное отдавать по интервалу
			}
	},

	trees: { type: "trees", maxLevel: 10, set: {
			0:  {level:  0, pic: "$", transformed: { type: 'trees', level: 1, time: 1 * 60 * 1000 } }, 
			1:  {level:  1, pic: "t1" },
			2:  {level:  2, pic: "t2" },
			3:  {level:  3, pic: "t3" }, 
			4:  {level:  4, pic: "t4", 
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

	fruit: {type: "fruit", maxLevel: null, fullCollect: true, set: {
			1:  {level: 1, pic: "fr1", 
					merge: { type: 'gold', level: 1 },
					giftCollect: { type: 'gold', level: 1 } 
				}, // при объединении дает золото до 4го уровня
			2:  {level: 2, pic: "fr2", 
					merge: { type: 'gold', level: 1 },
					giftCollect: { type: 'gold', level: 1 } 
				}, 
			3:  {level: 3, pic: "fr3", 
					merge: { type: 'gold', level: 2 },
					giftCollect: { type: 'gold', level: 2 } 
				},
			4:  {level: 4, pic: "fr4", 
					merge: { type: 'gold', level: 2 },
					giftCollect: { type: 'gold', level: 2 } 
				},
			5:  {level: 5, pic: "fr5", 
					merge: { type: 'gold', level: 3 },
					giftCollect: { type: 'gold', level: 3 } 
				},
			6:  {level: 6, pic: "fr6", 
					merge: { type: 'gold', level: 3 },
					giftCollect: { type: 'gold', level: 3 } 
				},
			7:  {level: 7, pic: "fr7", 
					merge: { type: 'gold', level: 4 },
					giftCollect: { type: 'gold', level: 4 } 
				}
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

