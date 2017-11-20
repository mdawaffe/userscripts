// ==UserScript==
// @name           Picasaweb Download Links
// @author         mdawaffe
// @namespace      https://github.com/mdawaffe/userscripts/
// @description    Add direct download links to image thumbnails
// @include        http://picasaweb.google.com/*/*
// @version        0.0.1
// @grant          GM_openInTab
// @grant          GM_addStyle
// ==/UserScript==

// Originally from joe.lapoutre.com/gm/picasawebdl
// 0.0.1: Updated by mdawaffe - won't work anyway

// Key for thumbnails is s72, s144, s288 (default s144)
// Thumb: http://lh4.google.com/Acccount/Xm8s8Dm3Cs/AAAAAAAAAh8/Bc_XUpJj3wz/s144/IMG_0001.JPG
// Image: http://lh4.google.com/Acccount/Xm8s8Dm3Cs/AAAAAAAAAh8/Bc_XUpJj3wz/s144/IMG_0001.JPG?imgdl=1


var PicasaWebDL = {
	openFunc: GM_openInTab,
	evtFunc: function(link) {
		return function clicFunc(evt) {
			//if (evt.currentTarget.nodeName.toLowerCase != 'a') return;
			evt.stopPropagation();
			evt.preventDefault();
			evt.returnValue = false;
			PicasaWebDL.openFunc(link);
		};
	},
	initLinks: function() {
		var rows = document.evaluate("//img[contains(@src, '/s144/')]",
				document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var i = 0; i < rows.snapshotLength; i++) {
			var r = rows.snapshotItem(i);
			var href = r.getAttribute('src').replace(/^(.+)\/s144\/(.+)$/, "$1/$2?imgdl=1");
			var a = document.createElement('a');
			a.setAttribute("href", href);
			a.setAttribute("class", "dLink");
			a.setAttribute("title", "Click for image");
			a.appendChild(document.createTextNode('download image'));
			r.parentNode.appendChild(a);
//			r.style.border='1px dotted magenta';
//			r.addEventListener("click", PicasaWebDL.evtFunc(href), false);
		}
	},
	init: function() {
		var btn = document.createElement('input');
		btn.setAttribute('type', 'button');
		btn.setAttribute('value', 'Init Download Links');
		btn.addEventListener('click', PicasaWebDL.initLinks, false);
		btn.style.position = 'fixed';
		btn.style.top = '40px';
		btn.style.right = '120px';
		btn.style.zIndex = '9999';
		var bdys = document.getElementsByTagName('body');
		bdys[0].appendChild(btn);
		GM_addStyle("a.dLink { color: blue; position: absolute; left: 0; bottom: 0; z-index: 999 } a:hover { color: red ! important; }");
	}
};

PicasaWebDL.init();