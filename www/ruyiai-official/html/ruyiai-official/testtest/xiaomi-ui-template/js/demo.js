var templateApp = angular.module("templateApp",[]);
templateApp.controller("templateAppCtrl",function($rootScope,$scope){
	$scope.getTemplateDataFunc = function(){
		var url = "http://lab.ruyi.ai/common-api/getdata";
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
					$scope.data = data;
					data = JSON.parse(data);
					$scope.promptObj = data.prompt;
					var type = 1;
					$scope.title = data.title;
					$scope.author = data.author;
					$scope.poems = data.poems;
					$scope.poem = data.poem;
					$(".template-two-continer").css("display","block");
					console.log("data.replies[0].payload.url:" +data.replies[0].payload.url);
					$(".template-two-continer #content-box").css("background-image","url("+ data.replies[0].payload.url +")");
					$scope.$apply();
				} catch (e) {
				}
			}
		});
	}
	$scope.getTemplateDataFunc();
	
});












