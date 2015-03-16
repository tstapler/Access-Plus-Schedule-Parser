//////////////////////////////////////////////////////////////////////////
//                   Javascript file for system R500                    //
//////////////////////////////////////////////////////////////////////////
 
function exportCsv(){
// some data to export
var data = [
  {"subject": "ECON 101", "startDate": "01/12/15", "startTime": "11:00:00 AM", "endDate": "01/12/15", "endTime": "11:50:00 AM", "location": "TBD"},
  {"subject": "INFAS 131", "startDate": "01/12/15", "startTime": "11:00:00 AM", "endDate": "01/12/15", "endTime": "11:50:00 AM", "location": "TBD"},
  {"subject": "ACCT 284", "startDate": "01/13/15", "startTime": "12:40:00 PM", "endDate": "01/13/15", "endTime": "02:00:00 PM", "location": "TBD"}
];
 
// prepare CSV data
var csvData = new Array();
csvData.push('"Subject","Start Date","Start Time","End Date","End Time","Location"');
data.forEach(function(item, index, array) {
  csvData.push('"' + item.subject + '","' + item.startDate + '","' + item.startTime + '","' + item.endDate + '","' + item.endTime + '","' + item.location + '"');
});
 
 
 
 
 
// download stuff
var fileName = "Calendar.csv";
var buffer = csvData.join("\n");
var blob = new Blob([buffer], {
  "type": "text/csv;charset=utf8;"
});
var link = document.createElement("a");
 
if(link.download !== undefined) { // feature detection
  // Browsers that support HTML5 download attribute
  link.setAttribute("href", window.URL.createObjectURL(blob));
  link.setAttribute("download", fileName);
 }
 else if(navigator.msSaveBlob) { // IE 10+
  link.setAttribute("href", "#");
  link.addEventListener("click", function(event) {
    navigator.msSaveBlob(blob, fileName);
  }, false);
}
 
 
link.innerHTML = "Export to CSV";
 
document.body.appendChild(link);
 
link.click();
 
document.body.removeChild(link);
 
return;
 
}
 
function downloadSchedule(){
 
  exportCsv();
 //var x = exportCsv();
 //alert(x);
// saveAs(x,"Calendar.csv");
 //location.href='data:application/download,' + encodeURIComponent(x);
 return;
}
 
 
 
function getCourseMsg(which, year){
	var html = "<iframe src=/R209/R2197.jsp?code=" + which + "&edition=" + year + " onMouseWheel=return(false) onMouseScroll=return(false) style=margin:0;padding:0;width:100%;height:100%; scrolling=no frameborder=0 marginwidth=0 marginheight=0></iframe>";
    return html;
}
 
function showCourse(domobj, which, year, archivepath) {
	if (typeof coursebubblewidth == "undefined") {
		if(typeof bubblewidth == "undefined")
			var coursebubblewidth = 400;
		else
			var coursebubblewidth = bubblewidth;
	}
 
        function showCourseReady(req) {
		if($(req).find("course").length) {
			var html = $(req).find("course").text();
		} else {
			var html = "<p>Course information cannot be found. This course may " +
				"no longer be offered. If you believe there is an error or " +
				"require more information, please contact the course " +
				"department.</p>";
		}
		lfjs.bubble(domobj, html, {width:coursebubblewidth});
	}
 
        function showCourseError(req) {
		var html = "<p>An error occurred trying to load course inormation.  Please try your request again later. ( " + req.status + " - " + req.statusText + ")</p>";
		lfjs.bubble(domobj, html, {
			width: coursebubblewidth
		});
	}
	domobj.blur();
	var gcurl = "proxy.jsp?code=" + encodeURIComponent(which);
	//if there is an archivepath var and an edition var defined, use that in the getCourse call
	if(typeof year != "undefined" && typeof archivepath != "undefined") {
		gcurl += "&edition=" + encodeURIComponent(year);
	}
	$.ajax({
		url:gcurl,
		success:showCourseReady,
		error:showCourseError
	});
	lfjs.bubble(domobj, "Loading course description...", {width:coursebubblewidth});
	return false;
}
 
var lfjs = new Object;
// Utility functions
 
lfjs.isdocumentready = false;
lfjs.path = "";
$(function() { 
	lfjs.isdocumentready = true; 
	lfjs.path = $("script[src$='lfjs.js']:first").attr("src").replace(/\/[^\/]*$/, "");
});
 
lfjs.rfcdate2jsdate = function(in_date) {
	var work_arr = in_date.split(' ');
	var ret_date = new Date(work_arr[2] + " " + work_arr[1] + ", " +
		work_arr[3] + " " + work_arr[4]);
	ret_date.setHours(ret_date.getHours() - ret_date.getTimezoneOffset() / 60);
   return ret_date;
};
 
lfjs.displayDate = function(in_date, format) {
	var month_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
						'Sep', 'Oct', 'Nov', 'Dec'];
	if (!in_date)
		return "";
	var showtime = true;
	if(format == "notime") 
		showtime = false;
	var work_str = "";
	if (format && format == "nice") {
		return month_arr[in_date.getMonth()] + " " + in_date.getDate() +
			", " + in_date.getFullYear() + " " + (in_date.getHours() % 12 == 0 ?
			"12" : in_date.getHours() % 12) +  ":" +
			(100 + in_date.getMinutes()).toString().substring(1) +
			(in_date.getHours() < 12 ? "am" : "pm");
	}
	//support for any format containing %y,%Y,%m,  and %d (i.e. %m/%d/%Y or %Y-%m-%d), %F (full date %Y-%m-%d),
	//		%D (full date %m/%d/%y), %H (hour 00-23), %I (hour 01-12), %k (hour 0-23), %l (hour 1-12),
	//		%M (minute 00-59), %S (seconds 00-60), %p (AM or PM), %P (am or pm);
	if(format && /\%[yYmdFDHIklM]{1}/.test(format)) {
		var shortmonth, shortday, shorthour, hour12hr, shorthour12hr, shortmin;
		var year = in_date.getFullYear();
		var shortyear = (year + "").replace(/.*(\d{2})$/, "$1");
		var month = shortmonth = in_date.getMonth() + 1;
		var hour = shorthout = hour12hr = shorthour12hr = in_date.getHours();
		var minutes = in_date.getMinutes();
		var secs = in_date.getSeconds();
		if(hour < 12)
			var ampm = "AM";
		else
			var ampm = "PM"
		
		if(hour % 12 == 0)
			var hour12hr = shorthour12hr = 12;
		else
			var hour12hr = shorthour12hr = hour % 12;
		if(hour12hr < 10)
			hour12hr = "0" + hour12hr;
		if(month < 10)
			month = "0" + month;
		var day = shortday = in_date.getDate();
		if(day < 10)
			day = "0" + day;
		if(hour < 10)
			hour = "0" + hour;
		if (minutes < 10)
			minutes = "0" + minutes;
		if(secs < 10)
			secs = "0" + secs;
		var retval = format;
		retval = retval.replace(/%F/g, year + "-" + month + "-" + day).replace(/%D/g, month + "/" + day + "/" + shortyear);
		retval = retval.replace(/%Y/g, year).replace(/%y/g, shortyear).replace(/%m/g, month).replace(/%d/g, day);
		retval = retval.replace(/%H/g, hour).replace(/%I/g, hour12hr).replace(/%k/g, shorthour).replace(/%l/g, shorthour12hr);
		retval = retval.replace(/%M/g, minutes).replace(/%M/g, minutes).replace(/%S/g, secs);
		retval = retval.replace(/%p/g, ampm).replace(/%P/g, ampm.toLowerCase());
		return retval;
	}
	var now = new Date();
	var hours_old = Math.abs((now - in_date.getTime()) / 1000 / 60 / 60);
	if ((hours_old < 9 ||
			(hours_old < 24 && now.getDate() == in_date.getDate())) && showtime) {
		if (in_date.getHours() % 12 == 0)
			work_str += "12";
		else
			work_str += in_date.getHours() % 12;
		work_str += ":" +
			(100 + in_date.getMinutes()).toString().substring(1);
		if (in_date.getHours() < 12)
			work_str += "am";
		else
			work_str += "pm";
	} else if (hours_old > (24*30*6) && !showtime) {
		work_str += month_arr[in_date.getMonth()] + " " +
			in_date.getFullYear();
	} else {
		work_str += month_arr[in_date.getMonth()] + " " +
			in_date.getDate();
	}
	return work_str;
};
 
lfjs.toDate = function(in_datestr) {
	// yyyy-mm-dd
	var format1 = /^(\d{4})\-(\d{1,2})\-(\d{1,2})$/;
	// mm/dd/yyyy
	var format2 = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/;
	
	if(format1.test(in_datestr)) {
		var res = format1.exec(in_datestr);
		return new Date(parseInt(res[1],10), (parseInt(res[2],10)-1), parseInt(res[3], 10));
	} else if(format2.test(in_datestr)) {
		var res = format2.exec(in_datestr);
		var thisyear = new Date().getFullYear() + "";
		var year = res[3];
		if(year.length == 2) {
			//use this year as a cutoff for 2000 vs. 1900
			var test = parseInt(thisyear.replace(/.*(\d{2})$/, "$1"),10);
			if(parseInt(year,10) <= test)
				year = "20" + year;
			else
				year = "19" + year;
		} else if (year.length != 4) {
			year = thisyear;
		}
		return new Date(parseInt(year,10), (parseInt(res[1],10)-1), parseInt(res[2], 10));
	}
	return new Date(in_datestr);
};
 
lfjs.makeTextDiv = function(in_contents, in_class) {
	var div = document.createElement("div");
	if (in_class && in_class.length)
		div.className = in_class;
	div.appendChild(document.createTextNode(in_contents));
	return div;
}
 
lfjs.cleanHTML = function(in_str) {
	return in_str.replace(/&/g, "&amp;").replace(/</g, "&lt;");
};
 
lfjs.addEvent = function(el, evname, func) {
   if (typeof el.addEventListener == "function") {
      el.addEventListener(evname, func, true);
   } else {
      el.attachEvent("on" + evname, func);
   }
};
 
lfjs.removeEvent = function(el, evname, func) {
   if (typeof el.removeEventListener == "function") {
      el.removeEventListener(evname, func, true);
   } else {
      el.detachEvent("on" + evname, func);
   }
};
 
lfjs.scrollToShow = function(selEl, parentEl) {
   //Only works in FF if position is set to "relative" of "absolute"
   if(typeof selEl == "string")
      selEl = document.getElementById(selEl);
 
   var scrollGap = selEl.clientHeight / 2;
   if(typeof parentEl == "undefined") {
      // Find the first parent who has overflow set to "scroll"
      for (parentEl = selEl.parentNode;
            parentEl.tagName.toLowerCase() != "body";
            parentEl = parentEl.parentNode) {
         if (parentEl.style.overflow.indexOf("scroll") >= 0 ||
               parentEl.style.overflow.indexOf("auto") >= 0) {
            break;
         }
      }
   } else if(typeof parentEl == "string")
      parentEl = document.getElementById(parentEl);
   if(selEl.offsetTop + selEl.offsetHeight >
         parentEl.scrollTop + parentEl.clientHeight) {
      parentEl.scrollTop = selEl.offsetTop + selEl.offsetHeight -
         parentEl.clientHeight + scrollGap;
      return; // top takes priority over the bottom
   }
 
   if(selEl.offsetTop < parentEl.scrollTop) {
      parentEl.scrollTop = selEl.offsetTop - scrollGap;
   }
};
 
lfjs.setSelectedIndex = function(domobj, value) {
	for (var i=0; i < domobj.options.length; i++) {
		if (domobj.options[i].value == value) {
			domobj.selectedIndex = i;
			return true;
		}
	}
	return false;
}
// Base64 Encoding and decoding
 
lfjs.base64 = {
	chararr: ['A','B','C','D','E','F','G','H', 'I','J','K','L',
				'M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
				'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p',
				'q','r','s','t','u','v','w','x','y','z',
				'0','1','2','3','4','5','6','7','8','9','*','/'],
	decode: function(which) {
		var binary = new String();
		var result = new String();
		for (var i = 0; i < which.length; i++) {
			for (var j = 0; j < lfjs.base64.chararr.length; j++) {
				if(which.charAt(i) == lfjs.base64.chararr[j]) {
					binary += String("000000" + j.toString(2)).
							substring(j.toString(2).length);
         	}
			}
		}
		for (var i = 0; i < binary.length; i+=8) {
			var number = new Number();
			var counter = new Number();
			for (var j = 0; j < binary.substring(i, i+8).length; j++) {
				for (var k = 128; k >= 1; k-=(k/2)) {
					if (binary.substring(i, i+8).charAt(counter++) == "1")
						number += k;
				}
			}
			if (number > 0)
				result += String.fromCharCode(number);
		}
		return result;
	},
 
	encode: function(which) {
		var binary = new String();
		var result = new String();
		for(i = 0; i < which.length; i++) {
			binary += String("00000000" + which.charCodeAt(i).
					toString(2)).substring(which.charCodeAt(i).
					toString(2).length);
		}
		for(i = 0; i < binary.length; i+=6) {
			var number = new Number();
			var counter = new Number();
			for(j = 0; j < binary.substring(i, i+6).length; j++) {
				for(k = 32; k >= 1; k-=(k/2)) {
					if(binary.substring(i, i+6).charAt(counter++) == "1") {
						number += k;
					}
				}
			}
			result += lfjs.base64.chararr[number];
		}
		return result;
	}
};
// lfjs.keypress.installhandler(func)
// lfjs.keypress.stuff(keystring)
 
lfjs.keypress = {
	installhandler: function(func) {
		var oldhandler;
		if (document.onkeypress) {
			var tmpfunc = document.onkeypress;
			oldhandler = tmpfunc("GETFUNC");
		}
		if (!func) {
			document.onkeypress = null;
			if (document.all)
				document.onkeydown = null;
			return oldhandler;
		}
		var keyhandler = func;
		document.onkeypress = function(in_key) {
			if (in_key && in_key == "GETFUNC")
				return keyhandler;
			return lfjs.keypress.keypresshandler(in_key, keyhandler);
		};
		if (document.all) {
			document.onkeydown = function(in_key) {
				return lfjs.keypress.keydownhandler(in_key, keyhandler);
			};
		}
		return oldhandler;
	},
 
	stuff: function(keystr) {
		if (document.onkeypress) {
			var handler = document.onkeypress;
			return handler(keystr);
		} else {
			return false;
		}
	},
 
	// Remaining functions are private
	getNonPrintableChar: function(event) {
		var keyCode = event.keyCode;
		var keyStr = "";
		switch (keyCode) {
			case 112: keyStr += "F1"; break;
			case 113: keyStr += "F2"; break;
			case 114: keyStr += "F3"; break;
			case 115: keyStr += "F4"; break;
			case 116: keyStr += "F5"; break;
			case 117: keyStr += "F6"; break;
			case 118: keyStr += "F7"; break;
			case 119: keyStr += "F8"; break;
			case 120: keyStr += "F9"; break;
			case 121: keyStr += "F10"; break;
			case 122: keyStr += "F11"; break;
			case 123: keyStr += "F12"; break;
			case 38: keyStr += "UP"; break;
			case 40: keyStr += "DOWN"; break;
			case 37: keyStr += "LEFT"; break;
			case 39: keyStr += "RIGHT"; break;
			case 33: keyStr += "PGUP"; break;
			case 34: keyStr += "PGDN"; break;
			case 36: keyStr += "HOME"; break;
			case 35: keyStr += "END"; break;
			case 13: keyStr += "ENTER"; break;
			case 9: keyStr += "TAB"; break;
			case 27: keyStr += "ESC"; break;
			case 8: keyStr += "BACKSPACE"; break;
			case 46: keyStr += "DEL"; break;
			//ignore these here
			case 16: //shift 
			case 17: //ctrl  
			case 18: //alt   
			case 20: //caps lock
				keyStr = "";
				break;
		}
		
		if(keyStr != "") {
			if(event.shiftKey)
				keyStr = "Shift+" + keyStr;
			if(event.ctrlKey || event.ctrlLeft)
				keyStr = "Ctrl+" + keyStr;
			if(event.altKey || event.altLeft)
				keyStr = "Alt+" + keyStr;
		}
			
		return keyStr;
	},
 
	keystring: function(in_key) {
		if (typeof in_key == "string")
			return in_key;
		if (typeof in_key == "undefined")
			in_key = window.event;
 
		var keyStr = "";
		var key_code = in_key.keyCode;
		if (!key_code)
			key_code = in_key.charCode;
		if (typeof in_key.charCode == "undefined")
			in_key.charCode = in_key.keyCode;
		if (in_key.charCode != null && in_key.charCode != 0 && key_code > 30) {
			if (in_key.ctrlKey || in_key.ctrlLeft || in_key.metaKey)
				keyStr += "Ctrl+";
			if (in_key.altKey || in_key.altLeft)
				keyStr += "Alt+";
			keyStr += String.fromCharCode(key_code);
		} else {
			keyStr += lfjs.keypress.getNonPrintableChar(in_key);
		}
		return keyStr;
	},
 
	keydownhandler: function(event, funcname) {
		// IE uses keydown to catch unprintable characters; ignore the
		//    function if keydown was not unprintable
		if (typeof event == "undefined")
			event = window.event;
		var which = lfjs.keypress.getNonPrintableChar(event);
		if (which.length && !funcname(which)) {
			event.returnValue = false;
			event.cancelBubble = true;
			event.keyCode = 0;
			return false;
		}
		return true;
	},
 
	keypresshandler: function(in_key, funcname) {
		// Check to see if keypress was lfjs.keypress.stuff'd
		if (typeof in_key == "string")
			return funcname(in_key);
		// Mozilla and IE (for regular keys) use keypress
		if (!funcname(lfjs.keypress.keystring(in_key))) {
			if (!in_key) {
				in_key = window.event;
				in_key.returnValue = false;
				in_key.cancelBubble = true;
				in_key.keyCode = 0;
			}
			if (in_key.stopPropagation)
				in_key.stopPropagation();
			if (in_key.preventDefault)
				in_key.preventDefault();
			in_key.returnValue = false;
			return false;
		}
		return true;
	}
};
lfjs.window = function(domobj) {
	domobj.mvc = this;
	domobj.activate = function (a) { return this.mvc.activate(a); };
	domobj.deactivate = function () { return this.mvc.deactivate(); };
	$(domobj).addClass("inactivescreen");
	this.win = domobj;
	document.body.appendChild(domobj.parentNode.removeChild(domobj));
}
 
lfjs.window.stack = new Array();
 
lfjs.window.zcounter = 100;
 
lfjs.window.prototype.activate = function(args) {
	if (lfjs.window.stack.length > 0) {
		var last_win = lfjs.window.stack[lfjs.window.stack.length-1].win;
		$(last_win).removeClass("activescreen");
		$(last_win).addClass("inactivescreen");
	} else {
		// Make the body an inactive screen
		$(document.body).addClass("inactivescreen");
	}
	$(this.win).removeClass("inactivescreen");
	$(this.win).addClass("activescreen");
	if (args && args.title) {
		var titlediv = $(this.win).find('.screentitle');
		if (titlediv.size() > 0) {
			titlediv.text(args.title);
		} else {
			var title = lfjs.makeTextDiv(args.title, "screentitle");
			this.win.insertBefore(title, this.win.firstChild);
			new lfjs.dragable(title);
		}
	}
	if (args && args.onactivate)
		this.win.onactivate = args.onactivate;
	if ($(this.win).css("visibility") == "hidden" ||
			$(this.win).css("display") == "none") {
		$(this.win).css("visibility", "hidden");
		$(this.win).css("display", "block");
		var screensize = new Object;
		if (window.innerWidth) {
			screensize.width = window.innerWidth;
			screensize.height = window.innerHeight;
		} else {
			//size appropriately for IE for Quirks vs. Standards mode
			if (document.documentElement &&
						document.documentElement.clientHeight) {
				screensize.width = document.documentElement.clientWidth;
				screensize.height = document.documentElement.clientHeight;
			} else {
				screensize.width = document.body.clientWidth;
				screensize.height = document.body.clientHeight;
			}
		}
		//Position appropriately for IE for Quirks vs. Standards mode
		var scroll = document.body.scrollTop;
		if (!scroll && document.documentElement &&
					 document.documentElement.scrollTop)
			scroll = document.documentElement.scrollTop;
		$(this.win).css({
			left: $(this.win).width() > screensize.width ? 0 :
				parseInt((screensize.width - $(this.win).width()) / 2),
			top:  $(this.win).height() > screensize.height ? scroll :
				parseInt((screensize.height - $(this.win).height()) / 3) + scroll
		});
	}
	// size and activate the modallayer
	if (!lfjs.window.modaldiv) {
		lfjs.window.modaldiv = document.createElement("div");
		//$(lfjs.window.modaldiv).text("modal");
		//document.body.insertBefore(lfjs.window.modaldiv, null);
		document.body.appendChild(lfjs.window.modaldiv);
		lfjs.window.modaldiv.id = "lfjs_modaldiv";
		$(lfjs.window.modaldiv).css(
				{position:"absolute", top:"0px", left:"0px" });
		lfjs.window.modaldiv.onclick = function() { return false; };
		lfjs.addEvent(window, "resize", lfjs.window.resizeModalDiv);
	}
	lfjs.window.resizeModalDiv();
	$(lfjs.window.modaldiv).css(
		{visibility:"visible", display:"block", zIndex:lfjs.window.zcounter++});
 
	if ((args && args.keyhandler) || this.win.keyhandler) {
		// Don't save prior key handler if activate is called because a
		//	window on top was deactivated
		if (!this.lastkeyhandler) {
			this.lastkeyhandler = 
				lfjs.keypress.installhandler((args && args.keyhandler) ?
					args.keyhandler : this.win.keyhandler);
		} else {
			lfjs.keypress.installhandler((args && args.keyhandler) ?
				args.keyhandler : this.win.keyhandler);
		}
	}
	$(this.win).css("zIndex", lfjs.window.zcounter++);
	$(this.win).css("visibility", "visible");
	lfjs.window.stack[lfjs.window.stack.length] = { win: this.win, args: args };
	if (this.win.onactivate)
		this.win.onactivate();
}
 
lfjs.window.prototype.deactivate = function(args) {
	if (lfjs.window.stack.length < 1)
		return;
	$(this.win).removeClass("activescreen");
	$(this.win).addClass("inactivescreen");
	$(this.win).css("display", "none");
	var ourargs = lfjs.window.stack[lfjs.window.stack.length-1].args;
	if (this.lastkeyhandler) {
		lfjs.keypress.installhandler(this.lastkeyhandler);
		this.lastkeyhandler = null;
	} else if (ourargs && ourargs.keyhandler) {
		lfjs.keypress.installhandler(null);
	}
	lfjs.window.stack.length--;
	if (lfjs.window.stack.length > 0) {
		var prior = lfjs.window.stack[lfjs.window.stack.length-1];
		lfjs.window.stack.length--;
		prior.win.activate(prior.args);
	} else {
		$(document.body).removeClass("inactivescreen");
		$(lfjs.window.modaldiv).css("display", "none");
		lfjs.removeEvent(window, "resize", lfjs.window.resizeModalDiv);
	}
}
 
// Static methods
 
lfjs.window.wait = function() {
	if (!lfjs.window.waitdiv) {
      lfjs.window.waitdiv = document.createElement("div");
      document.body.appendChild(lfjs.window.waitdiv);
      lfjs.window.waitdiv.id = "lfjs_waitdiv";
      $(lfjs.window.waitdiv).css(
            {position:"absolute", top:"0px", left:"0px", cursor:"wait" });
      lfjs.window.waitdiv.onclick = function() { return false; };
		if (lfjs.window.stack.length == 0)
			lfjs.addEvent(window, "resize", lfjs.window.resizeWaitDiv);
   }
  	lfjs.window.resizeWaitDiv();
   $(lfjs.window.waitdiv).css(
      {visibility:"visible", display:"block", zIndex:lfjs.window.zcounter++});
	lfjs.window.waitpriorhandler =
			lfjs.keypress.installhandler(lfjs.window.waitkeyhandler);
}
 
lfjs.window.nowait = function() {
	$(lfjs.window.waitdiv).css("display", "none");
	if (lfjs.window.stack.length == 0)
		lfjs.removeEvent(window, "resize", lfjs.window.resizeWaitDiv);
	if (lfjs.window.waitpriorhandler)
		lfjs.keypress.installhandler(lfjs.window.waitpriorhandler);
}
 
// Internal static functions
lfjs.window.resizeFullDiv = function(which) {
	// Remove div to let body size be what it wants
	var div = $(which);
	div.css({display:"none"});
	if(document.compatMode && document.compatMode == "CSS1Compat")
		var refEl = document.documentElement;
	else
		var refEl = document.body;
	if (refEl.scrollHeight > $(window).height())
		div.css( {height:refEl.scrollHeight, width: "100%" } );
	else
		div.css( { height:$(window).height(), width: "100%" } );
	div.css({display:"block"});
}
 
 
lfjs.window.resizeModalDiv = function() {
	lfjs.window.resizeFullDiv(lfjs.window.modaldiv);
}
 
lfjs.window.resizeWaitDiv = function() {
	lfjs.window.resizeFullDiv(lfjs.window.waitdiv);
}
 
lfjs.window.waitkeyhandler = function(in_key) {
	if (in_key == "TAB" || (in_key.length == 1 && in_key >= ' ' &&
				in_key <= '~'))
		return false;           // Ignore al-nums; allow control keys
	return true;
}
 
// Initialize code
$(function() {
	$('.screen').each(function(i) { new lfjs.window(this); });
	$('.screentitle').each(function(i) {
		if (!$(this).hasClass("dragable")) {
			new lfjs.dragable(this);
		}
	});
});
// automatically turn any div of type "selectgrid" into a selectgrid object
// functions: addrow, removerow, getselected, empty
// addRow(id, cols[html], args{})
//		ondblclick: function(id)
//		onclick: function(id) (default: select current row)
//		classname: classname
//		title: title
 
lfjs.grid = function(domobj) {
	this.div = domobj;
	this.allowHTML = true;
	domobj.mvc = this;
	domobj.addRow = function (a, b, c) { return this.mvc.addRow(a, b, c); };
	domobj.setHeaders = function (a) { return this.mvc.setHeaders(a); };
	domobj.removeRow = function (a) { return this.mvc.removeRow(a); };
	domobj.empty = function () { return this.mvc.empty(); };
	domobj.getSelectedTR = function() { return this.mvc.getSelectedTR(); }
	domobj.getSelectedIndex = function() { return this.mvc.getSelectedIndex(); }
	domobj.getSelectedId = function() { return this.mvc.getSelectedId(); }
	domobj.getSelectedData = function() { return this.mvc.getSelectedData(); }
	domobj.selectRow = function(inrow) { return this.mvc.selectRow(inrow); }
	domobj.selectNext = function(dir) { return this.mvc.selectNext(dir); }
	domobj.setData = function(a, b) { return this.mvc.setData(a, b); }
	domobj.pause = function(a) { return this.mvc.pause(a); }
	domobj.setColWidths = function(a, b) { return this.mvc.setColWidths(a, b); }
	if ($(domobj).find("table").size() < 1) {
		this.table = document.createElement("table");
		domobj.appendChild(this.table);
	} else {
		this.table = $(domobj).find("table")[0];
	}
	this.table.width = "100%";
	this.table.cellSpacing = 0;
	if ($(domobj).find("colgroup").size() < 1) {
		this.colgroup = document.createElement("colgroup");
		this.table.appendChild(this.colgroup);
	}
	if ($(domobj).find("tbody").size() < 1) {
		this.tbody = document.createElement("tbody");
		this.table.appendChild(this.tbody);
	} else {
		this.tbody = $(domobj).find("tbody")[0];
	}
	if ($(domobj).find("thead").size() < 1) {
		this.thead = document.createElement("thead");
		this.table.insertBefore(this.thead, this.tbody);
	} else {
		this.thead= $(domobj).find("thead")[0];
	}
}
 
// Times: 11/51 (createElement, .append())
lfjs.grid.prototype.addRow = function(id, cols, args) {
	var tr = null, doappend = true;
	if (!args || !args.fastadd) {
		$(this.tbody).children().each(function (i) {
			if (this.selectid == id) {
				tr = this;
				doappend = false;
				$(this).empty();
				return false;
			}
		});
	}
	if (!tr) {
		tr = document.createElement("tr");
		if (!(this.tbody.childNodes.length % 2))
			tr.className = "odd";
	}
	tr.selectid = id;
	tr.gridobj = this;
	var gridobj = this;
	if (args && args.data)
		tr.data = args.data;
	if (args && args.classname)
		$(tr).addClass(args.classname);
	if (args && args.onclick) {
		var clickfunc = args.onclick;
		tr.onclickfunc = clickfunc;
		tr.onclick = function() {
			var funcval = clickfunc(this.selectid, this);
			if (typeof funcval == "undefined" || funcval)
				gridobj.selectRow(this); };
	} else {
		tr.onclick = function() { gridobj.selectRow(this); };
	}
	if (args && args.ondblclick) {
		var dblfunc = args.ondblclick;
		tr.ondblclick = function() { dblfunc(this.selectid, this); };
	}
	if (args && args.title)
		tr.title = args.title;
	for (var i=0; i < cols.length; i++) {
		var td = document.createElement("td");
		if (!i && cols.length == 1)
			td.className = "firstcolumn lastcolumn";
		else if (!i)
			td.className = "firstcolumn";
		else if (i == cols.length - 1)
			td.className = "lastcolumn";
			
		if(args && args.html)
			td.innerHTML = cols[i];
		else
			td.appendChild(document.createTextNode(cols[i]));
		tr.appendChild(td);
	}
	if (doappend)
		this.tbody.appendChild(tr);
	return tr;
}
 
lfjs.grid.prototype.setHeaders = function(colobjs, args) {
	$(this.thead).empty();
	tr = document.createElement("tr");
	$(this.thead).append(tr);
	for (var i=0; i < colobjs.length; i++) {
		var th = $(document.createElement("th"));
		th.text(colobjs[i].name);
		if (colobjs[i].classname)
			th.addClass(colobjs[i].classname);
		if (colobjs[i].onclick) {
			lfjs.grid.setClickFunc(th[0], colobjs[i].onclick,
					colobjs[i].id ? colobjs[i].id : colobjs[i].name, i,
					colobjs[i].name, this.div);
		}
		if (colobjs[i].title)
			th[0].title = colobjs[i].title;
		$(tr).append(th);
	}
}
 
// Private function; used to get enclosures inside of loops
lfjs.grid.setClickFunc = function(in_obj, in_func, in_id, in_index,
			in_name, in_divobj) {
	var func = in_func;
	var id = in_id;
	var index = in_index;
	var name = in_name;
	var divobj = in_divobj;
	var obj = in_obj;
	obj.onclick = function() { func(id, index, name, obj, divobj) };
}
 
lfjs.grid.prototype.removeRow = function(which) {
	var thisobj = this;
	$(this.tbody).children().each(function(i) {
		if (this.selectid == which) {
			if ($(this).hasClass("selected"))
				thisobj.selectNext();
			this.parentNode.removeChild(this);
			return false;
		}
	});
}
 
lfjs.grid.prototype.empty = function() {
	//$(this.tbody).html("");		// This was very slow; so was ".empty()"
	while (this.tbody.lastChild)
		this.tbody.removeChild(this.tbody.lastChild);
	this.div.data = null;
}
 
lfjs.grid.prototype.selectRow = function(which) {
	if (!which) {
		$(this.tbody).children().removeClass("selected");
		return;
	}
	if (typeof which != "object") {
		// Find the row with this ID
		var trobj = null;
		$(this.div).find("tr").each( function(i) {
			if (this.selectid == which) {
				trobj = this;
				return false;
			}
		});
		if (!trobj)
			return;
		which = trobj;
	}
	var row = $(which);
	// Shortcut to the data block
	this.div.data = row[0].data;
	row.siblings().removeClass("selected");
	row.addClass("selected");
	// Scroll up to keep header in view
	if (!which.previousSibling && this.thead.firstChild)
		which = this.thead.firstChild;
	lfjs.scrollToShow(which, this.div);
}
 
lfjs.grid.prototype.getSelectedAttribute = function(which) {
	var selrow = $(this.tbody).children().filter(".selected");
	if (selrow.size() == 1)
		return selrow[0][which];
	else
		return null;
}
 
lfjs.grid.prototype.getSelectedTR = function() {
	var selrow = $(this.tbody).children().filter("TR.selected");
	if (selrow.size() == 1)
		return selrow[0];
	else
		return null;
} 
 
lfjs.grid.prototype.getSelectedIndex = function() {
	return $(this.tbody).children("tr").index($(this.tbody).children("tr.selected:first")[0]);
} 
 
lfjs.grid.prototype.getSelectedId = function() {
	return this.getSelectedAttribute("selectid");
}
 
lfjs.grid.prototype.getSelectedData = function() {
	return this.getSelectedAttribute("data");
}
 
lfjs.grid.prototype.selectNext = function(direction) {
	var rows = $(this.tbody).children();
	if (rows.size() == 0)		// Nothing to select
		return false;
	if (rows.size() == 1) {
		if (rows[0].onclickfunc) {
			var clickfunc = rows[0].onclickfunc;
			clickfunc(rows[0].selectid, rows[0]);
		}
		this.selectRow(rows[0]);
		return true;
	}
	var newrow = null;
	rows.each(function(i) {
		if ($(this).hasClass("selected")) {
			if (!direction || direction > 0)
				i++;
			else
				i--;
			if (i < 0)
				i = 0;
			if (i >= rows.size())
				i = rows.size() - 1;
			newrow = rows[i];
			return false;
		}
	});
	if (!newrow && (!direction || direction > 0))
		newrow = rows[0];
	else if (!newrow)
		newrow = rows[rows.size()-1];
	this.selectRow(newrow);
	if (newrow.onclickfunc) {
		var clickfunc = newrow.onclickfunc;
		clickfunc(newrow.selectid, newrow);
	}
	return true;
}
 
lfjs.grid.prototype.setColWidths = function(widths, args) {
	if (args && args.runonce && $(this.colgroup).children().size() > 0)
		return;
	$(this.colgroup).empty();
	for (var i=0; i < widths.length; i++) {
		var newcol = document.createElement("col");
		newcol.width = widths[i];
		$(this.colgroup).append(newcol);
	}
}
 
lfjs.grid.generation_counter = 0;
 
lfjs.grid.prototype.setData = function(rows, args) {
	// If there is a "setinfo", then we let that timer do our work
	var skipcall = true;
	if (!this.setinfo)
		skipcall = false;
	if (!args)
		args = new Object();
	this.setinfo = { rows: rows, insfunc: args.insfunc,
			donefunc: args.donefunc, offset: 0, fetchoffset:0,
			fetchurl: args.fetchurl, fetchdisplay:args.fetchdisplay,
			started: new Date() };
	if (!args.append)
		this.empty();
	if (args.fetchurl && args.fetchurl.length && !rows.length) {
		if (!args.fetchoffset)
			this.setinfo.fetchoffset = 0;
		delete this.setinfo.rows;
		this.setinfo.fetch_generation = ++lfjs.grid.generation_counter;
		this.setDataFetch();
	} else if (!skipcall) {
		this.setDataWork();
	}
}
 
lfjs.grid.prototype.pause = function(dopause) {
	if (!this.setinfo)
		return false;
	var retval = this.setinfo.paused;
	if (!dopause && (typeof dopause != "undefined" || this.setinfo.paused))
		delete this.setinfo.paused;
	else 
		this.setinfo.paused = true;
	if (!this.setinfo.paused && this.setinfo.rows)
		this.setDataWork();
	return retval;
}
 
lfjs.grid.prototype.setDataFetch = function() {
	var me = this;
	var locgen = this.setinfo.fetch_generation;
	this.setinfo.httpreq = $.ajax({url:this.setinfo.fetchurl +
		"&offset=" + this.setinfo.fetchoffset,
		success:function(req) { me.setDataFetched(req, locgen); } });
}
 
lfjs.grid.prototype.setDataFetched_delayed = function(req, genid) {
	var me = this, locreq = req, locgen=genid;
	setTimeout(function() { me.setDataFetched_real(locreq, locgen); }, 3000);
}
 
lfjs.grid.prototype.setDataFetched = function(req, genid) {
	// Check to see if this data request is from the currently pending request
	if (!this.setinfo || this.setinfo.fetch_generation != genid)
		return;
	delete this.setinfo.httpreq;
	this.setinfo.fetchoffset = parseInt($(req).find("fetchbatch").attr("next"));
	var currrows = $(req).find(this.setinfo.fetchdisplay);
	if (!this.setinfo.rows) {
		// Show this and fetch a new batch
		this.setinfo.rows = currrows;
		this.setinfo.offset = 0;
		if (this.setinfo.fetchoffset)
			this.setDataFetch();
		this.setDataWork();
	} else {
		// Save this batch until we are done showing the prior batch
		this.setinfo.nextrows = currrows;
	}
}
 
lfjs.grid.showthreadsize = 50;
lfjs.grid.showthreadpause = 25;
 
lfjs.grid.prototype.setDataWork = function() {
	if (!this.setinfo || this.setinfo.paused || !this.setinfo.rows)
		return;
 
	var maxrows = lfjs.grid.showthreadsize;
	var stoprow = this.setinfo.offset + maxrows;
	if (stoprow > this.setinfo.rows.length)
		stoprow = this.setinfo.rows.length;
	var i;
	for (i=this.setinfo.offset; i < stoprow; i++) {
		if (this.setinfo.insfunc)
			this.setinfo.insfunc(this, this.setinfo.rows, i);
		else
			this.addRow(0, this.setinfo.rows[i], {fastadd:true});
	}
	if (stoprow < this.setinfo.rows.length) {
		// More to show in this set
		this.setinfo.offset = stoprow;
		var where = this;
		setTimeout(function() { where.setDataWork() }, lfjs.grid.showthreadpause);
		return true;
	}
	if (this.setinfo.fetchurl && this.setinfo.nextrows) {
		// More to show in next set
		this.setinfo.rows = this.setinfo.nextrows;
		this.setinfo.offset = 0;
		delete this.setinfo.nextrows;
		if (this.setinfo.fetchoffset)
			this.setDataFetch();
		this.setDataWork();		// Show next batch
	} else if (!this.setinfo.fetchurl || !this.setinfo.httpreq) {
		if (this.setinfo.donefunc) {
			var oldsetinfo = this.setinfo;
			delete this.setinfo;
			oldsetinfo.donefunc(this.div, "done", oldsetinfo);
		} else {
			delete this.setinfo;
		}
	} else {
		delete this.setinfo.rows;
	}
}
 
// Initialize code
$(function() {
	$('.selectgrid').each(function(i) { 
		new lfjs.grid(this);
		this.onselectstart = function() { return false; }
	});
});
// Synchronize form fields with data from an XML document
 
lfjs.dbForm = function(viewdefs, xmldoc, args) {
	this.viewdefs = viewdefs;
	this.show(xmldoc);
}
 
lfjs.dbForm.prototype.show = function(in_xml) {
	var warnings = [];
	if (in_xml)
		this.xmldoc = in_xml;
	for (var i=0; i < this.viewdefs.length; i++) {
		var val = this.getFieldVal(i);
		if(this.viewdefs[i].dom.indexOf("[") != -1)
			var dom = $(this.viewdefs[i].dom.
					substr(1, this.viewdefs[i].dom.length-2));
		else
			var dom = $('#' + this.viewdefs[i].dom);
		if (dom.size() < 1) {
			warnings.push("cannot find dom:" + this.viewdefs[i].dom);
			continue;
		}
		switch (dom[0].nodeName.toLowerCase()) {
			case "select":
				var vals = val.split(",");
				if(vals.length == 1)
					lfjs.setSelectedIndex(dom[0], val);
				else {
					var searchstr = "," + vals.join(",") + ",";
					for (var j=0; j < dom[0].options.length; j++) {
						if (searchstr.indexOf("," + dom[0].options[j].value + ",") >= 0) {
							dom[0].options[j].selected = true;
						} else
							dom[0].options[j].selected = false;
					}
				}
				break;
			case "textarea":
				dom[0].value = val;
				break;
			case "input":
				switch (dom[0].type) {
					case "text":
					case "password":
					case "hidden":
						dom[0].value = val;
						break;
					case "checkbox":
					case "radio":
						if(dom.length == 1) {
							if (val.length > 0)
								dom[0].checked = true;
							else
								dom[0].checked = false;
						} else {
							var vals = val.split(",");
							dom.each(function() {
								this.checked = false;
							});
							for(var j=0; j < vals.length; j++) {
								var el = dom.filter("[value='" + vals[j] + "']");
						
								if(el.length == 1)
									el[0].checked = true;
							}
						}
						break;
					default:
						warnings.push("unknown field type: " + dom[0].type);
				}
				break;
			default:
				dom.text(val);
				break;
		}
	}
	if (warnings.length && typeof(console) != "undefined") {
		for (var i=0; i < warnings; i++)
			console.log("dbform.show: " + warnings[i]);
	}
	return warnings;
}
 
 
lfjs.dbForm.prototype.clear = function(in_xml) {
	this.xmldoc = null;
	this.show();
}
lfjs.dbForm.prototype.gather = function(args) {
	var retobj = new Object;
	for (var i=0; i < this.viewdefs.length; i++) {
		var oldval = this.getFieldVal(i);
		if(this.viewdefs[i].dom.indexOf("[") != -1)
			var dom = $(this.viewdefs[i].dom.
					substr(1, this.viewdefs[i].dom.length-2));
		else
			var dom = $('#' + this.viewdefs[i].dom);
		if(dom.length < 1)
			continue;
		var newval = "";
		switch (dom[0].nodeName.toLowerCase()) {
			case "select":
				if (dom[0].selectedIndex >= 0) {
					//newval = dom[0].options[dom[0].selectedIndex].value;
					var items = dom.val();
					if(typeof items == "string")
						newval = items;
					else
						newval = items.join(",");
				}
				break;
			case "textarea":
				newval = dom[0].value.replace(/\r\n/g, "\n");
				break;
			case "input":
				switch (dom[0].type) {
					case "text":
					case "password":
					case "hidden":
						newval = dom[0].value;
						break;
					case "checkbox":
					case "radio":
						// How do we handle "hasno"?
						
						if(dom.length == 1) {
							if (dom[0].checked) {
								var hasstr = this.viewdefs[i].xml;
								if (hasstr.indexOf(" has ") >= 0)
									newval = hasstr.substr(hasstr.indexOf(" has ")+5);
								else if (hasstr.indexOf(" hasno ") >= 0)
									newval = "";
								else if (dom[0].value.length)
									newval = dom[0].value;
								else
									newval = "true";
							}
						} else {
							var vals = [];
							dom.each(function() {
								if(this.checked) 
									vals[vals.length] = this.value;
							});
							newval = vals.sort().join(",");
							if (args && args.changedonly &&
									oldval.split(',').sort().join(",") == newval)
								newval = oldval;
						}
						break;
					default:
						newval = oldval;
						if (typeof(console) != "undefined")
							console.log("dbForm.gather: unknown field type: " + 
								dom[0].type + "; setting to " + newval);
				}
				break;
			default:
				newval = dom.text();
				break;
		}
		if (newval != oldval || !args || !args.changedonly) {
			if (this.viewdefs[i].gatherVal)
				newval = this.viewdefs[i].gatherVal(this.viewdefs[i].dom, newval);
			var domname = this.viewdefs[i].dom;
			if (this.viewdefs[i].gatherName) {
				domname = this.viewdefs[i].gatherName;
			} else {
				if (args && args.domprefix && args.domprefix.length > 0 &&
						domname.indexOf(args.domprefix) == 0)
					domname = domname.substr(args.domprefix.length);
				if (args && args.formprefix && args.formprefix.length > 0)
					domname = args.formprefix + domname;
			}
			if (!retobj[domname]) {
				retobj[domname] = newval;
			} else {
				if (typeof retobj[domname] != "array")
					retobj[domname] = [retobj[domname]];
				retobj[domname][retobj[domname].length] = newval;
			}
			if (args && args.firstonly)
				return retobj;
		}
	}
	return retobj;
}
 
lfjs.dbForm.prototype.hasChanges = function() {
	var changes = this.gather({firstonly:true, changedonly:true});
	for (change in changes)
		return true;
	return false;
}
 
// Private functions
lfjs.dbForm.prototype.getFieldVal = function(offset) {
	var val = "";
	var xmlfunc;
	if (this.xmldoc && this.viewdefs[offset].xml) {
		var xmlname = this.viewdefs[offset].xml;
		var xmlattr;
		if (xmlname.indexOf(' ') > 0) {
			xmlfunc = xmlname.substr(xmlname.indexOf(' ')+1);
			xmlname = xmlname.substr(xmlname, xmlname.indexOf(' '));
		}
		if (xmlname.indexOf('.') > 0) {
			xmlattr = xmlname.substr(xmlname.indexOf('.')+1);
			xmlname = xmlname.substr(xmlname, xmlname.indexOf('.'));
		}
		if (xmlname == "this")
			xmlnode = $(this.xmldoc);
		else if (xmlname.indexOf("[") == 0)
			xmlnode = $(this.xmldoc).find(xmlname);
		else
			xmlnode = $(this.xmldoc).children(xmlname);
		if (xmlattr && xmlnode.size() > 0) {
			val = xmlnode[0].getAttribute(xmlattr);
			if (!val)
				val = "";
		} else {
			val = xmlnode.text();
		}
	}
	// TODO: make this word-boundary matching
	if (this.viewdefs[offset].showVal) {
		val = this.viewdefs[offset].
				showVal(this.viewdefs[offset].dom, val, xmlfunc);
	} else if (xmlfunc && xmlfunc.indexOf("has ") == 0) {
		if (RegExp("\\b" + xmlfunc.substr(4) + "\\b").test(val))
			val = xmlfunc.substr(4);
		else
			val = "";
	} else if (xmlfunc && xmlfunc.indexOf("hasno ") == 0) {
		if (RegExp("\\b" + xmlfunc.substr(4) + "\\b").test(val))
			val = "";
		else
			val = xmlfunc.substr(4);
	}
	return val;
}
 
lfjs.dragable = function(in_domobj) {
	var domobj = in_domobj;
	domobj.mvc = this;
	this.div = domobj;
	this.container = domobj.parentNode;
	lfjs.dragable.activedrag = {};
	domobj.dragStart = function(ev) { return domobj.mvc.dragStart(ev); };
	lfjs.addEvent(domobj, "mousedown", domobj.dragStart);
}
 
lfjs.dragable.prototype.dragStart = function(event) {
	var el, evObj;
	var left, top;
 
	lfjs.dragable.activedrag = {};
 
	evObj = (typeof window.event == "undefined") ? event : window.event;
	lfjs.dragable.activedrag.dragEl = this.container;
	this.container.style.cursor = "move";
		
	// Get cursor position with respect to the page.
	if (typeof evObj.clientX != "undefined" &&
				typeof document.body.scrollLeft != "undefined") {
		left = evObj.clientX + document.body.scrollLeft;
		top = evObj.clientY + document.body.scrollTop;
	} else if (typeof winodw.scrollX != "undefined") {
		left = evObj.clientX + window.scrollX;
		top = evObj.clientY + window.scrollY;
	} else {
		return;
	}
 
	// Save starting positions of cursor and element.
	lfjs.dragable.activedrag.startCursX = left;
	lfjs.dragable.activedrag.startCursY = top;
	
 
	if(lfjs.dragable.activedrag.dragEl.style.left == "") {
		if (document.defaultView && document.defaultView.getComputedStyle) {
			lfjs.dragable.activedrag.dragEl.style.left = parseInt(
					document.defaultView.getComputedStyle(
					lfjs.dragable.activedrag.dragEl, '').getPropertyValue('left'));
		} else if(document.all && document.getElementById &&
					lfjs.dragable.activedrag.dragEl.currentStyle) {
			var elLeft = lfjs.dragable.activedrag.dragEl.currentStyle.left;
			if(elLeft == "auto") {
				lfjs.dragable.activedrag.dragEl.style.left =
					lfjs.dragable.activedrag.dragEl.offsetLeft;
			} else
				lfjs.dragable.activedrag.dragEl.style.left = parseInt(
						lfjs.dragable.activedrag.dragEl.currentStyle.left);
		}
	}
	lfjs.dragable.activedrag.elStartLeft =
			(typeof lfjs.dragable.activedrag.dragEl.style.left != "number") ?
					parseInt(lfjs.dragable.activedrag.dragEl.style.left) : 0;
	
	if(lfjs.dragable.activedrag.dragEl.style.top == "") {
		if (document.defaultView && document.defaultView.getComputedStyle) {
			lfjs.dragable.activedrag.dragEl.style.top = parseInt(
					document.defaultView.getComputedStyle(
						lfjs.dragable.activedrag.dragEl, '').getPropertyValue('top'));
		} else if(document.all && document.getElementById &&
					lfjs.dragable.activedrag.dragEl.currentStyle) {
			var elTop = lfjs.dragable.activedrag.dragEl.currentStyle.top;
			if(elTop == "auto") {
				lfjs.dragable.activedrag.dragEl.style.top =
					lfjs.dragable.activedrag.dragEl.offsetTop;
			} else
				lfjs.dragable.activedrag.dragEl.style.top =
					parseInt(lfjs.dragable.activedrag.dragEl.currentStyle.top);
		}
	} 
	lfjs.dragable.activedrag.elStartTop =
			(typeof lfjs.dragable.activedrag.dragEl.style.top != "number") ?
			 parseInt(lfjs.dragable.activedrag.dragEl.style.top) : 0;
	
	// Capture mousemove and mouseup events on the page.
	lfjs.addEvent(document, "mousemove", lfjs.dragable.dragMove);
	lfjs.addEvent(document, "mouseup", lfjs.dragable.dragEnd);
	
	if (typeof evObj.preventDefault == "function") {
		evObj.preventDefault();
	} else {
		evObj.cancelBubble = true;
		evObj.returnValue = false;
	}
}
 
lfjs.dragable.dragMove = function(ev) {
	var left, top, evObj;
	evObj = (typeof window.event == "undefined") ? ev : window.event;
	
	//only for Firefox - make sure draggable obj stays in window
	//  NOTE: IE seems to handle this fine
	if(window.innerWidth) {
		if((evObj.clientX < 3) || (evObj.clientX > (window.innerWidth -20)))
			return;
		if((evObj.clientY < 3) || (evObj.clientY > (window.innerHeight-20)))
			return;
	}
	// Get cursor position with respect to the page.
	if (typeof evObj.clientX != "undefined" &&
				typeof document.body.scrollLeft != "undefined") {
		left = evObj.clientX + document.body.scrollLeft;
		top = evObj.clientY + document.body.scrollTop;
	} else if (typeof winodw.scrollX != "undefined") {
		left = evObj.clientX + window.scrollX;
		top = evObj.clientY + window.scrollY;
	} 
	
	// Move drag element by the same amount the cursor has moved.
	var tmpEl = lfjs.dragable.activedrag.dragEl;
	lfjs.dragable.activedrag.dragEl.style.left =
			(lfjs.dragable.activedrag.elStartLeft + left -
			lfjs.dragable.activedrag.startCursX) + "px";
	lfjs.dragable.activedrag.dragEl.style.top =
			(lfjs.dragable.activedrag.elStartTop  + top -
			lfjs.dragable.activedrag.startCursY) + "px";
	if (typeof(tmpEl.drag_minleft) != "undefined" &&
			parseInt(tmpEl.style.left) < tmpEl.drag_minleft)
		tmpEl.style.left = tmpEl.drag_minleft + "px";
	if (typeof(tmpEl.drag_maxleft) != "undefined" &&
			parseInt(tmpEl.style.left) > tmpEl.drag_maxleft)
		tmpEl.style.left = tmpEl.drag_maxleft + "px";
	if (typeof(tmpEl.drag_mintop) != "undefined" &&
			parseInt(tmpEl.style.top) < tmpEl.drag_mintop)
		tmpEl.style.top = tmpEl.drag_mintop + "px";
	if (typeof(tmpEl.drag_maxtop) != "undefined" &&
			parseInt(tmpEl.style.top) > tmpEl.drag_maxtop)
		tmpEl.style.top = tmpEl.drag_maxtop + "px";
 
	if (typeof evObj.preventDefault == "function") {
		evObj.preventDefault();
	} else {
		evObj.cancelBubble = true;
		evObj.returnValue = false;
	}
}
 
lfjs.dragable.dragEnd = function(ev) {
	lfjs.dragable.activedrag.dragEl.style.cursor = "default";
	// Stop capturing mousemove and mouseup events.
	lfjs.removeEvent(document, "mousemove", lfjs.dragable.dragMove);
	lfjs.removeEvent(document, "mouseup", lfjs.dragable.dragEnd);
}
 
// Initialize code
$(function() {
   $('.dragable').each(function(i) { new lfjs.dragable(this); });
});
lfjs.prompt = function(prompt, func, args) {
	if (!lfjs.prompt.win && $('#promptwin').size() > 0)
		lfjs.prompt.win = $('#promptwin')[0];
	if (!lfjs.prompt.win) {
		// Create a prompt window
		lfjs.prompt.win = document.createElement("div");
		lfjs.prompt.win.id = "promptwin";
		lfjs.prompt.win.className = "screen";
      document.body.appendChild(lfjs.prompt.win);
		new lfjs.window(lfjs.prompt.win);
		var html = "<div class=\"prompt\">Enter value:</div>" +
				"<input id=\"prompt_input\" type=\"text\"";
		if(args && args.maxlength)
			html += " maxlength=\"" + args.maxlength + "\"";
		html += " /><br>" +
				"<div class=\"buttonbar\">" +
				"<a href=\"#\" class=\"button\" onClick=\"lfjs.keypress.stuff(" +
					"'CTRL+ENTER'); return false;\"> OK </a>&nbsp; " +
				" <a href=\"#\" class=\"button\" onClick=\"lfjs.keypress.stuff(" +
					"'ESC'); return false;\">Cancel</a>" +
				"</div>";
				
		$(lfjs.prompt.win).html(html);
	}
	lfjs.prompt.func = func;
	var title = prompt;
	if (args && args.title)
		title = args.title;
	$(lfjs.prompt.win).find(".prompt").text(prompt);
	if (args && args.defaultvalue)
		$(lfjs.prompt.win).find("input")[0].value = args.defaultvalue;
	else
		$(lfjs.prompt.win).find("input")[0].value = "";
	lfjs.prompt.win.activate(
			{ title: title, keyhandler: lfjs.prompt.keyhandler });
	var inpval = $(lfjs.prompt.win).find("input")[0];
	inpval.select();
	inpval.focus();
}
 
lfjs.prompt.keyhandler = function(in_key) {
	if (in_key == "ESC") {
		lfjs.prompt.win.deactivate();
		lfjs.prompt.func();
		return false;
	} else if (in_key == "CTRL+ENTER" || in_key == "ENTER") {
		var val = $(lfjs.prompt.win).find("input")[0].value;
		if (val && val.length > 0) {
			lfjs.prompt.win.deactivate();
			lfjs.prompt.func(val);
		}
		return false;
	}
	return true;
}
 
lfjs.promptync = function(func, args) {
	if (!lfjs.promptync.win && $('#yncwin').size() > 0)
		lfjs.promptync.win = $('#yncwin')[0];
	if (!lfjs.promptync.win) {
		// Create a ync window
		lfjs.promptync.win = document.createElement("div");
		lfjs.promptync.win.id = "yncwin";
		lfjs.promptync.win.className = "screen";
      document.body.appendChild(lfjs.promptync.win);
		new lfjs.window(lfjs.promptync.win);
		$(lfjs.promptync.win).html(
			"<div class=\"ync\">Save changes?</div><div style=\"float:left\">" +
			"<a href=\"#no\" class=\"button\" onClick=\"" +
				"lfjs.keypress.stuff('n'); return false;\">No</a>" +
			"</div><div style=\"float:right\">" +
			"<a href=\"#cancel\" class=\"button\" onClick=\"" +
				"lfjs.keypress.stuff('ESC'); return false;\">Cancel</a>" +
			"<a href=\"#yes\" class=\"button\" onClick=\"" +
				"lfjs.keypress.stuff('CTRL+ENTER'); return false;\">Yes</a>" +
			"</div>"
		);
	}
	lfjs.promptync.func = func;
	lfjs.promptync.yesfunc = args.yesfunc;
	lfjs.promptync.nofunc = args.nofunc;
	var title = (args.title ? args.title :
			(args.prompt ? args.prompt : "Confirm"));
	$(lfjs.promptync.win).find(".ync").text(
			args.prompt ? args.prompt : "Save changes?");
	var buttons = $(lfjs.promptync.win).find(".button");
	$(buttons[0]).text(args.noprompt ? args.noprompt : "No");
	$(buttons[1]).text(args.cancelprompt ? args.cancelprompt : " Cancel ");
	$(buttons[2]).text(args.yesprompt ? args.yesprompt : " Yes ");
	lfjs.promptync.win.activate({ keyhandler: lfjs.promptync.keyhandler,
		title: title });
}
 
lfjs.promptync.keyhandler = function(in_key) {
	if (in_key == "ESC") {
		lfjs.promptync.win.deactivate();
		lfjs.promptync.func();
		return false;
	} else if (in_key == "CTRL+ENTER" || in_key == "y" || in_key == "Y") {
		lfjs.promptync.win.deactivate();
		if (lfjs.promptync.yesfunc)
			lfjs.promptync.yesfunc();
		lfjs.promptync.func("yes");
	} else if (in_key == "n" || in_key == "N") {
		lfjs.promptync.win.deactivate();
		if (lfjs.promptync.nofunc)
			lfjs.promptync.nofunc();
		lfjs.promptync.func("no");
	}
	return true;
}
//-----------------------------
//   Tab Functions
//----------------------------- 
 
 
$(function() {
	$('.tabset').each(function(i) {
		var args = {};
		
		if($(this).find(".tabnav").length == 1 && $(this).find(".tabnav").find("a").length > 1) {
			args.tabnav = $(this).find(".tabnav")[0];
			 $(this).find(".tabnav").remove();
		}
		var ts = new lfjs.tabset(this, args);	   
		var tabs = $(this).children(".tab");
		tabs.each(function(i) {
			if($(this).next(".tabcontent")[0])
				var content = $(this).next(".tabcontent")[0];
			else
				var content = null;
			var targs = {};
			if($(this).attr("id").length)
				targs["id"] = $(this).attr("id");
			if(this.className.length)
				targs["classname"] = this.className;
			targs["contents"] = $(this).next(".tabcontent")[0];
			var tab = ts.addTab($(this).html(), targs );
			if($(this).hasClass("selected"))
				tab.show();
				
			$(this).remove();
		});
		ts.displayTabNav();
		//size content div appropriately
		if($(ts.mainContentEl).children().length) {
			var pad = parseInt($(ts.tabContainerEl).css("padding-top"));
			
			var height = $(ts.domobj).height() - $(ts.tabContainerEl).height();
			
			if(!isNaN(pad))
				height -= pad;
			height -= 3;
			$(ts.mainContentEl).height(height);
		}
   });
		   
});
 
lfjs.tabset = function(domobj, args) {
	if(!args)
		var args = {};
	var self = this;
	domobj.tabset = this;
	this.domobj = domobj;
	//internal array of all tab objects
	this.tabs = [];
	//variable to track the currently shown tab
	this.currActive;
	//array to track the previously shown tabs
	this.prevActive = [];
	//timerID used for scrolling using the arrows
	this.tabScrollTimer = 0;
	
	//create the container div for the actual tabs
	var container = document.createElement("div");
	$(container).addClass('tabcontainer').css( {  width: "100%"});
	
	//add nobr element to avoid tabs breaking if window is shrunk
	var nobr = document.createElement("nobr");
	
	
	//create a navigation div for scrolling tabs
	function end(event) {
		var el = event.target
		el.blur();
		self.endScroll();
		event.stopPropagation();
	}
	//add the scroll navigation div and links
	if(args.tabnav && $(args.tabnav).children("a").length > 1) {
		var nav = args.tabnav;
		var left = $(args.tabnav).find("a")[0];
		var right = $(args.tabnav).find("a")[1];
	} else {
		var nav = document.createElement("div");
		var left = document.createElement("a");
		var lefthtml = "&laquo;";
		$(left).html(lefthtml).attr("title", "Scroll Left");
		var right = document.createElement("a");
		var righthtml = "&raquo;";
		$(right).html(righthtml).attr("title", "Scroll Right");
		$(nav).append(left).append("&nbsp;").append(right);
	}
	$(nav).addClass("tabnav").css( { display: "none", float: "right" } );
	
	$(left).addClass("left").attr( { href: "#" } ).mousedown(
		function(event) { self.scroll(-1); event.stopPropagation(); return false; }
	).mouseup(
		function(event) { end(event); return false; }
	).mouseout(
		function(event) { end(event); return false; }
	).click(
		function(event) { end(event); return false; }
	);
	
	$(right).addClass("right").attr( { href: "#" } ).mousedown(
		function(event) { self.scroll(1); event.stopPropagation(); return false; }
	).mouseup(
		function(event) { end(event); return false; }
	).mouseout(
		function(event) { end(event); return false; }
	).click(
		function(event) { end(event); return false; }
	);
	
	
	function resizeMe() {
		self.displayTabNav();
	}
	//create the content div for the content of each tab
	var content = document.createElement("div");	
	$(content).addClass('tabcontents');
	
	//add an event to handle displaying/hiding navigation on window resize
	//doesn't work right in IE, since IE fires multiple resize events, if fact
	//   it crashes IE6 on Win@k in Quirks Mode
	if(!$.browser.msie) {
		$(window).resize(function() { resizeMe() });
	}
	$(nobr).append(nav).append(container);
	$(domobj).append(nobr).append(content);
	//$(nobr).append(container);
	//$(domobj).append(nav).append(nobr).append(content);
	
 
	
	this.tabContainerEl = container;	
	this.mainTabEl = domobj;	
	this.mainContentEl = content;	
	this.navEl = nav;
	
	//Add a scroll wheel handler (jQuery does not support teh mousewheel event, so add it old school)
	if (typeof this.tabContainerEl.addEventListener == "function") {
		this.tabContainerEl.addEventListener("DOMMouseScroll", function(event) { self.tabMouseWheel(event); }, true);
	} else {
		this.tabContainerEl.attachEvent("onmousewheel", function(event) { self.tabMouseWheel(event); });
	}
	
	domobj.getTabs = function() { return this.tabset.getTabs(); };
	domobj.getShownTab = function() { return this.tabset.getShownTab(); };
	domobj.show = function(tab) { return this.tabset.show(tab); };
	domobj.remove = function(tab) { return this.tabset.remove(tab); };
	domobj.addTab = function(label, args) { return this.tabset.addTab(label, args); };
	
	return this;
	//domobj.activate = function (a) { return this.mvc.activate(a); };
	//domobj.deactivate = function () { return this.mvc.deactivate(); };
	//$(domobj).addClass("inactivescreen");
}
 
lfjs.tab = function(label, args) {
	if(!args)
		var args = {};
	this.tabset;
	this.tabDiv = null;
	this.contents = null;
	this.label = label;
	this.canclose = false;
	this.canmove = false;
	this.isActive = false;
	//variable to remember the vertical scroll position for each tab
	this.scrollTop = 0;
	if(args.id)
		this.id = args.id;
	if(args.classname)
		this.classname = args.classname;
	if(args.showfunc)
		this.showfunc = args.showfunc;
	if(args.hidefunc)
		this.hidefunc = args.hidefunc;
	if(args.closefunc)
		this.closefunc = args.closefunc;
	if(args.dropfunc)
		this.dropfunc = args.dropfunc;
	if(args.canclose)
		this.canclose = args.canclose;
	if(args.data)
		this.data = args.data;
	if(args.canmove)
		this.canmove = args.canmove;
	
	if(args.contents) {
		if(typeof args.contents == "string" && $("#" + args.contents).length)
			this.contents = $("#" + args.contents)[0];
		else if($(args.contents).length) {
			//this.contents = $(args.contents).remove().get(0);
			this.contents = args.contents;
		}
		$(this.contents).css({display: "none"});
		
		
	} 
	
	return this;
}
//create the actual tab element
lfjs.tab.prototype.drawTab = function () {
	var self = this;
	
	if(this.tabDiv && $(this.tabDiv).length) {
		var tabDiv = $(this.tabDiv).empty().get(0);
	} else {
		var tabDiv = document.createElement("span");
		this.tabDiv = tabDiv;
	
		$(this.tabset.tabContainerEl).append(tabDiv);
		$(tabDiv).css(
			{ display: "inline" }
		).addClass("tab").addClass((this.isActive) ? 'tabactive' : 'tabinactive').mouseover(
			function(event) { self.tabMouseOver(); }
		).mouseout(
			function(event) { self.tabMouseOut(); }
		).click(
			function(event) { self.show(); }
		);
		if(this.id)
			$(tabDiv).attr("id", this.id)
		if(this.classname)
			$(tabDiv).addClass(this.classname)
		
		if(typeof tabDiv.onselectstart != "undefined") {
			//tabDiv.onselectstart = function() { return false; };	
		}
	}
	tabDiv.tab = this;
	$(tabDiv).html(this.label);
	if(this.canclose) {
		var close = document.createElement("span");
		var a = document.createElement("a");
		$(a).html("x").attr( {title: "Close Tab"} ).click(
			function() { self.remove(); }
		);
		$(close).addClass('closetab').append(a);
		$(tabDiv).append(close);
	}
	
	
	if(this.isActive) {
		this.tabset.currActive = this;
	}
}
 
lfjs.tabset.prototype.addTab = function(label, args) {
	var tabObj = new lfjs.tab(label, args);
	tabObj.tabset = this;
	
	if(tabObj.contents) {
		if(tabObj.contents.parentNode) {
			var node = tabObj.contents.parentNode.removeChild(tabObj.contents);
		} else {
			var node = tabObj.contents;
		}
		$(this.mainContentEl).append(node);
	}
	
	tabObj.tabset.tabs[tabObj.tabset.tabs.length] = tabObj;
	tabObj.drawTab();
	//show tab navigation, if necessary
	this.displayTabNav();
	
	return tabObj;
}
 
lfjs.tab.prototype.updateArgs = function(args) {
	for(var i in args) {
		if(typeof this[i] != "undefined" && this[i] != null) {
			this[i] = args[i];	
		}
	}
	this.drawTab();
}
lfjs.tabset.prototype.getTabs = function() {
	var tabs = [];
	for(var i=0; i < this.tabs.length; i++) {
		tabs[tabs.length] = this.tabs[i];
	}
	return tabs;
}
 
lfjs.tabset.prototype.getShownTab = function() {
	if(this.currActive)
		return this.currActive;
	return null;
}
 
lfjs.tabset.prototype.show = function(tabObj) {
	tabObj.show();	
}
//show a tab
lfjs.tab.prototype.show = function() {
	var content = this.tabset.mainContentEl;
	
	if(this == this.tabset.currActive)
		return;
	if(this.tabset.currActive) {
		if(this.tabset.currActive.hidefunc) {
			var ret = this.tabset.currActive.hidefunc(this.tabset.currActive);
			if(ret == false)
				return false;
		}
		this.tabset.prevActive[this.tabset.prevActive.length] = this.tabset.currActive;
		$(this.tabset.currActive.tabDiv).addClass('tabinactive').removeClass('tabactive');
	}
		
	$(this.tabDiv).addClass('tabactive').removeClass('tabinactive');
	var show = true;
	if(this.showfunc) {
		show = this.showfunc(this);
	}
	if(this.contents && show != false) {
		if(this.tabset.currActive && this.tabset.currActive.contents) {
			this.tabset.currActive.scrollTop = this.tabset.mainContentEl.scrollTop;
			$(this.tabset.currActive.contents).css( { display: "none" });
		}
		$(this.contents).css( { display: "block" } );
		this.tabset.mainContentEl.scrollTop = this.scrollTop;
	}
	
	//Set this as the currently active tab
	this.tabset.currActive = this;
	
	this.scrollToView();
	
}
lfjs.tab.prototype.scrollToView = function() {
	//if it is scrolled out of view, scroll into view
	if(this.tabset.tabContainerEl.clientWidth < this.tabset.tabContainerEl.scrollWidth) {
		var offL = this.tabDiv.offsetLeft;
		var scrL = this.tabset.tabContainerEl.scrollLeft;
		var offR = this.tabDiv.offsetLeft + this.tabDiv.offsetWidth;
		var scrR = this.tabset.tabContainerEl.scrollLeft + this.tabset.tabContainerEl.clientWidth;
		if(offL < scrL) 
			this.tabset.tabContainerEl.scrollLeft = offL - 8;
		else if (offR > scrR)
			this.tabset.tabContainerEl.scrollLeft = offR - this.tabset.tabContainerEl.clientWidth;
	}
	
}
lfjs.tabset.prototype.remove = function(tabObj) {
	tabObj.remove();	
}
 
lfjs.tab.prototype.remove = function(forceclose) {
	if(typeof forceclose == "undefined")
		var forceclose = false;
	var exists = false;
	if(this.tabset.tabs.length > 1 || forceclose) {
		for(var i=0; i < this.tabset.tabs.length; i++) {
			if(this.tabset.tabs[i] == this) {
				//check if it is the last tab, if it is, select the last tab
				//  otherwise, select the next tab after removal
				if(i == (this.tabset.tabs.length-1)) 
					var nextTab = i-1;
				else
					var nextTab = i;
					
				this.tabset.tabs.splice(i,1);
				exists = true;
				break;
			}
		}
		if(exists) {
			if(this.closefunc) {
				var ret = this.closefunc(this);
				if(ret == false)
					return false;
			}
			this.tabset.tabContainerEl.removeChild(this.tabDiv);
			var isCurrTab = false;
			if(this.tabset.currActive == this) {
				isCurrTab = true;
				this.tabset.currActive = null;
			}
			if(this.contents) {
				$(this.contents).remove();
			}
			var next = this.tabset.currActive;
			//show the previously selected tab, if exists, otherwise select by proximity
			if(this.tabset.prevActive.length) {
				//remove references to the tab closing in prevActive
				for(var i=this.tabset.prevActive.length; i >= 0; i--) {
					if(this.tabset.prevActive[i] == this)
						this.tabset.prevActive.splice(i,1);
				}
				
				if(isCurrTab) {
					var next = this.tabset.prevActive.splice(this.tabset.prevActive.length-1, 1);
					next = next[0];
				} 
			} else if (isCurrTab) {
				next = this.tabset.tabs[nextTab];
			}
			if(isCurrTab && next) 
				next.show();
			if(next)
				next.scrollToView();
			
			
			//show tab navigation, if necessary
			this.tabset.displayTabNav();
			
		}
	}
}
 
 
///////////////////////////////
//  EVENT HANDLING FUNCTIONS
//////////////////////////////
//called onClick to show the tab that was clicked on
 
lfjs.tab.prototype.tabMouseOut = function() {
	$(this.tabDiv).removeClass('tabhover');
}
 
lfjs.tab.prototype.tabMouseOver = function() {
	if(!(this == this.tabset.currActive))
		$(this.tabDiv).addClass('tabhover');
}
lfjs.tabset.prototype.tabMouseWheel = function(ev) {
	var delta = 0;
 
	if (!ev) 
		ev = window.event;
	//IE and Opera
	if (ev.wheelDelta) { 
		delta = ev.wheelDelta/120;
		// In Opera 9, delta differs in sign as compared to IE.
		if (window.opera)
			delta = -delta;
	// Firefox
	} else if (ev.detail) { 
		// In Firefox, sign of delta is different than in IE.  Also, delta is multiple of 3.
		delta = -ev.detail/3;
	}
	// If delta is nonzero, handle it. Basically, delta is now positive if wheel was scrolled up,
	// and negative, if wheel was scrolled down.
	if (delta) {
		var dis = delta * 20;
		this.tabContainerEl.scrollLeft -= dis;
	}
	
	if (ev.preventDefault)
		ev.preventDefault();
	ev.returnValue = false;
}
 
lfjs.tabset.prototype.scroll = function(dir) {
	var self = this;
	var dir = dir;
	this.tabScrollTimer = setTimeout(function() { self.scroll(dir);}, 1);
	var dis = dir * 2;
	this.tabContainerEl.scrollLeft += dis;
}
lfjs.tabset.prototype.endScroll = function() {
	
	if(typeof this.tabScrollTimer == "number") 
		clearTimeout(this.tabScrollTimer);
	return false;
}
//check to see if the tab navigation is required 
lfjs.tabset.prototype.displayTabNav = function() {
	var cliW = this.mainTabEl.clientWidth;
	var scrW = this.tabContainerEl.scrollWidth;
	//if no width is set on mainTabEl, IE reports clientWidth as 0
	if(cliW == 0) {
		this.mainTabEl.style.width = "100%";
		cliW = this.mainTabEl.clientWidth;
		this.mainTabEl.style.width = "";
	}
	if(scrW > cliW) {
		this.navEl.style.display = "block";
		this.tabContainerEl.style.width = (cliW - this.navEl.offsetWidth - 4) + "px";
		this.tabContainerEl.style.overflowX = "hidden";
	} else {
		this.navEl.style.display = "none";
		this.tabContainerEl.style.width = "100%";
	}
	//if scrollLeft + clientWidth > scrollWidth, then we need to snap the tabs to the right side
	if(this.tabContainerEl.scrollLeft + this.tabContainerEl.clientWidth > this.tabContainerEl.scrollWidth) 
		this.tabContainerEl.scrollLeft = this.tabContainerEl.scrollWidth + this.tabContainerEl.clientWidth;
		
	
	
	
	
}
 
 
 
// Initialize code
$(function() {
	$('.multiupload').each(function(i) { 
		new lfjs.multiupload(this);
	});
});
 
 
 
lfjs.multiupload = function(domobj) {
	if(parseInt(lfjs.multiupload.flashVersion(), 10) < 9) {
		domobj.onclick(domobj);
		return;
	}
	
	var flashsrc = $("script[src$='swfupload.js']:first").attr("src").replace(/swfupload\.js$/, "swfupload.swf");
	
	if(domobj.nodeType == 1 && (/(span|div|a|button|img)/.test(domobj.nodeName.toLowerCase()) || 
	   (domobj.nodeName.toLowerCase() == "input" && domobj.type == "button"))) {
		
	} else {
		if(window.console)
			console.log("MultiUpload element must be SPAN, DIV, A, IMG, BUTTON, or INPUT type=button.");	
		return;
	}
	//console.log(domobj.nodeType + ' ' + domobj.nodeName + ' "' + domobj.id + '" - ' + $(domobj).width() + " x " + $(domobj).height());
	//console.log(domobj.offsetWidth + " x " + domobj.offsetHeight);
	if(typeof SWFUpload == "function") {
		var placeholder = document.createElement("span");
		var ts = new Date().valueOf() + '';
		placeholder.id = "lfjsmu" + domobj.nodeName.toLowerCase() + ts.substring(Math.floor(Math.random()*ts.length));
		
		$(domobj).css({zIndex: "1"});
		var swfwidth = domobj.offsetWidth;		// Broken: $(domobj).width();
		var swfheight = domobj.offsetHeight;	// Broken: $(domobj).height();
		
		var washidden = false;
		if (swfwidth == 0 || swfwidth == 0) {
			washidden = true;
			//tweak any hidden parents so we can figure out where to put the button.
			var hiddenpar = $(domobj).parents(":hidden");
			var currpos = hiddenpar.css("position");
			
			hiddenpar.toggle().css({ visibility: "hidden", position:"absolute"});
			swfwidth = domobj.offsetWidth;		// Broken: $(domobj).width();
			swfheight = domobj.offsetHeight;	// Broken: $(domobj).height();
		}
	
		if(/(input|button|img)/.test(domobj.nodeName.toLowerCase())) {
			var buttontext = domobj.value;
			var par = document.createElement("span");
			$(par).addClass("swfuploadwrapper");
			$(domobj).wrap(par).before(placeholder);
			//console.log("OW: " + domobj.offsetWidth + " - JQ Width: " + $(domobj).width());
			if(domobj.offsetWidth) {
				//swfwidth = domobj.offsetWidth;
				//swfheight = domobj.offsetHeight;
			}
		} else {
			var buttontext = $(domobj).html();
			$(domobj).prepend(placeholder);
		}
		if (washidden)
			hiddenpar.css({ visibility: "visible", position:currpos}).toggle();
		
		var cursor = $(domobj).css("cursor").toLowerCase();
		var swfcursor = SWFUpload.CURSOR.ARROW;
		if(cursor == "pointer" || cursor == "hand" || domobj.nodeName.toLowerCase() == "a")
			swfcursor = SWFUpload.CURSOR.HAND;
			
		this.settings = { };
		domobj.uploadsettings = this.settings;
		if(domobj.onclick) {
			domobj.initfunc = domobj.onclick;
			domobj.initfunc();
			domobj.onclick = function() { return false; };
			//console.log(this.settings);
		} else 
			domobj.initfunc = function() {};
			
		var args = {
			button_placeholder_id: placeholder.id,
			flash_url: flashsrc,
			file_types: "*.*",
			file_types_description: "All Files",
			requeue_on_error: false,
			//button_text: buttontext,
			button_width: swfwidth,
			button_height: swfheight,
			button_action : SWFUpload.BUTTON_ACTION.SELECT_FILES,		
			button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
			button_cursor: swfcursor,
			
			use_query_string: false,
 
			debug: false
		}
 
		var swf = this;
		
		function addSetting(localsetting, swfsetting) {
			if(swf.settings[localsetting] && swf.settings[localsetting].length)
				args[swfsetting] = swf.settings[localsetting];
		}
		addSetting("url", "upload_url");
		addSetting("filetypes", "file_types");
		addSetting("filetypesdesc", "file_types_description");
		addSetting("filepostname", "file_post_name");
		addSetting("postparams", "post_params");
		addSetting("filepostname", "file_post_name");
		addSetting("requeueonerror", "requeue_on_error");
		addSetting("filesizelimit", "file_size_limit");
		
		
		args["swfupload_loaded_handler"] = function() { swf.flashLoaded() };
		args["file_dialog_start_handler"] = function() { swf.fileDialogStart() };
		args["file_queued_handler"] = function(a) { swf.fileQueued(a) };
		args["file_queue_error_handler"] = function(a, b, c) { swf.fileQueueError(a, b, c) };
		args["file_dialog_complete_handler"] = function(a, b, c) { swf.fileDialogComplete(a, b, c) };
		args["upload_start_handler"] = function(a) { return swf.uploadStart(a) };
		args["upload_progress_handler"] = function(a, b, c) { swf.uploadProgress(a, b, c) };
		args["upload_error_handler"] = function(a, b, c) { swf.uploadError(a, b, c) };
		args["upload_success_handler"] = function(a, b) { swf.uploadSuccess(a, b) };
		args["upload_complete_handler"] = function(a) { swf.uploadComplete(a) };
		
		this.swfupload = new SWFUpload(args);
		$(".multiupload .swfupload, SPAN .swfupload").each(function() { $(this).css({position: "absolute", "z-index": "2"}) });
		
		this.files = [];
		this.currupload = "";
		this.queuelength = 0;
		this.currfilecnt = 0;
		this.domobj = domobj;
		domobj.mvc = this;
		
		domobj.startUpload = function (a) { return this.mvc.startUpload(a); };
		domobj.cancelUpload = function (a) { return this.mvc.cancelUpload(a); };
		domobj.stopUpload = function () { return this.mvc.stopUpload(); };
		domobj.getFile = function (a) { return this.mvc.getFile(a); };
		domobj.getFiles = function () { return this.mvc.getFiles(); };
		domobj.setUploadURL = function (a) { return this.mvc.setUploadURL(a); };
		domobj.setPostParams = function (a, b) { return this.mvc.setPostParams(a, b); };
		domobj.setFilePostParams = function (a, b, c) { return this.mvc.setFilePostParams(a, b, c); };
		domobj.isIdle = function () { return this.mvc.isIdle(); };
	} else {
		if(window.console)
			console.log("Cannot find SWFUpload.  Make sure js file is included");	
	}
}
 
lfjs.multiupload.prototype.flashLoaded = function() {
	$(".multiuploadnoinit").hide();
	if(typeof lfjs.multiupload.onInit == "function")
		lfjs.multiupload.onInit(this.domobj);
		
	if (this.settings["flashLoaded"] && typeof this.settings["flashLoaded"] == "function") {
		this.settings["flashLoaded"](this.domobj);	
	}
}
 
lfjs.multiupload.prototype.fileDialogStart = function() {
	//add/update swf setting here
	
	this.domobj.initfunc();
	var swf = this;
	var swfu = this.swfupload;
	swfu.movieElement.blur();
	function addSetting(localsetting, setfunc) {
		if(swf.settings[localsetting] && swf.settings[localsetting].length)
			setfunc(swf.settings[localsetting]);
	}
	
	if(swf.settings["url"] && swf.settings["url"].length)
		this.setUploadURL(swf.settings["url"]);
	if(swf.settings["filepostname"] && swf.settings["filepostname"].length)
		this.swfupload.setFilePostName(swf.settings["filepostname"]);
	if(swf.settings["filesizelimit"] && swf.settings["filesizelimit"].length)
		this.swfupload.setFileSizeLimit(swf.settings["filesizelimit"]);
	if(swf.settings["postparams"] && typeof swf.settings["postparams"] == "object")
		this.setPostParams(swf.settings["postparams"], true);
		
	if(swf.settings["filetypes"] && swf.settings["filetypes"].length) {
		var desc = "All Files";
		if(swf.settings["filetypesdesc"] && swf.settings["filetypesdesc"].length) {
			var desc = swf.settings["filetypesdesc"];
		}
		this.swfupload.setFileTypes(swf.settings["filetypes"], desc);
	}
	addSetting("requeueonerror", "requeue_on_error");
	
	if (this.settings["fileSelectStart"] && typeof this.settings["fileSelectStart"] == "function") {
		this.settings["fileSelectStart"](this.domobj);	
	}
}
 
lfjs.multiupload.prototype.fileQueued = function(file) {
	var ret = true;
	if (this.settings["fileQueued"] && typeof this.settings["fileQueued"] == "function") {
		ret = this.settings["fileQueued"](this.domobj, file);	
	}
	if(ret == false) {
		this.swfupload.cancelUpload(file.id, false);
	} else {
		var idx = this.files.length;
		this.files[idx] = file;
		this.files[idx].serverdata = "";
	}
}
 
lfjs.multiupload.prototype.fileQueueError = function(file, error, msg) {
	if (this.settings["fileQueueError"] && typeof this.settings["fileQueueError"] == "function") {
		var ret = this.settings["fileQueueError"](this.domobj, file, error, msg);
	}	
	for(var i=0; i < this.files.length; i++) {
		if(this.files[i].id == file.id) {
			this.files.splice(i, 1);
			break;
		}
	}
}
 
lfjs.multiupload.prototype.fileDialogComplete = function(numselected, numqueued, totalqueue) {
	var ret = true;
	this.queuelength += numqueued;
	//Don't fire on a cancel
	if(numselected == 0)
		return;
	if (this.settings["fileSelectComplete"] && typeof this.settings["fileSelectComplete"] == "function") {
		var ret = this.settings["fileSelectComplete"](this.domobj, this.files, numselected, numqueued);	
	}
	
	if(ret != false) {
		this.swfupload.startUpload();	
	}
 
}
 
lfjs.multiupload.prototype.uploadStart = function(file) {
	var ret = true;
	this.currfilecnt++;
	if (this.settings["uploadStart"] && typeof this.settings["uploadStart"] == "function") {
		var ret = this.settings["uploadStart"](this.domobj, file, this.currfilecnt, this.queuelength);	
	}
	this.currupload = file.id;
	if(ret == false)
		return ret;
}
 
lfjs.multiupload.prototype.uploadProgress = function(file, complete, total) {
	
	if (this.settings["uploadProgress"] && typeof this.settings["uploadProgress"] == "function") {
		var ret = this.settings["uploadProgress"](this.domobj, file, complete, total);	
	}
	if(complete == total) {
		if (this.settings["fileReceived"] && typeof this.settings["fileReceived"] == "function") {
			var ret = this.settings["fileReceived"](this.domobj, file);
		}
	}
}
 
lfjs.multiupload.prototype.uploadError = function(file, error, msg) {
	
	if (this.settings["uploadError"] && typeof this.settings["uploadError"] == "function") {
		var ret = this.settings["uploadError"](this.domobj, file, error, msg);	
	}
}
 
lfjs.multiupload.prototype.uploadSuccess = function(file, data) {
	for(var i=0; i < this.files.length; i++) {
		if(this.files[i].id == file.id) {
			this.files[i].serverdata = data;
			break;
		}
	}
}
 
lfjs.multiupload.prototype.uploadComplete = function(file) {
	var ret = true;
	var data = "";
	var delidx = -1;
	for(var i=0; i < this.files.length; i++) {
		if(this.files[i].id == file.id) {
			var data = this.files[i].serverdata;
			delidx = i;
			break;
		}
	}
	if (this.settings["uploadComplete"] && typeof this.settings["uploadComplete"] == "function") {
		var ret = this.settings["uploadComplete"](this.domobj, file, data);
	}
	if(delidx >= 0)
		this.files.splice(delidx, 1);
	
	this.currupload = "";
	if(ret != false)
		this.swfupload.startUpload();	
	if(this.isIdle())
		this.queueComplete();
	
}
 
lfjs.multiupload.prototype.queueComplete = function() {
	this.queuelength = 0;
	this.currfilecnt = 0;
	if (this.settings["queueComplete"] && typeof this.settings["queueComplete"] == "function") {
		var ret = this.settings["queueComplete"](this.domobj);
	}
 
	
}
 
lfjs.multiupload.prototype.startUpload = function(fileid) {
	this.swfupload.startUpload(fileid);
	
}
 
lfjs.multiupload.prototype.cancelUpload = function(fileid, throwerror) {
	for(var i=0; i < this.files.length; i++) {
		if(this.files[i].id == fileid) {
			this.files.splice(i, 1);
			break;
		}
	}
	this.queuelength--;
	
	this.swfupload.cancelUpload(fileid, throwerror);
	
}
 
lfjs.multiupload.prototype.stopUpload = function() {
	this.swfupload.stopUpload();
	
}
 
lfjs.multiupload.prototype.getFile = function(fileid) {
	for(var i=0; i < this.files.length; i++) {
		if(this.files[i].id == fileid || this.files[i].name == fileid)
			return this.files[i];
	}
	return null;
	
}
 
lfjs.multiupload.prototype.getFiles = function() {
	return this.files;
	
}
 
lfjs.multiupload.prototype.setUploadURL = function(url) {
	this.swfupload.setUploadURL(url);
	
}
 
lfjs.multiupload.prototype.setPostParams = function(paramobj, addremove) {
	if(typeof addremove == "undefined" || addremove == null) {
		this.swfupload.setPostParams(paramobj);
	} else if (addremove == true) {
		for(var i in paramobj) {
			this.swfupload.addPostParam(i, paramobj[i]);
		}
	} else if (addremove == false) {
		for(var i in paramobj) {
			this.swfupload.removePostParam(i);
		}
	}
	
}
 
lfjs.multiupload.prototype.setFilePostParams = function(fileid, paramobj, addremove) {
	var file = this.getFile(fileid);
	if(typeof addremove == "undefined" || addremove == null) {
		var addremove = true;
	}
	if (addremove == true) {
		for(var i in paramobj) {
			this.swfupload.addFileParam(file.id, i, paramobj[i]);
		}
	} else if (addremove == false) {
		for(var i in paramobj) {
			this.swfupload.removeFileParam(file.id, i);
		}
	}
	
}
 
lfjs.multiupload.prototype.isIdle = function() {
	var stats = this.swfupload.getStats();
	if(stats.in_progress == 0 && stats.files_queued == 0 && this.files.length == 0)
		return true;
	return false;
}
 
lfjs.multiupload.flashVersion = function() {
	var flashVer = -1;
	if (navigator.plugins != null && navigator.plugins.length > 0) {
		if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
			var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
			var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
			var descArray = flashDescription.split(" ");
			var tempArrayMajor = descArray[2].split(".");			
			var versionMajor = tempArrayMajor[0];
			var versionMinor = tempArrayMajor[1];
			var versionRevision = descArray[3];
			if (versionRevision == "") {
				versionRevision = descArray[4];
			}
			if (versionRevision[0] == "d") {
				versionRevision = versionRevision.substring(1);
			} else if (versionRevision[0] == "r") {
				versionRevision = versionRevision.substring(1);
				if (versionRevision.indexOf("d") > 0) {
					versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
				}
			}
			flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
		}
	}
	else if ( window.ActiveXObject ) {
		// NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry
		var version;
		try {
			// version will be set for 7.X or greater players
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
			version = axo.GetVariable("$version");
		} catch (e) {
		}
	
		if (!version)
		{
			try {
				// version will be set for 6.X players only
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
				
				// installed player is some revision of 6.0
				// GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
				// so we have to be careful. 
				
				// default to the first public version
				version = "WIN 6,0,21,0";
	
				// throws if AllowScripAccess does not exist (introduced in 6.0r47)		
				axo.AllowScriptAccess = "always";
	
				// safe to call for 6.0r47 or greater
				version = axo.GetVariable("$version");
	
			} catch (e) {
			}
		}
	
		if (!version)
		{
			try {
				// version will be set for 4.X or 5.X player
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
				version = axo.GetVariable("$version");
			} catch (e) {
			}
		}
	
		if (!version)
		{
			try {
				// version will be set for 3.X player
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
				version = "WIN 3,0,18,0";
			} catch (e) {
			}
		}
	
		if (!version)
		{
			try {
				// version will be set for 2.X player
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
				version = "WIN 2,0,0,11";
			} catch (e) {
				version = -1;
			}
		}
		if(version != -1)
			version = version.replace(/^[^\d]*/, "");
		flashVer = version;
	}	
	
	if(flashVer != -1)
		flashVer = flashVer.replace(/,/g, ".");
	return flashVer;
}
 
 
$(function() {
	if ($(".bubble").length) {
		lfjs.bubble.createBubble();
		$('.bubble').each(function(i){
			var title = $(this).attr("title");
			if(title) {
				$(this).attr("title", title.replace(/\<\/?[^\>]*\>/g, ""))
				args = {};
				if($(this).attr("bubblewidth"))
					args.width = parseInt($(this).attr("bubblewidth"), 10)	
				$(this).data("args", args).click(function(event) {
					//console.log($(this).data("args"))
					lfjs.bubble(this, title, $(this).data("args"), event);
				})
			}
		});
	}
});
 
lfjs.bubble = function(domobj, message, args, event) {
	lfjs.bubble.hide();
	if(typeof lfjs.path == "undefined")
		lfjs.path = $("script[src$='lfjs.js']:first").attr("src").replace(/\/[^\/]*$/, "");
	
	if(typeof message == "undefiend" || message.length == 0)
		return;
	if(typeof args == "undefined")
		var args = {};
	var closeimg = lfjs.path + "/lfjsimages/cancel.gif";
	if(args.closeimg)
		closeimg = args.closeimg;
	if(typeof lfjs.bubble.domobj == "undefined") {
		lfjs.bubble.createBubble();		
	}
	
	var width = 225;
	if(typeof args.width != "undefined")
		width = args.width;
	$(lfjs.bubble.domobj).width(width)
 
	if(!$(lfjs.bubble.domobj).find(".lfjsbubble #lfjsbubbleclose").length) {
		var img = document.createElement("img");
		$(img).attr({ id: "lfjsbubbleclose", title: "Close", src: closeimg })
			.error(function() {
				$(this).hide()
			}).click(function() {
				lfjs.bubble.hide();
			})
		$(lfjs.bubble.domobj).prepend(img);
	}
		
	$(lfjs.bubble.domobj).find(".lfjsbubblecontent").html(message);
	if (domobj) {
		var off = $(domobj).offset();
		var dw = $(domobj).width();
		
		var w = $(lfjs.bubble.domobj).width();
		var h = $(lfjs.bubble.domobj).height();
		var top = off.top - h - 5;
		//center bubble tail overr domobj
		var left = off.left - ((width - 70) - (dw / 2));
		var tail = $(".lfjsbubbletail");
		tail.removeClass("top left");
		if (left < 0) {
			var right = width - (off.left + 70)
			//console.log("Right: " + right + " - Width: " + w)
			if (right > (w / 2)) {
				tail.addClass("left")
				right += 35
			}
			tail.css("right", right + "px")
			left = 0;
		} else {
			tail.css("right", "40px")
		}
	}
	
	$(lfjs.bubble.domobj).css({ position: "absolute", top: top, left: left}).show().click(function() {
		return false;
	});
	$(lfjs.bubble.domobj).find("a, :input").click(function(event) {
		event.stopImmediatePropagation()
		return true;
	});
	domobj.blur();
	setTimeout(function() {
		$(document.body).bind("click.hidebubble", function(event) {
		
			lfjs.bubble.hide()
		})
	}, 1)
}
 
lfjs.bubble.hide = function() {
	if (typeof lfjs.bubble.domobj != "undefined") {
		$(lfjs.bubble.domobj).hide();
	}
	$(document.body).unbind("click.hidebubble")
}
lfjs.bubble.createBubble = function() {
	var div = document.createElement("div");
	var html = '<div class="lfjsbubbletop"></div>';
	html += '<div class="lfjsbubbletopright"></div>';
	html += '<div class="lfjsbubblemainwrapper"><div class="lfjsbubblemain">';
	html += '<div class="lfjsbubblecontent"></div></div></div>';
	html += '<div class="lfjsbubblebottom"></div>';
	html += '<div class="lfjsbubblebottomright"></div><div class="lfjsbubbletail"></div>';
	$(div).addClass("lfjsbubble").html(html).hide().appendTo(document.body);
	lfjs.bubble.domobj = div;
}
 
 
 
 
 
/*!
 * jQuery JavaScript Library v1.4.2
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Sat Feb 13 22:33:48 2010 -0500
 */
(function(A,w){function ma(){if(!c.isReady){try{s.documentElement.doScroll("left")}catch(a){setTimeout(ma,1);return}c.ready()}}function Qa(a,b){b.src?c.ajax({url:b.src,async:false,dataType:"script"}):c.globalEval(b.text||b.textContent||b.innerHTML||"");b.parentNode&&b.parentNode.removeChild(b)}function X(a,b,d,f,e,j){var i=a.length;if(typeof b==="object"){for(var o in b)X(a,o,b[o],f,e,d);return a}if(d!==w){f=!j&&f&&c.isFunction(d);for(o=0;o<i;o++)e(a[o],b,f?d.call(a[o],o,e(a[o],b)):d,j);return a}return i?
e(a[0],b):w}function J(){return(new Date).getTime()}function Y(){return false}function Z(){return true}function na(a,b,d){d[0].type=a;return c.event.handle.apply(b,d)}function oa(a){var b,d=[],f=[],e=arguments,j,i,o,k,n,r;i=c.data(this,"events");if(!(a.liveFired===this||!i||!i.live||a.button&&a.type==="click")){a.liveFired=this;var u=i.live.slice(0);for(k=0;k<u.length;k++){i=u[k];i.origType.replace(O,"")===a.type?f.push(i.selector):u.splice(k--,1)}j=c(a.target).closest(f,a.currentTarget);n=0;for(r=
j.length;n<r;n++)for(k=0;k<u.length;k++){i=u[k];if(j[n].selector===i.selector){o=j[n].elem;f=null;if(i.preType==="mouseenter"||i.preType==="mouseleave")f=c(a.relatedTarget).closest(i.selector)[0];if(!f||f!==o)d.push({elem:o,handleObj:i})}}n=0;for(r=d.length;n<r;n++){j=d[n];a.currentTarget=j.elem;a.data=j.handleObj.data;a.handleObj=j.handleObj;if(j.handleObj.origHandler.apply(j.elem,e)===false){b=false;break}}return b}}function pa(a,b){return"live."+(a&&a!=="*"?a+".":"")+b.replace(/\./g,"`").replace(/ /g,
"&")}function qa(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function ra(a,b){var d=0;b.each(function(){if(this.nodeName===(a[d]&&a[d].nodeName)){var f=c.data(a[d++]),e=c.data(this,f);if(f=f&&f.events){delete e.handle;e.events={};for(var j in f)for(var i in f[j])c.event.add(this,j,f[j][i],f[j][i].data)}}})}function sa(a,b,d){var f,e,j;b=b&&b[0]?b[0].ownerDocument||b[0]:s;if(a.length===1&&typeof a[0]==="string"&&a[0].length<512&&b===s&&!ta.test(a[0])&&(c.support.checkClone||!ua.test(a[0]))){e=
true;if(j=c.fragments[a[0]])if(j!==1)f=j}if(!f){f=b.createDocumentFragment();c.clean(a,b,f,d)}if(e)c.fragments[a[0]]=j?f:1;return{fragment:f,cacheable:e}}function K(a,b){var d={};c.each(va.concat.apply([],va.slice(0,b)),function(){d[this]=a});return d}function wa(a){return"scrollTo"in a&&a.document?a:a.nodeType===9?a.defaultView||a.parentWindow:false}var c=function(a,b){return new c.fn.init(a,b)},Ra=A.jQuery,Sa=A.$,s=A.document,T,Ta=/^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/,Ua=/^.[^:#\[\.,]*$/,Va=/\S/,
Wa=/^(\s|\u00A0)+|(\s|\u00A0)+$/g,Xa=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,P=navigator.userAgent,xa=false,Q=[],L,$=Object.prototype.toString,aa=Object.prototype.hasOwnProperty,ba=Array.prototype.push,R=Array.prototype.slice,ya=Array.prototype.indexOf;c.fn=c.prototype={init:function(a,b){var d,f;if(!a)return this;if(a.nodeType){this.context=this[0]=a;this.length=1;return this}if(a==="body"&&!b){this.context=s;this[0]=s.body;this.selector="body";this.length=1;return this}if(typeof a==="string")if((d=Ta.exec(a))&&
(d[1]||!b))if(d[1]){f=b?b.ownerDocument||b:s;if(a=Xa.exec(a))if(c.isPlainObject(b)){a=[s.createElement(a[1])];c.fn.attr.call(a,b,true)}else a=[f.createElement(a[1])];else{a=sa([d[1]],[f]);a=(a.cacheable?a.fragment.cloneNode(true):a.fragment).childNodes}return c.merge(this,a)}else{if(b=s.getElementById(d[2])){if(b.id!==d[2])return T.find(a);this.length=1;this[0]=b}this.context=s;this.selector=a;return this}else if(!b&&/^\w+$/.test(a)){this.selector=a;this.context=s;a=s.getElementsByTagName(a);return c.merge(this,
a)}else return!b||b.jquery?(b||T).find(a):c(b).find(a);else if(c.isFunction(a))return T.ready(a);if(a.selector!==w){this.selector=a.selector;this.context=a.context}return c.makeArray(a,this)},selector:"",jquery:"1.4.2",length:0,size:function(){return this.length},toArray:function(){return R.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this.slice(a)[0]:this[a]},pushStack:function(a,b,d){var f=c();c.isArray(a)?ba.apply(f,a):c.merge(f,a);f.prevObject=this;f.context=this.context;if(b===
"find")f.selector=this.selector+(this.selector?" ":"")+d;else if(b)f.selector=this.selector+"."+b+"("+d+")";return f},each:function(a,b){return c.each(this,a,b)},ready:function(a){c.bindReady();if(c.isReady)a.call(s,c);else Q&&Q.push(a);return this},eq:function(a){return a===-1?this.slice(a):this.slice(a,+a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(R.apply(this,arguments),"slice",R.call(arguments).join(","))},map:function(a){return this.pushStack(c.map(this,
function(b,d){return a.call(b,d,b)}))},end:function(){return this.prevObject||c(null)},push:ba,sort:[].sort,splice:[].splice};c.fn.init.prototype=c.fn;c.extend=c.fn.extend=function(){var a=arguments[0]||{},b=1,d=arguments.length,f=false,e,j,i,o;if(typeof a==="boolean"){f=a;a=arguments[1]||{};b=2}if(typeof a!=="object"&&!c.isFunction(a))a={};if(d===b){a=this;--b}for(;b<d;b++)if((e=arguments[b])!=null)for(j in e){i=a[j];o=e[j];if(a!==o)if(f&&o&&(c.isPlainObject(o)||c.isArray(o))){i=i&&(c.isPlainObject(i)||
c.isArray(i))?i:c.isArray(o)?[]:{};a[j]=c.extend(f,i,o)}else if(o!==w)a[j]=o}return a};c.extend({noConflict:function(a){A.$=Sa;if(a)A.jQuery=Ra;return c},isReady:false,ready:function(){if(!c.isReady){if(!s.body)return setTimeout(c.ready,13);c.isReady=true;if(Q){for(var a,b=0;a=Q[b++];)a.call(s,c);Q=null}c.fn.triggerHandler&&c(s).triggerHandler("ready")}},bindReady:function(){if(!xa){xa=true;if(s.readyState==="complete")return c.ready();if(s.addEventListener){s.addEventListener("DOMContentLoaded",
L,false);A.addEventListener("load",c.ready,false)}else if(s.attachEvent){s.attachEvent("onreadystatechange",L);A.attachEvent("onload",c.ready);var a=false;try{a=A.frameElement==null}catch(b){}s.documentElement.doScroll&&a&&ma()}}},isFunction:function(a){return $.call(a)==="[object Function]"},isArray:function(a){return $.call(a)==="[object Array]"},isPlainObject:function(a){if(!a||$.call(a)!=="[object Object]"||a.nodeType||a.setInterval)return false;if(a.constructor&&!aa.call(a,"constructor")&&!aa.call(a.constructor.prototype,
"isPrototypeOf"))return false;var b;for(b in a);return b===w||aa.call(a,b)},isEmptyObject:function(a){for(var b in a)return false;return true},error:function(a){throw a;},parseJSON:function(a){if(typeof a!=="string"||!a)return null;a=c.trim(a);if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return A.JSON&&A.JSON.parse?A.JSON.parse(a):(new Function("return "+
a))();else c.error("Invalid JSON: "+a)},noop:function(){},globalEval:function(a){if(a&&Va.test(a)){var b=s.getElementsByTagName("head")[0]||s.documentElement,d=s.createElement("script");d.type="text/javascript";if(c.support.scriptEval)d.appendChild(s.createTextNode(a));else d.text=a;b.insertBefore(d,b.firstChild);b.removeChild(d)}},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,b,d){var f,e=0,j=a.length,i=j===w||c.isFunction(a);if(d)if(i)for(f in a){if(b.apply(a[f],
d)===false)break}else for(;e<j;){if(b.apply(a[e++],d)===false)break}else if(i)for(f in a){if(b.call(a[f],f,a[f])===false)break}else for(d=a[0];e<j&&b.call(d,e,d)!==false;d=a[++e]);return a},trim:function(a){return(a||"").replace(Wa,"")},makeArray:function(a,b){b=b||[];if(a!=null)a.length==null||typeof a==="string"||c.isFunction(a)||typeof a!=="function"&&a.setInterval?ba.call(b,a):c.merge(b,a);return b},inArray:function(a,b){if(b.indexOf)return b.indexOf(a);for(var d=0,f=b.length;d<f;d++)if(b[d]===
a)return d;return-1},merge:function(a,b){var d=a.length,f=0;if(typeof b.length==="number")for(var e=b.length;f<e;f++)a[d++]=b[f];else for(;b[f]!==w;)a[d++]=b[f++];a.length=d;return a},grep:function(a,b,d){for(var f=[],e=0,j=a.length;e<j;e++)!d!==!b(a[e],e)&&f.push(a[e]);return f},map:function(a,b,d){for(var f=[],e,j=0,i=a.length;j<i;j++){e=b(a[j],j,d);if(e!=null)f[f.length]=e}return f.concat.apply([],f)},guid:1,proxy:function(a,b,d){if(arguments.length===2)if(typeof b==="string"){d=a;a=d[b];b=w}else if(b&&
!c.isFunction(b)){d=b;b=w}if(!b&&a)b=function(){return a.apply(d||this,arguments)};if(a)b.guid=a.guid=a.guid||b.guid||c.guid++;return b},uaMatch:function(a){a=a.toLowerCase();a=/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version)?[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||!/compatible/.test(a)&&/(mozilla)(?:.*? rv:([\w.]+))?/.exec(a)||[];return{browser:a[1]||"",version:a[2]||"0"}},browser:{}});P=c.uaMatch(P);if(P.browser){c.browser[P.browser]=true;c.browser.version=P.version}if(c.browser.webkit)c.browser.safari=
true;if(ya)c.inArray=function(a,b){return ya.call(b,a)};T=c(s);if(s.addEventListener)L=function(){s.removeEventListener("DOMContentLoaded",L,false);c.ready()};else if(s.attachEvent)L=function(){if(s.readyState==="complete"){s.detachEvent("onreadystatechange",L);c.ready()}};(function(){c.support={};var a=s.documentElement,b=s.createElement("script"),d=s.createElement("div"),f="script"+J();d.style.display="none";d.innerHTML="   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";
var e=d.getElementsByTagName("*"),j=d.getElementsByTagName("a")[0];if(!(!e||!e.length||!j)){c.support={leadingWhitespace:d.firstChild.nodeType===3,tbody:!d.getElementsByTagName("tbody").length,htmlSerialize:!!d.getElementsByTagName("link").length,style:/red/.test(j.getAttribute("style")),hrefNormalized:j.getAttribute("href")==="/a",opacity:/^0.55$/.test(j.style.opacity),cssFloat:!!j.style.cssFloat,checkOn:d.getElementsByTagName("input")[0].value==="on",optSelected:s.createElement("select").appendChild(s.createElement("option")).selected,
parentNode:d.removeChild(d.appendChild(s.createElement("div"))).parentNode===null,deleteExpando:true,checkClone:false,scriptEval:false,noCloneEvent:true,boxModel:null};b.type="text/javascript";try{b.appendChild(s.createTextNode("window."+f+"=1;"))}catch(i){}a.insertBefore(b,a.firstChild);if(A[f]){c.support.scriptEval=true;delete A[f]}try{delete b.test}catch(o){c.support.deleteExpando=false}a.removeChild(b);if(d.attachEvent&&d.fireEvent){d.attachEvent("onclick",function k(){c.support.noCloneEvent=
false;d.detachEvent("onclick",k)});d.cloneNode(true).fireEvent("onclick")}d=s.createElement("div");d.innerHTML="<input type='radio' name='radiotest' checked='checked'/>";a=s.createDocumentFragment();a.appendChild(d.firstChild);c.support.checkClone=a.cloneNode(true).cloneNode(true).lastChild.checked;c(function(){var k=s.createElement("div");k.style.width=k.style.paddingLeft="1px";s.body.appendChild(k);c.boxModel=c.support.boxModel=k.offsetWidth===2;s.body.removeChild(k).style.display="none"});a=function(k){var n=
s.createElement("div");k="on"+k;var r=k in n;if(!r){n.setAttribute(k,"return;");r=typeof n[k]==="function"}return r};c.support.submitBubbles=a("submit");c.support.changeBubbles=a("change");a=b=d=e=j=null}})();c.props={"for":"htmlFor","class":"className",readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing",rowspan:"rowSpan",colspan:"colSpan",tabindex:"tabIndex",usemap:"useMap",frameborder:"frameBorder"};var G="jQuery"+J(),Ya=0,za={};c.extend({cache:{},expando:G,noData:{embed:true,object:true,
applet:true},data:function(a,b,d){if(!(a.nodeName&&c.noData[a.nodeName.toLowerCase()])){a=a==A?za:a;var f=a[G],e=c.cache;if(!f&&typeof b==="string"&&d===w)return null;f||(f=++Ya);if(typeof b==="object"){a[G]=f;e[f]=c.extend(true,{},b)}else if(!e[f]){a[G]=f;e[f]={}}a=e[f];if(d!==w)a[b]=d;return typeof b==="string"?a[b]:a}},removeData:function(a,b){if(!(a.nodeName&&c.noData[a.nodeName.toLowerCase()])){a=a==A?za:a;var d=a[G],f=c.cache,e=f[d];if(b){if(e){delete e[b];c.isEmptyObject(e)&&c.removeData(a)}}else{if(c.support.deleteExpando)delete a[c.expando];
else a.removeAttribute&&a.removeAttribute(c.expando);delete f[d]}}}});c.fn.extend({data:function(a,b){if(typeof a==="undefined"&&this.length)return c.data(this[0]);else if(typeof a==="object")return this.each(function(){c.data(this,a)});var d=a.split(".");d[1]=d[1]?"."+d[1]:"";if(b===w){var f=this.triggerHandler("getData"+d[1]+"!",[d[0]]);if(f===w&&this.length)f=c.data(this[0],a);return f===w&&d[1]?this.data(d[0]):f}else return this.trigger("setData"+d[1]+"!",[d[0],b]).each(function(){c.data(this,
a,b)})},removeData:function(a){return this.each(function(){c.removeData(this,a)})}});c.extend({queue:function(a,b,d){if(a){b=(b||"fx")+"queue";var f=c.data(a,b);if(!d)return f||[];if(!f||c.isArray(d))f=c.data(a,b,c.makeArray(d));else f.push(d);return f}},dequeue:function(a,b){b=b||"fx";var d=c.queue(a,b),f=d.shift();if(f==="inprogress")f=d.shift();if(f){b==="fx"&&d.unshift("inprogress");f.call(a,function(){c.dequeue(a,b)})}}});c.fn.extend({queue:function(a,b){if(typeof a!=="string"){b=a;a="fx"}if(b===
w)return c.queue(this[0],a);return this.each(function(){var d=c.queue(this,a,b);a==="fx"&&d[0]!=="inprogress"&&c.dequeue(this,a)})},dequeue:function(a){return this.each(function(){c.dequeue(this,a)})},delay:function(a,b){a=c.fx?c.fx.speeds[a]||a:a;b=b||"fx";return this.queue(b,function(){var d=this;setTimeout(function(){c.dequeue(d,b)},a)})},clearQueue:function(a){return this.queue(a||"fx",[])}});var Aa=/[\n\t]/g,ca=/\s+/,Za=/\r/g,$a=/href|src|style/,ab=/(button|input)/i,bb=/(button|input|object|select|textarea)/i,
cb=/^(a|area)$/i,Ba=/radio|checkbox/;c.fn.extend({attr:function(a,b){return X(this,a,b,true,c.attr)},removeAttr:function(a){return this.each(function(){c.attr(this,a,"");this.nodeType===1&&this.removeAttribute(a)})},addClass:function(a){if(c.isFunction(a))return this.each(function(n){var r=c(this);r.addClass(a.call(this,n,r.attr("class")))});if(a&&typeof a==="string")for(var b=(a||"").split(ca),d=0,f=this.length;d<f;d++){var e=this[d];if(e.nodeType===1)if(e.className){for(var j=" "+e.className+" ",
i=e.className,o=0,k=b.length;o<k;o++)if(j.indexOf(" "+b[o]+" ")<0)i+=" "+b[o];e.className=c.trim(i)}else e.className=a}return this},removeClass:function(a){if(c.isFunction(a))return this.each(function(k){var n=c(this);n.removeClass(a.call(this,k,n.attr("class")))});if(a&&typeof a==="string"||a===w)for(var b=(a||"").split(ca),d=0,f=this.length;d<f;d++){var e=this[d];if(e.nodeType===1&&e.className)if(a){for(var j=(" "+e.className+" ").replace(Aa," "),i=0,o=b.length;i<o;i++)j=j.replace(" "+b[i]+" ",
" ");e.className=c.trim(j)}else e.className=""}return this},toggleClass:function(a,b){var d=typeof a,f=typeof b==="boolean";if(c.isFunction(a))return this.each(function(e){var j=c(this);j.toggleClass(a.call(this,e,j.attr("class"),b),b)});return this.each(function(){if(d==="string")for(var e,j=0,i=c(this),o=b,k=a.split(ca);e=k[j++];){o=f?o:!i.hasClass(e);i[o?"addClass":"removeClass"](e)}else if(d==="undefined"||d==="boolean"){this.className&&c.data(this,"__className__",this.className);this.className=
this.className||a===false?"":c.data(this,"__className__")||""}})},hasClass:function(a){a=" "+a+" ";for(var b=0,d=this.length;b<d;b++)if((" "+this[b].className+" ").replace(Aa," ").indexOf(a)>-1)return true;return false},val:function(a){if(a===w){var b=this[0];if(b){if(c.nodeName(b,"option"))return(b.attributes.value||{}).specified?b.value:b.text;if(c.nodeName(b,"select")){var d=b.selectedIndex,f=[],e=b.options;b=b.type==="select-one";if(d<0)return null;var j=b?d:0;for(d=b?d+1:e.length;j<d;j++){var i=
e[j];if(i.selected){a=c(i).val();if(b)return a;f.push(a)}}return f}if(Ba.test(b.type)&&!c.support.checkOn)return b.getAttribute("value")===null?"on":b.value;return(b.value||"").replace(Za,"")}return w}var o=c.isFunction(a);return this.each(function(k){var n=c(this),r=a;if(this.nodeType===1){if(o)r=a.call(this,k,n.val());if(typeof r==="number")r+="";if(c.isArray(r)&&Ba.test(this.type))this.checked=c.inArray(n.val(),r)>=0;else if(c.nodeName(this,"select")){var u=c.makeArray(r);c("option",this).each(function(){this.selected=
c.inArray(c(this).val(),u)>=0});if(!u.length)this.selectedIndex=-1}else this.value=r}})}});c.extend({attrFn:{val:true,css:true,html:true,text:true,data:true,width:true,height:true,offset:true},attr:function(a,b,d,f){if(!a||a.nodeType===3||a.nodeType===8)return w;if(f&&b in c.attrFn)return c(a)[b](d);f=a.nodeType!==1||!c.isXMLDoc(a);var e=d!==w;b=f&&c.props[b]||b;if(a.nodeType===1){var j=$a.test(b);if(b in a&&f&&!j){if(e){b==="type"&&ab.test(a.nodeName)&&a.parentNode&&c.error("type property can't be changed");
a[b]=d}if(c.nodeName(a,"form")&&a.getAttributeNode(b))return a.getAttributeNode(b).nodeValue;if(b==="tabIndex")return(b=a.getAttributeNode("tabIndex"))&&b.specified?b.value:bb.test(a.nodeName)||cb.test(a.nodeName)&&a.href?0:w;return a[b]}if(!c.support.style&&f&&b==="style"){if(e)a.style.cssText=""+d;return a.style.cssText}e&&a.setAttribute(b,""+d);a=!c.support.hrefNormalized&&f&&j?a.getAttribute(b,2):a.getAttribute(b);return a===null?w:a}return c.style(a,b,d)}});var O=/\.(.*)$/,db=function(a){return a.replace(/[^\w\s\.\|`]/g,
function(b){return"\\"+b})};c.event={add:function(a,b,d,f){if(!(a.nodeType===3||a.nodeType===8)){if(a.setInterval&&a!==A&&!a.frameElement)a=A;var e,j;if(d.handler){e=d;d=e.handler}if(!d.guid)d.guid=c.guid++;if(j=c.data(a)){var i=j.events=j.events||{},o=j.handle;if(!o)j.handle=o=function(){return typeof c!=="undefined"&&!c.event.triggered?c.event.handle.apply(o.elem,arguments):w};o.elem=a;b=b.split(" ");for(var k,n=0,r;k=b[n++];){j=e?c.extend({},e):{handler:d,data:f};if(k.indexOf(".")>-1){r=k.split(".");
k=r.shift();j.namespace=r.slice(0).sort().join(".")}else{r=[];j.namespace=""}j.type=k;j.guid=d.guid;var u=i[k],z=c.event.special[k]||{};if(!u){u=i[k]=[];if(!z.setup||z.setup.call(a,f,r,o)===false)if(a.addEventListener)a.addEventListener(k,o,false);else a.attachEvent&&a.attachEvent("on"+k,o)}if(z.add){z.add.call(a,j);if(!j.handler.guid)j.handler.guid=d.guid}u.push(j);c.event.global[k]=true}a=null}}},global:{},remove:function(a,b,d,f){if(!(a.nodeType===3||a.nodeType===8)){var e,j=0,i,o,k,n,r,u,z=c.data(a),
C=z&&z.events;if(z&&C){if(b&&b.type){d=b.handler;b=b.type}if(!b||typeof b==="string"&&b.charAt(0)==="."){b=b||"";for(e in C)c.event.remove(a,e+b)}else{for(b=b.split(" ");e=b[j++];){n=e;i=e.indexOf(".")<0;o=[];if(!i){o=e.split(".");e=o.shift();k=new RegExp("(^|\\.)"+c.map(o.slice(0).sort(),db).join("\\.(?:.*\\.)?")+"(\\.|$)")}if(r=C[e])if(d){n=c.event.special[e]||{};for(B=f||0;B<r.length;B++){u=r[B];if(d.guid===u.guid){if(i||k.test(u.namespace)){f==null&&r.splice(B--,1);n.remove&&n.remove.call(a,u)}if(f!=
null)break}}if(r.length===0||f!=null&&r.length===1){if(!n.teardown||n.teardown.call(a,o)===false)Ca(a,e,z.handle);delete C[e]}}else for(var B=0;B<r.length;B++){u=r[B];if(i||k.test(u.namespace)){c.event.remove(a,n,u.handler,B);r.splice(B--,1)}}}if(c.isEmptyObject(C)){if(b=z.handle)b.elem=null;delete z.events;delete z.handle;c.isEmptyObject(z)&&c.removeData(a)}}}}},trigger:function(a,b,d,f){var e=a.type||a;if(!f){a=typeof a==="object"?a[G]?a:c.extend(c.Event(e),a):c.Event(e);if(e.indexOf("!")>=0){a.type=
e=e.slice(0,-1);a.exclusive=true}if(!d){a.stopPropagation();c.event.global[e]&&c.each(c.cache,function(){this.events&&this.events[e]&&c.event.trigger(a,b,this.handle.elem)})}if(!d||d.nodeType===3||d.nodeType===8)return w;a.result=w;a.target=d;b=c.makeArray(b);b.unshift(a)}a.currentTarget=d;(f=c.data(d,"handle"))&&f.apply(d,b);f=d.parentNode||d.ownerDocument;try{if(!(d&&d.nodeName&&c.noData[d.nodeName.toLowerCase()]))if(d["on"+e]&&d["on"+e].apply(d,b)===false)a.result=false}catch(j){}if(!a.isPropagationStopped()&&
f)c.event.trigger(a,b,f,true);else if(!a.isDefaultPrevented()){f=a.target;var i,o=c.nodeName(f,"a")&&e==="click",k=c.event.special[e]||{};if((!k._default||k._default.call(d,a)===false)&&!o&&!(f&&f.nodeName&&c.noData[f.nodeName.toLowerCase()])){try{if(f[e]){if(i=f["on"+e])f["on"+e]=null;c.event.triggered=true;f[e]()}}catch(n){}if(i)f["on"+e]=i;c.event.triggered=false}}},handle:function(a){var b,d,f,e;a=arguments[0]=c.event.fix(a||A.event);a.currentTarget=this;b=a.type.indexOf(".")<0&&!a.exclusive;
if(!b){d=a.type.split(".");a.type=d.shift();f=new RegExp("(^|\\.)"+d.slice(0).sort().join("\\.(?:.*\\.)?")+"(\\.|$)")}e=c.data(this,"events");d=e[a.type];if(e&&d){d=d.slice(0);e=0;for(var j=d.length;e<j;e++){var i=d[e];if(b||f.test(i.namespace)){a.handler=i.handler;a.data=i.data;a.handleObj=i;i=i.handler.apply(this,arguments);if(i!==w){a.result=i;if(i===false){a.preventDefault();a.stopPropagation()}}if(a.isImmediatePropagationStopped())break}}}return a.result},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
fix:function(a){if(a[G])return a;var b=a;a=c.Event(b);for(var d=this.props.length,f;d;){f=this.props[--d];a[f]=b[f]}if(!a.target)a.target=a.srcElement||s;if(a.target.nodeType===3)a.target=a.target.parentNode;if(!a.relatedTarget&&a.fromElement)a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement;if(a.pageX==null&&a.clientX!=null){b=s.documentElement;d=s.body;a.pageX=a.clientX+(b&&b.scrollLeft||d&&d.scrollLeft||0)-(b&&b.clientLeft||d&&d.clientLeft||0);a.pageY=a.clientY+(b&&b.scrollTop||
d&&d.scrollTop||0)-(b&&b.clientTop||d&&d.clientTop||0)}if(!a.which&&(a.charCode||a.charCode===0?a.charCode:a.keyCode))a.which=a.charCode||a.keyCode;if(!a.metaKey&&a.ctrlKey)a.metaKey=a.ctrlKey;if(!a.which&&a.button!==w)a.which=a.button&1?1:a.button&2?3:a.button&4?2:0;return a},guid:1E8,proxy:c.proxy,special:{ready:{setup:c.bindReady,teardown:c.noop},live:{add:function(a){c.event.add(this,a.origType,c.extend({},a,{handler:oa}))},remove:function(a){var b=true,d=a.origType.replace(O,"");c.each(c.data(this,
"events").live||[],function(){if(d===this.origType.replace(O,""))return b=false});b&&c.event.remove(this,a.origType,oa)}},beforeunload:{setup:function(a,b,d){if(this.setInterval)this.onbeforeunload=d;return false},teardown:function(a,b){if(this.onbeforeunload===b)this.onbeforeunload=null}}}};var Ca=s.removeEventListener?function(a,b,d){a.removeEventListener(b,d,false)}:function(a,b,d){a.detachEvent("on"+b,d)};c.Event=function(a){if(!this.preventDefault)return new c.Event(a);if(a&&a.type){this.originalEvent=
a;this.type=a.type}else this.type=a;this.timeStamp=J();this[G]=true};c.Event.prototype={preventDefault:function(){this.isDefaultPrevented=Z;var a=this.originalEvent;if(a){a.preventDefault&&a.preventDefault();a.returnValue=false}},stopPropagation:function(){this.isPropagationStopped=Z;var a=this.originalEvent;if(a){a.stopPropagation&&a.stopPropagation();a.cancelBubble=true}},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=Z;this.stopPropagation()},isDefaultPrevented:Y,isPropagationStopped:Y,
isImmediatePropagationStopped:Y};var Da=function(a){var b=a.relatedTarget;try{for(;b&&b!==this;)b=b.parentNode;if(b!==this){a.type=a.data;c.event.handle.apply(this,arguments)}}catch(d){}},Ea=function(a){a.type=a.data;c.event.handle.apply(this,arguments)};c.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){c.event.special[a]={setup:function(d){c.event.add(this,b,d&&d.selector?Ea:Da,a)},teardown:function(d){c.event.remove(this,b,d&&d.selector?Ea:Da)}}});if(!c.support.submitBubbles)c.event.special.submit=
{setup:function(){if(this.nodeName.toLowerCase()!=="form"){c.event.add(this,"click.specialSubmit",function(a){var b=a.target,d=b.type;if((d==="submit"||d==="image")&&c(b).closest("form").length)return na("submit",this,arguments)});c.event.add(this,"keypress.specialSubmit",function(a){var b=a.target,d=b.type;if((d==="text"||d==="password")&&c(b).closest("form").length&&a.keyCode===13)return na("submit",this,arguments)})}else return false},teardown:function(){c.event.remove(this,".specialSubmit")}};
if(!c.support.changeBubbles){var da=/textarea|input|select/i,ea,Fa=function(a){var b=a.type,d=a.value;if(b==="radio"||b==="checkbox")d=a.checked;else if(b==="select-multiple")d=a.selectedIndex>-1?c.map(a.options,function(f){return f.selected}).join("-"):"";else if(a.nodeName.toLowerCase()==="select")d=a.selectedIndex;return d},fa=function(a,b){var d=a.target,f,e;if(!(!da.test(d.nodeName)||d.readOnly)){f=c.data(d,"_change_data");e=Fa(d);if(a.type!=="focusout"||d.type!=="radio")c.data(d,"_change_data",
e);if(!(f===w||e===f))if(f!=null||e){a.type="change";return c.event.trigger(a,b,d)}}};c.event.special.change={filters:{focusout:fa,click:function(a){var b=a.target,d=b.type;if(d==="radio"||d==="checkbox"||b.nodeName.toLowerCase()==="select")return fa.call(this,a)},keydown:function(a){var b=a.target,d=b.type;if(a.keyCode===13&&b.nodeName.toLowerCase()!=="textarea"||a.keyCode===32&&(d==="checkbox"||d==="radio")||d==="select-multiple")return fa.call(this,a)},beforeactivate:function(a){a=a.target;c.data(a,
"_change_data",Fa(a))}},setup:function(){if(this.type==="file")return false;for(var a in ea)c.event.add(this,a+".specialChange",ea[a]);return da.test(this.nodeName)},teardown:function(){c.event.remove(this,".specialChange");return da.test(this.nodeName)}};ea=c.event.special.change.filters}s.addEventListener&&c.each({focus:"focusin",blur:"focusout"},function(a,b){function d(f){f=c.event.fix(f);f.type=b;return c.event.handle.call(this,f)}c.event.special[b]={setup:function(){this.addEventListener(a,
d,true)},teardown:function(){this.removeEventListener(a,d,true)}}});c.each(["bind","one"],function(a,b){c.fn[b]=function(d,f,e){if(typeof d==="object"){for(var j in d)this[b](j,f,d[j],e);return this}if(c.isFunction(f)){e=f;f=w}var i=b==="one"?c.proxy(e,function(k){c(this).unbind(k,i);return e.apply(this,arguments)}):e;if(d==="unload"&&b!=="one")this.one(d,f,e);else{j=0;for(var o=this.length;j<o;j++)c.event.add(this[j],d,i,f)}return this}});c.fn.extend({unbind:function(a,b){if(typeof a==="object"&&
!a.preventDefault)for(var d in a)this.unbind(d,a[d]);else{d=0;for(var f=this.length;d<f;d++)c.event.remove(this[d],a,b)}return this},delegate:function(a,b,d,f){return this.live(b,d,f,a)},undelegate:function(a,b,d){return arguments.length===0?this.unbind("live"):this.die(b,null,d,a)},trigger:function(a,b){return this.each(function(){c.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0]){a=c.Event(a);a.preventDefault();a.stopPropagation();c.event.trigger(a,b,this[0]);return a.result}},
toggle:function(a){for(var b=arguments,d=1;d<b.length;)c.proxy(a,b[d++]);return this.click(c.proxy(a,function(f){var e=(c.data(this,"lastToggle"+a.guid)||0)%d;c.data(this,"lastToggle"+a.guid,e+1);f.preventDefault();return b[e].apply(this,arguments)||false}))},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}});var Ga={focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"};c.each(["live","die"],function(a,b){c.fn[b]=function(d,f,e,j){var i,o=0,k,n,r=j||this.selector,
u=j?this:c(this.context);if(c.isFunction(f)){e=f;f=w}for(d=(d||"").split(" ");(i=d[o++])!=null;){j=O.exec(i);k="";if(j){k=j[0];i=i.replace(O,"")}if(i==="hover")d.push("mouseenter"+k,"mouseleave"+k);else{n=i;if(i==="focus"||i==="blur"){d.push(Ga[i]+k);i+=k}else i=(Ga[i]||i)+k;b==="live"?u.each(function(){c.event.add(this,pa(i,r),{data:f,selector:r,handler:e,origType:i,origHandler:e,preType:n})}):u.unbind(pa(i,r),e)}}return this}});c.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),
function(a,b){c.fn[b]=function(d){return d?this.bind(b,d):this.trigger(b)};if(c.attrFn)c.attrFn[b]=true});A.attachEvent&&!A.addEventListener&&A.attachEvent("onunload",function(){for(var a in c.cache)if(c.cache[a].handle)try{c.event.remove(c.cache[a].handle.elem)}catch(b){}});(function(){function a(g){for(var h="",l,m=0;g[m];m++){l=g[m];if(l.nodeType===3||l.nodeType===4)h+=l.nodeValue;else if(l.nodeType!==8)h+=a(l.childNodes)}return h}function b(g,h,l,m,q,p){q=0;for(var v=m.length;q<v;q++){var t=m[q];
if(t){t=t[g];for(var y=false;t;){if(t.sizcache===l){y=m[t.sizset];break}if(t.nodeType===1&&!p){t.sizcache=l;t.sizset=q}if(t.nodeName.toLowerCase()===h){y=t;break}t=t[g]}m[q]=y}}}function d(g,h,l,m,q,p){q=0;for(var v=m.length;q<v;q++){var t=m[q];if(t){t=t[g];for(var y=false;t;){if(t.sizcache===l){y=m[t.sizset];break}if(t.nodeType===1){if(!p){t.sizcache=l;t.sizset=q}if(typeof h!=="string"){if(t===h){y=true;break}}else if(k.filter(h,[t]).length>0){y=t;break}}t=t[g]}m[q]=y}}}var f=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
e=0,j=Object.prototype.toString,i=false,o=true;[0,0].sort(function(){o=false;return 0});var k=function(g,h,l,m){l=l||[];var q=h=h||s;if(h.nodeType!==1&&h.nodeType!==9)return[];if(!g||typeof g!=="string")return l;for(var p=[],v,t,y,S,H=true,M=x(h),I=g;(f.exec(""),v=f.exec(I))!==null;){I=v[3];p.push(v[1]);if(v[2]){S=v[3];break}}if(p.length>1&&r.exec(g))if(p.length===2&&n.relative[p[0]])t=ga(p[0]+p[1],h);else for(t=n.relative[p[0]]?[h]:k(p.shift(),h);p.length;){g=p.shift();if(n.relative[g])g+=p.shift();
t=ga(g,t)}else{if(!m&&p.length>1&&h.nodeType===9&&!M&&n.match.ID.test(p[0])&&!n.match.ID.test(p[p.length-1])){v=k.find(p.shift(),h,M);h=v.expr?k.filter(v.expr,v.set)[0]:v.set[0]}if(h){v=m?{expr:p.pop(),set:z(m)}:k.find(p.pop(),p.length===1&&(p[0]==="~"||p[0]==="+")&&h.parentNode?h.parentNode:h,M);t=v.expr?k.filter(v.expr,v.set):v.set;if(p.length>0)y=z(t);else H=false;for(;p.length;){var D=p.pop();v=D;if(n.relative[D])v=p.pop();else D="";if(v==null)v=h;n.relative[D](y,v,M)}}else y=[]}y||(y=t);y||k.error(D||
g);if(j.call(y)==="[object Array]")if(H)if(h&&h.nodeType===1)for(g=0;y[g]!=null;g++){if(y[g]&&(y[g]===true||y[g].nodeType===1&&E(h,y[g])))l.push(t[g])}else for(g=0;y[g]!=null;g++)y[g]&&y[g].nodeType===1&&l.push(t[g]);else l.push.apply(l,y);else z(y,l);if(S){k(S,q,l,m);k.uniqueSort(l)}return l};k.uniqueSort=function(g){if(B){i=o;g.sort(B);if(i)for(var h=1;h<g.length;h++)g[h]===g[h-1]&&g.splice(h--,1)}return g};k.matches=function(g,h){return k(g,null,null,h)};k.find=function(g,h,l){var m,q;if(!g)return[];
for(var p=0,v=n.order.length;p<v;p++){var t=n.order[p];if(q=n.leftMatch[t].exec(g)){var y=q[1];q.splice(1,1);if(y.substr(y.length-1)!=="\\"){q[1]=(q[1]||"").replace(/\\/g,"");m=n.find[t](q,h,l);if(m!=null){g=g.replace(n.match[t],"");break}}}}m||(m=h.getElementsByTagName("*"));return{set:m,expr:g}};k.filter=function(g,h,l,m){for(var q=g,p=[],v=h,t,y,S=h&&h[0]&&x(h[0]);g&&h.length;){for(var H in n.filter)if((t=n.leftMatch[H].exec(g))!=null&&t[2]){var M=n.filter[H],I,D;D=t[1];y=false;t.splice(1,1);if(D.substr(D.length-
1)!=="\\"){if(v===p)p=[];if(n.preFilter[H])if(t=n.preFilter[H](t,v,l,p,m,S)){if(t===true)continue}else y=I=true;if(t)for(var U=0;(D=v[U])!=null;U++)if(D){I=M(D,t,U,v);var Ha=m^!!I;if(l&&I!=null)if(Ha)y=true;else v[U]=false;else if(Ha){p.push(D);y=true}}if(I!==w){l||(v=p);g=g.replace(n.match[H],"");if(!y)return[];break}}}if(g===q)if(y==null)k.error(g);else break;q=g}return v};k.error=function(g){throw"Syntax error, unrecognized expression: "+g;};var n=k.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
CLASS:/\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(g){return g.getAttribute("href")}},
relative:{"+":function(g,h){var l=typeof h==="string",m=l&&!/\W/.test(h);l=l&&!m;if(m)h=h.toLowerCase();m=0;for(var q=g.length,p;m<q;m++)if(p=g[m]){for(;(p=p.previousSibling)&&p.nodeType!==1;);g[m]=l||p&&p.nodeName.toLowerCase()===h?p||false:p===h}l&&k.filter(h,g,true)},">":function(g,h){var l=typeof h==="string";if(l&&!/\W/.test(h)){h=h.toLowerCase();for(var m=0,q=g.length;m<q;m++){var p=g[m];if(p){l=p.parentNode;g[m]=l.nodeName.toLowerCase()===h?l:false}}}else{m=0;for(q=g.length;m<q;m++)if(p=g[m])g[m]=
l?p.parentNode:p.parentNode===h;l&&k.filter(h,g,true)}},"":function(g,h,l){var m=e++,q=d;if(typeof h==="string"&&!/\W/.test(h)){var p=h=h.toLowerCase();q=b}q("parentNode",h,m,g,p,l)},"~":function(g,h,l){var m=e++,q=d;if(typeof h==="string"&&!/\W/.test(h)){var p=h=h.toLowerCase();q=b}q("previousSibling",h,m,g,p,l)}},find:{ID:function(g,h,l){if(typeof h.getElementById!=="undefined"&&!l)return(g=h.getElementById(g[1]))?[g]:[]},NAME:function(g,h){if(typeof h.getElementsByName!=="undefined"){var l=[];
h=h.getElementsByName(g[1]);for(var m=0,q=h.length;m<q;m++)h[m].getAttribute("name")===g[1]&&l.push(h[m]);return l.length===0?null:l}},TAG:function(g,h){return h.getElementsByTagName(g[1])}},preFilter:{CLASS:function(g,h,l,m,q,p){g=" "+g[1].replace(/\\/g,"")+" ";if(p)return g;p=0;for(var v;(v=h[p])!=null;p++)if(v)if(q^(v.className&&(" "+v.className+" ").replace(/[\t\n]/g," ").indexOf(g)>=0))l||m.push(v);else if(l)h[p]=false;return false},ID:function(g){return g[1].replace(/\\/g,"")},TAG:function(g){return g[1].toLowerCase()},
CHILD:function(g){if(g[1]==="nth"){var h=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(g[2]==="even"&&"2n"||g[2]==="odd"&&"2n+1"||!/\D/.test(g[2])&&"0n+"+g[2]||g[2]);g[2]=h[1]+(h[2]||1)-0;g[3]=h[3]-0}g[0]=e++;return g},ATTR:function(g,h,l,m,q,p){h=g[1].replace(/\\/g,"");if(!p&&n.attrMap[h])g[1]=n.attrMap[h];if(g[2]==="~=")g[4]=" "+g[4]+" ";return g},PSEUDO:function(g,h,l,m,q){if(g[1]==="not")if((f.exec(g[3])||"").length>1||/^\w/.test(g[3]))g[3]=k(g[3],null,null,h);else{g=k.filter(g[3],h,l,true^q);l||m.push.apply(m,
g);return false}else if(n.match.POS.test(g[0])||n.match.CHILD.test(g[0]))return true;return g},POS:function(g){g.unshift(true);return g}},filters:{enabled:function(g){return g.disabled===false&&g.type!=="hidden"},disabled:function(g){return g.disabled===true},checked:function(g){return g.checked===true},selected:function(g){return g.selected===true},parent:function(g){return!!g.firstChild},empty:function(g){return!g.firstChild},has:function(g,h,l){return!!k(l[3],g).length},header:function(g){return/h\d/i.test(g.nodeName)},
text:function(g){return"text"===g.type},radio:function(g){return"radio"===g.type},checkbox:function(g){return"checkbox"===g.type},file:function(g){return"file"===g.type},password:function(g){return"password"===g.type},submit:function(g){return"submit"===g.type},image:function(g){return"image"===g.type},reset:function(g){return"reset"===g.type},button:function(g){return"button"===g.type||g.nodeName.toLowerCase()==="button"},input:function(g){return/input|select|textarea|button/i.test(g.nodeName)}},
setFilters:{first:function(g,h){return h===0},last:function(g,h,l,m){return h===m.length-1},even:function(g,h){return h%2===0},odd:function(g,h){return h%2===1},lt:function(g,h,l){return h<l[3]-0},gt:function(g,h,l){return h>l[3]-0},nth:function(g,h,l){return l[3]-0===h},eq:function(g,h,l){return l[3]-0===h}},filter:{PSEUDO:function(g,h,l,m){var q=h[1],p=n.filters[q];if(p)return p(g,l,h,m);else if(q==="contains")return(g.textContent||g.innerText||a([g])||"").indexOf(h[3])>=0;else if(q==="not"){h=
h[3];l=0;for(m=h.length;l<m;l++)if(h[l]===g)return false;return true}else k.error("Syntax error, unrecognized expression: "+q)},CHILD:function(g,h){var l=h[1],m=g;switch(l){case "only":case "first":for(;m=m.previousSibling;)if(m.nodeType===1)return false;if(l==="first")return true;m=g;case "last":for(;m=m.nextSibling;)if(m.nodeType===1)return false;return true;case "nth":l=h[2];var q=h[3];if(l===1&&q===0)return true;h=h[0];var p=g.parentNode;if(p&&(p.sizcache!==h||!g.nodeIndex)){var v=0;for(m=p.firstChild;m;m=
m.nextSibling)if(m.nodeType===1)m.nodeIndex=++v;p.sizcache=h}g=g.nodeIndex-q;return l===0?g===0:g%l===0&&g/l>=0}},ID:function(g,h){return g.nodeType===1&&g.getAttribute("id")===h},TAG:function(g,h){return h==="*"&&g.nodeType===1||g.nodeName.toLowerCase()===h},CLASS:function(g,h){return(" "+(g.className||g.getAttribute("class"))+" ").indexOf(h)>-1},ATTR:function(g,h){var l=h[1];g=n.attrHandle[l]?n.attrHandle[l](g):g[l]!=null?g[l]:g.getAttribute(l);l=g+"";var m=h[2];h=h[4];return g==null?m==="!=":m===
"="?l===h:m==="*="?l.indexOf(h)>=0:m==="~="?(" "+l+" ").indexOf(h)>=0:!h?l&&g!==false:m==="!="?l!==h:m==="^="?l.indexOf(h)===0:m==="$="?l.substr(l.length-h.length)===h:m==="|="?l===h||l.substr(0,h.length+1)===h+"-":false},POS:function(g,h,l,m){var q=n.setFilters[h[2]];if(q)return q(g,l,h,m)}}},r=n.match.POS;for(var u in n.match){n.match[u]=new RegExp(n.match[u].source+/(?![^\[]*\])(?![^\(]*\))/.source);n.leftMatch[u]=new RegExp(/(^(?:.|\r|\n)*?)/.source+n.match[u].source.replace(/\\(\d+)/g,function(g,
h){return"\\"+(h-0+1)}))}var z=function(g,h){g=Array.prototype.slice.call(g,0);if(h){h.push.apply(h,g);return h}return g};try{Array.prototype.slice.call(s.documentElement.childNodes,0)}catch(C){z=function(g,h){h=h||[];if(j.call(g)==="[object Array]")Array.prototype.push.apply(h,g);else if(typeof g.length==="number")for(var l=0,m=g.length;l<m;l++)h.push(g[l]);else for(l=0;g[l];l++)h.push(g[l]);return h}}var B;if(s.documentElement.compareDocumentPosition)B=function(g,h){if(!g.compareDocumentPosition||
!h.compareDocumentPosition){if(g==h)i=true;return g.compareDocumentPosition?-1:1}g=g.compareDocumentPosition(h)&4?-1:g===h?0:1;if(g===0)i=true;return g};else if("sourceIndex"in s.documentElement)B=function(g,h){if(!g.sourceIndex||!h.sourceIndex){if(g==h)i=true;return g.sourceIndex?-1:1}g=g.sourceIndex-h.sourceIndex;if(g===0)i=true;return g};else if(s.createRange)B=function(g,h){if(!g.ownerDocument||!h.ownerDocument){if(g==h)i=true;return g.ownerDocument?-1:1}var l=g.ownerDocument.createRange(),m=
h.ownerDocument.createRange();l.setStart(g,0);l.setEnd(g,0);m.setStart(h,0);m.setEnd(h,0);g=l.compareBoundaryPoints(Range.START_TO_END,m);if(g===0)i=true;return g};(function(){var g=s.createElement("div"),h="script"+(new Date).getTime();g.innerHTML="<a name='"+h+"'/>";var l=s.documentElement;l.insertBefore(g,l.firstChild);if(s.getElementById(h)){n.find.ID=function(m,q,p){if(typeof q.getElementById!=="undefined"&&!p)return(q=q.getElementById(m[1]))?q.id===m[1]||typeof q.getAttributeNode!=="undefined"&&
q.getAttributeNode("id").nodeValue===m[1]?[q]:w:[]};n.filter.ID=function(m,q){var p=typeof m.getAttributeNode!=="undefined"&&m.getAttributeNode("id");return m.nodeType===1&&p&&p.nodeValue===q}}l.removeChild(g);l=g=null})();(function(){var g=s.createElement("div");g.appendChild(s.createComment(""));if(g.getElementsByTagName("*").length>0)n.find.TAG=function(h,l){l=l.getElementsByTagName(h[1]);if(h[1]==="*"){h=[];for(var m=0;l[m];m++)l[m].nodeType===1&&h.push(l[m]);l=h}return l};g.innerHTML="<a href='#'></a>";
if(g.firstChild&&typeof g.firstChild.getAttribute!=="undefined"&&g.firstChild.getAttribute("href")!=="#")n.attrHandle.href=function(h){return h.getAttribute("href",2)};g=null})();s.querySelectorAll&&function(){var g=k,h=s.createElement("div");h.innerHTML="<p class='TEST'></p>";if(!(h.querySelectorAll&&h.querySelectorAll(".TEST").length===0)){k=function(m,q,p,v){q=q||s;if(!v&&q.nodeType===9&&!x(q))try{return z(q.querySelectorAll(m),p)}catch(t){}return g(m,q,p,v)};for(var l in g)k[l]=g[l];h=null}}();
(function(){var g=s.createElement("div");g.innerHTML="<div class='test e'></div><div class='test'></div>";if(!(!g.getElementsByClassName||g.getElementsByClassName("e").length===0)){g.lastChild.className="e";if(g.getElementsByClassName("e").length!==1){n.order.splice(1,0,"CLASS");n.find.CLASS=function(h,l,m){if(typeof l.getElementsByClassName!=="undefined"&&!m)return l.getElementsByClassName(h[1])};g=null}}})();var E=s.compareDocumentPosition?function(g,h){return!!(g.compareDocumentPosition(h)&16)}:
function(g,h){return g!==h&&(g.contains?g.contains(h):true)},x=function(g){return(g=(g?g.ownerDocument||g:0).documentElement)?g.nodeName!=="HTML":false},ga=function(g,h){var l=[],m="",q;for(h=h.nodeType?[h]:h;q=n.match.PSEUDO.exec(g);){m+=q[0];g=g.replace(n.match.PSEUDO,"")}g=n.relative[g]?g+"*":g;q=0;for(var p=h.length;q<p;q++)k(g,h[q],l);return k.filter(m,l)};c.find=k;c.expr=k.selectors;c.expr[":"]=c.expr.filters;c.unique=k.uniqueSort;c.text=a;c.isXMLDoc=x;c.contains=E})();var eb=/Until$/,fb=/^(?:parents|prevUntil|prevAll)/,
gb=/,/;R=Array.prototype.slice;var Ia=function(a,b,d){if(c.isFunction(b))return c.grep(a,function(e,j){return!!b.call(e,j,e)===d});else if(b.nodeType)return c.grep(a,function(e){return e===b===d});else if(typeof b==="string"){var f=c.grep(a,function(e){return e.nodeType===1});if(Ua.test(b))return c.filter(b,f,!d);else b=c.filter(b,f)}return c.grep(a,function(e){return c.inArray(e,b)>=0===d})};c.fn.extend({find:function(a){for(var b=this.pushStack("","find",a),d=0,f=0,e=this.length;f<e;f++){d=b.length;
c.find(a,this[f],b);if(f>0)for(var j=d;j<b.length;j++)for(var i=0;i<d;i++)if(b[i]===b[j]){b.splice(j--,1);break}}return b},has:function(a){var b=c(a);return this.filter(function(){for(var d=0,f=b.length;d<f;d++)if(c.contains(this,b[d]))return true})},not:function(a){return this.pushStack(Ia(this,a,false),"not",a)},filter:function(a){return this.pushStack(Ia(this,a,true),"filter",a)},is:function(a){return!!a&&c.filter(a,this).length>0},closest:function(a,b){if(c.isArray(a)){var d=[],f=this[0],e,j=
{},i;if(f&&a.length){e=0;for(var o=a.length;e<o;e++){i=a[e];j[i]||(j[i]=c.expr.match.POS.test(i)?c(i,b||this.context):i)}for(;f&&f.ownerDocument&&f!==b;){for(i in j){e=j[i];if(e.jquery?e.index(f)>-1:c(f).is(e)){d.push({selector:i,elem:f});delete j[i]}}f=f.parentNode}}return d}var k=c.expr.match.POS.test(a)?c(a,b||this.context):null;return this.map(function(n,r){for(;r&&r.ownerDocument&&r!==b;){if(k?k.index(r)>-1:c(r).is(a))return r;r=r.parentNode}return null})},index:function(a){if(!a||typeof a===
"string")return c.inArray(this[0],a?c(a):this.parent().children());return c.inArray(a.jquery?a[0]:a,this)},add:function(a,b){a=typeof a==="string"?c(a,b||this.context):c.makeArray(a);b=c.merge(this.get(),a);return this.pushStack(qa(a[0])||qa(b[0])?b:c.unique(b))},andSelf:function(){return this.add(this.prevObject)}});c.each({parent:function(a){return(a=a.parentNode)&&a.nodeType!==11?a:null},parents:function(a){return c.dir(a,"parentNode")},parentsUntil:function(a,b,d){return c.dir(a,"parentNode",
d)},next:function(a){return c.nth(a,2,"nextSibling")},prev:function(a){return c.nth(a,2,"previousSibling")},nextAll:function(a){return c.dir(a,"nextSibling")},prevAll:function(a){return c.dir(a,"previousSibling")},nextUntil:function(a,b,d){return c.dir(a,"nextSibling",d)},prevUntil:function(a,b,d){return c.dir(a,"previousSibling",d)},siblings:function(a){return c.sibling(a.parentNode.firstChild,a)},children:function(a){return c.sibling(a.firstChild)},contents:function(a){return c.nodeName(a,"iframe")?
a.contentDocument||a.contentWindow.document:c.makeArray(a.childNodes)}},function(a,b){c.fn[a]=function(d,f){var e=c.map(this,b,d);eb.test(a)||(f=d);if(f&&typeof f==="string")e=c.filter(f,e);e=this.length>1?c.unique(e):e;if((this.length>1||gb.test(f))&&fb.test(a))e=e.reverse();return this.pushStack(e,a,R.call(arguments).join(","))}});c.extend({filter:function(a,b,d){if(d)a=":not("+a+")";return c.find.matches(a,b)},dir:function(a,b,d){var f=[];for(a=a[b];a&&a.nodeType!==9&&(d===w||a.nodeType!==1||!c(a).is(d));){a.nodeType===
1&&f.push(a);a=a[b]}return f},nth:function(a,b,d){b=b||1;for(var f=0;a;a=a[d])if(a.nodeType===1&&++f===b)break;return a},sibling:function(a,b){for(var d=[];a;a=a.nextSibling)a.nodeType===1&&a!==b&&d.push(a);return d}});var Ja=/ jQuery\d+="(?:\d+|null)"/g,V=/^\s+/,Ka=/(<([\w:]+)[^>]*?)\/>/g,hb=/^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i,La=/<([\w:]+)/,ib=/<tbody/i,jb=/<|&#?\w+;/,ta=/<script|<object|<embed|<option|<style/i,ua=/checked\s*(?:[^=]|=\s*.checked.)/i,Ma=function(a,b,d){return hb.test(d)?
a:b+"></"+d+">"},F={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};F.optgroup=F.option;F.tbody=F.tfoot=F.colgroup=F.caption=F.thead;F.th=F.td;if(!c.support.htmlSerialize)F._default=[1,"div<div>","</div>"];c.fn.extend({text:function(a){if(c.isFunction(a))return this.each(function(b){var d=
c(this);d.text(a.call(this,b,d.text()))});if(typeof a!=="object"&&a!==w)return this.empty().append((this[0]&&this[0].ownerDocument||s).createTextNode(a));return c.text(this)},wrapAll:function(a){if(c.isFunction(a))return this.each(function(d){c(this).wrapAll(a.call(this,d))});if(this[0]){var b=c(a,this[0].ownerDocument).eq(0).clone(true);this[0].parentNode&&b.insertBefore(this[0]);b.map(function(){for(var d=this;d.firstChild&&d.firstChild.nodeType===1;)d=d.firstChild;return d}).append(this)}return this},
wrapInner:function(a){if(c.isFunction(a))return this.each(function(b){c(this).wrapInner(a.call(this,b))});return this.each(function(){var b=c(this),d=b.contents();d.length?d.wrapAll(a):b.append(a)})},wrap:function(a){return this.each(function(){c(this).wrapAll(a)})},unwrap:function(){return this.parent().each(function(){c.nodeName(this,"body")||c(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,true,function(a){this.nodeType===1&&this.appendChild(a)})},
prepend:function(){return this.domManip(arguments,true,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,false,function(b){this.parentNode.insertBefore(b,this)});else if(arguments.length){var a=c(arguments[0]);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,false,function(b){this.parentNode.insertBefore(b,
this.nextSibling)});else if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,c(arguments[0]).toArray());return a}},remove:function(a,b){for(var d=0,f;(f=this[d])!=null;d++)if(!a||c.filter(a,[f]).length){if(!b&&f.nodeType===1){c.cleanData(f.getElementsByTagName("*"));c.cleanData([f])}f.parentNode&&f.parentNode.removeChild(f)}return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++)for(b.nodeType===1&&c.cleanData(b.getElementsByTagName("*"));b.firstChild;)b.removeChild(b.firstChild);
return this},clone:function(a){var b=this.map(function(){if(!c.support.noCloneEvent&&!c.isXMLDoc(this)){var d=this.outerHTML,f=this.ownerDocument;if(!d){d=f.createElement("div");d.appendChild(this.cloneNode(true));d=d.innerHTML}return c.clean([d.replace(Ja,"").replace(/=([^="'>\s]+\/)>/g,'="$1">').replace(V,"")],f)[0]}else return this.cloneNode(true)});if(a===true){ra(this,b);ra(this.find("*"),b.find("*"))}return b},html:function(a){if(a===w)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(Ja,
""):null;else if(typeof a==="string"&&!ta.test(a)&&(c.support.leadingWhitespace||!V.test(a))&&!F[(La.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Ka,Ma);try{for(var b=0,d=this.length;b<d;b++)if(this[b].nodeType===1){c.cleanData(this[b].getElementsByTagName("*"));this[b].innerHTML=a}}catch(f){this.empty().append(a)}}else c.isFunction(a)?this.each(function(e){var j=c(this),i=j.html();j.empty().append(function(){return a.call(this,e,i)})}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&
this[0].parentNode){if(c.isFunction(a))return this.each(function(b){var d=c(this),f=d.html();d.replaceWith(a.call(this,b,f))});if(typeof a!=="string")a=c(a).detach();return this.each(function(){var b=this.nextSibling,d=this.parentNode;c(this).remove();b?c(b).before(a):c(d).append(a)})}else return this.pushStack(c(c.isFunction(a)?a():a),"replaceWith",a)},detach:function(a){return this.remove(a,true)},domManip:function(a,b,d){function f(u){return c.nodeName(u,"table")?u.getElementsByTagName("tbody")[0]||
u.appendChild(u.ownerDocument.createElement("tbody")):u}var e,j,i=a[0],o=[],k;if(!c.support.checkClone&&arguments.length===3&&typeof i==="string"&&ua.test(i))return this.each(function(){c(this).domManip(a,b,d,true)});if(c.isFunction(i))return this.each(function(u){var z=c(this);a[0]=i.call(this,u,b?z.html():w);z.domManip(a,b,d)});if(this[0]){e=i&&i.parentNode;e=c.support.parentNode&&e&&e.nodeType===11&&e.childNodes.length===this.length?{fragment:e}:sa(a,this,o);k=e.fragment;if(j=k.childNodes.length===
1?(k=k.firstChild):k.firstChild){b=b&&c.nodeName(j,"tr");for(var n=0,r=this.length;n<r;n++)d.call(b?f(this[n],j):this[n],n>0||e.cacheable||this.length>1?k.cloneNode(true):k)}o.length&&c.each(o,Qa)}return this}});c.fragments={};c.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){c.fn[a]=function(d){var f=[];d=c(d);var e=this.length===1&&this[0].parentNode;if(e&&e.nodeType===11&&e.childNodes.length===1&&d.length===1){d[b](this[0]);
return this}else{e=0;for(var j=d.length;e<j;e++){var i=(e>0?this.clone(true):this).get();c.fn[b].apply(c(d[e]),i);f=f.concat(i)}return this.pushStack(f,a,d.selector)}}});c.extend({clean:function(a,b,d,f){b=b||s;if(typeof b.createElement==="undefined")b=b.ownerDocument||b[0]&&b[0].ownerDocument||s;for(var e=[],j=0,i;(i=a[j])!=null;j++){if(typeof i==="number")i+="";if(i){if(typeof i==="string"&&!jb.test(i))i=b.createTextNode(i);else if(typeof i==="string"){i=i.replace(Ka,Ma);var o=(La.exec(i)||["",
""])[1].toLowerCase(),k=F[o]||F._default,n=k[0],r=b.createElement("div");for(r.innerHTML=k[1]+i+k[2];n--;)r=r.lastChild;if(!c.support.tbody){n=ib.test(i);o=o==="table"&&!n?r.firstChild&&r.firstChild.childNodes:k[1]==="<table>"&&!n?r.childNodes:[];for(k=o.length-1;k>=0;--k)c.nodeName(o[k],"tbody")&&!o[k].childNodes.length&&o[k].parentNode.removeChild(o[k])}!c.support.leadingWhitespace&&V.test(i)&&r.insertBefore(b.createTextNode(V.exec(i)[0]),r.firstChild);i=r.childNodes}if(i.nodeType)e.push(i);else e=
c.merge(e,i)}}if(d)for(j=0;e[j];j++)if(f&&c.nodeName(e[j],"script")&&(!e[j].type||e[j].type.toLowerCase()==="text/javascript"))f.push(e[j].parentNode?e[j].parentNode.removeChild(e[j]):e[j]);else{e[j].nodeType===1&&e.splice.apply(e,[j+1,0].concat(c.makeArray(e[j].getElementsByTagName("script"))));d.appendChild(e[j])}return e},cleanData:function(a){for(var b,d,f=c.cache,e=c.event.special,j=c.support.deleteExpando,i=0,o;(o=a[i])!=null;i++)if(d=o[c.expando]){b=f[d];if(b.events)for(var k in b.events)e[k]?
c.event.remove(o,k):Ca(o,k,b.handle);if(j)delete o[c.expando];else o.removeAttribute&&o.removeAttribute(c.expando);delete f[d]}}});var kb=/z-?index|font-?weight|opacity|zoom|line-?height/i,Na=/alpha\([^)]*\)/,Oa=/opacity=([^)]*)/,ha=/float/i,ia=/-([a-z])/ig,lb=/([A-Z])/g,mb=/^-?\d+(?:px)?$/i,nb=/^-?\d/,ob={position:"absolute",visibility:"hidden",display:"block"},pb=["Left","Right"],qb=["Top","Bottom"],rb=s.defaultView&&s.defaultView.getComputedStyle,Pa=c.support.cssFloat?"cssFloat":"styleFloat",ja=
function(a,b){return b.toUpperCase()};c.fn.css=function(a,b){return X(this,a,b,true,function(d,f,e){if(e===w)return c.curCSS(d,f);if(typeof e==="number"&&!kb.test(f))e+="px";c.style(d,f,e)})};c.extend({style:function(a,b,d){if(!a||a.nodeType===3||a.nodeType===8)return w;if((b==="width"||b==="height")&&parseFloat(d)<0)d=w;var f=a.style||a,e=d!==w;if(!c.support.opacity&&b==="opacity"){if(e){f.zoom=1;b=parseInt(d,10)+""==="NaN"?"":"alpha(opacity="+d*100+")";a=f.filter||c.curCSS(a,"filter")||"";f.filter=
Na.test(a)?a.replace(Na,b):b}return f.filter&&f.filter.indexOf("opacity=")>=0?parseFloat(Oa.exec(f.filter)[1])/100+"":""}if(ha.test(b))b=Pa;b=b.replace(ia,ja);if(e)f[b]=d;return f[b]},css:function(a,b,d,f){if(b==="width"||b==="height"){var e,j=b==="width"?pb:qb;function i(){e=b==="width"?a.offsetWidth:a.offsetHeight;f!=="border"&&c.each(j,function(){f||(e-=parseFloat(c.curCSS(a,"padding"+this,true))||0);if(f==="margin")e+=parseFloat(c.curCSS(a,"margin"+this,true))||0;else e-=parseFloat(c.curCSS(a,
"border"+this+"Width",true))||0})}a.offsetWidth!==0?i():c.swap(a,ob,i);return Math.max(0,Math.round(e))}return c.curCSS(a,b,d)},curCSS:function(a,b,d){var f,e=a.style;if(!c.support.opacity&&b==="opacity"&&a.currentStyle){f=Oa.test(a.currentStyle.filter||"")?parseFloat(RegExp.$1)/100+"":"";return f===""?"1":f}if(ha.test(b))b=Pa;if(!d&&e&&e[b])f=e[b];else if(rb){if(ha.test(b))b="float";b=b.replace(lb,"-$1").toLowerCase();e=a.ownerDocument.defaultView;if(!e)return null;if(a=e.getComputedStyle(a,null))f=
a.getPropertyValue(b);if(b==="opacity"&&f==="")f="1"}else if(a.currentStyle){d=b.replace(ia,ja);f=a.currentStyle[b]||a.currentStyle[d];if(!mb.test(f)&&nb.test(f)){b=e.left;var j=a.runtimeStyle.left;a.runtimeStyle.left=a.currentStyle.left;e.left=d==="fontSize"?"1em":f||0;f=e.pixelLeft+"px";e.left=b;a.runtimeStyle.left=j}}return f},swap:function(a,b,d){var f={};for(var e in b){f[e]=a.style[e];a.style[e]=b[e]}d.call(a);for(e in b)a.style[e]=f[e]}});if(c.expr&&c.expr.filters){c.expr.filters.hidden=function(a){var b=
a.offsetWidth,d=a.offsetHeight,f=a.nodeName.toLowerCase()==="tr";return b===0&&d===0&&!f?true:b>0&&d>0&&!f?false:c.curCSS(a,"display")==="none"};c.expr.filters.visible=function(a){return!c.expr.filters.hidden(a)}}var sb=J(),tb=/<script(.|\s)*?\/script>/gi,ub=/select|textarea/i,vb=/color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i,N=/=\?(&|$)/,ka=/\?/,wb=/(\?|&)_=.*?(&|$)/,xb=/^(\w+:)?\/\/([^\/?#]+)/,yb=/%20/g,zb=c.fn.load;c.fn.extend({load:function(a,b,d){if(typeof a!==
"string")return zb.call(this,a);else if(!this.length)return this;var f=a.indexOf(" ");if(f>=0){var e=a.slice(f,a.length);a=a.slice(0,f)}f="GET";if(b)if(c.isFunction(b)){d=b;b=null}else if(typeof b==="object"){b=c.param(b,c.ajaxSettings.traditional);f="POST"}var j=this;c.ajax({url:a,type:f,dataType:"html",data:b,complete:function(i,o){if(o==="success"||o==="notmodified")j.html(e?c("<div />").append(i.responseText.replace(tb,"")).find(e):i.responseText);d&&j.each(d,[i.responseText,o,i])}});return this},
serialize:function(){return c.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?c.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||ub.test(this.nodeName)||vb.test(this.type))}).map(function(a,b){a=c(this).val();return a==null?null:c.isArray(a)?c.map(a,function(d){return{name:b.name,value:d}}):{name:b.name,value:a}}).get()}});c.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),
function(a,b){c.fn[b]=function(d){return this.bind(b,d)}});c.extend({get:function(a,b,d,f){if(c.isFunction(b)){f=f||d;d=b;b=null}return c.ajax({type:"GET",url:a,data:b,success:d,dataType:f})},getScript:function(a,b){return c.get(a,null,b,"script")},getJSON:function(a,b,d){return c.get(a,b,d,"json")},post:function(a,b,d,f){if(c.isFunction(b)){f=f||d;d=b;b={}}return c.ajax({type:"POST",url:a,data:b,success:d,dataType:f})},ajaxSetup:function(a){c.extend(c.ajaxSettings,a)},ajaxSettings:{url:location.href,
global:true,type:"GET",contentType:"application/x-www-form-urlencoded",processData:true,async:true,xhr:A.XMLHttpRequest&&(A.location.protocol!=="file:"||!A.ActiveXObject)?function(){return new A.XMLHttpRequest}:function(){try{return new A.ActiveXObject("Microsoft.XMLHTTP")}catch(a){}},accepts:{xml:"application/xml, text/xml",html:"text/html",script:"text/javascript, application/javascript",json:"application/json, text/javascript",text:"text/plain",_default:"*/*"}},lastModified:{},etag:{},ajax:function(a){function b(){e.success&&
e.success.call(k,o,i,x);e.global&&f("ajaxSuccess",[x,e])}function d(){e.complete&&e.complete.call(k,x,i);e.global&&f("ajaxComplete",[x,e]);e.global&&!--c.active&&c.event.trigger("ajaxStop")}function f(q,p){(e.context?c(e.context):c.event).trigger(q,p)}var e=c.extend(true,{},c.ajaxSettings,a),j,i,o,k=a&&a.context||e,n=e.type.toUpperCase();if(e.data&&e.processData&&typeof e.data!=="string")e.data=c.param(e.data,e.traditional);if(e.dataType==="jsonp"){if(n==="GET")N.test(e.url)||(e.url+=(ka.test(e.url)?
"&":"?")+(e.jsonp||"callback")+"=?");else if(!e.data||!N.test(e.data))e.data=(e.data?e.data+"&":"")+(e.jsonp||"callback")+"=?";e.dataType="json"}if(e.dataType==="json"&&(e.data&&N.test(e.data)||N.test(e.url))){j=e.jsonpCallback||"jsonp"+sb++;if(e.data)e.data=(e.data+"").replace(N,"="+j+"$1");e.url=e.url.replace(N,"="+j+"$1");e.dataType="script";A[j]=A[j]||function(q){o=q;b();d();A[j]=w;try{delete A[j]}catch(p){}z&&z.removeChild(C)}}if(e.dataType==="script"&&e.cache===null)e.cache=false;if(e.cache===
false&&n==="GET"){var r=J(),u=e.url.replace(wb,"$1_="+r+"$2");e.url=u+(u===e.url?(ka.test(e.url)?"&":"?")+"_="+r:"")}if(e.data&&n==="GET")e.url+=(ka.test(e.url)?"&":"?")+e.data;e.global&&!c.active++&&c.event.trigger("ajaxStart");r=(r=xb.exec(e.url))&&(r[1]&&r[1]!==location.protocol||r[2]!==location.host);if(e.dataType==="script"&&n==="GET"&&r){var z=s.getElementsByTagName("head")[0]||s.documentElement,C=s.createElement("script");C.src=e.url;if(e.scriptCharset)C.charset=e.scriptCharset;if(!j){var B=
false;C.onload=C.onreadystatechange=function(){if(!B&&(!this.readyState||this.readyState==="loaded"||this.readyState==="complete")){B=true;b();d();C.onload=C.onreadystatechange=null;z&&C.parentNode&&z.removeChild(C)}}}z.insertBefore(C,z.firstChild);return w}var E=false,x=e.xhr();if(x){e.username?x.open(n,e.url,e.async,e.username,e.password):x.open(n,e.url,e.async);try{if(e.data||a&&a.contentType)x.setRequestHeader("Content-Type",e.contentType);if(e.ifModified){c.lastModified[e.url]&&x.setRequestHeader("If-Modified-Since",
c.lastModified[e.url]);c.etag[e.url]&&x.setRequestHeader("If-None-Match",c.etag[e.url])}r||x.setRequestHeader("X-Requested-With","XMLHttpRequest");x.setRequestHeader("Accept",e.dataType&&e.accepts[e.dataType]?e.accepts[e.dataType]+", */*":e.accepts._default)}catch(ga){}if(e.beforeSend&&e.beforeSend.call(k,x,e)===false){e.global&&!--c.active&&c.event.trigger("ajaxStop");x.abort();return false}e.global&&f("ajaxSend",[x,e]);var g=x.onreadystatechange=function(q){if(!x||x.readyState===0||q==="abort"){E||
d();E=true;if(x)x.onreadystatechange=c.noop}else if(!E&&x&&(x.readyState===4||q==="timeout")){E=true;x.onreadystatechange=c.noop;i=q==="timeout"?"timeout":!c.httpSuccess(x)?"error":e.ifModified&&c.httpNotModified(x,e.url)?"notmodified":"success";var p;if(i==="success")try{o=c.httpData(x,e.dataType,e)}catch(v){i="parsererror";p=v}if(i==="success"||i==="notmodified")j||b();else c.handleError(e,x,i,p);d();q==="timeout"&&x.abort();if(e.async)x=null}};try{var h=x.abort;x.abort=function(){x&&h.call(x);
g("abort")}}catch(l){}e.async&&e.timeout>0&&setTimeout(function(){x&&!E&&g("timeout")},e.timeout);try{x.send(n==="POST"||n==="PUT"||n==="DELETE"?e.data:null)}catch(m){c.handleError(e,x,null,m);d()}e.async||g();return x}},handleError:function(a,b,d,f){if(a.error)a.error.call(a.context||a,b,d,f);if(a.global)(a.context?c(a.context):c.event).trigger("ajaxError",[b,a,f])},active:0,httpSuccess:function(a){try{return!a.status&&location.protocol==="file:"||a.status>=200&&a.status<300||a.status===304||a.status===
1223||a.status===0}catch(b){}return false},httpNotModified:function(a,b){var d=a.getResponseHeader("Last-Modified"),f=a.getResponseHeader("Etag");if(d)c.lastModified[b]=d;if(f)c.etag[b]=f;return a.status===304||a.status===0},httpData:function(a,b,d){var f=a.getResponseHeader("content-type")||"",e=b==="xml"||!b&&f.indexOf("xml")>=0;a=e?a.responseXML:a.responseText;e&&a.documentElement.nodeName==="parsererror"&&c.error("parsererror");if(d&&d.dataFilter)a=d.dataFilter(a,b);if(typeof a==="string")if(b===
"json"||!b&&f.indexOf("json")>=0)a=c.parseJSON(a);else if(b==="script"||!b&&f.indexOf("javascript")>=0)c.globalEval(a);return a},param:function(a,b){function d(i,o){if(c.isArray(o))c.each(o,function(k,n){b||/\[\]$/.test(i)?f(i,n):d(i+"["+(typeof n==="object"||c.isArray(n)?k:"")+"]",n)});else!b&&o!=null&&typeof o==="object"?c.each(o,function(k,n){d(i+"["+k+"]",n)}):f(i,o)}function f(i,o){o=c.isFunction(o)?o():o;e[e.length]=encodeURIComponent(i)+"="+encodeURIComponent(o)}var e=[];if(b===w)b=c.ajaxSettings.traditional;
if(c.isArray(a)||a.jquery)c.each(a,function(){f(this.name,this.value)});else for(var j in a)d(j,a[j]);return e.join("&").replace(yb,"+")}});var la={},Ab=/toggle|show|hide/,Bb=/^([+-]=)?([\d+-.]+)(.*)$/,W,va=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]];c.fn.extend({show:function(a,b){if(a||a===0)return this.animate(K("show",3),a,b);else{a=0;for(b=this.length;a<b;a++){var d=c.data(this[a],"olddisplay");
this[a].style.display=d||"";if(c.css(this[a],"display")==="none"){d=this[a].nodeName;var f;if(la[d])f=la[d];else{var e=c("<"+d+" />").appendTo("body");f=e.css("display");if(f==="none")f="block";e.remove();la[d]=f}c.data(this[a],"olddisplay",f)}}a=0;for(b=this.length;a<b;a++)this[a].style.display=c.data(this[a],"olddisplay")||"";return this}},hide:function(a,b){if(a||a===0)return this.animate(K("hide",3),a,b);else{a=0;for(b=this.length;a<b;a++){var d=c.data(this[a],"olddisplay");!d&&d!=="none"&&c.data(this[a],
"olddisplay",c.css(this[a],"display"))}a=0;for(b=this.length;a<b;a++)this[a].style.display="none";return this}},_toggle:c.fn.toggle,toggle:function(a,b){var d=typeof a==="boolean";if(c.isFunction(a)&&c.isFunction(b))this._toggle.apply(this,arguments);else a==null||d?this.each(function(){var f=d?a:c(this).is(":hidden");c(this)[f?"show":"hide"]()}):this.animate(K("toggle",3),a,b);return this},fadeTo:function(a,b,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,d)},
animate:function(a,b,d,f){var e=c.speed(b,d,f);if(c.isEmptyObject(a))return this.each(e.complete);return this[e.queue===false?"each":"queue"](function(){var j=c.extend({},e),i,o=this.nodeType===1&&c(this).is(":hidden"),k=this;for(i in a){var n=i.replace(ia,ja);if(i!==n){a[n]=a[i];delete a[i];i=n}if(a[i]==="hide"&&o||a[i]==="show"&&!o)return j.complete.call(this);if((i==="height"||i==="width")&&this.style){j.display=c.css(this,"display");j.overflow=this.style.overflow}if(c.isArray(a[i])){(j.specialEasing=
j.specialEasing||{})[i]=a[i][1];a[i]=a[i][0]}}if(j.overflow!=null)this.style.overflow="hidden";j.curAnim=c.extend({},a);c.each(a,function(r,u){var z=new c.fx(k,j,r);if(Ab.test(u))z[u==="toggle"?o?"show":"hide":u](a);else{var C=Bb.exec(u),B=z.cur(true)||0;if(C){u=parseFloat(C[2]);var E=C[3]||"px";if(E!=="px"){k.style[r]=(u||1)+E;B=(u||1)/z.cur(true)*B;k.style[r]=B+E}if(C[1])u=(C[1]==="-="?-1:1)*u+B;z.custom(B,u,E)}else z.custom(B,u,"")}});return true})},stop:function(a,b){var d=c.timers;a&&this.queue([]);
this.each(function(){for(var f=d.length-1;f>=0;f--)if(d[f].elem===this){b&&d[f](true);d.splice(f,1)}});b||this.dequeue();return this}});c.each({slideDown:K("show",1),slideUp:K("hide",1),slideToggle:K("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"}},function(a,b){c.fn[a]=function(d,f){return this.animate(b,d,f)}});c.extend({speed:function(a,b,d){var f=a&&typeof a==="object"?a:{complete:d||!d&&b||c.isFunction(a)&&a,duration:a,easing:d&&b||b&&!c.isFunction(b)&&b};f.duration=c.fx.off?0:typeof f.duration===
"number"?f.duration:c.fx.speeds[f.duration]||c.fx.speeds._default;f.old=f.complete;f.complete=function(){f.queue!==false&&c(this).dequeue();c.isFunction(f.old)&&f.old.call(this)};return f},easing:{linear:function(a,b,d,f){return d+f*a},swing:function(a,b,d,f){return(-Math.cos(a*Math.PI)/2+0.5)*f+d}},timers:[],fx:function(a,b,d){this.options=b;this.elem=a;this.prop=d;if(!b.orig)b.orig={}}});c.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this);(c.fx.step[this.prop]||
c.fx.step._default)(this);if((this.prop==="height"||this.prop==="width")&&this.elem.style)this.elem.style.display="block"},cur:function(a){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];return(a=parseFloat(c.css(this.elem,this.prop,a)))&&a>-10000?a:parseFloat(c.curCSS(this.elem,this.prop))||0},custom:function(a,b,d){function f(j){return e.step(j)}this.startTime=J();this.start=a;this.end=b;this.unit=d||this.unit||"px";this.now=this.start;
this.pos=this.state=0;var e=this;f.elem=this.elem;if(f()&&c.timers.push(f)&&!W)W=setInterval(c.fx.tick,13)},show:function(){this.options.orig[this.prop]=c.style(this.elem,this.prop);this.options.show=true;this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur());c(this.elem).show()},hide:function(){this.options.orig[this.prop]=c.style(this.elem,this.prop);this.options.hide=true;this.custom(this.cur(),0)},step:function(a){var b=J(),d=true;if(a||b>=this.options.duration+this.startTime){this.now=
this.end;this.pos=this.state=1;this.update();this.options.curAnim[this.prop]=true;for(var f in this.options.curAnim)if(this.options.curAnim[f]!==true)d=false;if(d){if(this.options.display!=null){this.elem.style.overflow=this.options.overflow;a=c.data(this.elem,"olddisplay");this.elem.style.display=a?a:this.options.display;if(c.css(this.elem,"display")==="none")this.elem.style.display="block"}this.options.hide&&c(this.elem).hide();if(this.options.hide||this.options.show)for(var e in this.options.curAnim)c.style(this.elem,
e,this.options.orig[e]);this.options.complete.call(this.elem)}return false}else{e=b-this.startTime;this.state=e/this.options.duration;a=this.options.easing||(c.easing.swing?"swing":"linear");this.pos=c.easing[this.options.specialEasing&&this.options.specialEasing[this.prop]||a](this.state,e,0,1,this.options.duration);this.now=this.start+(this.end-this.start)*this.pos;this.update()}return true}};c.extend(c.fx,{tick:function(){for(var a=c.timers,b=0;b<a.length;b++)a[b]()||a.splice(b--,1);a.length||
c.fx.stop()},stop:function(){clearInterval(W);W=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){c.style(a.elem,"opacity",a.now)},_default:function(a){if(a.elem.style&&a.elem.style[a.prop]!=null)a.elem.style[a.prop]=(a.prop==="width"||a.prop==="height"?Math.max(0,a.now):a.now)+a.unit;else a.elem[a.prop]=a.now}}});if(c.expr&&c.expr.filters)c.expr.filters.animated=function(a){return c.grep(c.timers,function(b){return a===b.elem}).length};c.fn.offset="getBoundingClientRect"in s.documentElement?
function(a){var b=this[0];if(a)return this.each(function(e){c.offset.setOffset(this,a,e)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return c.offset.bodyOffset(b);var d=b.getBoundingClientRect(),f=b.ownerDocument;b=f.body;f=f.documentElement;return{top:d.top+(self.pageYOffset||c.support.boxModel&&f.scrollTop||b.scrollTop)-(f.clientTop||b.clientTop||0),left:d.left+(self.pageXOffset||c.support.boxModel&&f.scrollLeft||b.scrollLeft)-(f.clientLeft||b.clientLeft||0)}}:function(a){var b=
this[0];if(a)return this.each(function(r){c.offset.setOffset(this,a,r)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return c.offset.bodyOffset(b);c.offset.initialize();var d=b.offsetParent,f=b,e=b.ownerDocument,j,i=e.documentElement,o=e.body;f=(e=e.defaultView)?e.getComputedStyle(b,null):b.currentStyle;for(var k=b.offsetTop,n=b.offsetLeft;(b=b.parentNode)&&b!==o&&b!==i;){if(c.offset.supportsFixedPosition&&f.position==="fixed")break;j=e?e.getComputedStyle(b,null):b.currentStyle;
k-=b.scrollTop;n-=b.scrollLeft;if(b===d){k+=b.offsetTop;n+=b.offsetLeft;if(c.offset.doesNotAddBorder&&!(c.offset.doesAddBorderForTableAndCells&&/^t(able|d|h)$/i.test(b.nodeName))){k+=parseFloat(j.borderTopWidth)||0;n+=parseFloat(j.borderLeftWidth)||0}f=d;d=b.offsetParent}if(c.offset.subtractsBorderForOverflowNotVisible&&j.overflow!=="visible"){k+=parseFloat(j.borderTopWidth)||0;n+=parseFloat(j.borderLeftWidth)||0}f=j}if(f.position==="relative"||f.position==="static"){k+=o.offsetTop;n+=o.offsetLeft}if(c.offset.supportsFixedPosition&&
f.position==="fixed"){k+=Math.max(i.scrollTop,o.scrollTop);n+=Math.max(i.scrollLeft,o.scrollLeft)}return{top:k,left:n}};c.offset={initialize:function(){var a=s.body,b=s.createElement("div"),d,f,e,j=parseFloat(c.curCSS(a,"marginTop",true))||0;c.extend(b.style,{position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"});b.innerHTML="<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
a.insertBefore(b,a.firstChild);d=b.firstChild;f=d.firstChild;e=d.nextSibling.firstChild.firstChild;this.doesNotAddBorder=f.offsetTop!==5;this.doesAddBorderForTableAndCells=e.offsetTop===5;f.style.position="fixed";f.style.top="20px";this.supportsFixedPosition=f.offsetTop===20||f.offsetTop===15;f.style.position=f.style.top="";d.style.overflow="hidden";d.style.position="relative";this.subtractsBorderForOverflowNotVisible=f.offsetTop===-5;this.doesNotIncludeMarginInBodyOffset=a.offsetTop!==j;a.removeChild(b);
c.offset.initialize=c.noop},bodyOffset:function(a){var b=a.offsetTop,d=a.offsetLeft;c.offset.initialize();if(c.offset.doesNotIncludeMarginInBodyOffset){b+=parseFloat(c.curCSS(a,"marginTop",true))||0;d+=parseFloat(c.curCSS(a,"marginLeft",true))||0}return{top:b,left:d}},setOffset:function(a,b,d){if(/static/.test(c.curCSS(a,"position")))a.style.position="relative";var f=c(a),e=f.offset(),j=parseInt(c.curCSS(a,"top",true),10)||0,i=parseInt(c.curCSS(a,"left",true),10)||0;if(c.isFunction(b))b=b.call(a,
d,e);d={top:b.top-e.top+j,left:b.left-e.left+i};"using"in b?b.using.call(a,d):f.css(d)}};c.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),d=this.offset(),f=/^body|html$/i.test(b[0].nodeName)?{top:0,left:0}:b.offset();d.top-=parseFloat(c.curCSS(a,"marginTop",true))||0;d.left-=parseFloat(c.curCSS(a,"marginLeft",true))||0;f.top+=parseFloat(c.curCSS(b[0],"borderTopWidth",true))||0;f.left+=parseFloat(c.curCSS(b[0],"borderLeftWidth",true))||0;return{top:d.top-
f.top,left:d.left-f.left}},offsetParent:function(){return this.map(function(){for(var a=this.offsetParent||s.body;a&&!/^body|html$/i.test(a.nodeName)&&c.css(a,"position")==="static";)a=a.offsetParent;return a})}});c.each(["Left","Top"],function(a,b){var d="scroll"+b;c.fn[d]=function(f){var e=this[0],j;if(!e)return null;if(f!==w)return this.each(function(){if(j=wa(this))j.scrollTo(!a?f:c(j).scrollLeft(),a?f:c(j).scrollTop());else this[d]=f});else return(j=wa(e))?"pageXOffset"in j?j[a?"pageYOffset":
"pageXOffset"]:c.support.boxModel&&j.document.documentElement[d]||j.document.body[d]:e[d]}});c.each(["Height","Width"],function(a,b){var d=b.toLowerCase();c.fn["inner"+b]=function(){return this[0]?c.css(this[0],d,false,"padding"):null};c.fn["outer"+b]=function(f){return this[0]?c.css(this[0],d,false,f?"margin":"border"):null};c.fn[d]=function(f){var e=this[0];if(!e)return f==null?null:this;if(c.isFunction(f))return this.each(function(j){var i=c(this);i[d](f.call(this,j,i[d]()))});return"scrollTo"in
e&&e.document?e.document.compatMode==="CSS1Compat"&&e.document.documentElement["client"+b]||e.document.body["client"+b]:e.nodeType===9?Math.max(e.documentElement["client"+b],e.body["scroll"+b],e.documentElement["scroll"+b],e.body["offset"+b],e.documentElement["offset"+b]):f===w?c.css(e,d):this.css(d,typeof f==="string"?f:f+"px")}});A.jQuery=A.$=c})(window);
