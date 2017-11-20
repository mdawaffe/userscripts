// ==UserScript==
// @name         My Movies to IMDB Links
// @namespace    https://github.com/mdawaffe/userscripts/
// @author       mdawaffe
// @description  Generates IMDB links for each line
// @include      https://blogwaffe.com/movies.txt
// @version      1.0.0
// @run-at       document-idle
// ==/UserScript==

var lineReg = new RegExp( '^[^*\\s].+$', 'mg' ),
    body = document.getElementsByTagName( 'body' )[0],
    holder = document.createElement( 'ul' ),
    text = body.textContent,
    line, li, aLink;

while ( body.firstChild ) {
	body.removeChild( body.firstChild );
}
holder.style.listStyle = 'none';
holder.style.margin = '0';
holder.style.padding = '0';
body.appendChild( holder );

line = lineReg.exec( text ); // "CONTENTS"

while ( line = lineReg.exec( text ) ) {
	aLink = document.createElement( 'a' );
	aLink.href = 'http://www.google.com/search?btnI=1&q=site%3Aimdb.com%2Ftitle%2F+' + encodeURIComponent( line[0].replace( '*', '' ) );
	aLink.appendChild( document.createTextNode( line[0] ) );
	li = document.createElement( 'li' );
	li.appendChild( aLink );
	holder.appendChild( li );
}