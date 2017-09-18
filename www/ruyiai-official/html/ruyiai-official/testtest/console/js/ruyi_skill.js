function ruyiSkillCtrl($rootScope,$scope, $state, $stateParams){
	$("[data-act=ruyi_skill]").addClass("active").siblings("li").removeClass("active");
	
	//获得如意精选的skill,目前获得的是public的skill TODO
	var getRuyiSkillFunc = function() {
		$.ajax({
			url: api_host_v2beta + 'skills/public',
			type: 'get',
			headers: {"Authorization" : "Bearer " + getCookie('accessToken')},
			data:{"size": 100,"tag": productTag,"recommendTag":"Ruyi_Selected"},
			success: function(data) {
				data = dataParse(data);
				$scope.ruyiSkillList = data.content;
				hasSkillCheckFunc($scope.ruyiSkillList,$rootScope.currentRobot);//判断是否已经获取
				$scope.$apply();
			},
			error: function() {
				 goIndex();
			}
		})
	}
	getRuyiSkillFunc();
	
	//获取技能
	$("body").off("click","[data-act=add-ruyi-skill]").on("click","[data-act=add-ruyi-skill]",function(event){
		event.stopPropagation();
		var $this = $(this);
		var skillId = $this.attr("data-skill-id");
		addSkillToBotFunc($scope.ruyiSkillList,skillId,$rootScope.currentRobot);
		$scope.$apply();
	});
	
	//移除技能
	$("body").off("click","[data-act=remove-ruyi-skill]").on("click","[data-act=remove-ruyi-skill]",function(event){
		event.stopPropagation();
		var $this = $(this);
		$.confirm({
	        "text": '<div class="my_own_down_div"><label class="down_web_label">是否确认移除该技能？</label>' + '<br>' + '<span class="down_web_span">移除之后，将失去该技能的功能！</span></div>',
	        "title": " ",
	        "ensureFn": function() {
	        	var skillId = $this.attr("data-skill-id");
	        	removeSkillFromBotFunc($scope.ruyiSkillList,skillId,$rootScope.currentRobot);
	        	$scope.$apply();
	        }
		})
	});
}
