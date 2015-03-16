// global variable to check for multiple submissions of a form
var submitInd = false;
var ddOpen = false;
// global variable for maintaining children window references
var AccesspluslinksWin = null;
var HelpLink2Win = null;
var HelpLink3Win = null;
var newWin = null;

//JSD///////////////////////////////////////////////////////////////
//JSD Function: clearNd
//JSD Descr:  Clears the dropdown layer
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE clearNd
function clearNd() {  
 if(ddOpen){
   ndOff();
   ddOpen = false;
 };
}
//JSD//ENDCODE clearNd
  
//JSD///////////////////////////////////////////////////////////////
//JSD Function: clearErrorMsg
//JSD Descr:  Clears error message onmouseout
//JSD            - Usually tied to MID messages set at the field level
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD @param msg  (Message to be displayed)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE clearErrorMsg
function clearErrorMsg() {  
  nd();
  window.status = '';
}
//JSD//ENDCODE clearErrorMsg
 
//JSD///////////////////////////////////////////////////////////////
//JSD Function: closeWin
//JSD Descr:  close video window 
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE closeWin
function closeWin() {
  if (newWin != null) {
    if (!newWin.closed) newWin.close();
  }
}
//JSD//ENDCODE closeWin
 
  
//JSD///////////////////////////////////////////////////////////////
//JSD Function: equalConfirm
//JSD Descr:  compares two values, if they are equal,
//JSD         pops a confirmation dialog box with the message provided
//JSD         and returns true or false
//JSD         If they are not equals return true
//JSD Author: Todd Hughes
//JSD Creation date: (3/2/2005 1:42:32 PM)
//JSD @return true/false
//JSD @param compVal1   (First value to compare)
//JSD        compVal2   (Second value to compare)
//JSD        msg        (message to be displayed in the dialog box)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE equalConfirm
function equalConfirm(compVal1,compVal2,msg) 
{ 
    cnfrm_flag = 0;
    if (compVal1 != compVal2){
	   cnfrm_flag = 1;
	}else{
       cnfrm_flag = confirm(msg);
	}
	if (cnfrm_flag==1){
	  return true;
	}else{
	  return false;
	}
}
//JSD//ENDCODE equalConfirm


//JSD///////////////////////////////////////////////////////////////
//JSD Function: confirmSubmit
//JSD Descr:  pops a confirmation dialog box with the message provided before submitting the form
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return true/false
//JSD @param msg        (message to be displayed in the dialog box)
//JSD        form       (form to be submitted is confirmation OKed)
//JSD        activator  (string indicating how function was initiated - must be 'onclick')
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE confirmSubmit
function confirmSubmit(msg,form,activator) 
{ 
  var vldFlag = false;
  var ans; 
  ans=window.confirm(msg); 
  //alert (ans); 
  if (ans==true){ 
    //alert('Yes'); 
	vldFlag = true;
  }else{ 
    //alert('No'); 
	vldFlag = false;
  } 
  if (vldFlag && activator=='onclick'){
    form.submit();
  } 
  return vldFlag;
}
//JSD//ENDCODE confirmSubmit


//JSD///////////////////////////////////////////////////////////////
//JSD Function: containsElement
//JSD Descr:  Determine if the element is in the array 
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return true/false 
//JSD @param arr     (array)
//JSD        ele     (element to search for)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE containsElement
function containsElement(arr, ele) {
	var found = false, index = 0;
	while(!found && index < arr.length)
      if(arr[index] == ele)
		found = true;
	  else
		index++;
	return found;
}
//JSD//ENDCODE containsElement

 
//JSD///////////////////////////////////////////////////////////////
//JSD Function: dfhinqcursor
//JSD Descr:  Set the 3270 cursor position of the field
//JSD   - used with the WEB Bridge connection from A+ to CICS
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void
//JSD @param key    (cursor position of the current field)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE dfhinqcursor
function dfhinqcursor(key) {
	document.form3270.DFH_CURSOR.value = key;
}
//JSD//ENDCODE dfhinqcursor


//JSD///////////////////////////////////////////////////////////////
//JSD Function: displayalert
//JSD Descr: Handles error message presentation
//JSD        - Either pops a message box containing the message
//JSD        - Or displays the message in the status bar
//JSD        (bases on error severity)
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD    @return void 
//JSD    @param sttus (Error Severity Ind)
//JSD    @param msg1  (Message to be displayed)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE displayalert
function displayalert(sttus,msg1) {  
	if (sttus != "" && sttus != "  " && sttus != "00")  
	  alert(msg1);   
else
	  self.status=msg1;   
}
//JSD//ENDCODE displayalert

//JSD///////////////////////////////////////////////////////////////
//JSD Function: equalConfirm
//JSD Descr:  compares two values, if they are equal,
//JSD         pops a confirmation dialog box with the message provided
//JSD         and returns true or false
//JSD         If they are not equals return true
//JSD Author: Todd Hughes
//JSD Creation date: (3/2/2005 1:42:32 PM)
//JSD @return true/false
//JSD @param compVal1   (First value to compare)
//JSD        compVal2   (Second value to compare)
//JSD        msg        (message to be displayed in the dialog box)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE equalConfirm
function equalConfirm(compVal1,compVal2,msg) 
{ 
    cnfrm_flag = 0;
    if (compVal1 != compVal2){
	   cnfrm_flag = 1;
	}else{
       cnfrm_flag = confirm(msg);
	}
	if (cnfrm_flag==1){
	  return true;
	}else{
	  return false;
	}
}
//JSD//ENDCODE evalRadio
//JSD///////////////////////////////////////////////////////////////
//JSD Function: evalRadio
//JSD Descr:  returns the value of the specified radio field
//JSD Author: Todd Hughes
//JSD Creation date: (3/2/2005 1:42:32 PM)
//JSD @return field value
//JSD @param form field   (document.inputform.RADIO_FIELD)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE evalRadio
function evalRadio(radioField) 
{ 
  for (var i=0; i<radioField.length; i++)  { 
    if (radioField[i].checked)  {
      return radioField[i].value;
    }
  } 
}
//JSD//ENDCODE evalRadio

//JSD///////////////////////////////////////////////////////////////
//JSD Function: FKeySubmit
//JSD Descr:  Submit the form based on the FKey press - 
//JSD Descr:     used in the ADIN (Web Bridge) application 
//JSD Author: Todd Hughes
//JSD Creation date: (1/21/2005 1:42:32 PM)
//JSD @return void 
//JSD @param form     (form from which function is activated)
//JSD        event    (event which triggered function - typically 'enter' [keycode 13])
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE FKeySubmit
function FKeySubmit(e) {  
	var keycode;
	if (window.event) keycode = window.event.keyCode; 
	else if (e) keycode = e.which;
	var filter = [113,114,115,116,117,118,119,120,121,122,123];
 alert("keycode2="+keycode);
	if (containsElement(filter,keycode) ){ 
	  alert("keycode2="+keycode);
	  switch (keyCode){
	    case 112: docuemnt.form3270.DFH_PF1.submit(); 
	    case 113: docuemnt.form3270.DFH_PF2.submit(); 
	    case 114: docuemnt.form3270.DFH_PF3.submit(); 
	    case 115: docuemnt.form3270.DFH_PF4.submit(); 
	    case 116: docuemnt.form3270.DFH_PF5.submit(); 
	    case 117: docuemnt.form3270.DFH_PF6.submit(); 
	    case 118: docuemnt.form3270.DFH_PF7.submit(); 
	    case 119: docuemnt.form3270.DFH_PF8.submit(); 
	    case 120: docuemnt.form3270.DFH_PF9.submit(); 
	    case 121: docuemnt.form3270.DFH_PF10.submit(); 
	    case 122: docuemnt.form3270.DFH_PF11.submit(); 
	    case 123: docuemnt.form3270.DFH_PF12.submit(); 
		}
	}
}
//JSD//ENDCODE FKeySubmit


//JSD///////////////////////////////////////////////////////////////
//JSD Function: focus1stField
//JSD Descr:  Focus on first field on the form
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD @param inputForm  (Form to search for first field)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE focus1stField
function focus1stField(inputForm) {
  var element;
  var focusSet=false;
  var strInputForm = " " + inputForm;
  var strElementType = " ";
  if (strInputForm==" null" || strInputForm==" undefined" || strInputForm==" "){ 
  for (var j = 0; j < document.forms.length; j++){
        var i = 0;
 	for (i = 0; i < document.forms[j].elements.length; i++) {
  		element = document.forms[j].elements[i];
		strElementType = " " + element.type;
  		if (strElementType == " radio" || strElementType == " checkbox" || strElementType == " text" || strElementType == " password" || strElementType == " textarea" || strElementType == " select"){
			element.focus();
    		focusSet=true;
			break;
	    }
  	}
	if (focusSet==true){
		break;
	}
   }
  }else{
  	for (i = 0; i < inputForm.elements.length; i++) {
  		element = inputForm.elements[i];
		strElementType = " " + element.type;
		if (strElementType == " radio" || strElementType == " checkbox" || strElementType == " text" || strElementType == " password" || strElementType == " textarea" || strElementType == " select"){
			element.focus();
			focusSet = true;
			break;
	    }
  	}
  }
}
//JSD//ENDCODE focus1stField





//JSD///////////////////////////////////////////////////////////////
//JSD Function: gatherFormData
//JSD Descr:  Create a 'get' query string with the data from a given form
//JSD         - used in the A+ third Party system
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return String  (query string) 
//JSD @param form     (the form to interrogate)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE gatherFormData
  function gatherFormData(form) {
  	var formData = '';
  	var element;
  	
  	// For each form element, extract the name and value
  	for (var i = 0; i < form.elements.length; i++) {
  		element = form.elements[i];
  		if (element.type == "hidden" || element.type == "text" || element.type == "password" || element.type == "textarea") formData += "'" + element.name + "', '" + escape(element.value) + "', ";
  		else if (element.type.indexOf("select") != -1) {
  			for (var j = 0; j < element.options.length; j++) {
  				if (element.options[j].selected == true) formData += "'" + element.name + "', '" + element.options[element.selectedIndex].value + "', ";
  			}
  		}
  		else if (element.type == "checkbox" && element.checked) formData += "'" + element.name + "', '" + element.value + "', ";
  		else if (element.type == "radio" && element.checked == true) formData += "'" + element.name + "', '" + element.value + "', ";
  	}
  	// Feed strings to makeSearchString() to do 'get' query string conversion
  	return (eval("makeSearchString(" + formData.substring(0, formData.length - 2) + ")"));
  }
//JSD//ENDCODE gatherFormData
 

//JSD///////////////////////////////////////////////////////////////
//JSD Function: initSubmitInd
//JSD Descr:  Set submitInd to false
//JSD   - use with submitCheck to insure single submission of form
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD//////////////////////////////////////////////////////////////
//JSD//BEGINCODE initSubmitInd
function initSubmitInd() {
    submitInd = false;
}
//JSD//ENDCODE initSubmitInd


//JSD///////////////////////////////////////////////////////////////
//JSD Function: isValidObject
//JSD Descr:  Determine if the object to be tested is a valid form object
//JSD   - used in the A+ survey system
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return true/false
//JSD @param objToTest    (Object to be tested)
//JSD        qstnType     (Type of question)
//JSD//////////////////////////////////////////////////////////////
//JSD//BEGINCODE isValidObject
function isValidObject(objToTest,qstnType) {
	if (null == objToTest) {
		return false;
	}
	if ("undefined" == typeof(objToTest) ) {
		return false;
	}
    if (qstnType == "R"){
	    validChoice = false;
		for (counter = 0; counter < objToTest.length; counter++)
		{
			if (objToTest[counter].checked)
// select: objToTest.selectedIndex or objToTest.options[counter].value
			{ validChoice = true; }
		}
		if (!validChoice){
		   return false;
		}
	}	
	return true;
}
//JSD//ENDCODE isValidObject


//JSD///////////////////////////////////////////////////////////////
//JSD Function: KeyPress
//JSD Descr:  Perform specified action upon a key press - 
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD @param what     (form field from which function is activated)
//JSD        e        (event which triggered function - typically 'enter' [keycode 13])
//JSD        max      (size of the current field)
//JSD        action   (what to do next)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE KeyPress
function KeyPress(what,e,max,action) {  
	var isNN = (navigator.appName.indexOf("Netscape")!=-1);
	var keyCode = (isNN) ? e.which : e.keyCode; 
	var filter = (isNN) ? [0,8,9] : [0,8,9,16,17,18,37,38,39,40,46];
	if (what.value.length > (max-1) && !containsElement(filter,keyCode) ){ 
//	  (isNN) ? e.which=9 : e.keyCode=9; 
  	  eval(action);   
	}
}
//JSD//ENDCODE KeyPress



//JSD///////////////////////////////////////////////////////////////
//JSD Function: loadImages
//JSD Descr:  Loads commonly used A+ images to the browser cache.
//JSD   - should increate page loading speed.
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD @param void
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE loadImages
  function loadImages(){
     var arImageSrc = new Array (
        "https://accessplus.iastate.edu/accessplus/img/head.accessplus.gif",
        "https://accessplus.iastate.edu/accessplus/img/head.about.gif",
        "https://accessplus.iastate.edu/accessplus/img/head.fade.gif",
        "https://accessplus.iastate.edu/accessplus/img/spacer.gif",
        "https://accessplus.iastate.edu/accessplus/img/head.isu.gif",
        "https://accessplus.iastate.edu/accessplus/img/head.bg.gif",
        "https://accessplus.iastate.edu/accessplus/img/tabs.bridge.none.on.gif",
        "https://accessplus.iastate.edu/accessplus/img/tabs.bridge.none.off.gif",
        "https://accessplus.iastate.edu/accessplus/img/tabs.bridge.on.edge.gif",
        "https://accessplus.iastate.edu/accessplus/img/tabs.bridge.off.edge.gif",
        "https://accessplus.iastate.edu/accessplus/img/tabs.bridge.off.on.gif",
        "https://accessplus.iastate.edu/accessplus/img/tabs.bridge.off.off.gif",
        "https://accessplus.iastate.edu/accessplus/img/tabs.bridge.on.off.gif",
        "https://accessplus.iastate.edu/accessplus/img/tabs.home.on.gif",
        "https://accessplus.iastate.edu/accessplus/img/tabs.home.off.gif",
        "https://accessplus.iastate.edu/accessplus/img/tabs.student.on.gif",
        "https://accessplus.iastate.edu/accessplus/img/tabs.student.off.gif",
        "https://accessplus.iastate.edu/accessplus/img/tabs.employee.on.gif",
        "https://accessplus.iastate.edu/accessplus/img/tabs.employee.off.gif",
        "https://accessplus.iastate.edu/accessplus/img/tabs.business.on.gif",
        "https://accessplus.iastate.edu/accessplus/img/tabs.business.off.gif",
        "https://accessplus.iastate.edu/accessplus/img/icon.email.gif",
        "https://accessplus.iastate.edu/accessplus/img/icon.print.gif",
        "https://accessplus.iastate.edu/accessplus/img/icon.help.gif",
        "https://accessplus.iastate.edu/accessplus/img/icon.maximize.gif",
        "https://accessplus.iastate.edu/accessplus/img/icon.restore.gif",
        "https://accessplus.iastate.edu/accessplus/img/menu.border.top.f90.gif",
        "https://accessplus.iastate.edu/accessplus/img/menu.border.top.063.gif",
        "https://accessplus.iastate.edu/accessplus/img/menu.border.top.c00.gif",
        "https://accessplus.iastate.edu/accessplus/img/menu.border.top.036.gif",
        "https://accessplus.iastate.edu/accessplus/img/menu.border.bottom.f90.gif",
        "https://accessplus.iastate.edu/accessplus/img/menu.border.bottom.063.gif",
        "https://accessplus.iastate.edu/accessplus/img/menu.border.bottom.c00.gif",
        "https://accessplus.iastate.edu/accessplus/img/menu.border.bottom.036.gif",
        "https://accessplus.iastate.edu/accessplus/img/menu.arrow.fc3.gif",
        "https://accessplus.iastate.edu/accessplus/img/menu.arrow.396.gif",
        "https://accessplus.iastate.edu/accessplus/img/menu.arrow.f66.gif",
        "https://accessplus.iastate.edu/accessplus/img/menu.arrow.69c.gif",
        "https://accessplus.iastate.edu/accessplus/img/head.accessplus.gif"
    )
    var arImageList = new Array ();
    for (counter in arImageSrc) {
        arImageList[counter] = new Image();
        arImageList[counter].src = arImageSrc[counter];
    }
  }
//JSD//ENDCODE loadImages
  
  
//JSD///////////////////////////////////////////////////////////////
//JSD Function: makeSearchString
//JSD Descr:  Convert a list of strings into a 'get' query string
//JSD         - used in the A+ third Party system
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return String  (query field) 
//JSD @param void
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE makeSearchString
  function makeSearchString() {
  	var args = makeSearchString.arguments;
  	var searchString = "?";
  	var pair;
  	for (var i = 0; i < args.length; i++) {
  		pair = escape(args[i++]) + "=";
  		pair += escape(args[i]);
  		searchString += pair + "&";
  	}
  	return searchString.substring(0, searchString.length - 1);
  }
//JSD//ENDCODE makeSearchString

//JSD///////////////////////////////////////////////////////////////
//JSD Function: ndOff
//JSD Descr:  Turns off the layer containing the dynamic dropdown 
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD @param void
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE ndOff
function ndOff(){
  nd();
  nd();
  window.top.ddOpen=false;
  ddOpen=false;
}
//JSD//ENDCODE ndOff

//JSD///////////////////////////////////////////////////////////////
//JSD Function: nextField
//JSD Descr:  Focus on the next field when the current field is full 
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD @param what     (form field from which function is activated)
//JSD        e        (event which triggered function)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE nextField
function nextField(what,e) {  
    if (what.value.length <= (what.size-1) ){
	}else{ 
	var isNN = (navigator.appName.indexOf("Netscape")!=-1);
	var keyCode = (isNN) ? e.which : e.keyCode; 
	var filter = (isNN) ? [0,8,9] : [0,8,9,16,17,18,37,38,39,40,46];
	 if (what.value.length > (what.size-1) && !containsElement(filter,keyCode) ){ 
	  for (var i = 0; i < what.form.elements.length; i++) {
  		element = what.form.elements[i];
		strElementName = " " + element.name;
		compareName = " " + what.name;
 		if (strElementName == compareName){
		  if ((i+1)<what.form.elements.length){
				what.form.elements[i+1].focus();
				what.form.elements[i+1].select();
			}
			break;
	      }
	    }
	 }
	} // end else
}
//JSD//ENDCODE nextField
 
//JSD///////////////////////////////////////////////////////////////
//JSD Function: openCalendar
//JSD Descr:  Open the layer containing the dynamic dropdown 
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD @param form      (form that contains the field)
//JSD        theObj    (form element)
//JSD        strtObj   (form element)
//JSD        page      (the page that should be run to generate the
//JSD                   data on the dropdown)
//JSD        tall      (the pixel height of the dropdown def=cell height * 22)
//JSD        wide      (the pixel width of the dropdown  def=cell width + 22)
//JSD        selScript (javascript to run when date is selected)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE openCalendar
function openCalendar(form,theObj,strtObj,page,tall,wide,selScript){
  var hout = 0;
  var wout = 0;
  var rowsout = 0;
  if (ddOpen){
	ndOff();
    ddOpen = false;
	strtObj.value = theObj.value;
  }else{
    ddOpen = true;
    val = theObj.value;
	strtVal = strtObj.value;
    fieldName = theObj.name;
    x = y = 0;
    h = theObj.offsetHeight;
    w = theObj.offsetWidth;
    while(theObj){
      x += theObj.offsetLeft;
      y += theObj.offsetTop;
      theObj = theObj.offsetParent;
    }
	hout = 150;
    wout = 210;
	rowsout = 6;
	var iframeText = '<iframe name="'+fieldName+'_DropDown" id="'+fieldName+'_DropDown" border="0" scrolling="auto" src="'+page+'?DD_STRT_VAL='+strtVal+'&DD_FIELD_NAME='+fieldName+'&DD_FORM='+form.name+'&DD_SEL_SCRIPT='+selScript+'" onMouseWheel="return(false)" onMouseScroll="return(false)" style="margin:0;padding:0;width:100%;height:100%;" scrolling="no" frameborder="0" marginwidth="0" marginheight="0">Your browser does not support inline frames or is currently configured not to display inline frames.</iframe>';
	if (navigator.platform.toLowerCase().indexOf('mac')>-1){
	  for(i=0;i<rowsout;i++){
	    iframeText += '<br>';
	  }
	}else{
	  for(i=0;i<rowsout;i=i+3){
	    iframeText += '<br>';
	  }
	}
	overlib(iframeText,DELAY,0,STICKY,0,BORDER,0,WIDTH,wout,HEIGHT,hout,FGCOLOR,"#ffffff");
  }
} 
//JSD//ENDCODE openCalendar
 


//JSD///////////////////////////////////////////////////////////////
//JSD Function: openHelpWindow
//JSD Descr:  Opens a new browser window for help with the URL,height and width specified
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void
//JSD @param URL       (URL of the help page)
//JSD        Height    (Height for the new window)
//JSD        Width     (Width for the new window)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE openHelpWindow
  function openHelpWindow(URL,Height,Width) {
//    if (AccesspluslinksWin!=null && AccesspluslinksWin!="undefined" && !AccesspluslinksWin.closed){
	  try{
	    AccesspluslinksWin.close();
	  }catch(err){}
	  try{
		AccesspluslinksWin=null;
	  }catch(err){}
	
//	}
   	AccesspluslinksWin=window.open(URL,"Accesspluslinks","alwaysRaised=yes,hotkeys=yes,scrollbars=yes,toolbar=no,directories=no,menubar=no,resizable=yes,status=no,width="+Width+",height="+Height+",left=100,top=100,screenX=100,screenY=100");
	AccesspluslinksWin.focus();
  }
//JSD//ENDCODE openHelpWindow
  
//JSD///////////////////////////////////////////////////////////////
//JSD Function: openWindowX
//JSD Descr:  Opens a new browser window for help with the URL,height and width specified
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void
//JSD @param winNum    (Unique window number)
//JSD        URL       (URL of the help page)
//JSD        Height    (Height for the new window)
//JSD        Width     (Width for the new window)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE openHelpWindow
  function openWindowX(winNum,URL,Height,Width) {
	thisWin=null;
	var hpos = 100 + (winNum * 10);
	var vpos = 100 + (winNum * 5);
   	thisWin=window.open(URL,"APluslink"+winNum,"alwaysRaised=yes,hotkeys=yes,scrollbars=yes,toolbar=no,directories=no,menubar=no,resizable=yes,status=no,width="+Width+",height="+Height+",left="+hpos+",top="+vpos+",screenX="+hpos+",screenY="+vpos);
	thisWin.focus();
  }
//JSD//ENDCODE openHelpWindow
  
  
//JSD///////////////////////////////////////////////////////////////
//JSD Function: openPrintWindow
//JSD Descr:  Opens a new browser window for printing with the URL
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void
//JSD @param URL       (URL of the print page)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE openPrintWindow
  function openPrintWindow(URL) {
    if (AccesspluslinksWin!=null && AccesspluslinksWin!="undefined" && !AccesspluslinksWin.closed){
	    AccesspluslinksWin.close();
		AccesspluslinksWin=null;
	}
   	AccesspluslinksWin=window.open(URL + "?APLS_PrintAll=Y","Accesspluslinks","alwaysRaised=yes,scrollbars=no,toolbar=no,directories=no,menubar=no,resizable=no,status=no,width=1,height=1,titlebar=no");
	AccesspluslinksWin.focus();
  }
//JSD//ENDCODE openPrintWindow

  
//JSD///////////////////////////////////////////////////////////////
//JSD Function: openPrintPane
//JSD Descr:  Opens a new browser window for printing 
//JSD         Usually invoked for printing data with the download mechanism 
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void
//JSD @param Height        
//JSD @param Width         
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE openPrintPane
  function openPrintPane(Height,Width) {
    if (AccesspluslinksWin!=null && AccesspluslinksWin!="undefined" && !AccesspluslinksWin.closed){
	    AccesspluslinksWin.close();
		AccesspluslinksWin=null;
	}
   	AccesspluslinksWin=window.open("","AccessPlusPrintWindow","alwaysLowered=yes,dependent=yes,hotkeys=yes,scrollbars=no,z-lock=yes,toolbar=no,directories=no,menubar=no,resizable=no,status=no,width="+Width+",height="+Height+",left=100,top=100,screenX=100,screenY=100");
  }
//JSD//ENDCODE openPrintPane
  
//JSD///////////////////////////////////////////////////////////////
//JSD Function: printAndClosePrintWindow
//JSD Descr:  confirms printing, prints report and closes window 
//JSD         Usually invoked for printing data with the download mechanism 
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE printAndClosePrintWindow
  function printAndClosePrintWindow() {
    AccesspluslinksWin.opener.focus();
	if (confirm("Print report?")){
        pause(3000);
	    AccesspluslinksWin.print();
	}
    if (navigator.userAgent.toLowerCase().indexOf("netscape/8")>-1
	  || navigator.userAgent.toLowerCase().indexOf("opera")>-1){
        alert("Printing complete");
    }
	AccesspluslinksWin.close();
  }
//JSD//ENDCODE printAndClosePrintWindow
  
//JSD///////////////////////////////////////////////////////////////
//JSD Function: pause
//JSD Descr:  causes javascript processing to wait  
//JSD         Usually invoked for printing data with the download mechanism 
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void
//JSD @param millis    (number of milliseconds to wait)        
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE pause
  function pause(millis) 
  {
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); } 
      while(curDate-date < millis);
  } 
//JSD//ENDCODE pause


//JSD///////////////////////////////////////////////////////////////
//JSD Function: popUp
//JSD Descr:  open video window 
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE popUp
function popUp(strURL,strType,strWidth,strHeight) {
  closeWin();
  var strOptions="";
  if (strType=="console") strOptions="resizable,width="+strWidth+",height="+strHeight;
  if (strType=="fixed") strOptions="status,width="+strWidth+",height="+strHeight;
  if (strType=="elastic") strOptions="toolbar,menubar,scrollbars,resizable,location,width="+strWidth+",height="+strHeight;
  newWin = window.open(strURL, 'newWin', strOptions);
  newWin.focus();
}
//JSD//ENDCODE popUp




//JSD///////////////////////////////////////////////////////////////
//JSD Function: printDnld
//JSD Descr:  opens print pane, prints data and closes pane 
//JSD         Usually invoked for printing data with the download mechanism 
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void
//JSD @param form    (form from which the download is initiated)        
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE printDnld
  function printDnld(form){
    var supportedBrowser = true;
    if ((navigator.userAgent.toLowerCase().indexOf("safari")>-1
	   && parseInt(navigator.appVersion)<=5)
      || (navigator.userAgent.toLowerCase().indexOf("msie")>-1
	   && parseInt(navigator.appVersion)<=4
	   && navigator.userAgent.toLowerCase().indexOf("mac")>-1)  ){
	    supportedBrowser = false;
	}
	if (!supportedBrowser){
	    alert("Your browser does not support this function.\nPlease use an approved browser.");
		return false;
	}
    openPrintPane(10,10);
    form.target='AccessPlusPrintWindow';
    form.submit();
    printAndClosePrintWindow();
  }
//JSD//ENDCODE printDnld
  

//JSD///////////////////////////////////////////////////////////////
//JSD Function: openPrinterFriendly
//JSD Descr:  Opens a new browser window for printing with the URL
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void
//JSD @param URL       (URL of the print page)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE openPrinterFriendly
  function openPrinterFriendly(URL) {
    if (AccesspluslinksWin!=null && AccesspluslinksWin!="undefined" && !AccesspluslinksWin.closed){
	    AccesspluslinksWin.close();
		AccesspluslinksWin=null;
	}
   	AccesspluslinksWin=window.open(URL + "?APLS_PrinterFriendly=Y","Accesspluslinks","alwaysRaised=yes,scrollbars=no,toolbar=no,directories=no,menubar=yes,resizable=yes,status=no,titlebar=no");
	AccesspluslinksWin.focus();
  }
//JSD//ENDCODE openPrinterFriendly
  
  
//JSD///////////////////////////////////////////////////////////////
//JSD Function: openSecondHelpWindow
//JSD Descr:  Opens a second new browser window for help with the URL,height and width specified
//JSD         -Should only be used if you need to have a second help window open at the same time as the first
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void
//JSD @param URL       (URL of the help page)
//JSD        Height    (Height for the new window)
//JSD        Width     (Width for the new window)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE openSecondHelpWindow
  function openSecondHelpWindow(URL,Height,Width) {
    if (HelpLink2Win!=null && HelpLink2Win!="undefined" && !HelpLink2Win.closed){
	    HelpLink2Win.close();
		HelpLink2Win=null;
	}
  	HelpLink2Win=window.open(URL,"HelpLink2","alwaysRaised=yes,hotkeys=yes,scrollbars=yes,toolbar=no,directories=no,menubar=no,resizable=yes,status=no,width="+Width+",height="+Height+",left=200,top=200,screenX=200,screenY=200");
	HelpLink2Win.focus();
  }
//JSD//ENDCODE openSecondHelpWindow


//JSD///////////////////////////////////////////////////////////////
//JSD Function: openThirdHelpWindow
//JSD Descr:  Opens a second new browser window for help with the URL,height and width specified
//JSD         -Should only be used if you need to have a second help window open at the same time as the first
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void
//JSD @param URL       (URL of the help page)
//JSD        Height    (Height for the new window)
//JSD        Width     (Width for the new window)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE openThirdHelpWindow
  function openThirdHelpWindow(URL,Height,Width) {
    if (HelpLink3Win!=null && HelpLink3Win!="undefined" && !HelpLink3Win.closed){
	    HelpLink3Win.close();
		HelpLink3Win=null;
	}
   	HelpLink3Win=window.open(URL,"HelpLink3","alwaysRaised=yes,hotkeys=yes,scrollbars=yes,toolbar=no,directories=no,menubar=no,resizable=yes,status=no,width="+Width+",height="+Height+",left=300,top=300,screenX=300,screenY=300");
	HelpLink3Win.focus();
  }
//JSD//ENDCODE openThirdHelpWindow


//JSD///////////////////////////////////////////////////////////////
//JSD Function:setSelect
//JSD Descr: sets the value in a select box
//JSD Author: Dan Black
//JSD Creation date: (3/14/2005 1:56:32 PM)
//JSD @return void 
//JSD @param SelectBoxObject  (the actual select box object)
//JSD        NewValue         (value of the option to change to)
//JSD        TextOrValue      (whether NewValue is the option value ("v")
//JSD                          or the displayed text ("t")
//JSD                          / defaults to value ("v"))
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE setSelect
function setSelect(SelectBoxObject, NewValue, TextOrValue)
{
  if(TextOrValue==undefined)
  { TextOrValue = "v"; }

  for(var setSelect_ctr = 0; setSelect_ctr < SelectBoxObject.length; setSelect_ctr++)
  {
    if((TextOrValue=="v" && SelectBoxObject[setSelect_ctr].value == NewValue)
       || (TextOrValue=="t" && SelectBoxObject[setSelect_ctr].text == NewValue))
    {
      SelectBoxObject.selectedIndex = setSelect_ctr;
    }
  }
}
//JSD//ENDCODE setSelect


//JSD///////////////////////////////////////////////////////////////
//JSD Function:showErrorMsg
//JSD Descr: Displays error message onmouseover
//JSD        - Usually tied to MID messages set at the field level
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD    @return void 
//JSD    @param msg  (Message to be displayed)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE showErrorMsg
function showErrorMsg(msg) {  
	if (msg != ""){  
	  overlib(msg);
	  window.status = msg;
	}   
}
//JSD//ENDCODE showErrorMsg


//JSD///////////////////////////////////////////////////////////////
//JSD Function: sleep
//JSD Descr:  Causes logic to wait for milliseconds input
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE sleep
function sleep(millis)
{
d = new Date() //today's date
while (1)
{
mill=new Date() // Date Now
diff = mill - d //difference in milliseconds
if( diff > millis ) {break;}
}
}
//JSD//ENDCODE sleep

//JSD///////////////////////////////////////////////////////////////
//JSD Function: submitCheck
//JSD Descr:   -submitCheckOnce should be used onSubmit for forms that require single submission
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE submitCheck
  function submitCheck()
  {
	 submitInd = true;
     return true;
  }
//JSD//ENDCODE submitCheck

//JSD///////////////////////////////////////////////////////////////
//JSD Function: submitCheckOnce
//JSD Descr:  Checks to make sure form has not been submitted already
//JSD Descr:   -Should be used onSubmit for forms that require single submission
//JSD Descr:   **Note this make act strangely after the browsers 'back' button
//JSD Descr:     has been used, unless no-caching is enabled on the page.
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE submitCheckOnce
  function submitCheckOnce()
  {
     if (submitInd){
        return false;
     }else{
	    submitInd = true;
        return true;
	 }
  }
//JSD//ENDCODE submitCheckOnce

//JSD///////////////////////////////////////////////////////////////
//JSD Function: submitForm
//JSD Descr:  Submit the form
//JSD Descr:   -submitFormOnce Should be used for forms that require single submission
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE submitForm
  function submitForm(currentForm)
  {
	 submitInd = true;
	 currentForm.submit();
  }
//JSD//ENDCODE submitForm


//JSD///////////////////////////////////////////////////////////////
//JSD Function: submitFormOnce
//JSD Descr:  Submit the form once
//JSD Descr:   -Should be used for forms that require single submission
//JSD Descr:   **Note this make act strangely after the browsers 'back' button
//JSD Descr:     has been used, unless no-caching is enabled on the page.
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE submitFormOnce
  function submitFormOnce(currentForm)
  {
     if (!submitInd){
	    submitInd = true;
	    currentForm.submit();
	 }
  }
//JSD//ENDCODE submitFormOnce

//JSD///////////////////////////////////////////////////////////////
//JSD Function: submitKeys
//JSD Descr:  Submit changes to the key fields by pressing enter
//JSD         while the cursor is in the key form
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD @param myfield (form field from which function is activated)
//JSD        event   (event which triggered function - typically 'enter' [keycode 13])
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE submitKeys
  function submitKeys(myfield,e)
  {
  var keycode;
  if (window.event) keycode = window.event.keyCode;
  else if (e) keycode = e.which;
  else return true;

  if (keycode == 13)
     {
     if (!submitInd){
	    submitInd = true;
        myfield.form.submit();
	 }
     return false;
     }
  else
     return true;
  }
//JSD//ENDCODE submitKeys

//JSD///////////////////////////////////////////////////////////////
//JSD Function: taLimitSize
//JSD Descr:  Limits the number of characters that can be placed in a textarea
//JSD Author: Todd Hughes
//JSD Creation date: (3/2/2005 1:42:32 PM)
//JSD @param maxsize
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE taLimitSize
function taLimitSize(maxsize) {
    var taObj=event.srcElement;
    if (taObj.value.length>maxsize){
	   taObj.value = taObj.value.substring(0,maxsize);
	}
}
//JSD//ENDCODE taLimitSize

//JSD///////////////////////////////////////////////////////////////
//JSD Function: taLimit
//JSD Descr:  Returns false when textarea has reached it max
//JSD         character count
//JSD Author: Todd Hughes
//JSD Creation date: (3/2/2005 1:42:32 PM)
//JSD @return boolean 
//JSD @param void
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE taLimit
function taLimit() {
    var taObj=event.srcElement;
    if (taObj.value.length==taObj.maxLength*1) return false;
}
//JSD//ENDCODE taLimit

//JSD///////////////////////////////////////////////////////////////
//JSD Function: taCount
//JSD Descr:  Returns number of characters left before textarea is
//JSD         full
//JSD Author: Todd Hughes
//JSD Creation date: (3/2/2005 1:42:32 PM)
//JSD @return count
//JSD @param visCnt (form field to return count to)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE taCount
function taCount(visCnt) { 
    var taObj=event.srcElement;
    if (taObj.value.length>taObj.maxLength*1) taObj.value=taObj.value.substring(0,taObj.maxLength*1);
    if (visCnt) visCnt.innerText=taObj.maxLength-taObj.value.length;
}
//JSD//ENDCODE taCount


//JSD///////////////////////////////////////////////////////////////
//JSD Function: trim
//JSD Descr:  Removes leading and trailing spaces from the passed string. Also removes
//JSD consecutive spaces and replaces it with one space. If something besides
//JSD a string is passed in (null, custom object, etc.) then return the input.
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return String
//JSD @param inputString    (String to be trimmed)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE trim
function trim(inputString) {
   if (typeof inputString != "string") { return inputString; }
   var retValue = inputString;
   var ch = retValue.substring(0, 1);
   while (ch == " " || ch == "\n" || ch == "\r") { // Check for spaces at the beginning of the string
      retValue = retValue.substring(1, retValue.length);
      ch = retValue.substring(0, 1);
   }
   ch = retValue.substring(retValue.length-1, retValue.length);
   while (ch == " " || ch == "\n" || ch == "\r") { // Check for spaces at the end of the string
      retValue = retValue.substring(0, retValue.length-1);
      ch = retValue.substring(retValue.length-1, retValue.length);
   }
   while (retValue.indexOf("  ") != -1) { // Note that there are two spaces in the string - look for multiple spaces within the string
      retValue = retValue.substring(0, retValue.indexOf("  ")) + retValue.substring(retValue.indexOf("  ")+1, retValue.length); // Again, there are two spaces in each of the strings
   }
   return retValue; // Return the trimmed string back to the user
} // Ends the "trim" function
//JSD//ENDCODE trim

	
//JSD///////////////////////////////////////////////////////////////
//JSD Function: unequalConfirm
//JSD Descr:  compares two values, if they are not equal,
//JSD         pops a confirmation dialog box with the message provided
//JSD         and returns true or false
//JSD         If they are equal, returns true
//JSD Author: Todd Hughes
//JSD Creation date: (3/2/2005 1:42:32 PM)
//JSD @return true/false
//JSD @param compVal1   (First value to compare)
//JSD        compVal2   (Second value to compare)
//JSD        msg        (message to be displayed in the dialog box)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE unequalConfirm
function unequalConfirm(compVal1,compVal2,msg) 
{ 
    cnfrm_flag = 0;
    if (compVal1 == compVal2){
	   cnfrm_flag = 1;
	}else{
       cnfrm_flag = confirm(msg);
	}
	if (cnfrm_flag==1){
	  return true;
	}else{
	  return false;
	}
}
//JSD//ENDCODE unequalConfirm


//JSD///////////////////////////////////////////////////////////////
//JSD Function: validateEmail
//JSD Descr:  Simple email validation script
//JSD Author: Dan Black
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return true/false
//JSD @param emailStr  (email address to be validated)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE validateEmail
//////////////////////////////////////////////////////////////////////	
// original script from http://javascript.internet.com/forms/check-email.html
// modified, DSB, 2004-07-29, to not limit last piece of domain name to
//   two or three characters, which would incorrectly disallow .info, .store,
//   and other possible future additions
/* Changes:  Sandeep V. Tamhankar (stamhankar@hotmail.com) */
/* 1.1.2: Fixed a bug where trailing . in e-mail address was passing
            (the bug is actually in the weak regexp engine of the browser; I
            simplified the regexps to make it work).
   1.1.1: Removed restriction that countries must be preceded by a domain,
            so abc@host.uk is now legal.  However, there's still the 
            restriction that an address must end in a two or three letter
            word.
     1.1: Rewrote most of the function to conform more closely to RFC 822.
     1.0: Original  */
/* This script and many more are available free online at */
/* The JavaScript Source!! http://javascript.internet.com */
function validateEmail(emailStr) {
/* The following pattern is used to check if the entered e-mail address
   fits the user@domain format.  It also is used to separate the username
   from the domain. */
var emailPat=/^(.+)@(.+)$/
/* The following string represents the pattern for matching all special
   characters.  We don't want to allow special characters in the address. 
   These characters include ( ) < > @ , ; : \ " . [ ]    */
var specialChars="\\(\\)<>@,;:\\\\\\\"\\.\\[\\]"
/* The following string represents the range of characters allowed in a 
   username or domainname.  It really states which chars aren't allowed. */
var validChars="\[^\\s" + specialChars + "\]"
/* The following pattern applies if the "user" is a quoted string (in
   which case, there are no rules about which characters are allowed
   and which aren't; anything goes).  E.g. "jiminy cricket"@disney.com
   is a legal e-mail address. */
var quotedUser="(\"[^\"]*\")"
/* The following pattern applies for domains that are IP addresses,
   rather than symbolic names.  E.g. joe@[123.124.233.4] is a legal
   e-mail address. NOTE: The square brackets are required. */
var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/
/* The following string represents an atom (basically a series of
   non-special characters.) */
var atom=validChars + '+'
/* The following string represents one word in the typical username.
   For example, in john.doe@somewhere.com, john and doe are words.
   Basically, a word is either an atom or quoted string. */
var word="(" + atom + "|" + quotedUser + ")"
// The following pattern describes the structure of the user
var userPat=new RegExp("^" + word + "(\\." + word + ")*$")
/* The following pattern describes the structure of a normal symbolic
   domain, as opposed to ipDomainPat, shown above. */
var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$")
/* Finally, let's start trying to figure out if the supplied address is
   valid. */
/* Begin with the coarse pattern to simply break up user@domain into
   different pieces that are easy to analyze. */
var matchArray=emailStr.match(emailPat)
if (matchArray==null) {
  /* Too many/few @'s or something; basically, this address doesn't
     even fit the general mould of a valid e-mail address. */
	alert("Email address seems incorrect (check @ and .'s)")
	return false
}
var user=matchArray[1]
var domain=matchArray[2]
// See if "user" is valid 
if (user.match(userPat)==null) {
    // user is not valid
    alert("The username doesn't seem to be valid.")
    return false
}
/* if the e-mail address is at an IP address (as opposed to a symbolic
   host name) make sure the IP address is valid. */
var IPArray=domain.match(ipDomainPat)
if (IPArray!=null) {
    // this is an IP address
	  for (var i=1;i<=4;i++) {
	    if (IPArray[i]>255) {
	        alert("Destination IP address is invalid!")
		return false
	    }
    }
    return true
}
// Domain is symbolic name
var domainArray=domain.match(domainPat)
if (domainArray==null) {
	alert("The domain name doesn't seem to be valid.")
    return false
}
/* domain name seems valid, but now make sure that it ends in a
   three-letter word (like com, edu, gov) or a two-letter word,
   representing country (uk, nl), and that there's a hostname preceding 
   the domain or country. */
/* -- MODIFIED, DSB, 2004-07-29, to allow .info and other longer endings */
/* Now we need to break up the domain to get a count of how many atoms
   it consists of. */
var atomPat=new RegExp(atom,"g")
var domArr=domain.match(atomPat)
var len=domArr.length
//DSB//   if (domArr[domArr.length-1].length<2 || 
//DSB//       domArr[domArr.length-1].length>3) {
if (domArr[domArr.length-1].length<2) {
   // the address must end in a two letter or three letter word.
//DSB//     alert("The address must end in a three-letter domain, or two letter country.")
   alert("The address must end in a valid top-level domain "
        +"(.edu, .com, .org, .net, .gov, .info, etc.) or two-letter country.")
   return false
}
// Make sure there's a host name preceding the domain.
if (len<2) {
   var errStr="This address is missing a hostname!"
   alert(errStr)
   return false
}
// If we've gotten this far, everything's valid!
return true;
}
//JSD//ENDCODE validateEmail

//JSD///////////////////////////////////////////////////////////////
//JSD Function: validateEmailOverRideMsg
//JSD Descr:  Simple email validation script
//JSD Author: Dan Black
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return true/false
//JSD @param emailStr  (email address to be validated)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE validateEmail
//////////////////////////////////////////////////////////////////////	
// original script from http://javascript.internet.com/forms/check-email.html
// modified, DSB, 2004-07-29, to not limit last piece of domain name to
//   two or three characters, which would incorrectly disallow .info, .store,
//   and other possible future additions
/* Changes:  Sandeep V. Tamhankar (stamhankar@hotmail.com) */
/* 1.1.2: Fixed a bug where trailing . in e-mail address was passing
            (the bug is actually in the weak regexp engine of the browser; I
            simplified the regexps to make it work).
   1.1.1: Removed restriction that countries must be preceded by a domain,
            so abc@host.uk is now legal.  However, there's still the 
            restriction that an address must end in a two or three letter
            word.
     1.1: Rewrote most of the function to conform more closely to RFC 822.
     1.0: Original  */
/* This script and many more are available free online at */
/* The JavaScript Source!! http://javascript.internet.com */
function validateEmailOverRideMsg(emailStr,rtrnMsg) {
/* The following pattern is used to check if the entered e-mail address
   fits the user@domain format.  It also is used to separate the username
   from the domain. */
var emailPat=/^(.+)@(.+)$/
/* The following string represents the pattern for matching all special
   characters.  We don't want to allow special characters in the address. 
   These characters include ( ) < > @ , ; : \ " . [ ]    */
var specialChars="\\(\\)<>@,;:\\\\\\\"\\.\\[\\]"
/* The following string represents the range of characters allowed in a 
   username or domainname.  It really states which chars aren't allowed. */
var validChars="\[^\\s" + specialChars + "\]"
/* The following pattern applies if the "user" is a quoted string (in
   which case, there are no rules about which characters are allowed
   and which aren't; anything goes).  E.g. "jiminy cricket"@disney.com
   is a legal e-mail address. */
var quotedUser="(\"[^\"]*\")"
/* The following pattern applies for domains that are IP addresses,
   rather than symbolic names.  E.g. joe@[123.124.233.4] is a legal
   e-mail address. NOTE: The square brackets are required. */
var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/
/* The following string represents an atom (basically a series of
   non-special characters.) */
var atom=validChars + '+'
/* The following string represents one word in the typical username.
   For example, in john.doe@somewhere.com, john and doe are words.
   Basically, a word is either an atom or quoted string. */
var word="(" + atom + "|" + quotedUser + ")"
// The following pattern describes the structure of the user
var userPat=new RegExp("^" + word + "(\\." + word + ")*$")
/* The following pattern describes the structure of a normal symbolic
   domain, as opposed to ipDomainPat, shown above. */
var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$")
/* Finally, let's start trying to figure out if the supplied address is
   valid. */
/* Begin with the coarse pattern to simply break up user@domain into
   different pieces that are easy to analyze. */
var matchArray=emailStr.match(emailPat)
if (matchArray==null) {
  /* Too many/few @'s or something; basically, this address doesn't
     even fit the general mould of a valid e-mail address. */
	//alert("Email address seems incorrect (check @ and .'s)")
	alert(rtrnMsg)
	return false
}
var user=matchArray[1]
var domain=matchArray[2]
// See if "user" is valid 
if (user.match(userPat)==null) {
    // user is not valid
    //alert("The username doesn't seem to be valid.")
	alert(rtrnMsg)
    return false
}
/* if the e-mail address is at an IP address (as opposed to a symbolic
   host name) make sure the IP address is valid. */
var IPArray=domain.match(ipDomainPat)
if (IPArray!=null) {
    // this is an IP address
	  for (var i=1;i<=4;i++) {
	    if (IPArray[i]>255) {
//	        alert("Destination IP address is invalid!")
			alert(rtrnMsg)
		return false
	    }
    }
    return true
}
// Domain is symbolic name
var domainArray=domain.match(domainPat)
if (domainArray==null) {
	//alert("The domain name doesn't seem to be valid.")
	alert(rtrnMsg)
    return false
}
/* domain name seems valid, but now make sure that it ends in a
   three-letter word (like com, edu, gov) or a two-letter word,
   representing country (uk, nl), and that there's a hostname preceding 
   the domain or country. */
/* -- MODIFIED, DSB, 2004-07-29, to allow .info and other longer endings */
/* Now we need to break up the domain to get a count of how many atoms
   it consists of. */
var atomPat=new RegExp(atom,"g")
var domArr=domain.match(atomPat)
var len=domArr.length
//DSB//   if (domArr[domArr.length-1].length<2 || 
//DSB//       domArr[domArr.length-1].length>3) {
if (domArr[domArr.length-1].length<2) {
   // the address must end in a two letter or three letter word.
//DSB//     alert("The address must end in a three-letter domain, or two letter country.")
//   alert("The address must end in a valid top-level domain "
//        +"(.edu, .com, .org, .net, .gov, .info, etc.) or two-letter country.")
	alert(rtrnMsg)
   return false
}
// Make sure there's a host name preceding the domain.
if (len<2) {
   var errStr="This address is missing a hostname!"
//   alert(errStr)
	alert(rtrnMsg)
   return false
}
// If we've gotten this far, everything's valid!
return true;
}
//JSD//ENDCODE validateEmailOverRideMsg

///////////////////////////////////////////////////////////////////////
// Helper functions used by this library - simple email validation
//////////////////////////////////////////////////////////////////////	
// NOTE: old version, replaced by new script above, DSB, 2004-07-29
// function validateEmail(addr) {
//     if(-1 == addr.indexOf("@")) { 
//        alert("Email address requires a @."); 
//        return false; 
//        }
//     if(-1 != addr.indexOf(",")) { 
//        alert("Email address must not have a comma in it"); 
//        return false; 
//        }
//     if(-1 != addr.indexOf("#")) { 
//        alert("Email address must not have an # in it." ); 
//        return false; 
//        }
//     if(-1 != addr.indexOf("!")) { 
//        alert("Email address must not have an exclamation point in it." ); 
//        return false; 
//        }
//     if(-1 != addr.indexOf(" ")) { 
//        alert("Email address must not have a space in it." ); 
//        return false; 
//        }
//     if(addr.length == (addr.indexOf("@")+1) ) {
//        alert("Email address must have a domain name after the @.");
//        return false;
//        }
//     if(addr.length == 0) { 
//       alert("Please enter your email."); 
//       return false; 
//       }
//     if(addr.length < 5) { 
//       alert("Invalid email address."); 
//       return false; 
//       }
//     return true;
//   }
  
  
  
  
  
  
  
  
  
  
  
//NO LONGER USED
/*  
/////////////////////////////////////////////////////////////////
// Function: openPrintWindow
// Descr:  Opens a new browser window for printible info with the URL,height and width specified
// Author: Todd Hughes
// Creation date: (6/15/2000 1:42:32 PM)
// @return void
// @param URL       (URL of the print page)
//        Height    (Height for the new window)
//        Width     (Width for the new window)
/////////////////////////////////////////////////////////////////
  function openPrintWindow(URL,Height,Width) {
   	testWin=window.open(URL,"Accesspluslinks","alwaysRaised=yes,hotkeys=yes,scrollbars=yes,toolbar=no,directories=no,menubar=no,resizable=yes,status=no,width="+Width+",height="+Height+",left=100,top=100,screenX=100,screenY=100");
	testWin.focus();
  }

/////////////////////////////////////////////////////////////////
// Function: openDeptWindow
// Descr:  Opens a new browser window for linking to a departmental server
// Author: Todd Hughes
// Creation date: (6/15/2000 1:42:32 PM)
// @return void
// @param dept      (department code)
//        URL       (URL of the department page)
/////////////////////////////////////////////////////////////////
  function openDeptWindow(dept,URL) {
//	deptWin=window.open("/servlet/adp.DeptLink?LinkTo="+dept+"&DeptURL="+URL,"Dept"+dept+"Link");
	deptWin=window.open("/servlet/adp.DeptLink?LinkTo="+dept,"Dept"+dept+"Link");
	deptWin.focus();
  }


  
/////////////////////////////////////////////////////////////////
// Function: closeLinkHelp
// Descr:  Clear message in status bar
// Author: Todd Hughes
// Creation date: (6/15/2000 1:42:32 PM)
// @return void 
// @param void
/////////////////////////////////////////////////////////////////
function closeLinkHelp()
{
window.status='';
}
 
 
/////////////////////////////////////////////////////////////////
// Function: displayLinkHelp
// Descr:  Display help message in status bar
// Author: Todd Hughes
// Creation date: (6/15/2000 1:42:32 PM)
// @return void 
// @param output  (message to be displayed)
/////////////////////////////////////////////////////////////////
function displayLinkHelp(output)
{
window.status=output;
}
 
 
 
///////////////////////////////////////////////////////////////////////
// Helper functions used by this library
  function unloadPopUp() {
    if (document.images){
	  opener.testWin = null;
	}
  }

 
 
 
  
///////////////////////////////////////////////////////////////////////
// Helper functions used by this library
  function openPINChallenge(sessionID,NextPage,QueryString,HTMLMsg,Height,Width,Timeout) {
   var pagein = "";
   var queryin = "";
   var ua = window.navigator.userAgent;
   var msie = ua.indexOf ( "MSIE " );
   var mac = ua.indexOf ( "Mac" );
   var queryinArray = new Array();
   var queryArray = new Array();
  	var qinstring = "";
  	var qstring = "";

  	if (queryin.length>0 && queryin.substring(0,1) == "?"){
  		queryin = queryin.substring(1);
  	}

//  	if (pagein==undefined || pagein=="null"){
  	if (pagein==null || pagein=="null"){
  		pagein = "";
  	}

  	if (queryin==null || queryin=="null"){
  		queryin = "";
  	}
  	if (pagein>"" && queryin>""){
  		qinstring = "A_Plus_action=" + pagein + "&" + queryin;
  	}
  	if (pagein>"" && queryin<=""){
  		qinstring = "A_Plus_action=" + pagein;
  	}
  	if (pagein<="" && queryin>""){
  		qinstring = "" + queryin;
  	}
  	if (qinstring.length>0 && qinstring.substring(0,1) == "?"){
  		qinstring = qinstring.substring(1);
  	}
  	if (QueryString.length>0 && QueryString.substring(0,1) == "?"){
  		QueryString = QueryString.substring(1);
  	}
//if (mac<1){	
  	if (NextPage==null || NextPage=="null"){
  		NextPage = "";
  	}
  	if (QueryString==null || QueryString=="null"){
  		QueryString = "";
  	}
  	if (NextPage>"" && QueryString>""){
  		qstring = "A_Plus_action=" + NextPage + "&" + QueryString;
  	}
  	if (NextPage>"" && QueryString<=""){
  		qstring = "A_Plus_action=" + NextPage;
  	}
  	if (NextPage<="" && QueryString>""){
  		qstring = "" + QueryString;
  	}
  	if (qstring.length>0 && qstring.substring(0,1) == "?"){
  		qstring = qstring.substring(1);
  	}
	

  	if (HTMLMsg==null || HTMLMsg=="null"){
  		HTMLMsg = "";
  	}
  	if (Height==null || Height=="null" || Height=="" ){
  		Height = "180";
  	}
  	if (Width==null || Width=="null" || Width==""){
  		Width = "180";
  	}
  	if (Timeout==null || Timeout=="null" || Timeout==""){
  		Timeout = "30000";
  	}
//}	
  	testWin=window.open("","testWin","alwaysRaised=yes,hotkeys=yes,scrollbars=no,toolbar=no,directories=no,menubar=no,resizable=no,status=no,width="+Width+",height="+Height+",left=140,top=140,screenX=140,screenY=140");
  	testWin.document.open();
  	self.name=sessionID+"PIN";
  	testWin.document.write("<HTML>");
  	testWin.document.write("<HEAD>");
  	testWin.document.write("<Title>PIN Challenge</Title>");
  	testWin.document.write("</HEAD>");
  	testWin.document.write("<BODY bgcolor=#dfdfdf onload='document.chal.Chal_PIN.focus()'>");
  	testWin.document.write("<TABLE align='center'>");
  	testWin.document.write("<TR>");
  	testWin.document.write("<TD align='center'>");
  	testWin.document.write(HTMLMsg);
  	testWin.document.write("</TD>");
  	testWin.document.write("</TR>");
  	testWin.document.write("<TR>");
  	testWin.document.write("<TD align='center'><b>");
  	testWin.document.write("Enter PIN");
  	testWin.document.write("</b></TD>");
  	testWin.document.write("</TR>");
  	testWin.document.write("<TR>");
  	testWin.document.write("<TD align='center'>");
  	testWin.document.write("<form name='chal' action='/servlet/adp.CheckPassword' method='post' target="+self.name+" onsubmit=window.setTimeout('window.close()',500);>");
  	testWin.document.write("<input type='hidden' name='Chal_Session_ID' value='"+self.name+"'>");
  	testWin.document.write("<input type='hidden' name='Chal_Prev_Page' value='"+pagein+"'>");
  	testWin.document.write("<input type='hidden' name='Chal_Prev_Query' value='"+qinstring+"'>");
  	testWin.document.write("<input type='hidden' name='Chal_Next_Page' value='/servlet/adp.A_Plus'>");
  	testWin.document.write("<input type='hidden' name='Chal_Next_Query' value='"+qstring+"'>");
  	testWin.document.write("<input type='hidden' name='Chal_HTMLMsg' value='"+HTMLMsg+"'>");
  	testWin.document.write("<input type='hidden' name='Chal_Height' value='"+Height+"'>");
  	testWin.document.write("<input type='hidden' name='Chal_Width' value='"+Width+"'>");
  	testWin.document.write("<input type='hidden' name='Chal_Timeout' value='"+Timeout+"'>");
  	testWin.document.write("<input type='hidden' name='Chal_InvalidCtr' value='0'>");
	queryArray = getSearchAsArray(qstring);
    for (counter in queryArray) {
     if (queryArray[counter].substring(0,queryArray[counter].indexOf('=')) == 'A_Plus_action' && NextPage>'') {
       testWin.document.write("<input type='hidden' name='"+queryArray[counter].substring(0,queryArray[counter].indexOf('='))+"' value='"+NextPage+"'>");
     }else{
       testWin.document.write("<input type='hidden' name='"+queryArray[counter].substring(0,queryArray[counter].indexOf('='))+"' value='"+queryArray[counter].substring(queryArray[counter].indexOf('=') + 1)+"'>");
     }
    }
  	testWin.document.write("<input type='password' name=Chal_PIN size=4>");
  	testWin.document.write("</TD>");
  	testWin.document.write("</TR>");
  	testWin.document.write("<TR>");
  	testWin.document.write("<TD align='center'>");
  	testWin.document.write("<TABLE>");
  	testWin.document.write("<TR>");
  	testWin.document.write("<TD align='right'>");
  	testWin.document.write("<input type='submit' value='Submit' onclick=window.setTimeout('window.close()',500);>");
  	testWin.document.write("</form>");
  	testWin.document.write("</TD>");
  	testWin.document.write("<TD align='left'>");
	//testWin.document.write("<form name='Cancel' action='javascript:document.location.reload()' method='post' target="+self.name+" onsubmit=window.setTimeout('window.close()',200)>");
   	//testWin.document.write("<form name='Cancel' action='javascript:window.close();' method='post' target="+self.name+" onsubmit=window.setTimeout('window.close()',200)>");
   	testWin.document.write("<form name='Cancel' action='javascript:'window.close()' method='post'>");
   	//testWin.document.write("<form name='Cancel' method='post' target="+self.name+" onsubmit=window.setTimeout('window.close()',200)>");
  	queryinArray = getSearchAsArray(qinstring);
    for (counter in queryinArray) {
     if (queryinArray[counter].substring(0,queryinArray[counter].indexOf('=')) == 'A_Plus_action' && pagein>'') {
       testWin.document.write("<input type='hidden' name='"+queryinArray[counter].substring(0,queryinArray[counter].indexOf('='))+"' value='"+pagein+"'>");
     }else{
       testWin.document.write("<input type='hidden' name='"+queryinArray[counter].substring(0,queryinArray[counter].indexOf('='))+"' value='"+queryinArray[counter].substring(queryinArray[counter].indexOf('=') + 1)+"'>");
     }
    }
//  	testWin.document.write("<input type='submit' value='Cancel' onclick=window.setTimeout('window.close()',200)>");
  	testWin.document.write("<input type='submit' value='Cancel' onclick='window.close()'>");
  	testWin.document.write("</form>");
	testWin.document.write("</TD>");
  	testWin.document.write("</TR>");
  	testWin.document.write("</TABLE>");
  	testWin.document.write("<font size=1>This PopUp will expire in "+Timeout/1000+" seconds</font>");
  	testWin.document.write("</TD>");
  	testWin.document.write("</TR>");
  	testWin.document.write("</TABLE>");
  	testWin.document.write("</BODY>");
  	testWin.document.write("</HTML>");
//  	testWin.setTimeout("document.Cancel.submit();window.close()",Timeout);
  	testWin.setTimeout("window.close()",Timeout);
  	testWin.document.close();
    }







///////////////////////////////////////////////////////////////////////
// Helper functions used by this library
  function invldPINChallenge(sessionID,NextPage,QueryString,PrevPage,PrevQuery,HTMLMsg,Height,Width,Timeout,InvalidCtr) {
   var pagein = PrevPage;
   var queryin = PrevQuery;
   var ua = window.navigator.userAgent;
   var msie = ua.indexOf ( "MSIE " );
   var queryinArray = new Array();
   var queryArray = new Array();
  	var qinstring = "";
  	var qstring = "";
  	if (queryin.length>0 && queryin.substring(0,1) == "?"){
  		queryin = queryin.substring(1);
  	}
  	if (pagein==null || pagein=="null"){
  		pagein = "";
  	}
  	if (queryin==null || queryin=="null"){
  		queryin = "";
  	}
  	if (pagein>"" && queryin>""){
  		qinstring = "A_Plus_action=" + pagein + "&" + queryin;
  	}
  	if (pagein>"" && queryin<=""){
  		qinstring = "A_Plus_action=" + pagein;
  	}
  	if (pagein<="" && queryin>""){
  		qinstring = "" + queryin;
  	}
  	if (qinstring.length>0 && qinstring.substring(0,1) == "?"){
  		qinstring = qinstring.substring(1);
  	}
  	if (QueryString.length>0 && QueryString.substring(0,1) == "?"){
  		QueryString = QueryString.substring(1);
  	}
  	if (NextPage==null || NextPage=="null"){
  		NextPage = "";
  	}
  	if (QueryString==null || QueryString=="null"){
  		QueryString = "";
  	}
  	if (NextPage>"" && QueryString>""){
  		qstring = "A_Plus_action=" + NextPage + "&" + QueryString;
  	}
  	if (NextPage>"" && QueryString<=""){
  		qstring = "A_Plus_action=" + NextPage;
  	}
  	if (NextPage<="" && QueryString>""){
  		qstring = "" + QueryString;
  	}
  	if (qstring.length>0 && qstring.substring(0,1) == "?"){
  		qstring = qstring.substring(1);
  	}
  	if (HTMLMsg==null || HTMLMsg=="null"){
  		HTMLMsg = "";
  	}
  	if (Height==null || Height=="null"){
  		Height = "180";
  	}
  	if (Width==null || Width=="null"){
  		Width = "180";
  	}
  	if (Timeout==null || Timeout=="null"){
  		Timeout = "30000";
  	}
  	if (InvalidCtr==null || InvalidCtr=="null"){
  		InvalidCtr = 0;
  	}
	InvalidCtr = Number(InvalidCtr) + 1;
  	testWin=window.open("","testWin","alwaysRaised=yes,hotkeys=yes,scrollbars=no,toolbar=no,directories=no,menubar=no,resizable=no,status=no,width="+Width+",height="+Height+",left=140,top=140,screenX=140,screenY=140");
  	testWin.document.open();
  	self.name=sessionID+"PIN";
	testWin.document.write("<HTML>");
  	testWin.document.write("<HEAD>");
  	testWin.document.write("<Title>PIN Challenge</Title>");
  	testWin.document.write("</HEAD>");
  	testWin.document.write("<BODY bgcolor=#dfdfdf onload='document.chal.Chal_PIN.focus()'>");
  	testWin.document.write("<TABLE align='center'>");
  	testWin.document.write("<TR>");
  	testWin.document.write("<TD align='center'>");
  	testWin.document.write(HTMLMsg);
  	testWin.document.write("</TD>");
  	testWin.document.write("</TR>");
  	testWin.document.write("<TR>");
  	testWin.document.write("<TD align='center'><b>");
  	testWin.document.write("Invalid PIN");
  	testWin.document.write("</b></TD>");
  	testWin.document.write("</TR>");
  	testWin.document.write("<TR>");
  	testWin.document.write("<TD align='center'>");
  	testWin.document.write("Try Again");
  	testWin.document.write("</TD>");
  	testWin.document.write("</TR>");
  	testWin.document.write("<TR>");
  	testWin.document.write("<TD align='center'>");
  	testWin.document.write("<form name='chal' action='/servlet/adp.CheckPassword' method='post' target="+self.name+" onsubmit=window.setTimeout('window.close()',200);>");
  	testWin.document.write("<input type='hidden' name='Chal_Session_ID' value='"+self.name+"'>");
  	testWin.document.write("<input type='hidden' name='Chal_Prev_Page' value='"+pagein+"'>");
  	testWin.document.write("<input type='hidden' name='Chal_Prev_Query' value='"+qinstring+"'>");
  	testWin.document.write("<input type='hidden' name='Chal_Next_Page' value='/servlet/adp.A_Plus'>");
  	testWin.document.write("<input type='hidden' name='Chal_Next_Query' value='"+qstring+"'>");
  	testWin.document.write("<input type='hidden' name='Chal_HTMLMsg' value='"+HTMLMsg+"'>");
  	testWin.document.write("<input type='hidden' name='Chal_Height' value='"+Height+"'>");
  	testWin.document.write("<input type='hidden' name='Chal_Width' value='"+Width+"'>");
  	testWin.document.write("<input type='hidden' name='Chal_Timeout' value='"+Timeout+"'>");
  	testWin.document.write("<input type='hidden' name='Chal_InvalidCtr' value='"+InvalidCtr+"'>");
  	queryArray = getSearchAsArray(qstring);
    for (counter in queryArray) {
     if (queryArray[counter].substring(0,queryArray[counter].indexOf('=')) == 'A_Plus_action' && NextPage>'') {
       testWin.document.write("<input type='hidden' name='"+queryArray[counter].substring(0,queryArray[counter].indexOf('='))+"' value='"+NextPage+"'>");
     }else{
       testWin.document.write("<input type='hidden' name='"+queryArray[counter].substring(0,queryArray[counter].indexOf('='))+"' value='"+queryArray[counter].substring(queryArray[counter].indexOf('=') + 1)+"'>");
     }
    }
  	testWin.document.write("<input type='password' name=Chal_PIN size=4>");
  	testWin.document.write("</TD>");
  	testWin.document.write("</TR>");
  	testWin.document.write("<TR>");
  	testWin.document.write("<TD align='center'>");
  	testWin.document.write("<TABLE>");
  	testWin.document.write("<TR>");
  	testWin.document.write("<TD align='right'>");
  	testWin.document.write("<input type='submit' value='Submit' onclick=window.setTimeout('window.close()',200);>");
  	testWin.document.write("</form>");
  	testWin.document.write("</TD>");
  	testWin.document.write("<TD align='left'>");
   	testWin.document.write("<form name='Cancel' action='javascript:history.go(-"+InvalidCtr+");' method='post' target="+self.name+" onsubmit=window.setTimeout('window.close()',200);>");
	queryinArray = getSearchAsArray(qinstring);
    for (counter in queryinArray) {
     if (queryinArray[counter].substring(0,queryinArray[counter].indexOf('=')) == 'A_Plus_action' && pagein>'') {
       testWin.document.write("<input type='hidden' name='"+queryinArray[counter].substring(0,queryinArray[counter].indexOf('='))+"' value='"+pagein+"'>");
     }else{
       testWin.document.write("<input type='hidden' name='"+queryinArray[counter].substring(0,queryinArray[counter].indexOf('='))+"' value='"+queryinArray[counter].substring(queryinArray[counter].indexOf('=') + 1)+"'>");
     }
    }
  	testWin.document.write("<input type='submit' value='Cancel' onclick=window.setTimeout('window.close()',200);>");
  	testWin.document.write("</form>");
  	testWin.document.write("</TD>");
  	testWin.document.write("</TR>");
  	testWin.document.write("</TABLE>");
  	testWin.document.write("<font size=1>This PopUp will expire in "+Timeout/1000+" seconds</font>");
  	testWin.document.write("</TD>");
  	testWin.document.write("</TR>");
  	testWin.document.write("</TABLE>");
  	testWin.document.write("</BODY>");
  	testWin.document.write("</HTML>");
//  	testWin.setTimeout("window.close()",Timeout);
  	testWin.setTimeout("document.Cancel.submit();window.close()",Timeout);
  	testWin.document.close();
    }
///////////////////////////////////////////////////////////////////////
// Helper functions used by this library
   // Build an associative array with all name and value pairs in a 'get' query string
   function getSearchAsArray(QueryString) {
   	var searchQuery = new Array;
   	var pair;
   	var temp;
   	var search = unescape(QueryString);
   	
   	// replace all '+'s with ' 's because unescape() doesn't do it
   	var pos = 0;
   	pos = search.indexOf('%20');
   	while (pos != -1){
   	  search = search.substring(0,pos) + ' ' + search.substring(pos+3);
   	  pos = search.indexOf('%20');
   	}
   	
   	// for each pair, separate, unescape and place into the associate array
   	var split = 1;
   	while (split > 0) {
   		split = search.lastIndexOf('&');
   		pair = search.substring(split + 1, search.length);
   		
  			// all other form elements have a one-to-one name and value relationship
  			searchQuery[unescape(pair.substring(0, pair.indexOf('=')))] = unescape(pair);
  			
  			search = search.substring(0, split);
  		}
  		return searchQuery;
  	}
*/

//JSD///////////////////////////////////////////////////////////////
//JSD Function: getRandomNumber
//JSD Descr:  generates a random number between 33 and 127
//JSD Author: Rafael Mellado
//JSD Creation date: (2/21/2005 1:42:32 PM)
//JSD @return random number
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE getRandomNumber
 function getRandomNumber() {
// generate a random number between 33 and 127
   var rndNum = Math.random()
   rndNum = parseInt(rndNum * 1000);
   rndNum = (rndNum % 94) + 33;
   return rndNum;
}
//JSD//ENDCODE getRandomNumber

//JSD///////////////////////////////////////////////////////////////
//JSD Function: openSinglePageViewer
//JSD Descr:  opens a new window with an image from CM.  The window has no menubar or navigation, 
//            it uses the getRandomNumber as helper since it has to create a unique name for the window title.
//JSD Author: Rafael Mellado
//JSD Creation date: (2/21/2005 1:42:32 PM)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE openSinglePageViewer
function openSinglePageViewer(theUrl,tName) {
   //var sURL = "/CM01/CMDrillDown/getImage.jsp?refNum="+theUrl
   //var sURL = "https://adpcs009.adp.iastate.edu/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName
//   var sURL = "https://oldcmtest.its.iastate.edu/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName
   var sURL = "https://aplus026.its.iastate.edu/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName
   rn = getRandomNumber();
   var count = 3
   window.open(sURL, rn + count,'menubar=no, status=no, location=no, toolbar=no, resizable=yes,scrollbars=yes')
}
//JSD//ENDCODE openSinglePageViewer

function openSinglePageViewer2(theUrl,tName) {
   //var sURL = "/CM01/CMDrillDown/getImage.jsp?refNum="+theUrl
   //var sURL = "https://adpcs009.adp.iastate.edu/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName+"&COOK=APLUSTESTID="+getCookie("APLUSTESTID")
   //var sURL = "https://oldcmtest.its.iastate.edu/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName+"&COOK=APLUSTESTID="+getCookie("APLUSTESTID")
   //var sURL = "https://aplus027.its.iastate.edu/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName+"&COOK=APLUSTESTID="+getCookie("APLUSTESTID")
   var sURL = "https://cmprod.its.iastate.edu/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName+"&COOK=APLUSTESTID="+getCookie("APLUSTESTID")
   rn = getRandomNumber();
   var count = 3
   window.open(sURL, rn + count,'menubar=no, status=no, location=no, toolbar=no, resizable=yes,scrollbars=yes')
}
function openSinglePageViewer3(theUrl,tName) {
   //var sURL = "/CM01/CMDrillDown/getImage.jsp?refNum="+theUrl
   //var sURL = "https://adpcs009.adp.iastate.edu/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName+"&COOK=APLUSTESTID="+getCookie("APLUSTESTID")
   //var sURL = "https://oldcmtest.its.iastate.edu/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName+"&COOK=APLUSTESTID="+getCookie("APLUSTESTID")
   //var sURL = "https://aplus027.its.iastate.edu/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName+"&COOK=APLUSTESTID="+getCookie("APLUSTESTID")
   var sURL = "https://cmprod.its.iastate.edu/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName+"&COOK=APLUSTESTID="+getCookie("APLUSTESTID")
   rn = getRandomNumber();
   var count = 3
   window.open(sURL, rn + count,'menubar=no, status=no, location=no, toolbar=no, resizable=yes,scrollbars=yes')
}
//JSD///////////////////////////////////////////////////////////////
//JSD Function: getCookie
//JSD Descr:  return a cookie
//JSD Author: Rafael Mellado
//JSD Creation date: (2/21/2005 1:42:32 PM)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE getCookie
function getCookie(name)
{
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1)
    {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1)
    {
        end = dc.length;
    }
    return unescape(dc.substring(begin + prefix.length, end));
    
}
//JSD//ENDCODE getCookie

//JSD///////////////////////////////////////////////////////////////
//JSD Function: openSinglePageViewer
//JSD Descr:  opens a new window with an image from CM.  The window has no menubar or navigation, 
//            it uses the getRandomNumber as helper since it has to create a unique name for the window title.
//JSD Author: Rafael Mellado
//JSD Creation date: (2/21/2005 1:42:32 PM)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE openSinglePageViewerP
function openSinglePageViewerP(theUrl,tName) {
   //var sURL = "/CM01/CMDrillDown/getImage.jsp?refNum="+theUrl
   //var sURL = "https://rs78014.adp.iastate.edu/CM01/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName
   //var sURL = "https://cm.its.iastate.edu/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName+"&frameName=viewerP&COOK=APLUSID="+getCookie("APLUSID")
   var sURL = "https://ecm.its.iastate.edu/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName+"&frameName=viewerP&COOK=APLUSID="+getCookie("APLUSID")
   rn = getRandomNumber();
   var count = 3
   window.open(sURL, rn + count,'menubar=no, status=no, location=no, toolbar=no, resizable=yes,scrollbars=yes')
}
//JSD//ENDCODE openSinglePageViewerP

function openSinglePageViewer2P(theUrl,tName) {
   //var sURL = "/CM01/CMDrillDown/getImage.jsp?refNum="+theUrl
   //var sURL = "https://adpcs009.adp.iastate.edu/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName+"&COOK=APLUSTESTID="+getCookie("APLUSTESTID")
//   var sURL = "https://oldcmtest.its.iastate.edu/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName+"&COOK=APLUSTESTID="+getCookie("APLUSTESTID")
   var sURL = "https://aplus026.its.iastate.edu/servlet/cm01.getImage?refNum="+theUrl+"&RepName="+tName+"&COOK=APLUSTESTID="+getCookie("APLUSTESTID")
   rn = getRandomNumber();
   var count = 3
   window.open(sURL, rn + count,'menubar=no, status=no, location=no, toolbar=no, resizable=yes,scrollbars=yes')
}

//JSD///////////////////////////////////////////////////////////////
//JSD Function: showhide
//JSD Descr: simple show/hide of element by id
//JSD Author: Zak Bell
//JSD Creation date: (2/21/2005 1:42:32 PM)
//    Modified 2005-11-18, Dan Black:
//      expands all unless all items are already expanded (then collapses all)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE showhide
function showhide() {
  var showhide = "hide";
  for (var j=0; j<arguments.length; j++) {
    if (document.getElementById(arguments[j]).style.display == "none") {
      showhide = "show";
    }
  }
  for (var i=0; i<arguments.length; i++) {
    if (showhide == "show") {
      document.getElementById(arguments[i]).style.display = "inline";
    } else if (showhide == "hide") {
      document.getElementById(arguments[i]).style.display = "none";
    }
  }
}
//JSD//ENDCODE showhide

//JSD///////////////////////////////////////////////////////////////
//JSD Function: stickyshowhide
//JSD Descr: show/hide of element by id
//JSD Author: Todd Hughes
//JSD Creation date: (7/27/2006 1:42:32 PM)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE stickyshowhide
function stickyshowhide(divId) {
    if (document.getElementById(divId).style.display == "none") {
      document.getElementById(divId).style.display = "inline";
	  document.getElementById("TOGGLE_" +divId).value="inline";
    }else{
      document.getElementById(divId).style.display = "none";
	  document.getElementById("TOGGLE_" +divId).value="none";
	}
}
//JSD//ENDCODE stickyshowhide

function tabsshowhide(divId) {
    if (document.getElementById(divId).style.display == "none") {
      document.getElementById(divId).style.display = "inline";
	  document.mainform.applicationSize.value="S";
    }else{
      document.getElementById(divId).style.display = "none";
	  document.mainform.applicationSize.value="B";
	}
}


///////////////////////////////////////////////////////////////////////////////
// Function: icontoggle
// Description: Toggles the plus/minus icons for expanded views
// Author: Dan Black
// Creation date: January 2006 (copied to accessplus.js 2006-03-09)
// 
// Expects a list of one or more plus/minus icons (img objects)
// Example:  icontoggle("icon1","icon2","etc");
///////////////////////////////////////////////////////////////////////////////
function icontoggle() // display plus icon when dropdown is hidden / minus when visible
{
  var plusminus = "minus";
  for (var j=0; j<arguments.length; j++) {
    if (document.getElementById(arguments[j]).style.display == "none") {
      plusminus = "plus";
    }
  }
  for (var i=0; i<arguments.length; i++) {
    if (plusminus == "minus") {
      document.getElementById(arguments[i] + 'icon').src = 'https://accessplus.iastate.edu/accessplus/img/icon.minus.browse.gif';
      document.getElementById(arguments[i] + 'icon').title = 'Hide';
      document.getElementById(arguments[i] + 'icon').alt = 'Hide';
    } else if (plusminus == "plus") {
      document.getElementById(arguments[i] + 'icon').src = 'https://accessplus.iastate.edu/accessplus/img/icon.plus.browse.gif';
      document.getElementById(arguments[i] + 'icon').title = 'Show';
      document.getElementById(arguments[i] + 'icon').alt = 'Show';
    }
  }
}

//JSD///////////////////////////////////////////////////////////////
//JSD Function: showhidetree
//JSD Descr: simple expand/collapse explorer style tree
//JSD Author: Zak Bell
//JSD Creation date: (2/21/2005 1:42:32 PM)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE showhidetree
function showhidetree() {
  var primary = document.getElementById(arguments[0]).style.display
  for (var i=0; i<arguments.length; i++) {
    if (primary == 'none') {
      document.getElementById(arguments[i]).style.display = 'inline';
      document.getElementById(arguments[i] + 'icon').src = 'https://accessplus.iastate.edu/accessplus/img/icon.minus.gif';
      document.getElementById(arguments[i] + 'icon').title = 'Collapse';
      document.getElementById(arguments[i] + 'icon').alt = 'Collapse';
    } else if (primary == 'inline') {
      document.getElementById(arguments[i]).style.display = 'none';
      document.getElementById(arguments[i] + 'icon').src = 'https://accessplus.iastate.edu/accessplus/img/icon.plus.gif';
      document.getElementById(arguments[i] + 'icon').title = 'Expand';
      document.getElementById(arguments[i] + 'icon').alt = 'Expand';
    }
  }
}
//JSD//ENDCODE showhidetree

//JSD///////////////////////////////////////////////////////////////
//JSD Function: showalltree
//JSD Descr: simple expand explorer style tree
//JSD Author: Zak Bell
//JSD Creation date: (2/21/2005 1:42:32 PM)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE showalltree
function showalltree() {
  //var primary = document.getElementById(arguments[0]).style.display
  for (var i=0; i<arguments.length; i++) {
    var primary = document.getElementById(arguments[i]).style.display
    if (primary == 'none') {
      document.getElementById(arguments[i]).style.display = 'inline';
      document.getElementById(arguments[i] + 'icon').src = 'https://accessplus.iastate.edu/accessplus/img/icon.minus.gif';
      document.getElementById(arguments[i] + 'icon').title = 'Collapse';
      document.getElementById(arguments[i] + 'icon').alt = 'Collapse';
    } 
  }
}
//JSD//ENDCODE showalltree

//JSD///////////////////////////////////////////////////////////////
//JSD Function: hidealltree
//JSD Descr: simplecollapse explorer style tree
//JSD Author: Zak Bell
//JSD Creation date: (2/21/2005 1:42:32 PM)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE hidealltree
function hidealltree() {
  //var primary = document.getElementById(arguments[0]).style.display
  for (var i=0; i<arguments.length; i++) {
    var primary = document.getElementById(arguments[i]).style.display
    if (primary == 'inline') {
      document.getElementById(arguments[i]).style.display = 'none';
      document.getElementById(arguments[i] + 'icon').src = 'https://accessplus.iastate.edu/accessplus/img/icon.plus.gif';
      document.getElementById(arguments[i] + 'icon').title = 'Expand';
      document.getElementById(arguments[i] + 'icon').alt = 'Expand';
    } 
  }
}
//JSD//ENDCODE hidealltree

//JSD///////////////////////////////////////////////////////////////
//JSD Function: showhidetree
//JSD Descr: simple expand/collapse explorer style tree
//JSD Author: Zak Bell
//JSD Creation date: (2/21/2005 1:42:32 PM)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE showonlyfieldtree
function showonlyfieldtree() {
  var primary = document.getElementById(arguments[0]).style.display
  for (var i=0; i<arguments.length; i++) {
    //if (primary == 'none') {
      document.getElementById(arguments[i]).style.display = 'inline';
      document.getElementById(arguments[i] + 'icon').src = 'https://accessplus.iastate.edu/accessplus/img/icon.minus.gif';
      document.getElementById(arguments[i] + 'icon').title = 'Collapse';
      document.getElementById(arguments[i] + 'icon').alt = 'Collapse';
    //} else if (primary == 'inline') {
      //document.getElementById(arguments[i]).style.display = 'none';
      //document.getElementById(arguments[i] + 'icon').src = 'https://accessplus.iastate.edu/accessplus/img/icon.plus.gif';
      //document.getElementById(arguments[i] + 'icon').title = 'Expand';
      //document.getElementById(arguments[i] + 'icon').alt = 'Expand';
    //}
  }
}
//JSD//ENDCODE showonlyfieldtree

//JSD///////////////////////////////////////////////////////////////
//JSD Function: showhidetree
//JSD Descr: simple expand/collapse explorer style tree
//JSD Author: Zak Bell
//JSD Creation date: (2/21/2005 1:42:32 PM)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE hideonlyfieldtree
function hideonlyfieldtree() {
  var primary = document.getElementById(arguments[0]).style.display
  for (var i=0; i<arguments.length; i++) {
    //if (primary == 'none') {
      //document.getElementById(arguments[i]).style.display = 'inline';
      //document.getElementById(arguments[i] + 'icon').src = 'https://accessplus.iastate.edu/accessplus/img/icon.minus.gif';
      //document.getElementById(arguments[i] + 'icon').title = 'Collapse';
      //document.getElementById(arguments[i] + 'icon').alt = 'Collapse';
    //} else if (primary == 'inline') {
      document.getElementById(arguments[i]).style.display = 'none';
      document.getElementById(arguments[i] + 'icon').src = 'https://accessplus.iastate.edu/accessplus/img/icon.plus.gif';
      document.getElementById(arguments[i] + 'icon').title = 'Expand';
      document.getElementById(arguments[i] + 'icon').alt = 'Expand';
    //}
  }
}
//JSD//ENDCODE hideonlyfieldtree

var frmOpen = false;
function ndOff(){
  frmOpen=false;
  nd();
  nd();
}


  function openDropDownWithAction(form,theObj,strtObj,page,tall,wide,action){
  var hout = 0;
  var wout = 0;
  var rowsout = 0;
  if (ddOpen){
	ndOff();
    ddOpen = false;
	strtObj.value = theObj.value;
  }else{
    ddOpen = true;
    val = theObj.value;
	strtVal = strtObj.value;
    fieldName = theObj.name;
    x = y = 0;
    h = theObj.offsetHeight;
    w = theObj.offsetWidth;
    while(theObj){
      x += theObj.offsetLeft;
      y += theObj.offsetTop;
      theObj = theObj.offsetParent;
    }
	h1 = 10;
	if (tall==0){
	  hout = (h1 + 2) * 22;
	}else{
	  hout = tall;
	}
	hout = hout - (hout % h1);
	rowsout = (hout / h1);
	if (wide==0){
	  if (w<95){
	    wout = 115;
	  }else{
	    wout = w + 22;
	  }
	}else{
	  wout = wide;
	}
	var field2Name="";
	var field3Name="";
	var field4Name="";
	var field5Name="";
	var field6Name="";
	var field7Namee="";
	var field8Name="";
	var field9Name="";
	var field10Namee="";
	var field11Name="";
	var field12Name="";
	var field13Name="";
	var field14Name="";
	var field15Name="";
	var field16Name="";
	var field17Name="";
	var field18Name="";
	var field19Namee="";
	var field20Name="";
	var field2Value="";
	var field3Value="";
	var field4Value="";
	var field5Value="";
	var field6Value="";
	var field7Value="";
	var field8Value="";
	var field9Value="";
	var field10Value="";
	var field11Value="";
	var field12Value="";
	var field13Value="";
	var field14Value="";
	var field15Value="";
	var field16Value="";
	var field17Value="";
	var field18Value="";
	var field19Value="";
	var field20Value="";
	var field2Found=false;
	var field3Found=false;
	var field4Found=false;
	var field5Found=false;
	var field6Found=false;
	var field7Found=false;
	var field8Found=false;
	var field9Found=false;
	var field10Found=false;
	var field11Found=false;
	var field12Found=false;
	var field13Found=false;
	var field14Found=false;
	var field15Found=false;
	var field16Found=false;
	var field17Found=false;
	var field18Found=false;
	var field19Found=false;
	var field20Found=false;
	for (var e=0;e<form.elements.length;e++){
	    if (form.elements[e].name == 'ddField2' + fieldName){
		    field2Name = form.elements[e].value;
		    field2Found = true;
		}
	    if (form.elements[e].name == 'ddField3' + fieldName){
		    field3Name = form.elements[e].value;
		    field3Found = true;
		}
	    if (form.elements[e].name == 'ddField4' + fieldName){
		    field4Name = form.elements[e].value;
		    field4Found = true;
		}
	    if (form.elements[e].name == 'ddField5' + fieldName){
		    field5Name = form.elements[e].value;
		    field5Found = true;
	    }
	    if (form.elements[e].name == 'ddField6' + fieldName){
		    field6Name = form.elements[e].value;
		    field6Found = true;
	    }
	    if (form.elements[e].name == 'ddField7' + fieldName){
		    field7Name = form.elements[e].value;
		    field7Found = true;
	    }
	    if (form.elements[e].name == 'ddField8' + fieldName){
		    field8Name = form.elements[e].value;
		    field8Found = true;
	    }
	    if (form.elements[e].name == 'ddField9' + fieldName){
		    field9Name = form.elements[e].value;
		    field9Found = true;
	    }
	    if (form.elements[e].name == 'ddField10' + fieldName){
		    field10Name = form.elements[e].value;
		    field10Found = true;
	    }
	    if (form.elements[e].name == 'ddField11' + fieldName){
		    field11Name = form.elements[e].value;
		    field11Found = true;
	    }
	    if (form.elements[e].name == 'ddField12' + fieldName){
		    field12Name = form.elements[e].value;
		    field12Found = true;
		}
	    if (form.elements[e].name == 'ddField13' + fieldName){
		    field13Name = form.elements[e].value;
		    field13Found = true;
		}
	    if (form.elements[e].name == 'ddField14' + fieldName){
		    field14Name = form.elements[e].value;
		    field14Found = true;
		}
	    if (form.elements[e].name == 'ddField15' + fieldName){
		    field15Name = form.elements[e].value;
		    field15Found = true;
	    }
	    if (form.elements[e].name == 'ddField16' + fieldName){
		    field16Name = form.elements[e].value;
		    field16Found = true;
	    }
	    if (form.elements[e].name == 'ddField17' + fieldName){
		    field17Name = form.elements[e].value;
		    field17Found = true;
	    }
	    if (form.elements[e].name == 'ddField18' + fieldName){
		    field18Name = form.elements[e].value;
		    field18Found = true;
	    }
	    if (form.elements[e].name == 'ddField19' + fieldName){
		    field19Name = form.elements[e].value;
		    field19Found = true;
	    }
	    if (form.elements[e].name == 'ddField20' + fieldName){
		    field20Name = form.elements[e].value;
		    field20Found = true;
	    }
	}
	for (var e=0;e<form.elements.length;e++){
	    if (field2Found && form.elements[e].name == field2Name){
		    field2Value = form.elements[e].value;
		}
	    if (field3Found && form.elements[e].name == field3Name){
		    field3Value = form.elements[e].value;
		}
	    if (field4Found && form.elements[e].name == field4Name){
		    field4Value = form.elements[e].value;
		}
	    if (field5Found && form.elements[e].name == field5Name){
		    field5Value = form.elements[e].value;
		}
	    if (field6Found && form.elements[e].name == field6Name){
		    field6Value = form.elements[e].value;
		}
	    if (field7Found && form.elements[e].name == field7Name){
		    field7Value = form.elements[e].value;
		}
	    if (field8Found && form.elements[e].name == field8Name){
		    field8Value = form.elements[e].value;
		}
	    if (field9Found && form.elements[e].name == field9Name){
		    field9Value = form.elements[e].value;
		}
	    if (field10Found && form.elements[e].name == field10Name){
		    field10Value = form.elements[e].value;
		}
	    if (field11Found && form.elements[e].name == field11Name){
		    field11Value = form.elements[e].value;
		}
	    if (field12Found && form.elements[e].name == field12Name){
		    field12Value = form.elements[e].value;
		}
	    if (field13Found && form.elements[e].name == field13Name){
		    field13Value = form.elements[e].value;
		}
	    if (field14Found && form.elements[e].name == field14Name){
		    field14Value = form.elements[e].value;
		}
	    if (field15Found && form.elements[e].name == field15Name){
		    field15Value = form.elements[e].value;
		}
	    if (field16Found && form.elements[e].name == field16Name){
		    field16Value = form.elements[e].value;
		}
	    if (field17Found && form.elements[e].name == field17Name){
		    field17Value = form.elements[e].value;
		}
	    if (field18Found && form.elements[e].name == field18Name){
		    field18Value = form.elements[e].value;
		}
	    if (field19Found && form.elements[e].name == field19Name){
		    field19Value = form.elements[e].value;
		}
	    if (field20Found && form.elements[e].name == field20Name){
		    field20Value = form.elements[e].value;
		}

	}
	var iframeText = '<iframe name="'+fieldName+'_DropDown" id="'+fieldName+'_DropDown" border="0" scrolling="auto" src="'+page+'?DD_STRT_VAL='+escape(strtVal)+'&DD_FIELD_NAME='+escape(fieldName);
	if (field2Found){
	    iframeText +='&DD_FIELD2_NAME='+escape(field2Name);
	    iframeText +='&DD_FIELD2_VALUE='+escape(field2Value);
	}
	if (field3Found){
	    iframeText +='&DD_FIELD3_NAME='+escape(field3Name);
	    iframeText +='&DD_FIELD3_VALUE='+escape(field3Value);
	}
	if (field4Found){
	    iframeText +='&DD_FIELD4_NAME='+escape(field4Name);
	    iframeText +='&DD_FIELD4_VALUE='+escape(field4Value);
	}
	if (field5Found){
	    iframeText +='&DD_FIELD5_NAME='+escape(field5Name);
	    iframeText +='&DD_FIELD5_VALUE='+escape(field5Value);
	}
	if (field6Found){
	    iframeText +='&DD_FIELD6_NAME='+escape(field6Name);
	    iframeText +='&DD_FIELD6_VALUE='+escape(field6Value);
	}
	if (field7Found){
	    iframeText +='&DD_FIELD7_NAME='+escape(field7Name);
	    iframeText +='&DD_FIELD7_VALUE='+escape(field7Value);
	}
	if (field8Found){
	    iframeText +='&DD_FIELD8_NAME='+escape(field8Name);
	    iframeText +='&DD_FIELD8_VALUE='+escape(field8Value);
	}
	if (field9Found){
	    iframeText +='&DD_FIELD9_NAME='+escape(field9Name);
	    iframeText +='&DD_FIELD9_VALUE='+escape(field9Value);
	}
	if (field10Found){
	    iframeText +='&DD_FIELD10_NAME='+escape(field10Name);
	    iframeText +='&DD_FIELD10_VALUE='+escape(field10Value);
	}
	if (field11Found){
	    iframeText +='&DD_FIELD11_NAME='+escape(field11Name);
	    iframeText +='&DD_FIELD11_VALUE='+escape(field11Value);
	}
	if (field12Found){
	    iframeText +='&DD_FIELD12_NAME='+escape(field12Name);
	    iframeText +='&DD_FIELD12_VALUE='+escape(field12Value);
	}
	if (field13Found){
	    iframeText +='&DD_FIELD13_NAME='+escape(field13Name);
	    iframeText +='&DD_FIELD13_VALUE='+escape(field13Value);
	}
	if (field14Found){
	    iframeText +='&DD_FIELD14_NAME='+escape(field14Name);
	    iframeText +='&DD_FIELD14_VALUE='+escape(field14Value);
	}
	if (field15Found){
	    iframeText +='&DD_FIELD15_NAME='+escape(field15Name);
	    iframeText +='&DD_FIELD15_VALUE='+escape(field15Value);
	}
	if (field16Found){
	    iframeText +='&DD_FIELD16_NAME='+escape(field16Name);
	    iframeText +='&DD_FIELD16_VALUE='+escape(field16Value);
	}
	if (field17Found){
	    iframeText +='&DD_FIELD17_NAME='+escape(field17Name);
	    iframeText +='&DD_FIELD17_VALUE='+escape(field17Value);
	}
	if (field18Found){
	    iframeText +='&DD_FIELD18_NAME='+escape(field18Name);
	    iframeText +='&DD_FIELD18_VALUE='+escape(field18Value);
	}
	if (field19Found){
	    iframeText +='&DD_FIELD19_NAME='+escape(field19Name);
	    iframeText +='&DD_FIELD19_VALUE='+escape(field19Value);
	}
	if (field20Found){
	    iframeText +='&DD_FIELD20_NAME='+escape(field20Name);
	    iframeText +='&DD_FIELD20_VALUE='+escape(field20Value);
	}	
	iframeText +='&DD_ACTION='+escape(action);
	iframeText +='&DD_FORM='+form.name+'" onMouseWheel="return(false)" onMouseScroll="return(false)" style="margin:0;padding:0;width:100%;height:100%;" scrolling="no" frameborder="0" marginwidth="0" marginheight="0">Your browser does not support inline frames or is currently configured not to display inline frames.</iframe>';
	if (navigator.platform.toLowerCase().indexOf('mac')>-1){
	  for(i=0;i<rowsout;i++){
	    iframeText += '<br>';
	  }
	}else{
	  for(i=0;i<rowsout;i=i+3){
	    iframeText += '<br>';
	  }
	}
	overlib(iframeText,DELAY,0,STICKY,0,BORDER,0,FIXX,x-3,FIXY,y+h+1,WIDTH,wout,HEIGHT,hout,FGCOLOR,"#ffffff");
  }
}
function disableField(formField){
    formField.disabled=true;
}
function enableField(formField){
    formField.disabled=false;
}


//JSD///////////////////////////////////////////////////////////////
//JSD Function: openDropDown
//JSD Descr:  Open the layer containing the dynamic dropdown 
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD @param form     (form that contains the field)
//JSD        theObj   (form element)
//JSD        page     (the page that should be run to generate the
//JSD                  data on the dropdown)
//JSD        tall     (the pixel height of the dropdown def=cell height * 22)
//JSD        wide     (the pixel width of the dropdown  def=cell width + 22)
//JSD        autoSubmit     (automatically submits the calling pages form on exact match)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE openDropDown
function openDropDown(form,theObj,strtObj,page,tall,wide){
  var hout = 0;
  var wout = 0;
  var rowsout = 0;
  if (ddOpen){
	ndOff();
    ddOpen = false;
	strtObj.value = theObj.value;
  }else{
    ddOpen = true;
    val = theObj.value;
	strtVal = strtObj.value;
    fieldName = theObj.name;
    x = y = 0;
    h = theObj.offsetHeight;
    w = theObj.offsetWidth;
    while(theObj){
      x += theObj.offsetLeft;
      y += theObj.offsetTop;
      theObj = theObj.offsetParent;
    }
	h1 = 10;
	if (tall==0){
	  hout = (h1 + 2) * 22;
	}else{
	  hout = tall;
	}
	hout = hout - (hout % h1);
	rowsout = (hout / h1);
	if (wide==0){
	  if (w<95){
	    wout = 115;
	  }else{
	    wout = w + 22;
	  }
	}else{
	  wout = wide;
	}
	var field2Name="";
	var field3Name="";
	var field4Name="";
	var field5Name="";
	var field6Name="";
	var field7Namee="";
	var field8Name="";
	var field9Name="";
	var field10Namee="";
	var field11Name="";
	var field12Name="";
	var field13Name="";
	var field14Name="";
	var field15Name="";
	var field16Name="";
	var field17Name="";
	var field18Name="";
	var field19Namee="";
	var field20Name="";
	var field2Value="";
	var field3Value="";
	var field4Value="";
	var field5Value="";
	var field6Value="";
	var field7Value="";
	var field8Value="";
	var field9Value="";
	var field10Value="";
	var field11Value="";
	var field12Value="";
	var field13Value="";
	var field14Value="";
	var field15Value="";
	var field16Value="";
	var field17Value="";
	var field18Value="";
	var field19Value="";
	var field20Value="";
	var field2Found=false;
	var field3Found=false;
	var field4Found=false;
	var field5Found=false;
	var field6Found=false;
	var field7Found=false;
	var field8Found=false;
	var field9Found=false;
	var field10Found=false;
	var field11Found=false;
	var field12Found=false;
	var field13Found=false;
	var field14Found=false;
	var field15Found=false;
	var field16Found=false;
	var field17Found=false;
	var field18Found=false;
	var field19Found=false;
	var field20Found=false;
	for (var e=0;e<form.elements.length;e++){
	    if (form.elements[e].name == 'ddField2' + fieldName){
		    field2Name = form.elements[e].value;
		    field2Found = true;
		}
	    if (form.elements[e].name == 'ddField3' + fieldName){
		    field3Name = form.elements[e].value;
		    field3Found = true;
		}
	    if (form.elements[e].name == 'ddField4' + fieldName){
		    field4Name = form.elements[e].value;
		    field4Found = true;
		}
	    if (form.elements[e].name == 'ddField5' + fieldName){
		    field5Name = form.elements[e].value;
		    field5Found = true;
	    }
	    if (form.elements[e].name == 'ddField6' + fieldName){
		    field6Name = form.elements[e].value;
		    field6Found = true;
	    }
	    if (form.elements[e].name == 'ddField7' + fieldName){
		    field7Name = form.elements[e].value;
		    field7Found = true;
	    }
	    if (form.elements[e].name == 'ddField8' + fieldName){
		    field8Name = form.elements[e].value;
		    field8Found = true;
	    }
	    if (form.elements[e].name == 'ddField9' + fieldName){
		    field9Name = form.elements[e].value;
		    field9Found = true;
	    }
	    if (form.elements[e].name == 'ddField10' + fieldName){
		    field10Name = form.elements[e].value;
		    field10Found = true;
	    }
	    if (form.elements[e].name == 'ddField11' + fieldName){
		    field11Name = form.elements[e].value;
		    field11Found = true;
	    }
	    if (form.elements[e].name == 'ddField12' + fieldName){
		    field12Name = form.elements[e].value;
		    field12Found = true;
		}
	    if (form.elements[e].name == 'ddField13' + fieldName){
		    field13Name = form.elements[e].value;
		    field13Found = true;
		}
	    if (form.elements[e].name == 'ddField14' + fieldName){
		    field14Name = form.elements[e].value;
		    field14Found = true;
		}
	    if (form.elements[e].name == 'ddField15' + fieldName){
		    field15Name = form.elements[e].value;
		    field15Found = true;
	    }
	    if (form.elements[e].name == 'ddField16' + fieldName){
		    field16Name = form.elements[e].value;
		    field16Found = true;
	    }
	    if (form.elements[e].name == 'ddField17' + fieldName){
		    field17Name = form.elements[e].value;
		    field17Found = true;
	    }
	    if (form.elements[e].name == 'ddField18' + fieldName){
		    field18Name = form.elements[e].value;
		    field18Found = true;
	    }
	    if (form.elements[e].name == 'ddField19' + fieldName){
		    field19Name = form.elements[e].value;
		    field19Found = true;
	    }
	    if (form.elements[e].name == 'ddField20' + fieldName){
		    field20Name = form.elements[e].value;
		    field20Found = true;
	    }
	}
	for (var e=0;e<form.elements.length;e++){
	    if (field2Found && form.elements[e].name == field2Name){
		    field2Value = form.elements[e].value;
		}
	    if (field3Found && form.elements[e].name == field3Name){
		    field3Value = form.elements[e].value;
		}
	    if (field4Found && form.elements[e].name == field4Name){
		    field4Value = form.elements[e].value;
		}
	    if (field5Found && form.elements[e].name == field5Name){
		    field5Value = form.elements[e].value;
		}
	    if (field6Found && form.elements[e].name == field6Name){
		    field6Value = form.elements[e].value;
		}
	    if (field7Found && form.elements[e].name == field7Name){
		    field7Value = form.elements[e].value;
		}
	    if (field8Found && form.elements[e].name == field8Name){
		    field8Value = form.elements[e].value;
		}
	    if (field9Found && form.elements[e].name == field9Name){
		    field9Value = form.elements[e].value;
		}
	    if (field10Found && form.elements[e].name == field10Name){
		    field10Value = form.elements[e].value;
		}
	    if (field11Found && form.elements[e].name == field11Name){
		    field11Value = form.elements[e].value;
		}
	    if (field12Found && form.elements[e].name == field12Name){
		    field12Value = form.elements[e].value;
		}
	    if (field13Found && form.elements[e].name == field13Name){
		    field13Value = form.elements[e].value;
		}
	    if (field14Found && form.elements[e].name == field14Name){
		    field14Value = form.elements[e].value;
		}
	    if (field15Found && form.elements[e].name == field15Name){
		    field15Value = form.elements[e].value;
		}
	    if (field16Found && form.elements[e].name == field16Name){
		    field16Value = form.elements[e].value;
		}
	    if (field17Found && form.elements[e].name == field17Name){
		    field17Value = form.elements[e].value;
		}
	    if (field18Found && form.elements[e].name == field18Name){
		    field18Value = form.elements[e].value;
		}
	    if (field19Found && form.elements[e].name == field19Name){
		    field19Value = form.elements[e].value;
		}
	    if (field20Found && form.elements[e].name == field20Name){
		    field20Value = form.elements[e].value;
		}

	}
	var iframeText = '<iframe name="'+fieldName+'_DropDown" id="'+fieldName+'_DropDown" border="0" scrolling="auto" src="'+page+'?DD_STRT_VAL='+escape(strtVal)+'&DD_FIELD_NAME='+escape(fieldName);
	if (field2Found){
	    iframeText +='&DD_FIELD2_NAME='+escape(field2Name);
	    iframeText +='&DD_FIELD2_VALUE='+escape(field2Value);
	}
	if (field3Found){
	    iframeText +='&DD_FIELD3_NAME='+escape(field3Name);
	    iframeText +='&DD_FIELD3_VALUE='+escape(field3Value);
	}
	if (field4Found){
	    iframeText +='&DD_FIELD4_NAME='+escape(field4Name);
	    iframeText +='&DD_FIELD4_VALUE='+escape(field4Value);
	}
	if (field5Found){
	    iframeText +='&DD_FIELD5_NAME='+escape(field5Name);
	    iframeText +='&DD_FIELD5_VALUE='+escape(field5Value);
	}
	if (field6Found){
	    iframeText +='&DD_FIELD6_NAME='+escape(field6Name);
	    iframeText +='&DD_FIELD6_VALUE='+escape(field6Value);
	}
	if (field7Found){
	    iframeText +='&DD_FIELD7_NAME='+escape(field7Name);
	    iframeText +='&DD_FIELD7_VALUE='+escape(field7Value);
	}
	if (field8Found){
	    iframeText +='&DD_FIELD8_NAME='+escape(field8Name);
	    iframeText +='&DD_FIELD8_VALUE='+escape(field8Value);
	}
	if (field9Found){
	    iframeText +='&DD_FIELD9_NAME='+escape(field9Name);
	    iframeText +='&DD_FIELD9_VALUE='+escape(field9Value);
	}
	if (field10Found){
	    iframeText +='&DD_FIELD10_NAME='+escape(field10Name);
	    iframeText +='&DD_FIELD10_VALUE='+escape(field10Value);
	}
	if (field11Found){
	    iframeText +='&DD_FIELD11_NAME='+escape(field11Name);
	    iframeText +='&DD_FIELD11_VALUE='+escape(field11Value);
	}
	if (field12Found){
	    iframeText +='&DD_FIELD12_NAME='+escape(field12Name);
	    iframeText +='&DD_FIELD12_VALUE='+escape(field12Value);
	}
	if (field13Found){
	    iframeText +='&DD_FIELD13_NAME='+escape(field13Name);
	    iframeText +='&DD_FIELD13_VALUE='+escape(field13Value);
	}
	if (field14Found){
	    iframeText +='&DD_FIELD14_NAME='+escape(field14Name);
	    iframeText +='&DD_FIELD14_VALUE='+escape(field14Value);
	}
	if (field15Found){
	    iframeText +='&DD_FIELD15_NAME='+escape(field15Name);
	    iframeText +='&DD_FIELD15_VALUE='+escape(field15Value);
	}
	if (field16Found){
	    iframeText +='&DD_FIELD16_NAME='+escape(field16Name);
	    iframeText +='&DD_FIELD16_VALUE='+escape(field16Value);
	}
	if (field17Found){
	    iframeText +='&DD_FIELD17_NAME='+escape(field17Name);
	    iframeText +='&DD_FIELD17_VALUE='+escape(field17Value);
	}
	if (field18Found){
	    iframeText +='&DD_FIELD18_NAME='+escape(field18Name);
	    iframeText +='&DD_FIELD18_VALUE='+escape(field18Value);
	}
	if (field19Found){
	    iframeText +='&DD_FIELD19_NAME='+escape(field19Name);
	    iframeText +='&DD_FIELD19_VALUE='+escape(field19Value);
	}
	if (field20Found){
	    iframeText +='&DD_FIELD20_NAME='+escape(field20Name);
	    iframeText +='&DD_FIELD20_VALUE='+escape(field20Value);
	}
	iframeText +='&DD_FORM='+form.name+'" onMouseWheel="return(false)" onMouseScroll="return(false)" style="margin:0;padding:0;width:100%;height:100%;" scrolling="no" frameborder="0" marginwidth="0" marginheight="0">Your browser does not support inline frames or is currently configured not to display inline frames.</iframe>';
	if (navigator.platform.toLowerCase().indexOf('mac')>-1){
	  for(i=0;i<rowsout;i++){
	    iframeText += '<br>';
	  }
	}else{
	  for(i=0;i<rowsout;i=i+3){
	    iframeText += '<br>';
	  }
	}
	overlib(iframeText,DELAY,0,STICKY,0,BORDER,0,FIXX,x-3,FIXY,y+h+1,WIDTH,wout,HEIGHT,hout,FGCOLOR,"#ffffff");
  }
} 
//JSD//ENDCODE openDropDown
//JSD///////////////////////////////////////////////////////////////
//JSD Function: openDropDown
//JSD Descr:  Open the layer containing the dynamic dropdown 
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD @param form     (form that contains the field)
//JSD        theObj   (form element)
//JSD        page     (the page that should be run to generate the
//JSD                  data on the dropdown)
//JSD        tall     (the pixel height of the dropdown def=cell height * 22)
//JSD        wide     (the pixel width of the dropdown  def=cell width + 22)
//JSD        autoSubmit     (automatically submits the calling pages form on exact match)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE openDropDown
function openDropMenu(page,tall,wide,id,e){
  var hout = 0;
  var wout = 0;
  var rowsout = 0;
  if (ddOpen){
	ndOff();
    ddOpen = false;
  }else{
    ddOpen = true;
    x = y = 0;
    h = 5;
    w = 5;
	
    e = e || window.event;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    } 
    else {
        var de = document.documentElement;
        var b = document.body;
        x = e.clientX + 
            (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
        y = e.clientY + 
            (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
    }
	
//	x = event.clientX;
//    y = event.clientY;

	h1 = 10;
	if (tall==0){
	  hout = (h1 + 2) * 22;
	}else{
	  hout = tall;
	}
	hout = hout - (hout % h1);
	rowsout = (hout / h1);
	if (wide==0){
	  if (w<95){
	    wout = 115;
	  }else{
	    wout = w + 22;
	  }
	}else{
	  wout = wide;
	}
	var iframeText = '<iframe name="'+id+'_DropDown" id="'+id+'_DropDown" border="0" scrolling="auto" src="'+page+'?DD_STRT_VAL=&DD_FIELD_NAME=';
	iframeText +='&DD_FORM=" onMouseWheel="return(false)" onMouseScroll="return(false)" style="margin:0;padding:0;width:100%;height:100%;" scrolling="no" frameborder="0" marginwidth="0" marginheight="0">Your browser does not support inline frames or is currently configured not to display inline frames.</iframe>';
	if (navigator.platform.toLowerCase().indexOf('mac')>-1){
	  for(i=0;i<rowsout;i++){
	    iframeText += '<br>';
	  }
	}else{
	  for(i=0;i<rowsout;i=i+3){
	    iframeText += '<br>';
	  }
	}
	overlib(iframeText,DELAY,0,STICKY,0,BORDER,0,FIXX,x-3,FIXY,y+h+1,WIDTH,wout,HEIGHT,hout,FGCOLOR,"#ffffff");
  }
} 
//JSD//ENDCODE openDropDown

//JSD//ENDCODE setSession
//JSD///////////////////////////////////////////////////////////////
//JSD Function: setSession
//JSD Descr:  sets a session variable 
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD @param form     (form that contains the field)
//JSD        theObj   (form element)
//JSD        page     (the page that should be run to generate the
//JSD                  data on the dropdown)
//JSD        tall     (the pixel height of the dropdown def=cell height * 22)
//JSD        wide     (the pixel width of the dropdown  def=cell width + 22)
//JSD        autoSubmit     (automatically submits the calling pages form on exact match)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE setSession
function setSession(id,value){
  var hout = 0;
  var wout = 0;
  var rowsout = 0;
  if (ddOpen){
	ndOff();
    ddOpen = false;
  }else{
    ddOpen = true;

	var iframeText = '<iframe name="'+id+'_SetSession" id="'+id+'_SetSession" border="0" scrolling="auto" src="/AP01/setSession.jsp?SS_NAME='+id+'&SS_VALUE='+value;
	iframeText +='" onMouseWheel="return(false)" onMouseScroll="return(false)" style="margin:0;padding:0;width:100%;height:100%;" scrolling="no" frameborder="0" marginwidth="0" marginheight="0">Your browser does not support inline frames or is currently configured not to display inline frames.</iframe>';
	if (navigator.platform.toLowerCase().indexOf('mac')>-1){
	  for(i=0;i<rowsout;i++){
	    iframeText += '<br>';
	  }
	}else{
	  for(i=0;i<rowsout;i=i+3){
	    iframeText += '<br>';
	  }
	}
	overlib(iframeText,DELAY,0,STICKY,0,BORDER,0,FIXX,-20,FIXY,-20,WIDTH,1,HEIGHT,1,FGCOLOR,"#ffffff");
	ndOff();
    ddOpen = false;
  }
} 
//JSD//ENDCODE setSession



//JSD//ENDCODE selectAll
//JSD///////////////////////////////////////////////////////////////
//JSD Function: selectAll
//JSD Descr:  mark all checkbox items begining with a specified name to true 
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD @param form     (form that contains the fields)
//JSD        beginsWith   (String that the element starts with)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE selectAll
function selectAll(form,beginsWith) {

 	for (i = 0; i < form.elements.length; i++) {
  		element = form.elements[i];
		strElementName = " " + element.name;
		if (strElementName.indexOf(beginsWith)>=0){
		    strElementType = " " + element.type;
  		    if (strElementType == " checkbox"){
		       element.checked = true;
		    }
		}
    }
}
//JSD//ENDCODE selectAll

//JSD//ENDCODE deselectAll
//JSD///////////////////////////////////////////////////////////////
//JSD Function: deselectAll
//JSD Descr:  mark all checkbox items begining with a specified name to false 
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return void 
//JSD @param form     (form that contains the fields)
//JSD        beginsWith   (String that the element starts with)
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE deselectAll
function deselectAll(form,beginsWith) {

 	for (i = 0; i < form.elements.length; i++) {
  		element = form.elements[i];
		strElementName = " " + element.name;
		if (strElementName.indexOf(beginsWith)>=0){
		    strElementType = " " + element.type;
  		    if (strElementType == " checkbox"){
		       element.checked = false;
		    }
		}
    }
}
//JSD//ENDCODE deselectAll

//JSD///////////////////////////////////////////////////////////////
//JSD Function: getPageSize
//JSD Descr:  get the width and height of the current browser window
//JSD Author: Todd Hughes
//JSD Creation date: (6/15/2000 1:42:32 PM)
//JSD @return array  (width,height) 
//JSD///////////////////////////////////////////////////////////////
//JSD//BEGINCODE getPageSize
//function getPageSize() {
// if( window.innerHeight && window.scrollMaxY ){ // Firefox 
//   pageWidth = window.innerWidth + window.scrollMaxX;
//   pageHeight = window.innerHeight + window.scrollMaxY;
// }
// else if( document.body.scrollHeight > document.body.offsetHeight ){ // all but Explorer Mac
//   pageWidth = document.body.scrollWidth;
//   pageHeight = document.body.scrollHeight;
// }
// else{ // works in Explorer 6 Strict, Mozilla (not FF) and Safari
//   pageWidth = document.body.offsetWidth + document.body.offsetLeft; pageHeight = document.body.offsetHeight + document.body.offsetTop; 
// }
// arrayPageSizeWithScroll = new Array(pageWidth,pageHeight);     
 //alert( 'The height is ' + pageHeight + ' and the width is ' + pageWidth );
// return arrayPageSizeWithScroll; 
//}
//JSD//ENDCODE getPageSize


