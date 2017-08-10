$(function(){
	//提交数据
	$("body").off("click",".confirm-invite-code").on("click",".confirm-invite-code",function($event){
		var $this = $(this);
		var $invite_code = $("#invite-code-id");
		if($.trim($invite_code.val()).length == 0){
			$(".invite-code-expire").text("请填写邀请码");
			$invite_code.focus();
		}else if($.trim($invite_code.val()).length != 8){
			$(".invite-code-expire").text("请填写正确的邀请码");
			$invite_code.focus();
		}else{
			$.ajax({
				url:  api_host + '/invite_code/' + $invite_code.val(),
				method : "GET",
				success: function(data) {
					window.location.href = "register-baseinfo.html?activecode=" + $invite_code.val();
				},
				error: function(err){
					var err = JSON.parse(err.responseText);
					$(".invite-code-expire").text(err.msg);
					$invite_code.focus();
				}
			});
		}
	});

	console.log(api_host)
	
	//邀请码页面回车
	$("body").off("keydown","#invite-code-id").on("keydown","#invite-code-id",function($event){
		var $this = $(this);
		if($event.keyCode == 13){
			$(".confirm-invite-code").trigger("click");
		}
	});
	
});

//http://lab.ruyi.ai:8080/ruyi-ai' + $invite_code.val(), 



