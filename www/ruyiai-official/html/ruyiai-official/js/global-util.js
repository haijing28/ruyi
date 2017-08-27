var ruyiai_host = window.location.origin;
var static_host = "https://ruyi.ai";
var isproductDomain = true;
if(window.location.href.indexOf("ruyiai-official/test") > -1){
	static_host = "http://lab.ruyi.ai/ruyiai-official/test";
	isproductDomain = false;
}else if(ruyiai_host.indexOf("http://test.ruyi.ai") > -1){
	static_host = "http://test.ruyi.ai/gitlab/ruyiai-official/www/ruyiai-official/html/ruyiai-official";
	isproductDomain = false;
}else if(ruyiai_host.indexOf("lab.ruyi.ai") > -1){
	static_host = "http://lab.ruyi.ai/ruyiai-official";
	isproductDomain = false;
}
var correction_host = "http://test.ruyi.ai:3333/";
var api_host = "https://api.ruyi.ai/sso";
if(!isproductDomain){
	api_host = "http://lab.ruyi.ai/sso";
}
if(ruyiai_host.indexOf("www") > -1){
	var myhref = window.location.href;
	window.location.href = myhref.replace("www.","");
}

//应该这个方法获取请求参数才是正确的
function GetRequestTwo() {
	var url = location.href;
	var theRequest = new Object();
	var urlIndex = url.indexOf("?");
	if (urlIndex != -1) {
		url = url.substr(urlIndex);
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=decodeURIComponent(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}
var RequestTwo = new Object();
RequestTwo = GetRequestTwo();

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

//跳转到首页
var goIndex = function(){
	delCookie("email");
	delCookie("nickname");
	delCookie("userId");
	delCookie("appId");
	delCookie("appName");
	delCookie("appKey");
	delCookie("tgt");
	window.location.href = static_host + "/base/login.html"
}

//判断是否需要进行parse转换
var dataParse = function(data){
	if(typeof data == 'string'){
		data = JSON.parse(data);
	}
	return data;
}

//帮助问号完美解决 start
$('[data-toggle="popover"]').popover();
var popoverHelpFlag = false;
var popoverButtonFlag = false;
$("body").delegate("[data-toggle=popover]","mouseover",function(){
	var $this = $(this);
	$(".popover").remove();
	popoverButtonFlag = true;
	$this.popover('show');
});
$("body").delegate("[data-toggle=popover]","mouseout",function(){
	var $this = $(this);
	popoverButtonFlag = false;
	setTimeout(function(){
		if(!popoverHelpFlag && !popoverButtonFlag){
			$this.popover('hide');
		}
	}, 100);
});
$("body").delegate(".popover","mouseover",function(){
	var $this = $(this);
	popoverHelpFlag = true;
});
$("body").delegate(".popover","mouseout",function(){
	var $this = $(this);
	popoverHelpFlag = false;
	setTimeout(function(){
		if(!popoverHelpFlag && !popoverButtonFlag){
			$this.remove();
		}
	}, 100);
});
//帮助问号完美解决 end

