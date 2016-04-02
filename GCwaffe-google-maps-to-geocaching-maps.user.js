// ==UserScript==
// @name        GCWaffe Google Maps -> Geocaching Maps
// @namespace   https://github.com/mdawaffe/userscripts/
// @description When viewing Google Maps, click a button to go to the same place on Geocaching Maps
// @include     https://www.google.com/maps/*
// @version     1.0.5
// @grant       none
// ==/UserScript==

/*
 * https://www.google.com/maps/@47.6490915,-122.3502028,17z
 *  ->
 * https://www.geocaching.com/map/default.aspx#?ll=47.6490915,-122.3502028&z=17
 */
function google2geocaching( url ) {
  var match = url.match(/@([\d.,z-]+)/);

  if (!match.length) {
    return false;
  }

  var pieces = match[1].split(',');

  return 'https://www.geocaching.com/map/default.aspx#?' +
    'll=' + pieces.slice(0, 2).join(',') +
    '&z=' + pieces[2].replace('z', '');
}

function createButtonElement() {
  var button = document.createElement( 'a' );
  button.href = '#Geocaching';
  button.style.display = 'inline-block';
  button.style.height = '30px';
  button.style.verticalAlign = 'middle';
  button.style.marginRight = '-10px';
  button.target = '_blank';
  button.addEventListener( 'click', function( event ) {
    button.href = google2geocaching( document.location.href );
  }, false );

  var image = document.createElement( 'img' );
  image.src = IMAGE_URL;
  image.height = '30';

  button.appendChild( image );

  return button;
}

function findButtonTarget() {
  try {
    // Fragile. If something is broken, it's probably this.
    return document.getElementById( 'vasquette' ).querySelector( '[title="Google apps"]' ).parentNode.parentNode;
  } catch ( e ) {
    return false;
  }
}

function placeButtonElement( buttonElement, target ) {
  target.parentNode.insertBefore( buttonElement, target );
}

var stopAfter = 20;
var interval = setInterval( function() {
  var target;
  stopAfter--;
  if ( stopAfter < 0 ) {
    clearInterval( interval );
    return;
  }

  target = findButtonTarget();
  if ( target ) {
    clearInterval( interval );
  } else {
    return;
  }

  placeButtonElement( createButtonElement(), target );
}, 500 );

// The Geocaching Logo is a registered trademark of Groundspeak, Inc. Used with permission.
// https://www.geocaching.com/
IMAGE_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAA8CAYAAADSfGxZAAAAAX' +
	'NSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAABA9pVFh0WE1MOmNvbS5hZG9iZS54bXAAAA' +
	'AAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlID' +
	'UuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLz' +
	'IyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKIC' +
	'AgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCi' +
	'AgICAgICAgICAgIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cG' +
	'UvUmVzb3VyY2VSZWYjIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb2' +
	'0veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdG' +
	'lmZi8xLjAvIj4KICAgICAgICAgPHhtcE1NOkRlcml2ZWRGcm9tIHJkZjpwYXJzZVR5cGU9IlJlc2' +
	'91cmNlIj4KICAgICAgICAgICAgPHN0UmVmOmluc3RhbmNlSUQ+eG1wLmlpZDpCNUYyODlBOTFCND' +
	'MxMUUzOUM4NkQzMkNCQzk1MDZBQjwvc3RSZWY6aW5zdGFuY2VJRD4KICAgICAgICAgICAgPHN0Um' +
	'VmOmRvY3VtZW50SUQ+eG1wLmRpZDpCNUYyODlBQTFCNDMxMUUzOUM4NkQzMkNCQzk1MDZBQjwvc3' +
	'RSZWY6ZG9jdW1lbnRJRD4KICAgICAgICAgPC94bXBNTTpEZXJpdmVkRnJvbT4KICAgICAgICAgPH' +
	'htcE1NOkRvY3VtZW50SUQ+eG1wLmRpZDpCNUYyODlBQzFCNDMxMUUzOUM4NkQzMkNCQzk1MDZBQj' +
	'wveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDpCNU' +
	'YyODlBQjFCNDMxMUUzOUM4NkQzMkNCQzk1MDZBQjwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgIC' +
	'AgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3M8L3htcDpDcmVhdG' +
	'9yVG9vbD4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KIC' +
	'AgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CoZkTUkAAB' +
	'RTSURBVGgF5Vt9cF3Fdd/de997spARtnEgxgZ/STLImHQ8Qxt33MpfclrjDkwqEygkaRk8lAaMNM' +
	'Q10xl4oTQ4gCNBKHZpS1OmaRILKK1LQTItr+E7GZMAVohl85WxnTamtmVbH+/de3f7++199+l968' +
	'l2/mnXvu/eu3v27Dlnzzl79uyVXNvZ/JYRwhVCKFwOrgwuiau4AEzwIpzGRZh8OCOMUUZKhcoAbV' +
	'Hh87no+Vx/z+Dt2UrZ0SFUb68I1nQ1r5LabBdSjqItH1/U/2zcSe+5Uotk38ODT67pavoymLhUC3' +
	'UKNI94jZm/dMHZFcqVSvvGA3DacVWD1uR3nCrLPXoqVwkdGKEcKQJPA0cIw3ZJFowU6OuhPZZrw4' +
	'ObcIQ3pucCoqQ42jSqhNMU+MQyPmYJ4BlUGNAQq3NEeiSYunrT/IuVUBdoLU5hxk5g9uLx4/EVnN' +
	'0RO89CHIKElulA/43jSmHAEC4NxgJyDEKHMqP6T4N08NuZseBRCASthozbJwoiCMxXcNtFQaHNBw' +
	'xp4B1TbQVdwo6RKqAQLDaOhz5n87J4Ixqk8GKOmqGNGZTKcNQLpZA/NkrOUJgHhwM7MTUX872875' +
	'uDN/sZ/UYsoWLhHEETHMXJvnd3z74H+h/e/4Pd3YO3QXj/gD5kzIe0FTSkJ3Ccf0WfFdnZVeAeco' +
	'Gx8HeiyaasCHOW/2FcEkncLG6g6gelkctQ/3agxTMg7A8cafbRnm3hrKHct2rTvAsaxchKL61fBg' +
	'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';
