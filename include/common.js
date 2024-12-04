var common_version = "8.1.44";
/*
************************************************
 * common.js
 * For common utility functions
 * Note: Do not put any comments as the starting line
************************************************
*/

//IRV function

function GetIRVValue(val){

	let IRVVal = val.split('|');
	return IRVVal[1];
}


function GetCCCardExist(parameter, string) {
    // Regular expression to match a 16-digit number where the parameter exists in the last 4 digits
    const regex = new RegExp(`\\b\\d{12}${parameter}\\b`);

    // Find all matches in the string
    const matches = string.match(regex);

    // Return the first match found, or null if none found
    return matches ? matches[0] : null;
}





// Check is the value is a URI
function isURIResource(value)
{
    var isURI = false;
    
    if (value.length == 0)
    	return false;
   
   value = value.toLowerCase();
   
   if (value.match("^http://*|^https://*|^file://*|^rtsp://*|^rtsps://*")) 
   		isURI = true;
   else if (value.indexOf(".jsp") != -1)
   		isURI = true;
   else if (value.substring(0,1) == "." || value.substring(0, 2) == "..")
   		isURI = true;

   return isURI;
}

function getGrammarURI(value,isDTMF)
{
    var grammarURI = "";
    
    if (isURIResource(value))
    	grammarURI = encodeURI(value);
    else if (isDTMF == false) //Voice Grammar
    	grammarURI = AppState.GRAMMARFILEDIR + '/' + AppState.APP_ASR_LANGUAGE + '/' + value;
    else //DTMF
    	grammarURI = AppState.GRAMMARFILEDIR + '/DTMF/' + value;
    
    return grammarURI;
}

function getGBuilderGrammarURI(value, isDTMF)
{
	if ( value == undefined || (value.indexOf("/") == -1 && value.indexOf("\\") == -1 ) ) {
		return value;
	}
	
	var	nSlashPos		= -1;
	var strGrammarURI	= "";
	var strGrammarFile	= "";
		
	nSlashPos = value.lastIndexOf( "/" );
	
	strGrammarFile = value.substr( nSlashPos, value.length - nSlashPos - 1 );
	strGrammarFile = strGrammarFile.substr( 0, strGrammarFile.lastIndexOf(".") );
	strGrammarFile += ".grxml";
		
	// pick up the grxml file name from the input value. GRXML files are expected to be in the 
	// "Resources/Grammars/<language> folder only
	strGrammarURI = AppState.GRAMMARFILEDIR + "/" + AppState.APP_ASR_LANGUAGE + "/" + strGrammarFile;
	strGrammarURI = strGrammarURI.replace( "//", "/" );
	
    if ( isDTMF == true ) {
    	strGrammarURI = strGrammarURI.replace( '/' + AppState.APP_LANGUAGE + '/', '/' + "DTMF" + '/');
    }
    
    return strGrammarURI;
}


function getAudioURI(value)
{
    var audioURI = "";
    
    if (isURIResource(value))
    	audioURI = value;
    else
    	audioURI = AppState.VOXFILEDIR + '/' + AppState.APP_LANGUAGE + '/' + value;
    
    return audioURI;
}

function checkIsObject(result) 
{
	if(result instanceof Object){
		return true;
	}
	return false;
}

function getDNIS()
{

	var address = "";
	
	// OCN takes precedence if available
	var ocn = session.connection.redirect[0];
	if (typeof ocn != 'undefined' && ocn != null) {
		address = ocn.uri;
	} 
	
	if (address == "") {
		address = session.connection.local.uri;
	}

	return getUserPart(address);
}

function getANI()
{

	var address = "";
	
	// this header takes precedence if available
	var pai = session.connection.protocol.sip.headers['p-asserted-identity'];
	if (typeof pai != 'undefined' && pai != null) {
		address = pai;
	} 
	
	if (address == "") {
		address = session.connection.remote.uri;
	}

	return getUserPart(address);
}

function getSIPHeaderValue(headerName)
{
	if (typeof session.connection.protocol.sip.headers == 'undefined' || session.connection.protocol.sip.headers == null) {
		return null;
	}
	
	// as per section 2.4 of RFC 5552, the SIP header names are converted to lower case
	var headerNameLC = headerName.toLowerCase();
	
	return session.connection.protocol.sip.headers[headerNameLC];
}

// IVR Recording status
function getIVRRecordingStatus()
{
	if (typeof session.connection.record == 'undefined' || session.connection.record == null) {
		return undefined;
	}
	
	return session.connection.record;
}

function getUserPart(address)
{
	var re = new RegExp("(?:sip|sips|tel):([^@]+)@.*");
	var result = re.exec(address);
	
	// COMPOSER-14243 - Use other approach, P-Asserted-Identity might be 'tel:0-9'
	if (result == null || result.length < 2){
		re =  new RegExp("(?:sip|sips|tel)\:([0-9]+)");
		result = re.exec(address);
	}
	
	if (result == null || result.length < 2){
		return "";
	}
	
	return result[1];

}

// try to convert a string to a number
function toNumber(value) { 
	
	if (typeof value == "number") {
		return value;
	}
	
	if (typeof value == "string") {
		var num = new Number(value);
		
		// test for not-a-number
		if (!isNaN(num)) {
			return num.valueOf();
		} else {
			return value;
		}
	}
	
	// return the original value by default
	return value;
	
}

function resetLanguage() {
    AppState.APP_LANGUAGE = AppState.PREV_APP_LANGUAGE;
    AppState.APP_ASR_LANGUAGE = AppState.PREV_APP_ASR_LANGUAGE;
}

function getCaptureLocation(location, prefix) {
	
	if (location.length == 0) return prefix;
	
	var endChar = location.charAt(location.length - 1);
	if (endChar != '\\' || endChar != '/') {
		location = location + '/';
	}
	
	return location + prefix;
	
}

function br_getLoginRequest(username, password) {
	
	var loginRequest = new Object();
	var loginRequestBody = new Object();
	            
	loginRequestBody.username = username;
	loginRequestBody.password = password;
	            
	loginRequest["login-request"] = loginRequestBody;
	
	return loginRequest;
	
}

function br_getSessionId(loginResponse) {
	
	if (typeof loginResponse == 'undefined' || loginResponse == null ||
		typeof loginResponse['login-response'] == 'undefined' || loginResponse == null ||
		typeof loginResponse['login-response']['sessionid'] == 'undefined' || loginResponse['login-response']['sessionid'] == null) {
		
		return null;
	}
	
	return loginResponse['login-response']['sessionid'];
}

function br_getPackageInfoRequest(sessionid) {
	
	var getPackageInfoRequest = new Object();
	var getPackageInfoRequestBody = new Object();
			       
	getPackageInfoRequestBody.sessionid = sessionid;
	
	getPackageInfoRequest["get-package-info-request"] = getPackageInfoRequestBody;
	
	return getPackageInfoRequest;
}

function br_getLocation(packageInfoResponse) {
	
	if (typeof packageInfoResponse == 'undefined' || packageInfoResponse == null ||
		typeof packageInfoResponse['get-package-info-response'] == 'undefined' || 
		packageInfoResponse['get-package-info-response'] == null || 
		typeof packageInfoResponse['get-package-info-response']['package-info'] == 'undefined' || 
		packageInfoResponse['get-package-info-response']['package-info'] == null || 
		typeof packageInfoResponse['get-package-info-response']['package-info']['location'] == 'undefined' || 
		packageInfoResponse['get-package-info-response']['package-info']['location'] == null)
	{
		return null;
	}
	
	var locationList = 	packageInfoResponse['get-package-info-response']['package-info']['location'];
	if (locationList.length == 0) {
		return null;
	}
	
	if (typeof locationList == 'string') {
		return locationList;
	} else {
		return locationList[0];
	}
}

function br_getLogoutRequest(sessionid) {
	
	var logoutRequest = new Object();
	var logoutRequestBody = new Object();
    
	logoutRequestBody.sessionid = sessionid;
	
	logoutRequest["logout-request"] = logoutRequestBody;
	
	return logoutRequest;
}

function br_initKbRequest() {
	
	var kbRequest = new Object();
	var kbRequestBody = new Object();
	    
	var inOutFacts = new Object();
	var namedFact = new Array();
	    
	inOutFacts['named-fact'] = namedFact;
	kbRequestBody['inOutFacts'] = inOutFacts;
	    
	kbRequest['knowledgebase-request'] = kbRequestBody;
	
	return kbRequest;
}

function br_addFact(kbRequest, fact) {
	
	var fArray = kbRequest['knowledgebase-request']['inOutFacts']['named-fact'];
	fArray.push(fact);
	
}

function br_getResultFacts(result) {
	
	if (typeof result == 'undefined' || result == null ||
		typeof result['knowledgebase-response'] == 'undefined' || result['knowledgebase-response'] == null || 
		typeof result['knowledgebase-response']['inOutFacts'] == 'undefined' || result['knowledgebase-response']['inOutFacts'] == null || 
		typeof result['knowledgebase-response']['inOutFacts']['named-fact'] == 'undefined' || 
		result['knowledgebase-response']['inOutFacts']['named-fact'] == null) {
		
		return null;
	}
	
	return result['knowledgebase-response']['inOutFacts']['named-fact'];
}

function getContextServicesProfileAPIURL() {
	return (typeof _data.context_management_services_url == 'undefined' ? '' : _data.context_management_services_url);
}
function getContextServicesProfileAPIUserName() {
	return (typeof _data.context_management_services_username == 'undefined' ? '' : _data.context_management_services_username);
}
function getContextServicesProfileAPIPassword() {
	return (typeof _data.context_management_services_password == 'undefined' ? '' : _data.context_management_services_password);
}

function getContextServicesServiceAPIURL() {
	return (typeof _data.cs_services_url == 'undefined' ? '' : _data.cs_services_url);
}
function getContextServicesServiceAPITenant() {
	return (typeof _data.cs_ccid == 'undefined' ? '' : _data.cs_ccid);
}
function getContextServicesServiceAPIUserName() {
	return (typeof _data.cs_services_username == 'undefined' ? '' : _data.cs_services_username);
}
function getContextServicesServiceAPIPassword() {
	return (typeof _data.cs_services_password == 'undefined' ? '' : _data.cs_services_password);
}

function getBaseURL() {
	var url = __GetDocumentURL();
	var iPos = url.lastIndexOf("/", url.length);
	return url.substring(0, iPos+1);
}

function getRelativePathURL() {
	var baseURL = getBaseURL();
	var iPos = baseURL.lastIndexOf("//");
	var arr = new Array(3);
	arr[0] = baseURL.substring(0,iPos+2);
	var tempStr  = baseURL.substring(iPos+2,baseURL.length);
	iPos = tempStr.indexOf("/");
	arr[1] = tempStr.substring(0,iPos+1);
	tempStr  = tempStr.substring(iPos+1,tempStr.length);
	iPos = tempStr.indexOf("/");
	arr[2] = tempStr.substring(0,iPos+1);
	return arr.join("");
}

// event/exception handling methods

function resetEvents() {
	_data.system.context.events = [];
	_data.system.context.errors = [];

	_data.system.context.LastErrorEvent = '';
	_data.system.context.LastErrorEventName = '';
	_data.system.context.LastErrorDescription = '';
}

function storeEvent(blockName, event) {
	if (_data.system.context.currentBlock != blockName) resetEvents();
	_data.system.context.currentBlock = blockName;
	_data.system.context.events[_data.system.context.events.length] = event;
}

function storeException(blockName, event) {
	if (_data.system.context.currentBlock != blockName) resetEvents();
	_data.system.context.currentBlock = blockName;
	_data.system.context.errors[_data.system.context.errors.length] = event;
	
	_data.system.context.LastErrorEvent = _event;
	_data.system.context.LastErrorEventName = _event.name;
	_data.system.context.LastErrorDescription = '';
	if (typeof _event.data != 'undefined' && typeof _event.data.description != 'undefined') {
		_data.system.context.LastErrorDescription = _event.data.description;
	}
}

function getLastEvent() {
	return typeof _data.system.context.events == 'undefined' || _data.system.context.events.length == 0
		? undefined : _data.system.context.events[_data.system.context.events.length - 1];
}

function getEvent(eventName) {
	if (typeof eventName == 'undefined') return undefined;
	if (typeof _data.system.context.events == 'undefined' || _data.system.context.events.length == 0) return undefined;
	for (var index = 0; index < _data.system.context.events.length; index++) {
		var evt = _data.system.context.events[index];
		if (evt.name == eventName) return evt;
	}
	return undefined;
}

function getLastEventData(data) {
	var lastEvent = getLastEvent();
	return typeof lastEvent == 'undefined' || typeof lastEvent.data == 'undefined'
		? undefined
		: typeof data == 'undefined' ? lastEvent.data : lastEvent.data[data];
}

function getEventData(eventName, data) {
	var evt = getEvent(eventName);
	return typeof evt == 'undefined' || typeof evt.data == 'undefined'
		? undefined
		: typeof data == 'undefined' ? evt.data : evt.data[data];
}

function getLastException() {
	return typeof _data.system.context.errors == 'undefined' || _data.system.context.errors.length == 0
		? undefined : _data.system.context.errors[_data.system.context.errors.length - 1];
}

function getException(exceptionName) {
	if (typeof exceptionName == 'undefined') return undefined;
	if (typeof _data.system.context.errors == 'undefined' || _data.system.context.errors.length == 0) return undefined;
	for (var index = 0; index < _data.system.context.errors.length; index++) {
		var err = _data.system.context.errors[index];
		if (err.name == exceptionName) return err;
	}
	return undefined;
}

function getLastExceptionData(data) {
	var lastException = getLastException();
	return typeof lastException == 'undefined' || typeof lastException.data == 'undefined'
		? undefined
		: typeof data == 'undefined' ? lastException.data : lastException.data[data];
}

function getExceptionData(exceptionName, data) {
	var err = getException(exceptionName);
	return typeof err == 'undefined' || typeof err.data == 'undefined'
		? undefined
		: typeof data == 'undefined' ? err.data : err.data[data];
}

function storeUnhandledEvent() {
	_data.system.context.uncaughtApplicationEvents[_data.system.context.uncaughtApplicationEvents.length] = _event;
}

function isEventHandledByApplication() {
	return (_data.system.context.uncaughtApplicationEvents.indexOf(_event) == -1);
}

// OPM methods
function getOPMParameters() {
	
	if (typeof _data.OPM_Transaction != 'undefined'){
		return _genesys.session.getListItemValue(_data.OPM_Transaction,'OPM');
	}
	return undefined;
}

function getTenantDBID(gvpSessionID, p)
{
	var key='gvp.rm.tenant-id=';
	if(typeof gvpSessionID != 'undefined'){
	  	var head=gvpSessionID.indexOf(key);
	  	
		var idstring=gvpSessionID.substr(head+key.length, gvpSessionID.length-head-key.length);
		var end = idstring.indexOf('_');
		var tenantstring=idstring.substr(0,end);
		if(tenantstring.lastIndexOf('.')<0);
		
		var temp=tenantstring;
		var temp=tenantstring.substr(tenantstring.lastIndexOf('.')+1);
	
		if(typeof p!=undefined && p<30) return "1";  // Personality ID <30, use environment/admin level voice files
		return temp;
	}
	return "1";
	
}

//OCS methods
function getSeconds(time/*pattern: HH:mm*/) {
	var strs = time.split(':');
	if (strs.length != 2) return null;
	if (isNaN(strs[0]) || isNaN(strs[1])) return null;
	return (strs[0] * 3600) + (strs[1] * 60);
}

//toISOString is not implemented in ORS 8.1.2 
if (!Date.prototype.toISOString) {
	Date.prototype.toISOString = function() {
		function pad10(n) {
			return n < 10 ? '0' + n : n
		}
		function pad100(n) {
			return n < 10 ? '00' + n : (n < 100 ? '0' + n : n)
		}
		return this.getUTCFullYear() + '-'
			+ pad10(this.getUTCMonth() + 1) + '-'
			+ pad10(this.getUTCDate()) + 'T'
			+ pad10(this.getUTCHours()) + ':'
			+ pad10(this.getUTCMinutes()) + ':'
			+ pad10(this.getUTCSeconds()) + '.'
			+ pad100(this.getUTCMilliseconds()) + 'Z';
	};
}
//parse does not support ISO dates in ORS 8.1.2.
//so adding this for convenience
if (!Date.fromISOString) {
	Date.fromISOString = function(q) {
		var reg = new RegExp("^[0-9]{4}-(1[0-2]|0[1-9])-(3[0-1]|0[1-9]|[1-2][0-9])T(2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9].[0-9]{3}Z$", "g");
		if (!reg.test(q)) {
			throw ("Invalid format for UTC timestamp : " + q)
		}
		return new Date(Date.UTC(Number(q.substring(0, 4)),
								Number(q.substring(5, 7)) - 1,
								Number(q.substring(8, 10)),
								Number(q.substring(11, 13)),
								Number(q.substring(14, 16)),
								Number(q.substring(17, 19))));
	};
}

//Returns the name of the view that the interaction was pulled from.
function getInteractionView() {
	var ixnId = _data.system.context.InteractionID;
	if (typeof ixnId == 'undefined' || typeof _genesys.ixn.interactions[ixnId] == 'undefined') {
		return null;
	}
	// first priority is msgbased, and if that doesn't exist, fall back to xdata.
	if (typeof _genesys.ixn.interactions[ixnId].msgbased != 'undefined' && 
				typeof _genesys.ixn.interactions[ixnId].msgbased.view != 'undefined') {
		return _genesys.ixn.interactions[ixnId].msgbased.view;
	} else if (typeof _genesys.ixn.interactions[ixnId].xdata != 'undefined' && 
			   typeof _genesys.ixn.interactions[ixnId].xdata.ixn_queue_view != 'undefined') {
		return _genesys.ixn.interactions[ixnId].xdata.ixn_queue_view;
	} else {
		return null;
	}
}

// implements view segmentation
// Returns true if the interaction's view matches the given viewName.
function transitionOnView(viewName) {
	var ixnView = getInteractionView();
	if (ixnView != null) {
		return viewName == ixnView;
	}
	return false;
}

function decodeBinary(hexArray) {
	if (typeof hexArray == 'undefined') throw "decodeBinary: undefined array parameter";
	if (!Array.isArray(hexArray)) throw "decodeBinary: not an array parameter";
	var result = "";
    for (var index = 0; index < hexArray.length; index++) {
		var hex = hexArray[index];
		if (hex == 0) break;		//string terminator
		if (isNaN(hex)) throw "decodeBinary: not a number at index:" + index;
		result += String.fromCharCode(hex);
	}
	return result;
}

// Returns the name of the view that the interaction was pulled from.
function getInteractionView() {
	var ixnId = _data.system.context.InteractionID;
	if (typeof ixnId == 'undefined' || typeof _genesys.ixn.interactions[ixnId] == 'undefined') {
		return null;
	}
	// first priority is msgbased, and if that doesn't exist, fall back to xdata.
	if (typeof _genesys.ixn.interactions[ixnId].msgbased != 'undefined' && 
		typeof _genesys.ixn.interactions[ixnId].msgbased.view != 'undefined') {
		
		return _genesys.ixn.interactions[ixnId].msgbased.view;
	} else if (typeof _genesys.ixn.interactions[ixnId].xdata != 'undefined' && 
			   typeof _genesys.ixn.interactions[ixnId].xdata.ixn_queue_view != 'undefined') {
		return _genesys.ixn.interactions[ixnId].xdata.ixn_queue_view;
	} else {
		return null;
	}
}


// implements view segmentation
// Returns true if the interaction's view matches the given viewName.
function transitionOnView(viewName) {
	var ixnView = getInteractionView();
	if (ixnView != null) {
		return viewName == ixnView;
	}
	return false;
}

function generateComposerTrtRequestID() {
	return Math.random().toString().substring(2,7);
}

function setNxtTreatmentBlockName(blockName){
	_data.gvpNxtTreatmentBlockName = blockName;			
}

function clearNxtTreatmentBlockName(){
	_data.gvpNxtTreatmentBlockName = undefined;			
}

function isGVPTreatmentPending(){
	if(_data.gvpNxtTreatmentBlockName==undefined){
		return false;
	}
	return true;
}

function extractVxmlHttpErrorCode(httpErrorEvent) {
	var prefix = "error.badfetch.http.";
	var https_prefix = "error.badfetch.https.";
	if (httpErrorEvent.indexOf(prefix) === 0) {
		return httpErrorEvent.substring(prefix.length);
	} else if (httpErrorEvent.indexOf(https_prefix) === 0) {
		return httpErrorEvent.substring(https_prefix.length);
	} else {
		return undefined;
	}
}
//AppState.varCaptureDT+''+AppState.varHr+''+AppState.varMin+''+AppState.varSec
function LocalTrnxTime(varcaptdt,varhr,varmin,varsec)
{	var result = '';
	if ((String(varhr).length) == 1)
	{
		varhr  = '0' + ''+varhr ;
	}
	if ((String(varmin).length) == 1)
	{
		varmin  = '0' + ''+varmin ;
	}
	if ((String(varsec).length) == 1)
	{
		varsec  = '0' + ''+varsec ;
	}
	 result = varcaptdt+''+varhr+''+varmin+''+varsec;
	return result;
}


function ParsePvtData(varPvtfield)
{
		var result ='';
		var inp = varPvtfield;
		var splitArr = inp.split('|')
		if (splitArr.length == 2)
		{
			result = '0';
		}
		else if ((splitArr.length) >= 6)
		{
			result = splitArr[5];
		}
		else
		{
			result = '0';
		}
	return result;
}		


function GetTPinPrompts(varActCode)
{
		var result ='';
		var inp = varActCode;
		switch(inp)
		{
		case '111': result ='COR.AUTH.ERROR.111.wav';
			   break;
		case '112': result ='COR.AUTH.ERROR.112.wav';
			   break;
		case '113': result ='COR.AUTH.ERROR.113.wav';
			   break;
		case '114': result ='COR.AUTH.ERROR.114.wav';
			   break;
		case '115': result ='COR.AUTH.ERROR.115.wav';
			   break;
		case '907': result ='COR.BANK.ERROR.907.wav';
			   break;
		case '909': result ='COR.BANK.ERROR.909.wav';
			   break;
		case '902': result ='COR.BANK.ERROR.902.wav';
			   break;
		case '904': result ='COR.BANK.ERROR.904.wav';
			   break;
		case '906': result ='COR.BANK.ERROR.906.wav';
			   break;
		case '911': result ='COR.BANK.ERROR.911.wav';
			   break;
		case '913': result ='COR.BANK.ERROR.913.wav';
			   break;
		case 'default':result ='COR.AUTH.ERROR.112.wav';
		}
		return result;
}



function GetChangePinCRN(varCRNNew)
{
	var result ='';
	var inp = varCRNNew;
	if (inp.length==11)
	{
		result = '00000000'+''+varCRNNew;
	}
	else
	{
		result = '000000000'+''+varCRNNew;
	}
	return inp;
}


function GetErrorPrompts(varActCode)
{
		var result ='';
		var inp = varActCode;
		switch(inp)
		{
		case '183': result ='COR.BANK.ERROR.183.wav';
			   break;
		case '119': result ='COR.BANK.ERROR.119.wav';
			   break;
		case '1MD': result = 'COR.INVALID.ENTRY.wav';
			    break;
		case '1GT': result= 'COR.TM03.01.00.wav';	
			    break;
		case '16M': result= 'COR.TM03.02.01.wav';	
			    break;
		case 'default':result ='COR.BANK.ERROR.907.wav';
		}
		return result;
}


function SelectFDPrompt(varActCode)
{
		var result ='';
		var inp = varActCode;
		switch(inp)
		{
		case '813': result ='BENNOTREG.wav';
			   break;
		case '811': result ='DEBINOTREG.wav';
			   break;
		case '805': result ='FACNOTEN.wav';
			   break;
		case '116': result ='INSUFBAL.wav';
			   break;
		case '800': result ='DETNOTUP.wav';
			   break;
		case '801': result ='DETNOTUP.wav';
			   break;
		case '809': result ='FACNOTACT.wav';
			   break;
		case 'default':result ='COR.BANK.ERROR.907.wav';
		}
		return result;
}



function ValidateStartDate(stdate)
{
	var result = 'False';

	if (stdate.length == 6)
	{
	 var day = stdate.slice(0,2);
	 var month = stdate.slice(2,4)
	 var year =stdate.slice(4,6);
	//concat year

	 year = '20' + '' + year;
	
	//check month
		if (month >= 1 & month <= 12)
         	 {
            		month = month - 1;
          		if (day >=1 & day <=31)
			{
					var currdate = new Date(year,month,day)
					var d1  = new Date();
					if (currdate < d1)
					{ 
						// calculate difference in days
						var days = (d1.getTime() - currdate.getTime())/(1000*60*60*24);
						days = Math.floor(days);
						if (days > 180)
						{
							result = '16M';
							// start date cannot be old than 6 months
						}
						else
						{
					 	 result ='000';
					  	
						
						}
					}	
					else
					{	//start date greater than today
						result ='1GT';
					}
		
			}
			else
			{
			  result ='1MD';
			  //return result;
			 
			}
          	
          	
          	
          	}
              	
          	
        	else
        	{ 
			result = '1MD';
			
			
		
		}
		

		

	 }
	else
	{
           result='1MD'; 		
	// date. lenght > 6
	}
 return result;

}
//yyyymmdd
function FormatDate(vardate)
{
	var result = "";
	var year = vardate.slice(0,4);
	//year = '20'+ ''+ year;
//dd-mm-yyyy
	result = vardate.slice(6,8) + ''+ '-'+vardate.slice(4,6)+ '-'  +''+year;
	return result;

}
function FormatSEDate(vardate)
{
//ddmmyy
	var result = "";
	var year = vardate.slice(4,6);
	year = '20'+ ''+ year;
//dd-mm-yyyy
	result = vardate.slice(0,2) + ''+ '-'+vardate.slice(2,4)+ '-'  +''+year;
	return result;

}


function LocalTime(varhr,varmin,varsec)
{	var result = '';
	if ((String(varhr).length) == 1)
	{
		varhr  = '0' + ''+varhr ;
	}
	if ((String(varmin).length) == 1)
	{
		varmin  = '0' + ''+varmin ;
	}
	if ((String(varsec).length) == 1)
	{
		varsec  = '0' + ''+varsec ;
	}
	 result = varhr+''+varmin+''+varsec;
	return result;
}



function ValidateEndDate(stStartdate,stEnddate)

{
	var result = 'False';
	var eday = stEnddate.slice(0,2);
	var emonth = stEnddate.slice(2,4)
	var eyear =stEnddate.slice(4,6);
	var day = stStartdate.slice(0,2);
	var month = stStartdate.slice(2,4)
	var year =stStartdate.slice(4,6);
	
	eyear = '20' + '' + eyear;
	year = '20' + '' + year;
	 
	if (emonth >= 1 & emonth <= 12)
	{
	 	emonth = emonth - 1;
	 	month = month - 1;
	  	if (eday >=1 & eday <=31)
		{
		
			var edate = new Date(eyear,emonth,eday)
			var sdate = new Date(year,month,day)
			//current date
			var d1  = new Date(); 
			//checkenddate is greater than current date
			if (edate > d1)
			{
			result = 'False'
						
			}
			else if( edate < sdate)
			{
			result = 'False'
			}
			else
			{
			result = '000';
			}
		}	
			
		else
		{ 
		// invalide day.
		result = 'False';
		}		   
				
	}
	else
	{ 
	// invalide month
	result = 'False';
	}	
	
	return result;
}

function GetCrDb(varBal)
{
	var result ='';
	if (varBal == '')
	{
	result = '';
	} 
	else
	var inp = varBal;
	if (inp.slice(0,1)=='+')
	{
		result = 'COR.CREDIT.wav';
	}
	else
	{
		result = 'COR.DEBIT.wav';
	}
	
	return result;
}


function GetAgentTrav(strmenu)
{
	var result='';
	var inp = strmenu;
			switch(inp)
			{
			//current acc
			case '1': result ='161;';
				   break;
			case '2': result ='162;';
				   break;
			case '3': result ='163;';
				   break;
			case '4': result ='164;';
				   break;
			case '5': result ='165;';
				   break;
			case 'default':result ='161;';
			}
		return result;
}


function GetDate()
{
var dt = new Date();

var day = dt.getDate();
var month = dt.getMonth()+1;
var year =dt.getFullYear();
if (String(day).length == 1)
{
day = '0'+''+day;
}
if  (String(month).length == 1)
{
month= '0'+''+month;
}


return day+''+'-'+''+month+''+'-'+year;


}


function GetExpDateDate(fcrm)
{
if (fcrm != '')
 {
var arr = new Array();
arr[0]= fcrm.slice(0,12);
arr[1]= fcrm.slice(21,24);
arr[2]=fcrm.slice(38,42);
arr[3]=fcrm.slice(42,62);
arr[4]=fcrm.slice(62,82);
return arr;
}
else
return '';

}


function ValidateNum(varNwAcNum,varArrAcNum)
{ 
    for(var i=0; i<varArrAcNum.length; i++) 
    { 
        //if (varArrAcNum[i] == varNwAcNum)
        if (varArrAcNum.indexOf(varNwAcNum) != -1)
                return '0'; 
       else
        return '1';
    }
}

function GetSegment(varCorpPriority)
{
	var result = 'NORMAL';


	if (varCorpPriority.slice(0,1) == '1')
	{
		result = "ELITE";
	}
	
	return result;
}


function getGreet()
{
  var currentTime = new Date();
  var Result;
    if (currentTime.getHours() < 12)
    
        Result = 'GOODMORNING.wav' ;       
        else if (currentTime.getHours() < 17)
        Result = 'GOODAFTER.wav' ;
    else Result = 'GOODEVE.wav' ;
    return Result;
}



function getICICIDirectGreet()
{
  var currentTime = new Date();
  var Result;
    if (currentTime.getHours() < 12)
    
        Result = 'GMIciciDirectcom.wav' ;       
        else if (currentTime.getHours() < 17)
        Result = 'GAIciciDirectcom.wav' ;
    else Result = 'GEIciciDirectcom.wav' ;
    return Result;
}

function getDCCrmString(actcode,lang,travstring,name,cardnum,crn,cli)
{
var result ='UUI=';
//var result = "aaa";
//var accnum = "015101573832";
//var actcode = "000";
//var lang='E'
//var travstring='AZAYZZ';
//var name='PARUL Batra';
//var cardnum='123456789012345';
//var crn='1234567891';
	if (crn != null)
	{

		if (crn.length == 12)
		{
		result = result + crn+'        ';
		}
		else
		{
		result = result + '                    ';
		}

        }
        else
        {
           result = result + '                    ';
        }
	if (actcode != null)
	{
		if (actcode.length == 3)
		{
			result = result + 'A'+''+actcode+''+lang+' ';
		}
			else
		{
			result = result+''+'A104'+''+lang+' ';
		}

	}
	else
	{
	 result = result+''+'A104'+''+lang+' ';
	}

	if(travstring != null)
	{
	if (travstring.length <= 16)
		   {
		     var numspace = 16-travstring.length;
		     result = result + ''+ travstring;
		      	for (var i=0;i<numspace;i++)
		       	{
		        	 result = result + ' ';

		  	}
		  }

		 else if(travstring.length > 16)
		  {
		    result = result + ''+ travstring.slice(0,15);
		  }
		 else
		  {
		       for (var i=0;i<16;i++)
		         {
		          result = result + ' ';
		         }
		 }
	 }
	 else
	 {
	 		for (var i=0;i<16;i++)
	 		         {
	 		          result = result + ' ';
		         }
	 }

	 if (name != null)
	{

	 			if (name.length <=20)
	 	 	 	{
	 	 	 	var numspace =20-name.length
	 	 	  	result = result + ''+ name;
	 	 	    	for (var i=0;i<numspace;i++)
	 	 	           {
	 	 	            result = result + ' ';
	 	 	           }

	 	 	 	}
	 	 	 	else if(name.length > 20)
	 	 	 	{
	 	 	 	result = result + ''+ name.slice(0,20);


	 	 	 	}
	 	 	 	else
	 	 	 	{
	 	 	 		for (var i=0;i<20;i++)
	 	 	           	{
	 	 	           	 result = result + ' ';
	 	 	           	}

	 	 		}




	 	}
	 	else
	 	{
	 	      for (var i=0;i<20;i++)
			{
			   result = result + ' ';
			}
	 	}

	 	if (cardnum != null)
	 	{
	 		if (cardnum.length == 16)

	 	 	{

	 	 			result = result + ''+ cardnum;


	 	 			}
	 	 			else
	 	 			{
	 	 			for (var i=0;i<16;i++)
	 	 		          {
	 	 		           result = result + ' ';
	 	 		          }

	 	 			}

	 	}
	 	else
	 	{
			for (var i=0;i<16;i++)
			{
			   result = result + ' ';
			}

	 	}
	 	if (cli != null)
	 	{
	 		if (cli.length <= 13)
	 			{
	 			var numspace =13-cli.length;
	 			//numspace = 29-13+numspace;
	 			result = result + ''+ cli;
	 			for (var i=0;i<numspace;i++)
	 		          {
	 		           result = result + ' ';
	 		          }

	 			}
	 			else
	 			{
	 			for (var i=0;i<13;i++)
	 		          {
	 		           result = result + ' ';
	 		          }

	 			}

		}
		else
		{
			for (var i=0;i<13;i++)
			{
      			result = result + ' ';

			}


		}

	return result;

}



function getCrmString(actcode,lang,travstring,name,cardnum,crn,cli)
{
var result ='UUI=';
//var result = "aaa";
//var accnum = "015101573832";
//var actcode = "000";
//var lang='E'
//var travstring='AZAYZZ';
//var name='PARUL Batra';
//var cardnum='123456789012345';
//var crn='1234567891';
	if (crn != null)
	{
		if (crn.length == 11)
		{
		result = result + crn+'         ';
		} 
		else
		{
		result = result + '                    ';
		}
        
        }
        else
        {
           result = result + '                    ';
        }
	if (actcode != null)
	{
		if (actcode.length == 3)
		{
			result = result + 'D'+''+actcode+''+lang+' ';
		}
			else
		{
			result = result+''+'D104'+''+lang+' ';
		}

	}
	else
	{
	 result = result+''+'D104'+''+lang+' ';
	}
	
	if(travstring != null)
	{
	if (travstring.length <= 16)
		   {
		     var numspace = 16-travstring.length;
		     result = result + ''+ travstring;
		      	for (var i=0;i<numspace;i++)
		       	{
		        	 result = result + ' ';
		          	
		  	}
		  }
		 	
		 else if(travstring.length > 16)
		  {
		    result = result + ''+ travstring.slice(0,15);
		  }
		 else
		  { 
		       for (var i=0;i<16;i++)
		         {
		          result = result + ' ';
		         }
		 }
	 }
	 else
	 {
	 		for (var i=0;i<16;i++)
	 		         {
	 		          result = result + ' ';
		         }
	 }
	 
	 if (name != null)
	{
	 
	 			if (name.length <=20)
	 	 	 	{
	 	 	 	var numspace =20-name.length
	 	 	  	result = result + ''+ name;
	 	 	    	for (var i=0;i<numspace;i++)
	 	 	           {
	 	 	            result = result + ' ';
	 	 	           }
	 	 	 
	 	 	 	}
	 	 	 	else if(name.length > 20)
	 	 	 	{
	 	 	 	result = result + ''+ travstring.slice(0,20);
	 	 	 
	 	 	 
	 	 	 	}
	 	 	 	else
	 	 	 	{
	 	 	 		for (var i=0;i<20;i++)
	 	 	           	{
	 	 	           	 result = result + ' ';
	 	 	           	}
	 	 	 
	 	 		}
	 	 		
	 	 		
	 
	 
	 	}
	 	else
	 	{
	 	      for (var i=0;i<20;i++)
			{
			   result = result + ' ';
			}
	 	}
	 	
	 	if (cardnum != null)
	 	{
	 		if (cardnum.length == 16)
	 	 	
	 	 	{
	 	 			
	 	 			result = result + ''+ cardnum;
	 	 			
	 	 		
	 	 			}
	 	 			else
	 	 			{
	 	 			for (var i=0;i<16;i++)
	 	 		          {
	 	 		           result = result + ' ';
	 	 		          }
	 	 		
	 	 			}
	 		
	 	}
	 	else
	 	{
			for (var i=0;i<16;i++)
			{
			   result = result + ' ';
			}
	 	
	 	}
	 	if (cli != null)
	 	{
	 		if (cli.length <= 13)
	 			{
	 			var numspace =13-cli.length;
	 			//numspace = 29-13+numspace;
	 			result = result + ''+ cli;
	 			for (var i=0;i<numspace;i++)
	 		          {
	 		           result = result + ' ';
	 		          }
	 		
	 			}
	 			else
	 			{
	 			for (var i=0;i<13;i++)
	 		          {
	 		           result = result + ' ';
	 		          }
	 		
	 			}
	 	
		}
		else
		{
			for (var i=0;i<13;i++)
			{
      			result = result + ' ';
				 		          
			}
	 	
		
		}
	 	
	return result;

}



function getDematCrmString(actcode,lang,travstring,name,cardnum,DematAccNo,cli)
{
var result ='UUI=';
//var result = "aaa";
//var accnum = "015101573832";
//var actcode = "000";
//var lang='E'
//var travstring='AZAYZZ';
//var name='PARUL Batra';
//var cardnum='123456789012345';
//var crn='1234567891';
	if (DematAccNo != null)
	{
		if (DematAccNo.length == 16)
		{
		result = result + DematAccNo+'    ';
		} 
		else
		{
		result = result + '                    ';
		}
        
        }
        else
        {
           result = result + '                    ';
        }
	if (actcode != null)
	{
		if (actcode.length == 3)
		{
			result = result + ' '+''+actcode+''+lang+' ';
		}
			else
		{
			result = result+''+' 104'+''+lang+' ';
		}

	}
	else
	{
	 result = result+''+' 104'+''+lang+' ';
	}
	
	if(travstring != null)
	{
	if (travstring.length <= 16)
		   {
		     var numspace = 16-travstring.length;
		     result = result + ''+ travstring;
		      	for (var i=0;i<numspace;i++)
		       	{
		        	 result = result + ' ';
		          	
		  	}
		  }
		 	
		 else if(travstring.length > 16)
		  {
		    result = result + ''+ travstring.slice(0,15);
		  }
		 else
		  { 
		       for (var i=0;i<16;i++)
		         {
		          result = result + ' ';
		         }
		 }
	 }
	 else
	 {
	 		for (var i=0;i<16;i++)
	 		 {
	 		          result = result + ' ';
		         }
	 }
	 
	 result = result + '                    ';
	 
//	 if (name != null)
//	{
//	 
//	 			if (name.length <=20)
//	 	 	 	{
//	 	 	 	var numspace =20-name.length
//	 	 	  	result = result + ''+ name;
//	 	 	    	for (var i=0;i<numspace;i++)
//	 	 	           {
//	 	 	            result = result + ' ';
//	 	 	           }
//	 	 	 
//	 	 	 	}
//	 	 	 	else if(name.length > 20)
//	 	 	 	{
//	 	 	 	result = result + ''+ travstring.slice(0,20);
//	 	 	 
//	 	 	 
//	 	 	 	}
//	 	 	 	else
//	 	 	 	{
//	 	 	 		for (var i=0;i<20;i++)
//	 	 	           	{
//	 	 	           	 result = result + ' ';
//	 	 	           	}
//	 	 	 
//	 	 		}
//	 	 		
//	 	 		
//	 }
//	 	else
//	 	{
//	 	      for (var i=0;i<20;i++)
//			{
//			   result = result + ' ';
//			}
//	 	}
	 	
	 	if (DematAccNo != null)
	 	{
	 		if (DematAccNo.length == 16)
	 	 	
	 	 	{
	 	 			
	 	 			result = result + ''+ DematAccNo;
	 	 			
	 	 			}
	 	 			else
	 	 			{
	 	 			for (var i=0;i<16;i++)
	 	 		          {
	 	 		           result = result + ' ';
	 	 		          }
	 	 		
	 	 			}
	 		
	 	}
	 	else
	 	{
			for (var i=0;i<16;i++)
			{
			   result = result + ' ';
			}
	 	
	 	}
	 	if (cli != null)
	 	{
	 		if (cli.length <= 13)
	 			{
	 			var numspace =13-cli.length;
	 			//numspace = 29-13+numspace;
	 			result = result + ''+ cli;
	 			for (var i=0;i<numspace;i++)
	 		          {
	 		           result = result + ' ';
	 		          }
	 		
	 			}
	 			else
	 			{
	 			for (var i=0;i<13;i++)
	 		          {
	 		           result = result + ' ';
	 		          }
	 		
	 			}
	 	
		}
		else
		{
			for (var i=0;i<13;i++)
			{
      			result = result + ' ';
				 		          
			}
	 	
		
		}
	 	
	return result;

}



function GetLangFlag(varlang)
	{
	 var result = 'E';
		if (varlang == 'en-IN')
		{
			result ='E';
		}
		else if (varlang == 'mr-IN')
		{
			result ='M';
		}
		else if (varlang == 'ta-IN')
		{
			result ='T';
		}
		else if (varlang == 'hi-IN')
		{
			result ='H';
		}
		
		return result;

	}
	
	
		function GetTransFlag(varActCode)
		{
			var result = 'Y';
			if (varActCode == '000' || varActCode == '00'|| varActCode == '0'|| varActCode == '130' || varActCode == '108'|| varActCode == '109' || varActCode == '104' || varActCode == '100' || varActCode == '800' || varActCode == '113' || varActCode == '117')
			{
				result ='Y';
			}
			else
			{
			 result = 'N';
			}
			return result;
	
		}
		
		
		
		
		
		
		
		function getApinCrmString(accnum,actcode,lang,travstring,expdt,name,cardnum,cli)
		{
		var result ='UUI=';
		//var result = "aaa";
		//var accnum = "015101573832";
		//var actcode = "000";
		//var lang='E'
		//var travstring='AZAYZZ';
		//var name='PARUL Batra';
		//var cardnum='123456789012345';
		//var crn='1234567891';
		
			if (accnum.length == 12)
			{
			result = result + accnum +'        ';
			} 
			else
			{
			//12 spaces
			result = result + '                    ';
			}
			
			
			if (actcode.length == 3)
			{
				result = result + 'A'+''+actcode+''+lang+' ';
			}
				else
			{
				result = result+''+'A104'+''+lang+' ';
			}
			
			
			
			if (travstring.length <= 12)
				   {
				     var numspace = 12-travstring.length;
				     result = result + ''+ travstring;
				      	for (var i=0;i<numspace;i++)
				       	{
				        	 result = result + ' ';
				          	
				  	}
				  }
				 	
				 else if(travstring.length > 12)
				  {
				    result = result + ''+ travstring.slice(0,11);
				  }
				 else
				  { 
				       for (var i=0;i<12;i++)
				         {
				          result = result + ' ';
				         }
				 }
			 
			 //Expiry date string.....
			if (expdt != null)				
			{
			 if (expdt.length == 4)
		 	{
			
			  	result = result + ''+ expdt;
			 			    
		          
		 	}
		 	else 
		 	{
		 	
			  	result = result + '    ';
		 
		 	}
			}
			else
			{
		 	
			  	result = result + '    ';
		 
		 	} 
		 				 	
			 
			 	if (name.length <=20)
			 	{
			 	var numspace =20-name.length
			  	result = result + ''+ name;
			    	for (var i=0;i<numspace;i++)
			           {
			            result = result + ' ';
			           }
			 
			 	}
			 	else if(name.length > 20)
			 	{
			 	result = result + ''+ name.slice(0,20);
			 
			 
			 	}
			 	else
			 	{
			 		for (var i=0;i<20;i++)
			           	{
			           	 result = result + ' ';
			           	}
			 
				}
				
					
				
			if (cardnum.length == 16)
			{
			
			result = result + ''+ cardnum;
			
		
			}
			else
			{
			for (var i=0;i<16;i++)
		          {
		           result = result + ' ';
		          }
		
			}
		
			if (cli.length <= 13)
			{
			var numspace =13-cli.length;
			//numspace = 29-13+numspace;
			result = result + ''+ cli;
			for (var i=0;i<numspace;i++)
		          {
		           result = result + ' ';
		          }
		
			}
			else
			{
			for (var i=0;i<13;i++)
		          {
		           result = result + ' ';
		          }
		
			}
				
			
		
			return result;
		
		}
		
		


	function GetMobileRequestString(varAccNum,varMobNum)
		{
			var result = '21AU'+'';

			

			result = result + varAccNum +'' +'F0115000'+'     ';

			result = result +''+'0'+ varMobNum+'';
			for (var i=0;i<40;i++)
			{
			          result = result + ' ';
			}
			
			result = result + ''+ 'AAAAN';
			result = result + ''+ 'F0012000'+''+'     ';
			result = result +''+'0'+ varMobNum+'';
			for (var i=0;i<40;i++)
			{
			          result = result + ' ';
			}
			result = result + ''+ 'AAAAN';

			result = result + ''+ 'F0023000'+''+'     ';
			result = result +''+'0'+ varMobNum+'';
			for (var i=0;i<40;i++)
			{
			          result = result + ' ';
			}
			result = result + ''+ 'AAAAN';
			result = result + ''+ 'F0125000'+''+'     ';
			result = result +''+'0'+ varMobNum+'';
			for (var i=0;i<40;i++)
			{
			          result = result + ' ';
			}

				//8-spaces.
			result = result + ''+ 'AAAAN';
			result = result + ''+ 'F0130'+''+'        ';
			result = result +''+'0'+ varMobNum+'';
			for (var i=0;i<40;i++)
			{
			          result = result + ' ';
			}
			result = result + ''+ 'AAAAN';

			//6spaces
			result = result + ''+ 'F015500'+''+'      ';
			result = result +''+'0'+ varMobNum+'';
			for (var i=0;i<40;i++)
			{
			          result = result + ' ';
			}
			result = result + ''+ 'AAAAN';

				//8-spaces
			result = result + ''+ 'F0510'+''+'        ';
			result = result +''+'0'+ varMobNum+'';
			for (var i=0;i<40;i++)
			{
			          result = result + ' ';
			}
			result = result + ''+ 'AAAAN';

			result = result + ''+ 'F0520'+''+'        ';
			result = result +''+'0'+ varMobNum+'';
			for (var i=0;i<40;i++)
			{
			          result = result + ' ';
			}
			result = result + ''+ 'AAAAN';



			return result;
	
		}


	function lastmenuid(varTrav)
	{
		var val,val1,res;
		val = varTrav.lastIndexOf (";");
		val1 = varTrav.lastIndexOf (";" , val - 1);
		res = varTrav.substring( val1 + 1 , val);

		return res;
	}



	function GetChkStatusPrompts(varStatus)
	{
	
		var result='';
	
			switch(varStatus)
			{
			//current acc
			case 'C': result ='COR.CHEQUE.STATUS.C.wav';
				   break;
			case 'D': result ='COR.CHEQUE.STATUS.D.wav';
				   break;
			case 'P': result ='COR.CHEQUE.STATUS.P.wav';
				   break;
			case 'R': result ='COR.CHEQUE.STATUS.R.wav';
				   break;
			case 'I': result ='COR.CHEQUE.STATUS.I.wav';
				   break;
			case 'S': result ='COR.CHEQUE.STATUS.S.wav';
				   break;
			case 'U': result ='COR.CHEQUE.STATUS.U.wav';
				   break;
			
			case 'default':result ='COR.INVALID.ENTRY.wav';
			}
		return result;
		


	}
	
	function GetTravBal(varAuthNum)
		{
			var result = '';
			if (varAuthNum == 'CRN')
			{
				result = '1131;';
			}
			else if(varAuthNum == 'DEBIT')
			{
				result = '1121;';
			}
			else
			{
				result = '';
			}
			
			return result;
	}

	function GetRegion(varCorpPriority)
	{
		var result = varCorpPriority.substr((varCorpPriority.indexOf("|")+1),1);
		if ((result == '') ||( result == '1' ))
			result = 'Z';
		else 
			result = result;
		return result;
	}

	function ChkExpDate(varCardExpDate)
	{
		var result='';
		if (varCardExpDate != '' || varCardExpDate != null)
		{	
			result = varCardExpDate.slice(3,5) + '' + varCardExpDate.slice(8,10);
		}
	return result;
	}
	
	function RetAccNumber(varAccNumber)
	{
	
	var result = 0;
	try
	{
	 if (varAccNumber == null)
	 {
	   result = 0;
	 }
	  else
	  {
		result = varAccNumber.slice(0, 12);
	 }
	 }
	catch(err)
	{
	 result = 0;
	}
	return result;
	}


function GetAgentTraversal(strmenu)
{
	var result='';
	var inp = strmenu;
			switch(inp)
			{
			//current acc
			case '1': result ='Current Account;';
				   break;
			case '2': result ='Cash Management Services;';
				   break;
			case '3': result ='Trade Services;';
				   break;
			case '4': result ='Bank At Home;';
				   break;
			case '5': result ='Agri Business Services;';
				   break;
			case 'default':result ='Current Account;';
			}
		return result;
}

function GetMenuID(varBalSource)
{
	var result='';
	if (varBalSource == 'DEBIT')
	{
	result = '1121';
	}
	else
	{
	result = '1131';
	}
	return result;


}



function GetRegionalLang(varDNIS)
{
	var result='';

	switch(varDNIS)
	{
				//current acc
	case '6102': result ='English';
	         break;
	case '6200': result ='English';
	          break;
	case 'default':result ='Current Account;';
	}
	return result;
}
  
  function GetRegionalLangPrompt(varLang)
  {
  	var result='';
  
  	switch(varLang)
  	{
  				//current acc
  	case 'Tamil': result ='2000.wav';
  	         break;
  	case 'English': result ='COR.MM00.01.01.wav';
  	          break;
  	case 'default':result ='COR.MM00.01.01.wav';
  	}
  	return result;
}

function GetRegionLocale(varRegionalLang)
{
	var result='';
	switch(varRegionalLang)
	  	{
	  				//current acc
	  	case 'Tamil': result ='ta-IN';
	  	         break;
	  	case 'English': result ='en-IN';
	  	          break;
	  	case 'default':result ='en-IN';
	  	}
  	return result;

}

function GetQuery(CallUUID,CallUUID1,varStdate,varStTime,varEndDate,varEndTime,varDuration,STAN,DNIS,ANI,varCRNNum,varNumAcc,varAcctNumber,varLangFlag,varAuthFlag,varDisConnectFlag,varFlag,varDestVDN,varTrav1,varTrav2,varFlag,varDebitCard,varLastMenuID)
{
	var output='';
	var test=";";
	output='Insert into CORP_IVR_CALL_MASTER Values('+"'"+CallUUID +"',";

	output+="'"+CallUUID1+"',";

	output+="to_date('"+varStdate +"','DD-MM_YYYY'),";

	output+="'"+varStTime+"',";

	output+="to_date('"+varEndDate +"','DD-MM_YYYY'),";

	output+="'"+varEndTime+"',";

	output+="'"+varDuration +"',";

	output+="'"+STAN +"',";

	output+="'"+DNIS +"',";

	output+="'"+ANI+"',";

	output+="'"+varCRNNum +"',";

	output+="'"+varNumAcc +"',";

	output+="'"+varAcctNumber +"',";
	
output+="'"+varLangFlag +"',";
	
output+="'"+varAuthFlag +"',";
	
output+="'"+varDisConnectFlag +"',";

	output+="'"+varFlag +"',";
	
output+="'"+varDestVDN +"',";

	output+="'"+varTrav1 +"',";

	output+="'"+varTrav2 +"',";

	output+="'"+varFlag +"',";
	
output+="'"+varDebitCard +"',";

	output+="'"+varLastMenuID +"');";

	return output;
}

function GetBalance(varBal)
{
	var result='';
	varBal = varBal.replace('-', '0');
	varBal = varBal.replace('+', '0');
	result = varBal.replace(/^0+/, '');
  	return result;

}
var common_version = "8.0.3";
/*
************************************************
 * common.js
 * For common utility functions
 * Note: Do not put any comments as the starting line
************************************************
*/

// Check is the value is a URI
function isURIResource(value)
{
    var isURI = false;
    
    if (value.length == 0)
    	return false;
   
   value = value.toLowerCase();
   
   if (value.match("^http://*|^file://*|^rtsp://*")) 
   		isURI = true;
   else if (value.indexOf(".jsp") != -1)
   		isURI = true;
   else if (value.substring(0,1) == "." || value.substring(0, 2) == "..")
   		isURI = true;

   return isURI;
}

function getGrammarURI(value,isDTMF)
{
    var grammarURI = "";
    
    if (isURIResource(value))
    	grammarURI = encodeURI(value);
    else if (isDTMF == false) //Voice Grammar
    	grammarURI = AppState.GRAMMARFILEDIR + '/' + AppState.APP_ASR_LANGUAGE + '/' + value;
    else //DTMF
    	grammarURI = AppState.GRAMMARFILEDIR + '/DTMF/' + value;
    
    return grammarURI;
}

function getGBuilderGrammarURI(value, isDTMF)
{
	if ( value == undefined || (value.indexOf("/") == -1 && value.indexOf("\\") == -1 ) ) {
		return value;
	}
	
	var	nSlashPos		= -1;
	var strGrammarURI	= "";
	var strGrammarFile	= "";
		
	nSlashPos = value.lastIndexOf( "/" );
	
	strGrammarFile = value.substr( nSlashPos, value.length - nSlashPos - 1 );
	strGrammarFile = strGrammarFile.substr( 0, strGrammarFile.lastIndexOf(".") );
	strGrammarFile += ".grxml";
		
	// pick up the grxml file name from the input value. GRXML files are expected to be in the 
	// "Resources/Grammars/<language> folder only
	strGrammarURI = AppState.GRAMMARFILEDIR + "/" + AppState.APP_ASR_LANGUAGE + "/" + strGrammarFile;
	strGrammarURI = strGrammarURI.replace( "//", "/" );
	
    if ( isDTMF == true ) {
    	strGrammarURI = strGrammarURI.replace( '/' + AppState.APP_LANGUAGE + '/', '/' + "DTMF" + '/');
    }
    
    return strGrammarURI;
}


function getAudioURI(value)
{
    var audioURI = "";
    
    if (isURIResource(value))
    	audioURI = value;
    else
    	audioURI = AppState.VOXFILEDIR + '/' + AppState.APP_LANGUAGE + '/' + value;
    
    return audioURI;
}

function checkIsObject(result) 
{
	if(result instanceof Object){
		return true;
	}
	return false;
}

function getDNIS()
{

	var address = "";
	
	// OCN takes precedence if available
	var ocn = session.connection.redirect[0];
	if (typeof ocn != 'undefined' && ocn != null) {
		address = ocn.uri;
	} 
	
	if (address == "") {
		address = session.connection.local.uri;
	}

	return getUserPart(address);
}

function getANI()
{

	var address = "";
	
	// this header takes precedence if available
	var pai = session.connection.protocol.sip.headers['p-asserted-identity'];
	if (typeof pai != 'undefined' && pai != null) {
		address = pai;
	} 
	
	if (address == "") {
		address = session.connection.remote.uri;
	}

	return getUserPart(address);
}

function getUserPart(address)
{
	var re = new RegExp("(?:sip|sips|tel):([^@]+)@.*");
	var result = re.exec(address);
	
	if (result == null || result.length < 2) return "";
	
	return result[1];

}

// try to convert a string to a number
function toNumber(value) { 
	
	if (typeof value == "number") {
		return value;
	}
	
	if (typeof value == "string") {
		var num = new Number(value);
		
		// test for not-a-number
		if (!isNaN(num)) {
			return num.valueOf();
		} else {
			return value;
		}
	}
	
	// return the original value by default
	return value;
	
}

function resetLanguage() {
    AppState.APP_LANGUAGE = AppState.PREV_APP_LANGUAGE;
    AppState.APP_ASR_LANGUAGE = AppState.PREV_APP_ASR_LANGUAGE;
}

function getCaptureLocation(location, prefix) {
	
	if (location.length == 0) return prefix;
	
	var endChar = location.charAt(location.length - 1);
	if (endChar != '\\' || endChar != '/') {
		location = location + '/';
	}
	
	return location + prefix;
	
}

function br_getLoginRequest(username, password) {
	
	var loginRequest = new Object();
	var loginRequestBody = new Object();
	            
	loginRequestBody.username = username;
	loginRequestBody.password = password;
	            
	loginRequest["login-request"] = loginRequestBody;
	
	return loginRequest;
	
}

function br_getSessionId(loginResponse) {
	
	if (typeof loginResponse == 'undefined' || loginResponse == null ||
		typeof loginResponse['login-response'] == 'undefined' || loginResponse == null ||
		typeof loginResponse['login-response']['sessionid'] == 'undefined' || loginResponse['login-response']['sessionid'] == null) {
		
		return null;
	}
	
	return loginResponse['login-response']['sessionid'];
}

function br_getPackageInfoRequest(sessionid) {
	
	var getPackageInfoRequest = new Object();
	var getPackageInfoRequestBody = new Object();
			       
	getPackageInfoRequestBody.sessionid = sessionid;
	
	getPackageInfoRequest["get-package-info-request"] = getPackageInfoRequestBody;
	
	return getPackageInfoRequest;
}

function br_getLocation(packageInfoResponse) {
	
	if (typeof packageInfoResponse == 'undefined' || packageInfoResponse == null ||
		typeof packageInfoResponse['get-package-info-response'] == 'undefined' || 
		packageInfoResponse['get-package-info-response'] == null || 
		typeof packageInfoResponse['get-package-info-response']['package-info'] == 'undefined' || 
		packageInfoResponse['get-package-info-response']['package-info'] == null || 
		typeof packageInfoResponse['get-package-info-response']['package-info']['location'] == 'undefined' || 
		packageInfoResponse['get-package-info-response']['package-info']['location'] == null)
	{
		return null;
	}
	
	var locationList = 	packageInfoResponse['get-package-info-response']['package-info']['location'];
	if (locationList.length == 0) {
		return null;
	}
	
	if (typeof locationList == 'string') {
		return locationList;
	} else {
		return locationList[0];
	}
}

function br_getLogoutRequest(sessionid) {
	
	var logoutRequest = new Object();
	var logoutRequestBody = new Object();
    
	logoutRequestBody.sessionid = sessionid;
	
	logoutRequest["logout-request"] = logoutRequestBody;
	
	return logoutRequest;
}

function br_initKbRequest() {
	
	var kbRequest = new Object();
	var kbRequestBody = new Object();
	    
	var inOutFacts = new Object();
	var namedFact = new Array();
	    
	inOutFacts['named-fact'] = namedFact;
	kbRequestBody['inOutFacts'] = inOutFacts;
	    
	kbRequest['knowledgebase-request'] = kbRequestBody;
	
	return kbRequest;
}

function br_addFact(kbRequest, fact) {
	
	var fArray = kbRequest['knowledgebase-request']['inOutFacts']['named-fact'];
	fArray.push(fact);
	
}

function br_getResultFacts(result) {
	
	if (typeof result == 'undefined' || result == null ||
		typeof result['knowledgebase-response'] == 'undefined' || result['knowledgebase-response'] == null || 
		typeof result['knowledgebase-response']['inOutFacts'] == 'undefined' || result['knowledgebase-response']['inOutFacts'] == null || 
		typeof result['knowledgebase-response']['inOutFacts']['named-fact'] == 'undefined' || 
		result['knowledgebase-response']['inOutFacts']['named-fact'] == null) {
		
		return null;
	}
	
	return result['knowledgebase-response']['inOutFacts']['named-fact'];
}




//AppState.varYear+''+AppState.varMonth+''+AppState.varDate
function ParseCaptureDate(varyr,varmnth,vardt)
{	var result = '';
	if ((String(varmnth).length) == 1)
	
		varmnth = '0' + ''+varmnth ;
	
	if ((String(vardt).length) == 1)
	{
		vardt = '0' + ''+vardt ;
	}
	result = varyr+''+varmnth+''+vardt;
	return result;
}

//AppState.varCaptureDT+''+AppState.varHr+''+AppState.varMin+''+AppState.varSec
function LocalTrnxTime(varcaptdt,varhr,varmin,varsec)
{	var result = '';
	if ((String(varhr).length) == 1)
	{
		varhr  = '0' + ''+varhr ;
	}
	if ((String(varmin).length) == 1)
	{
		varmin  = '0' + ''+varmin ;
	}
	if ((String(varsec).length) == 1)
	{
		varsec  = '0' + ''+varsec ;
	}
	 result = varcaptdt+''+varhr+''+varmin+''+varsec;
	return result;
}


function ParsePvtData(varPvtfield)
{
		var result ='';
		var inp = varPvtfield;
		var splitArr = inp.split('|')
		if (splitArr.length == 2)
		{
			result = '0';
		}
		else if ((splitArr.length) >= 6)
		{
			result = splitArr[5];
		}
		else
		{
			result = '0';
		}
	return result;
}		


function GetTPinPrompts(varActCode)
{
		var result ='';
		var inp = varActCode;
		switch(inp)
		{
		case '111': result ='COR.AUTH.ERROR.111.wav';
			   break;
		case '112': result ='COR.AUTH.ERROR.112.wav';
			   break;
		case '113': result ='COR.AUTH.ERROR.113.wav';
			   break;
		case '114': result ='COR.AUTH.ERROR.114.wav';
			   break;
		case '115': result ='COR.AUTH.ERROR.115.wav';
			   break;
		case '907': result ='COR.BANK.ERROR.907.wav';
			   break;
		case '909': result ='COR.BANK.ERROR.909.wav';
			   break;
		case '902': result ='COR.BANK.ERROR.902.wav';
			   break;
		case '904': result ='COR.BANK.ERROR.904.wav';
			   break;
		case '906': result ='COR.BANK.ERROR.906.wav';
			   break;
		case '911': result ='COR.BANK.ERROR.911.wav';
			   break;
		case '913': result ='COR.BANK.ERROR.913.wav';
			   break;
		case 'default':result ='COR.AUTH.ERROR.112.wav';
		}
		return result;
}



function GetChangePinCRN(varCRNNew)
{
	var result ='';
	var inp = varCRNNew;
	if (inp.length==11)
	{
		result = '00000000'+''+varCRNNew;
	}
	else
	{
		result = '000000000'+''+varCRNNew;
	}
	return inp;
}


function GetErrorPrompts(varActCode)
{
		var result ='';
		var inp = varActCode;
		switch(inp)
		{
		case '183': result ='COR.BANK.ERROR.183.wav';
			   break;
		case '119': result ='COR.BANK.ERROR.119.wav';
			   break;
		case '1MD': result = 'COR.INVALID.ENTRY.wav';
			    break;
		case '1GT': result= 'COR.TM03.01.00.wav';	
			    break;
		case '16M': result= 'COR.TM03.02.01.wav';	
			    break;
		case 'default':result ='COR.BANK.ERROR.907.wav';
		}
		return result;
}


function SelectFDPrompt(varActCode)
{
		var result ='';
		var inp = varActCode;
		switch(inp)
		{
		case '813': result ='BENNOTREG.wav';
			   break;
		case '811': result ='DEBINOTREG.wav';
			   break;
		case '805': result ='FACNOTEN.wav';
			   break;
		case '116': result ='INSUFBAL.wav';
			   break;
		case '800': result ='DETNOTUP.wav';
			   break;
		case '801': result ='DETNOTUP.wav';
			   break;
		case '809': result ='FACNOTACT.wav';
			   break;
		case 'default':result ='COR.BANK.ERROR.907.wav';
		}
		return result;
}



function ValidateStartDate(stdate)
{
	var result = 'False';

	if (stdate.length == 6)
	{
	 var day = stdate.slice(0,2);
	 var month = stdate.slice(2,4)
	 var year =stdate.slice(4,6);
	//concat year

	 year = '20' + '' + year;
	
	//check month
		if (month >= 1 & month <= 12)
         	 {
            		month = month - 1;
          		if (day >=1 & day <=31)
			{
					var currdate = new Date(year,month,day)
					var d1  = new Date();
					if (currdate < d1)
					{ 
						// calculate difference in days
						var days = (d1.getTime() - currdate.getTime())/(1000*60*60*24);
						days = Math.floor(days);
						if (days > 180)
						{
							result = '16M';
							// start date cannot be old than 6 months
						}
						else
						{
					 	 result ='000';
					  	
						
						}
					}	
					else
					{	//start date greater than today
						result ='1GT';
					}
		
			}
			else
			{
			  result ='1MD';
			  //return result;
			 
			}
          	
          	
          	
          	}
              	
          	
        	else
        	{ 
			result = '1MD';
			
			
		
		}
		

		

	 }
	else
	{
           result='1MD'; 		
	// date. lenght > 6
	}
 return result;

}
//yyyymmdd
function FormatDate(vardate)
{
	var result = "";
	var year = vardate.slice(0,4);
	//year = '20'+ ''+ year;
//dd-mm-yyyy
	result = vardate.slice(6,8) + ''+ '-'+vardate.slice(4,6)+ '-'  +''+year;
	return result;

}
function FormatSEDate(vardate)
{
//ddmmyy
	var result = "";
	var year = vardate.slice(4,6);
	year = '20'+ ''+ year;
//dd-mm-yyyy
	result = vardate.slice(0,2) + ''+ '-'+vardate.slice(2,4)+ '-'  +''+year;
	return result;

}


function LocalTime(varhr,varmin,varsec)
{	var result = '';
	if ((String(varhr).length) == 1)
	{
		varhr  = '0' + ''+varhr ;
	}
	if ((String(varmin).length) == 1)
	{
		varmin  = '0' + ''+varmin ;
	}
	if ((String(varsec).length) == 1)
	{
		varsec  = '0' + ''+varsec ;
	}
	 result = varhr+''+varmin+''+varsec;
	return result;
}



function ValidateEndDate(stStartdate,stEnddate)

{
	var result = 'False';
	var eday = stEnddate.slice(0,2);
	var emonth = stEnddate.slice(2,4)
	var eyear =stEnddate.slice(4,6);
	var day = stStartdate.slice(0,2);
	var month = stStartdate.slice(2,4)
	var year =stStartdate.slice(4,6);
	
	eyear = '20' + '' + eyear;
	year = '20' + '' + year;
	 
	if (emonth >= 1 & emonth <= 12)
	{
	 	emonth = emonth - 1;
	 	month = month - 1;
	  	if (eday >=1 & eday <=31)
		{
		
			var edate = new Date(eyear,emonth,eday)
			var sdate = new Date(year,month,day)
			//current date
			var d1  = new Date(); 
			//checkenddate is greater than current date
			if (edate > d1)
			{
			result = 'False'
						
			}
			else if( edate < sdate)
			{
			result = 'False'
			}
			else
			{
			result = '000';
			}
		}	
			
		else
		{ 
		// invalide day.
		result = 'False';
		}		   
				
	}
	else
	{ 
	// invalide month
	result = 'False';
	}	
	
	return result;
}

function GetCrDb(varBal)
{
	var result ='';
	if (varBal == '')
	{
	result = '';
	} 
	else
	var inp = varBal;
	if (inp.slice(0,1)=='+')
	{
		result = 'COR.CREDIT.wav';
	}
	else
	{
		result = 'COR.DEBIT.wav';
	}
	
	return result;
}


function GetAgentTrav(strmenu)
{
	var result='';
	var inp = strmenu;
			switch(inp)
			{
			//current acc
			case '1': result ='161;';
				   break;
			case '2': result ='162;';
				   break;
			case '3': result ='163;';
				   break;
			case '4': result ='164;';
				   break;
			case '5': result ='165;';
				   break;
			case 'default':result ='161;';
			}
		return result;
}


function GetDate()
{
var dt = new Date();

var day = dt.getDate();
var month = dt.getMonth()+1;
var year =dt.getFullYear();
if (String(day).length == 1)
{
day = '0'+''+day;
}
if  (String(month).length == 1)
{
month= '0'+''+month;
}


return day+''+'-'+''+month+''+'-'+year;


}


function GetExpDateDate(fcrm)
{
if (fcrm != '')
 {
var arr = new Array();
arr[0]= fcrm.slice(0,12);
arr[1]= fcrm.slice(21,24);
arr[2]=fcrm.slice(38,42);
arr[3]=fcrm.slice(42,62);
arr[4]=fcrm.slice(62,82);
return arr;
}
else
return '';

}


function ValidateNum(varNwAcNum,varArrAcNum)
{ 
    for(var i=0; i<varArrAcNum.length; i++) 
    { 
        //if (varArrAcNum[i] == varNwAcNum)
        if (varArrAcNum.indexOf(varNwAcNum) != -1)
                return '0'; 
       else
        return '1';
    }
}

function GetSegment(varCorpPriority)
{
	var result = 'NORMAL';


	if (varCorpPriority.slice(0,1) == '1')
	{
		result = "ELITE";
	}
	
	return result;
}


function getGreet()
{
  var currentTime = new Date();
  var Result;
    if (currentTime.getHours() < 12)
    
        Result = 'GOODMORNING.wav' ;       
        else if (currentTime.getHours() < 17)
        Result = 'GOODAFTER.wav' ;
    else Result = 'GOODEVE.wav' ;
    return Result;
}



function getCrmString(actcode,lang,travstring,name,cardnum,crn,cli)
{
var result ='UUI=';
//var result = "aaa";
//var accnum = "015101573832";
//var actcode = "000";
//var lang='E'
//var travstring='AZAYZZ';
//var name='PARUL Batra';
//var cardnum='123456789012345';
//var crn='1234567891';
	if (crn != null)
	{
		if (crn.length == 11)
		{
		result = result + crn+'         ';
		} 
		else
		{
		result = result + '                    ';
		}
        
        }
        else
        {
           result = result + '                    ';
        }
	if (actcode != null)
	{
		if (actcode.length == 3)
		{
			result = result + 'D'+''+actcode+''+lang+' ';
		}
			else
		{
			result = result+''+'D104'+''+lang+' ';
		}

	}
	else
	{
	 result = result+''+'D104'+''+lang+' ';
	}
	
	if(travstring != null)
	{
	if (travstring.length <= 16)
		   {
		     var numspace = 16-travstring.length;
		     result = result + ''+ travstring;
		      	for (var i=0;i<numspace;i++)
		       	{
		        	 result = result + ' ';
		          	
		  	}
		  }
		 	
		 else if(travstring.length > 16)
		  {
		    result = result + ''+ travstring.slice(0,15);
		  }
		 else
		  { 
		       for (var i=0;i<16;i++)
		         {
		          result = result + ' ';
		         }
		 }
	 }
	 else
	 {
	 		for (var i=0;i<16;i++)
	 		         {
	 		          result = result + ' ';
		         }
	 }
	 
	 if (name != null)
	{
	 
	 			if (name.length <=20)
	 	 	 	{
	 	 	 	var numspace =20-name.length
	 	 	  	result = result + ''+ name;
	 	 	    	for (var i=0;i<numspace;i++)
	 	 	           {
	 	 	            result = result + ' ';
	 	 	           }
	 	 	 
	 	 	 	}
	 	 	 	else if(name.length > 20)
	 	 	 	{
	 	 	 	result = result + ''+ travstring.slice(0,20);
	 	 	 
	 	 	 
	 	 	 	}
	 	 	 	else
	 	 	 	{
	 	 	 		for (var i=0;i<20;i++)
	 	 	           	{
	 	 	           	 result = result + ' ';
	 	 	           	}
	 	 	 
	 	 		}
	 	 		
	 	 		
	 
	 
	 	}
	 	else
	 	{
	 	      for (var i=0;i<20;i++)
			{
			   result = result + ' ';
			}
	 	}
	 	
	 	if (cardnum != null)
	 	{
	 		if (cardnum.length == 16)
	 	 	
	 	 	{
	 	 			
	 	 			result = result + ''+ cardnum;
	 	 			
	 	 		
	 	 			}
	 	 			else
	 	 			{
	 	 			for (var i=0;i<16;i++)
	 	 		          {
	 	 		           result = result + ' ';
	 	 		          }
	 	 		
	 	 			}
	 		
	 	}
	 	else
	 	{
			for (var i=0;i<16;i++)
			{
			   result = result + ' ';
			}
	 	
	 	}
	 	if (cli != null)
	 	{
	 		if (cli.length <= 13)
	 			{
	 			var numspace =13-cli.length;
	 			//numspace = 29-13+numspace;
	 			result = result + ''+ cli;
	 			for (var i=0;i<numspace;i++)
	 		          {
	 		           result = result + ' ';
	 		          }
	 		
	 			}
	 			else
	 			{
	 			for (var i=0;i<13;i++)
	 		          {
	 		           result = result + ' ';
	 		          }
	 		
	 			}
	 	
		}
		else
		{
			for (var i=0;i<13;i++)
			{
      			result = result + ' ';
				 		          
			}
	 	
		
		}
	 	
	return result;

}



function GetLangFlag(varlang)
	{
	 var result = 'E';
		if (varlang == 'en-IN')
		{
			result ='E';
		}
		else if (varlang == 'mr-IN')
		{
			result ='M';
		}
		else if (varlang == 'ta-IN')
		{
			result ='T';
		}
		else if (varlang == 'hi-IN')
		{
			result ='H';
		}
		
		return result;

	}
	
	
	
		
		
		
		
		
		function getApinCrmString1(accnum,actcode,lang,travstring,expdt,name,cardnum,cli)
		{
		var result ='UUI=';
		//var result = "aaa";
		//var accnum = "015101573832";
		//var actcode = "000";
		//var lang='E'
		//var travstring='AZAYZZ';
		//var name='PARUL Batra';
		//var cardnum='123456789012345';
		//var crn='1234567891';
		
			if (accnum.length == 12)
			{
			result = result + accnum +'        ';
			} 
			else
			{
			//12 spaces
			result = result + '                    ';
			}
			
			
			if (actcode.length == 3)
			{
				result = result + 'A'+''+actcode+''+lang+' ';
			}
				else
			{
				result = result+''+'A104'+''+lang+' ';
			}
			
			
			
			if (travstring.length <= 12)
				   {
				     var numspace = 12-travstring.length;
				     result = result + ''+ travstring;
				      	for (var i=0;i<numspace;i++)
				       	{
				        	 result = result + ' ';
				          	
				  	}
				  }
				 	
				 else if(travstring.length > 12)
				  {
				    result = result + ''+ travstring.slice(0,11);
				  }
				 else
				  { 
				       for (var i=0;i<12;i++)
				         {
				          result = result + ' ';
				         }
				 }
			 
			 //Expiry date string.....
			if (expdt != null)				
			{
			 if (expdt.length == 4)
		 	{
			
			  	result = result + ''+ expdt;
			 			    
		          
		 	}
		 	else 
		 	{
		 	
			  	result = result + '    ';
		 
		 	}
			}
			else
			{
		 	
			  	result = result + '    ';
		 
		 	} 
		 				 	
			 
			 	if (name.length <=20)
			 	{
			 	var numspace =20-name.length
			  	result = result + ''+ name;
			    	for (var i=0;i<numspace;i++)
			           {
			            result = result + ' ';
			           }
			 
			 	}
			 	else if(name.length > 20)
			 	{
			 	result = result + ''+ name.slice(0,20);
			 
			 
			 	}
			 	else
			 	{
			 		for (var i=0;i<20;i++)
			           	{
			           	 result = result + ' ';
			           	}
			 
				}
				
					
				
			if (cardnum.length == 16)
			{
			
			result = result + ''+ cardnum;
			
		
			}
			else
			{
			for (var i=0;i<16;i++)
		          {
		           result = result + ' ';
		          }
		
			}
		
			if (cli.length <= 13)
			{
			var numspace =13-cli.length;
			//numspace = 29-13+numspace;
			result = result + ''+ cli;
			for (var i=0;i<numspace;i++)
		          {
		           result = result + ' ';
		          }
		
			}
			else
			{
			for (var i=0;i<13;i++)
		          {
		           result = result + ' ';
		          }
		
			}
				
			
		
			return result;
		
		}
		
		


	function GetMobileRequestString(varAccNum,varMobNum)
		{
			var result = '21AU'+'';

			

			result = result + varAccNum +'' +'F0115000'+'     ';

			result = result +''+'0'+ varMobNum+'';
			for (var i=0;i<40;i++)
			{
			          result = result + ' ';
			}
			
			result = result + ''+ 'AAAAN';
			result = result + ''+ 'F0012000'+''+'     ';
			result = result +''+'0'+ varMobNum+'';
			for (var i=0;i<40;i++)
			{
			          result = result + ' ';
			}
			result = result + ''+ 'AAAAN';

			result = result + ''+ 'F0023000'+''+'     ';
			result = result +''+'0'+ varMobNum+'';
			for (var i=0;i<40;i++)
			{
			          result = result + ' ';
			}
			result = result + ''+ 'AAAAN';
			result = result + ''+ 'F0125000'+''+'     ';
			result = result +''+'0'+ varMobNum+'';
			for (var i=0;i<40;i++)
			{
			          result = result + ' ';
			}

				//8-spaces.
			result = result + ''+ 'AAAAN';
			result = result + ''+ 'F0130'+''+'        ';
			result = result +''+'0'+ varMobNum+'';
			for (var i=0;i<40;i++)
			{
			          result = result + ' ';
			}
			result = result + ''+ 'AAAAN';

			//6spaces
			result = result + ''+ 'F015500'+''+'      ';
			result = result +''+'0'+ varMobNum+'';
			for (var i=0;i<40;i++)
			{
			          result = result + ' ';
			}
			result = result + ''+ 'AAAAN';

				//8-spaces
			result = result + ''+ 'F0510'+''+'        ';
			result = result +''+'0'+ varMobNum+'';
			for (var i=0;i<40;i++)
			{
			          result = result + ' ';
			}
			result = result + ''+ 'AAAAN';

			result = result + ''+ 'F0520'+''+'        ';
			result = result +''+'0'+ varMobNum+'';
			for (var i=0;i<40;i++)
			{
			          result = result + ' ';
			}
			result = result + ''+ 'AAAAN';



			return result;
	
		}


	function lastmenuid(varTrav)
	{
		var val,val1,res;
		val = varTrav.lastIndexOf (";");
		val1 = varTrav.lastIndexOf (";" , val - 1);
		res = varTrav.substring( val1 + 1 , val);

		return res;
	}



	function GetChkStatusPrompts(varStatus)
	{
	
		var result='';
	
			switch(varStatus)
			{
			//current acc
			case 'C': result ='COR.CHEQUE.STATUS.C.wav';
				   break;
			case 'D': result ='COR.CHEQUE.STATUS.D.wav';
				   break;
			case 'P': result ='COR.CHEQUE.STATUS.P.wav';
				   break;
			case 'R': result ='COR.CHEQUE.STATUS.R.wav';
				   break;
			case 'I': result ='COR.CHEQUE.STATUS.I.wav';
				   break;
			case 'S': result ='COR.CHEQUE.STATUS.S.wav';
				   break;
			case 'U': result ='COR.CHEQUE.STATUS.U.wav';
				   break;
			
			case 'default':result ='COR.INVALID.ENTRY.wav';
			}
		return result;
		


	}
	
	function GetTravBal(varAuthNum)
		{
			var result = '';
			if (varAuthNum == 'CRN')
			{
				result = '1131;';
			}
			else if(varAuthNum == 'DEBIT')
			{
				result = '1121;';
			}
			else
			{
				result = '';
			}
			
			return result;
	}

	function GetRegion(varCorpPriority)
	{
		var result = varCorpPriority.substr((varCorpPriority.indexOf("|")+1),1);
		if ((result == '') ||( result == '1' ))
			result = 'Z';
		else 
			result = result;
		return result;
	}

	function ChkExpDate(varCardExpDate)
	{
		var result='';
		if (varCardExpDate != '' || varCardExpDate != null)
		{	
			result = varCardExpDate.slice(3,5) + '' + varCardExpDate.slice(8,10);
		}
	return result;
	}
	
	function RetAccNumber(varAccNumber)
	{
	
	var result = 0;
	try
	{
	 if (varAccNumber == null)
	 {
	   result = 0;
	 }
	  else
	  {
		result = varAccNumber.slice(0, 12);
	 }
	 }
	catch(err)
	{
	 result = 0;
	}
	return result;
	}


function GetAgentTraversal(strmenu)
{
	var result='';
	var inp = strmenu;
			switch(inp)
			{
			//current acc
			case '1': result ='Current Account;';
				   break;
			case '2': result ='Cash Management Services;';
				   break;
			case '3': result ='Trade Services;';
				   break;
			case '4': result ='Bank At Home;';
				   break;
			case '5': result ='Agri Business Services;';
				   break;
			case 'default':result ='Current Account;';
			}
		return result;
}

function GetMenuID(varBalSource)
{
	var result='';
	if (varBalSource == 'DEBIT')
	{
	result = '1121';
	}
	else
	{
	result = '1131';
	}
	return result;


}


/*
function GetRegionalLang(varDNIS)
{
	var result='';

	switch(varDNIS)
	{
				//current acc
	case '6102': result ='English';
	         break;
	case '6200': result ='English';
	          break;
	case 'default':result ='Current Account;';
	}
	return result;
}
  
  function GetRegionalLangPrompt(varLang)
  {
  	var result='';
  
  	switch(varLang)
  	{
  				//current acc
  	case 'Tamil': result ='2000.wav';
  	         break;
  	case 'English': result ='COR.MM00.01.01.wav';
  	          break;
  	case 'default':result ='COR.MM00.01.01.wav';
  	}
  	return result;
}

function GetRegionLocale(varRegionalLang)
{
	var result='';
	switch(varRegionalLang)
	  	{
	  				//current acc
	  	case 'Tamil': result ='ta-IN';
	  	         break;
	  	case 'English': result ='en-IN';
	  	          break;
	  	case 'default':result ='en-IN';
	  	}
  	return result;

}
*/
function GetQuery(CallUUID,CallUUID1,varStdate,varStTime,varEndDate,varEndTime,varDuration,STAN,DNIS,ANI,varCRNNum,varNumAcc,varAcctNumber,varLangFlag,varAuthFlag,varDisConnectFlag,varFlag,varDestVDN,varTrav1,varTrav2,varFlag,varDebitCard,varLastMenuID)
{
	var output='';
	var test=";";
	output='Insert into CORP_IVR_CALL_MASTER Values('+"'"+CallUUID +"',";

	output+="'"+CallUUID1+"',";

	output+="to_date('"+varStdate +"','DD-MM_YYYY'),";

	output+="'"+varStTime+"',";

	output+="to_date('"+varEndDate +"','DD-MM_YYYY'),";

	output+="'"+varEndTime+"',";

	output+="'"+varDuration +"',";

	output+="'"+STAN +"',";

	output+="'"+DNIS +"',";

	output+="'"+ANI+"',";

	output+="'"+varCRNNum +"',";

	output+="'"+varNumAcc +"',";

	output+="'"+varAcctNumber +"',";
	
output+="'"+varLangFlag +"',";
	
output+="'"+varAuthFlag +"',";
	
output+="'"+varDisConnectFlag +"',";

	output+="'"+varFlag +"',";
	
output+="'"+varDestVDN +"',";

	output+="'"+varTrav1 +"',";

	output+="'"+varTrav2 +"',";

	output+="'"+varFlag +"',";
	
output+="'"+varDebitCard +"',";

	output+="'"+varLastMenuID +"');";

	return output;
}

function GetBalance(varBal)
{
	var result='';
	varBal = varBal.replace('-', '0');
	varBal = varBal.replace('+', '0');
	result = varBal.replace(/^0+/, '');
  	return result;

}

function GetRegionalLang(varDNIS)
{
	var result='';

	switch(varDNIS)
	{
				//current acc
	case '6201': result ='Marathi';
	         break;
	case '6202': result ='Tamil';
	          break;
	case 'default':result ='English';
	}
	return result;
}	
  
  function GetRegionalLangPrompt(varLang)
  {
  	var result='';
  
  	switch(varLang)
  	{
  				//current acc
  	case 'Marathi': result ='1000.wav';
  	         break;
  	case 'Tamil': result ='2000.wav';
  	         break;
  	case 'English': result ='COR.MM00.01.01.wav';
  	          break;
  	case 'default':result ='COR.MM00.01.01.wav';
  	}
  	return result;
}

function GetRegionLocale(varRegionalLang)
{
	var result='';
	switch(varRegionalLang)
	  	{
	  				//current acc
	  	case 'Marathi': result ='mr-IN';
	  	         break;
	  	case 'Tamil': result ='ta-IN';
	  	         break;
	  	case 'English': result ='en-IN';
	  	          break;
	  	case 'default':result ='en-IN';
	  	}
  	return result;

}

function GetTrav(varRegionalLang)
{
	var result='';
	switch(varRegionalLang)
	  	{
	  				//current acc
	  	case 'Marathi': result ='4;';
	  	         break;
	  	case 'Tamil': result ='5;';
	  	         break;
	  	case 'default':result ='2;';
	  	}
  	return result;

}


function ParseSystemDate(varyr,varmnth,vardt)
{	var result = '';
	if ((String(varmnth).length) == 1)
	
		varmnth = '0' + ''+varmnth ;
	
	if ((String(vardt).length) == 1)
	{
		vardt = '0' + ''+vardt ;
	}
	result = vardt+''+varmnth+''+varyr;
	return result;
}


function GetAddressDetails(varAddressline1,varAddressline2,varAddressline3,varMobile,varPhone1,varPhone2)
{
	var result = '';
	
	if (varAddressline1 != null)
	{
	 result = result + ''+ varAddressline1; 
	}
	if (varAddressline2 != null)
	{
	 result = result + ''+ varAddressline2; 
	}
	if (varAddressline3 != null)
		{
		 result = result + ''+ varAddressline3; 
	}
	if (varMobile != null)
	{
	  result = result + ''+ varMobile; 
	}
	
	
	return result;
}

function GetCounter(varISINStr)
{
	var result = '';
	var result= varISINStr.split("|").length;
	return result;
}

function ParseISIN(varISINStr)
{
	var result = '';
	var n = varISINStr.indexOf("|");
	if(n == '-1')
	{
	result = varISINStr.slice(0,varISINStr.length);
	}
	else
	{
	result = varISINStr.slice(0,n);
	}
	return result;
}

function UpdateString(varISINStr)
{
	var result = '';
	var n = varISINStr.indexOf("|");
	if(n == '-1')
	{
	result = varISINStr;
	}
	else
	{
	result = varISINStr.slice(n+1,varISINStr.length);
	}
	return result;
}


function GetPrvDate()
{
	var result = '';
	var d = new Date(); 
	d.setDate(d.getDate() - 6); 
	var dt = (d.getDate());
	var y = (d.getFullYear());
	var month = new Array();
	month[0]="01";
	month[1]="02";
	month[2]="03";
	month[3]="04";
	month[4]="05";
	month[5]="06";
	month[6]="07";
	month[7]="08";
	month[8]="09";
	month[9]="10";
	month[10]="11";
	month[11]="12";
	var n = month[d.getMonth()];
	var dte = new Array();
	dte [1]="01";
	dte [2]="02";
	dte [3]="03";
	dte [4]="04";
	dte [5]="05";
	dte [6]="06";
	dte [7]="07";
	dte [8]="08";
	dte [9]="09";
	dte [10]="10";
	dte [11]="11";
	dte [12]="12";
	dte [13]="13";
	dte [14]="14";
	dte [15]="15";
	dte [16]="16";
	dte [17]="17";
	dte [18]="18";
	dte [19]="19";
	dte [20]="20";
	dte [21]="21";
	dte [22]="22";
	dte [23]="23";
	dte [24]="24";
	dte [25]="25";
	dte [26]="26";
	dte [27]="27";
	dte [28]="28";
	dte [29]="29";
	dte [30]="30";
	dte [31]="31";
	var d1 = dte [d.getDate()];
	d=y+''+n+''+d1;
	result = d;
	return result;
}

function GetOpenCardCounter(varCAP_CARD_STAT)
{
	// varCAP_CARD_STAT = "OPEN|OPEN";
	var strStatus = varCAP_CARD_STAT.split("|");
	var count=0;
	var i=0;

for(i=0;i<strStatus.length;i++)
{
	if(strStatus[i]=="OPEN")
	{
		count++;
	}
}
	//	alert(count);
		return count;
}

function GetCardNumber(varCAP_PAN_CODE,varCAP_CARD_STAT)
{
	//var accno = "1234567890123456|0987654321098712"
	//var status = "OPEN|CLOSE"
	var strAccno = varCAP_PAN_CODE.split("|");
	var strStatus = varCAP_CARD_STAT.split("|");
	var strActiveAcno = "0";
	var i=0;

	for(i=0;i<strStatus.length;i++)
	{
		if(strStatus[i]=="OPEN")
		{
				strActiveAcno=strAccno[i];
		//		alert(strActiveAcno);
				return strActiveAcno;
		}
	}


}


function GetCardNumber_(varCAP_PAN_CODE,varCAP_CARD_STAT)
{
	//var accno = "1234567890123456|0987654321098712"
	//var status = "OPEN|CLOSE"
	var strAccno = varCAP_PAN_CODE.split("|");
	var strStatus = varCAP_CARD_STAT.split("|");
	var strActiveAcno = "0";

//var count=0;

//for(i=0;i<strStatus.length;i++)
//{
//	if(strStatus[i]=="OPEN")
//	{
//				count++;
//	}
//}

//if(count>1)
//{
//		alert(count);
//		return count;

//}
//else
//{
	for(i=0;i<strStatus.length;i++)
	{
		if(strStatus[i]=="OPEN")
		{
				strActiveAcno=strAccno[i];
		//		alert(strActiveAcno);
				return strActiveAcno;
		}
	}

//}

//	for(i=0; i < strAccno.length; i++)
//	{
//		if (strAccno[i].slice(strAccno[i].length - 4,strAccno[i].length) == objAccNo)
//		{
//			if(strStatus[i] == "OPEN")
//			{
//				strActiveAcno =  strAccno[i];
//			}
//		}

//	}

}

function GetActiveAccount(varLastCardNum,varCAP_PAN_CODE,varCAP_CARD_STAT)
{
	//var accno = "1234567890123456|0987654321098712|0987654321091234"
	//var status = "OPEN|CLOSE|OPEN"
	var strAccno = varCAP_PAN_CODE.split("|");
	var strStatus = varCAP_CARD_STAT.split("|");
	var strActiveAcno = "0";
	var i=0;

	//alert(strAccno.length)
// 	alert(strAccno[0].slice(strAccno[0].length - 4,strAccno[0].length));


	for(i=0; i < strAccno.length; i++)
	{
		if (strAccno[i].slice(strAccno[i].length - 4,strAccno[i].length) == varLastCardNum)
		{
			if(strStatus[i] == "OPEN")
			{
				strActiveAcno =  strAccno[i];
			}
			else
			{
				strActiveAcno="110";
			}
		}
		
	}

//	alert(strActiveAcno);
	return strActiveAcno;

}


function GetActiveName(varActiveCardNum,varCAP_PAN_CODE,varCAP_DISP_NAME)
{
	//var accno = "1234567890123456|0987654321098712|0987654321091234"
	//var name = "ABC|PQR|XYZ"
	var strAccno = varCAP_PAN_CODE.split("|");
	var strName = varCAP_DISP_NAME.split("|");
	var strCustName = "";
	var i=0;

//	alert(strAccno.length)
//	alert(strName.length)
// 	alert(strAccno[0].slice(strAccno[0].length - 4,strAccno[0].length));


	for(i=0;i<strAccno.length;i++)
	{
	
		if (strAccno[i] == varActiveCardNum)
		{
			
				strCustName =  strName[i];
		}
			
			//else
			//{
			//	strCustName = "Wrong";
			//}
		
	}		
	

//	alert(strCustName);
	return strCustName;

}




function GetClosedAccount(varLastCardNum,varCAP_PAN_CODE,varCAP_CARD_STAT)
{
	
	var strAccno = varCAP_PAN_CODE.split("|");
	var strStatus = varCAP_CARD_STAT.split("|");
	var strCloseAcno = "0";
	var i=0;

	//alert(strAccno.length)
// 	alert(strAccno[0].slice(strAccno[0].length - 4,strAccno[0].length));


	for(i=0; i < strAccno.length; i++)
	{
		if (strAccno[i].slice(strAccno[i].length - 4,strAccno[i].length) == varLastCardNum)
		{
			if(strStatus[i] == "CLOSED")
			{
				strCloseAcno =  strAccno[i];
			}
			else
			{
				strCloseAcno="110";
			}


		}
}

//	alert(strActiveAcno);
	return strCloseAcno;




}


function FormatPaymentDate(varPaymentDate)
{
	var paymentDate='';
	if (varPaymentDate.length == "8")
	{
	 var day = varPaymentDate.slice(0,2);
	 var month = varPaymentDate.slice(2,4);
	 var year =varPaymentDate.slice(4,8);
	 
	 paymentDate=year+''+month+''+day;
	 
	}
	return paymentDate;
}


function gettemp1( varCounter, varPayeeId)
{	
	var result='';
	
	var temp1=varPayeeId.split("|");
	if (temp1[varCounter] == '000000000254')
		result = "Silent.wav";
	else
		result = temp1[varCounter] + ".wav";
	/*switch(varCounter)
  	{
  				//current acc
  	case 0: result =temp1[0] + ".wav";
  	         break;
  	case 1: result =temp1[1] + ".wav";
  	         break;
  	case 2:result =temp1[2] + ".wav";
  			break;
  	case 3: result =temp1[3] + ".wav";
  			break;
  	case 4: result =temp1[4] + ".wav";
      		break;
  	case 5: result =temp1[5] + ".wav";
      		break;
  	case 6: result =temp1[6] + ".wav";

  	}*/
	return result;
	
}


function getPayeeListId( varCounter, varPayeeListId,varPayeeId)
{	
	var result='';
	
	var temp1=varPayeeId.split("|");
	if (temp1[varCounter] == '000000000254')
	{
		result = "-1";
	}
	else
	{
		var temp1=varPayeeListId.split("|");
		result = temp1[varCounter];
	}
	/*switch(varCounter)
  	{
  				//current acc
  	case 0: result =temp1[0];
  	         break;
  	case 1: result =temp1[1];
  	         break;
  	case 2:result =temp1[2];
  			break;
  	case 3: result =temp1[3];
  			break;
  	case 4: result =temp1[4];
      		break;
  	case 5: result =temp1[5];
      		break;
  	case 6: result =temp1[6];

  	}*/
	return result;
	
}




function gettemp2(varCounter,varPayeeType)
{
	var result='';
	//varPaymentType="P|N";	
	var temp2=varPayeeType.split("|");
	switch(varCounter)
  	{
  				//current acc
  	case 0: result =temp2[0];
  	         break;
  	case 1: result =temp2[1];
  	         break;
  	case 2:result =temp2[2];
  			break;
  	case 3:result =temp2[3];
  			break;
  	case 4:result =temp2[4];
  			break;
  	case 5:result =temp2[5];
  			break;
  	case 6:result =temp2[6];
  	}
	return result;
	
}


function AssignVarPrompt(varCounter,varPayeeId)
{
	var result='';
	var temp1=varPayeeId.split("|");
	if (temp1[varCounter] == '000000000254')
	{
		result = "Silent.wav";
	}
	else
	{	
		switch(varCounter)
		{
					//current acc
		case 0: result ='PRESS1.wav';
			 break;
		case 1: result ='PRESS2.wav';
			 break;
		case 2:result ='PRESS3.wav';
				break;
		case 3:result ='PRESS4.wav';
				break;
		case 4:result ='PRESS5.wav';
				break;
		case 5:result ='PRESS6.wav';
			 break;
		case 6:result ='PRESS7.wav';

		}
  	}
	return result;
}


function ParsePaymentAmount(varRupees,varLength)
{
	var rupees='';
	var paise='';
	var amount='';

	var num='a';
	num = varRupees;

	while(num.length < varLength)
	{
		num='0'+num;
	}
	
	//amount=rupees+paise;
	
	return num;
	
}


function ValidateDate(varPaymentdate)
{


var result="0";

	if((varPaymentdate).length=="8")
	{

		var day=varPaymentdate.slice(0,2);

		var month=varPaymentdate.slice(2,4);

		var year=varPaymentdate.slice(4,8);

	if(month>=1 & month<=12)
	{
	
		if(day>=1 & day<=31)
		{

			var currdate=new Date(year,month-1,day)

			var d1=new Date();

			if(currdate >=d1)
			{
				result='000';
			}
		else
		{
			result='100';
		}

	}
}

}
return result;

}



function FormatSRDate(varSRDate)
{
	var SRDate='';
	if (varSRDate.length == "8")
	{
	 var year= varSRDate.slice(0,4);
	 var month = varSRDate.slice(4,6);
	 var day =varSRDate.slice(6,8);
	 
	 SRDate=day+''+month+''+year;
	 
	}
	return SRDate;
}


function GetAccount(varNumAccounts,varCounter)
{
	var strValue = "";
	if (varNumAccounts == "") return strValue;	
	var varNumAccounts = varNumAccounts.split("       ");
	var count = parseInt(varCounter) -1
	
	
	if (varNumAccounts.length >= count)
		strValue  = varNumAccounts[count]; 
	
	return strValue;

}


//Anil-----------



function GetAmountPaise(objamt, objpaise) 
{
    var retAmt = "0";
    if (typeof objamt == "number") 
    {
        retAmt = objamt;            
    }
    if (typeof objamt == "string") {
        var num = new Number(objamt);
        // test for not-a-number
        if (!isNaN(num)) {
            retAmt = num.valueOf();
        } else {
            retAmt = "0";    
        }
    }
   
    if (typeof objpaise == "number") {
	retAmt += "." + objpaise;
    }
    else
    {
    
	    if (typeof objpaise == "string") {
		var num = new Number(objpaise);
		// test for not-a-number
		if (!isNaN(num) && num != '') {
		    retAmt +="." + num.valueOf();
		}             
	    }
	    else{retAmt += ".00";}
	}
	
	if (retAmt.toString().indexOf(".") == -1)
	{retAmt += ".00";}
   	//retAmt += ".00";
    return retAmt;
    
}


function GetobjValue(varStrCollection,varCounter)
{
	var strValue = "";
	if (varStrCollection == "") return strValue;	
	var strCollection = varStrCollection.split("|");
	var count = parseInt(varCounter) -1
	
	
	if (strCollection.length >= count)
		strValue  = strCollection[count]; 
	
	return strValue;

}

function GetAmount(objValue)
{
	var retVal='0.00';
	if (objValue == null) return retVal;
	if (objValue != ""){
	retVal = objValue.replace('+', '').replace('-', '');
	}
	
	if (retVal.slice(0, 1) == ".")
        	retVal = "0" + retVal;
        	
	return retVal;
}

function GetDecimal(objamtpaise)
{

		var retAmt = 0;

	if (objamtpaise != null)
	{
	 
	
	if (typeof objamtpaise == "number")
	{
		retAmt = objamtpaise;
	}
	if (typeof objamtpaise == "string")
	{
		var num = new Number(objamtpaise);
		// test for not-a-number
		if (!isNaN(num))
		{
			retAmt = num.valueOf();
		}
	}


	 if (objamtpaise.indexOf(".") == -1)
	 {
			retAmt += ".00";
	 }
	 
	 }
	 else
	 {
	  retAmt = "0.00";
	 }
//alert(retAmt);
	return retAmt;

}

function CurrentDate()
{
	var now = new Date();
	var date = now.getDate();
	var month =now.getMonth()+1;
	var year =now.getFullYear();
	var strDate="";



	if (date <= 9)
		strDate = "0"+date;
	else
		strDate += date;


	if (month<= 9)
		strDate += "0"+ month;
	else
		strDate += month;


	strDate += year;


	return strDate;
	

}

function GetCDPrompt(varDC)
{
	var result ='';
	if (varDC == '')
	{
	result = '';
	} 
	else
	
	if (varDC == 'C')
	{
		result = 'COR.CREDIT.wav';
	}
	else
	{
		result = 'COR.DEBIT.wav';
	}
	
	return result;
}

function SetBlank(varVal)
{
	var objval = ""; 
	if (varVal != null)
	{
		objval = varVal;
	}
		
	return objval;
}

function getCreditCardCrmString(actcode,lang,travstring,name,cardnum,cli)
{
var result ='UUI=';
//var result = "aaa";
//var accnum = "015101573832";
//var actcode = "000";
//var lang='E'
//var travstring='AZAYZZ';
//var name='PARUL Batra';
//var cardnum='123456789012345';
//var crn='1234567891';
	if (cardnum != null)
	{
		if (cardnum.length == 16)
		{
		result = result + cardnum+'    ';
		} 
		else if (cardnum.length == 15)
		{
			result = result + cardnum +'     ';
		}	        
		else
		    {
		    	result = result + '                    ';		
    		}
    }
    else
    {
    	result = result + '                    ';		
    }
	if (actcode != null)
	{
		if (actcode.length == 3)
		{
			result = result + 'B'+''+actcode+''+lang+' ';
		}
		else
		{
			result = result + 'B107'+lang+' ';
		}
	}
	else
	{
		result = result+''+'B117'+''+lang+' ';
	}
	
	if(travstring != null)
	{
		if (travstring.length <= 16)
		{
			var numspace = 16 - travstring.length;
		    result = result + ''+ travstring;
			for (var i=0;i<numspace;i++)
			{
				 result = result + ' ';			      	
			}
		}		 	
		else if(travstring.length > 16)
		{
		    result = result + ''+ travstring.slice(0,15);
		}
		else
		{ 
			for (var i=0;i<16;i++)
			{
			      result = result + ' ';
			}
		}
	 }
	 else
	 {
		for (var i=0;i<16;i++)
		{
		  result = result + ' ';
		}
	 }
	 
	 if (name != null)
	 {	 
		if (name.length <=20)
		{
			var numspace =20-name.length
			result = result + ''+ name;
			for (var i=0;i<numspace;i++)
		    {
				result = result + ' ';
		    }		 
		 }
		 else if(name.length > 20)
		 {
		 	result = result + ''+ travstring.slice(0,20);
		 }
		 else
		 {
			 for (var i=0;i<20;i++)
		     {
				 result = result + ' ';
		     }		 
		 }
	 	}
	 	else
	 	{
	 	      for (var i=0;i<20;i++)
			{
			   result = result + ' ';
			}
	 	}
	 	
	 	if (cardnum != null)
	 	{
	 		if (cardnum.length == 16)	 	 	
	 	 	{
	 			result = result + ''+ cardnum;
	 	 	}
	 	 	else if (cardnum.length == 15)	 	 	
	 	 	{
	 	 		result = result + ''+ cardnum + ' ';
	 	 	}
	 		else
	 	 	{
	 			for (var i=0;i<16;i++)
	 	 		{
	 				result = result + ' ';
	 	 		} 	 		
	 	 	}	 		
	 	}
	 	else
	 	{
			for (var i=0;i<16;i++)
			{
			   result = result + ' ';
			}	 	
	 	}
	 	if (cli != null)
	 	{
	 		if (cli.length <= 13)
	 		{
	 			var numspace =13-cli.length;
	 			//numspace = 29-13+numspace;
	 			result = result + ''+ cli;
	 			for (var i=0;i<numspace;i++)
		        {
	 				result = result + ' ';
		        }	 		
	 		}
	 		else
	 		{
	 			for (var i=0;i<13;i++)
	 		    {
	 				result = result + ' ';
	 		    }
	 		
	 		}	 	
		}
		else
		{
			for (var i=0;i<13;i++)
			{
      			result = result + ' ';				 		          
			}
		}
	 	
	return result;

}

function GetMobileValid(DataName,DataValue)
{

	var RetVal ="";
	if (DataName != null)
	{
		var strDataNames =  DataName.split("|");
		var strDataValues =  DataValue.split("|");

		for(var j=0; j<strDataNames.length; j++)
		{
			if(strDataNames[j] == "MenuProfile")
			{
				if (strDataValues[j] == "Mobile")
				{
					RetVal = "Y";
				}else{	RetVal = "N";}
			} else { RetVal = "Y"; }
		}
	}

	//alert(RetVal);
	return RetVal;
}


function getAmtResult(objAvlBal, objamtpaise)
{


	var retResult= "";

	if ((typeof objamtpaise == "number") || (typeof objAvlBal == "number"))
	{
		retResult= "SUCCESS";

		if (parseFloat(objAvlBal) < parseFloat(objamtpaise))
		{
			retResult = "INFBAL";
		}
		else if (parseFloat(objamtpaise) > 50000)
		{
			retResult = "G50K";
		}
		//alert(retResult);
	}
	else
	{
		retResult = "INVAMT";
	}

	if ((typeof objamtpaise == "string") || (typeof objAvlBal == "number"))
	{
		//alert(retResult);
		retResult= "SUCCESS";
		var num = new Number(objamtpaise);
		var num1 = new Number(objAvlBal);
		if (!isNaN(num) && !isNaN(num1))
		{
			if (parseFloat(num1.valueOf()) < parseFloat(num.valueOf()))
			{
				retResult = "INFBAL";
			}
			else if (parseFloat(num.valueOf()) > 50000)
			{
				retResult = "G50K";
			}
		}
		else{retResult = "INVAMT";}

	}
	return retResult;
}

function ConvertDecimal(objamtpaise)
{

	var retAmt = '0.00';
		var retVal='';
		if (objamtpaise == null || objamtpaise == "") return retAmt;
		
		retVal  = objamtpaise.replace('+', '');		
		retVal = retVal.replace('-', '');
		
	
		if (typeof retVal == "number")
		{
			//retAmt = (retVal).slice(0,((retVal).length-2)) +"." + (retVal).slice((retVal).length-2,((retVal).length));
			 if (retVal.indexOf(".") == -1)
			 	retAmt = (retVal).slice(0, ((retVal).length - 2)) + "." + (retVal).slice((retVal).length - 2, ((retVal).length));
			 else
            			retAmt = "0." + (retVal).slice((retVal).length - 2, ((retVal).length));
		}
		if (typeof retVal == "string")
		{
			var num = new Number(retVal);
			// test for not-a-number
			if (!isNaN(num))
			{
				var objval = num.valueOf().toString();
				//alert(objval.length);
				//retAmt = (objval).slice(0,((objval).length-2)) +"." + (objval).slice((objval).length-2,((objval).length));
				  if (objval.indexOf(".") == -1)
				       	retAmt = (objval).slice(0, ((objval).length - 2)) + "." + (objval).slice((objval).length - 2, ((objval).length));
				  else
                			retAmt = "0." + (objval).slice((objval).length - 2, ((objval).length));
	
				//retAmt = (retAmt).slice(0,((retAmt).length-2)) +"." + (retAmt).slice((retAmt).length-2,((retAmt).length));
			}
		}

		if (retAmt.indexOf(".") == 0)
        	   retAmt = "0" + retAmt;	
        		
		return retAmt;



}

function getAmtFormat(objVal)
{

	var retVal='';
	var retAmt='0.00';
	if (objVal == null || objVal == "") return retAmt;

	//retVal  = objVal.replace('+', '');
	//retVal = retVal.replace('-', '');

	if(objVal.indexOf(".") != -1)
	{
		retVal = objVal.substr(0,objVal.indexOf("."))
	}

	retAmt = (retVal).slice(0,((retVal).length-2)) +"." + (retVal).slice((retVal).length-2,((retVal).length));


	return retAmt;

}

function GetCCPromptPlay(varBal)
{
	var result ='';
	if (varBal == '')
	{
	result = 'CCOutStBal.wav';
	} 
	else
	var inp = varBal;
	if (inp.slice(0,1)=='+')
	{
		result = 'CCOutStBal.wav';
	}
	else if (inp.slice(0,1)=='-')
	{
		result = 'CCCreditLimit.wav';
	}
	else
	{
		result = 'CCOutStBal.wav';
	}
	
	return result;
}

function GetCreditCrDb(varBal)
{
	var result ='';
	if(varBal == null)
	{
		return result;
	}
	if (varBal == '')
	{
	result = '';
	} 
	else
	var inp = varBal;
	if (inp.slice(0,1)=='-')
	{
		result = 'COR.CREDIT.wav';
	}
	else
	{
		result = '';
	}
	
	return result;
}

function CCFormatDate(vardate)
{
	var result = "";
	var year = vardate.slice(0,4);
	//year = '20'+ ''+ year;
//dd-mm-yyyy
	result = vardate.slice(6,8) +''+vardate.slice(4,6)+''+year;
	return result;

}
//=============

function getBackendDowntime()
{
	//DTStartDateTime=new Date(YYYY, Month-1, DD, HH, MM, SS, mS);
	//DTEndDateTime=new Date(YYYY, Month-1, DD, HH, MM, SS, mS);

	var result='';

	var CurrentDateTime = new Date();

	var DTStartDateTime = new Date(2013, 4, 11, 19, 00, 00, 00);
	var DTEndDateTime = new Date(2013, 4, 15, 19, 00, 00, 00);

	if ((CurrentDateTime >= DTStartDateTime)&&(CurrentDateTime <= DTEndDateTime))
	{
		result = 'true';
	}
	else
	{
		result = 'false';
	}
	
       	return result;

}


function GetKYCInfoPrompt(varMenuOpt)
{
	var result='';
		
		switch(varMenuOpt)
	  	{
	  				
	  	case '1': result ='RPC.KYC.IDInfo.wav';
	  	         	break;
	  	case '2':result ='RPC.KYC.AddressInfo.wav';
	  	 		break;
	  	case '3':result ='RPC.AgeInfo.wav';
	  		 	break;
	  	case '4':result ='RPC.RelationshipInfo.wav';
	  		 	break;
	  	case 'default': result = 'RPC.KYC.IDInfo.wav';
	  		  	
	  	}
	return result;
}


function GetDOCInfoPrompt(varMenuOpt)
{
	var result='';
		
		switch(varMenuOpt)
	  	{
	  				
	  	case '1': result ='RPC.NameInfo.wav';
	  	         	break;
	  	case '2':result ='RPC.SignatureInfo.wav';
	  	 		break;
	  	case '3':result ='RPC.DOBInfo.wav';
	  		 	break;
	  	case '4':result ='RPC.AddMisMatchInfo.wav';
	  		 	break;
	  	case 'default': result = 'RPC.NameInfo.wav';
	  		  	
	  	}
	return result;
}


function GetSOLEInfoPrompt(varMenuOpt)
{
	var result='';
		
		switch(varMenuOpt)
	  	{
	  				
	  	case '1': result ='RPC.IdAddInfo.wav';
	  	         	break;
	  	case '2':result ='RPC.Entity2Info.wav';
	  	 		break;
	  	case '3':result ='RPC.AOCInfo.wav';
	  		 	break;
	  	case '4':result ='RPC.SoleAnnexInfo.wav';
	  		 	break;
	  	case 'default': result = 'RPC.IdAddInfo.wav';
	  		  	
	  	}
	return result;
}


function GetPARTInfoPrompt(varMenuOpt)
{
	var result='';
		
		switch(varMenuOpt)
	  	{
	  				
	  	case '1': result ='RPC.Entity1Info.wav';
	  	         	break;
	  	case '2':result ='RPC.DeedInfo.wav';
	  	 		break;
	  	case '3':result ='RPC.PartnershipAnnexInfo.wav';
	  		 	break;
	  	case 'default': result = 'RPC.Entity1Info.wav';
	  		  	
	  	}
	return result;
}


function GetLTDInfoPrompt(varMenuOpt)
{
	var result='';
		
		switch(varMenuOpt)
	  	{
	  				
	  	case '1': result ='RPC.MOAInfo.wav';
	  	         	break;
	  	case '2':result ='RPC.CertificateInfo.wav';
	  	 		break;
	  	case '3':result ='RPC.BoardResInfo.wav';
	  		 	break;
	  	case '4':result ='RPC.PublicAnnexInfo.wav';
	  		 	break;
	  	case 'default': result = 'RPC.MOAInfo.wav';
	  		  	
	  	}
	return result;
}


function GetKYCTrav1(varMenuOpt)
{
	var result='';
		
		switch(varMenuOpt)
	  	{
	  				
	  	case '1': result ='RPC10;';
	  	         	break;
	  	case '2':result ='RPC11;';
	  	 		break;
	  	case '3':result ='RPC12;';
	  		 	break;
	  	case '4':result ='RPC13;';
	  	
	  		  	
	  	}
	return result;
}

function GetKYCTrav2(varMenuOpt)
{
	var result='';
		
		switch(varMenuOpt)
	  	{
	  				
	  	case '1': result ='IDProof;';
	  	         	break;
	  	case '2':result ='Address;';
	  	 		break;
	  	case '3':result ='Age;';
	  		 	break;
	  	case '4':result ='Relationship;';
	  	
	  		  	
	  	}
	return result;
}


function GetDOCTrav1(varMenuOpt)
{
	var result='';
		
		switch(varMenuOpt)
	  	{
	  				
	  	case '1': result ='RPC14;';
	  	         	break;
	  	case '2':result ='RPC15;';
	  	 		break;
	  	case '3':result ='RPC16;';
	  		 	break;
	  	case '4':result ='RPC17;';
	  	
	  		  	
	  	}
	return result;
}

function GetDOCTrav2(varMenuOpt)
{
	var result='';
		
		switch(varMenuOpt)
	  	{
	  				
	  	case '1': result ='IDProof;';
	  	         	break;
	  	case '2':result ='Signature;';
	  	 		break;
	  	case '3':result ='DOB;';
	  		 	break;
	  	case '4':result ='AddMisMatch;';
	  		  		  	
	  	}
	return result;
}

function GetSOLETrav1(varMenuOpt)
{
	var result='';
		
		switch(varMenuOpt)
	  	{
	  				
	  	case '1': result ='RPC21;';
	  	         	break;
	  	case '2':result ='RPC22;';
	  	 		break;
	  	case '3':result ='RPC23;';
	  		 	break;
	  	case '4':result ='RPC24;';
	  	
	  		  	
	  	}
	return result;
}

function GetSOLETrav2(varMenuOpt)
{
	var result='';
		
		switch(varMenuOpt)
	  	{
	  				
	  	case '1': result ='ID/Address;';
	  	         	break;
	  	case '2':result ='Entity;';
	  	 		break;
	  	case '3':result ='AOC;';
	  		 	break;
	  	case '4':result ='Annex;';
	  		  		  	
	  	}
	return result;
}


function GetPARTTrav1(varMenuOpt)
{
	var result='';
		
		switch(varMenuOpt)
	  	{
	  				
	  	case '1': result ='RPC25;';
	  	         	break;
	  	case '2':result ='RPC26;';
	  	 		break;
	  	case '3':result ='RPC27;';
	  		  	
	  	}
	return result;
}

function GetPARTTrav2(varMenuOpt)
{
	var result='';
		
		switch(varMenuOpt)
	  	{
	  				
	  	case '1': result ='Entity;';
	  	         	break;
	  	case '2':result ='Deed;';
	  	 		break;
	  	case '3':result ='Annex;';
	  		  		  	
	  	}
	return result;
}

function GetLTDTrav1(varMenuOpt)
{
	var result='';
		
		switch(varMenuOpt)
	  	{
	  				
	  	case '1': result ='RPC28;';
	  	         	break;
	  	case '2':result ='RPC29;';
	  	 		break;
	  	case '3':result ='RPC30;';
	  		 	break;
	  	case '4':result ='RPC31;';
	  	
	  		  	
	  	}
	return result;
}

function GetLTDTrav2(varMenuOpt)
{
	var result='';
		
		switch(varMenuOpt)
	  	{
	  				
	  	case '1': result ='Moa/AOA;';
	  	         	break;
	  	case '2':result ='Certificate;';
	  	 		break;
	  	case '3':result ='BoardRes;';
	  		 	break;
	  	case '4':result ='Annex;';
	  		  		  	
	  	}
	return result;
}


function getName(varName)
{

var result='';

if (varName == null)
	{
		result='';
	}
else if (varName.length=='1')
	{
		result = varName + ' ';
	}
else
	{
		result = varName;
	}
	
return result;
	
}



function GetDNISDetails(varDNIS)
{
		var result ='';
		var inp = varDNIS;
		switch(inp)
		{
		case '4308':
		case '6201':
		case '8140':
		case '7777':
		case '1260':
		case '7830':
		case '8005':
		case '8006':
		case '7701':
		case '7704':
		case '8198':
		case '1266':
		case '1268':
		case '1272': result ='Marathi';
			   break;
		case '6202':		
		case '1280':
		case '1616': 
		case '1639':
		case '1286':
		case '1288':
		case '1292':
		case '1086':
		case '1088':
		case '1092': result ='Tamil';
			   break;
		case '6203':	
		case '7700': 
		case '8080': 
		case '1367': 
		case '1287': 
		case '1347': 
		case '1007': 
		case '1027': 
		case '1307': 
		case '1427': 
		case '1167': 
		case '1141': 
		case '1467': 
		case '3567': 
		case '3507': 
		case '1407': 
		case '1207': 
		case '1127': 
		case '1107': 
		case '1087': 
		case '1047': 
		case '1267': 
		case '1937': 
		case '1506': 
		case '3036': 
		case '1526': 
		case '1646': 
		case '1585': 
		case '3006': 
		case '1269':
		case '5001':
		case '5002':
		case '5003':
		case '5004':
		case '5005':
		case '5006':
		case '5007':
		case '5008':
		case '5009':
		case '5010':
		case '5011':
		case '409':
		case '408':
		case '407':
		case '406':
		case '405':
		case '404':
		case '403':
		case '402':
		case '401':
		case '410':
		case '411':
		case '412':
		case '413':
		case '414':
		case '419':
		case '415':
		case '416':
		case '417':
		case '418':
		case '5012':
		case '5013':
		case '5014':
		case '5015':
		case '5000':
		case '9123':
		case '9124':
		case '9125':
		case '400':
		case '6717':
		case '6718':
		case '3552':
		case '5016':
		case '5017':
		case '5018':
		case '5019': 
		case '3476':
		case '7930': 
		case '5202':
	        case '4221':
                case '5203':
                case '4222':      
               	case '5204':
                case '4223':  
                case '5205':
                case '4224':
                case '5206':
                case '4225':
                case '5207':
                case '4226':
                case '5208': 
                case '4227':
                case '5209': 
                case '4228':
                case '5210':
                case '4229':
                case '5211':
                case '4230':
                case '5212':
                case '4231':
                case '5213':
                case '4232':
                case '5214':
                case '4233':
                case '5215':
                case '4234':
                case '5216':
                case '4235':
                case '5217':
                case '4236':
                case '5218':
                case '4237':
                case '5219':
                case '4238':
                case '4201':
                case '5221':
                case '4202':
                case '5222':
                case '4203':
                case '5223':
                case '4204':
                case '5224':
                case '4205':
                case '5225':
                case '4206':
                case '5226':
                case '4207':
                case '5227':
                case '4208':
                case '5228':
                case '4209':
                case '5229':
                case '4210':
                case '5230':
                case '4211':
                case '5231': result ='Direct';
                           break;

                case '3553':
                case '7000': result='Grievances';
			   break; 
		default:result ='';
		}
		return result;
}


function CheckDateTime()
{
	var d = new Date();
	var flag = '';
	if(d.getDay()>0&&d.getDay()<6)
	{              
	 if(d.getHours()>=9&&d.getHours()<18)
	{
	          flag = 'true';
	}



	else
	{
	flag = 'false';
	}
	}
	else
	{
	flag = 'false';
	}
	return flag;

}

function DaysDiff(FirstDate)
{
	//Previous date
	var diffDays = '';
	var FDate = FirstDate;
	var date1 =  FDate.slice(0,2);
    var month1 = FDate.slice(2,4);
    var year1 =  FDate.slice(4,8);
    
    //current date
    var dt = new Date();
	var date = dt.getDate();
	var month = dt.getMonth()+1;
	var year =dt.getFullYear();
    
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(year1,month1,date1);
    var secondDate = new Date(year,month,date);

    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    return diffDays;
	
}

function getUNSTiming(varCallRoutingTime)
{
	//varCallRoutingTime= 104513(HHMMSS);
	
	var result='';

	
	if ((varCallRoutingTime >= '205959')&&(varCallRoutingTime <= '235959'))
	{
		result = 'true';
	}
	else
	if ((varCallRoutingTime >= '000001')&&(varCallRoutingTime <= '070001'))
		{
			result = 'true';
		}
	
	else
	{
		result = 'false';
	}
	
       	return result;

}


function getElTiming()
{
	var result='';
	
	var CurrentDate = new Date();
	var WeekDay = CurrentDate.getDay();
	var varHr = CurrentDate.getHours();
	var varMin = CurrentDate.getMinutes();
	var varSec = CurrentDate.getSeconds();
	
	if ((String(varHr).length) == 1)
	{
		varHr  = '0' + ''+varHr ;
	}
	if ((String(varMin).length) == 1)
	{
		varMin  = '0' + ''+varMin ;
	}
	if ((String(varSec).length) == 1)
	{
		varSec  = '0' + ''+varSec ;
	}
	
	var Timing = varHr + '' + varMin + '' + varSec;
	
	
		if(Timing >= '070000' && Timing <= '235959')
		{
			result = 'True';
		}
		else
		{
			result = 'False';
		}
	
	return result;
}



function FormatTime(varhr,varmin,varsec)
{	var result = '';
	if ((String(varhr).length) == 1)
	{
		varhr  = '0' + ''+varhr ;
	}
	if ((String(varmin).length) == 1)
	{
		varmin  = '0' + ''+varmin ;
	}
	if ((String(varsec).length) == 1)
	{
		varsec  = '0' + ''+varsec ;
	}
	 result = varhr+':'+varmin+':'+varsec;
	return result;
}

 function Get104AccountNo(objaccountno, objcliaccountno, objstatus) {
       
        var straccountno = objaccountno.split("|");
        var strcliaccountno = objcliaccountno.split("|");
        var strStatus = objstatus.split("|");
var i=0;
        var strActiveAcno = "FALSE";

        for (i = 0; i < straccountno.length; i++) {
           
            if (objcliaccountno.search(straccountno[i]) != -1) {
           
			
				strActiveAcno =  straccountno[i];
				break;
			}
			else
			{
				strActiveAcno="FALSE";
			}
	                 
               
        }
      //  alert(strActiveAcno);
        return strActiveAcno;




    }

 function Get104AccountStat(objaccountno, objcliaccountno, objstatus) {
       
        var straccountno = objaccountno.split("|");
        var strcliaccountno = objcliaccountno.split("|");
        var strStatus = objstatus.split("|");
var i=0;

    //    var strActiveAcno;
        var strActiveAcnoStat = "CLOSED";

        for (i = 0; i < straccountno.length; i++) {
           
            if (objcliaccountno.search(straccountno[i]) != -1) 
			{
				strActiveAcnoStat =  strStatus[i];
				break;
			}
			else
			{
				strActiveAcnoStat="CLOSED";
			}
		
        }
      //  alert(strActiveAcno);
        return strActiveAcnoStat;




    }
 function Get104AccountNoExp(objaccountno, objcliaccountno, objstatus,objExpiry) {
       
        var straccountno = objaccountno.split("|");
        var strcliaccountno = objcliaccountno.split("|");
        var strStatus = objstatus.split("|");
	var strExpDate = objExpiry.split("|");
var i=0;
    //    var strActiveAcno;

	var strActiveAcnoExp = '0';

        for (i = 0; i < straccountno.length; i++) {
           
            if (objcliaccountno.search(straccountno[i]) != -1) 
{
				strActiveAcnoExp =  strActiveAcnoExp[i];
				break;
			}
			else
			{
				strActiveAcnoExp="FALSE";
			}
	
        }
        //alert(strActiveAcno);
        return  strActiveAcnoExp;




    }


function GetLOCAccountNo(objaccountno)
 {

        var straccountno = objaccountno.split("|");
	var tempACC='';
        var strActiveAcno;
	var i= 0;

        for (i = 0; i < straccountno.length; i++) 
{
 
		strActiveAcno =  straccountno[i];
if(strActiveAcno.length == '12')
{
		if((strActiveAcno.slice(4,6) != '14')&& (strActiveAcno.slice(4,6) != '15') && strActiveAcno.slice(4,6) != '24' && strActiveAcno.slice(4,6) != '25' && strActiveAcno.slice(4,6) != '20' && strActiveAcno.slice(4,6) != '10' && strActiveAcno.slice(4,6) != '11' )

		{
		 
			tempACC +=  strActiveAcno +'|';

		}
}
}

	tempACC = tempACC.replace(/\|$/, '');
//alert(tempACC)   ;    
 return tempACC;
    }

function ParseLOCCaptureDate(varyr,varmnth,vardt)
{	var result = '';
	if ((String(varmnth).length) == 1)
	
		varmnth = '0' + ''+varmnth ;
	
	if ((String(vardt).length) == 1)
	{
		vardt = '0' + ''+vardt ;
	}
	result = vardt +'-'+ varmnth +'-'+ varyr;
	return result;
}



function getTimestamp(varcaptdt,varhr,varmin,varsec)
{	var result = '';
	if ((String(varhr).length) == 1)
	{
		varhr  = '0' + ''+varhr ;
	}
	if ((String(varmin).length) == 1)
	{
		varmin  = '0' + ''+varmin ;
	}
	if ((String(varsec).length) == 1)
	{
		varsec  = '0' + ''+varsec ;
	}
	 result = varcaptdt+''+varhr+':'+varmin+':'+varsec;
	return result;
}

function GetDirectRouting(varBlockCode)
{
		var result ='';
		var inp = varBlockCode;
		switch(inp)
		{
		case 'A':
		case 'AW':
		case 'AV':
		case 'AX':
		case 'B':
		case 'B1':
		case 'BV':
		case 'BW':
		case 'BX': result ='Skill_67';
			   break;
		case 'C':
		case 'CLS C':
		case 'CLS D':
		case 'D':
		case 'E':
		case 'E1':
		case 'E2':
		case 'F':
		case 'G':
		case 'K':
		case 'L':
		case 'M':
		case 'Q':
		case 'Q1':
		case 'S':
		case 'T':
		case 'T1':
		case 'U': result ='Skill_164';
			   break;
		case 'J':		
		case 'J1':
		case 'J2': 
		case 'J3':
		case 'J4':
		case 'J5':
		case 'J7':
		case 'J9':	
		case 'MJ': 
		case 'SD': 
		case 'SDL1': 
		case 'SDL2': 
		case 'V': 
		case 'W': 
		case 'W0': 
		case 'Y': 
		case 'Y0': 
		case 'Z': 
		case 'Z0':  result ='Skill_161';
			   break;
		default:result ='';
		}
		return result;
}
function getCollectionTiming()
{
	var result='';
	
	var CurrentDate = new Date();
	var WeekDay = CurrentDate.getDay();
	var varHr = CurrentDate.getHours();
	var varMin = CurrentDate.getMinutes();
	var varSec = CurrentDate.getSeconds();
	
	if ((String(varHr).length) == 1)
	{
		varHr  = '0' + ''+varHr ;
	}
	if ((String(varMin).length) == 1)
	{
		varMin  = '0' + ''+varMin ;
	}
	if ((String(varSec).length) == 1)
	{
		varSec  = '0' + ''+varSec ;
	}
	
	var Timing = varHr + '' + varMin + '' + varSec;
	
	
		if(Timing >= '080000' && Timing <= '200000')
		{
			result = 'True';
		}
		else
		{
			result = 'False';
		}
	
	return result;
}
function GetCreditCard(input_accountno)
{

     var accountno = input_accountno.split("|");
     var temp_CC='';
     var str_CC_no;
     var i= 0;
     for (i = 0; i < accountno.length; i++) 
     {

		str_CC_no = accountno[i];
		if(str_CC_no.length == '15'|| str_CC_no.length == '16')
		{ 
			temp_CC +=  str_CC_no +'|';
		}
     }
	temp_CC = temp_CC.replace(/\|$/, '');
	return temp_CC;
}

function CCActTreatment(varBlocktype)
{
      var varSkill='';
      switch (varBlocktype)
      {
      case '':
            varSkill='';
            break;
      case 'A': 
      case 'AV': 
      case 'AW': 
      case 'AX': 
      case 'B': 
      case 'B1': 
      case 'BV': 
      case 'BW': 
      case 'BX': 
      case 'H': 
      case 'I': 
      case 'N': 
      case 'N1': 
      case 'NEW': 
      case 'NORM': 
      case 'P': 
      case 'P1': 
      case 'R': 
      case 'R1': 
      case 'REJC': 
      case 'SV': 
      case 'TEST': 
      case 'X': 
            varSkill ='PM';
            break;
      case 'J': 
      case 'J1': 
      case 'J2': 
      case 'J3': 
      case 'J4': 
      case 'J5': 
      case 'J7': 
      case 'J9': 
      case 'MJ': 
      case 'SD': 
      case 'SDL1': 
      case 'SDL2': 
      case 'V': 
      case 'W': 
      case 'WO': 
      case 'Y': 
      case 'YO': 
      case 'Z': 
      case 'ZO': 
            varSkill ='Skill_161';
            break;
      case 'C': 
      case 'CLSC': 
      case 'CLSD': 
      case 'D': 
      case 'E': 
      case 'E1': 
      case 'E2': 
      case 'F': 
      case 'G': 
      case 'G2': 
      case 'K': 
      case 'L': 
      case 'M': 
      case 'Q': 
      case 'Q1': 
      case 'S': 
      case 'T': 
      case 'T1': 
      case 'U': 
            varSkill ='Skill_164';
            break;
      default:
            varSkill='PM';          
      }
      
      return varSkill;
}

/* Card Blocking Treatment
 * This function will be used for getting desired skills against various block type of Card.
 * We will pass the BlockType as per the value received from WebService.
 */
function CardBlockTreatment (varBlocktype)
{
      var varSkill='';
      switch (varBlocktype)
      {
      case 'A':
      case 'AV':
      case 'AW':
      case 'AX':
      case 'B':
      case 'B1':
      case 'BV':
      case 'BW':
      case 'BX':
      case 'SV':
            varSkill ='Skill_ 67';
            break;
      case 'J':
      case 'J1':
      case 'J2':
      case 'J3':
      case 'J4':
      case 'J5':
      case 'J7':
      case 'J9':
      case 'MJ':
      case 'SD':
      case 'SDL1':
      case 'SDL2':
      case 'W':
      case 'WO':
      case 'Y':
      case 'YO':
      case 'Z':
      case 'ZO':
            varSkill ='Skill_ 161';
            break;
      case 'C':
      case 'CLSC':
      case 'CLSD':
      case 'D':
      case 'E':
      case 'E1':
      case 'E2':
      case 'F':
      case 'G':
      case 'G2':
      case 'I':
      case 'K':
      case 'L':
      case 'M':
      case 'Q':
      case 'Q1':
      case 'S':
      case 'T':
      case 'T1':
      case 'TEST':
      case 'U':
            varSkill ='Skill_ 164';
            break;
      case 'H':
      case 'N':
      case 'N1':
      case 'NEW':
      case 'NORM':
      case 'P':
      case 'P1':
      case 'R':
      case 'R1':
      case 'REJC':
            varSkill ='Skill_ 279';
            break;
      default:
            varSkill ='Skill_ 279';
            break;
      }
      
      return varSkill;
}
function getInput(objaccountno,objstatus,objCustName ,objCustId) {

        var straccountno = objaccountno.split("|");
        var strcustname = objCustName.split('|');
        var strstatus = objstatus.split("|");
	var custid = objCustId.split("|");
	        var inputsrting ='';
		var strActiveAcno;

		for(var i=0;i<straccountno.length ;i++)
		{		strActiveAcno =  straccountno[i];
			if(strActiveAcno.length == '12')
			{
			inputsrting +=straccountno[i]+'|'+strcustname[i]+'~';
			}
		}
		for(var i=0;i<custid.length ;i++)
		{			
					if(custid[i]!=custid[i+1])
					inputsrting +=custid[i]+'|'+strcustname[i]+'~';		
		}
		if(inputsrting != null || inputsrting != 'null' || inputsrting != '' || inputsrting != ' ' || inputsrting != 'undefined')
		{
		if(inputsrting.indexOf('undefined')!= -1)
				{
				//alert(inputsrting);
		
							inputsrting = inputsrting.replace('undefined~', '');
		
				}
		}
		
		inputsrting=inputsrting.replace(/\~$/, '');
	//alert(inputsrting);

		return inputsrting;
    }

function getInputCUSTId(objaccountno, objstatus, objCustName ) {

        var straccountno = objaccountno.split("|");
        var strcustname = objCustName.split('|');
        var strstatus = objstatus.split("|");
	        var inputsrting;
		var strActiveAcno;
		
		for(var i=0;i<straccountno.length ;i++)
		{strActiveAcno =  straccountno[i];
			if(strActiveAcno.length == '12')
{
			if(i==0)
			inputsrting=straccountno[i]+'|'+strcustname[i];
			else	
			inputsrting = inputsrting+'~'+straccountno[i]+'|'+strcustname[i];
}
		}
		
	//alert(inputsrting);
	if(inputsrting == null || inputsrting == 'null' || inputsrting == '' || inputsrting == ' ' || inputsrting == 'undefined')
	{
	inputsrting = "";
	}	
	if(inputsrting.indexOf('undefined')!= -1)
			{
			//alert(inputsrting);
	
						inputsrting = inputsrting.replace('undefined~', '');
	
			}

		return inputsrting;
    }
function getLinkedAccount(objaccountno,objcliaccountno)
{
      var straccountno = objaccountno.split("|");
        var strcliaccountno = objcliaccountno.split("|");
      //  alert("Hii");
 var i=0;

    //    var strActiveAcno;

	var strActiveAcnoExp = '';

        for (i = 0; i < straccountno.length; i++) {
           
            if (objcliaccountno.search(straccountno[i]) != -1) 
			{
				strActiveAcnoExp +=  straccountno[i]+'|';
				
			}
			
	
        }
        //alert(strActiveAcnoExp);
strActiveAcnoExp=strActiveAcnoExp.replace(/\|$/, '');
        return  strActiveAcnoExp;
    
}
function getIWSAuthString(objAccno,vbName,vbSegment)
{
//alert('hii');
var multipleAccNo = objAccno.split('|');
var accno='';
var custname=vbName;
var segment=vbSegment.split("|");
//var custid = objCustId.split("|");

//alert(multipleAccNo);

for(var i=0;i<multipleAccNo.length;i++)
{
 var vcc =multipleAccNo[i]
if(vcc.length == '12')
  accno += multipleAccNo[i]+'|'+custname+'|Single|'+segment[1]+'|Not Enrolled|||'+'~';
}
// alert(accno);
accno=accno.replace(/\~$/, '');

return accno;
    
}

function getCLIVA_DeatilsString(objVbOutput,vbName,vbStatus,vbSegment)
{
//alert('hii');
var multipleAccNo = objVbOutput.split('~');
var accno='';
var status=vbStatus.split("|");
var enrolStatus;
var subStringaccno1;
var subStringaccno;
var custname=vbName.split('|');
var segment=vbSegment.split("|");
//alert(multipleAccNo);

for(var i=0;i<multipleAccNo.length;i++)
{
 subStringaccno1=multipleAccNo[i];
  subStringaccno=subStringaccno1.split('|');
 accno +=subStringaccno[0] +'|'+subStringaccno[1]+'|'+status[i]+'|'+segment[0]+'|'+subStringaccno[2]+'|||'+'~';
}
// alert(accno);
accno=accno.replace(/\~$/, '');
return accno;
    
}
function getCLIVA_DeatilsString1(objVbOutput,vbName,vbStatus,vbSegment)
{
//alert('hii');
var multipleAccNo = objVbOutput.split('~');
var accno='';
var status=vbStatus.split('|');
var enrolStatus;
var subStringaccno1;
var subStringaccno;
var custname=vbName.split('|');
var segment=vbSegment.split("|");
//alert(multipleAccNo);

for(var i=0;i<multipleAccNo.length;i++)
{
 subStringaccno1=multipleAccNo[i];
  subStringaccno=subStringaccno1.split('|');
 accno +=subStringaccno[0] +'|'+subStringaccno[1]+'|'+status[i]+'|'+segment[1]+'|'+subStringaccno[2]+'|||'+'~';
}
// alert(accno);
accno=accno.replace(/\~$/, '');
return accno;
    
}
function getIWSEnrollmentStatus(objAccno)
{
//alert('hii');
var multipleAccNo = objAccno.split('|');
var accno='';
//alert(multipleAccNo);

for(var i=0;i<multipleAccNo.length;i++)
{ 
	var vcc =multipleAccNo[i];
 accno += multipleAccNo[i]+'-Not Enrolled' +'|';
}
accno=accno.replace(/\|$/, '');
// alert(accno);
return accno;
    
}
function getIWSCLIEnrollmentStatus(objVbOutput)
{
var multipleAccNo = objVbOutput.split('~');
var accno='';
var subStringaccno1;
var subStringaccno;
//alert(multipleAccNo);

for(var i=0;i<multipleAccNo.length;i++)
{
 subStringaccno1=multipleAccNo[i];
  subStringaccno=subStringaccno1.split('|');
 accno +=subStringaccno[0] +'|'+subStringaccno[2]+'~';
}
// alert(accno);

accno=accno.replace(/\~$/, '');
return accno;
    
}

function getIWSCLIAccStatus(objVbOutput)
{
var multipleAccNo = objVbOutput.split('~');
var accno='';
var subStringaccno1;
var subStringaccno;
//alert(multipleAccNo);

for(var i=0;i<multipleAccNo.length;i++)
{
 subStringaccno1=multipleAccNo[i];
  subStringaccno=subStringaccno1.split('|');
 accno +=subStringaccno[0] +'|'+subStringaccno[1]+'~';
}
// alert(accno);

accno=accno.replace(/\~$/, '');
return accno;
    
}

function getMultipleAccNo1(objAccno)
{
//alert('hii');
var multipleAccNo = objAccno.split('|');
var accno='';
//alert(multipleAccNo);

for(var i=0;i<multipleAccNo.length;i++)
{
	var vccc=multipleAccNo[i];
	if(vccc.length==12) 
 accno += multipleAccNo[i]+'|';
}

accno=accno.replace(/\|$/, '');
 //alert(accno);
return accno;
    
}

function getEnrollStatus(objVbOutput)
{
var multipleAccNo = objVbOutput.split('~');
var accno='';
var accStatus;
var enrollStatus;
for(var i=0;i<multipleAccNo.length;i++)
{
accno =multipleAccNo[i];
accStatus=accno.split('|');

if(accStatus[2]== 'Enrolled')
{
enrollStatus ='TRUE';
break;
}
else
enrollStatus ='FALSE';
}
// alert(enrollStatus);
return enrollStatus;
    
}
function getIWSAuthString1(objAccno,vbName,vbSegment,objCustId)
{
//alert('hii');
var multipleAccNo = objAccno.split('|');
var accno='';
var custname=vbName;
var segment=vbSegment.split("|");
var custid = objCustId.split("|");

//alert(multipleAccNo);

for(var i=0;i<multipleAccNo.length;i++)
{
 var vcc =multipleAccNo[i]
if(vcc.length == '12')
  accno += multipleAccNo[i]+'|'+custname+'|Single|'+segment[1]+'|Not Enrolled|||'+'~';
}
for(var i=0;i<custid.length ;i++)
		{
			if(i==0)
                           accno += custid[i]+'|'+custname+'|Single|'+segment[1]+'|Not Enrolled|||'+'~';
			
		}
// alert(accno);
accno=accno.replace(/\~$/, '');

return accno;
    
}

function getIWSEnrollmentStatus1(objAccno,objcustid)
{
//alert('hii');
var multipleAccNo = objAccno.split('|');
var custid =objcustid.split('|');

var accno='';
//alert(multipleAccNo);

for(var i=0;i<multipleAccNo.length;i++)
{ 
	var vcc =multipleAccNo[i];
if(vcc.length=='12')
 accno += multipleAccNo[i]+'-Not Enrolled' +'|';
}
{
			if(i==0)
                           accno += custid[i]+'-Not Enrolled' ;
			
		}
accno=accno.replace(/\|$/, '');
// alert(accno);
return accno;
    
}


function LocalTrnxTime1(varcaptdt,varhr,varmin,varsec)
{	var result = '';
	if ((String(varhr).length) == 1)
	{
		varhr  = '0' + ''+varhr ;
	}
	if ((String(varmin).length) == 1)
	{
		varmin  = '0' + ''+varmin ;
	}
	if ((String(varsec).length) == 1)
	{
		varsec  = '0' + ''+varsec ;
	}
	 result = varcaptdt+' '+varhr+':'+varmin+':'+varsec;
	return result;
}

function replaceCharacter(obCustName)
{
if(obCustName.search('&') != -1)
	{
		obCustName = obCustName.replace("&","and");
	}
	 //alert(obCustName);
       return obCustName;
    
}


//////////added on 003022015 Kanchan RMNFlag in FCRM


function getDCCrmRMNString(actcode,lang,travstring,name,cardnum,crn,calluuid,RMNFlag)
{
var result ='UUI=';
//var result = "aaa";
//var accnum = "015101573832";
//var actcode = "000";
//var lang='E'
//var travstring='AZAYZZ';
//var name='PARUL Batra';
//var cardnum='123456789012345';
//var crn='1234567891';
	if (crn != null)
	{

		if (crn.length == 12)
		{
		result = result + crn+'        ';
		}
		else
		{
		result = result + '                    ';
		}

        }
        else
        {
           result = result + '                    ';
        }
	if (actcode != null)
	{
		if (actcode.length == 3)
		{
			result = result + 'A'+''+actcode+''+lang+' ';
		}
			else
		{
			result = result+''+'A104'+''+lang+' ';
		}

	}
	else
	{
	 result = result+''+'A104'+''+lang+' ';
	}

	if(travstring != null)
	{
	if (travstring.length <= 16)
		   {
		     var numspace = 16-travstring.length;
		     result = result + ''+ travstring;
		      	for (var i=0;i<numspace;i++)
		       	{
		        	 result = result + ' ';

		  	}
		  }

		 else if(travstring.length > 16)
		  {
		    result = result + ''+ travstring.slice(0,15);
		  }
		 else
		  {
		       for (var i=0;i<16;i++)
		         {
		          result = result + ' ';
		         }
		 }
	 }
	 else
	 {
	 		for (var i=0;i<16;i++)
	 		         {
	 		          result = result + ' ';
		         }
	 }

	 if (name != null)
	{

	 			if (name.length <=20)
	 	 	 	{
	 	 	 	var numspace =20-name.length
	 	 	  	result = result + ''+ name;
	 	 	    	for (var i=0;i<numspace;i++)
	 	 	           {
	 	 	            result = result + ' ';
	 	 	           }

	 	 	 	}
	 	 	 	else if(name.length > 20)
	 	 	 	{
	 	 	 	result = result + ''+ name.slice(0,20);


	 	 	 	}
	 	 	 	else
	 	 	 	{
	 	 	 		for (var i=0;i<20;i++)
	 	 	           	{
	 	 	           	 result = result + ' ';
	 	 	           	}

	 	 		}




	 	}
	 	else
	 	{
	 	      for (var i=0;i<20;i++)
			{
			   result = result + ' ';
			}
	 	}

	 	if (cardnum != null)
	 	{
	 		if (cardnum.length == 16)

	 	 	{

	 	 			result = result + ''+ cardnum;


	 	 			}
	 	 			else
	 	 			{
	 	 			for (var i=0;i<16;i++)
	 	 		          {
	 	 		           result = result + ' ';
	 	 		          }

	 	 			}

	 	}
	 	else
	 	{
			for (var i=0;i<16;i++)
			{
			   result = result + ' ';
			}

	 	}
	 	if (calluuid != null)
				 	{
				 		if (calluuid.length == 32)
				 			{
					
				 			result = result + ''+ calluuid;
					 		
				 			}
							else
							{
							for (var i=0;i<32;i++)
						          {
					 		           result = result + ' ';
					 	          }
					 		
							}
					 	
					}
				else
					{
						for (var i=0;i<32;i++)
						{
				      			result = result + ' ';
								 		          
						}
					 	
						
			}
		if (RMNFlag != null)
			{
				if (RMNFlag.length == 1)
					{
						result = result + ''+ RMNFlag;
					}
				else
					{
						 result = result + ''+ 'N';
					}
		
			}
		else
			{
				 result = result + ''+ 'N';
		 	}

	return result;

}



function getCrmRMNString(actcode,lang,travstring,name,cardnum,crn,calluuid,RMNFlag)
{
var result ='UUI=';
//var result = "aaa";
//var accnum = "015101573832";
//var actcode = "000";
//var lang='E'
//var travstring='AZAYZZ';
//var name='PARUL Batra';
//var cardnum='123456789012345';
//var crn='1234567891';
	if (crn != null)
	{
		if (crn.length == 11)
		{
		result = result + crn+'         ';
		} 
		else
		{
		result = result + '                    ';
		}
        
        }
        else
        {
           result = result + '                    ';
        }
	if (actcode != null)
	{
		if (actcode.length == 3)
		{
			result = result + 'D'+''+actcode+''+lang+' ';
		}
			else
		{
			result = result+''+'D104'+''+lang+' ';
		}

	}
	else
	{
	 result = result+''+'D104'+''+lang+' ';
	}
	
	if(travstring != null)
	{
	if (travstring.length <= 16)
		   {
		     var numspace = 16-travstring.length;
		     result = result + ''+ travstring;
		      	for (var i=0;i<numspace;i++)
		       	{
		        	 result = result + ' ';
		          	
		  	}
		  }
		 	
		 else if(travstring.length > 16)
		  {
		    result = result + ''+ travstring.slice(0,15);
		  }
		 else
		  { 
		       for (var i=0;i<16;i++)
		         {
		          result = result + ' ';
		         }
		 }
	 }
	 else
	 {
	 		for (var i=0;i<16;i++)
	 		         {
	 		          result = result + ' ';
		         }
	 }
	 
	 if (name != null)
	{
	 
	 			if (name.length <=20)
	 	 	 	{
	 	 	 	var numspace =20-name.length
	 	 	  	result = result + ''+ name;
	 	 	    	for (var i=0;i<numspace;i++)
	 	 	           {
	 	 	            result = result + ' ';
	 	 	           }
	 	 	 
	 	 	 	}
	 	 	 	else if(name.length > 20)
	 	 	 	{
	 	 	 	result = result + ''+ name.slice(0,20);
	 	 	 
	 	 	 
	 	 	 	}
	 	 	 	else
	 	 	 	{
	 	 	 		for (var i=0;i<20;i++)
	 	 	           	{
	 	 	           	 result = result + ' ';
	 	 	           	}
	 	 	 
	 	 		}
	 	 		
	 	 		
	 
	 
	 	}
	 	else
	 	{
	 	      for (var i=0;i<20;i++)
			{
			   result = result + ' ';
			}
	 	}
	 	
	 	if (cardnum != null)
	 	{
	 		if (cardnum.length == 16)
	 	 	
	 	 	{
	 	 			
	 	 			result = result + ''+ cardnum;
	 	 			
	 	 		
	 	 			}
	 	 			else
	 	 			{
	 	 			for (var i=0;i<16;i++)
	 	 		          {
	 	 		           result = result + ' ';
	 	 		          }
	 	 		
	 	 			}
	 		
	 	}
	 	else
	 	{
			for (var i=0;i<16;i++)
			{
			   result = result + ' ';
			}
	 	
	 	}
	 	if (calluuid != null)
				 	{
				 		if (calluuid.length == 32)
				 			{
					
				 			result = result + ''+ calluuid;
					 		
				 			}
							else
							{
							for (var i=0;i<32;i++)
						          {
					 		           result = result + ' ';
					 	          }
					 		
							}
					 	
					}
				else
					{
						for (var i=0;i<32;i++)
						{
				      			result = result + ' ';
								 		          
						}
					 	
						
			}
		if (RMNFlag != null)
					{
						if (RMNFlag.length == 1)
							{
								result = result + ''+ RMNFlag;
							}
						else
							{
								 result = result + ''+ 'N';
							}
				
					}
				else
					{
						 result = result + ''+ 'N';
		 	}
	 	
	return result;

}



function getDematCrmRMNString(actcode,lang,travstring,name,cardnum,DematAccNo,calluuid,RMNFlag)
{
var result ='UUI=';
//var result = "aaa";
//var accnum = "015101573832";
//var actcode = "000";
//var lang='E'
//var travstring='AZAYZZ';
//var name='PARUL Batra';
//var cardnum='123456789012345';
//var crn='1234567891';
	if (DematAccNo != null)
	{
		if (DematAccNo.length == 16)
		{
		result = result + DematAccNo+'    ';
		} 
		else
		{
		result = result + '                    ';
		}
        
        }
        else
        {
           result = result + '                    ';
        }
	if (actcode != null)
	{
		if (actcode.length == 3)
		{
			result = result + ' '+''+actcode+''+lang+' ';
		}
			else
		{
			result = result+''+' 104'+''+lang+' ';
		}

	}
	else
	{
	 result = result+''+' 104'+''+lang+' ';
	}
	
	if(travstring != null)
	{
	if (travstring.length <= 16)
		   {
		     var numspace = 16-travstring.length;
		     result = result + ''+ travstring;
		      	for (var i=0;i<numspace;i++)
		       	{
		        	 result = result + ' ';
		          	
		  	}
		  }
		 	
		 else if(travstring.length > 16)
		  {
		    result = result + ''+ travstring.slice(0,15);
		  }
		 else
		  { 
		       for (var i=0;i<16;i++)
		         {
		          result = result + ' ';
		         }
		 }
	 }
	 else
	 {
	 		for (var i=0;i<16;i++)
	 		 {
	 		          result = result + ' ';
		         }
	 }
	 
	 result = result + '                    ';
	 
//	 if (name != null)
//	{
//	 
//	 			if (name.length <=20)
//	 	 	 	{
//	 	 	 	var numspace =20-name.length
//	 	 	  	result = result + ''+ name;
//	 	 	    	for (var i=0;i<numspace;i++)
//	 	 	           {
//	 	 	            result = result + ' ';
//	 	 	           }
//	 	 	 
//	 	 	 	}
//	 	 	 	else if(name.length > 20)
//	 	 	 	{
//	 	 	 	result = result + ''+ travstring.slice(0,20);
//	 	 	 
//	 	 	 
//	 	 	 	}
//	 	 	 	else
//	 	 	 	{
//	 	 	 		for (var i=0;i<20;i++)
//	 	 	           	{
//	 	 	           	 result = result + ' ';
//	 	 	           	}
//	 	 	 
//	 	 		}
//	 	 		
//	 	 		
//	 }
//	 	else
//	 	{
//	 	      for (var i=0;i<20;i++)
//			{
//			   result = result + ' ';
//			}
//	 	}
	 	
	 	if (DematAccNo != null)
	 	{
	 		if (DematAccNo.length == 16)
	 	 	
	 	 	{
	 	 			
	 	 			result = result + ''+ DematAccNo;
	 	 			
	 	 			}
	 	 			else
	 	 			{
	 	 			for (var i=0;i<16;i++)
	 	 		          {
	 	 		           result = result + ' ';
	 	 		          }
	 	 		
	 	 			}
	 		
	 	}
	 	else
	 	{
			for (var i=0;i<16;i++)
			{
			   result = result + ' ';
			}
	 	
	 	}
	 	if (calluuid != null)
				 	{
				 		if (calluuid.length == 32)
				 			{
					
				 			result = result + ''+ calluuid;
					 		
				 			}
							else
							{
							for (var i=0;i<32;i++)
						          {
					 		           result = result + ' ';
					 	          }
					 		
							}
					 	
					}
				else
					{
						for (var i=0;i<32;i++)
						{
				      			result = result + ' ';
								 		          
						}
					 	
						
			}
	 	if (RMNFlag != null)
					{
						if (RMNFlag.length == 1)
							{
								result = result + ''+ RMNFlag;
							}
						else
							{
								 result = result + ''+ 'N';
							}
				
					}
				else
					{
						 result = result + ''+ 'N';
		 	}
	return result;

}



function getApinCrmRMNString(accnum,actcode,lang,travstring,expdt,name,cardnum,calluuid,RMNFlag)
		{
		var result ='UUI=';
		//var result = "aaa";
		//var accnum = "015101573832";
		//var actcode = "000";
		//var lang='E'
		//var travstring='AZAYZZ';
		//var name='PARUL Batra';
		//var cardnum='123456789012345';
		//var crn='1234567891';
		
			if (accnum.length == 12)
			{
			result = result + accnum +'        ';
			} 
			else
			{
			//12 spaces
			result = result + '                    ';
			}
			
			
			if (actcode.length == 3)
			{
				result = result + 'A'+''+actcode+''+lang+' ';
			}
				else
			{
				result = result+''+'A104'+''+lang+' ';
			}
			
			
			
			if (travstring.length <= 12)
				   {
				     var numspace = 12-travstring.length;
				     result = result + ''+ travstring;
				      	for (var i=0;i<numspace;i++)
				       	{
				        	 result = result + ' ';
				          	
				  	}
				  }
				 	
				 else if(travstring.length > 12)
				  {
				    result = result + ''+ travstring.slice(0,11);
				  }
				 else
				  { 
				       for (var i=0;i<12;i++)
				         {
				          result = result + ' ';
				         }
				 }
			 
			 //Expiry date string.....
			if (expdt != null)				
			{
			 if (expdt.length == 4)
		 	{
			
			  	result = result + ''+ expdt;
			 			    
		          
		 	}
		 	else 
		 	{
		 	
			  	result = result + '    ';
		 
		 	}
			}
			else
			{
		 	
			  	result = result + '    ';
		 
		 	} 
		 				 	
			 
			 	if (name.length <=20)
			 	{
			 	var numspace =20-name.length
			  	result = result + ''+ name;
			    	for (var i=0;i<numspace;i++)
			           {
			            result = result + ' ';
			           }
			 
			 	}
			 	else if(name.length > 20)
			 	{
			 	result = result + ''+ name.slice(0,20);
			 
			 
			 	}
			 	else
			 	{
			 		for (var i=0;i<20;i++)
			           	{
			           	 result = result + ' ';
			           	}
			 
				}
				
					
				
			if (cardnum.length == 16)
			{
			
			result = result + ''+ cardnum;
			
		
			}
			else
			{
			for (var i=0;i<16;i++)
		          {
		           result = result + ' ';
		          }
		
			}
		
			if (calluuid != null)
				 	{
				 		if (calluuid.length == 32)
				 			{
					
				 			result = result + ''+ calluuid;
					 		
				 			}
							else
							{
							for (var i=0;i<32;i++)
						          {
					 		           result = result + ' ';
					 	          }
					 		
							}
					 	
					}
				else
					{
						for (var i=0;i<32;i++)
						{
				      			result = result + ' ';
								 		          
						}
					 	
						
			}				
			if (RMNFlag != null)
				{
						if (RMNFlag.length == 1)
							{
								result = result + ''+ RMNFlag;
							}
						else
							{
								 result = result + ''+ 'N';
							}
							
				}
			else
				{
					 result = result + ''+ 'N';
		 		}
		
			return result;
		
		}
		
		


function getCreditCardCrmRMNString(actcode,lang,travstring,name,cardnum,calluuid,RMNFlag)
{
var result ='UUI=';
//var result = "aaa";
//var accnum = "015101573832";
//var actcode = "000";
//var lang='E'
//var travstring='AZAYZZ';
//var name='PARUL Batra';
//var cardnum='123456789012345';
//var crn='1234567891';
	if (cardnum != null)
	{
		if (cardnum.length == 16)
		{
		result = result + cardnum+'    ';
		} 
		else if (cardnum.length == 15)
		{
			result = result + cardnum +'     ';
		}	        
		else
		    {
		    	result = result + '                    ';		
    		}
    }
    else
    {
    	result = result + '                    ';		
    }
	if (actcode != null)
	{
		if (actcode.length == 3)
		{
			result = result + 'B'+''+actcode+''+lang+' ';
		}
		else
		{
			result = result + 'B107'+lang+' ';
		}
	}
	else
	{
		result = result+''+'B117'+''+lang+' ';
	}
	
	if(travstring != null)
	{
		if (travstring.length <= 16)
		{
			var numspace = 16 - travstring.length;
		    result = result + ''+ travstring;
			for (var i=0;i<numspace;i++)
			{
				 result = result + ' ';			      	
			}
		}		 	
		else if(travstring.length > 16)
		{
		    result = result + ''+ travstring.slice(0,15);
		}
		else
		{ 
			for (var i=0;i<16;i++)
			{
			      result = result + ' ';
			}
		}
	 }
	 else
	 {
		for (var i=0;i<16;i++)
		{
		  result = result + ' ';
		}
	 }
	 
	 if (name != null)
	 {	 
		if (name.length <=20)
		{
			var numspace =20-name.length
			result = result + ''+ name;
			for (var i=0;i<numspace;i++)
		    {
				result = result + ' ';
		    }		 
		 }
		 else if(name.length > 20)
		 {
		 	result = result + ''+ name.slice(0,20);
		 }
		 else
		 {
			 for (var i=0;i<20;i++)
		     {
				 result = result + ' ';
		     }		 
		 }
	 	}
	 	else
	 	{
	 	      for (var i=0;i<20;i++)
			{
			   result = result + ' ';
			}
	 	}
	 	
	 	if (cardnum != null)
	 	{
	 		if (cardnum.length == 16)	 	 	
	 	 	{
	 			result = result + ''+ cardnum;
	 	 	}
	 	 	else if (cardnum.length == 15)	 	 	
	 	 	{
	 	 		result = result + ''+ cardnum + ' ';
	 	 	}
	 		else
	 	 	{
	 			for (var i=0;i<16;i++)
	 	 		{
	 				result = result + ' ';
	 	 		} 	 		
	 	 	}	 		
	 	}
	 	else
	 	{
			for (var i=0;i<16;i++)
			{
			   result = result + ' ';
			}	 	
	 	}
	 	if (calluuid != null)
				 	{
				 		if (calluuid.length == 32)
				 			{
					
				 			result = result + ''+ calluuid;
					 		
				 			}
							else
							{
							for (var i=0;i<32;i++)
						          {
					 		           result = result + ' ';
					 	          }
					 		
							}
					 	
					}
				else
					{
						for (var i=0;i<32;i++)
						{
				      			result = result + ' ';
								 		          
						}
					 	
						
			}
	 	if (RMNFlag != null)
				{
					if (RMNFlag.length == 1)
						{
							result = result + ''+ RMNFlag;
						}
					else
						{
							 result = result + ''+ 'N';
						}
									
				}
		else
				{
					 result = result + ''+ 'N';
		 		}
	return result;

}

function getTimelogic(varTimelogic)
{
	//varTimelogic= 104513(HHMMSS);
	
	var result='';

	
	if ((varTimelogic >= '205959')&&(varTimelogic <= '235959'))
	{
		result = 'true';
	}
	else
	if ((varTimelogic >= '000001')&&(varTimelogic <= '070000'))
		{
		result = 'true';
		}
	
	else
	{
	result = 'false';
	}
	
       	return result;

}

function GetDate_EPMS()
{
var dt = new Date();

var day = dt.getDate();
var month = dt.getMonth()+1;
var year =dt.getFullYear();
if (String(day).length == 1)
{
day = '0'+''+day;
}
if  (String(month).length == 1)
{
month= '0'+''+month;
}

return year+''+month+''+day

}


function getBkndDwnValue(ActCode)
{

	var BkndDown_Flag = '0';             //if this value is 1 the function will never return DOWN
	var retResult = 'UP';
	if((BkndDown_Flag == '0')&&(ActCode=='950' || ActCode=='955' || ActCode=='961' || ActCode=='998') )
	{
		retResult = 'DOWN';
	}
	return retResult;
	
}

function isSavingAccount(objaccountno)
{

        var straccountno = objaccountno.split("|");
	var result = 'FALSE';	
		for(var i=0;i<straccountno.length ;i++)
		{
			var strActiveAcno =  straccountno[i];
				if(strActiveAcno.length == '12')
				{
					result = 'TRUE';
					break;
				}
		}

		return result;
		//alert(result);
    }

function replaceCharacter1(objCustName)
{
  var custname = objCustName.split('~');
  	var obCustName;
  	var finalName ='';
  	//var custname = objCustName.split('#');
  	//var obCustName;
  	//var finalName ='';
  	for(var i =0;i<custname.length;i++)
  	{
  		obCustName=custname[i];
  		if(obCustName.search('#') != -1)
  		{
  		obCustName = obCustName.replace("#","and");
  		}
  		if(obCustName.search('<') != -1)
  		{
  		obCustName = obCustName.replace("<"," ");
  		}
  		if(obCustName.search('>') != -1)
  		{
  		obCustName = obCustName.replace(">"," ");
  		}
  		if(obCustName.search("|") != -1)
  		{
  		obCustName = obCustName.replace("|"," and ");
  		}
  		finalName +=obCustName +'|';		
  	} 	
  	
  		finalName =finalName.replace(/\|$/, '');
  		//alert(finalName);
       		return finalName;
       		
}

function getInputWithCustId(objCustName,objCustId)
 {

        var strcustname = objCustName.split('|');
        var custid = objCustId.split("|");
	        var inputsrting;
		var strActiveAcno;
		 
		for(var i=0;i<custid.length ;i++)
		{//alert(i);
			
			if(i==0)
			inputsrting = custid[i]+'|'+strcustname[i];
			else
			if(custid[i]!=custid[i+1])
			inputsrting = inputsrting+'~'+custid[i]+'|'+strcustname[i];
		}
//	alert(inputsrting);
	return inputsrting;
    }
    
    
    
    function getJointName(objAccstatus,objCustName)
    {
    
    	var accStatus= objAccstatus.split("|");
    	var CustName =objCustName.split("|");
    	var result =CustName[0];
    		for(var i=0;i<accStatus.length;i++)
    		{
    			if(accStatus[i]== 'Joint')
    			{
    			result =CustName[i];
    			break;
    			}
    		}
    	return result;
    }
    
    
function getIWSAuthStringDB(objAccno,vbName,vbSegment)
{
//alert('hii');
var multipleAccNo = objAccno.split('|');
var accno='';
var custname=vbName.split("|");
var segment=vbSegment.split("|");
//var custid = objCustId.split("|");

//alert(multipleAccNo);

for(var i=0;i<multipleAccNo.length;i++)
{
 var vcc =multipleAccNo[i]
if(vcc.length == '12')
  accno += multipleAccNo[i]+'|'+custname[i]+'|Single|'+segment[1]+'|Not Enrolled|||'+'~';
}
// alert(accno);
accno=accno.replace(/\~$/, '');

return accno;
    
}

function getIWSAuthStringDBID(objAccno,vbName,vbSegment,objCustId)
{
//alert('hii');
var multipleAccNo = objAccno.split('|');
var accno='';
var custname=vbName.split("|");
var segment=vbSegment.split("|");
var custid = objCustId.split("|");

//alert(multipleAccNo);

for(var i=0;i<multipleAccNo.length;i++)
{
 var vcc =multipleAccNo[i]
if(vcc.length == '12')
  accno += multipleAccNo[i]+'|'+custname[i]+'|Single|'+segment[1]+'|Not Enrolled|||'+'~';
}
for(var i=0;i<custid.length ;i++)
		{
			if(i==0)
                           accno += custid[i]+'|'+custname[i]+'|Single|'+segment[1]+'|Not Enrolled|||'+'~';
			
		}
// alert(accno);
accno=accno.replace(/\~$/, '');

return accno;
    
}


function getInputDC(objaccountno,objstatus,objCustName ,objCustId) {

        var straccountno = objaccountno.split("|");
        var strcustname = objCustName.split('|');
        var strstatus = objstatus.split("|");
	var custid = objCustId.split("|");
	        var inputsrting='';
		var strActiveAcno;

		for(var i=0;i<straccountno.length ;i++)
		{		strActiveAcno =  straccountno[i];
			if(strActiveAcno.length == '12')
			{
				inputsrting +=straccountno[i]+'|'+strcustname[0]+'~';
			}
		}
		for(var i=0;i<custid.length ;i++)
		{			
			if(i==0)
			inputsrting += custid[i]+'|'+strcustname[0]+'~';
			else
			if(custid[i]!=custid[i+1])
			inputsrting = inputsrting+'~'+custid[i]+'|'+strcustname[0];
		}
	//alert(inputsrting);
	return inputsrting;
    }

function getInputCUSTIdDC(objaccountno, objstatus, objCustName ) {

        var straccountno = objaccountno.split("|");
        var strcustname = objCustName.split('|');
        var strstatus = objstatus.split("|");
	        var inputsrting;
		var strActiveAcno;
		
		for(var i=0;i<straccountno.length ;i++)
		{strActiveAcno =  straccountno[i];
			if(strActiveAcno.length == '12')
{
			if(i==0)
			inputsrting=straccountno[i]+'|'+strcustname[0];
			else	
			inputsrting = inputsrting+'~'+straccountno[i]+'|'+strcustname[0];
}
		}
		
	//alert(inputsrting);

		return inputsrting;
    }
    
    
    function getAccountStatus(objAccstatus)
    {
    
    	var accStatus= objAccstatus.split("|");
    	var result ='Single';
    		for(var i=0;i<accStatus.length;i++)
    		{
    			if(accStatus[i]== 'Joint')
    			{
    			result ='Joint';
    			break;
    			}
    		}
    	return result;
    }

function savingAccount(objaccountno)
{

        var straccountno = objaccountno.split("|");
        //alert(straccountno);
		var result = '';
		var strActiveAcno = '';
		for(var i=0;i<straccountno.length;i++)
		{

		strActiveAcno =  straccountno[i];

		if(strActiveAcno.length == '12' && (strActiveAcno.slice(4,6) == '01'))
		{
				 if(result.search(strActiveAcno) == -1)

					result = result + strActiveAcno +'|';


		}
		}





		result = result.replace(/\|$/, '');
		if (result == '')
		{
			var strActiveAcno = '';
				for(var i=0;i<straccountno.length;i++)
				{
				strActiveAcno =  straccountno[i];
				if(strActiveAcno.length == '12' )
					{
						if(result.search(strActiveAcno) == -1)
							{
								result = result + strActiveAcno +'|';
							}
					}

				}

		}


		//alert (result);
		return result;


}
    
    
    function multiplCCSingle(varacc,varcustid)
    	{
    	
    		var accountno = varacc.split("|");
    		var customerID = varcustid.split("|");
    		var result='';
    		var j = 0;
    		for(var i = 0 ; i< accountno.length ;i++)
    			{
    				var singleacc = accountno[i];
    				if(singleacc.length == '16' && singleacc.slice(0,1) != 'L')
    				{
    					if( j< customerID.length)
    					{
    					//alert(customerID.length-1);
    					result += singleacc+'|';				
    					j++;
    					}	
    				}
    			}
    		return result;
    	//	alert(result);
	}
	
	
	function multipleCC1(varacc1,varcustid1,varacc2,varcustid2)
		{
		
			var accountno = varacc1.split("|");
			var customerID = varcustid1.split("|");
			var result='';
			var j = 0;
			for(var i = 0 ; i< accountno.length ;i++)
				{
					var singleacc = accountno[i];
					if(singleacc.length == '16'&& singleacc.slice(0,1) != 'L')
					{
						if( j< customerID.length)
						{
						result += singleacc+'|';				
						j++;
						}	
					}
				}
			var accountno = varacc2.split("|");
			var customerID = varcustid2.split("|");
			var k = 0;
			for(var i = 0 ; i< accountno.length ;i++)
				{
					var singleacc = accountno[i];
					if(singleacc.length == '16')
					{
						if( k< customerID.length-1)
						{
						result += singleacc+'|';				
						k++;
						}	
					}
				}
	
			return result;
		//	alert(result);
	}
	
	
	function isLoanAcc(objaccountno)
	{
	
	        var straccountno = objaccountno.split("|");
		var result = '';	
		var strActiveAcno = '';
	
			for(var i=0;i<straccountno.length ;i++)
			{
				 strActiveAcno =  straccountno[i];
					if(strActiveAcno.length == '16' && strActiveAcno.slice(0,1) == 'L')
					{
						result +=strActiveAcno +'|';
					}
			}
		result = result.replace(/\|$/, '');
			return result;
			//alert(result);
    }
    
    function isDematAcc(objaccountno)
    {
    
            var straccountno = objaccountno.split("|");
    	var result = '';	
    	var strActiveAcno = '';
    
    		for(var i=0;i<straccountno.length ;i++)
    		{
    			 strActiveAcno =  straccountno[i];
    				if(strActiveAcno.length == '16' && (strActiveAcno.slice(0,2) == 'IN' ||strActiveAcno.slice(0,5) == '16014'))
    				{
    					result +=strActiveAcno +'|';
    				}
    		}
    	result = result.replace(/\|$/, '');
    		return result;
    		//alert(result);
    }
    
    function isTradeAcc(objaccountno)
    {
    
            var straccountno = objaccountno.split("|");
    	var result = '';	
    	var strActiveAcno = '';
    
    		for(var i=0;i<straccountno.length ;i++)
    		{
    			 strActiveAcno =  straccountno[i];
    				if(strActiveAcno.length == '10')
    				{
    					result +=strActiveAcno +'|';
    				}
    		}
    	result = result.replace(/\|$/, '');
    		return result;
    		//alert(result);
    }
    
    
    
           function getRMN(objRMNNo)
                {
                
                	var RMNMultiple= objRMNNo.split('|');
                	var RMN;
                	var result ='';
                
                		for(var i=0;i< RMNMultiple.length;i++)
                		{ 
                			RMN = RMNMultiple[i];
                			if(RMN.length > '10')
                			{
                				RMN = RMN.slice(RMN.length-10,RMN.length)
                			}
                
                			if(RMN.slice(0,1) == '9'||RMN.slice(0,1) == '8'||RMN.slice(0,1) == '7')
                			{
                			result = RMN;
                			break;				
                			}
                		}
                //alert(result);
                return(result);
                
}
function ModAccountNo(objaccountno)
{
  var straccountno = objaccountno.split("|");

	    var inputsrting='';
	    var inputsrting1='';
	    var strActiveAcno;
	    var result='';

	for(var i=0;i<straccountno.length ;i++)
	{

		strActiveAcno =  straccountno[i];
		//alert(strActiveAcno);

	     if(strActiveAcno.length == '12')
		{
			if (strActiveAcno.slice(4,6)=='05' || strActiveAcno.slice(4,6)=='01')
			{
				inputsrting += strActiveAcno + '|';
				//alert('Success ---------');
			}
		}
		else
		{
			inputsrting1 += strActiveAcno + '|';
			//alert('More than 12 account');
		}
	}

		result =inputsrting + inputsrting1;
		result=result.replace(/\|$/, '');

	//alert(result);

		return result;

 }
 
 function TimeStamp(varDate,varhr,varmin,varsec)
 {	var result = '';
 
 	if ((String(varhr).length) == 1)
 	{
 		varhr  = '0' + ''+varhr ;
 	}
 	if ((String(varmin).length) == 1)
 	{
 		varmin  = '0' + ''+varmin ;
 	}
 	if ((String(varsec).length) == 1)
 	{
 		varsec  = '0' + ''+varsec ;
 	}
 	 result = varDate+' '+varhr+':'+varmin+':'+varsec;
 	return result;
}

//AppState.varYear+''+AppState.varMonth+''+AppState.varDate
function ParseCaptureDateScr(varyr,varmnth,vardt)
{	var result = '';
	if ((String(varmnth).length) == 1)
	
		varmnth = '0' + ''+varmnth ;
	
	if ((String(vardt).length) == 1)
	{
		vardt = '0' + ''+vardt ;
	}
	result = varyr+''+varmnth+''+vardt;
	return result;
}

//AppState.varCaptureDT+''+AppState.varHr+''+AppState.varMin+''+AppState.varSec
function LocalTrnxTimeScr(varcaptdt,varhr,varmin,varsec)
{	var result = '';
	if ((String(varhr).length) == 1)
	{
		varhr  = '0' + ''+varhr ;
	}
	if ((String(varmin).length) == 1)
	{
		varmin  = '0' + ''+varmin ;
	}
	if ((String(varsec).length) == 1)
	{
		varsec  = '0' + ''+varsec ;
	}
	 result = varcaptdt+''+varhr+''+varmin+''+varsec;
	return result;
}
function getmultiplecc(varaccno,varmultiplecc)
{

	var Multipleaccno= varaccno.split('|');
	var Multipleccno= varmultiplecc.split("~");
	var result ='';
//alert('hii');

		for(var i=0;i<  Multipleccno.length;i++)
		{ 
			var arr =Multipleccno[i];
             var arr1=arr.split("|");
			if(arr1[4] == 'Enrolled')
			{
				result +=  Multipleaccno[i] + '|';
			}

			
		}
result=result.replace(/\|$/, '');
return result;

//alert(result);



}

function getElTimingg()
{
	var result='';
	
	var CurrentDate = new Date();
	var WeekDay = CurrentDate.getDay();
	var varHr = CurrentDate.getHours();
	var varMin = CurrentDate.getMinutes();
	var varSec = CurrentDate.getSeconds();
	
	if ((String(varHr).length) == 1)
	{
		varHr  = '0' + ''+varHr ;
	}
	if ((String(varMin).length) == 1)
	{
		varMin  = '0' + ''+varMin ;
	}
	if ((String(varSec).length) == 1)
	{
		varSec  = '0' + ''+varSec ;
	}
	
	var Timing = varHr + '' + varMin + '' + varSec;
	

	if (WeekDay >= 1 && WeekDay <= 7)
	{
		if((Timing < '080000') || (Timing > '200000'))
		{
			result = 'True';
		}
		else
		{
			result = 'False';
		}
	}
else
{
	result = 'False';
}
	return result;
}
function getElTiminggG()
{
	var result='';
	
	var CurrentDate = new Date();
	var WeekDay = CurrentDate.getDay();
	var varHr = CurrentDate.getHours();
	var varMin = CurrentDate.getMinutes();
	var varSec = CurrentDate.getSeconds();
	
	if ((String(varHr).length) == 1)
	{
		varHr  = '0' + ''+varHr ;
	}
	if ((String(varMin).length) == 1)
	{
		varMin  = '0' + ''+varMin ;
	}
	if ((String(varSec).length) == 1)
	{
		varSec  = '0' + ''+varSec ;
	}
	
	var Timing = varHr + '' + varMin + '' + varSec;
	

	if (WeekDay == 0)
	{

		if((Timing >= '080000') && (Timing <= '200000'))
		{
			result = 'True';
		}
		else
		{
			result = 'False';
		}
		return result;
	}
	}
function get_CardCount(AccNumber)
{
var count= 0;
     var AccNumberArr= AccNumber.split('|');

for (var j=0;j<AccNumberArr.length;j++)
{
count=count+1;
}
       return count-1;
//alert(count);
}

function ReturnCCLast4Digit(Last4Digit,CLIAccNum)
{
       var EmptyResult = '';
       var cliaccarr = CLIAccNum.split('|');
	for(var i = 0 ; i< cliaccarr.length ;i++)
	{
		
		if ( cliaccarr[i].slice(-4,16)==Last4Digit )
		{	
			
			return cliaccarr[i];
		}

	}
return EmptyResult;

}
function get_AccCount(AccNumber)
{
	var AccNumberArr= AccNumber.split('|');
 	var arr1 = [];
        var count = 0;
        var a = "";
      for (var j = 0; j < AccNumberArr.length ; j++)
     {
                if (AccNumberArr[j].length == 12)
                {
			count = count + 1;
 			for (var b = 0; b < arr1.length; b++)
        		{
             			if (AccNumberArr[j]==arr1[b])
             			{
                	 	count = count - 1;
             			}	
        		}
		        arr1.push(AccNumberArr[j] );
		}
     }
       return count;

}
	
function get_AccCount1(AccNumber)
{
var count= 0;
     var AccNumberArr= AccNumber.split('|');

for (var j=0;j<AccNumberArr.length;j++)
{
count=count+1;
}
       return count;
//alert(count);
}

function getPLCCTimelogic()
{
    //varTimelogic= 104513(HHMMSS);
   
var result='';
   
    var CurrentDate = new Date();
    var WeekDay = CurrentDate.getDay();
    var varHr = CurrentDate.getHours();
    var varMin = CurrentDate.getMinutes();
    var varSec = CurrentDate.getSeconds();
   
    if ((String(varHr).length) == 1)
    {
        varHr  = '0' + ''+varHr ;
    }
    if ((String(varMin).length) == 1)
    {
        varMin  = '0' + ''+varMin ;
    }
    if ((String(varSec).length) == 1)
    {
        varSec  = '0' + ''+varSec ;
    }
   
    var Timing = varHr + '' + varMin + '' + varSec;
if (WeekDay >= 1 && WeekDay <= 7)
	{
   
    if ((Timing >= '090000')&&(Timing <= '193000'))
    {
        result = 'true';
    }
   
    else
    {
        result = 'false';
    }
   
           return result;

}
}

function GetAmount(varBal)
{

	//var mystring = "this,is,a,test"
	//mystring.replace(/,/g, "");
	
	
	//alert('varBal = '+varBal);
	var result='';
	varBal = varBal.replace(' ', '0');
	varBal = varBal.replace('-', '0');
	var find = ',';
	var regex = new RegExp(find, "g");
	result = varBal.replace(regex,'')
	//alert('result = '+result);
  	return result;
}

function Get_FED_ID(wholeFedID)
{
            //debugger;
            //var wholeFedID = "-01|1236547891-02|-03";
            //var wholeFedID = "1236547891-01";
            var tempID = wholeFedID;
            var splitwholeFedID = wholeFedID.split('-');
            var secondSplit;
            var finalFedID;
            var search_result = wholeFedID.indexOf("|");//.search("|");
            if (search_result != -1)
            {
                for (var h = 0; h < splitwholeFedID.length; h++)
                {

                    if (splitwholeFedID[h] != "" && splitwholeFedID[h].length >= 8)
                    {
                        secondSplit = splitwholeFedID[h].split("|")
                        for (var j = 0; j < secondSplit.length; j++)
                            if (secondSplit[j].length >= 8)
                        {
                                finalFedID = secondSplit[j];
                        }
                    }
				}

            }
            else
            {
                for (var i = 0; i < splitwholeFedID.length; i++)
                {
                    if (splitwholeFedID[i].length >= 8)
                    {
                        finalFedID = splitwholeFedID[i];
                    }
                 }
             }
	
	
	if (finalFedID == "")
	{
           var splitID = tempID.split("-");
           for(var i=0; i<splitID.length;i++)
           {
           
           
				if (splitID[i] != "" && splitID[i].length >= 8)
				{
					finalFedID = splitID[i];
					break;
			
				}
       
			}
	
	}
//alert(finalFedID);
	if(finalFedID == "")
	{
		finalFedID=0;
	}
return finalFedID;
}


function CurrentFiscalYear() 

{
    var today = new Date();
    var curMonth = today.getMonth();
    var fiscalYr = "";
    if(curMonth > 2)
    {
        var startDt = (today.getFullYear() - 1).toString();
        var endDate = today.getFullYear();
        fiscalYr = '01/04/' + startDt + '|' + '31/03/' + endDate;
        //alert(fiscalYr);
    }
    else
    {
        var endDate = (today.getFullYear() - 1).toString();
        var startDt = (today.getFullYear() - 2).toString();
        fiscalYr = '01/04/' + startDt + '|' + '31/03/' + endDate;
        //alert(fiscalYr);
    }
    return fiscalYr;
	//alert(fiscalYr);
}

function ThreeMonthStatementDate() 
{
   
var CurrentDate = new Date();

//first we will create string of previous month last day--for new date function we need year month. first day (year , month, 1) last day of current month (year, month+1, 0 )
var CurrentYear = CurrentDate.getFullYear();
var CurrentMonth = CurrentDate.getMonth(); 
// we will get 0 - 11 for Jan - Dec
var PrevMonthLastDate = new Date(CurrentYear, CurrentMonth, 0 );
//PrevMonthLastDate = new Date(2018, 0, 0 );

//***now we will get starting day of 3 months earlier

var Last3month1stDate = new Date(CurrentYear,CurrentMonth-3,1);

var MonthPrev = PrevMonthLastDate.getMonth();
MonthPrev = MonthPrev + 1;

var DayPrev = PrevMonthLastDate.getDate();

if( MonthPrev <= 9 )
{
MonthPrev = '0'+MonthPrev;
}

if( DayPrev <= 9 )
{
DayPrev = '0'+DayPrev;
}

var YearPrev = PrevMonthLastDate.getFullYear();

var StringPrevMonthLastDate = "" +DayPrev+'/'+MonthPrev+'/'+YearPrev;

MonthPrev = Last3month1stDate.getMonth();
MonthPrev = MonthPrev + 1;

DayPrev = Last3month1stDate.getDate();
if( MonthPrev <= 9 )
{
MonthPrev = '0'+MonthPrev;
}

if( DayPrev <= 9 )
{
DayPrev = '0'+DayPrev;
}

YearPrev = Last3month1stDate.getFullYear();

var String3MonthLastDate ="" +DayPrev+'/'+MonthPrev+'/'+YearPrev;

return String3MonthLastDate + '|' + StringPrevMonthLastDate ;
  
}
    
   function chkdate(dateObj)
    {
            var month = dateObj.slice(2,4);
            var date = dateObj.slice(0,2);
            var year = dateObj.slice(4,8);
    		var flag = 0;
     		var dateCheck = /^(0?[1-9]|[12][0-9]|3[01])$/;
            var monthCheck = /^(0[1-9]|1[0-2])$/;
            var yearCheck = /^[2][0][0-9][0-9]$/;  
         /*   if (month.match(monthCheck))
            {
            //alert("valid month");
            }
            */
            
    if (month.match(monthCheck) && date.match(dateCheck) && year.match(yearCheck))
    {
    		//alert("hello");
                var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
                if (month == 1 || month > 2)
                {
                
                    if (date > ListofDays[month - 1])
                    {
                        //alert('Invalid date format!--days in month');
                        return false;
                    }
                }
                
                 if (month == 2)
                {
                    var leapYear = false;
                    if ((!(year % 4) && year % 100) || !(year % 400))
                    {
                        leapYear = true;
                    }
    
                    if ((leapYear == false) && (date >= 29))
                    {
                        //alert('Invalid date format!-not leap year but more thn 29');
                       return false;
                    }
    
                    if ((leapYear == true) && (date > 29))
                    {
                        //alert('Invalid date format!-leap year but more than 29');
                       return false;
                    }
    			
                }
    			flag = 1 ;
    }
                 else 
                {
    			return false;
                //alert("invalid year");
    		    }

           if (flag == 1) 
    		{
    		var result = CompareDatewithCurrent(dateObj);
    		//return true;
    		return result;
    		
    	  //     alert("valid Result "+dateObj);
    		//alert("the date is:" + inputValues + " " + "The time is:" + n + ":" + m + ":" + p);
    		}
}


function CompareDatewithCurrent(varDate)
{
var varDayfromDate = varDate.slice(0,2);
var varMonthfromDate = varDate.slice(2,4);
varMonthfromDate = varMonthfromDate - 1;
var varYearfromDate = varDate.slice(4,8);

var q = new Date();
//alert(q);
var m = q.getMonth();
var d = q.getDate();
var y = q.getFullYear();


var date = new Date(y,m,d,0,0,0,0);
//alert(date);


var mydate=new Date(varYearfromDate,varMonthfromDate,varDayfromDate,0,0,0,0);

if(mydate.getTime() > date.getTime())
{
 
   return '3';
    //alert("greater date from current date will be returned as 3");
}
else
if(mydate.getTime() == date.getTime())
{
    //alert("equal will be returned as 1 to proceed for enddate");
	return '1';
}
else
{
var t2 = mydate.getTime();
 var t1 = date.getTime();
 var diff = parseInt((t1-t2)/(24*3600*1000));
 if (diff > 730)
 {
 //alert(diff);
 //return 2 will mean that diff is greater than 2 years
 return '2';
} 
else
{
//alert("smaller"); 
//return 1 will mean that we can proceed for enddate.
return '1';
}

}
}

function CompareDates(varStartDateOutput,varEndDateOutput)
{

//getting day month year from start date and forming a date object
var varStDayfromDate = varStartDateOutput.slice(0,2);
var varStMonthfromDate = varStartDateOutput.slice(2,4);
varStMonthfromDate = varStMonthfromDate - 1;
var varStYearfromDate = varStartDateOutput.slice(4,8);

var Stdate = new Date(varStYearfromDate,varStMonthfromDate, varStDayfromDate,0,0,0,0);

//parse end date and form new object

var varEndDayfromDate = varEndDateOutput.slice(0,2);
var varEndMonthfromDate = varEndDateOutput.slice(2,4);
	varEndMonthfromDate = varEndMonthfromDate - 1;
var varEndYearfromDate = varEndDateOutput.slice(4,8);

var EndDate = new Date(varEndYearfromDate,varEndMonthfromDate, varEndDayfromDate,0,0,0,0);
if(Stdate.getTime() > EndDate.getTime())
{
 
   return false;
    //alert("greater will be returned as 0");
}
 else
 {
 return true;
}
}

function getDelightTimelogic()
{
    
var result='';  
    var CurrentDate = new Date();
    var WeekDay = CurrentDate.getDay();
    var varHr = CurrentDate.getHours();
    var varMin = CurrentDate.getMinutes();
    var varSec = CurrentDate.getSeconds();
   
    if ((String(varHr).length) == 1)
    {
        varHr  = '0' + ''+varHr ;
    }
    if ((String(varMin).length) == 1)
    {
        varMin  = '0' + ''+varMin ;
    }
    if ((String(varSec).length) == 1)
    {
        varSec  = '0' + ''+varSec ;
    }
   
    var Timing = varHr + '' + varMin + '' + varSec;

   
    if ((Timing >= '090000')&&(Timing <= '180000'))
    {
        result = 'true';
    }
   
    else
    {
        result = 'false';
    }
   
           return result;

}

function amexCard(cardno)
        
{
            var CardNumber = cardno;
            if (CardNumber.length == 16)
            {
                var value = CardNumber.search('0')
                if (value == 0)
                {
                    CardNumber = cardno.substring(1, 16)
                    //document.getElementById('Label1').innerHTML = CardNumber;
                    return CardNumber;
                    //alert("value :" + CardNumber);
                }
                //document.getElementById('Label1').innerHTML = CardNumber;
                return CardNumber;
                //alert("value 1 : " + CardNumber);
            }
            //document.getElementById('Label1').innerHTML = CardNumber;
            return CardNumber;
            //alert("value 2 :" + CardNumber);  
}


function RemoveAmexCard(cardno) 
{
            var ivr_accnumberIWS = '';
            var result = [];
            var CardNumber = cardno.split('|');

            for(var i=0;i<CardNumber.length;i++)
            {
                //alert("for : " + CardNumber[i]);
                if (CardNumber[i].length == '16')
                {
                    var value = CardNumber[i].search('0')
                    if (value == 0)
                    {
                        CardNumber[i] = CardNumber[i].substring(1, 16)

                       // alert("value :" + CardNumber[i]);
                        result.push(CardNumber[i]);
                    }
                    else
                    {
                       // alert("value 1 : " + CardNumber[i]);
                        result.push(CardNumber[i]);
                    }
                }
                else
                {
                   // alert("value 2 :" + CardNumber[i]);
                    result.push(CardNumber[i]);
                }
            }
            for (var j = 0; j <=result.length; j++)
            {
                if (j != result.length)
                {
                    ivr_accnumberIWS += result[j] + "|";
                   // alert("Final 1 : " + ivr_accnumberIWS)
                }
                else
                {
                    ivr_accnumberIWS = ivr_accnumberIWS.substr(0,ivr_accnumberIWS.length-1);
                }
            }
            //alert("Final : " + ivr_accnumberIWS);
            return ivr_accnumberIWS;
           
           

}

function parseOfferMessage(offer_msg1,attr1,attr2,attr3)
{
var ObjOffer;

switch (offer_msg1) {
      
    case 'C010':
//LI policy
        ObjOffer = getLIPolicyfiles(attr1);
                break;
    case 'C009':
//GI policy
        ObjOffer = getGIPolicyfiles(attr1)
        break;
    
    case 'C011':
	//ccnca
       ObjOffer = new Object();
	ObjOffer.file1 = 'blank.wav';
	ObjOffer.file2 = 'blank.wav';
	ObjOffer.file3 = 'blank.wav';
	ObjOffer.mistag = '';
        break;


}
return ObjOffer;
}


function getLIPolicyfiles(attr1)
{
var ObjOffer = new Object();
switch(attr1){
case 'LI_PDT_ECS_No_Bal':
	ObjOffer.file1 = 'LI_PDT.wav';
	ObjOffer.file2 = 'LI_PDT2.wav';
	ObjOffer.file3 = 'LI_PD3.wav';
	ObjOffer.mistag = 'LIENOB';
	ObjOffer.type = 'NORMAL';
	
	break;
	
	
case 'LI_PDT_Non_ECS':
	ObjOffer.file1 = 'LI_PDN1.wav';
	ObjOffer.file2 = 'LI_PDN2.wav';
	ObjOffer.file3 = 'LI_PDN3.wav';
	ObjOffer.type = 'NORMAL';
	ObjOffer.mistag = 'LIPNECS';
		break;
case 'LI_ODD_ECS_No_Bal':
	ObjOffer.file1 = 'LI_ODE1.wav';
	ObjOffer.file2 = 'LI_ODE2.wav';
	ObjOffer.file3 = 'LI_ODE3.wav';
	ObjOffer.type = 'NORMAL';
	ObjOffer.mistag = 'LIONOB';
		break;
case 'LI_ODD_Non_ECS':
	ObjOffer.file1 = 'LI_ODDN.wav';
	ObjOffer.file2 = 'LI_ODDN1.wav';
	ObjOffer.file3 = 'LI_ODDN2.wav';
	ObjOffer.type = 'NORMAL';
	ObjOffer.mistag = 'LIOENECS';
		break;
case 'LI_OverDue_1_15_DAYS':
	ObjOffer.file1 = 'LI_OD.wav';
	ObjOffer.file2 = 'LI_OD1.wav';
	ObjOffer.file3 = 'LI_OD2.wav';
	ObjOffer.type = 'NORMAL';
	ObjOffer.mistag = 'LIOD15';
	break;
case 'LI_OverDue_1_30_DAYS':
	ObjOffer.file1 = 'LI_OD.wav';
	ObjOffer.file2 = 'LI_OD1.wav';
	ObjOffer.file3 = 'LI_OD2.wav';
	ObjOffer.type = 'NORMAL';
	ObjOffer.mistag = 'LIOD30';
	break;
case 'LI_Lapsed_16_75_DAYS':
	ObjOffer.file1 = 'LI_L.wav';
	ObjOffer.file2 = 'LI_L2.wav';
	ObjOffer.file3 = 'LI_L3.wav';
	ObjOffer.type = 'LAPSED';
	ObjOffer.mistag = 'LIL16t75';
		break;

case 'LI_Lapsed_31_75_DAYS':
	ObjOffer.file1 = 'LI_L.wav';
	ObjOffer.file2 = 'LI_L2.wav';
	ObjOffer.file3 = 'LI_L3.wav';
	ObjOffer.type = 'LAPSED';
	ObjOffer.mistag = 'LIL31t75';
		break;
default:
ObjOffer.file1 = 'blank.wav';
ObjOffer.mistag = 'Notfound';
}
return ObjOffer;
}





function getGIPolicyfiles(attr1)
{
var ObjOffer = new Object();
switch(attr1){
case 'GI_Travel':
	ObjOffer.file1 = 'blank.wav';
	ObjOffer.file2 = 'blank.wav';
	ObjOffer.file3 = 'blank.wav';
	ObjOffer.mistag = 'GItrv';
	break;
case 'GI_Health':
	ObjOffer.file1 = 'GIHealth.wav';
	ObjOffer.file2 = 'blank.wav';
	ObjOffer.file3 = 'blank.wav';
	ObjOffer.mistag = 'GIHlth';
	break;
case 'GI_Home':
	ObjOffer.file1 = 'GI_Home.wav';
	ObjOffer.file2 = 'blank.wav';
	ObjOffer.file3 = 'blank.wav';
	ObjOffer.mistag = 'GIHome';
	break;
case 'GI_Extd_Warranty':
	ObjOffer.file1 = 'blank.wav';
	ObjOffer.file2 = 'blank.wav';
	ObjOffer.file3 = 'blank.wav';
	ObjOffer.mistag = 'GIExW';
	break;
case 'GI_Motor_Ins':
	ObjOffer.file1 = 'blank.wav';
	ObjOffer.file2 = 'blank.wav';
	ObjOffer.file3 = 'blank.wav';
	ObjOffer.mistag = 'GIMo';
	break;
	
	default:
		ObjOffer.file1 = 'blank.wav';
		ObjOffer.file2 = 'blank.wav';
		ObjOffer.file3 = 'blank.wav';
		ObjOffer.mistag = 'Notfound';
	break;
}
return ObjOffer;

}

function getFinalFlag(AadharFlags, AadharAccNos, AadharNos)
{
var result = "";
var AadharFlagsArr = [];
AadharFlagsArr = AadharFlags.split('|');
var AadharAccNosArr   = [];
AadharAccNosArr = AadharAccNos.split('|');
var AadharNosArr = [];
AadharNosArr = AadharNos.split('|');

	for (var i=0;i<AadharFlagsArr.length;i++)
	{
		if( AadharFlagsArr[i]=='R'||AadharFlagsArr[i]=='r' )
		{
		result=AadharFlagsArr[i]+'|'+AadharAccNosArr[i]+'|'+AadharNosArr[i];
		result = 'G|blank|blank';
		return result;
		}
	}
	
		for (var i=0;i<AadharFlagsArr.length;i++)
	{
		if( AadharFlagsArr[i]=='O'||AadharFlagsArr[i]=='o' )
		{
		result=AadharFlagsArr[i]+'|'+AadharAccNosArr[i]+'|'+AadharNosArr[i];
		result = 'G|blank|blank';
		return result;
		}
	}
	
		for (var i=0;i<AadharFlagsArr.length;i++)
	{
		if( AadharFlagsArr[i]=='G'||AadharFlagsArr[i]=='g' )
		{
		result=AadharFlagsArr[i]+'|'+AadharAccNosArr[i]+'|'+AadharNosArr[i];
		result = 'G|blank|blank';
		return result;
		}
	}
	
		for (var i=0;i<AadharFlagsArr.length;i++)
	{
		if( AadharFlagsArr[i]=='V'||AadharFlagsArr[i]=='v' )
		{
		result=AadharFlagsArr[i]+'|'+AadharAccNosArr[i]+'|'+AadharNosArr[i];
		result = 'G|blank|blank';
		return result;
		}
	}
	
	for (var i=0;i<AadharFlagsArr.length;i++)
	{
		if( AadharFlagsArr[i]=='E'||AadharFlagsArr[i]=='e' )
		{
		result=AadharFlagsArr[i]+'|'+AadharAccNosArr[i]+'|'+AadharNosArr[i];
		result = 'G|blank|blank';
		return result;
		}
	}
	
	result = 'G|blank|blank';
	return result;


}
function GetCreditRouting(varBlockCode)
{
		var result ='';
		var inp = varBlockCode;
		switch(inp)
		{
		case 'A':
		case 'AW':
		case 'AV':
		case 'AX':
		case 'B':
		case 'B1':
		case 'BV':
		case 'BW':
		case 'BX': 
		case 'C':
		case 'CLSC':
		case 'CLSD':
		case 'D':
		case 'E':
		case 'E1':
		case 'E2':
		case 'F':
		case 'G':
		case 'H':
		case 'I':
		case 'K':
		case 'L':
		case 'M':
		case 'N':
		case 'NEW':
		case 'NREN':
		case 'P':
		case 'PICK':
		case 'Q':
		case 'R':
		case 'REJC':
		case 'Q1':
		case 'S':  result ='Skill_108';
			   break;
		case 'J':		
		case 'J1':
		case 'J2': 
		case 'J3':
		case 'J4':
		case 'J5':
		case 'J6':
		case 'SV':
                case 'T':
		case 'T1':
		case 'TMP':
		case 'U': 
                case 'W': 
		case 'W0': 
		case 'Y': 
		case 'Y0': 
		case 'Z': 
		case 'Z0': result ='Skill_161';
			   break;
		default:result ='';
		}
		return result;
}

function DateFormat(dateObj)
        {
            var dateformt = /^([0-9]{2})([0-9]{2})([0-9]{4})$/;
            
            if (!dateformt.test(dateObj))
            {
                //alert('Invalid DateTime');
                return false;
            }
            else
            {
				var sydate = new Date();
				var sydate = sydate.getFullYear();
				
                //var currDate = new Date();

                var day=dateObj.slice(0, 2);
                var month=dateObj.slice(2, 4);
                var year = dateObj.slice(4, 8);
				
				
				
				
				if ((year <= sydate) && ((day >= 01 && day <= 31)) && (month <= 12))
				{
                    
					if (leapYear(year) == true) 
					{
                      //  alert("Leap year");
                        if (day >= 01 && day <= 28) 
						{
                            //alert("Leap Day matched");
                            return true;
                        }
                        else 
						{
                            //alert("Leap Day not matched");
                            return true;
                        }
                    }
                    else 
					{
							// alert("Not Leap year");
                        if (day >= 01 && day <= 31) 
						{
                            //alert("Not Leap Day matched");
                            return true;
                        }
                        else 
						{
                            //alert("Not Leap Day not matched");
                            return true;
                        }
                        //return false
                    }
                    return false;
				}
				else
				{
					return false;
				}
            }
        }

        function leapYear(year) 
        {
            if((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        
function DatewithCurrent(dateObj) 
		{
            //debugger;
            var varDayfromDate = dateObj.slice(0,2);
            var varMonthfromDate = dateObj.slice(2,4);
            //varMonthfromDate = varMonthfromDate-1;
            var varYearfromDate = dateObj.slice(4,8);

            var q = new Date();
            //alert(q);
            var m = q.getMonth();
            var d = q.getDate();
            var y = q.getFullYear();


            var date = new Date(y, m, d, 0, 0, 0, 0);
           // alert(date);



            var mydate = new Date(varYearfromDate, varMonthfromDate, varDayfromDate, 0, 0, 0, 0);
            //var test1 = mydate.getTime();
            //var test2 = date.getTime();

            if (mydate.getTime() >= date.getTime()) 
				{

                return false;
                //alert("greater date from current date will be returned as false");
				}
            else
                {
                    return true;
                }
        }
        
function getPLTimelogic()
{
    //varTimelogic= 104513(HHMMSS);
   
var result='';
   
    var CurrentDate = new Date();
    var WeekDay = CurrentDate.getDay();
    var varHr = CurrentDate.getHours();
    var varMin = CurrentDate.getMinutes();
    var varSec = CurrentDate.getSeconds();
   
    if ((String(varHr).length) == 1)
    {
        varHr  = '0' + ''+varHr ;
    }
    if ((String(varMin).length) == 1)
    {
        varMin  = '0' + ''+varMin ;
    }
    if ((String(varSec).length) == 1)
    {
        varSec  = '0' + ''+varSec ;
    }
   
    var Timing = varHr + '' + varMin + '' + varSec;
if (WeekDay >= 1 && WeekDay <= 6)
	{
   
    if ((Timing >= '090000')&&(Timing <= '183000'))
    {
        result = 'true';
    }
   
    else
    {
        result = 'false';
    }
   
           return result;

}
}


function split(objvalue)
{
            var a = objvalue.split('|', 1);
            var result;
            var final = '';
            result = a[0];
            for (var i = 0; i < result.length; i++) {
                if (result.search(',') != -1) {
                    result = result.replace(",", "");
                }
                if (result.search('.') != -1) {
                    result = result.replace(".", "");
                }
            }
            final = result;
            //alert(final);
            return final;
           
}

function split2(objvalue)
{
            var final = '';
            for (var i = 0; i < objvalue.length; i++) {
                if (objvalue.search(',') != -1) {
                    objvalue = objvalue.replace(",", "");
                }
                //if (result.search('.') != -1) {
                //    result = result.replace(".", "");
                //}
            }
            final = objvalue;
            //alert(final);
            return final;
           
}
function CompareDatewithDue(varDate)
  {
 	var varYearfromDate = varDate.slice(0,4);


 	var varMonthfromDate = varDate.slice(4,6)
 	varMonthfromDate = varMonthfromDate -1;
 	var varDayfromDate = varDate.slice(6,8);
	
	var date1 = new Date(); 
	//alert(date1);


	var mydate=new Date(varYearfromDate,varMonthfromDate,varDayfromDate,0,0,0,0);

	if(mydate.getTime() > date1.getTime())
	{
		//alert("greater date from current date will be returned as 3");       
   		return true;

	}
	
	else
	{
		//alert("smaller");		
		return false;
	}

	}
function getWindowTiming()
{
	var result='';
	
	var CurrentDate = '';
	var WeekDay = '';
	var varHr = '';
	var varMin = '';
	var varSec = '';
	var Timing = '';
	var TimingString = '';
	
	var CurrentDate = new Date();
	var WeekDay = CurrentDate.getDay();
	var varHr = CurrentDate.getHours();
	var varMin = CurrentDate.getMinutes();
	var varSec = CurrentDate.getSeconds();
	
	
	if ((String(varHr).length) == 1)
	{
		varHr  = '0' + ''+varHr ;
	}
	if ((String(varMin).length) == 1)
	{
		varMin  = '0' + ''+varMin ;
	}
	if ((String(varSec).length) == 1)
	{
		varSec  = '0' + ''+varSec ;
	}
	
	var Timing = varHr + '' + varMin + '' + varSec;
	//var Timing = varHr + varMin + varSec;
	
	if (WeekDay >= 1 && WeekDay <= 6)
	{
		if((Timing >= '090000') && (Timing <= '180000'))
		{
			result = 'True';
		}
		else
		{
			result = 'False';
		}
	}
	else
	{
		result = 'False';
	}
	return result;
}
function split3(objvalue)
{
            var final = '';
            for (var i = 0; i < objvalue.length; i++) {
                if (objvalue.search(',') != -1) {
                    objvalue = objvalue.replace(",", "");
                }
                if (objvalue.search('.') != -1) {
                  objvalue = objvalue.replace(".", "");
         final = objvalue;
                }
            }
return final;
       
            //alert(final);
           
}


function FormatPayDate(varSRDate)
{
	var SRDate='';
	if (varSRDate.length == "8")
	{
	 var year= varSRDate.slice(4,8);
	 var month = varSRDate.slice(2,4);
	 var day =varSRDate.slice(0,2);
	 
	 SRDate=year+''+month+''+day;
	 
	}
	return SRDate;
}

function ObjData()
{
	var ObjCall = new Object();
	ObjCall.vAccount= ' ';
	ObjCall.vAccNum= ' ';
	ObjCall.vCustseg=' ';
	ObjCall.vAccountStat = ' ';
	ObjCall.vAccStatus = ' ';
	ObjCall.vActCode=' ';
	ObjCall.vCustName=' ';
	ObjCall.vCustType=' ';
	ObjCall.vCustName1=' ';
	ObjCall.vCustType1=' ';
	ObjCall.vCustType2=' ';
    ObjCall.vTxnANI=' ';
    ObjCall.vCVV=' ';
	ObjCall.varAccNum_CAR = ' ';
	ObjCall.IVR_Skill = ' ';
	ObjCall.varProductInfo = ' ';
	ObjCall.varAgentTrfFlag = ' ';
	ObjCall.varCallEndReason = ' ';
	ObjCall.vFEDID = ' ';
	ObjCall.varNRIFlag = ' ';
        ObjCall.vcorpFlag='';
	ObjCall.IVR_AccStatus=' ';
	ObjCall.vLang=' ';
	ObjCall.IVR_EnrollStatus=' ';
    ObjCall.vCardStatus=' ';
    ObjCall.vDebitCardCRNInput=' ';
    ObjCall.vCardExpDate=' ';
    ObjCall.vCliaccNum=' ';
    ObjCall.vCreditCard=' ';
    ObjCall.vDOB =' ';
    ObjCall.vSubCallFlag =' ';
    ObjCall.IVR_RMNCallerFlag ='N';
    ObjCall.vCardPanCode=' ';
    ObjCall.vAccDC=' ';
    ObjCall.vAccCC=' ';
    ObjCall.vBlockCode=' ';
    ObjCall.vTicketID=' ';
    ObjCall.vANI=' ';
    ObjCall.vChqStatus=' ';
    ObjCall.vStartDate=' ';
    ObjCall.vEndDate=' ';
    ObjCall.vSrNumber=' ';
    ObjCall.vMobileNo=' ';
    ObjCall.vUserID=' ';
    ObjCall.vStatus=' ';
   // ObjCall.vDebitCRNInput=' ';
    ObjCall.vPIN=' ';			//stores 4 digit PIN or 1 digit generation key number
    ObjCall.vPinBlock=' ';
    ObjCall.vKeyHash=' ';
    ObjCall.vResponse=' ';
    ObjCall.vAuthN=' ';
    ObjCall.vResponseString=' ';
    ObjCall.vWSTimeout='30';
    ObjCall.vCCAuthAction=' ';
    ObjCall.vAvailBal=' ';
    ObjCall.vSystemBal=' ';
    ObjCall.vFloatBal=' ';
    ObjCall.vUserDefBal=' ';
    ObjCall.vAccNum_out=' ';
    ObjCall.vUserIDOut=' ';
    ObjCall.vAvalCreditLimit=' ';
    ObjCall.vResult=' ';
    ObjCall.vCreditLimit=' ';
    ObjCall.vErrMsg=' ';
    ObjCall.vMADDUE=' ';
    ObjCall.vPaymentDueDate=' ';
    ObjCall.vstatement='';
    ObjCall.vPreviousBalance=' ';
    ObjCall.vPrimeCardName=' ';
    ObjCall.vStmntData=' ';
    ObjCall.vStmntFromDate=' ';
    ObjCall.vStmntToDate=' ';
    ObjCall.vTAD=' ';
    ObjCall.vAccNum_79000=' ';
    ObjCall.vReturnReason=' ';
    ObjCall.vCallEndReason='';
    ObjCall.vTrav1=' ';
    ObjCall.vTrav2=' ';
    ObjCall.vAuthFlag=' ';
    ObjCall.vSRType=' ';
    ObjCall.vTemplateName=' ';
    ObjCall.IVR_FraudMenu=' ';
    ObjCall.vCallEndDetails='';
    ObjCall.vTEMPServiceType='';
    
    
    
    
    
    
    //ProcCode931500
    ObjCall.vCustomerID=' ';
    ObjCall.vRmnCC=' ';
    
    //ProcCode603000
    ObjCall.vLastPaymentAmt=' ';
    ObjCall.vNextStmntDueDate=' ';
    ObjCall.vPaymentEffectiveDate=' ';
    
    //ProcCode600000
    ObjCall.vAsOfDate=' ';
    ObjCall.vAvailCashLimit=' ';
    ObjCall.vOutStBal=' ';
    ObjCall.abc=' ';
    ObjCall.vBalanceFlag=' ';
    ObjCall.vTransID=' ';
    ObjCall.vInputPhoneNum=' ';
    ObjCall.vAcctStatusCode=' ';
    
    //ProcCode777010
    ObjCall.vTrxnAmount=' ';
    
    //CCPayment
    ObjCall.vCCPaymentAmount=' ';
    ObjCall.vCCPaymentPaise=' ';
    
    //Last5CC
    ObjCall.vCDIndicator=' ';
    ObjCall.vLastTrnxDate=' ';
    ObjCall.vErrorCode=' ';
    ObjCall.vErrMsg=' ';
    ObjCall.vTotalNoOfTransactions=' ';
    ObjCall.vLastTrnxAmt=' ';
    
    //Statement
    ObjCall.vIdentifier=' ';
    ObjCall.vInputDate=' ';
    ObjCall.vCardExpiry=' ';
    ObjCall.vEmailId=' ';
    ObjCall.vErrorMsg=' ';
    ObjCall.vMobile=' ';
    ObjCall.vEAIResponse=' ';   
    ObjCall.vSRDueDate=' ';
    ObjCall.vSRNumber=' ';
    ObjCall.vAtmPinResult=' ';
    ObjCall.vStan=' ';
    ObjCall.vSRDate=' ';
    
   
   //OPMValues
   
   
    ObjCall.o_BusinessSegment=' ';
    ObjCall.o_DNISCallType=' ';
    ObjCall.o_EnableRegionalLanguage=' ';
    ObjCall.o_Location=' ';
    ObjCall.o_RegionalLanguage=' ';
    ObjCall.o_BackendServer=' ';
        
    ObjCall.o_EnableGreeting_Global=' ';
    ObjCall.o_EnablePromo_Global=' ';
    ObjCall.o_PromoMessageAudio_Global=' ';
    ObjCall.o_EnableEmergency_Global=' ';
    ObjCall.o_EmergencyTreatment_Global=' ';
    ObjCall.o_EmergencyCustomMessageAudio_Global=' ';
    ObjCall.o_LoggingCondition_Global='TRUE';
    
    
    ObjCall.o_EnableGreeting=' ';
    ObjCall.o_WelcomeMessageAudio=' ';
    ObjCall.o_EnablePromo=' ';
    ObjCall.o_PromoMessageAudio=' ';
    ObjCall.o_EnableEmergency=' ';
    ObjCall.o_EmergencyTreatment=' ';
    ObjCall.o_EmergencyCustomMessageAudio=' ';
    
    
    ObjCall.o_Base24=' ';
    ObjCall.o_CAR=' ';
    ObjCall.o_CDCI=' ';
    ObjCall.o_DCMS=' ';
    ObjCall.o_FCRM=' ';
    ObjCall.o_INFINITY=' ';
    ObjCall.o_LocalDB='TRUE';
    ObjCall.o_PrimeCTL=' ';
    ObjCall.o_UBPS=' ';
    ObjCall.o_UNICA=' ';

    //Agent transfer
    ObjCall.vBusinessSegment=' ';
    ObjCall.vCallerType=' ';
    ObjCall.IVR_ProductCode=' ';
    ObjCall.vServiceType=' ';
    ObjCall.vsubServiceType=' ';
    ObjCall.o_TransferDestination=' ';
    ObjCall.Result=' ';
    
    //AttachedData
    ObjCall.vFSID=' ';
    ObjCall.vProductInfo=' ';
    ObjCall.IVR_AuthFlag='N';
    ObjCall.vVBOutputString=' ';
    ObjCall.VA_DETAILS=' ';
    ObjCall.varAccFraudFlag='0';
    ObjCall.varAccEscFlag=' ';
    ObjCall.varCLIFraudFlag='0';
    ObjCall.varCLIEscFlag=' ';
    ObjCall.Con_Chk_Acc_no='0';
    ObjCall.Con_Chk_Mob='0';
    
    
    
    
    //Nuance
    ObjCall.vVBInputString=' ';
    ObjCall.vVBInput=' ';
    ObjCall.vCustNameNuance=' ';
    ObjCall.vCustNameJoint=' ';
    ObjCall.vtsNopRept=' ';
    ObjCall.vAddnData=' ';
    ObjCall.vTrav4=' ';
    
    //For RepeatCaller
    
    ObjCall.RepeatCallAcc=' ';
    ObjCall.RepeatCallMob=' ';
    
    //For DB Entry
    ObjCall.vLastMenuId=' ';
    ObjCall.vMCP_HOST=' ';
    
	//For Conference 
	ObjCall.vAuthNum=' ';
	ObjCall.vUserID=' ';
	ObjCall.vLang=' ';
	ObjCall.vCCIVR_Skill=' ';
	ObjCall.IVR_ANI=' ';
	ObjCall.ANI=' ';
	ObjCall.DNIS=' ';
	ObjCall.IVR_CCAuthAction=' ';
	ObjCall.IWS_UUID=' ';
	ObjCall.vLoanNumOut=' ';
	ObjCall.vFSID=' ';
	ObjCall.IWS_Action=' ';
	ObjCall.vCustName=' ';
	ObjCall.vTravProduct=' ';
	ObjCall.IVR_Skill=' ';
	ObjCall.vDebitCard=' ';
	ObjCall.vProductInfo=' ';
	ObjCall.vCustSeg=' ';
	ObjCall.IWS_ProductCode=' ';
	ObjCall.IVR_RMNCallerFl=' ';
	ObjCall.IWS_ProductCode=' ';
	ObjCall.vAcctNumber=' ';
	ObjCall.vCustID=' ';
	ObjCall.vTPINFlg=' ';
	ObjCall.IVR_Language=' ';
	ObjCall.IVR_ProductCode=' ';
	ObjCall.IVR_WealthFlag=' ';
	ObjCall.varTransFlag=' ';
	ObjCall.vTrav4=' ';
	ObjCall.vConfFlag=' ';
	ObjCall.IVR_ProductCode=' ';
	ObjCall.vTrav1=' ';
	ObjCall.vTrav2=' ';
	ObjCall.vProductType=' ';
	ObjCall.IVR_WealthFlag=' ';
	ObjCall.IVR_ProductCode=' ';
	ObjCall.vProductType=' ';
	ObjCall.vAccNumActive=' ';
	ObjCall.vAccNum924001='';
	ObjCall.vCreditFlag='';
	ObjCall.vMenuTraversal=' ';
	ObjCall.vSelectService='-1';
	ObjCall.vSelectSrvTime='False ';
	ObjCall.vTxnStTime='';
	ObjCall.vCallStartDate='';
	ObjCall.vTransMenuFlag='';
	ObjCall.vDeliquent='';
	ObjCall.vNRIFlag='';
	ObjCall.vWSTrav='';

	//For Addon Card

	ObjCall.vAddOnCardCLI='';
	ObjCall.vAddOnCard='';	
	ObjCall.vAddOnCardFlag='';
		
		//BOT
		    	ObjCall.vBotNode = '';
		    	ObjCall.vBotTrans = '';
		    	ObjCall.vBotWelcome = '';
			ObjCall.vOutPut = '';
			ObjCall.vroute = '';
			ObjCall.vstatuscode = '';
			ObjCall.vreservedQuota = '';
			ObjCall.vunreservedQuota = '';
			ObjCall.vCCOutStandingBalance = '';
			ObjCall.vBankAcBalance = '';
			ObjCall.vFraudDebitCard = '';
			ObjCall.vFraudCreditCard = '';
			ObjCall.vFraudNRI = '';
			ObjCall.vFraudCurrent = '';
			ObjCall.vFraudSavings = '';
			ObjCall.vLocCC = '';
			ObjCall.vLocDC = '';
			ObjCall.vBotTime = '';
			ObjCall.botflag = '';
			ObjCall.vActivation = '';
			ObjCall.vUnblockCard = '';
			ObjCall.DCSpecificPeriod = '';
			ObjCall.vLoanAppStatus = '';
			ObjCall.vCreditAppStatus = '';
			ObjCall.vBankAppStatus = '';
			ObjCall.DCLastYear = '';
			ObjCall.vIMobileCC = '';
			ObjCall.vCCATADDChange = '';
			ObjCall.TempLBlock= '';
			ObjCall.DC3MonStmt = '';
			ObjCall.vTempSubcallflag = '';
			ObjCall.vBOTCCStatement = '';
			ObjCall.vCCStmt = '';
			ObjCall.vstatement = '';
			ObjCall.Rstmt = '';
			ObjCall.o_IVRBOT = '';

		
	//Whatsapp
		ObjCall.vChannel=' ';
		ObjCall.vEnteredDate=' ';
		ObjCall.vMobileNo=' ';
		ObjCall.vModifiedDate=' ';
		ObjCall.vWhatsappAlert=' ';
		ObjCall.vWhatsappTC=' ';
		ObjCall.vReturnMsg=' ';
		//ObjCall.vStatus=' ';
		ObjCall.vWtoken=' ';
		ObjCall.vWhatsapp=' ';
		ObjCall.Rstmt='';
	
	
	//Appatatus
	ObjCall.vAWBNumber=' ';
	ObjCall.vInputPhoneNum='';
	ObjCall.vApplicationNumber=' ';
	ObjCall.vCardLogo=' ';
	ObjCall.vCourierName=' ';
	ObjCall.vCreditCardNumber=' ';
	ObjCall.vDispositionReason=' ';
	ObjCall.vErrCode=' ';
	ObjCall.vErrMsg==' ';
	ObjCall.vGemsARN=' ';
	ObjCall.vLoginDate=' ';
	ObjCall.vMobileNumber=' ';
	ObjCall.vProcessName=' ';
	ObjCall.vRTO_Reasons=' ';
	ObjCall.vRejectionCode=' ';
	ObjCall.vStatusCode=' ';
	ObjCall.vStatusDate=' ';
	ObjCall.vStatusDescription=' ';
	ObjCall.vCampaignFlag='';
	ObjCall.vstatementp='';
	
	//RBI Mandate
	ObjCall.vSecurityStatus='';
	ObjCall.vSecurityStatusINT='';
	
//RBI CC Empowerment CR
	
	ObjCall.vC007Domesticmerchantblock='';
	ObjCall.vC008Internationalmerchantblock='';
	ObjCall.vC005DomesticEcommercetransaction='';
	ObjCall.vC006InternationalEcommercetransaction='';
	ObjCall.vC001DomesticCashWithDrawal='';
	ObjCall.vC002InternationalCashWithDrawal='';
	ObjCall.vC003DomesticContactlesstransaction='';
	ObjCall.vC004InternationalContactlesstransaction='';
	ObjCall.vCode='';
	ObjCall.vDescription='';
	ObjCall.vCondition='';
	ObjCall.v777049Method='';

	//DCMS
		
	ObjCall.vActCode='';
	ObjCall.vErrMsg='';
	ObjCall.vErrorCode='';
	ObjCall.vErrCode='';
	ObjCall.vPAN='';
	ObjCall.vDisplayName='';
	ObjCall.vStatus='';
	ObjCall.vExpiryDate='';
	ObjCall.vIssueDate='';
	ObjCall.vAddressOne='';
	ObjCall.vAddressTwo='';
	ObjCall.vAddressThree='';
	ObjCall.vCity='';
	ObjCall.vPostCode='';
	ObjCall.vState='';
	ObjCall.vCountry='';
	ObjCall.vMobileNo='';
	ObjCall.vEmail='';
	ObjCall.vDOB='';
	ObjCall.vATMLimit='';
	ObjCall.vPOSLimit='';
	ObjCall.vECOMLimit='';
	ObjCall.vATMIntLimit='';
	ObjCall.vPOSIntLimit='';
	ObjCall.vCardType='';
	ObjCall.vResponseQueryKey1='';
	ObjCall.vResponseQueryKey2='';
	ObjCall.vResponseQueryKey3='';
	ObjCall.vResponseQueryKey4='';
	ObjCall.vResponseQueryKey5='';
	ObjCall.vResponseQueryKey6='';
	ObjCall.vResponseQueryKey7='';
	ObjCall.vResponseQueryKey8='';
	ObjCall.vResponseQueryKey9='';
	ObjCall.vResponseQueryKey10='';
	ObjCall.vECOMDomesticLimit='';
	ObjCall.vECOMINTLLimit='';
	ObjCall.vNFCDomesticLimit='';
	ObjCall.vNFCINTLLimit='';
	ObjCall.vATMDomesticFlag='';
	ObjCall.vATMINTLFlag='';
	ObjCall.vPOSDomesticFlag='';
	ObjCall.vPOSINTLFlag='';
	ObjCall.vECOMDomesticFlag='';
	ObjCall.vECOMINTLFlag='';
	ObjCall.vNFCDomesticFlag='';
	ObjCall.vNFCINTLFlag='';
	ObjCall.vActCode='';
	ObjCall.vErrMsg='';
	ObjCall.vErrCode='';
	ObjCall.vResponseCode='';
	ObjCall.vResponseDescription='';
	
	//CallEnd Reason
	ObjCall.vCallEndReason='';	
	ObjCall.vCallEndDetails='';
	ObjCall.vAT_OPM='';
	
	//vCCEnhacedFlag
	ObjCall.vCCEnhacedFlag='';
	
	//Prefered Lang
		
	ObjCall.PreferLangFlow='N';

	ObjCall.CallDisconnectFlag='';
	//OTP
	ObjCall.vCardActFlag='';
	ObjCall.vDCPingGenFlag='';
	ObjCall.vCCPingGenFlag='';
	ObjCall.vDCPinGenDOBFlag='';
	ObjCall.vOtpFlag='';
	ObjCall.vCCpingen='';
	
//Retail to corp
	ObjCall.CorpFlag='';
	ObjCall.CorpFradFlag='';
	
//Nuance Tag
    ObjCall.NuanceSuccess='';
    ObjCall.NuanceFail='';
    ObjCall.OtherErrFlag='';
    ObjCall.SymenticErrFlag='';
	
     //Nuance
    ObjCall.vSessionID=' ';
    ObjCall.vIpaddress=' ';
    ObjCall.vobjectdata=' ';
    ObjCall.IsRMN='';
    ObjCall.vEnrolledTag='';
    ObjCall.o_Nuance=' ';
    ObjCall.vAccNum931500='';
    ObjCall.vAccNum931503='';
	return ObjCall;	
}

function getGITransferTime(varTimelogic)
{
	//varTimelogic= 104513(HHMMSS);
	
	var result='';

	
	if ((varTimelogic >= '205959')&&(varTimelogic <= '235959'))
	{
		result = 'false';
	}
	else
	if ((varTimelogic >= '000001')&&(varTimelogic <= '060001'))
		{
			result = 'false';
		}
	
	else
	{
		result = 'true';
	}
	
       	return result;

}


function getCOVIDTiming()
{
	var result='';
	
	var CurrentDate = '';
	var WeekDay = '';
	var varHr = '';
	var varMin = '';
	var varSec = '';
	var Timing = '';
	var TimingString = '';
	
	var CurrentDate = new Date();
	var WeekDay = CurrentDate.getDay();
	var varHr = CurrentDate.getHours();
	var varMin = CurrentDate.getMinutes();
	var varSec = CurrentDate.getSeconds();
	
	
	if ((String(varHr).length) == 1)
	{
		varHr  = '0' + ''+varHr ;
	}
	if ((String(varMin).length) == 1)
	{
		varMin  = '0' + ''+varMin ;
	}
	if ((String(varSec).length) == 1)
	{
		varSec  = '0' + ''+varSec ;
	}
	
	var Timing = varHr + '' + varMin + '' + varSec;
	//var Timing = varHr + varMin + varSec;
	
	if (WeekDay >= 1 && WeekDay <= 5)
	{
		if((Timing >= '090000') && (Timing <= '180000'))
		{
			result = 'true';
		}
		else
		{
			result = 'false';
		}
	}
	else
	{
		result = 'false';
	}
	return result;
}


function getTimelogicEmergency(varTimelogic)
{
	//varTimelogic= 104513(HHMMSS);
	
	var result='';

	
	if ((varTimelogic >= '175959')&&(varTimelogic <= '235959'))
	{
		result = 'true';
	}
	else
	if ((varTimelogic >= '000001')&&(varTimelogic <= '070001'))
		{
			result = 'true';
		}
	
	else
	{
		result = 'false';
	}
	
       	return result;

}

function GetDBvCallEndReason(vCallEndReason)
{
	var result ='';
	if (vCallEndReason == '')
	{
	  result = '';
	} 
	//COMPOSER vSubCallFlag=AT
	else if (vCallEndReason == '0') //connection.disconnect.hangup
	{
	  result = '0';//User Disconnect
	}
	else if (vCallEndReason == '1') //error.semantic
	{
	  result = '1';//Semantic Error
	}
	else if (vCallEndReason == '2') //com.genesyslab.composer.toomanynoinputs OR com.genesyslab.composer.toomanynomatches
	{
	  result = '2';//Max Attempts Exceeded
	}
	else if (vCallEndReason == '3') //error.com.genesyslab.composer.servererror
	{
	  result = '3';//Server Error
	}
	else if (vCallEndReason == '4') //error.com.genesyslab.composer.webservice.badFetch OR error.badfetch.http OR error.badfetch
	{
	  result = '4';//badfetch
	}
	else if (vCallEndReason == '5') //error.connection.baddestination
	{
	  result = '5';//baddestination
	}
	else if (vCallEndReason == '6') //error.unsupported.transfer
	{
	  result = '6';//unsupported Transfer
	}
	else if (vCallEndReason == '7') //error.com.genesyslab.subdialog.maxdepthexceeded
	{
	  result = '7';//maxdepthexceeded
	}
	else if (vCallEndReason == '8') //error OR all
	{
	  result = '8';//error OR all
	}
	else if (vCallEndReason == '9') //Agent Transferred
	{
	  result = '9';//Agent Tranfer
	}
	else if (vCallEndReason == 'DISCONNECT') //COMPOSER vSubCallFlag=DISCONNECT
	{
	  result = 'IVR DISCONNECT';//IVR Code DISCONNECT String
	}
	else
	{
	  result = '8';
	}
	
	return result;
}

function botTiming(){

	var result='';
	   
	    var CurrentDate = new Date();
	    var WeekDay = CurrentDate.getDay();
	    var varHr = CurrentDate.getHours();
	    var varMin = CurrentDate.getMinutes();
	    var varSec = CurrentDate.getSeconds();
	   
	    if ((String(varHr).length) == 1)
	    {
	        varHr  = '0' + ''+varHr ;
	    }
	    if ((String(varMin).length) == 1)
	    {
	        varMin  = '0' + ''+varMin ;
	    }
	    if ((String(varSec).length) == 1)
	    {
	        varSec  = '0' + ''+varSec ;
	    }
	   
	    var Timing = varHr + '' + varMin + '' + varSec;
	
	   
	    if ((Timing >= '075959')&&(Timing <= '195959'))
	    {
	       result = 'true';
	    }
	   
	    else
	   {
	        result = 'false';
	   }
	  
	   
           return result;
           }

function getstatprompt(varstat_code,varstep_date,varnumber){
__Log('#####include.js getstatprompt ####');
	var stat_normal='A,C,E,H,I,K,Q,S';
	var stat_TAT_normal='B,D,T,Z,W,B,F,J,M,N,V,W';
	var stat_TAT_number='';
	var stat_TAT_date='L,P,R,U';
	var stat_OTAT_normal='B,D,T,Z,B';
	var stat_OTAT_number='W,F,J,L,M,N,P,R,U,V,W';
	var stat_OTAT_date='O';
	var cases='DEFAULT';
	var prompt='';
	var checkstat=false;
	var days_tat_2='F,J,N';
	var days_tat_3='L,M,U,V,W';
	var days_tat_4='B,D,T,Z';
	var days_tat_7='R,O';
	var days_tat_9='P';
	var actual_tat=0;
	var inTAT='N';
	
	var stat_addDays='L,O,F,J,N,M,U,V,W,R,P,T,Z';
	var days_add_2='F,J,N';
	var days_add_3='L,M,U,V,W';
	var days_add_4='T,Z';
	var days_add_7='R,O';
	var days_add_9='P';
	var checkadddays=false;
	var actual_adddays=0;
	
	
	if(stat_normal.search(varstat_code) !=-1){
		cases='NORMAL';
	}else{
		checkstat=true;
	}
	
	if(stat_addDays.search(varstat_code) !=-1){
		checkadddays=true;
	}
		
	
	if(checkstat){
	         __Log('#####checkstat.js####'+checkstat );
		if(days_tat_2.search(varstat_code) !=-1){
			actual_tat=2;
		}else if(days_tat_3.search(varstat_code) !=-1){
			actual_tat=3;
		}else if(days_tat_4.search(varstat_code) !=-1){
			actual_tat=4;
		}else if(days_tat_7.search(varstat_code) !=-1){
			actual_tat=7;
		}else if(days_tat_9.search(varstat_code) !=-1){
			actual_tat=9;
		}
		if(varstat_code.search('O') ==-1){
			inTAT=checkTAT(varstep_date,actual_tat);
		}
		
		__Log('#####inTAT.js####'+inTAT );
		
		if(inTAT=='Y'){
			if(stat_TAT_normal.search(varstat_code) !=-1){
				cases='NORMAL_TAT';
			}else if(stat_TAT_number.search(varstat_code) !=-1){
				cases='NUMBER_TAT';
			}else if(stat_TAT_date.search(varstat_code) !=-1){
				cases='DATE_TAT';
			}
		}else{
			if(stat_OTAT_normal.search(varstat_code) !=-1){
				cases='NORMAL_OTAT';
			}else if(stat_OTAT_number.search(varstat_code) !=-1){
				cases='NUMBER_OTAT';
			}else if(stat_OTAT_date.search(varstat_code) !=-1){
				cases='DATE_OTAT';
			}
		}
		
	}
	
	__Log('#####varstat_code.js####'+varstat_code );
	__Log('#####cases.js####'+cases );
	
	if(checkadddays){
		
			if(days_add_2.search(varstat_code) !=-1){
				actual_adddays=2;
			}else if(days_add_3.search(varstat_code) !=-1){
				actual_adddays=3;
			}else if(days_add_4.search(varstat_code) !=-1){
				actual_adddays=4;
			}else if(days_add_7.search(varstat_code) !=-1){
				actual_adddays=7;
			}else if(days_add_9.search(varstat_code) !=-1){
				actual_adddays=9;
		}
		__Log('#####actual_adddays.js####'+actual_adddays );
		varstep_date=addDays(varstep_date,actual_adddays);
	}
	
	
	switch(cases){
		case 'NORMAL':prompt='CCStatus_TAT_'+varstat_code+'.wav';break;        
		case 'NORMAL_TAT':prompt='CCStatus_TAT_'+varstat_code+'.wav';break;
		case 'NORMAL_OTAT':prompt='CCStatus_OTAT_'+varstat_code+'.wav';break;
		case 'NUMBER_TAT':prompt='CCStatus_TAT_'+varstat_code+'.wav'+',STRI='+varnumber+',CCStatus_TAT_'+varstat_code+'_1.wav';break;
		case 'NUMBER_OTAT':prompt='CCStatus_OTAT_'+varstat_code+'.wav'+',STRI='+varnumber+',CCStatus_OTAT_'+varstat_code+'_1.wav';break;
		case 'DATE_TAT':prompt='CCStatus_TAT_'+varstat_code+'.wav'+',DATE='+varstep_date.split(' ')[0].split('-')[2]+varstep_date.split(' ')[0].split('-')[1]+varstep_date.split(' ')[0].split('-')[0]+',CCStatus_TAT_'+varstat_code+'_1.wav';break;
		case 'DATE_OTAT':prompt='CCStatus_OTAT_'+varstat_code+'.wav'+',DATE='+varstep_date.split(' ')[0].split('-')[2]+varstep_date.split(' ')[0].split('-')[1]+varstep_date.split(' ')[0].split('-')[0]+',CCStatus_OTAT_'+varstat_code+'_1.wav';break;
		case 'DEFAULT' :prompt='CCStatus_TAT_DEFAULT.wav';break;
	}
	return prompt;
}

function checkTAT(step_date,noofday){
	__Log('#####include.js diffDays ####'+step_date+''+noofday);
	var inTAT='N';
	var d1 = new Date();
	var month=step_date.split(' ')[0].split('-')[1];
	__Log('#####include.js month ####'+month+' step month'+step_date.split(' ')[0].split('-')[1]);
	month=month-1;
	__Log('#####include.js year ####'+step_date.split(' ')[0].split('-')[0]);
	__Log('#####include.js month ####'+month);
	__Log('#####include.js day ####'+step_date.split(' ')[0].split('-')[2]);
	d1.setFullYear(step_date.split(' ')[0].split('-')[0]);
	d1.setMonth(month);
	d1.setDate(step_date.split(' ')[0].split('-')[2]);
	var d2=new Date();
	__Log('#####include.js diffDays ####'+d1+''+d2);
	var diffDays = parseInt((d2 - d1) / (1000 * 60 * 60 * 24), 10); 
	__Log('#####include.js diffDays ####'+diffDays);
	if(diffDays <= noofday){
		var inTAT='Y';
	}
	return inTAT;
}
function addDays(varstep_date,noofDaysAdd){
		__Log('#####include.js varstep_date Before adding days ####'+varstep_date +'noofDaysAdd :'+noofDaysAdd);
		var d1 = new Date();
		var month=varstep_date.split(' ')[0].split('-')[1];
		__Log('#####include.js month ####'+month+' step month'+varstep_date.split(' ')[0].split('-')[1]);
		month=month-1;
		d1.setFullYear(varstep_date.split(' ')[0].split('-')[0]);
		d1.setMonth(month);
		d1.setDate(varstep_date.split(' ')[0].split('-')[2]);
		__Log('#####include.js varstep_date Before adding days d1 ####'+d1);
		d1.setDate(d1.getDate()+noofDaysAdd);
		__Log('#####include.js varstep_date After adding days d1 ####'+d1);
		var m = d1.getMonth()+1;
		var d = d1.getDate();
		m=m+'';
		d=d+'';
                var y = d1.getFullYear();
                varstep_date=y+'-'+(m.length==1 ? '0'+m:m)+'-'+(d.length==1 ? '0'+d:d)+' 00:00:00';
		__Log('#####include.js varstep_date ####'+varstep_date);
   return varstep_date;
}
function getcallendreason(vCallEndReason)
{
	var result ='';
	var reasoncode = vCallEndReason;
	switch(reasoncode)
	{
	case 'connection.disconnect.hangup': result ='0';//--->User Disconnect
		   break;
	case 'error.semantic': result ='1';//--->Error
		   break;
	case 'com.genesyslab.composer.toomanynoinputs': result ='2';//--->Max Attempts Exceeded
		   break;
	case 'com.genesyslab.composer.toomanynomatches': result ='2';//--->Max Attempts Exceeded
		   break;
	case 'MAX ATTEMPTS': result ='2';//--->Max Attempts Exceeded
		   break;
	case 'error.com.genesyslab.composer.servererror': result ='3';//--->Server Error
		   break;
	case 'error.com.genesyslab.composer.webservice.badFetch': result ='4';//--->badfetch
		   break;
	case 'error.badfetch.http': result ='4';//--->badfetch
		   break;
	case 'error.badfetch': result ='4';//--->badfetch
		   break;
	case 'error.connection.baddestination': result ='5';//--->baddestination
		   break;
	case 'error.unsupported.transfer': result ='6';//--->unsupported Transfer
		   break;
	case 'error.com.genesyslab.subdialog.maxdepthexceeded': result ='7';//--->maxdepthexceeded
		   break;
	case 'error': result ='8';//--->error
		   break;
	case 'all': result ='8';//--->all
		   break;
	case '9': result ='9';//Agent Transferred--->Agent Tranfer
		   break;
	case 'DISCONNECT': result ='2';//IVR Code DISCONNECT--->//COMPOSER vSubCallFlag=DISCONNECT MAX Retry Disconnect Scenario
		   break;
	default:result ='$'; //Unhandled exceptions
	}
	return result;
}
           
function getCallDisconnect(callEndReason, subCallFlag){

var disconnect_CallEndReason='0';
var disconnect_subCallFlag='';
var disconnectFlag='C';
//if(callEndReason.trim().length > 0){
if(callEndReason !=null && callEndReason!=''&& callEndReason!=undefined && callEndReason !='null'){
if(disconnect_CallEndReason.indexOf(callEndReason)!=-1){
disconnectFlag='D';
}
}
return disconnectFlag;

}

function getcallendreasonbyeventempty(exitstingcallendreason, subcallflag){
var result='';

if(exitstingcallendreason ==null || exitstingcallendreason =='' ||exitstingcallendreason =='null' || exitstingcallendreason ==undefined){
if(subcallflag !=null && subcallflag !='' && subcallflag !='null' && subcallflag !=undefined){
if(subcallflag == 'DISCONNECT'){
	result='2';
}
}
}else{
result=exitstingcallendreason;
}
return result;
}

function getNottoEnrolled(input){

var nottoEnroll="retail_notenrolled_ws_cc_pingenfailure_success";
var enrollflag="Y";

if(nottoEnroll.indexOf(input)!=-1){
   enrollflag="N";

}
return enrollflag;
}

function getAccountMatched(accnum500,accnum503){

var matchflag="Y";
var accnum503split;
var accnum500split;
var flag="";
var len=0;

if(accnum503 !="" && accnum503!=null && accnum503 !=undefined && accnum500 !="" && accnum500!=null && accnum500 !=undefined){
   accnum503split=accnum503.split("|");
   accnum500split=accnum500.split("|");
   if(accnum500split.length>accnum503split.length){
    len=accnum503split.length;
   }else{
   len=accnum500split.length;
   }
   
   for(var i=0;i<len;i++){
 
   if(accnum500.indexOf(accnum503split[i]) !=-1){
   flag+="Y";
   
   
   }else{
    flag+="N";
   }
   }
   
    if(flag.indexOf("Y")!=-1){
    matchflag="Y";
    }else{
    matchflag="N";
    }
   
 
}



return matchflag;
}