<%@ Page Language="C#"  ContentType="application/json" Inherits="BackEndlogic" %>
<%@ Import Namespace="Newtonsoft.Json.Linq"%>
<%@ Import Namespace="Newtonsoft.Json" %>
<%@ Import Namespace="System.Xml"%>
<%@ Import Namespace="System.Web.UI" %>
<%@ Import Namespace="System.Runtime.Serialization" %>
<%@ Import Namespace="System.Runtime.Serialization.Json" %>
<%@ Import Namespace ="System.Collections"%>
<%@ Import Namespace="System.Globalization"%>



<script runat="server">
    
    public override JObject PerformLogic(JObject state, Hashtable additionalParams)
    {
    	XmlDocument xmlDoc = null;
    	JObject result= null;
    	XmlNode node = null;
	 Hashtable additionalParamtable = new Hashtable();
	 try{
 
	 string AppStateString = null;string  errMsg= "";string szRespString="";
  	foreach(string key in HttpContext.Current.Request.Params)
  
  	{
  		if (key.Trim().Equals("ALL_HTTP"))
  		{
  		break;
  		}
  
  		if(key.Trim().Equals("AppStateString"))
  		{
  				AppStateString = HttpContext.Current.Request.Params["AppStateString"];
  		}
  		
  		else
  		{
  		//szRespString = AppStateString;
  		string value = HttpContext.Current.Request.Params[key];
  		additionalParamtable.Add(key,value);
  	  		}
  	  	
  
 	}	
	string szTransResp = ((string)additionalParamtable["varBlockCode"]);	
	 
	 	 string strSeries="";
       		result = new JObject();
		 xmlDoc = new XmlDocument();
		string xmlPath = HttpContext.Current.Server.MapPath("~/");
        xmlPath = xmlPath + "\\src\\CreditCardBlockSeries.xml";
		xmlDoc.Load(xmlPath);
        string searchString = "CCBlockseries/block/IVR_Facility_" + szTransResp;
		
       		  node = xmlDoc.SelectSingleNode(searchString);
                if (node == null)
                {
                    strSeries= "No";
                }
                else
                    strSeries = node.InnerText;
       //*****************************
        //* Add your custom code here 
        //*****************************
        
        result = new JObject(new JProperty("RtnIVRAccess",strSeries));
        }
        
        
         
	        catch (Exception ex)
	        {
	       
	        
	       string errMsg = ex.Message;
	     result = new JObject(new JProperty("RtnIVRAccess",errMsg));
	        }
       finally{
       if (xmlDoc != null)
         xmlDoc = null;
        
        if (node != null)
        node = null;
       }
        
        
        return result;
    }

    // If the passState parameter of the backend logic block is set to true.
    // The state variable contains all variables from the voice application.
    // If the passState parameter is set to false, the state variable will be null.

    // Example of how to access data from the state object.
    // Note that "Input1" is the name of the Input block and 
    // "Var1" is the name of the user-defined variable.
    //************************************
    //String userInput = state["Input1"];
    // String userVariable = state["Var1"];
    //************************************
    // The additionalParams hashtable contains any additional input parameters passed
    // in the backend logic block.

    // Example:
    // Note that "Param1" is the parameter name of the input parameter.
    //*************************************************
    // String param = additionalParams.get["Param1"];
    //*************************************************

    // Finally, this method must return a result object.  Any values stored in 
    // this result object will be reassigned to output parameters defined in the voice application.
    // For example, if the voice application declares an output parameter called "OutParam",
    // the output parameter will get the value "Value".
    //*******************************************************
    //result = new JObject(new JProperty("OutParam", value));
    
    //For example to set multiple values 
    // result = new JObject(new JProperty("Key1", "Value1"),
    //new JProperty("Key2", "Value2"),
    // new JProperty("Key3","Value3"));
    //*******************************************************

</script>