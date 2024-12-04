<%@ Page Language="C#" ContentType="application/json"%>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Xml" %>
<%@ Import Namespace="System.Web" %>
<%@ Import Namespace="Newtonsoft.Json" %>
<%@ Import Namespace="Newtonsoft.Json.Linq" %>
<%@ Import Namespace="System.Collections.Generic" %>


<script runat="server">
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
                url = url + "?" + parameters;
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
                                byte[] bytes = encoding.GetBytes(obj.ToString());
                                writeStream.Write(bytes, 0, bytes.Length);

                            }
                            else
                            {
                                JObject obj = new JObject();
                                obj.Add(new JProperty("content", JsonContent));
                                byte[] bytes = encoding.GetBytes(obj.ToString());
                                writeStream.Write(bytes, 0, bytes.Length);
                                
                            }
                        }
                    }
                    else if (enctype.Equals(appUrlEncoded))
                    {
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
        
        return result;
     }

    string parseResultData(StreamReader reader, JsonTextReader jsonReader, string initialData)
    {
        string json = "";
        try
        {
            jsonReader.Read();
            // JSON string
            json += initialData;
            Response.AppendToLog("ContentTypeUnkJSON");
            return json;
        }
        catch (JsonReaderException)
        {
            // not a valid JSON - check for XML
            try
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(initialData);
                reader.Close();
                json = Newtonsoft.Json.JavaScriptConvert.SerializeXmlNode(doc.DocumentElement);
                Response.AppendToLog("ContentTypeUnkXML");
                return json;
            }
            catch (Exception e)
            {
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
                        return json;
                    }
                    catch (XmlException e)
                    {
                        Response.AppendToLog("ContentTypeXMLFalse");
                        throw new XmlException("Error in decoding XML: " + e.Message, e);
                    }
                }
                else if (contentType.ToLower().StartsWith(appJson))
                {
                    jsonReader.Read();
                    // JSON string
                    json += data;
                    Response.AppendToLog("ContentTypeJSON");
                    return json;
                }
                else if (contentType.ToLower().StartsWith(textPlain))
                {
                    Response.AppendToLog("ContentTypeTEXT");
                    Dictionary<string, string> d1 = new Dictionary<string, string>();
                    d1.Add("result", data);

                    string jsonText = Newtonsoft.Json.JavaScriptConvert.SerializeObject(d1);
                    Response.AppendToLog("ContentTypeTEXT:" + jsonText);
                    return jsonText;
                }
                else
                {
                    Response.AppendToLog("unknown Content-Type:" + contentType);
                    return (parseResultData(reader, jsonReader, data));        
                }
            }
            else
            {
                Response.AppendToLog("Content-Type NULL");
                return( parseResultData(reader, jsonReader, data) );                
            }
                
                
    }
</script>
<%
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

    WebUrl = (string)requestObj["WebUrl"];
    Protocol = (string)requestObj["Protocol"];
    EncType = (string)requestObj["Enctype"];
    AuthenAccess = (Boolean)requestObj["AuthenAccess"];
    if (AuthenAccess)
    {
        UserName = (string)requestObj["UserName"];
        Password = (string)requestObj["Password"];
    }

    JObject Parameters = (JObject)requestObj["Parameters"];
    string ParamStr = "";
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
     }
 
    if (WebUrl.Length > 0)
    {
         Response.Write(fetchURL(WebUrl, Protocol, EncType, ParamStr, readWriteTimeout, conTimeout,
             UserName, Password, CustomHeaders, JsonContent));
    }
     
 %>
