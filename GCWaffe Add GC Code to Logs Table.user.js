// ==UserScript==
// @name           GCWaffe Add GC Code to Logs Table
// @namespace      https://github.com/mdawaffe/userscripts/
// @author         mdawaffe
// @description    Adds a "GC Code" column to GC Logs table
// @include        https://www.geocaching.com/my/logs.aspx*
// @run-at document-idle
// @version        1.0.2
// @grant          none
// ==/UserScript==

jQuery( function( $ ) {
    function GCCodeFromURL( url, callback ) {
		// Don't use .load().  It's easier, but it loads the entire response into the current document to find the selector.
        $.get( url ).success( function( text ) {
            var parser = new DOMParser();
            var doc = parser.parseFromString( text, 'text/html' );
            try {
                var GCCode = doc.querySelector( '.CoordInfoCode' ).innerText;
                callback( null, GCCode );
            } catch ( err ) {
                callback( err );
            }
        } );
    }

	function getGCCode( event ) {
		event.preventDefault();

        var td = $( this ).parent();

        GCCodeFromURL( this.href, function( err, GCCode ) {
            if ( err ) {
                console.error( err );
            } else {
                td.text( GCCode );
            }
        } );
	}

    function getGCCodesFromHereUp( event ) {
		event.preventDefault();

        $( this ).parents( 'tr:first' ).prevAll( 'tr' ).andSelf().find( '.mdawaffe-gc-code' ).each( function() {
			var td = $( this ).parent();

            GCCodeFromURL( this.href, function( err, GCCode ) {
                if ( err ) {
                    console.error( err );
                } else {
                    td.text( GCCode );
                }
            } );
		} );
	}

	$( '.Table' ).find( 'tr' ).has( 'a[href*="geocaching.com/seek/cache_details.aspx"]' ).each( function() {
		var tr = $( this ),
		    a = tr.find( 'a[href*="geocaching.com/seek/cache_details.aspx"]' ),
		    td = $( '<a class="mdawaffe-gc-code">GC#</a>' )
			.attr( 'href', a.attr( 'href' ) )
			.click( getGCCode )
			.wrap( '<td />' )
			.parent()
				.append(
					' ',
					$( '<a href="#">All &uarr;</a>' )
						.attr( 'href', a.attr( 'href' ) )
						.click( getGCCodesFromHereUp )
				);

		tr.find( 'td' ).eq( -2 ).before( td );
	} );
} );