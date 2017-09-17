function angularDemoCtrl($rootScope, $scope, $state, $stateParams){
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-test]").addClass("active");
	$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	$('.assistant-box ').height();
	$scope.talks = [];
	$scope.responseJSONS = [];
	// var testContain = $('.assistant-box').outerHeight()+$('.testTextarea').outerHeight()-10;
	// $('.testContain').outerHeight($(window).height()-testContain);
	// $('#responseJson').outerHeight($('.testContain').outerHeight()+$('.testTextarea').outerHeight());
	// $(window).resize(function(event) {
	// 	$('.testContain').outerHeight($(window).height()-testContain);
	// 	$('#responseJson').outerHeight($('.testContain').outerHeight()+$('.testTextarea').outerHeight());
	// });
	//跳转到调试界面
// 	$scope.demotest = function(){
// 		// 使用新thread_id
// 		myrandom = Math.random();
// 		thread_id = (myrandom + "").substr(0, 10);
// 		$("#testpage").modal("show");
// //		$(".list-group-item").removeClass("active");
// //		$("[data-act=nav-test]").addClass("active");
// 	}
	
	//提交测试
	var myrandom = Math.random();
	var demo_user_id = (myrandom + "").substr(0, 10);
	
	$("body").off("keydown","[data-act=sendMsg]").on("keydown","[data-act=sendMsg]",function(e){
		if(e.keyCode == 13){
			$scope.testSubmit();
			return false;
        }
	});
	
	$scope.testSubmit = function(){
		if(!$(".testTextarea textarea").val() || $(".testTextarea textarea").val().length == 0){
			$.trace("请填写你要说的话");
			$(".testTextarea textarea").focus();
			return false;
		}
		if($(".testTextarea textarea").val()){
			$scope.talks.push({serverLeft: false,userRight: true,talkText:$(".testTextarea textarea").val()});
			$(".testContain").scrollTop($(".testContain")[0].scrollHeight);
			$(".testTextarea textarea").val('');
		}
		
//		isproductDomain = true;
		
		//TODO
		var url = "https://api.ruyi.ai/v1/message";
		if(!isproductDomain){   
		  	url = "http://lab.ruyi.ai/ruyi-api/v1/message";
		}
		var demo_input = $scope.userSaysText;
		var options = "entities,intents,know,act";
		var demo_app_key = getCookie("appKey"); 
//		demo_app_key = "fca2f900-5e36-4014-90e2-9d166ea6a089";
		var domains = "test";
		var context = {
			'reference_time': new Date().getTime(),
			'timezone':'Asia/Shanghai',
			'domains':domains
		}

		var demo_input = {
			"app_key":demo_app_key,
			"q":demo_input,
			"options":options,
			"user_id":appId,
			//"skip_log":"ruyi123",
			"context":context
		};
		
		//正式版和测试版做不同的处理 start
		var processApiResultFunc = function(data){
			data = dataParse(data);
					if(data.code == 0){
				var result = data.result;
				var textValue = "未匹配到意图";
				if(result.intents && result.intents.length > 0){
					if(result.intents[0].outputs){
						for(var i in result.intents[0].outputs){
							switch (result.intents[0].outputs[i].type) {
								case "wechat.text":
									textValue = result.intents[0].outputs[i].property.text;
									$scope.talks.push({serverLeft: true,userRight: false,talkText: textValue});
								break;
								case "wechat.image":
									textValue = "微信图片：" + result.intents[0].outputs[i].property.name;	
									$scope.talks.push({serverLeft: true,userRight: false,talkText: textValue});
								break;
								case "wechat.voice":
									textValue = "微信音频：" + result.intents[0].outputs[i].property.name;
									$scope.talks.push({serverLeft: true,userRight: false,talkText: textValue});
									break;
								case "wechat.video":
									textValue = "微信视频：" + result.intents[0].outputs[i].property.name;
									$scope.talks.push({serverLeft: true,userRight: false,talkText: textValue});
									break;
								case "wechat.news":
									textValue = "微信图文：" + result.intents[0].outputs[i].property.name;
									$scope.talks.push({serverLeft: true,userRight: false,talkText: textValue});
									break;
							}
						}
					}
				}
				if(textValue == "未匹配到意图"){
					$scope.talks.push({serverLeft: true,userRight: false,talkText: textValue});
				}
				$scope.responseJSONS.push({request:result._text,response:JSON.stringify(result,null,4)});
				$scope.$apply();
				$(".testContain").scrollTop($(".testContain")[0].scrollHeight);
				$("#responseJson").scrollTop($("#responseJson")[0].scrollHeight);
			}else{
				$.trace(data.msg);
			}
		}
		//正式版和测试版做不同的处理 end
		
		var preTime = new Date().getTime();
		$.ajax({
			url : url,
			data: JSON.stringify(demo_input),
			method : "post",
			success: function(data) {
				
				processApiResultFunc(data);
			}
		});
	};
}