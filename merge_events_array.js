
const EVENTS = {
	CMD_CREATE_FLYER: 'cmd: createFlyer', 
	CMD_CHANGE_DIRECTION_FLYER: 'cmd: changeDirectionFlyer',

	CMD_ADD_ITEM_IN_GAME: 'cmd: addItemInGAME',
	CMD_ADD_ITEM_FROM_FLAYER: 'cmd: addItemFromFlayer',
	CMD_REMOVE_ITEM: 'cmd: removeItem', //есть это после дракона

	CMD_INCREASE_RESOURCE: 'cmd: increaseResource', 
	CMD_DECREASE_RESOURCE: 'cmd: decreaseResource',

	CMD_SHOW_MESSAGE_FOR_SALE: 'cmd: showMessageForSale', 
	CMD_GAME_AGAIN: 'cmd: goToGameAgain',

	CMD_CLEAR_FOG_AFTER_MERGE: 'cmd: clearFogBeforeMerge', 
	CMD_CLEAR_FOG_AFTER_OPEN_SPHERE: 'cmd: clearFogAfterOpenPoverSphere', 
	CMD_CLEAR_ALL_fOG_IN_CELL: 'cmd: clearAllFogInCell', 
	CMD_CLEAR_FOG_AFTER_MAGIC_WAY: 'cmd: clearFogAfterMagicWay',

	CMD_GENERATE_GIFT: 'cmd: generateGift', //объединить с EVENT_ITEM_PUT_ON_BOARD смотри апдейт
	CMD_TRANSFORMED_ITEM: 'cmd: transformedItem',
	CMD_UPDATE_GIFT: 'cmd: updateGift', 
	CMD_CLEAR_INTERVAL_CREATE_GIFT: 'cmd: clearIntervalCreateGift', 
	CMD_CREATE_TRANSFORM_ITEM: 'cmd: createTransformItem',
	CMD_CREATE_GIFT_BEFORE_CLICK: 'cmd: createGiftOnBoardBeforeClick',
	CMD_CREATE_GIFT: 'cmd: createGift',
	CMD_CREATE_GIFT_FROM_CLICK_ON_ITEM: 'cmd: createGiftOnBoardAfterClickOnItem',

// рисовальники:
	CMD_CREATE_BOARD: 'cmd: createGameBoard',
	CMD_RENDERING_FOG: 'cmd: renderingFog',
	CMD_REMOVE_ALL_FOG_ON_CELL: 'cmd: removeAllFogOnCell',
	CMD_REMOVE_FOG_ON_CELL: 'cmd:removeFogOnCell',

	CMD_RENDERING_MAGIC_WAY: 'cmd: remderingMagicWay', //кажется ее нет

	CMD_RENDERING_DIV_FOR_GIFTS: 'cmd: renderingDivForGifts',
	CMD_RENDERING_GIFT_ON_ITEM: 'cmd: renderingGiftOnItem',
	CMD_RENDERING_REMOVE_GIFT_ON_ITEM: 'cmd: renderingRemoveGiftOnItem',

	CMD_RENDERING_ITEM: 'cmd: itemAddOnBoard',
	CMD_RENDERING_CLEAR_ITEM_FOR_DRAG: 'cmd: clearItemForDrag',
	CMD_RENDERING_SHOW_ITEM_ON_BOARD: 'cmd: renderingShowPutItemOnBoard',
	CMD_RENDERING_PLACE_ITEM_ON_BOARD: 'cmd: renderingPlaceItemOnBoard',
	CMD_RENDERING_SHOW_ITEM_ON_BOARD_AFTER_MERGE: 'cmd: renderingShowPutItemOnBoardAfterMerge',

	CMD_RENDERING_SHOW_BEFORE_REMOVE_ITEM: 'cmd: renderingShowBeforeRemoveItem',
	CMD_RENDERING_REMOVE_ITEM: 'cmd: renderingRemoveItem',
	CMD_RENDERING_ADD_HIGHLIGHTING_ITEM: 'cmd: addHighlightingItems',
	CMD_RENDERING_REMOVE_HIGHLIGHTING_ITEM: 'cmd: removeHighlightingItems',
	CMD_RENDERING_CREATE_MAGIC_WAY_EFFECT: 'cmd: createMagicWayEffect',

	CMD_RENDERING_CREATE_FLYER: 'cmd: renderingCreateFlyer',
	CMD_RENDERING_REMOVE_FLYER: 'cmd: renderingRemoveFlyer',
	//CMD_RENDERING_UPDATE_COORD_FLYER: 'cmd: renderingUpdateCoordFlyer',
	//CMD_RENDERING_GET_COORD_FLYER: 'cmd: getCoordFlyer',
	CMD_RENDERING_COLLECT_GIFT_FROM_ITEM: 'cmd: collectGiftFromItem',
	CMD_RENDERING_PUT_GIFT_FROM_FLYER: 'cmd: renderingPutGiftFromFlyer',
	CMD_RENDERING_CLEAR_FLYER_FOR_DRAG: 'cmd: clearFlyerForDrag',
	CMD_RENDERING_MOVE_FLYER: 'cmd: moveFlyer',
}

