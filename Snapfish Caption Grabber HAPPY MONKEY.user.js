// ==UserScript==
// @name         Snapfish Caption Grabber HAPPY MONKEY
// @namespace    https://github.com/mdawaffe/userscripts/
// @description  Grabs captions and photos from a Snapfish Caption Page
// @include      http://www1.snapfish.com/*
// @version      0.0.1
// @run-at       document-idle
// ==/UserScript==

function xpath( query ) {
	return document.evaluate(
		query,
		document,
		null,
		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
		null
	);
}

var images = xpath( "//td[not(@width)][@align='right'][@valign='top']/img" );
var captions = xpath( "//textarea" );

var table = "\n<table id='michelle'>\n<tbody>";
var i = 0;
var j = 0;

for ( i = 0; i < images.snapshotLength; i=i + 5 ) {
	table += "\t<tr>\n";
	for ( j = 0; j < 5; j++ ) {
		if ( i + j >= images.snapshotLength ) {
			break;
		}
		table += "\t\t<td><img src='" + images.snapshotItem( i + j ).src + "' /></td>\n";
	}
	table += "\t</tr>\n";

	table += "\t<tr>\n";
	for ( j = 0; j < 5; j++ ) {
		if ( i + j >= captions.snapshotLength ) {
			break;
		}
		table += "\t\t<td>" + captions.snapshotItem( i + j ).value.replace( /\n/g, '<br />' ) + "</td>\n";
	}
	table += "\t</tr>\n";
}

table += '</tbody>\n</table>\n';

document.getElementsByTagName('body')[0].innerHTML = table;