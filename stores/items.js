import { ITEM_ADD, ITEM_DELETE, ITEM_MARK_AS_DONE, ITEM_MARK_AS_UNDONE } from '../constants';

export default function items( state = [], action ) {
	switch ( action.type ) {
	case ITEM_ADD :
		return [ ...state.filter( item => item.url !== action.data.url ), action.data ];
	case ITEM_DELETE :
		return [ ...state.filter( item => item.url !== action.data.url ) ];
	case ITEM_MARK_AS_DONE :
		return [ ...state.map( item => {
			if ( item.url === action.data.url ) {
				return {...item, done: true };
			}
			return item;
		} ) ];
	case ITEM_MARK_AS_UNDONE :
		return [ ...state.map( item => {
			if ( item.url === action.data.url ) {
				return {...item, done: false };
			}
			return item;
		} ) ];
	}

	return state;
}
