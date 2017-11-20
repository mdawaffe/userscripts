// ==UserScript==
// @name           GCWaffe Collect TB Codes
// @namespace      https://github.com/mdawaffe/userscripts
// @author         mdawaffe
// @description    Keeps a running list of visited Trackable Pages
// @include        https://www.geocaching.com/track/details.aspx*
// @grant          GM_registerMenuCommand
// @grant          GM_getValue
// @grant          GM_setValue
// @version        1.0.1
// ==/UserScript==

// Originally by http://lifesuche.de/

var stored;

function clearCollection() {
    GM_setValue( "tbcodeshashed", "" );
    alert( "TB Codes Cleared" );
}

GM_registerMenuCommand( "GCWaffe Collect TB Codes - CLEAR", clearCollection );

try {
    stored = new Set( ( GM_getValue( "tbcodeshashed" ) || "" ).split( "|" ) );
    stored.delete( "" );
} catch ( err ) {
    console.error( err );
}

try {
    var GCElement = document.getElementById( "ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode" );
    var GCCode    = GCElement.innerHTML;
    stored.add( GCCode );

    GM_setValue( "tbcodeshashed", Array.from( stored ).join( "|" ) );

    var output = document.getElementById( "Quantcast" );

    output.innerHTML = output.innerHTML + "<p>" + Array.from( stored ).join( "<br />" ) + "</p>";
} catch ( err ) {
    console.log( err );
}