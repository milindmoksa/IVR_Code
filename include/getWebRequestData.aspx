<%@ Page Language="C#" ContentType="application/json;charset=utf-8"%>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Xml" %>
<%@ Import Namespace="System.Web" %>
<%@ Import Namespace="Newtonsoft.Json" %>
<%@ Import Namespace="Newtonsoft.Json.Linq" %>
<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="log4net" %>

<script runat="server">
	static readonly ILog m_Log = LogManager.GetLogger("getWebRequest");
    String appUrlEncoded = "application/x-www-form-urlencoded";
    String appJson = "application/json";
    String textXml = "text/xml";
    String appXml = "application/xml";
    String textPlain = "text/plain";
    
    /************************ fetchURL *******************/
    String fetchURL(string url, string protocol, string enctype, string parameters,
                    string readWriteTimeout, string conTimeout,
                    string userName, string password, JObject CustomHeaders, JToken JsonContent)
     {
     	m_Log.Debug("fetchURL(" + url + ", " + protocol + ", " + enctype + ", " + parameters + ", " + 
     		readWriteTimeout + ", " + conTimeout + ", " + userName + ", " + password + ") in");
        String result = "";
        String method ="GET";
        String loginCredentials = userName + ":" + password;
        
        // Accepting self-signed certificates
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
            if (protocol.EndsWith("get") || protocol.EndsWith("delete"))
            {
                url = url + (String.IsNullOrEmpty(parameters) ? "" : ("?" + parameters));
            }

            method = protocol.ToUpper();
            
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            
            request.Method = method;
            request.ContentType = enctype;
            request.Timeout = Int32.Parse(conTimeout);
            request.ReadWriteTimeout = Int32.Parse(readWriteTimeout);


            if (loginCredentials.Length>1)
            {
                request.Headers.Add("Authorization", "Basic " + Convert.ToBase64String(new ASCIIEncoding().GetBytes(loginCredentials)));
            }


            if (CustomHeaders != null)
            {
                //Custom HTTP headers
                JEnumerable<JProperty> children = CustomHeaders.Children<JProperty>();

                foreach (JProperty child in children)
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
                    
                    m_Log.Debug("request key: '" + strKey + "' -- value: '" + strValue + "'"); 
                    if (strKey.Trim().Equals("Accept"))
                    {
                        request.Accept = strValue;
                    }
                    else if (strKey.Trim().Equals("Connection"))
                    {
                        request.Connection = strValue;
                    }
                    else if (strKey.Trim().Equals("Content-Length"))
                    {
                        request.ContentLength = strValue.Length;
                    }
                    else if (strKey.Trim().Equals("Content-Type"))
                    {
                        request.ContentType = strValue;
                    }
                    else if (strKey.Trim().Equals("Expect"))
                    {
                        request.Expect = strValue;
                    }

                    else if (strKey.Trim().Equals("If-Modified-Since"))
                    {
                        request.IfModifiedSince = DateTime.Parse(strValue);
                    }
                    else if (strKey.Trim().Equals("Referer"))
                    {
                        request.Referer = strValue;
                    }
                    else if (strKey.Trim().Equals("Transfer-Encoding"))
                    {
                        request.TransferEncoding = strValue;
                    }
                    else if (strKey.Trim().Equals("User-Agent"))
                    {
                        request.UserAgent = strValue;
                    }
                    else
                    {
                        request.Headers.Add(strKey, strValue);
                    }
                }
            }
            
            if (method.Equals("POST") || method.Equals("PUT"))
            {
                using (Stream writeStream = request.GetRequestStream())
                {
                    UTF8Encoding encoding = new UTF8Encoding();

                    if (enctype.Equals(appJson))
                    { 
                        if (JsonContent != null)
                        {
                            if (JsonContent is JObject)
                            {
                                JObject obj = (JObject)JsonContent;
                                m_Log.Debug(enctype + " encoding JObject: " + obj.ToString());
                                byte[] bytes = encoding.GetBytes(obj.ToString());
                                writeStream.Write(bytes, 0, bytes.Length);

                            }
                            else if (JsonContent is JArray)
                            {
                                JArray obj = (JArray)JsonContent;
                                m_Log.Debug(enctype + " encoding JObject: " + obj.ToString());
                                byte[] bytes = encoding.GetBytes(obj.ToString());
                                writeStream.Write(bytes, 0, bytes.Length);

                            }
                            else
                            {
                                JObject obj = new JObject();
                                obj.Add(new JProperty("content", JsonContent));
                                m_Log.Debug(enctype + " encoding: " + obj.ToString());
                                byte[] bytes = encoding.GetBytes(obj.ToString());
                                writeStream.Write(bytes, 0, bytes.Length);
                                
                            }
                        }
                    }
                    else if (enctype.Equals(appUrlEncoded))
                    {
                        m_Log.Debug(enctype + " encoding parameters: " + parameters);
                        byte[] bytes = encoding.GetBytes(parameters);
                        writeStream.Write(bytes, 0, bytes.Length);
                    }
                    writeStream.Close();
                }
            }
            
            HttpWebResponse webResponse = (HttpWebResponse)request.GetResponse();
            
            StreamReader input = new StreamReader(webResponse.GetResponseStream());
            result = "";
	    result += convertToJson(input, webResponse.ContentType);
        }
        catch (Exception e)
        {
            Dictionary<string, string> d1 = new Dictionary<string, string>();
            string value = "error.com.genesyslab.composer.servererror message= " + e.Message.ToString();
            d1.Add("errorMsg", value);

            result = Newtonsoft.Json.JavaScriptConvert.SerializeObject(d1);
            Response.AppendToLog("GeneralException:" + result);
        }
        
     	m_Log.Debug("result: " + result);
     	m_Log.Debug("fetchURL() out");
        return result;
     }

    string parseResultData(StreamReader reader, JsonTextReader jsonReader, string initialData)
    {
	    m_Log.Debug("parseResultData(" + initialData + ") In");
        string json = "";
        try
        {
            jsonReader.Read();
            // JSON string
            json += initialData;
            Response.AppendToLog("ContentTypeUnkJSON");
		    m_Log.Debug("parseResultData() Out");
            return json;
        }
        catch (JsonReaderException)
        {
		    m_Log.Debug("parseResultData() JsonReaderException");
            // not a valid JSON - check for XML
            try
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(initialData);
                reader.Close();
                json = Newtonsoft.Json.JavaScriptConvert.SerializeXmlNode(doc.DocumentElement);
                Response.AppendToLog("ContentTypeUnkXML");
			    m_Log.Debug("parseResultData() Out");
                return json;
            }
            catch (Exception e)
            {
			    m_Log.Debug("parseResultData() Exception: " + e.Message);
                Response.AppendToLog("ContentTypeUnkTEXT");
                Response.AppendToLog("Exception Occured: " +e.Message.ToString());
                Dictionary<string, string> d1 = new Dictionary<string, string>();
                d1.Add("result", initialData);
                string jsonText = Newtonsoft.Json.JavaScriptConvert.SerializeObject(d1);
                return jsonText;
            }
        }
    }
    
     /**************convertToJson****************************/
    string convertToJson(StreamReader reader, string contentType)
    {
	    m_Log.Debug("convertToJson(" + contentType + ") In");
        string json = "";
        string data = reader.ReadToEnd();


            // Parse into a JSON string
            TextReader txReader = new StringReader(data);
            Newtonsoft.Json.JsonTextReader jsonReader = new JsonTextReader(txReader);
            if (contentType != null && contentType.Length != 0)
            {
                Response.AppendToLog("Content-Type:" + contentType.ToString());
                if (contentType.ToLower().StartsWith(textXml) ||
                    contentType.ToLower().StartsWith(appXml))
                {
                    try
                    {
                        XmlDocument doc = new XmlDocument();
                        doc.LoadXml(data);
                        reader.Close();
                        json = Newtonsoft.Json.JavaScriptConvert.SerializeXmlNode(doc.DocumentElement);
					    m_Log.Debug("convertToJson() Out");
                        return json;
                    }
                    catch (XmlException e)
                    {
                        Response.AppendToLog("ContentTypeXMLFalse");
					    m_Log.Error("convertToJson() Error in decoding XML: " + e.Message);
                        throw new XmlException("Error in decoding XML: " + e.Message, e);
                    }
                }
                else if (contentType.ToLower().StartsWith(appJson))
                {
                    jsonReader.Read();
                    // JSON string
                    json += data;
                    Response.AppendToLog("ContentTypeJSON");
				    m_Log.Debug("convertToJson() ContentTypeJSON Out");
                    return json;
                }
                else if (contentType.ToLower().StartsWith(textPlain))
                {
                    Response.AppendToLog("ContentTypeTEXT");
                    Dictionary<string, string> d1 = new Dictionary<string, string>();
                    d1.Add("result", data);

                    string jsonText = Newtonsoft.Json.JavaScriptConvert.SerializeObject(d1);
                    Response.AppendToLog("ContentTypeTEXT:" + jsonText);
				    m_Log.Debug("convertToJson() ContentTypeTEXT Out");
                    return jsonText;
                }
                else
                {
                    Response.AppendToLog("unknown Content-Type:" + contentType);
				    m_Log.Debug("convertToJson() unknown Content-Type Out");
                    return (parseResultData(reader, jsonReader, data));        
                }
            }
            else
            {
                Response.AppendToLog("Content-Type NULL");
			    m_Log.Debug("convertToJson() Content-Type NULL");
                return( parseResultData(reader, jsonReader, data) );                
            }
                
                
    }
</script>
<%
	log4net.Config.XmlConfigurator.Configure(); 
    m_Log.Debug("_________________________________________________");
    m_Log.Debug("getWebRequest() In");
    // extract parameters
    String WebUrl =""; 
    String Protocol= "";
    String EncType = "";
    Boolean AuthenAccess = false;
    String UserName ="";
    String Password ="";
    String readWriteTimeout = "20000";  // timeout in milliseconds
    String conTimeout = "20000";   // timeout in milliseconds


    Stream ins = HttpContext.Current.Request.InputStream;
    StreamReader reader = new StreamReader(ins);
    string jsonStr = reader.ReadToEnd();

    JObject requestObj = JObject.Parse(jsonStr);
    m_Log.Debug("requestObj: " + requestObj.ToString());

    WebUrl = (string)requestObj["WebUrl"];
    Protocol = (string)requestObj["Protocol"];
    EncType = (string)requestObj["Enctype"];
    AuthenAccess = (Boolean)requestObj["AuthenAccess"];
    if (AuthenAccess)
    {
        UserName = (string)requestObj["UserName"];
        Password = (string)requestObj["Password"];
    }

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
        catch (FormatException)
        {
            // ignore an invalid value
        }
    }

    String ParamStr = "";
    int QueryPos = WebUrl.IndexOf('?');
    if ((Protocol.EndsWith("get") || Protocol.EndsWith("delete")) && (QueryPos > 0))
    {
        String QueryString = WebUrl.Substring(QueryPos + 1, WebUrl.Length - (QueryPos + 1));
        WebUrl = WebUrl.Substring(0, QueryPos);
        String[] Pairs = QueryString.Split('&');
        foreach (String Pair in Pairs)
        {
            string strKey = "";
            string strValue = "";
            int Pos = Pair.IndexOf('=');
            if (Pos == -1)
            {
                strKey = Pair;
                strValue = null;
            }
            else
            {
                try
                {
                    strKey = Server.UrlDecode(Pair.Substring(0, Pos));
                    strValue = Server.UrlDecode(Pair.Substring(Pos + 1, Pair.Length - (Pos + 1)));
                }
                catch (Exception ex)
                {
                	m_Log.Error("Exception parsing queryString:" + ex.Message); 
                }
            }
            if (!ParamStr.Equals(""))
            {
                ParamStr = ParamStr + "&";
            }
            ParamStr = ParamStr + Server.UrlEncode(strKey) + "=" + Server.UrlEncode(strValue);
        }
    }

    JObject Parameters = (JObject)requestObj["Parameters"];
        
    if (Parameters != null)
    {
        JEnumerable<JProperty> children = Parameters.Children<JProperty>();

        foreach (JProperty child in children)
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
            // add to map
            if (!ParamStr.Equals(""))
            {
                ParamStr = ParamStr + "&";
            }
            ParamStr = ParamStr + Server.UrlEncode(strKey) + "=" + Server.UrlEncode(strValue);
        }
        
    }
    m_Log.Debug("ParamStr: " + ParamStr);
    
    JObject CustomHeaders = (JObject)requestObj["CustomHeaders"];
    JToken JsonContent = (JToken)requestObj["JsonContent"];
    //relative path processing

     string relativePath = "http://localhost:";
     if (WebUrl.StartsWith("."))
     {
         int slashindex = WebUrl.IndexOf("/");
         if (slashindex != -1)
         {
             int n = WebUrl.Length;
             WebUrl = WebUrl.Substring(slashindex + 1, n - slashindex-1);
         }

         relativePath += HttpContext.Current.Request.ServerVariables["SERVER_PORT"];
         
         relativePath = relativePath + HttpContext.Current.Request.RawUrl.ToString();
         int boundary = relativePath.IndexOf("include");
         if(boundary !=-1){
             relativePath = relativePath.Substring(0, boundary);
         }
         WebUrl = relativePath + WebUrl;
         m_Log.Debug("urlStr: " + WebUrl);
    }
    m_Log.Debug("WebUrl: " + WebUrl);
    if (WebUrl.Length > 0)
    {
        Response.Write(fetchURL(WebUrl, Protocol, EncType, ParamStr, readWriteTimeout, conTimeout,
            UserName, Password, CustomHeaders, JsonContent));
    }
    m_Log.Debug("getWebRequest() Out");
     
 %>
