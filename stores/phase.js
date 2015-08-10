import { PHASE_LOADING, PHASE_READY } from '../constants';

export default function phase( state = PHASE_LOADING, action ) {
	switch ( action.type ) {
	case PHASE_READY :
		return PHASE_READY;
	}
	
	return state;
}
