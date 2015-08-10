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
	var items = [], item = {};
	var date, datetimeMS, datetime, today = new Date;

	for ( i = 0; i < l; i++ ) {
		item = {};

		link = links[i];

		if ( ! link.offsetWidth && ! link.offsetHeight && ! link.getClientRects().length ) {
			continue;
		}

		li = link.closest( 'li' );
		date = li.querySelector( '.date' );
		if ( date ) {
			datetimeMS = Date.parse( trim( date.textContent ) + ' ' + trim( li.querySelector( '.time' ).textContent ) )
			if ( isNaN( datetimeMS ) ) {
				datetime = today;
			} else {
				datetime = new Date( datetimeMS );
				if ( today.getUTCMonth() > datetime.getUTCMonth ) {
					datetime.setUTCFullYear( today.getUTCFullYear() - 1 );
				} else {
					datetime.setUTCFullYear( today.getUTCFullYear() );
				}
			}
		} else {
			datetime = today;
		}
		item.datetime = datetime.toISOString();
		item.done = false;
		item.title = trim( link.textContent );
		item.url = 'http://espn.go.com/watchespn/player/_/id/' + link.attributes.onclick.value.match( /\d+/ )[0] + '/';;

		items.push( item );
	}

	if ( 'undefined' !== typeof chrome && chrome.runtime && chrome.runtime.sendMessage ) {
		chrome.runtime.sendMessage( items );
		return;
	}

	var receiver = window.open( 'https://mdawaffe.github.io/userscripts/' );
	setTimeout( function() {
		receiver.postMessage( items, 'https://mdawaffe.github.io' );
	}, 2000 );
}

GM_addStyle( '#calendar-inactive { display: none !important; }' );

setup();
