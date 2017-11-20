// ==UserScript==
// @name           GC Find Counter
// @author         Prime Suspect Software, mdawaffe
// @namespace      https://github.com/mdawaffe/userscripts/
// @description    Add Sequential Find Counter For Logs
// @version        1.65.0
// @include        https://*.geocaching.com/track/log.aspx*
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_getValue
// ==/UserScript==

// Originally: GC Find Counter - http://gmscripts.locusprime.net/

/*
Geocaching Find Counter - v01.64 2011-04-03
(c) 2011, Prime Suspect Software

Greasemonkey user script: see http://greasemonkey.mozdev.org

Compatible with Greasemonkey 0.6.4.

Function:
 Adds a link, which when clicked, insert a number into the textbox, and
 increments the number for next time. The intent is that it is to be
 used by those who include the sequential find number in their find
 logs. A second link shows the actual number that will be inserted into
 the text area.

Usage:
 Clicking on the "Insert Find Count" link will insert the find number
 into the text area, and increment the number. A second link show the
 next number that will be inserted. Clicking on the number displays a
 dialog box that allows you to edit the number.
 The number that will be inserted is displayed in the link. Click it,
 and it will be inserted at the beginning of the log text, and the
 number will be incremented. The

Features:
 Separate counts are maintained for each member profile that uses the PC.
 If a particular account does not want to user the script, setting the
 count value to zero (or blank), will turn it off for that account. To
 turn it back on, use the Tools/User Script Commands menu to set the
 counter value to a non-zero number.

Change Log:
* (v1.65.0) 2017-11-19 Updated by mdawaffe

* (v01.64) 2011-04-03 Update for site changes.

* (v01.63) 2011-02-09 Update for site changes.

* (v01.62) 2010-11-10 Update for site changes.

* (v01.61) 2010-10-16 Fix to accomodate the site's multi-language support.

* (v01.60) 2010-07-31 Update for site changes. Added update notification.

* (v01.50) 2010-01-22 Update for site changes.

* (v01.40) 2008-12-01 Minor change to support the PDA Field Notes script

* (v01.30) 2008-08-02 Fix to accommodate site change.

* (v01.20) 2006-08-17 Clicking link to insert count automatically selects "Found it", if
	no other log type selection has been made.

* (v01.10) Internal modification to work with the v1.1 Log Maximizer script,
	to trigger character count update when count is added to the text area.

* (v01.00) Initial release
*/

	//  Globals.
	var Created = false, SignedInAs, CounterEditText, CounterEdit, e_TxtArea,
			spacer1, spacer2, CounterLink, TimeOutID;



	//  Get currently signed-on geocaching.com profile.
	var SignedInLink = document.evaluate(
			"//a[contains(@class, 'SignedInProfileLink')]",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
			).singleNodeValue;
	if (SignedInLink) {
		var SignedInAs = SignedInLink.firstChild.data;
		SignedInAs = SignedInAs.replace(/<\&amp;>/g, '&');
	} else {
		var e_LogIn = document.getElementById("ctl00_LoginUrl");
		if (!e_LogIn) {
			var e_LogIn = document.getElementById("Header1_urlLogin");
		}
		if (e_LogIn.firstChild.data != 'Log out') { return; }
		SignedInAs = e_LogIn.parentNode.childNodes[1].firstChild.data;
		SignedInAs = SignedInAs.replace(/<\&amp;>/g, '&');
	}



	// Create Greasemonkey Tools menu option to allow user to change settings.
	GM_registerMenuCommand('Enter starting number for Find Count', function() {
		EditCounter();
	});

	//  Create links, if user has not turned if off.
	if (GetCounter() > 0) {
		CreateIt();
	}


// -------------------------------FUNCTIONS-------------------------------- //


	//  Add links to page.
	function CreateIt() {

		//  Get handle to "comment" DT.
		var comDT = document.evaluate('//p[@id = "litDescrCharCount"]',
					document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		comDT = comDT.parentNode;

		//  Get handle to text area.
		e_TxtArea = document.getElementById("ctl00_ContentBody_LogBookPanel1_uxLogInfo");

		//  Create spacer 1.
		spacer1 = document.createElement("small");
		spacer1.id = 'spacer1';
		spacer1.setAttribute('class', 'NoBolding');
		insertAfter(spacer1, comDT.firstChild);

		//  Create Insert Link.
		spacer1.appendChild(document.createElement("br"));
		CounterLink = document.createElement("a");
		CounterLink.id = 'CounterLink';
		CounterLink.title = 'Click to insert find count';
		CounterLink.href = 'javascript:void(0)';
		CounterLink.appendChild(document.createTextNode("Insert Find #"));
		spacer1.appendChild(CounterLink);
		//  Attach function to link.
		CounterLink.addEventListener('mousedown', InsertCounter, false);
		CounterLink.addEventListener('mouseup', ClickBox, false);


		//  Create Edit Link.
		CounterEdit = document.createElement("a");
		CounterEdit.id = 'CounterEdit';
		CounterEdit.title = 'Click to edit find count';
		CounterEdit.style.marginLeft = '10px';
		CounterEdit.href = 'javascript:void(0)';
		CounterEditText = document.createTextNode('');
		CounterEditText.data = GetCounter();
		CounterEdit.appendChild(CounterEditText);
		spacer1.appendChild(CounterEdit);
		//  Attach function to link.
		CounterEdit.addEventListener('click', EditCounter, false);

		//  Attach timer function to update link counter text every 0.75 seconds.
		window.UpdateCounterLinkText = function() {
			if (CounterEditText) {
				TimeOutID = 0;
				CounterEditText.data = GetCounter();
				TimeOutID = window.setTimeout(UpdateCounterLinkText, 750);
			}
		};


		//  Attach timer function to check for external script trigger every 0.75 seconds.
		window.CheckExternalTrigger = function() {
			if (CounterEditText) {
				TimeOutID2 = 0;
				if (eval(CounterLink.getAttribute('clickme'))) {
					CounterLink.setAttribute('clickme', false);
					InsertCounter();
				}
				TimeOutIDs = window.setTimeout(CheckExternalTrigger, 250);
			}
		};

		//  Start timer functions.
		TimeOutID = window.setTimeout(UpdateCounterLinkText, 750);
		TimeOutID2 = window.setTimeout(CheckExternalTrigger, 250);

		//  Set created switch;
		Created = true;
	}

	//  Remove links from page.
	function RemoveIt() {
		if (TimeOutID) {window.clearTimeout(TimeOutID);}
		CounterEditText.parentNode.removeChild(CounterEditText);
		CounterEdit.removeEventListener('click', EditCounter, false);
		CounterEdit.parentNode.removeChild(CounterEdit);
		spacer2.parentNode.removeChild(spacer2);
		CounterLink.removeEventListener('mousedown', InsertCounter, false);
		CounterLink.removeEventListener('mouseup', ClickBox, false);
		CounterLink.parentNode.removeChild(CounterLink);
		spacer1.parentNode.removeChild(spacer1);
		Created = false;
	}

	//  Insert counter into text area.
	function InsertCounter() {
		e_TxtArea.blur();
		var iFindCounter = GetCounter();
		e_TxtArea.value = '( # ' + iFindCounter + " )\n" + e_TxtArea.value;
		iFindCounter++;
		if (CounterEditText) {
			CounterEditText.data = iFindCounter;
		}
		SaveCounter(iFindCounter);
		SetToFound();
		e_TxtArea.focus();
	}

	//  Force update.
	function ClickBox() {
		e_TxtArea.focus();
	}

	// Edit counter value.
	function EditCounter() {
		var RtnVar = prompt('Enter starting number for Find Count', GetCounter());
		//  If Cancel button presses.
		if (RtnVar == null) {return;}
		//  Remove any non-digit characters.
		RtnVar = RtnVar.replace(/\D/g, '');
		if (RtnVar == '') {RtnVar = 0;}
		if (RtnVar > 0) {
			SaveCounter(RtnVar);
			if (!Created) {
				CreateIt();
			} else {
				CounterEditText.data = RtnVar;
			}
		} else {
			var Resp = confirm('Setting the value to blank or zero will turn off ' +
					'\nthe Find Counter for this profile (' + SignedInAs + ').' +
					'\n\nIt can be turned back on by using the Tools / User ' +
					'\nScript Commands menu option.');
			if (Resp) {
				SaveCounter(RtnVar);
				RemoveIt();
			}
		}
	}

	//  Save counter value.
	function SaveCounter(CountVal) {
		GM_setValue('FindCounter_' + SignedInAs, CountVal + '');
	}

	//  Retrieve counter value.
	function GetCounter() {
		var CountVal = GM_getValue('FindCounter_' + SignedInAs);
		if (!CountVal) {
			CountVal = 1;
		}
		return CountVal;
	}

	//  Set drop-down to Found/Attended/Picture Taken.
	function SetToFound() {
		e_ddLogType = document.getElementById('ctl00_ContentBody_LogBookPanel1_ddLogType');
		if (e_ddLogType) {
			if (e_ddLogType.value == -1) {
				for (i = 0; i < e_ddLogType.length; i++) {
					var x = e_ddLogType.options[i].value;
					if ((x == '2' || x == '10' || x == '11')) {
						e_ddLogType.options[i].selected = true;
						break;
					}
				}
			}
		}
	}



	//	Insert element after an existing element.
	function insertAfter(newElement, anchorElement) {
		anchorElement.parentNode.insertBefore(newElement, anchorElement.nextSibling);
	}

	//  Insert element aheadd of an existing element.
	function insertAheadOf(newElement, anchorElement) {
		anchorElement.parentNode.insertBefore(newElement, anchorElement);
	}