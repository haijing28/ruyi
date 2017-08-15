var appId = getCookie("appId");
var dataEditedFlag = false;

//试一试相关参数设置 start
var wechatResetSession = "true";
var localResetSession = "true";
var uuid = "ruyi-test-" + appId;
//试一试相关参数设置 end

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
//非正式版，禁止授权 end

/**
 * 通知nlp reload   注意：暂不能删除
 */
var callAgentReloadTestFunc = function(){
}

//公用的判断一个参数不为空方法
var one = function(parament,operationFunc){
	if(parament && $.trim(parament).length > 0){
		if(operationFunc){
			operationFunc();
		}
	}
}

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
