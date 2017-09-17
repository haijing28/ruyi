var checkEmailSuffix = function(email){
	var url = "";
	if(email.indexOf("gmail.com") > -1){
		url = "http://www.gmail.com";
	}else if(email.indexOf("hotmail.com") > -1){
		url ="http://www.hotmail.com";
	}else if(email.indexOf("outlook.com") > -1){
		url = "http://www.outlook.com";
	}else if(email.indexOf("msn.com") > -1){
		url = "http://www.msn.com";
	}else if(email.indexOf("sina.com") > -1){
		url = "http://mail.sina.com";
	}else if(email.indexOf("qq.com") > -1){
		url = "http://mail.qq.com";
	}else if(email.indexOf("163.com") > -1 || email.indexOf("126.com") > -1 || email.indexOf("yeah.net") > -1){
		url = "http://email.163.com";
	}else if(email.indexOf("yahoo.com") > -1){
		url = "http://mail.cn.yahoo.com/";
	}else if(email.indexOf("sohu.com") > -1){
		url = "http://mail.sohu.com";
	}else if(email.indexOf("10086.cn") > -1){
		url = "http://mail.10086.cn/";
	}else if(email.indexOf("189.cn") > -1){
		url = "http://webmail17.189.cn/webmail/";
	}else if(email.indexOf("tom.com") > -1){
		url = "http://mail.tom.com/";
	}else if(email.indexOf("sogou.com") > -1){
		url = "http://mail.sogou.com/";
	}else if(email.indexOf("eyou.com") > -1){
		url = "http://www.eyou.com/";
	}else if(email.indexOf("21cn.com") > -1){
		url = "http://mail.21cn.com/";
	}else if(email.indexOf("188.com") > -1){
		url = "http://www.188.com/";
	}else if(email.indexOf("foxmail.com") > -1){
		url = "http://www.foxmail.com/";
	}else if(email.indexOf("263.net") > -1){
		url = "http://www.263.net/";
	}else if(email.indexOf("iknowing.com") > -1){
		url = "http://mail.iknowing.com";
	}else if(email.indexOf("ruyi.ai") > -1){
		url = "http://qiye.163.com/login/?from=ym";
	}
	return url;
}

$(function(){
	//控制帮助对话框 start
    $("body").off("click","#help-box").on("click","#help-box",function(){
		 var $this = $(this);
		 $this.css("transform","scale(1)");
	 });
	//控制帮助对话框 end
    
	$("#help-box").draggable({ 
	    cursor: 'move',   
	    refreshPositions: true,
	    cancel: ".not-drag",
	    containment: "#api-manager-box"
	});
	
	//显示隐藏帮助聊天框
	$("body").off("click","#help-icon,#help-box .help-reduce").on("click","#help-icon,#help-box .help-reduce",function(){
		var $helpBox = $("#help-box");
		if($helpBox.css("display") == "block"){
			$helpBox.css("display","none");
		}else{
			setTimeout(function(){
				$(window.frames["help-iframe"].document).contents().find("#talkInputId").focus();
			}, 200);
			$helpBox.css("display","block");
		}
	});
});