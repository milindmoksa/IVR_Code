<%@ Page Language="C#" ContentType="text/xml"%>

<script runat="server">
[System.Web.Services.WebMethod]
 public static string send()
  { 
  string connstring ="User ID=OCS_DEVDB;password=OCS_DEVDB_123;Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=10.24.94.25)(PORT=8888))(CONNECT_DATA=(SERVICE_NAME=GENDEV1)));";
  
  System.Data.Odbc.OdbcConnection myConn = new  System.Data.Odbc.OdbcConnection();
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
        catch ( System.Data.Odbc.OdbcException sqlEx)
        {
            errMessage = sqlEx.ToString();
        }
        catch (Exception ex)
        {
            errMessage = ex.Message;
        }
        string sql = "";
        string strNum = "123456";
        //sql = "select Card_Flag from ValidCard_Num where Card_Number = '"+ strNum+"'";
        sql = "insert into CORP_CARD_DESC values ('123456','D','sasas')";
      //  OleDbCommand cmd = new OleDbCommand(sql,myConn);
       System.Data.Odbc.OdbcCommand cmd = new  System.Data.Odbc.OdbcCommand(sql,myConn);
       String count =  Convert.ToString(cmd.ExecuteNonQuery());
return count;
        //String count = "2";
		}
</script>

<% =send() %>