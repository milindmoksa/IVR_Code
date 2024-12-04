<%@ Page Language="C#" AutoEventWireup="true" Inherits="restproxy" EnableSessionState="false"%>
    
<%
    Response.ContentType = "application/json;charset=UTF-8";
    
    String  strTemp      = handleRequest( Request, Response, System.Web.HttpContext.Current);
    
    Response.Write ( strTemp);
    
    Response.End();   
%>
