import Debug from 'debug';
let debug = Debug( 'user-scripts-data:store' );

export default function log(state = {}, action) {
	debug( action );
	return state;
}
