var defaultAppId = "6fe0a8e3-c786-4f11-9bd1-ac3ece39455a";
var ruyi_api_help = "http://docs.ruyi.ai";
if(window.location.href.indexOf("ruyiai-official/test") > -1){
	defaultAppId = "6fe0a8e3-c786-4f11-9bd1-ac3ece39455a";
}else if(ruyiai_host.indexOf("127.0.0.1") > -1){
	defaultAppId = "54f285f1-e1ce-4ad0-b0b8-10d38c050588";
}else if(ruyiai_host.indexOf("http://test.ruyi.ai") > -1){
	defaultAppId = "54f285f1-e1ce-4ad0-b0b8-10d38c050588";
}else if(ruyiai_host.indexOf("192.168.1.182") > -1){
	defaultAppId = "54f285f1-e1ce-4ad0-b0b8-10d38c050588";
}else if(ruyiai_host.indexOf("lab.ruyi.ai") > -1){
	defaultAppId = "6fe0a8e3-c786-4f11-9bd1-ac3ece39455a";
}
var uuid = new Date().getTime();
var defaultName = "新手入门小助理";
var defaultDesc = "ruyi.ai开发者后台功能演示。若有疑问随时点击名词旁边“？”或设置中心“帮助”按钮，小助理带你跳转至帮助中心。";

$(function(){
	$("#myregister").remove();
	//判断是否已经使用微信登陆
	$("#dialogueExperience").click(function(){
		setCookie("currentPage","dialogueExperience"); //设置当前所在页面
		window.location.href = static_host + "/webim-index.html";
	});
	
	$("#dialogRecruit").click(function(){
		setCookie("currentPage","dialogRecruit"); //设置当前所在页面
		window.location.href = static_host + "/dialog-recruit.html";
	});
	
	//判断是否已经登陆
	function checkUserFunc(){
		var tgt = getCookie("tgt");
		if(tgt && tgt.length > 0){
			$("#nav-mylogin").css("display","none");
			$("#nav-register").css("display","none");
			$("#nav-user-info").css("display","block");
			$("#help").css("display","block");
		}else{
			$("#nav-mylogin").css("display","block");
			$("#nav-register").css("display","block");
			$("#nav-user-info").css("display","none");
			$("#help").css("display","none");
		}
		$("[data-act=myemail]").text(getCookie("email"));
	}
	checkUserFunc();
	
	// 关闭登录、申请app对话框
	$("#mylogin-cancel, #myregister-cancel").on("click", function() {
		$(".modal.in").modal("hide");
	});
	
	//创建默认虚拟助理
	var createDefaultAgentFunc = function(developerId,skipFunc){
		$.ajax({
			url : ruyiai_host + "/ruyi-ai/app/create.html",
			method : "post",
			data:{"appName": defaultName,"appDesc":defaultDesc},
			success: function(data) {
				data = dataParse(data);
				if(data.code == 0){
					updateDefaultAgentFunc(data.result.id,developerId,skipFunc);
				}else if(data.code == 2){
					goIndex();
				}
			}
		});
	}
	
	//更新用户的gmtModify信息
	var updateGmtModify = function(developerId,skipFunc){
		var currDate = new Date().getTime();
		var developerModel = {"gmtModify":currDate + ""};
		$.ajax({
			url : ruyiai_host + "/ruyi-ai/developer/" + developerId,
			method : "PUT",
			data:JSON.stringify(developerModel),
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			success: function(data) {
				data = dataParse(data);
				if(data.code == 0){
					if(skipFunc){
						skipFunc();
					}
				}else if(data.code == 1){
					$.trace(""+data.msg);
					$r_username.focus();
				}else if(data.code == 2){
					goIndex();
				}
			}
		});
	}
	
	//复制默认虚拟助理的信息
	var updateDefaultAgentFunc = function(appId, developerId,skipFunc){
		$.ajax({
			url : ruyiai_host + "/ruyi-ai/app/migrate/" +appId,
			method : "get",
			data:{"source":defaultAppId},
			success: function(data) {
				updateGmtModify(developerId,skipFunc);
				data = dataParse(data);
				if(data.code == 0){
				}else if(data.code == 1){
					$.trace(""+data.msg);
					$r_username.focus();
				}else if(data.code == 2){
					goIndex();
				}
			}
		});
	}
	
	$("#mylogin").click(function(){
		var $username = $("#myusername");
		var $password = $("#mypassword");
		if($username.val().length == 0){
			$.trace("请输入用户名");
			$username.focus();
			return false;
		}else if($.trim($password.val()).length == 0){
			$.trace("请输入密码");
			$password.focus();
			return false;
		}
		$.ajax({
			url : ruyiai_host + "/ruyi-ai/user/login/email.html",
			method : "get",
			data:{"email": $username.val(),
				"password":$password.val()
				},
			success: function(data) {
				
				data = dataParse(data);
				if(data.code == 0){
					$('#login').modal('hide');
					setCookie("email",data.result.email);
					setCookie("nickname",data.result.username);
					setCookie("userId",data.result.id);
					checkUserFunc();
					window.location.href = static_host + "/app_manager.html";
				}else if(data.code == 1){
					$.trace("用户名或密码错误");
					$password.focus();
				}else if(data.code == 2){
					goIndex();
				}
			}
		});
		return false;
	});
	
	$('#login').on('shown.bs.modal', function () {
		$("#myusername").focus();
	});
	
	//获取appkey的信息
	var appkeyManagerFunc = function(developerId, gmtModify){
		var userId = getCookie("userId");
		$.ajax({
			url : ruyiai_host + "/ruyi-ai/app/query/uid.html",
			method : "get",
			data:{"userId": userId},
			success: function(data) {
				data = dataParse(data);
				if(data.code == 0){
					window.location.href = static_host + "/app_manager.html";
				}else if(data.code == 1){
					$("#appkey-apply").css("display","block");
					$("#appkey-apply-info").css("display","none");
				}else if(data.code == 2){
					goIndex();
				}
			}
		});
	}
	
	$("#appkey-manager").click(function(){
		window.location.href = static_host + "/app_manager.html";
	});
	
	//更新app信息
	var updateAppInfoFucn = function(appDetail){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/app/" + appDetail.id,
			data: JSON.stringify(appDetail),
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			method: "PUT",
			success: function(data){
			}
		});
	}
	
	$("#appkey_apply").click(function(){
		var $app_name = $("#app_name");
		var $app_service = $("#app_service");
		var $app_desc = $("#app_desc");
		if($.trim($app_name.val()).length == 0){
			$.trace("请输入助理名称");
			$app_name.focus();
			return false;
		}else if($.trim($app_desc.val()).length == 0){
			$.trace("请输入助理的描述");
			$app_desc.focus();
			return false;
		}
		$.ajax({
			url : ruyiai_host + "/ruyi-ai/app/create.html",
			method : "post",
			data:{"appName": $app_name.val(),
				"serviceName": $app_service.val(),
				"appDesc":$app_desc.val()
				},
			success: function(data) {
				
				appObject = data.result;
				//默认勾选通用闲聊
				updateAppInfoFucn(appObject);
				data = dataParse(data);
				if(data.code == 0){
					$("#appkey-apply").css("display","none");
					$("#q_apply_name").text(appObject.appName);
					$("#q_apply_desc").text(appObject.appDesc);
					$("#q_myappkey").text(appObject.appKey);
					setCookie("appId",appObject.id);
					setCookie("appName",appObject.appName);
					setCookie("appKey",appObject.appKey);
					$("#appkey-apply-info").css("display","block");
				}else if(data.code == 2){
					goIndex();
				}
			}
		});
		return false;
		
	});
	
	$("#mylogout").click(function(){//注销
		$.ajax({
			url : api_host + "/v1/tickets/" + getCookie('tgt'),
			method : "DELETE",
			success: function(data) {
				delCookie("email");
				delCookie("nickname");
				delCookie("userId");
				delCookie("appId");
				delCookie("appName");
				delCookie("appKey");
				delCookie('tgt');
				window.location.href = static_host + "/index.html";
			}
		});
	});
	
	$('#appkey').on('shown.bs.modal', function () {
	});
	
	//设置关闭图标的关闭动作
	$("body").off("click",".close-modal,.cancel-modal").on("click",".close-modal,.cancel-modal",function(event){
		var $this = $(this);
		$this.closest(".modal").modal("hide");
	});
	
	$("body").off("click","[data-act=cancel-modal]").on("click","[data-act=cancel-modal]",function(event){
		window.location.href = static_host + "/index.html";
	});
	
	//esc关闭弹框
	$(document).keyup(function(event){
		 if(event.keyCode == 27){
			$(".modal").modal("hide");
		 }
	});
	
	//修改密码获得光标
	$('#register').on('shown.bs.modal', function () {
		$("#r_username").focus();
	});
	
	//修改密码回车
	$("body").off("keydown","#r_username,#r_password,#re_password").on("keydown","#r_username,#r_password,#re_password",function($event){
		if($event.keyCode == 13){
			$("#app-manager-register").trigger("click");
		}
	})
	
	//回车登陆
	$("body").off("keydown","#mypassword,#myusername").on("keydown","#mypassword,#myusername",function($event){
		if($event.keyCode == 13){
			$("#mylogin").trigger("click");
		}
	});
	
	//修改密码获得光标
	$('#forget-password').on('shown.bs.modal', function () {
		$("#myforget-email").focus();
	});
	
	//重设密码
	$("body").off("click","[data-act=forget-password-submit]").on("click","[data-act=forget-password-submit]",function($event){
	
		var pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
		var $forgetemail = $("#myforget-email");
		if($forgetemail.val().length == 0){
			$.trace("请输入邮箱");
			$forgetemail.focus();
			return false;
		}else if (!pattern.test($forgetemail.val())) {  
	        $.trace("请输入正确的邮箱");  
	        $forgetemail.focus();
	        return false;  
	    }
		$.trace("正在发送邮件");
		$.ajax({
			url : ruyiai_host + "/ruyi-ai/user/changepwd",
			method : "get",
			data:{"status": 0,"email":$forgetemail.val()},
			success: function(data) {
				
				data = dataParse(data);
				if(data.code == 0){
					$("#forget-password").modal("hide");
					$("#validation-email").modal("show");
					var emailurl = checkEmailSuffix($forgetemail.val());
					$(".forget-password-email").text($forgetemail.val());
					if(emailurl.length > 0){
						$(".go-myemail").attr("href",emailurl);
						$(".go-myemail").css("display","block");
					}
				}else if(data.code == 2){
					goIndex();
				}else{
					$.trace(data.msg);
				}
			}
		});
	});
	
	$("body").off("keydown","#myforget-email").on("keydown","#myforget-email",function($event){
		
		if($event.keyCode == 13){
			$("[data-act=forget-password-submit]").trigger("click");
			$event.stopPropagation();
			return false;
		}
		
	});
	
	//修改密码
	$("body").off("click","[data-act=change-password]").on("click","[data-act=change-password]",function($event){
		console.log(111);
		var oldpasswd = $("#oldpasswd");
		var newpasswd = $("#newpasswd");
		var re_newpasswd = $("#re-newpasswd");
		if($.trim(oldpasswd.val()).length == 0){
			$.trace("请输入原始密码");
			oldpasswd.focus();
			return false;
		}else if ($.trim(newpasswd.val()).length == 0){
	        $.trace("请输入新密码");  
	        newpasswd.focus();
	        return false;  
	    }else if ($.trim(newpasswd.val()) == $.trim(oldpasswd.val())){
	        $.trace("新密码和原来的密码不能一样");  
	        newpasswd.focus();
	        return false;  
	    }else if ($.trim(newpasswd.val()).length < 6){
	        $.trace("密码长度不足6位");  
	        newpasswd.focus();
	        return false;  
	    }else if(newpasswd.val() != re_newpasswd.val()){
	    	$.trace("两次输入的新密码不一致");  
	    	re_newpasswd.focus();
	        return false;  
	    }

		$.ajax({
			url : api_host + "/password",
			method : "POST",
			data: JSON.stringify({"email": getCookie("email"),"old_password":oldpasswd.val(),"new_password":newpasswd.val()}),
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				$.trace("密码修改成功","success");
				delCookie("email");
				delCookie("nickname");
				delCookie("userId");
				delCookie("appId");
				delCookie("appName");
				delCookie("appKey");
				delCookie('tgt');
				window.location.href = static_host + "/base/login.html"
			},
			error: function(err){
				var err = JSON.parse(err.responseText);
				$.trace(err.msg);
			}
		});
		
	});
	
	//修改密码获得光标
	$('#change-password').on('shown.bs.modal', function () {
		$("#oldpasswd").focus();
	});
	
	//修改密码回车
	$("body").off("keydown","#oldpasswd,#newpasswd,#re-newpasswd").on("keydown","#oldpasswd,#newpasswd,#re-newpasswd",function($event){
		if($event.keyCode == 13){
			$("[data-act=change-password]").trigger("click");
		}
	})
	
	$("body").off("click","[data-act=skip-to-index]").on("click","[data-act=skip-to-index]",function(event){
		window.location.href = static_host + "/index.html";
	});
	
	//如果是重设密码，则自动浮出重设密码页面
	if(Request.status == "login"){
		$("#login").modal("show");
	}else if(Request.status == "new-apply-password"){
		$("#forget-password").modal("show");
	}
	
	$("[data-act=myemail]").text(getCookie("email"));
	
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
		}else if(email.indexOf("yahoo") > -1){
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
	
});





