<?xml version="1.0" encoding="utf-8"?>
<%@ Page Language="C#" ContentType="text/xml;charset=utf-8" EnableSessionState="false"%>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Xml" %>
<%@ Import Namespace="Newtonsoft.Json" %>
<%@ Import Namespace="System.Text" %>
<%@ Import Namespace="log4net" %>
<%
	ILog m_Log = LogManager.GetLogger("dbInputForm");
	log4net.Config.XmlConfigurator.Configure(); 
    m_Log.Debug("_________________________________________________");
    m_Log.Debug("dbInputForm() In");
    String  strDBValues         = "";
    String  strTimeout          = "";
    String  strAppLanguage      = "";
    String  strAppASRLanguage   = "";
    String  strSecurity         = "";
    
    
    if ( Request.RequestType.Equals( "get", StringComparison.CurrentCultureIgnoreCase ) ) {
            strDBValues = Request.QueryString.Get( "dbValues" );
            strTimeout  = Request.QueryString.Get( "timeout"  );
            strAppLanguage = Request.QueryString.Get("app_language");
            strAppASRLanguage = Request.QueryString.Get("app_asr_language");
            strSecurity = Request.QueryString.Get("security");
        }
    else {
        // POST
        string      strAllData      = Request.Form.ToString();
        string []   strTokens       = null;
        char   []   chDelimiters    = "&=".ToCharArray();

        // TODO - There **has** to be something else that will do this more easily
        strTokens = strAllData.Split( chDelimiters, StringSplitOptions.None);

        for ( int i = 0; i < strTokens.Length; ++i ) {
            if ( strTokens[ i ].Equals( "dbValues", StringComparison.InvariantCultureIgnoreCase ) ) {
                strDBValues = strTokens[ i + 1 ];
            }
            
            if ( strTokens[ i ].Equals( "timeout", StringComparison.InvariantCultureIgnoreCase ) ) {
                strTimeout  = strTokens[ i + 1 ];
            }

            if (strTokens[i].Equals("app_language", StringComparison.InvariantCultureIgnoreCase))
            {
                strAppLanguage = strTokens[i + 1];
            }

            if (strTokens[i].Equals("app_asr_language", StringComparison.InvariantCultureIgnoreCase))
            {
                strAppASRLanguage = strTokens[i + 1];
            }

            if (strTokens[i].Equals("security", StringComparison.InvariantCultureIgnoreCase))
            {
                strSecurity = strTokens[i + 1];
            }
        }
    }
    
    // URL decode
    if ( strDBValues != null && strDBValues.Length > 0 ) {
        strDBValues = Server.UrlDecode( strDBValues );
    }
    else {
        strDBValues = "";
    }
    m_Log.Debug("strDBValues: " + strDBValues);
    m_Log.Debug("strTimeout: " + strTimeout);
    m_Log.Debug("strAppLanguage: " + strAppLanguage);
    m_Log.Debug("strAppASRLanguage: " + strAppASRLanguage);
    m_Log.Debug("strSecurity: " + strSecurity);
    
    
    Newtonsoft.Json.JsonTextReader jsonReaderDTMF = new JsonTextReader( new StringReader(strDBValues) );
    
    // Parse into a JSON string
    
    TextReader txReader = new StringReader( strDBValues );
    Newtonsoft.Json.JsonTextReader jsonReader = new JsonTextReader( txReader );
    
    Newtonsoft.Json.JsonTextReader jsonReaderCheck = new JsonTextReader( new StringReader(strDBValues) );
    Boolean bEnableDTMFMode = false;
    
    while ( jsonReaderCheck.Read() ) {
       if ( jsonReaderCheck.Value != null ) {
        	try
			{
			    Convert.ToInt32(jsonReaderCheck.Value);
			    bEnableDTMFMode = true;
			}
			catch(Exception ex)
			{//do nothing 
			}
       }
     } 
   
    				
    m_Log.Debug("dbInputForm() Out");
%>
<vxml version="2.1" xml:lang="<%=strAppLanguage%>" xmlns="http://www.w3.org/2001/vxml" xmlns:gvp="http://www.genesyslab.com/2006/vxml21-extension" 
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
		
	<form id="DbInputForm">

		<field name="DbInput">
			<% if ( strTimeout.Length > 0) {%>
                <property name="timeout"    value="<%=strTimeout%>s" />
            <%} %>
            <% if ( strSecurity.Length > 0 && strSecurity.ToLower().Equals("true")) {%>
                <property name="com.genesyslab.private" value="true" />
            <%} %>
            <grammar xml:lang="<%=strAppASRLanguage%>" root="TOPLEVELVOICE" version="1.0" mode="voice">
				<rule id="TOPLEVELVOICE" scope="public">
    				<one-of>
    				<% while ( jsonReader.Read() ) {
    					if ( jsonReader.Value == null ) {
                                continue;
                        }%>
        				<item><%=jsonReader.Value%></item>
    				<% } %>
    				</one-of>
				</rule>
			</grammar>
			<%if(bEnableDTMFMode){%>
			<grammar xml:lang="<%=strAppASRLanguage%>" root="TOPLEVELDTMF" version="1.0" mode="dtmf">
				<rule id="TOPLEVELDTMF" scope="public">
    				<one-of>
    				<% while ( jsonReaderDTMF.Read() ) {
    				  	if ( jsonReaderDTMF.Value == null ) {
                         continue;
                        }
                        else{
        					try
							{
			    				Convert.ToInt32(jsonReaderDTMF.Value);%>
			    				<item><%=jsonReaderDTMF.Value%></item>
			    				<%
							}
							catch(Exception ex)
							{//do nothing
							}
						 }} %>
    				</one-of>
				</rule>
			</grammar>
			<%}%>
            <filled>
				<return namelist="DbInput DbInput$" />
    		</filled>
			<noinput><return event="noinput"/></noinput>
			<nomatch><return event="nomatch"/></nomatch>
			<catch event="error.noresource"><return event="error.noresource"/></catch>
    		<catch event="error"><return event="error"/></catch>
        </field>
    </form>
</vxml>