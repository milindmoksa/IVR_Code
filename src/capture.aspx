<?xml version="1.0" encoding="utf-8"?>
<%@ Page Language="C#" ContentType="text/xml;charset=utf-8"%>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Xml" %>
<%@ Import Namespace="log4net" %>

<script runat="server">
	static readonly ILog m_Log = LogManager.GetLogger("recordCapture");
    
    // saveFile
    String saveFile(string locPath)
    {
        
        HttpFileCollection uploadedFiles = HttpContext.Current.Request.Files;

        for (int i = 0; i < uploadedFiles.Count; i++)
        {
            HttpPostedFile userPostedFile = uploadedFiles[i];
            try
            {
                if (userPostedFile.ContentLength > 0)
                {
                    userPostedFile.SaveAs(locPath);
                }
                else
                {
                	return "SaveFile:Failure - "+"File Content is empty";
                }
            }

            catch (Exception e)
            {
                return "SaveFile:Failure - "+e.Message;
            }
        }
        return "SaveFile:Success";
    }
    
    
    // get File Ext

    String getFileExt(string audioFormat)
    {
        String fileExt = ".vox";
        if (audioFormat.Length > 0)
        {
            fileExt = audioFormat;
        }
        return fileExt;
    }
    
    // autogenerate file Name
    String getAutogenerateFileName()
    {
        String autoFileName = DateTime.Now.Year.ToString();
        autoFileName += DateTime.Now.Month.ToString();
        autoFileName += DateTime.Now.Date.Day + "_";
        autoFileName += DateTime.Now.Date.Hour + "hr_";
        autoFileName += DateTime.Now.Second.ToString() + "sec_";
        autoFileName += DateTime.Now.Millisecond.ToString();
        return autoFileName;
            
    }
    
        
</script>


<result>
<status>
 <%
	log4net.Config.XmlConfigurator.Configure(); 
    m_Log.Debug("_________________________________________________");
    m_Log.Debug("recordCapture() In");
    
    String result ="Success";
	String recFileName ="";
	String audioFormat = "";
    string appServerSidePath = HttpContext.Current.Request.PhysicalApplicationPath;

    // We are assuming that always we will get params in POST method.
    // otherwise we cannot get the gvpSide filename to parse the file ext
    // ofcourse <data> tag in record block always uses Post method 
    foreach (string key in HttpContext.Current.Request.Form.AllKeys)
    {
       if (key.Trim().Equals("captureLocation") &&
            HttpContext.Current.Request.Form["captureLocation"].Length>0)
        {
            appServerSidePath = HttpContext.Current.Request.Form["captureLocation"];
            m_Log.Debug("key: '" + key + "' -- appServerSidePath: '" + appServerSidePath + "'");
        }
        else if (key.Trim().Equals("recFileName"))
        {
            recFileName = HttpContext.Current.Request.Form["recFileName"];
            m_Log.Debug("key: '" + key + "' -- recFileName: '" + recFileName + "'");
        }
        else
        {
            audioFormat = HttpContext.Current.Request.Form[key];
            m_Log.Debug("key: '" + key + "' -- audioFormat: '" + audioFormat + "'");
        }
    }
    
        
    if (audioFormat != null && audioFormat.Length > 0)
    {
        if(audioFormat.LastIndexOf(".")!=-1)
        {
            int nIndex = audioFormat.LastIndexOf(".");
            int nLength = audioFormat.Length;
            audioFormat = audioFormat.Substring(nIndex,nLength-nIndex);
        }
    }

    // now form the app side location path with file name and ext.
    if (recFileName.Length <= 0)
    {
        // no name specified. lets call autogenerate.
        appServerSidePath = appServerSidePath + getAutogenerateFileName() + getFileExt(audioFormat);
    }
    else
    {
        if (recFileName.IndexOf(".") != -1)
        {
            // User has specified a file ext. Lets use it.
            appServerSidePath = appServerSidePath + recFileName;
        }
        else
        {
            // now get the ext from gvp side file name
            appServerSidePath = appServerSidePath + recFileName + getFileExt(audioFormat);
        }

    }
 %>
 <%
    result = saveFile(appServerSidePath);
     
    m_Log.Debug("result: " + result);
    Response.Write(result);
     
 %>
</status>
<filePath>
<%
    m_Log.Debug("appServerSidePath: " + appServerSidePath);
    Response.Write(appServerSidePath);
    m_Log.Debug("recordCapture() Out");
%>
</filePath> 
</result>

