var templateApp = angular.module("templateApp",['ngSanitize']);
templateApp.controller("templateAppCtrl",function($rootScope,$scope){
//	$(".template-one-continer").css("display","block");
//	$(".template-two-continer").css("display","block");
//	$(".template-four-continer").css("display","block");
//	$(".template-five-continer").css("display","block");
//	$(".template-five-continer-box").css("display","block");
//	$(".shopping-cart-box").css("display","block");
//	$(".loadding-template-continer").css("display","block");
	var serverErrorFlag = true;
	$scope.getTemplateDataFunc = function(){
		var url = "http://apix.ruyi.ai/ruyi-xiaomi/getdata";
		if(!isproductDomain){
			url = "http://lab.ruyi.ai/ruyi-api/v1/xiaomi/getdata";
		}
		var demo_input = Request.q;
		demo_input = {
			"id":Request.id
		};
		$scope.question = Request.q;
		$.ajax({
			url : url,
			type:"get",
			data: demo_input,
			success: function(data) {
				try {
					data = JSON.parse(data);
					$scope.promptObj = data.prompt;
					$scope.toSpeak = data.response.to_speak;
					var uiTemplateObj = data.response.to_display.ui_template;
					if(uiTemplateObj){
						serverErrorFlag = false;
						clearInterval(getTemplateDataInterval);//获得到数据，没有报错，则清除定时器
					}
					var type = uiTemplateObj.type;
					if(type == 0){
						$scope.templateOneObj = uiTemplateObj;
						$(".template-one-continer").css("display","block");
						$(".template-one-continer .ul-box").css("background-image","url("+$scope.templateOneObj.background_image+")");
					}else if(type == 1){
						$scope.templateTwoObj = uiTemplateObj;
						if($scope.templateTwoObj.item){
							for(var i in $scope.templateTwoObj.item.body){
								var bodyText = $scope.templateTwoObj.item.body[i].text;
								bodyText = bodyText.replace("<font color='#000000'>","").replace("</font>","");
								$scope.templateTwoObj.item.body[i].text = bodyText;
							}
						}
						if($scope.templateTwoObj.item.images && $scope.templateTwoObj.item.images[0].length > 0){
							$(".template-two-display").css("display","block");
							var selectorImg = ".template-two-continer .media-img";
							var setIntervalPositoinFunc = setInterval(function(){
								if($(selectorImg).width() > 0){
									clearInterval(setIntervalPositoinFunc);
									setFoodImgPositoinCommonFunc(selectorImg,150,150);
								}
							},100);
						}else{
							$(".template-two-display-two").css("display","block");
						}
						$(".template-two-continer .content-box").css("background-image","url("+$scope.templateTwoObj.item.background_image+")");
					}else if(type == 3){
						$scope.templateFourObj = uiTemplateObj;
						var orderNumber = "";
						if($scope.templateFourObj && $scope.templateFourObj.buttom_item && $scope.templateFourObj.buttom_item[2]){
							orderNumber = $scope.templateFourObj.buttom_item[2][1];
						}
						$(".template-four-continer").css("display","block");
						if($scope.templateFourObj.image_url && $scope.templateFourObj.image_url.length > 0
								&& Request.user_id && Request.app_key){
							//定时调用后台请求
//							var getOrderCurrentStatusInterval = setInterval(function(){
//								$scope.getFoodInfoAppkeyFunc(orderNumber);
//							}, 2000);
						}
					}else if(type == 4){
						$scope.templateFiveObj = uiTemplateObj;
						$(".template-five-continer").css("display","block");
						$(".template-five-continer-box").css("display","block");
						$(".shopping-cart-box").css("display","block");
						if($scope.templateFiveObj.shop_cart && $scope.templateFiveObj.shop_cart.length > 0){
							$(".shopping-cart-box").css("width","22%");
							$(".shopping-cart-right").css("width","78%");
							$(".template-five-continer .prompt-box").css("width","70%");
						}
					}else{
						$scope.systemTips = "“服务超时或服务不可用，请稍候重试”";
						$(".template-server-tips").css("display","block");
					}
					$scope.$apply();
				} catch (e) {
				}
			},error:function(data){
				$scope.systemTips = "“服务超时或服务不可用，请稍候重试”";
				$(".template-server-tips").css("display","block");
			}
		});
	}
	var getTemplateDataInterval = setInterval(function(){
		$scope.getTemplateDataFunc();
	}, 200);
	
	setTimeout(function(){
		clearInterval(getTemplateDataInterval);
		if(serverErrorFlag){
			//$(".loadding-template-continer").css("display","none");
			$scope.systemTips = "“服务超时或服务不可用，请稍候重试”";
			$(".template-server-tips").css("display","block");
			$scope.$apply();
		}
	}, 3000);
	
	//判断订单当前状态
	$scope.getFoodInfoAppkeyFunc = function(orderNumber){
		var domains = "xiaomi";
		var options = "entities,intents,know,act";
		var context = {
			'reference_time': new Date().getTime(),
			'domains':domains
		}
		var url = "https://api.ruyi.ai/v1/message";
		if(!isproductDomain){   
		  	url = "http://lab.ruyi.ai/ruyi-api/v1/message";
		}
		var demo_input = "查询订单详情，订单号:" + orderNumber;
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
					var resultObj = data.result.intents[0].result;
					if(resultObj.code == 200){
						var responseObj = resultObj.response;
						if(responseObj.code == 200){
							var dataObj = responseObj.data;
							if(dataObj.status_code != -5){
								clearInterval(getOrderCurrentStatusInterval);//获得了订单当前状态，则清楚定时器
								$scope.title = "订单";
								$scope.order_number = "订单号：" + dataObj.order_id;
								var outputObj = data.result.intents[0].outputs[0];
								$scope.order_status_tips = outputObj.property.text;
								var parametersObj = data.result.intents[0].parameters;
								
								var labelArra = parametersObj["标签云"].split(":");
								$scope.prompt = labelArra[0];
								var tipArraStr = labelArra[1];
								var tipArra = tipArraStr.split(",");
								var tipsStr = "";
								for(var i in tipArra){
									tipsStr = tipsStr + "“" + tipArra[i] + "”  ";
								}
								$scope.tips = tipsStr;
								$(".template-four-continer").css("display","none");
								$(".order-status-box").css("display","block");
							}else{
							}
						}
					}
				}
			}
		});
	}
	
});












