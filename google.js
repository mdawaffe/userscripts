import Debug from 'debug';

let debug = Debug( 'user-scripts-data:google' );

export default function Google( client_id, scopes, callbacks ) {
	this.client_id = client_id;
	this.scopes = scopes;
	this.callbacks = callbacks;

	let me = this;

	gapi.load( "auth:client,drive-realtime,drive-share", function() {
		debug( 'loaded Google APIs' );
		gapi.client.load( 'drive', 'v2', function() {
			debug( 'loaded Drive Client' );
			me.check()
		} );
	} );
}

function check() {
	debug( 'checking pre-existing authorization' );
	let me = this;

	gapi.auth.authorize( {
		'client_id': this.client_id,
		'scope': this.scopes,
		'immediate': true
	}, function( result ) {
		if ( ! result || result.error ) {
			debug( 'no pre-existing authorization' );
			return me.callbacks.needAuth( result );
		}

		debug( 'pre-existing authorization' );
		me.ready( result );
	} );
}
Google.prototype.check = check;

function authorize() {
	let me = this;

	gapi.auth.authorize( {
		'client_id': this.client_id,
		'scope': this.scopes,
		'immediate': false
	}, function( result ) {
		if ( ! result || result.error ) {
			debug( 'authorization failure' );
			return me.callbacks.needAuth( result );
		}

		debug( 'authorization success' );
		me.ready( result );
	} );
}
Google.prototype.authorize = authorize;

function ready( result ) {
	let me = this;
	this.callbacks.hasAuth( result );

	let request = gapi.client.drive.files.list( {
		'q': "properties has { key='userscript' and value='1' and visibility='PRIVATE' }"
	} );

	debug( 'Querying Drive for existing file' );
	request.execute( function( results ) {
		if ( ! results || ! results.items.length ) {
			debug( 'File not found' );
			return me.create();
		}

		debug( 'File found' );
		me.use( results.items[0].id );
	} );
}
Google.prototype.ready = ready;

function create() {
	let me = this;
	let request = gapi.client.drive.files.insert( {
		'resource': {
			mimeType: 'application/vnd.google-apps.drive-sdk',
			title: 'User Script Data',
			properties: [
				{
					'key': 'userscript',
					'value': '1',
					'visibility': 'PRIVATE',
				}
			]
		}
	} );

	debug( 'Creating file' );
	request.execute( function( result ) {
		debug( 'File created' );
		me.use( result.id );
	} );
}
Google.prototype.create = create;

function use( fileId ) {
	debug( 'Using file' );
	gapi.drive.realtime.load( fileId, onFileLoaded.bind( this ), initializeFile, onError.bind( this ) );
}
Google.prototype.use = use;

function initializeFile( model ) {
	model.getRoot().set( 'list', model.createList() );
}

function onFileLoaded( file ) {
	debug( 'File loaded!' );
	var model = file.getModel();
	var list = model.getRoot().get( 'list' );

	this.callbacks.loaded( list );
}

function onError( error ) {
	switch ( error.type ) {
	case gapi.drive.realtime.ErrorType.TOKEN_REFRESH_REQUIRED :
		this.check();
		break;
	case gapi.drive.realtime.ErrorType.CLIENT_ERROR :
		console.error( error );
		break;
	case gapi.drive.realtime.ErrorType.NOT_FOUND :
		console.error( error );
		break;
	default :
		console.error( error );
		break;
	}
}
