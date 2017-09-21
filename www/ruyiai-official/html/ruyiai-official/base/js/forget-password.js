$(function(){
	//重设密码
	$("body").off("click","[data-act=reset-password-box] button.active").on("click","[data-act=reset-password-box] button.active",function($event){
		var $this = $(this);
		var resetPwdEmail = $("#reset-pwd-email");
		var pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
		if(resetPwdEmail.val().length == 0){
			$("[data-act=reset-email-box] .error-tips").text("请输入邮箱");
			resetPwdEmail.focus();
			return false;
		}else if (!pattern.test(resetPwdEmail.val())) {  
			$("[data-act=reset-email-box] .error-tips").text("请输入正确的邮箱地址");
			resetPwdEmail.focus();
			return false;  
		}else{
			$("[data-act=reset-email-box] .error-tips").text("");
		}
		
		$this.text("正在发送邮件...");
		$this.removeClass("active");
		$.ajax({
			url : api_host + "/password/reset/verify",
			method : "post",
			data: JSON.stringify({"account":resetPwdEmail.val()}),
			headers:{
				"content-type": 'application/json'
			},
			success: function(data) {
				window.location.href = "reset-password-tips.html?email=" + resetPwdEmail.val();
			},error:function(err){
				var err = JSON.parse(err.responseText);
				$("[data-act=reset-email-box] .error-tips").text(err.msg);
			},
			complete: function(){
				$this.text("重设密码");
				$this.addClass("active");
			}
		});
	});
});