// ==UserScript==
// @name	  GMail Without Ads!
// @namespace     https://github.com/mdawaffe/userscripts/
// @version	  2.3.0
// @description	  GMail without ads, simple as it!
// @author	  mdawaffe
// @include	  https://mail.google.com/*
// @include	  https://*.mail.google.com/*
// @grant         GM_addStyle
// ==/UserScript==

/*
Originally:
jbmarteau: GMail in Blue: Professional skin
MDK: https://thecoreme.org/projects/GMailWa/gmail_without_ads-2.02.user.js

* 2.3.0 - Updated by mdawaffe. No idea if it works :)
* 2.02 - Fixed quick link positioning
* 2.01 - Fixed some dependencies (like Create a document lab feature)
* 2.0  - Fixed the "right-side" labs features (chat and labels)
       - Bumped to a new version
* 1.02 - Fixed the overriding problem with large subjects
* 1.01 - Thanks to kris7topher for fix the border on the right
*/

(function(){

var css = "@namespace url(http://www.w3.org/1999/xhtml); /* QUICK LINKS*/ table.iY > tr > td:first-child + td > div { width: auto !important } table.iY > tr > td:first-child + td + td > div { width: 0 !important; position: relative !important; font-size: 85% !important; } table.iY > tr > td:first-child + td + td > div > div { position: absolute !important; right: 10px !important; top: -2px !important} table.iY div.hj { width: auto !important;} table.iY div.hj div.hk { display: inline !important; padding-right: 3px !important;} /* NO ADS! */ .u5, .u8 { display: none !important;} table[class=\"T1HY1 nH iY\"] { width: 100% !important;} div[class=\"ip iq\"] { margin-right: 13px !important;} textarea.ir { width: 100% !important;}";

if ( typeof GM_addStyle !== "undefined" ) {
	GM_addStyle( css );
} else if ( typeof addStyle !== "undefined" ) {
	addStyle( css );
} else {
	var heads = document.getElementsByTagName( "head" );
	if ( heads.length > 0 ) {
		var node = document.createElement( "style" );

		node.type = "text/css";
		node.appendChild( document.createTextNode( css ) );
		heads[0].appendChild( node );
	}
}
})();