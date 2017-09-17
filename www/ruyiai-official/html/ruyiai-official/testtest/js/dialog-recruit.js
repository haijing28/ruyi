var dialogRecruitApp = angular.module("dialogRecruitApp",['ngSanitize']);
dialogRecruitApp.controller("dialogRecruitCtrl",function($scope,$sce){
	
	setCookie("currentPage","dialogRecruit"); //设置当前所在页面
	
	$scope.talks = [];
	$scope.talks.push({serverLeft: true,userRight: false,talkText:"您好，我是您的虚拟智能助理ruyi，欢迎加入我的伐木累，这个大家庭可是非常温馨哦，回复【应聘】马上看看有没有适合您的职位"});
	
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
		if($(".testTextarea textarea").val()){
			var headImgUrl = getCookie("headImgUrl");
			if(!headImgUrl || headImgUrl.length <= 0){
				headImgUrl = "img/example-icon/default-avatar.svg";
			}
			$scope.talks.push({serverLeft: false,userRight: true,talkText:$(".testTextarea textarea").val(),headImgUrl:headImgUrl});
			$(".testContain").scrollTop($(".testContain")[0].scrollHeight);
			$(".testTextarea textarea").val('');
		}
		var url = "http://api.ruyi.ai/v1/message";
		var demo_input = $scope.userSaysText;
		var options = "entities,intents,know,act";
		var demo_app_key = getCookie("appKey"); 
		 //demo_app_key = "cd8acccd-6c04-4924-8d5f-c20e20f84c14";
		demo_app_key = "b3a1b522-bb63-414f-a1fc-716fbc4146ab";

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
			"user_id":demo_user_id,
			"skip_log":"ruyi123",
			"context":JSON.stringify(context)
		};
		
		var preTime = new Date().getTime();
		$.ajax({
			url : url,
			data: demo_input,
			dataType : "jsonp",
			success: function(data) {
				if(data.code == 0){
					var result = data.result;
					if (result.error){
						alert("服务器错误，暂时无法处理请求");
						return;
					}
					if(result.intents && result.intents.length > 0){
						if(result.intents[0].result && result.intents[0].result.text){
							var talkText = result.intents[0].result.text;
							talkText = talkText.replace(/\\n/g,"<br/>");
							talkText = $sce.trustAsHtml(talkText);
							$scope.talks.push({serverLeft: true,userRight: false,talkText:talkText});
						}
					}
					$scope.$apply();
					$(".testContain").scrollTop($(".testContain")[0].scrollHeight);
				}else{
					$.trace(data.msg);
				}
	 		}
		});
	};
	
});
