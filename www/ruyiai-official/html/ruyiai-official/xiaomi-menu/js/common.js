var ruyiai_host = window.location.origin;
var static_host = "http://ruyi.ai";
var isproductDomain = true;
if(window.location.href.indexOf("ruyiai-official/test") > -1){
	isproductDomain = false;
	static_host = "http://lab.ruyi.ai/ruyiai-official/test";
}else if(ruyiai_host.indexOf("127.0.0.1") > -1){
	isproductDomain = false;
	static_host = "http://127.0.0.1/gitlab/ruyi-website-prod/ruyiai-official";
}else if(ruyiai_host.indexOf("http://192.168.1.179") > -1){
	isproductDomain = false;
	static_host = "http://192.168.1.179/gitlab/ruyi-website-prod/ruyiai-official";
}else if(ruyiai_host.indexOf("lab.ruyi.ai") > -1){
	isproductDomain = false;
	static_host = "http://lab.ruyi.ai/ruyiai-official";
}
//获取请求参数
function GetRequest() {
	var url = location.search;
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=decodeURIComponent(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}
var Request = new Object();
Request = GetRequest();

//写cookies
function setCookie(name,value)
{
	$.cookie(name, value, {
        path: "/", expiress: 1
    });
}

//读取cookies
function getCookie(name)
{
	return $.cookie(name);
}

//删除cookies
function delCookie(name)
{
	$.cookie(name, "", {
        path: "/", expiress: 1
    });
} 

/**
 * 设置图片位置
 */
var setFoodImgPositoinCommonFunc = function(imgSelector,fixedWidth,fixedHeight){
	var $imgObj = $(imgSelector);
	if($imgObj.height() / $imgObj.width() >= (fixedHeight / fixedWidth)){
		$imgObj.css({"width":"110%","height":"auto"});
		var marginTop = ($imgObj.height() - fixedHeight)/2;
		marginTop = Math.abs(marginTop);
		$imgObj.css({"margin-top":-marginTop + "px"});
	}else{
		$imgObj.css({"height":"110%","width":"auto"});
		var marginLeft = ($imgObj.width() - fixedWidth)/2;
		marginLeft = Math.abs(marginLeft);
		$imgObj.css({"margin-left":-marginLeft + "px"});
	}
}



