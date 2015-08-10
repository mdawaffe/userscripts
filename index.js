import React from 'react';
import { createRedux, createDispatcher, composeStores } from 'redux';

import App from './containers/App';
import * as stores from './stores';
import * as actions from './actions';
import * as constants from './constants';

import Debug from 'debug';

import Google from './google';

let debug = Debug( 'user-scripts-data:main' );

const CLIENT_ID = '637341514595-35kntouhupplbqms2hs9cg2dr9413vi7.apps.googleusercontent.com';
const SCOPES = [
	'https://www.googleapis.com/auth/drive.file',
];

function logger( dispatch ) {
	let debug = Debug( 'user-scripts-data:action' )
	return function( action ) {
		debug( action );
		return dispatch( action );
	}
}

const store = composeStores( stores );
const dispatcher = createDispatcher( store, [ logger ] );
const redux = createRedux( dispatcher );

let google;

let app = React.render(
	React.createElement( App( redux ), { authorize: function() {
		google.authorize();
	} } ),
	document.getElementById( 'app' )
);

google = new Google( CLIENT_ID, SCOPES, {
	needAuth: function( result ) {	
		redux.dispatch( actions.setPhaseToReady() );
		redux.dispatch( actions.failUser( result.error || "" ) );
	},

	hasAuth: function( user ) {
		redux.dispatch( actions.setUser( user ) );
	},

	loaded: function( list ) {
		app.setState( { list } );

		redux.dispatch( actions.setPhaseToReady() );

		list.asArray().forEach( function( item ) {
			redux.dispatch( actions.addItem( item, 'remote' ) );
		} );

		list.addEventListener( gapi.drive.realtime.EventType.VALUES_ADDED, itemsAdded );
		list.addEventListener( gapi.drive.realtime.EventType.VALUES_REMOVED, itemsRemoved );
		list.addEventListener( gapi.drive.realtime.EventType.VALUES_SET, itemSet );

		function listIndexOf( url ) {
			return list.indexOf( { url }, function( a, b ) {
				return a.url === b.url;
			} );
		}

		function syncer( dispatch ) {
			let debug = Debug( 'user-scripts-data:sync' );

			return function( action ) {
				let ret = dispatch( action );

				if ( ! action.source || 'remote' === action.source ) {
					return ret;
				}

				debug( 'Syncing to remote...' );

				switch ( action.type ) {
				case constants.ITEM_ADD :
					let addIndex = listIndexOf( action.data.url );
					if ( ~ addIndex ) {
						list.replaceRange( addIndex, [ action.data ] );
					} else {
						list.push( action.data );
					}
					break;
				case constants.ITEM_DELETE :
					list.removeValue( action.data );
					break;
				case constants.ITEM_MARK_AS_DONE :
				case constants.ITEM_MARK_AS_UNDONE :
					let markIndex = listIndexOf( action.data.url );
					if ( ~ markIndex ) {
						let item = {...action.data, done: action.type === constants.ITEM_MARK_AS_DONE};
						list.set( markIndex, item );
					}
					break;
				}

				return ret;
			};
		}

		redux.replaceDispatcher( createDispatcher( store, [ logger, syncer ] ) );

		window.removeEventListener( 'message', saveItemsToAdd, false );
		window.addEventListener( 'message', function( event ) {
			if ( ! ~ exectedOrigins.indexOf( event.origin ) ) {
				return;
			}

			event.data.forEach( function( item ) {
				redux.dispatch( actions.addItem( item ) );
			} );
		}, false );

		setTimeout( function() {
			debug( 'Items to Add: %d', window.itemsToAdd.length );
			window.itemsToAdd.forEach( function( item ) {
				redux.dispatch( actions.addItem( item ) );
			} );
		}, 100 );
	}
} );

function itemsAdded( event ) {
	event.values.forEach( function( item ) {
		redux.dispatch( actions.addItem( item, 'remote' ) );
	} )
}

function itemsRemoved( event ) {
	event.values.forEach( function( item ) {
		redux.dispatch( actions.deleteItem( item, 'remote' ) );
	} )
}

function itemSet( event ) {
	for ( let i = 0, l = event.newValues.length; i < l; i++ ) {
		if ( event.newValues[i].done && ! event.oldValues[i].done ) {
			redux.dispatch( actions.markItemAsDone( event.newValues[i], 'remote' ) );
		} else if ( ! event.newValues[i].done && event.oldValues[i].done ) {
			redux.dispatch( actions.markItemAsUndone( event.newValues[i], 'remote' ) );
		}
	}
}
