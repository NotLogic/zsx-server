<%@ page language="java" contentType="text/html; charset=UTF-8"
		 import="com.baidu.ueditor.ActionEnter"
		 pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%

	request.setCharacterEncoding( "utf-8" );
	response.setHeader("Content-Type" , "text/html");
	String rootPath = application.getRealPath( "/" );
	String action = request.getParameter("action");
	if("config".equals(action))
		response.getWriter().write( new ActionEnter( request, rootPath ).exec() );
	else
		request.getRequestDispatcher("/ueditor/upload.do").forward(request, response);

%>