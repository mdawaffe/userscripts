// ==UserScript==
// @name        GCwaffe Add Links to Gallery
// @namespace   https://github.com/mdawaffe/userscripts/
// @description Adds links to log and to fullsize image to each image in gallery without having to click through
// @include     http*://www.geocaching.com/seek/gallery*
// @version     0.0.1
// @grant       none
// ==/UserScript==

var tdElement,
    titleHTML,
    titleElement = document.createElement( 'div' ),
    logLink,
    imageLink,
    linksContainer,
    captionElement;

for ( tdElement of document.querySelectorAll( '.GalleryTable td' ) ) {
  console.log( tdElement );
  titleElement.innerHTML = tdElement.querySelector( 'a' ).dataset.title;

  logLink = document.createElement( 'a' );
  logLink.href = titleElement.querySelector( 'a[href*="/seek/"]' ).href;
  logLink.target = '_blank';
  logLink.textContent = 'Log';
  
  imageLink = document.createElement( 'a' );
  imageLink.href = titleElement.querySelector( 'a[href*="img.geocaching.com"]').href.replace( '/large/', '/' );
  imageLink.target = '_blank';
  imageLink.textContent = 'Image';
  
  linksContainer = document.createElement( 'small' );
  linksContainer.appendChild( logLink );
  linksContainer.appendChild( document.createTextNode( ' - ' ) );
  linksContainer.appendChild( imageLink );

  captionElement = tdElement.querySelector( 'strong' );
  captionElement.parentNode.insertBefore( linksContainer, captionElement );
  captionElement.parentNode.insertBefore( document.createTextNode( ' ' ), captionElement );
  captionElement.parentNode.insertBefore( document.createElement( 'br' ), captionElement );
  
}