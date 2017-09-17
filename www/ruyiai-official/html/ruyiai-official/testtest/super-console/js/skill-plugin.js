var robotApp = angular.module("skillPluginApp",[]);

robotApp.filter('skillPluginApplyTimeFilter',
function(){
	return function(input) {
		console.log("input:" + input);
		var tempDate = new Date();
		tempDate.setTime(input);
		out = $.timeFormat(tempDate,"yyyy-MM-dd HH:mm");
	    return out;
	};
});
robotApp.controller("skillPluginCtrl",function($scope){
	//获得申请技能插件列表 start
	$scope.getSkillPluginListFunc = function(){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/item/query/list",
			method: "get",
			success: function(data){
				
				data = dataParse(data);
				if(data.code == 0){
					$scope.skillPluginList = data.result;
					$scope.$apply();
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	}
	$scope.getSkillPluginListFunc();
	//获得申请技能插件列表 end
	
	$("[data-act=overall-situation]").click(function(){
		window.location.href = "statistics.html";
	});
	
	$("[data-act=robot-profile]").click(function(){
		window.location.href = "robot.html";
	});
	
});






