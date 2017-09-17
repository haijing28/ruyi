$(function(){
	//邮箱激活账号
	var activeEmailFunc = function(){
		$.ajax({
			url : ruyiai_host + "/ruyi-ai/developer/auth",
			method : "POST",
			data: {"email": Request.email,"verifycode":Request.verifycode}, 
			success: function(data) {
				data = dataParse(data);
				if(data.code == 0){
					switch (data.result) {
						case "00":
							$("[data-act=normal-account]").css("display","block");
							setTimeout(function(){
								window.location.href = "login.html";
							}, 3000);
							break;
						case "01":
							$(".register-cdkey-box").css("display","block");
							$(".nav-box").css("display","block");					
							break;
						case "02":
							$("[data-act=email-expire]").css("display","block");
							break;
						case "03":
								
							break;
						case "0":
							$(".register-cdkey-box").css("display","block");
							$(".nav-box").css("display","block");
							break;
						default:
							$(".register-cdkey-box").css("display","block");
							$(".nav-box").css("display","block");
							break;
					}
				}else{
					//alert(1);
					$("[data-act=illegal-request]").css("display","block");
				}
			}
		 });
	}
	activeEmailFunc();
	
	//控制帮助对话框 start
    $("body").off("click",".cdkey-submit.active").on("click",".cdkey-submit.active",function(){
		 var $this = $(this);
		 var cdkeyNumber = $(".cdkey-number").val();
		 if(!cdkeyNumber || cdkeyNumber.length == 0){
			 $(".register-cdkey-box .error-tips").text("请填写激活码"); 
			 $(".cdkey-number").focus();
			 return false;
		 }
		 if(!cdkeyNumber || $.trim(cdkeyNumber).length != 6){
			 $(".register-cdkey-box .error-tips").text("请填写正确的激活码"); 
			 $(".cdkey-number").focus();
			 return false;
		 }
		 $this.text("验证中...");
		 $this.removeClass("active");
		 $.ajax({
			url : ruyiai_host + "/ruyi-ai/developer/auth",
			method : "POST",
			data: {"email": Request.email,"code":cdkeyNumber}, 
			success: function(data) {
				data = dataParse(data);
				$this.text("提交");
				$this.addClass("active");
				if(data.code == 0){
					switch (data.result) {
						case "00":
							$(".register-cdkey-box .error-tips").text("账号已经激活，可直接登录");
							break;
						case "01":
							break;
						case "02":
							$(".register-cdkey-box .error-tips").text("激活码不正确或已过期"); 
							break;
						case "03":
							$(".register-cdkey-box .error-tips").text("邮箱还未验证，请先验证邮箱"); 
							break;
						case "0":
							window.location.href = "register-success.html";
							break;
						default:
							//alert("11");
							window.location.href = "register-success.html";
							break;
					}
				}else{
					
				}
			}
		 });
	 });
	//控制帮助对话框 end
});