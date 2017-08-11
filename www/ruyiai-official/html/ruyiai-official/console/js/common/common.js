//var static_host = "http://ruyi.ai"; //正式环境
//var static_host = "http://lab.ruyi.ai/ruyiai-official"; //测试环境
//var static_host = "http://127.0.0.1/website/lab.ruyi.ai/ruyiai-official"; //硬件测试
var ruyiai_host = window.location.origin;
var api_host = "http://lab.ruyi.ai/sso";
var static_host = "https://ruyi.ai";
var new_host = "http://api.ruyi.ai"; // 没成功
var isproductDomain = true;
if(window.location.href.indexOf("ruyiai-official/test") > -1){
	static_host = "http://lab.ruyi.ai/ruyiai-official/test";
	isproductDomain = false;
}else if(ruyiai_host.indexOf("127.0.0.1") > -1){
	static_host = "http://127.0.0.1/gitlab/ruyi-website-prod/ruyiai-official";
	isproductDomain = false;
}else if(ruyiai_host.indexOf("http://test.ruyi.ai") > -1){
	static_host = "http://test.ruyi.ai/gitlab/ruyi-website-prod/ruyiai-official";
	isproductDomain = false;
}else if(ruyiai_host.indexOf("http://192.168.1.179") > -1){
	static_host = "http://192.168.1.179/gitlab/ruyi-website-prod/ruyiai-official";
	isproductDomain = false;
}else if(ruyiai_host.indexOf("lab.ruyi.ai") > -1){
	static_host = "http://lab.ruyi.ai/ruyiai-official";
	isproductDomain = false;
}
if(ruyiai_host.indexOf("www") > -1){
	var myhref = window.location.href;
	window.location.href = myhref.replace("www.","");
}

var appId = getCookie("appId");
var dataEditedFlag = false;

//试一试相关参数设置 start
var wechatResetSession = "true";
var localResetSession = "true";
var uuid = "ruyi-test-" + appId;
//试一试相关参数设置 end

//设置调用ruyi-wechat api的域名 start
//var ruyidb_host = ruyiai_host + "/ruyi-wechat/";
//if(ruyiai_host.indexOf("127.0.0.1") > -1){
//	ruyidb_host = ruyiai_host + "/ruyi-ai/";
//}
//设置调用ruyi-wechat api的域名 end

//设置硬件地址 start
var ruyi_wechat = "http://lab.ruyi.ai";
if(isproductDomain){
	ruyi_wechat = "https://api.ruyi.ai";
}else if(ruyiai_host.indexOf("192.168.1.182") > -1){
	ruyi_wechat = "http://ml.ruyi.ai";
}
//设置硬件地址 end

//非正式版，禁止授权 start
if(!isproductDomain){
	$("[data-act=weixin-authorization]").css("display","none");
}
setTimeout(function(){
	
}, 1000);
//非正式版，禁止授权 end

/**
 * 通知nlp reload
 */
var callAgentReloadTestFunc = function(){
//	$.ajax({
//		url : "http://ruyi.ai/ruyi-nlp/agent/reload",
//		method : "POST",
//		data:{"agent_id": appId},
//		success: function(data) {
//		}
//	});
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

//公用的判断一个参数不为空方法
var one = function(parament,operationFunc){
	if(parament && $.trim(parament).length > 0){
		if(operationFunc){
			operationFunc();
		}
	}
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

/*判断字符串是否包含空格*/
var isContainSpacesFunc = function(inputStr){
	var containSpaces = false;
	if(/\s/.test(inputStr)){
		containSpaces = true;
    }else{
    	containSpaces = false;
    }
	if(containSpaces){
		$.trace("不能包含空格");
	}
	return containSpaces;
}
/*判断字符串是否包含空格*/
