$(function(){
	$.ajax({
		url : api_host + "/signup_activation",
		method : "get",
		data: {"email":Request.email,"verify_code": Request.verifycode},
		success: function(data) {
			$(".container_box").css("display","block");
		},
		error: function(data){
			data = dataParse(data.responseText);
			$(".active-failure-tips").css("display","block");
			$(".active-failure-tips").text(data.msg);
		}
	});

	$("body").off("click",".success-skip").on("click",".success-skip",function($event){
		window.location.href = "login.html";
	});

});