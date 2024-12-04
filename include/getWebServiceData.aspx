<%@ Page Language="C#" ContentType="application/json;charset=utf-8" Inherits="WebService"%>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Xml" %>
<%@ Import Namespace="System.Web.Services" %>
<%@ Import Namespace="Newtonsoft.Json" %>
<%@ Import Namespace="Newtonsoft.Json.Linq" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="System.Configuration" %>
<%@ Import Namespace="System.Web" %>
<%@ Import Namespace="System.Security.Cryptography.X509Certificates" %>
<%@ Import Namespace="System.Security.Cryptography.Xml" %>
<%@ Import Namespace="System.Security.Cryptography" %>
<%@ Import Namespace="Microsoft.Web.Services3" %>
<%@ Import Namespace="Microsoft.Web.Services3.Design" %>
<%@ Import Namespace="Microsoft.Web.Services3.Security" %>
<%@ Import Namespace="Microsoft.Web.Services3.Security.Tokens" %>
<%@ Import Namespace="log4net" %>

<script runat="server">
static readonly ILog m_Log = LogManager.GetLogger("getWebService");

    /************************ fetchURL *******************/
    String fetchURL(string url, string protocol, string parameters,
                    string readWriteTimeout, string conTimeout, string authenAccess,
                    string userName, string password, string methodName,
                    string soapActionURI, string targetNameSpace, OrderedDictionary paramTable,string inputCustomHeadersString,
                    string certStoreName,string certName, string certStoreLocation,string sigAlgorithm, JObject namespacePrefixMap,
                    string customPrefix,Boolean enableNSPrefix, Boolean prefixForChildTags,Boolean enableProxy, 
                    int proxyPort, string proxyHost, string proxyUserName, string proxyPassword,string customSOAPEnvFile,string variableScopeName,
                    JObject appStateJSON,JObject userTypeVarsJSON)
     {
     	m_Log.Debug("fetchURL() in");
     	
        String result = "";
        String method ="GET";
        String loginCredentials = userName + ":" + password;
        HttpWebRequest request = null;
        ServicePointManager.ServerCertificateValidationCallback += delegate(
            object
            sender,
            System.Security.Cryptography.X509Certificates.X509Certificate
            pCertificate,
            System.Security.Cryptography.X509Certificates.X509Chain pChain,
            System.Net.Security.SslPolicyErrors pSSLPolicyErrors)
            {
                return true;
            };
        
        try
        {
            if (protocol.ToUpper().EndsWith("GET"))
            {
                url = url +(String.IsNullOrEmpty(methodName) ? "" : ("/" + methodName))+(String.IsNullOrEmpty(parameters) ? "" : ("?" + parameters));
                method = "GET";
            }
            else if (protocol.ToUpper().EndsWith("POST"))
            {
            	url = url +(String.IsNullOrEmpty(methodName) ? "" : ("/" + methodName));
                method = "POST";
            }
            else
            {
                method = "SOAP";
            }

            	m_Log.Debug("method: " + method);
                request = (HttpWebRequest)WebRequest.Create(url);
                if(enableProxy){
	                WebProxy proxyObject = new WebProxy("http://"+proxyHost+":"+proxyPort);
					request.Proxy= proxyObject;
					if(proxyUserName.Length>0){
						request.Credentials = new NetworkCredential(proxyUserName, proxyPassword);
					}
				}
				                
                if (method.Equals("SOAP"))
                {
                    request.Method = "POST";
               	}
                else
                {
                    request.Method = method;
                }
				
                if (method.Equals("POST"))
                {
                    request.ContentType = "application/x-www-form-urlencoded;charset=UTF-8";
               	}
               	else
               	{
                	request.ContentType = "text/xml;charset=UTF-8";
                }
                request.Timeout = Int32.Parse(conTimeout);
                request.ReadWriteTimeout = Int32.Parse(readWriteTimeout);
                				
				request.KeepAlive = false;
				
                 if (authenAccess.Equals("HTTPBasicAuthentication") || authenAccess.Equals("SOAPSignatureWithHTTPBasicAuthentication"))
            	{
                    request.Headers.Add("Authorization", "Basic " + Convert.ToBase64String(new ASCIIEncoding().GetBytes(loginCredentials)));
                }

				//Custom HTTP headers
			if(inputCustomHeadersString!=null && inputCustomHeadersString.Length >0)
			{
				m_Log.Debug("Custom HTTP headers");
				JObject headerJsonObj = JObject.Parse(inputCustomHeadersString);
	            JEnumerable<JProperty> children = headerJsonObj.Children<JProperty>();
	                
	            foreach( JProperty child in children )
	            {
	            	string strKey = child.Name;
	                string strValue = "";
	                if (child == null || child.Value == null)
	                	continue;
	                if (child.Value.Type.Equals(JsonTokenType.String))
	                {
	                	strValue = (String)((JValue)child.Value).Value;
	                }
	                else
	                {
	                	strValue = child.Value.ToString();
	                }
	 				if(strKey.Trim().Equals("Accept")){
							request.Accept = strValue;
						}
						else if(strKey.Trim().Equals("Connection")){
							request.Connection = strValue;
						}
						else if(strKey.Trim().Equals("Content-Length")){
							request.ContentLength	 = strValue.Length;
						}
						else if(strKey.Trim().Equals("Content-Type")){
							request.ContentType = strValue;
						}
						else if(strKey.Trim().Equals("Expect")){
							request.Expect = strValue;
						}
					
						else if(strKey.Trim().Equals("If-Modified-Since")){
							request.IfModifiedSince = DateTime.Parse(strValue);
						}
						else if(strKey.Trim().Equals("Referer")){
							request.Referer = strValue;
						}
						else if(strKey.Trim().Equals("Transfer-Encoding")){
							request.TransferEncoding = strValue;
						}
						else if(strKey.Trim().Equals("User-Agent")){
							request.UserAgent = strValue;
						}
						else{
							request.Headers.Add(strKey,strValue);
						}
	 				}
	 			}
                if (method.Equals("POST"))
                {
                   
                    using (Stream writeStream = request.GetRequestStream())
                    {
                        UTF8Encoding encoding = new UTF8Encoding();
                        byte[] bytes = encoding.GetBytes(parameters);
                        writeStream.Write(bytes, 0, bytes.Length);
                        writeStream.Close();
                    }
                }
                else if (method.Equals("SOAP"))
                {
                
                    request.Headers.Add("SOAPAction", soapActionURI);
                    string soapRequest = string.Empty;
                                        
                    if(customSOAPEnvFile!=null && customSOAPEnvFile.Length>0){
                    	soapRequest = fetchCustomSOAPEnvMsg(customSOAPEnvFile);
						soapRequest = processCustomSOAPEnvMsg(soapRequest,appStateJSON,userTypeVarsJSON,variableScopeName);
                    }
                    else{
                    	soapRequest = generateSOAPRequest(targetNameSpace, authenAccess, userName, password, methodName, parameters, paramTable, certStoreName, certName, certStoreLocation, sigAlgorithm, namespacePrefixMap, customPrefix, enableNSPrefix, prefixForChildTags);
                    }
                    UTF8Encoding encoding = new UTF8Encoding();
                    byte[] bytes = encoding.GetBytes(soapRequest);
                    request.ContentLength =bytes.Length;
                    using (Stream writeStream = request.GetRequestStream())
                    {
                        writeStream.Write(bytes, 0, bytes.Length);
                        writeStream.Close();
                    }
                }
                HttpWebResponse webResponse = (HttpWebResponse)request.GetResponse();

                StreamReader input = new StreamReader(webResponse.GetResponseStream());
                result += convertToJson(input, method);
            
        }
        catch (System.Net.WebException we)
        {
            m_Log.Error("Received SOAP Fault: " + we.ToString());	
            Response.AppendToLog("Received SOAP Fault: " + we.ToString());
            if (null != we.Response)
            {
                HttpWebResponse webResponse = (HttpWebResponse)we.Response;
                StreamReader input = new StreamReader(webResponse.GetResponseStream());
                string jsonStr = convertToJson(input, method);
                result += "{\"errorMsg\":";
                result += jsonStr;
                result += "}";
            }
            else
            {
                result += "{\"errorMsg\": \"error.com.genesyslab.composer.webservice.badFetch message=";
                result += we.Message.ToString().Replace('"', '\'');
                result += "\"}";
            }
            
            
        }
        catch (Exception e)
        {
	    m_Log.Error("Exception: " + e.Message);
            result += "{\"errorMsg\": \"error.com.genesyslab.composer.webservice.badFetch message=";
            result += e.Message.ToString().Replace('"', '\'');
            result += "\"}";   
        }
        
        m_Log.Debug("result: " + result);
     	m_Log.Debug("fetchURL() out");
        return result;
     }
     
     
     
     
     
     /**************Fetch custom SOAP Env file****************/
     string fetchCustomSOAPEnvMsg(string customSOAPEnvFile){
      	
      	string contents = string.Empty;
      	
      	try{
        string appPath = string.Empty;
        //Getting the current context of HTTP request
        HttpContext context = HttpContext.Current;
               
      	appPath = string.Format("{0}://{1}{2}{3}",
                                    context.Request.Url.Scheme,
                                    context.Request.Url.Host,
                                    context.Request.Url.Port == 80
                                        ? string.Empty
                                        : ":" + context.Request.Url.Port,
                                    context.Request.ApplicationPath);
        
        string customFilePath = appPath + customSOAPEnvFile;
        Response.AppendToLog("** Fetching custom SOAP contents from "+customFilePath+"**");
      	contents = new System.Net.WebClient().DownloadString(customFilePath);
      	}
      	catch(Exception e){
      		Response.AppendToLog("Error in fetching custom soap contents file: "+e.ToString());
      	}
      	return contents;
     }
     
     
     
     /**************Process custom SOAP msg - variable replacement****************************/
	 string processCustomSOAPEnvMsg(string soapRequest,JObject appStateJSON,JObject userTypeVarsJSON,string variableScopeName){
	 	
	 	string customSOAPMsg = soapRequest;
	 	try
	 	{
			customSOAPMsg = replaceCustomVarsFromJSON(appStateJSON,customSOAPMsg,variableScopeName);
			
			customSOAPMsg = replaceCustomVarsFromJSON(userTypeVarsJSON,customSOAPMsg,"");
			
	    	//Response.AppendToLog("##"+customSOAPMsg+"##");
    	}
    	catch(Exception e){
      		Response.AppendToLog("Error while replacing variables in the custom soap contents: "+e.ToString());
      	}
	 	return customSOAPMsg;
	 }
	 
	 
	 
	/**************Method to replace variables from AppState and user variables**********/ 
	string replaceCustomVarsFromJSON(JObject varJSONObj,string soapmsg,string variableScopeName )
	{
	
		string returnMsg = soapmsg;
		if(varJSONObj!=null && varJSONObj.ToString().Length>0){	
			JEnumerable<JProperty> children = varJSONObj.Children<JProperty>();
						                
			foreach( JProperty child in children )
			{
				string strKey = child.Name;
				string strValue = "";
				if (child == null || child.Value == null)
					continue;
			
				if (child.Value.Type.Equals(JsonTokenType.String))
				{
			   		strValue = (String)((JValue)child.Value).Value;
				}
				else
				{
			   		strValue = child.Value.ToString();
				}
				 		 	
			 	string token = new StringBuilder().Append("$").Append(variableScopeName).Append(strKey).Append("$").ToString();
			 	returnMsg = returnMsg.Replace(token,strValue);
	    	}
    	}
    	return returnMsg;
	}



     /**************convertToJson****************************/
     string convertToJson(StreamReader reader, String method)
     {
     	 m_Log.Debug("convertToJson() in");
         string json = "";
         string data = reader.ReadToEnd();
         m_Log.Debug("method: '" + method + " -- data: " + data);
         if (method.Equals("SOAP"))
         {
             XmlDocument doc = new XmlDocument();
             doc.LoadXml(data);
             reader.Close();

             System.Xml.XmlNode soapNode = doc.ChildNodes[0];
             System.Xml.XmlNode soapBodyNode = doc.ChildNodes[0];

             string SoapMessage = data.ToLower();
             string prefix = "";
             for (int i = 0; i < doc.ChildNodes.Count; i++)
             {
                 soapNode = doc.ChildNodes[i];
                 prefix = soapNode.GetPrefixOfNamespace("http://schemas.xmlsoap.org/soap/envelope/");
                 if (prefix != null && prefix.Length > 0)
                     break;
             }
             //Get the Soap message Body Node
             for (int j = 0; j < soapNode.ChildNodes.Count; j++)
             {
                 soapBodyNode = soapNode.ChildNodes[j];
                 if (soapBodyNode.Name.ToLower() == prefix.ToLower()+ ":body")
                     break;
             } 
                           // doc.LoadXml(data);
             
             json = Newtonsoft.Json.JavaScriptConvert.SerializeXmlNode(soapBodyNode);
            
             //We need to remvoe the Soap body which should be always the first part.
             int iSoapBodyElementStartFrom = json.ToLower().IndexOf(prefix.ToLower() + ":body");
             if (-1 !=iSoapBodyElementStartFrom)
             {
                int iSoapBodyStartIndex = json.IndexOf('{', iSoapBodyElementStartFrom);
                if(-1 != iSoapBodyStartIndex)
                {
                    int iSoapBodyEndIndex = json.LastIndexOf('}');
                    if(-1 != iSoapBodyEndIndex)
                    {
                        json = json.Substring(iSoapBodyStartIndex,iSoapBodyEndIndex-iSoapBodyStartIndex);
                    }
                }
             }      
         }
         else
         {
             // Parse into a JSON string
             TextReader txReader = new StringReader(data);
             Newtonsoft.Json.JsonTextReader jsonReader = new JsonTextReader(txReader);
             try
             {
                 jsonReader.Read();
                 // JSON string
                 json += data;
                 return json;
             }
             catch (JsonReaderException)
             {
                 // not a valid JSON - check for XML
                 XmlDocument doc = new XmlDocument();
                 doc.LoadXml(data);
                 reader.Close();
                 json = Newtonsoft.Json.JavaScriptConvert.SerializeXmlNode(doc.DocumentElement);
                 return json;
             }

         }

	m_Log.Debug("json: " + json);
     	m_Log.Debug("convertToJson() out");
        return json;
     }

    /***********************generateSOAPRequest**********************************/
     public String generateSOAPRequest(string targetNameSpaceUri, string authenAccess, string userName,string passWord, string methodName, string parameters, OrderedDictionary paramTable,
                                       string certStoreName, string certName, string certStoreLocation, string sigAlgorithm, JObject namespacePrefixMap,
                                       string customPrefix, Boolean enableNSPrefix, Boolean prefixForChildTags)
    {
        String returnResult = "";
        try
        {
            m_Log.Debug("generateSOAPRequest() in");
            Response.AppendToLog("inside generate soap");

            String nameSpacePrefix = "p";
            String nameSpaceUri = "";

            try
            {
                nameSpaceUri = (string)namespacePrefixMap[methodName];
            }
            catch (Exception e)
            {
                m_Log.Debug(e.StackTrace);
                nameSpaceUri = targetNameSpaceUri;
            }

            if (enableNSPrefix && (!String.IsNullOrEmpty(customPrefix)))
            {
                nameSpacePrefix = customPrefix;
            }

            String requestStruct = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=" +
                    "\"http://schemas.xmlsoap.org/soap/envelope/\"";

            if (enableNSPrefix)
            {
                requestStruct = requestStruct + " xmlns:" + nameSpacePrefix + "=\"" + nameSpaceUri + "\"" +
                       " xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"" + " xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">";
            }
            else
            {
                requestStruct = requestStruct + " xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"" + " xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">";
            }

            m_Log.Debug("authenAccess: " + authenAccess);
            if (authenAccess.Equals("SOAPMessageLevelBasicAuthentication"))
            {
                requestStruct = requestStruct + "\n<SOAP-ENV:Header>"
                    + "\n<h:BasicAuth xmlns:h=\"http://soap-authentication.org/basic/2001/10/" +
                       " SOAP-ENV:mustUnderstand='1'>" +
                       "\n<Name>" + userName + "</Name>" +
                       "<Password>" + passWord + "</Password>" +
                       "\n</h:BasicAuth>" +
                       "\n</SOAP-ENV:Header>";
                requestStruct = requestStruct + "\n<SOAP-ENV:Body>";
                requestStruct = requestStruct + formParamTags(paramTable, namespacePrefixMap, methodName, customPrefix, enableNSPrefix, prefixForChildTags);
                requestStruct = requestStruct + "\n</SOAP-ENV:Body>" + "\n</SOAP-ENV:Envelope>";

                returnResult = requestStruct;
            }
            else if (authenAccess.Equals("SOAPDigitalSignatureAuthentication") || authenAccess.Equals("SOAPSignatureWithHTTPBasicAuthentication"))
            {
                String signedSOAPContent = null;
                requestStruct = requestStruct + "\n<SOAP-ENV:Header>" + "\n</SOAP-ENV:Header>";
                requestStruct = requestStruct + "\n<SOAP-ENV:Body>";
                requestStruct = requestStruct + formParamTags(paramTable, namespacePrefixMap, methodName, customPrefix, enableNSPrefix, prefixForChildTags);
                requestStruct = requestStruct + "\n</SOAP-ENV:Body>" + "\n</SOAP-ENV:Envelope>";


                X509Certificate2 cert;
                cert = FindCertificate(certStoreName, certName, certStoreLocation);

                if (cert == null)
                {
                    Response.AppendToLog("Client Certificate Not found\n");
                    throw new Exception("Client Certificate Not found");
                }
                else
                {
                    if (cert.HasPrivateKey)
                    {
                        signedSOAPContent = SignSOAPMessage(cert, requestStruct, sigAlgorithm);

                    }
                }
                returnResult = signedSOAPContent;
            }
            else
            {
                requestStruct = requestStruct + "\n<SOAP-ENV:Body>";

                requestStruct = requestStruct + formParamTags(paramTable, namespacePrefixMap, methodName, customPrefix, enableNSPrefix, prefixForChildTags);

                requestStruct = requestStruct + "\n</SOAP-ENV:Body>" + "\n</SOAP-ENV:Envelope>";
                returnResult = requestStruct;

            }
        }
        catch (Exception e)
        {
            returnResult = returnResult + e.Message;
        }
        return returnResult;
    }
  
    public String formParamTags(OrderedDictionary paramTable,JObject namespacePrefixMap,String methodName,String customPrefix,Boolean enablePrefix, Boolean prefixToChildTags)
    {
        String returnResult = "";

        try
        {

            XmlDocument xmlDoc = new XmlDocument();
            String methodNameNameSpace = "";
            String methodNamePrefix = "p";
            XmlElement root;

            XmlElement newElementNode = null;
            XmlElement parent = null;

            StringWriter stringWriter = new StringWriter();
            XmlTextWriter xmlTextWriter = new XmlTextWriter(stringWriter);
            XmlNamespaceManager nsm = new XmlNamespaceManager(xmlDoc.NameTable);

	        try{
	 	     methodNameNameSpace = (string)namespacePrefixMap[methodName];
	        }
	        catch(Exception){
	 	     Response.AppendToLog("["+methodName+"] not found in Namespace entry. Setting method namespace to empty");
	 	     methodNameNameSpace ="";
	        }

            if (!String.IsNullOrEmpty(customPrefix))
            {
                methodNamePrefix = customPrefix;
            }
            if (!String.IsNullOrEmpty(methodNameNameSpace))
            {
                nsm.AddNamespace(methodNamePrefix, methodNameNameSpace);
                if (enablePrefix)
                {
                    root = xmlDoc.CreateElement(methodNamePrefix, methodName, methodNameNameSpace);
                }
                else
                {
                    root = xmlDoc.CreateElement(methodName);
                    root.SetAttribute("xmlns", methodNameNameSpace);
                }
            }
            else
            {
                root = xmlDoc.CreateElement(methodName); 
            }
            
                
            xmlDoc.AppendChild(root);
            foreach (DictionaryEntry de in paramTable)
            {

                String prefix_key = (string)de.Key;
                String[] tokens = prefix_key.Split(':');
                String value = (string)de.Value;

                if (tokens.GetLength(0) == 2)
                {


                    String prefix = tokens[0];

                    String element = tokens[1];

                    //Check element is dot extented.
                    String namespaceUri = (string)namespacePrefixMap[prefix];
                    String[] elementTokens = element.Split('.');
                    nsm.AddNamespace(prefix, namespaceUri);
                 
                    if (elementTokens.GetLength(0) > 1)
                    {
                        XmlNode findNode = null;
                        if (methodNameNameSpace.Equals(namespaceUri))
                        {
                            findNode = xmlDoc.DocumentElement.SelectSingleNode("//" + methodNamePrefix + ":" + elementTokens[0], nsm);
                        }
                        else
                        {
                            findNode = xmlDoc.DocumentElement.SelectSingleNode("//" + prefix + ":" + elementTokens[0], nsm);
                        }
                        if (findNode == null)
                        { //new parameter parent
                            if (methodNameNameSpace.Equals(namespaceUri))
                            {
                                String elementName = elementTokens[0];
                                if (enablePrefix && prefixToChildTags)
                                {
                                    newElementNode = xmlDoc.CreateElement(methodNamePrefix, elementName, xmlDoc.DocumentElement.NamespaceURI);
                                }
                                else
                                {
                                    newElementNode = xmlDoc.CreateElement(elementName, namespaceUri);
                                }
                            }
                            else
                            {
                                if (enablePrefix && prefixToChildTags)
                                {
                                    newElementNode = xmlDoc.CreateElement(prefix, elementTokens[0], namespaceUri);
                                }
                                else
                                {
                                    newElementNode = xmlDoc.CreateElement(elementTokens[0], namespaceUri);
                                }
                            }
                            root.AppendChild(newElementNode);
                            parent = newElementNode;
                        }
                        else
                        {

                            parent = (XmlElement)findNode;


                        }

                        for (int i = 1; i < elementTokens.GetLength(0); i++)
                        {
                            String elementToken = elementTokens[i];
                            XmlElement saveParent = parent; //get the correct parent at each level when forming the complex param heirarchy
                            XmlNodeList findNodeList = parent.SelectNodes("child::node()");//"//"+elementToken);
                            for (int j = 0; j < findNodeList.Count; j++)
                            {
                                if (findNodeList[j].LocalName == elementToken)
                                {
                                    parent = (XmlElement)findNodeList[j];
                                    break;
                                }
                            }
                            if (parent.Equals(saveParent))
                            {//end of common ancestors - add the new node

                                if (enablePrefix && prefixToChildTags)
                                {
                                    if (methodNameNameSpace.Equals(namespaceUri))
                                    {
                                        newElementNode = xmlDoc.CreateElement(methodNamePrefix, elementToken, xmlDoc.DocumentElement.NamespaceURI);
                                    }
                                    else
                                    {
                                        newElementNode = xmlDoc.CreateElement(prefix, elementToken, namespaceUri);
                                    }

                                }
                                else
                                {
                                    newElementNode = xmlDoc.CreateElement(elementToken, namespaceUri);
                                }

                                parent.AppendChild(newElementNode);
                                parent = newElementNode;
                            }
                        }
                        XmlText text = xmlDoc.CreateTextNode(value);
                        parent.AppendChild(text);
                    }
                    else
                    { //with Prefix but no dotted separation 
                        String elementName = tokens[1];
                        if (methodNameNameSpace.Equals(namespaceUri))
                        {

                            if (enablePrefix && prefixToChildTags)
                            {
                                newElementNode = xmlDoc.CreateElement(methodNamePrefix, elementName, xmlDoc.DocumentElement.NamespaceURI);
                            }
                            else
                            {
                                newElementNode = xmlDoc.CreateElement(elementName, xmlDoc.DocumentElement.NamespaceURI);
                            }

                        }
                        else
                        {
                            if (enablePrefix && prefixToChildTags)
                            {
                                newElementNode = xmlDoc.CreateElement(prefix, tokens[1], namespaceUri);
                            }
                            else
                            {
                                newElementNode = xmlDoc.CreateElement(tokens[1], namespaceUri);
                            }
                        }

                        XmlText text = xmlDoc.CreateTextNode(value);
                        newElementNode.AppendChild(text);
                        root.AppendChild(newElementNode);

                        //returnResult = "\n<" + prefix_key+":"+ tokens[1]+ " xmlns:" + prefix + "=\"" + namespaceUri + "\"" + ">" + value + "</" + prefix_key + ">";
                    }
                }
                else // no prefix from Parameters, but dotted seperation
                {
                    String[] elementTokens = prefix_key.Split('.');
                    if (elementTokens.GetLength(0) > 1)
                    {
                        XmlNode findNode = null;
                        if (enablePrefix && prefixToChildTags)
                        {
                            findNode = root.SelectNodes("//" + methodNamePrefix + ":" + elementTokens[0], nsm)[0];
                        }
                        else
                        {
                            findNode = root.SelectNodes("//" + elementTokens[0])[0];
                        }
                        if (findNode == null)
                        {
                            if (enablePrefix && prefixToChildTags)
                            {
                                newElementNode = xmlDoc.CreateElement(methodNamePrefix, elementTokens[0], xmlDoc.DocumentElement.NamespaceURI);
                            }
                            else
                            {
                                newElementNode = xmlDoc.CreateElement(elementTokens[0]);
                            }
                            root.AppendChild(newElementNode);
                            parent = newElementNode;
                        }
                        else
                        {
                            findNode = null;
                            if (enablePrefix && prefixToChildTags)
                            {
                                findNode = root.SelectNodes("//" + methodNamePrefix + ":" + elementTokens[0], nsm)[0];
                            }
                            else
                            {
                                findNode = root.SelectNodes("//" + elementTokens[0])[0];
                            }

                            if (findNode == null)
                            {
                                if (enablePrefix && prefixToChildTags)
                                {
                                    newElementNode = xmlDoc.CreateElement(methodNamePrefix, elementTokens[0], xmlDoc.DocumentElement.NamespaceURI);
                                }
                                else
                                {
                                    newElementNode = xmlDoc.CreateElement(elementTokens[0]);
                                }
                                root.AppendChild(newElementNode);
                                parent = newElementNode;
                            }

                            else
                            {
                                parent = (XmlElement)findNode;
                            }
                        }
                        for (int i = 1; i < elementTokens.GetLength(0); i++)
                        {

                            String elementToken = elementTokens[i];
                            XmlElement saveParent = parent;
                            XmlNodeList findNodeList = parent.SelectNodes("child::node()");//"//"+elementToken);


                            for (int j = 0; j < findNodeList.Count; j++)
                            {
                                if (findNodeList[j].LocalName == elementToken)
                                {
                                    parent = (XmlElement)findNodeList[j];
                                    break;
                                }
                            }
                            if (parent.Equals(saveParent))
                            {
                                if (enablePrefix && prefixToChildTags)
                                {
                                    newElementNode = xmlDoc.CreateElement(methodNamePrefix, elementToken, xmlDoc.DocumentElement.NamespaceURI);

                                }
                                else
                                {
                                    newElementNode = xmlDoc.CreateElement(elementToken);
                                }
                                parent.AppendChild(newElementNode);
                                parent = newElementNode;
                            }
                        }
                        XmlText text = xmlDoc.CreateTextNode(value);
                        parent.AppendChild(text);
                    }
                    else
                    { //no Prefix and no dotted separation
                        if (enablePrefix && prefixToChildTags)
                        {
                            newElementNode = xmlDoc.CreateElement(methodNamePrefix + ":" + prefix_key, xmlDoc.DocumentElement.NamespaceURI);
                        }
                        else
                        {
                            newElementNode = xmlDoc.CreateElement(prefix_key);
                        }
                        XmlText text = xmlDoc.CreateTextNode(value);
                        newElementNode.AppendChild(text);
                        root.AppendChild(newElementNode);
                        //returnResult = "\n<" + prefix_key + ">" + value + "</" + prefix_key + ">";
                    }


                }

            }
            xmlDoc.WriteTo(xmlTextWriter);
            returnResult = returnResult + stringWriter.ToString();
            m_Log.Debug("returnResult: " + returnResult);
            m_Log.Debug("generateSOAPRequest() out");
        }
        catch (Exception e)
        {
            m_Log.Debug(e.Message);
            returnResult = e.Message;
        }
        return returnResult;		
    }

    public X509Certificate2 FindCertificate(String certStoreName, String certName, String certStoreLocation)
    {
    	m_Log.Debug("FindCertificate() in");
	m_Log.Debug("certStoreName: " + certStoreName);
	m_Log.Debug("certName: " + certName);
    	m_Log.Debug("certStoreLocation: " + certStoreLocation);
        StoreLocation storeLoc = StoreLocation.CurrentUser;

        if (!certStoreLocation.Equals("StoreLocation.CurrentUser"))
        {
            storeLoc = StoreLocation.LocalMachine;
        }
        X509Store store = new X509Store(certStoreName, storeLoc);
        try
        {
            // open store for read-only access
            store.Open(OpenFlags.ReadOnly);

            // search store
            X509Certificate2Collection col = store.Certificates.Find(
                X509FindType.FindBySubjectDistinguishedName, certName, false);


            // return first certificate found
            if (col.Count > 0)
            {
                return col[0];
            }
            else
            {
                return null;
            }

        }
        catch (Exception e)
        {
            m_Log.Error("Exception: " + e.Message);
            Response.AppendToLog("Error in finding certificate");
            Response.AppendToLog("Exception Occured: " +e.Message.ToString());
            return null;
        }
        // always close the store
        finally { store.Close(); }
    }


    public String SignSOAPMessage(X509Certificate2 cert, String soapString,String sigAlgorithm)
    {

            m_Log.Debug("SignSOAPMessage() in");
	    m_Log.Debug("soapString: " + soapString);
            m_Log.Debug("sigAlgorithm: " + sigAlgorithm);
       	    X509SecurityToken securityToken = null;
            StringWriter str = new StringWriter();

            WebServcClient ws = new WebServcClient();
            SoapContext requestContext = ws.RequestSoapContext;
            requestContext.Envelope = new SoapEnvelope();
            requestContext.Envelope.LoadXml(soapString);
            securityToken = new X509SecurityToken(cert);

           
            // Add the X509 certificate to the WS-Security header.
            requestContext.Security.Tokens.Add(securityToken);

            // Sign the message using the X509 certificate.
             MessageSignature sig  = new MessageSignature(securityToken);
            
            // Add the WS-Security header to the SOAP message.
            requestContext.Security.Elements.Add(sig);
            requestContext.Security.SerializeXml(requestContext.Envelope);
            

            XmlTextWriter w = new XmlTextWriter(str);
            if (requestContext.Envelope != null)
            {
                requestContext.Envelope.WriteContentTo(w);
            }
            else
            {
                Response.AppendToLog("SOAP Envelope is null");
            }
       m_Log.Debug("result: " + str.ToString());
       m_Log.Debug("SignSOAPMessage() out");
       return str.ToString();

    }
        
</script>




<%
	log4net.Config.XmlConfigurator.Configure(); 
    m_Log.Debug("_________________________________________________");
    m_Log.Debug("getWebService() In");

    // extract parameters
    String WebUrl =""; 
    String Parameters = "";
    String Protocol= "";
    String AuthenAccess ="";
    String UserName ="";
    String Password ="";
    String readWriteTimeout = "20000";  // timeout in milliseconds
    String conTimeout = "20000";   // timeout in milliseconds
    String MethodName = "";
    String SoapActionURI = "";
    String TargetNameSpace = "";
   
    OrderedDictionary paramTable = new OrderedDictionary();
	String InputCustomHeadersString="";
	String elementFormDefaultAttr = "";
	String certStoreLocation = "";
    String certName = "";
    String certStoreName = "";
    String sigAlgorithm = "";
    String namespaceMapStr = "";
    String CustomPrefix = "p";
    Boolean EnableNSPrefix = false;
    Boolean PrefixForChildTags = false;    
    Boolean enableProxy=false;
    String proxyHost="";
	int proxyPort=0;
	String proxyUserName="";
	String proxyPassword="";
	String customSOAPEnv="";
	String variableScope="";
	String appStateJSONStr="";
    String userTypeVarsJSONStr="";
    
    Stream ins = HttpContext.Current.Request.InputStream;
    StreamReader reader = new StreamReader(ins);
    string jsonStr = reader.ReadToEnd();

    JObject requestObj = JObject.Parse(jsonStr);

    WebUrl                  = (string)requestObj["WebUrl"];
    Protocol                = (string)requestObj["Protocol"];
    //encType = requestObj.getString("Enctype");
    
     AuthenAccess            = (string)requestObj["AuthenAccess"];
     if (AuthenAccess.Equals("HTTPBasicAuthentication") || AuthenAccess.Equals("SOAPSignatureWithHTTPBasicAuthentication"))
     {
        UserName = (string)requestObj["UserName"];
        Password = (string)requestObj["Password"];
     }
    MethodName              = (string)requestObj["MethodName"];
    
    JObject namespacePrefixMap = null;
    JObject appStateJSON = null;
    JObject userTypeVarsJSON = null;
    if (Protocol.ToUpper().EndsWith("SOAP"))
    {
	    SoapActionURI           = (string)requestObj["SOAPActionURI"];
	    TargetNameSpace         = (string)requestObj["targetNameSpaceUri"];    
	    sigAlgorithm            = (string)requestObj["SigAlgorithm"];
	    elementFormDefaultAttr  = (string)requestObj["ElementFormDefaultAttr"];
	    certName                = (string)requestObj["CertAlias"];
	    certStoreLocation       = (string)requestObj["KeyStoreFilePath"];
	    certStoreName           = (string)requestObj["CertStoreName"];
		namespaceMapStr 		= (string)requestObj["NameSpaceMap"];
	    CustomPrefix            = (string)requestObj["CustomPrefix"];
	    EnableNSPrefix          = (Boolean)requestObj["EnableNSPrefix"];
	    PrefixForChildTags      = (Boolean)requestObj["PrefixForChildTags"];
	    customSOAPEnv 			= (string)requestObj["CustomSOAPEnvFileName"];
		variableScope 			= (string)requestObj["VariableScope"];
		appStateJSONStr			= (string)requestObj["AppStateString"];
	    userTypeVarsJSONStr		= (string)requestObj["UserTypeVars"];
    
	     
	    try
	       {
	        	namespacePrefixMap = JObject.Parse(namespaceMapStr);
	        }
	   catch (Exception e)
	       {
	         Response.AppendToLog("Error in namespaceMapStr parse: "+e.ToString());
	       }
	     
	     
	         try
	            {
	        		appStateJSON = JObject.Parse(appStateJSONStr);
	        	}
	         catch (Exception e)
	         {
	         	Response.AppendToLog("Error in appStateJSONStr parse: "+e.ToString());
	     }
	     
	     
	         try
	            {
	        		userTypeVarsJSON = JObject.Parse(userTypeVarsJSONStr);
	        	}
	         catch (Exception e)
	         {
	         	Response.AppendToLog("Error in userTypeVarsJSONStr parse: "+e.ToString());
	      }	
     
     }
     
    // Proxy parameters
    enableProxy 			= (Boolean)requestObj["enableProxy"];
    proxyHost 				= (string)requestObj["proxyHost"];
	proxyPort 				= (int)requestObj["proxyPort"];
	proxyUserName 			= (string)requestObj["proxyUserName"];
	proxyPassword 			= (string)requestObj["proxyPassword"];

    // the value passed from the block property overrides the 
    // global value in the composer.properties
    String timeout = (string)requestObj["Timeout"];
    if (timeout != null && timeout.Trim().Length > 0)
    {
        try
        {
            int timeoutInt = Int32.Parse(timeout);
            if (timeoutInt != -1)
            {
                conTimeout = Convert.ToString(timeoutInt * 1000);
                readWriteTimeout = Convert.ToString(timeoutInt * 1000);
            }
        }
        catch (FormatException e)
        {
            Response.AppendToLog("Error in Timeout parse: "+e.ToString());
        }
    }
    
   JArray jsonArr      = (JArray)requestObj["Parameters"];
  
          
      if (jsonArr!= null)
    {
        
               /* if (InputParamString!=null && InputParamString.StartsWith("("))
                {
                    InputParamString = InputParamString.Substring(1, InputParamString.Length - 2);
                }*/

               // JArray jsonArr = JArray.Parse(InputParamString);
                

                for (int i = 0; i < jsonArr.Count(); i++)
                {
                	
                    JObject child = (JObject)jsonArr[i];
                    
                    if (child == null)
                        continue;

                    JValue keyToken = (JValue)child["name"];
                    JValue valueToken = (JValue)child["value"];

                    if (keyToken == null || valueToken == null)
                        continue;

                    string strKey = (string)keyToken.Value;
                    string strValue = "";
                    if (valueToken.Type.Equals(JsonTokenType.String))
                    {
                        strValue = (string)valueToken.Value;
                    }
                    else
                    {
                        strValue = valueToken.Value.ToString();
                    }
                    
                    // add to map
                    if (!Parameters.Equals(""))
                    {
                        Parameters = Parameters + "&";
                    }
                    Parameters = Parameters + Server.UrlEncode(strKey) + "=" + Server.UrlEncode(strValue);
                    // fill the Param table for SOAP message body
                    
                    paramTable.Add(strKey, strValue);
                }

    }

	
    InputCustomHeadersString = (string)requestObj["CustomHeaders"];
  
    if (InputCustomHeadersString != null && InputCustomHeadersString.StartsWith("("))
    {
        InputCustomHeadersString = InputCustomHeadersString.Substring(1, InputCustomHeadersString.Length - 2);
    }
    
   
       


 %>
 <%
     //relative path processing

     string relativePath = "http://localhost:"; ;
     if (WebUrl.StartsWith("."))
     {
         int slashindex = WebUrl.IndexOf("/");
         if (slashindex != -1)
         {
             int n = WebUrl.Length;
             WebUrl = WebUrl.Substring(slashindex + 1, n - slashindex-1);
         }

         if (HttpContext.Current.Request.ServerVariables["SERVER_PORT"] != "80")
         {
             relativePath += HttpContext.Current.Request.ServerVariables["SERVER_PORT"];
         }
         relativePath = relativePath + HttpContext.Current.Request.RawUrl.ToString();
         int boundary = relativePath.IndexOf("include");
         if(boundary !=-1){
             relativePath = relativePath.Substring(0, boundary);
         }
         WebUrl = relativePath + WebUrl;
         m_Log.Debug("WebUrl: " + WebUrl);
     }
 %>
 <%
    if (WebUrl.Length > 0)
    {
    
         Response.Write(fetchURL(WebUrl, Protocol, Parameters, readWriteTimeout, conTimeout,AuthenAccess,
             UserName, Password, MethodName, SoapActionURI, TargetNameSpace, paramTable,InputCustomHeadersString, certStoreName, certName, certStoreLocation, sigAlgorithm,namespacePrefixMap, CustomPrefix,EnableNSPrefix,PrefixForChildTags,
             enableProxy,proxyPort,proxyHost,proxyUserName,proxyPassword,customSOAPEnv,variableScope,appStateJSON,userTypeVarsJSON));
    }
      m_Log.Debug("getWebService() Out");
 %>
 

