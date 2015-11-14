import { COLLABORATORS_COUNT } from '../constants';

export default function collaborators( state = 0, action ) {
	switch ( action.type ) {
	case COLLABORATORS_COUNT :
		return action.data;
	}

	return state;
}
