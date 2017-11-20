// ==UserScript==
// @name           GC Seek Show All
// @namespace      https://github.com/mdawaffe/userscripts/
// @author         mdawaffe
// @description    Lists on a single page all geocaches from a search result
// @include        https://www.geocaching.com/seek/nearest.*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @version        1.0.1
// ==/UserScript==

var form = jQuery( '#aspnetForm' );
var table = jQuery( 'table.SearchResultsTable tbody' );
var next = jQuery('.PageBuilderWidget a[href*="__doPostBack"]:first').siblings( 'a:last' );

if ( ! next.length || ! next.text().match( /next/i ) ) {
	return;
}

var nextMatch = next.attr( 'href' ).match( /__doPostBack\s*\(\s*['"]([^'"]*)['"]\s*,\s*['"]([^'"]*)['"]\s*\)/ );

form.find('[name="__EVENTTARGET"]').val( nextMatch[1] ); // Again with the lameness.  Taken from the "Next >" link
form.find('[name="__EVENTARGUMENT"]').val( nextMatch[2] );

function recurseLoad( data ) {
	if ( !data ) {
		data = form.serialize(); // Grab the data that would have been POSTed
	}
	jQuery.post( form.get(0).action, data, parseResponse, 'html' ); // POST it via AJAX instead
}

var d = 100; // Max of 200 pages (the original one and the 199 AJAX loaded ones).
function parseResponse( response ) {
	d--;
	// Parse the responseText as HTML (getting rid of scripts)
	var newPage = jQuery('<div />').append(response.replace(/<script(.|\s)*?\/script>/g, ""));

	table.append( newPage.find( 'table.SearchResultsTable tr' ) );

	// Very important.  This makes sure we keep requesting the *next* page instead of the same one over and over again
	newForm = newPage.find( '#aspnetForm' );
	newForm.find('[name="__EVENTTARGET"]').val( nextMatch[1] );
	newForm.find('[name="__EVENTARGUMENT"]').val( nextMatch[2] );

	if ( 0 < d && newPage.find( 'a[href*="' + nextMatch[1] + '"]' ).length ) {
		recurseLoad( newForm.serialize() ); // There's more - go get it
	} else {
		form.find( '.PageBuilderWidget' ).remove(); // All done, get rid of the nav links.
		table.find( '[id*="AdSpace"]' ).remove();
	}
}

recurseLoad();