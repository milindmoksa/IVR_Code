<%@ Page Language="C#" AutoEventWireup="true" Inherits="dbrequest" EnableSessionState="false"%>
    
<%
    Response.ContentType = "application/json;charset=UTF-8";
    
    String  strTemp      = handleUtilRequest( Request, Response, System.Web.HttpContext.Current);
    
    Response.Write ( strTemp);
    
    Response.End();   
%>
