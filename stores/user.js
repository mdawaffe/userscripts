import { USER_SET, USER_FAIL } from '../constants';

export default function user( state = null, action ) {
	switch ( action.type ) {
	case USER_SET :
		return action.data;
	case USER_FAIL :
		return false;
	}
	
	return state;
}
