//跳转到首页
var goIndex = function(){
	delCookie("email");
	delCookie("nickname");
	delCookie("userId");
	delCookie("appId");
	delCookie("appName");
	delCookie("appKey");
	delCookie("tgt");
	window.location.href = static_host + "/super-console/login.html"
}

$("[data-act=user-name]").html(getCookie("email"));

//退出登录状态
$("[data-act=user-logout]").click(function(){//注销
	$.ajax({
		url : api_host + "/v1/tickets/" + getCookie('tgt'),
		method : "DELETE",
		success: function(data) {
			delCookie("email");
			delCookie('tgt');
			window.location.href = static_host + "/super-console/login.html";
		}
	});
});


