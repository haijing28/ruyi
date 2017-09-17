$(function(){
	$(".tips-email").text(Request.email);
	var href = checkEmailSuffix(Request.email);
	if(href.length == 0){
		$("[data-act=accept-login] a").css("display","none");
	}else{
		$("[data-act=accept-login] a").attr("href",href);
	}
});