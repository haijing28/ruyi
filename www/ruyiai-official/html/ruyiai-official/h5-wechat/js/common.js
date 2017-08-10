//设置硬件地址 start
var ruyi_wechat = "http://lab.ruyi.ai";
if(isproductDomain){
	ruyi_wechat = "https://api.ruyi.ai";
}else if(ruyiai_host.indexOf("192.168.1.182") > -1){
	ruyi_wechat = "http://ml.ruyi.ai";
}
//设置硬件地址 end

var uuid = "";
if(getCookie("user_id_flag") && getCookie("user_id_flag").length > 0){
	uuid = getCookie("user_id_flag");
}else{
	uuid = new Date().getTime();
	setCookie("user_id_flag",uuid);
}

//非正式版，禁止授权 start
if(!isproductDomain){
	$("[data-act=weixin-authorization]").css("display","none");
}
//非正式版，禁止授权 end

//公用的判断一个参数不为空方法
var one = function(parament,operationFunc){
	if(parament && $.trim(parament).length > 0){
		if(operationFunc){
			operationFunc();
		}
	}
}
