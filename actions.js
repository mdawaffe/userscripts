import * as constants from './constants';

export function addItem( item, source = 'local' ) {
	return {
		type: constants.ITEM_ADD,
		data: item,
		source
	};
}

export function deleteItem( item, source = 'local' ) {
	return {
		type: constants.ITEM_DELETE,
		data: item,
		source
	};
}

export function markItemAsDone( item, source = 'local' ) {
	return {
		type: constants.ITEM_MARK_AS_DONE,
		data: item,
		source
	};
}

export function markItemAsUndone( item, source = 'local' ) {
	return {
		type: constants.ITEM_MARK_AS_UNDONE,
		data: item,
		source
	};
}

export function setUser( user ) {
	return {
		type: constants.USER_SET,
		data: user
	}
}

export function failUser( error ) {
	return {
		type: constants.USER_FAIL,
		data: error
	}
}

export function setPhaseToReady() {
	return {
		type: constants.PHASE_READY
	}
}

export function collaboratorsChanged( count ) {
	return {
		type: constants.COLLABORATORS_COUNT,
		data: count
	}
}
