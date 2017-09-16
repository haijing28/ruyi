function openSkillCtrl($rootScope,$scope, $state, $stateParams){
	$("[data-act=open_skill]").addClass("active").siblings("li").removeClass("active");
	
	var getSkillCards = function() {
		$.ajax({
			url: api_host_v2beta + 'skills/public',
			type: 'get',
			headers: {"Authorization" : "Bearer " + getCookie('accessToken')},
			data:{"size": 100,"tag": productTag},
			success: function(data) {
				data = dataParse(data);
				$scope.openSkillList = data.content;
				hasSkillCheckFunc($scope.openSkillList,$rootScope.currentRobot.referencedApp);//判断是否已经获取
				$scope.$apply();
			},
			error: function() {
				 goIndex();
			}
		})
	}
	getSkillCards();
	
	//获取技能
	$("body").off("click","[data-act=getSkill]").on("click","[data-act=getSkill]",function(event){
		event.stopPropagation();
		var $this = $(this);
		var skillId = $this.attr("data-skill-id");
		console.log("获取技能：" + skillId);
		addSkillToBotFunc($scope.openSkillList,skillId,$rootScope.currentRobot.referencedApp);
		$scope.$apply();
	});
	
	//移除技能
	$("body").off("click","[data-act=removeSkill]").on("click","[data-act=removeSkill]",function(event){
		event.stopPropagation();
		var $this = $(this);
		var skillId = $this.attr("data-skill-id");
		console.log("移除技能：" + skillId);
		removeSkillFromBotFunc($scope.openSkillList,skillId,$rootScope.currentRobot.referencedApp);
		$scope.$apply();
	});

}















