// ==UserScript==
// @match http://espn.go.com/watchespn/*
// @name Show ESPN Video Links
// @namespace mdawaffe
// @description On a Watch ESPN page, adds a button that will open a new tab containing titles and links of the current list of videos.
// @grant GM_openInTab
// @grant GM_addStyle
// @noframes
// @version 0.0.1
// ==/UserScript==

var tabs = document.getElementById( 'tabs' );

var observer = new MutationObserver( function( mutations ) {
	var already = mutations.filter( function( mutation ) {
		var i, l;
		if ( mutation.type !== 'childList' ) {
			return false;
		}

		for ( i = 0, l = mutation.addedNodes.length; i < l; i++ ) {
			if (
				Node.ELEMENT_NODE === mutation.addedNodes[i].nodeType
			&&
				~ mutation.addedNodes[i].className.indexOf( 'mdawaffe' )
			) {
				return true;
			}
		}

		return false;
	} ).length;

	if ( ! already ) {
		setup();
	}
} );

observer.observe( tabs, {
	childList: true,
	subtree: true
} );

function setup() {
	var buttonContainer, nav, navDiv, h2, button, buttonLink;

	if ( ! ~ tabs.querySelector( '.ui-tabs-selected' ).textContent.toLowerCase().indexOf( 'replay' ) ) {
		return;
	}

	buttonContainer = document.querySelector( '.ui-tabs-panel:not( .ui-tabs-hide ) .tabfilterwrapper' );

	if ( buttonContainer.querySelector( '.mdawaffe' ) ) {
		return;
	}

	nav = document.createElement( 'nav' );
	navDiv = document.createElement( 'div' );
	h2 = document.createElement( 'h2' );
	button = document.createElement( 'div' );
	buttonLink = document.createElement( 'a' );

	nav.appendChild( navDiv );
	navDiv.appendChild( h2 );
	navDiv.appendChild( button );
	button.appendChild( buttonLink );

	nav.className = 'mdawaffe';
	navDiv.className = 'ie-nav';
	h2.textContent = 'Save:';
	button.className = 'tabfilter';
	buttonLink.textContent = 'Save Links';
	buttonLink.className = 'expand-nav';
	buttonLink.style.width = '60px';
	buttonLink.href = '#';

	button.addEventListener( 'click', openLinks, false );

	buttonContainer.appendChild( nav );
}

function trim( text ) {
	return text.replace( /^\s+/, '' ).replace( /\s+$/, '' );
}

function openLinks( event ) {
	event.preventDefault();

	var links = event.target.closest( '.ui-tabs-panel' ).querySelectorAll( '.league .event a' );

	var link, li, i, l = links.length;
	var output = '';
	var date, today = new Date;

	for ( i = 0; i < l; i++ ) {
		link = links[i];
		li = link.closest( 'li' );
		date = li.querySelector( '.date' );
		if ( date ) {
			output += trim( date.textContent );
		} else {
			output += today.getMonth().toString() + '/' + today.getDate().toString();
		}
		output += ' ' + li.querySelector( '.time' ).textContent + ': ';
		output += link.textContent.replace( /^\s+/, '' ).replace( /\s+$/, '' );
		output += ': ';
		output += 'http://espn.go.com/watchespn/player/_/id/' + link.attributes.onclick.value.match( /\d+/ )[0] + '/';
		output += '\n';
	}

	GM_openInTab( 'data:text/plain;charset=' + document.characterSet + ',' + encodeURIComponent( output ) );
}

GM_addStyle( '#calendar-inactive { display: none !important; }' );

setup();
