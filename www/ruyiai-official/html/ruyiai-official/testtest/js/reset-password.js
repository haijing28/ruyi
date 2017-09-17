$(function(){
	//$("#reset-password").modal("show");
	var ruyiai_host = window.location.origin;
	var validate = function(){
		$.ajax({
			url : api_host + "/password_reset",
			method : "get",
			data: {"email": Request.email,"verify_code":Request.verifycode},
			success: function(data) {
				console.log(data)
				if(data && data.code == 0){
					$("#reset-password").modal("show");
				}else if(data && data.code == 2){
					goIndex();
				}
			},
			error: function(err){
				// var err = JSON.parse(err.responseText);
				console.log(err)
				$(".captcha-overdue-box").css("display","block");
			}
		});
	}
	validate();
	
	$("body").off("click","[data-act=go-home]").on("click","[data-act=go-home]",function(event){
		window.location.href = "index.html";
	});
	
	$("body").off("click","[data-act=reset-password]").on("click","[data-act=reset-password]",function(event){
		var my_password = $("#my_password");
		var re_password = $("#re_password");
		if($.trim(my_password.val()).length == 0){
			$.trace("请输入密码");
			my_password.focus();
			return false;
		}else if(my_password.val().length < 6){
			$.trace("密码长度不足6位");
			my_password.focus();
			return false;
		}else if(my_password.val() != re_password.val()){
			$.trace("两次输入的密码不一致");
			re_password.focus();
			return false;
		}
		
		// $.ajax({
		// 	url : ruyiai_host + "/ruyi-ai/user/changepwd",
		// 	method : "get",
		// 	data:{"email": Request.email,"verifycode":Request.verifycode,"status":Request.status,"newpasswd":my_password.val()},
		// 	success: function(data) {
		// 		data = JSON.parse(data);
		// 		if(data && data.code == 0){
		// 			$.trace("密码重置成功","success");
		// 			window.location.href = "index.html?status=login";
		// 		}else if(data && data.code == 2){
		// 			goIndex();
		// 		}else if(data && data.code == 1){
		// 			$.trace(data.msg);
		// 		}
		// 	}
		// });

		$.ajax({
			url : api_host + "/password",
			method : "POST",
			data: JSON.stringify({"email": Request.email,"verify_code":Request.verifycode,"status":Request.status,"new_password":my_password.val()}),
			headers:{
				"content-type": 'application/json'
			},
			success: function(data) {
				data = dataParse(data);
				if(data && data.code == 0){
					$.trace("密码重置成功","success");
					window.location.href = "index.html?status=login";
				}else if(data && data.code == 2){
					goIndex();
				}else if(data && data.code == 1){
					$.trace(data.msg);
				}
			},error: function(err){
				var err = JSON.parse(err.responseText);
				$.trace(err.msg);
			}
		});
	});
	
	//回车
	$("body").off("keydown","#my_password,#re_password").on("keydown","#my_password,#re_password",function($event){
		if($event.keyCode == 13){
			$("[data-act=reset-password]").trigger("click");
		}
	})
	
	$('#reset-password').on('shown.bs.modal', function () {
		$("#my_password").focus();
	});
	
	$("body").click(function(e){
		console.log(22);
		event.stopPropagation();
		return;
	});
	
	$("document").click(function(e){
		console.log(33);
		event.stopPropagation();
		return;
	});
	
});



