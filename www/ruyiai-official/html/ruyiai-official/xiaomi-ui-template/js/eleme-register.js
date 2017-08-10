var elemeRegisterApp = angular.module("elemeRegisterApp",[]);
elemeRegisterApp.controller("elemeRegisterAppCtrl",function($rootScope,$scope){
	
	$scope.title = "已经打开饿了么，发现您是新用户，需要完善信息才能使用点餐服务";
	$scope.prompt = "输入用户信息，您可以这样说：";
	$scope.tips = "“我的姓名是小米” “我的电话是15900996553”";
	
	$(".eleme-register").css("display","block");
	$("body").off("click","[data-act=submit-eleme-register]").on("click","[data-act=submit-eleme-register]",function(event){
		var $this = $(this);
		var $name = $("#name");
		var $mobilephone = $("#mobilephone");
		var $address = $("#address");
		var telRegFlag = $mobilephone.val().match(/^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/);
		if($.trim($name.val()).length == 0){
			$.trace("请输入您的姓名");
			$name.focus();
			return false;
		}else if($.trim($mobilephone.val()).length == 0){
			$.trace("请输入您的电话");
			$mobilephone.focus();
			return false;
		}else if(!telRegFlag){
			$.trace("请输入正确的电话号码");
			$mobilephone.focus();
			return false;
		}else if($.trim($address.val()).length == 0){
			$.trace("请输入您的收货地址");
			$address.focus();
			return false;
		}
		$scope.getFoodInfoAppkeyFunc($name.val(),$mobilephone.val(),$address.val());
	});
	
	$scope.getFoodInfoAppkeyFunc = function(name,mobilephone,address){
		var domains = "xiaomi";
		var options = "entities,intents,know,act";
		var context = {
			'reference_time': new Date().getTime(),
			'timezone':'Asia/Shanghai',
			'domains':domains
		}
		var url = "https://api.ruyi.ai/v1/message";
		if(!isproductDomain){
			url = "http://lab.ruyi.ai/ruyi-api/v1/message";
		}
		var demo_input = "我是"+name+" ,地址是"+address+" ,电话号码是" + mobilephone;
		var demo_input = {
			"app_key": Request.app_key,
			"q":demo_input,
			"user_id":Request.user_id,
			"options":options,
			"context":context
		};
		$.ajax({
			url : url,
			data: JSON.stringify(demo_input),
			method : "post",
			success: function(data) {
				data = JSON.parse(data);
				if(data.code == 0){
					var intentObj = data.result.intents[0];
					var resultObj = intentObj.result;
					var resultCode = resultObj.code;
					if(resultCode == 500 || resultCode == "500"){
						$.trace(resultObj.response.message);
					}else{
						try {
							var parametersObj = intentObj.parameters;
							var labelArra = parametersObj["标签云"].split(":");
							$scope.title = "注册";
							$scope.prompt = labelArra[0];
							var tipArraStr = labelArra[1];
							var tipArra = tipArraStr.split(",");
							var tipsStr = "";
							for(var i in tipArra){
								tipsStr = tipsStr + "“" + tipArra[i] + "”  ";
							}
							$scope.tips = tipsStr;
							$(".register-form-box").css("display","none");
							$scope.registerSuccessTips = intentObj.outputs[0].property.text;
							$scope.$apply();
						} catch (e) {
							$scope.$apply();
							$.trace("服务器出现异常");
						}
					}
				}else{
					$.trace("服务器出现异常");
				}
			}
		});
	}
	
	
});












