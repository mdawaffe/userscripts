chrome.runtime.onMessage.addListener( function( items, sender ) {
	var popupURL = chrome.extension.getURL( 'popup.html' );

	receiver = window.open( popupURL );
	receiver.onload = function() {
		receiver.postMessage( items, popupURL.split( '/' ).slice( 0, 3 ).join( '/' ) );
		console.log( 'sending', items );
	}
} );
