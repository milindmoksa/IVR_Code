<%@ Page Language="C#" ContentType="application/json" Inherits="BackEndlogic" %>
<%@ Import Namespace="Newtonsoft.Json.Linq"%>
<%@ Import Namespace="Newtonsoft.Json" %>
<%@ Import Namespace="System.Data.OleDb" %>
<%@ Import Namespace="System.Data.Odbc" %>
<%@ Import Namespace="System.Data.SqlTypes"  %>
<%@ Import Namespace="System.IO" %>



<script runat="server">
    
    public override JObject PerformLogic(JObject state, Hashtable additionalParams)
    {
       
        JObject result = null;
		//StreamReader re = File.OpenText(Server.MapPath("conn.udl"));
        string connstring = null;
      connstring ="Persist Security Info=False;User ID=OCS_DEVDB;password=OCS_DEVDB_123;Initial Catalog=GENDEV1;Data Source=10.24.94.25";
        

        //Open the DB Connection
       OdbcConnection myConn = new OdbcConnection();
        myConn.ConnectionString = connstring;
        string isResult = "0";  
        string errMessage = "";
        try
        {
            myConn.Open();
            if (myConn.State.ToString() == "Open")
            {
                isResult = "1";
            }
        }
        catch (Exception sqlEx)
        {
            errMessage = sqlEx.ToString();
        }
     
        string sql = "";
        string strNum = "123456";
        //sql = "select Card_Flag from ValidCard_Num where Card_Number = '"+ strNum+"'";
        sql = "insert into CORP_CARD_DESC values ('123456','D','sasas')";
        OdbcCommand cmd = new OdbcCommand(sql,myConn);
       
        
        //int count =  (int)cmd.ExecuteScalar();
        String count =  Convert.ToString(cmd.ExecuteNonQuery());
		result = new JObject(new JProperty("squareRoot",count));
		
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
    //*******************************************************
</script>