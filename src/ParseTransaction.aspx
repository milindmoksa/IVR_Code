<%@ Page Language="C#"  ContentType="application/json" Inherits="BackEndlogic" %>
<%@ Import Namespace="Newtonsoft.Json.Linq"%>
<%@ Import Namespace="Newtonsoft.Json" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Web" %>
<%@ Import Namespace="System.Web.UI" %>
<%@ Import Namespace="System.Runtime.Serialization" %>
<%@ Import Namespace="System.Runtime.Serialization.Json" %>
<%@ Import Namespace ="System.Collections"%>
<%@ Import Namespace="System.Globalization"%>



<script runat="server">
    
    public override JObject PerformLogic(JObject state, Hashtable additionalParams)
    {
    JObject result= null;
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
  	// initialize the string to parse from hash table.
 	
 
 	
 	//string val="";
 //	foreach(DictionaryEntry tr in additionalParamtable)
 //	{
 //	 val = (String)tr.Value;
//	}

	string szTransResp = ((string)additionalParamtable["varParamResp"]);
	
	int szlen = szTransResp.Length;
			int numChar = 72;
			int initial = 0;
			int temp= 0;
			string[] arrstring = null;
			string[] rtnArr=null;
			//calculate the number of transactions
			int numoftransactions = szlen/numChar;
			//log the num of transactions
			//file.WriteLine("numoftransactions"+numoftransactions);
			arrstring = new string[numoftransactions];
			//initializing return array
			rtnArr  = new string[numoftransactions];
			for(int i=0;i<numoftransactions;i++)
			{
			arrstring[i]= szTransResp.Substring(temp,numChar);
			temp=temp+72;
			}
			
			 string date="",trn="",amt="0",currency="",paise=""; 
			if (arrstring.Length > 0)
			{
				for(int j=0;j<arrstring.Length; j++)
				{
				
					string datepat = "dd/MM/yyyy";
					DateTime parsedDate; string dateConv="";
				
					date = arrstring[j].Substring(0,10);
					try
					{
					DateTime d1 =DateTime.ParseExact(date,datepat,null);
					//string d = "yyyyMMdd";
					string d = "ddMMyyyy";
					dateConv = d1.ToString(d);
					}
					catch(Exception ed)
					{
					dateConv=date.Replace("/","");
					}
					
					
					trn=arrstring[j].Substring(11,2) + ".wav";
					amt =arrstring[j].Substring(14,17);
					amt = amt.Trim();
					currency=amt.Substring(0,amt.IndexOf('.'));
					paise = amt.Substring(amt.Length-2,2);
					
					//filling the array with values.
					
					rtnArr[j] = dateConv+"#"+trn+"#"+currency+"#"+paise;
					date="";trn="";amt="0";currency="";paise="0"; 
				}
			}
			// creating Jvalue to convert array entries to jvalues
	
	JValue [] jval = new JValue[numoftransactions];
	for(int k=0; k< jval.Length;k++)
	{
	jval[k]= new JValue(rtnArr[k]);
	}
	
	
	
	
	JArray arr = new JArray();	
	for(int k=0; k < rtnArr.Length; k++)
	{
	arr.Add(rtnArr[k]);
	}
		result = new JObject(new JProperty("RtnVal",arr));
 
 }
 	
		
       
        
        
        catch (Exception ex)
        {
       
        
       string errMsg = ex.Message;
     
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