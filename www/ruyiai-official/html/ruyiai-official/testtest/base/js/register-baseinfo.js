$(function(){
	//提交数据
	$("body").off("click",".submit-box button.active").on("click",".submit-box button.active",function($event){
		var $this = $(this);
		var myemail = $("#myemail");
		var pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
		if(myemail.val().length == 0){
			$("[data-act=register-email] .error-tips").text("请输入邮箱");
			myemail.focus();
			return false;
		}else if (!pattern.test(myemail.val())) {  
			$("[data-act=register-email] .error-tips").text("请输入正确的邮箱地址");
			myemail.focus();
			return false;  
		}else{
			$("[data-act=register-email] .error-tips").text("");
		}
		
		var mypassword = $("#mypassword");
		if($.trim(mypassword.val()).length == 0){
			$("[data-act=mypassword] .error-tips").text("请输入密码");
			mypassword.focus();
			return false;
		}else if ($.trim(mypassword.val()).length < 6) {  
			$("[data-act=mypassword] .error-tips").text("密码长度不足6位");
			mypassword.focus();
			return false;
		}else{
			$("[data-act=mypassword] .error-tips").text("");
		}
		
		var remypassword = $("#re-mypassword");
		if($.trim(remypassword.val()).length == 0){
			$("[data-act=re-mypassword] .error-tips").text("请再次输入新密码");
			remypassword.focus();
			$this.focus();
			return false;
		}else if (remypassword.val() != $("#mypassword").val()) {  
			$("[data-act=re-mypassword] .error-tips").text("两次输入的密码不一致");
			remypassword.focus();
			$this.focus();
			return false;
		}else{
			$("[data-act=re-mypassword] .error-tips").text("");
		}
		$this.text("邮件发送中...");
		$this.removeClass("active");
		$.ajax({
			url : api_host + "/signup",
			method : "POST",
			data: JSON.stringify({"email": myemail.val(),"password":mypassword.val(),"invite_code":Request.activecode}), 
            traditional: true,
            headers: {"Content-Type" : "application/json"},
			success: function(data) {
				$this.text("注册");
				$this.addClass("active");
				window.location.href = "validate-email.html?email=" + myemail.val()+"&activecode=" + Request.activecode;
			},
			error: function(err){
				err = dataParse(err.responseText);
				$("[data-act=register-email] .error-tips").text(err.msg);
				$this.text('注册');
				$this.addClass("active");
			}
		});
		return false;
		
	});
	
	//邮箱
	$("body").off("blur","#myemail").on("blur","#myemail",function($event){
		var $this = $(this);
		var pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
		if($this.val().length == 0){
			$("[data-act=register-email] .error-tips").text("请输入邮箱");
		}else if (!pattern.test($this.val())) {  
			$("[data-act=register-email] .error-tips").text("请输入正确的邮箱地址");
		}else{
			$("[data-act=register-email] .error-tips").text("");
		}
	});
	
	//密码
	$("body").off("blur","#mypassword").on("blur","#mypassword",function($event){
		var $this = $(this);
		if($.trim($this.val()).length == 0){
			$("[data-act=mypassword] .error-tips").text("请输入密码");
		}else if ($.trim($this.val()).length < 6) {  
			$("[data-act=mypassword] .error-tips").text("密码长度不足6位");
		}else{
			$("[data-act=mypassword] .error-tips").text("");
		}
	});
	
	//重复密码
	$("body").off("blur","#re-mypassword").on("blur","#re-mypassword",function($event){
		var $this = $(this);
		if($.trim($this.val()).length == 0){
			$("[data-act=re-mypassword] .error-tips").text("请再次输入新密码");
		}else if ($this.val() != $("#mypassword").val()) {  
			$("[data-act=re-mypassword] .error-tips").text("两次输入的密码不一致");
		}else{
			$("[data-act=re-mypassword] .error-tips").text("");
		}
	});
	
	//同意协议
	$("body").off("click","#agree-agreeon").on("click","#agree-agreeon",function($event){
		var $this = $(this);
		if($this.prop("checked")){
			$(".submit-box button").addClass("active");
		}else{
			$(".submit-box button").removeClass("active");
		}
	});
	
	//重置状态
	$("#agree-agreeon").prop("checked",false);
	
});





