<?xml version="1.0" encoding="utf-8"?>
<%@ Page Language="C#" ContentType="text/xml" Inherits="WebService"%>
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
 
<script runat="server">
    /************************ fetchURL *******************/
    String fetchURL(string url, string protocol, string parameters,
                    string readWriteTimeout, string conTimeout, string authenAccess,
                    string userName, string password, string methodName,
                    string soapActionURI, string targetNameSpace, OrderedDictionary paramTable,
                    string inputCustomHeadersString,string certStoreName,string certName, string certStoreLocation,string sigAlgorithm)
     {
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
                url = url + "/" + methodName + "?" + parameters;
                method = "GET";
            }
            else if (protocol.ToUpper().EndsWith("POST"))
            {
                url = url + "/" + methodName;
                method = "POST";
            }
            else
            {
                method = "SOAP";
            }


            request = (HttpWebRequest)WebRequest.Create(url);
            if (method.Equals("SOAP"))
            {
                request.Method = "POST";
            	//request.ContentType = "application/soap+xml;charset=utf-8";
            	
	        } 
            else
            {
                request.Method = method;
                //request.ContentType = "text/xml";
            }
            
			request.ContentType = "text/xml";
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
	                Response.AppendToLog(strKey + "~" + strValue + "~");
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
                
                string soapRequest = generateSOAPRequest(targetNameSpace, authenAccess, userName, password, methodName, parameters, paramTable,certStoreName,certName, certStoreLocation,sigAlgorithm);
                UTF8Encoding encoding = new UTF8Encoding();
                byte[] bytes = encoding.GetBytes(soapRequest);
                request.ContentLength = bytes.Length;
                using (Stream writeStream = request.GetRequestStream())
                {
                    writeStream.Write(bytes, 0, bytes.Length);
                    writeStream.Close();
                }
            }
            Response.AppendToLog("before getting web response");
            HttpWebResponse webResponse = (HttpWebResponse)request.GetResponse();
            //Response.AppendToLog("web response: " + webResponse.ToString());
            StreamReader input = new StreamReader(webResponse.GetResponseStream());
            result += convertToJson(input, method);
            result += "\"/>";
            result += "<block>";
            result += "<return namelist='result'/>";
            result += "</block>";

        }
        catch (System.Net.WebException we)
        {
            Response.AppendToLog("A SOAP Fault: " + we.ToString());
            if (null != we.Response)
            {
                HttpWebResponse webResponse = (HttpWebResponse) we.Response;
                StreamReader input = new StreamReader(webResponse.GetResponseStream());
                string jsonStr = convertToJson(input, method);
                Response.AppendToLog("JSON fault:" + jsonStr);
                result += "\"/>";
                result += "<block><return event=\"error.com.genesyslab.composer.webservice.badFetch\" message=\"'";
                result += jsonStr;
                result += "'\"/></block>";

            }
            
            
        }
        catch (Exception e)
        {
            Response.AppendToLog("exception: " + e.ToString());
            // handle the SOAP fault
            result = "'";
            result += "'\"/>";
            result += "<block> <return event=\"'error.com.genesyslab.composer.webservice.badFetch'\" message=\"'";
            result += e.Message.ToString().Replace('"', '\'');
            result += "'\"/></block>";
        }
        
        return result;
     }


     /**************convertToJson****************************/
     string convertToJson(StreamReader reader, String method)
     {
         string json = "";
         string data = reader.ReadToEnd();
         	Response.AppendToLog("web response: " + data);
         
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
                 XmlDocument doc = new XmlDocument();
                 doc.LoadXml(data);
                 reader.Close();

                 System.Xml.XmlNode soapNode = doc.ChildNodes[0];
                 System.Xml.XmlNode soapBodyNode = doc.ChildNodes[0];


                 json = Newtonsoft.Json.JavaScriptConvert.SerializeXmlNode(doc.DocumentElement);
         }


             json = json.Replace("&", "&amp;");
             json = json.Replace("\'", "&apos;");
             json = json.Replace("\"", "&quot;");
             json = json.Replace(">", "&gt;");
             json = json.Replace("<", "&lt;");
         return json;
     }

    /***********************generateSOAPRequest**********************************/
    public String generateSOAPRequest(string targetNameSpaceUri, string authenAccess, string userName,string passWord, string methodName, string parameters, OrderedDictionary paramTable,
                                        string certStoreName, string certName, string certStoreLocation, string sigAlgorithm)
    {
        
        String returnResult ="";
        
        String requestStruct = "<soapenv:Envelope xmlns:soapenv=" +
                "\"http://schemas.xmlsoap.org/soap/envelope/\"" +
                " xmlns:q0=\"" + targetNameSpaceUri + "\"" +
                " xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"" +
                " xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">";

        if (authenAccess.Equals("SOAPMessageLevelBasicAuthentication"))
        {
            requestStruct = requestStruct + "\n<SOAP-ENV:Header>"
                + "\n<h:BasicAuth xmlns:h=\"http://soap-authentication.org/basic/2001/10/" +
                   " SOAP-ENV:mustUnderstand='1'>" +
                   "\n<Name>" + userName + "</Name>" +
                   "<Password>" + passWord + "</Password>" +
                   "\n</h:BasicAuth>" +
                   "\n</SOAP-ENV:Header>";
            requestStruct = requestStruct + "\n<SOAP-ENV:Body>" + "\n<p:" + methodName + " xmlns:p=\"" + targetNameSpaceUri + "\"" + ">";
            foreach (DictionaryEntry de in paramTable)
            {
                String key = (string)de.Key;
                String value = (string)de.Value;
                requestStruct = requestStruct + "\n<" + key + ">" + value + "</" + key + ">";
            }
            requestStruct = requestStruct +
                           "\n</p:" + methodName + ">" +
                           "\n</SOAP-ENV:Body>" +
                           "\n</SOAP-ENV:Envelope>";

            returnResult= requestStruct;
        }
        else if(authenAccess.Equals("SOAPDigitalSignatureAuthentication") || authenAccess.Equals("SOAPSignatureWithHTTPBasicAuthentication"))
        {
            String signedSOAPContent = null;
            requestStruct = requestStruct + "\n<SOAP-ENV:Header>"+"\n</SOAP-ENV:Header>";
            requestStruct = requestStruct + "\n<SOAP-ENV:Body>" + "\n<p:" + methodName + " xmlns:p=\"" + targetNameSpaceUri + "\"" + ">";
            
            foreach (DictionaryEntry de in paramTable)
            {
                String key = (string)de.Key;
                String value = (string)de.Value;
                requestStruct = requestStruct + "\n<" + key + ">" + value + "</" + key + ">";
            }
            requestStruct = requestStruct +
                           "\n</p:" + methodName + ">" +
                           "\n</SOAP-ENV:Body>" +
                           "\n</SOAP-ENV:Envelope>";

            
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
         //requestStruct = requestStruct + "\n<soapenv:Body>" + "\n<q0:" + methodName + " xmlns:q0=\"" + targetNameSpaceUri + "\"" + ">";
            requestStruct = requestStruct + "\n<soapenv:Body>" + "\n<q0:" + methodName + ">";
            
            foreach (DictionaryEntry de in paramTable)
            {
                String key = (string)de.Key;
                String value = (string)de.Value;
                requestStruct = requestStruct + "\n<q0:" + key + ">" + value + "</q0:" + key + ">";
            }
            requestStruct = requestStruct +
                           "\n</q0:" + methodName + ">" +
                           "\n</soapenv:Body>" +
                           "\n</soapenv:Envelope>";
            returnResult= requestStruct;
        
        }
        Response.AppendToLog(returnResult);
        return returnResult;
    }
  

    public X509Certificate2 FindCertificate(String certStoreName, String certName, String certStoreLocation)
    {
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
                //  Response.Write("Found cer\n");
                return col[0];
            }
            else
            {
                return null;
            }

        }
        catch (Exception e)
        {
        	Response.AppendToLog("Exception Occured: " +e.Message.ToString());
            Response.AppendToLog("Error in finding certificate");
            return null;
        }
        // always close the store
        finally { store.Close(); }
    }


    public String SignSOAPMessage(X509Certificate2 cert, String soapString,String sigAlgorithm)
    {

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
        
       return str.ToString();

    }
        
</script>




<%
        Response.Write("<vxml version='2.1' xmlns='http://www.w3.org/2001/vxml'>");
        Response.Write("<form>");    
    // extract parameters
    String WebUrl =""; 
    String Parameters = "";
    String Protocol= "";
    String AuthenAccess ="";
    String UserName ="";
    String Password ="";
    String readWriteTimeout = "100000";  // timeout in milliseconds
    String conTimeout = "100000";   // timeout in milliseconds
    String MethodName = "";
    String SoapActionURI = "";
    String TargetNameSpace = "";
    String InputParamString = "";
    OrderedDictionary paramTable = new OrderedDictionary();
    String InputCustomHeadersString="";

    String certStoreLocation = "";
    String certName = "";
    String certStoreName = "";
    String sigAlgorithm = "";
    
        foreach (string key in HttpContext.Current.Request.Params)
        {
            //Response.AppendToLog("key:" + key.Trim() + HttpContext.Current.Request.Params[key.Trim()] + "\n");

        
            if (key.Trim().Equals("ALL_HTTP"))
            {
                // we have reached the end of custom Params.
                break;
            }
            if(key.Trim().Equals("WebUrl")){
                WebUrl = HttpContext.Current.Request.Params["WebUrl"];
            }
            else if (key.Trim().Equals("Protocol"))
            {
                Protocol = HttpContext.Current.Request.Params["Protocol"];
            }
            else if (key.Trim().Equals("AuthenAccess"))
            {
                AuthenAccess = HttpContext.Current.Request.Params["AuthenAccess"];
            }
            else if (key.Trim().Equals("UserName"))
            {
                UserName = HttpContext.Current.Request.Params["UserName"];
            }
            else if (key.Trim().Equals("Password"))
            {
                Password = HttpContext.Current.Request.Params["Password"];
            }
            else if (key.Trim().Equals("MethodName"))
            {
                MethodName = HttpContext.Current.Request.Params["MethodName"];
            }
            else if (key.Trim().Equals("SOAPActionURI"))
            {
                SoapActionURI = HttpContext.Current.Request.Params["SOAPActionURI"];
            }
            else if (key.Trim().Equals("targetNameSpaceUri"))
            {
                TargetNameSpace = HttpContext.Current.Request.Params["targetNameSpaceUri"];
            }
            else if (key.Trim().Equals("CertAlias"))
            {
                certName = HttpContext.Current.Request.Params["CertAlias"];
			}
            else if (key.Trim().Equals("KeyStoreFilePath"))
            {
                certStoreLocation = HttpContext.Current.Request.Params["KeyStoreFilePath"];
            } 
            else if (key.Trim().Equals("SigAlgorithm"))
            {
				sigAlgorithm = HttpContext.Current.Request.Params["SigAlgorithm"];
			}
            else if (key.Trim().Equals("CertStoreName"))
            {
                certStoreName = HttpContext.Current.Request.Params["CertStoreName"];
            }
            else if (key.Trim().Equals("KeyStorePass")) 
            {
				// do Nothing
			}			
			else if (key.Trim().Equals("PrivateKeyPass")) 
			{
				// do Nothing
			}
			else if (key.Trim().Equals("PrivateKeyAlias")) 
			{
				// do Nothing
			}
            else if (key.Trim().Equals("InputParamString"))
            {
                //Response.AppendToLog("got InputParamString: " + key.Trim() + "<br>");
                InputParamString = HttpContext.Current.Request.Params["InputParamString"];
                if (InputParamString!=null && InputParamString.StartsWith("("))
                {
                    InputParamString = InputParamString.Substring(1, InputParamString.Length - 2);
                }

                JArray jsonArr = JArray.Parse(InputParamString);
                
                for (int i = 0; i < jsonArr.Count(); i++)
                {
                    JObject child = (JObject)jsonArr[i];
                    if (child == null)
                        continue;

                    JValue keyToken = (JValue)child["name"];
                    JValue valueToken = (JValue)child["value"];
                    
                     if (keyToken == null || valueToken == null)
		                        {
		                            continue;
		                        	//Response.AppendToLog("NULL Check");    
		                        }
		    			
		    		    
		                        string strKey = (string)keyToken.Value;
		                        string strValue = "";
		                                      	    
		                   	    // Anil M Added the Try Catch...on 24-Jun-2013 - 500 Error.
		                   	    try
		                   	    {
		    			    if (valueToken.Type.Equals(JsonTokenType.String))
		    			    {
		    				strValue = (string)valueToken.Value;
		    			    }
		    			    else
		    			    {
		    				strValue = valueToken.Value.ToString();
		    			    }
		                        }
                    catch{ strValue = "";}

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
            else if (key.Trim().Equals("InputCustomHeadersString"))
            {
                //Response.AppendToLog("got InputCustomHeadersString: " + key.Trim() + "<br>");
                InputCustomHeadersString = HttpContext.Current.Request.Params["InputCustomHeadersString"];
                if (InputCustomHeadersString!=null && InputCustomHeadersString.StartsWith("("))
                {
                    InputCustomHeadersString = InputCustomHeadersString.Substring(1, InputCustomHeadersString.Length - 2);
                }
            }
            else
            {
                if (!Parameters.Equals(""))
                {
                    Parameters = Parameters + "&";
                }
                string value = HttpContext.Current.Request.Params[key];
                Parameters = Parameters + Server.UrlEncode(key) + "=" + Server.UrlEncode(value);

                // fill the Param table for SOAP message body
                paramTable.Add(key, value);
            }
            
        }
        //Response.AppendToLog("params: " + Parameters);
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
     }
 %>
 <%
         Response.Write("<var name='result' expr=\"");
    if (WebUrl.Length > 0)
    {
         Response.Write(fetchURL(WebUrl, Protocol, Parameters, readWriteTimeout, conTimeout,AuthenAccess,UserName, Password, MethodName, SoapActionURI, TargetNameSpace, paramTable, InputCustomHeadersString, certStoreName, certName, certStoreLocation, sigAlgorithm));
    }
    else
    {
            Response.Write("'");
            Response.Write("'\"/>");
            Response.Write("<block>");
            Response.Write("<return namelist='result'/>");
            Response.Write("</block>");
     }
         Response.Write("</form>");
         Response.Write("</vxml>");
 %>
 


