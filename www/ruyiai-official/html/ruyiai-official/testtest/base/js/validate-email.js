$(function(){
	$("[data-act=email-show]").text(Request.email);
	var href = checkEmailSuffix(Request.email);
	if(href.length == 0){
		$("[data-act=skip-to-email]").css("display","none");
	}else{
		$("[data-act=skip-to-email]").attr("href",href);
	}
	$("#repeat-register").attr("href","register-baseinfo.html?activecode=" + Request.activecode);
	//重新发送邮件
	$("body").off("click","[data-act=repeat-send]").on("click","[data-act=repeat-send]",function($event){
		// $.ajax({
		// 	url : ruyiai_host + "/ruyi-ai/developer/reSendEmail",
		// 	method : "POST",
		// 	data: {"email": Request.email},
		// 	success: function(data) {
		// 		data = JSON.parse(data);
		// 		if(data.code == 0){
		// 			alert("邮件已重新发送");
		// 		}else if(data.code == 1){
		// 			alert(data.msg);
		// 		}
		// 	}
		// });
		$.ajax({
			url : api_host + "/signup_resent",
			method : "post",
			data: {"email": Request.email},
			success: function(data) {
				alert("邮件已重新发送");
			},error:function(err){
				err = dataParse(err.responseText);
				alert(err.msg);
			}
		});
	});
});



