function mySkillCtrl($rootScope,$scope, $state, $stateParams){
	$("[data-act=my_skill]").addClass("active").siblings("li").removeClass("active");

	$('body').on('click', '.my_down_web', function() {
		$.confirm({
		        "text": '<div class="my_own_down_div"><label class="down_web_label">是否确认下线该技能？</label>' + '<br>' + '<span class="down_web_span">下线技能后需要重新提交技能进行审核哦！</span></div>',
		        "title": " ",
		        "ensureFn": function() {
		        	}
		})
	})

	//根据skillId查找skill对象，组装成我的技能
	var mySkillId = getCookie("skillId");
	var mySkillList = [];
	if(mySkillId && mySkillId.length > 0){
		$.ajax({
			url: api_host_v2beta + 'skills/' + mySkillId,
			type: 'get',
			headers: {"Authorization" : "Bearer " + getCookie('accessToken')},
			success: function(data) {
				//data = dataParse(data);
			},
			error: function() {
				//goIndex();
			}
		});
		var mySkillDetail = '{ "id": "9c70c763-1b5e-455d-a49c-a10fabf6652d", "developerId": "50f6837d-f1a4-4cf5-95cb-3f2cff7149c4", "published": true, "developStatus": null, "gmtCreate": "2017-09-17T01:31:50", "gmtUpdate": "2017-09-17T01:31:50", "agents": [ { "version": "0.0.1", "tag": "Product", "agentId": "34dfd63a-7896-410c-991b-bfca91aaa56a", "agent": { "name": "seconhhhd 222 skill", "description": "description", "logo": "path-to-logo image", "service": "service", "category": "children toy", "agentType": "SKILL", "skillIds": [], "attributes": { "nickNames": [ "bot", "dadou" ], "nickNameTail": null, "nickNameVoiceVariants": [ "bolt", "kaka" ], "gender": "", "genderTail": null, "birthday": null, "birthdayTail": null, "hobbies": [], "hobbiesTail": null, "father": "", "fatherTail": null, "userInputExamples": [ "你好！" ], "developerMainSite": "http://ruyi.ai", "developerIntroduction": "best ai developer", "descriptionForAudit": "realy good skill", "thirdPartyPlatforms": [ "ruyi.ai" ] }, "defaultResponses": [], "id": "34dfd63a-7896-410c-991b-bfca91aaa56a", "appKey": "479cbdb0-e368-4dd8-8e46-c51a101926c8" } } ], "companionBotId": null }';
		mySkillDetail = JSON.parse(mySkillDetail);
		mySkillList.push(mySkillDetail);
		$scope.mySkillList = mySkillList;
		$scope.$apply();
	}
	
	//我引用的技能 TODO
	var getMyHasSkillFunc = function() {
		$.ajax({
			url: api_host_v2beta + 'skills/public',
			type: 'get',
			headers: {"Authorization" : "Bearer " + getCookie('accessToken')},
			data:{"size": 100,"tag": productTag},
			success: function(data) {
				data = dataParse(data);
				$scope.myHasSkillList = data.content;
				hasSkillCheckFunc($scope.myHasSkillList,$rootScope.currentRobot);//判断是否已经获取
				$scope.$apply();
			},
			error: function() {
				 goIndex();
			}
		})
	}
	getMyHasSkillFunc();
	
	//获取技能
	$("body").off("click","[data-act=add-my-skill]").on("click","[data-act=add-my-skill]",function(event){
		event.stopPropagation();
		var $this = $(this);
		var skillId = $this.attr("data-skill-id");
		addSkillToBotFunc($scope.myHasSkillList,skillId,$rootScope.currentRobot);
		$scope.$apply();
	});
	
	//移除技能
	$("body").off("click","[data-act=remove-my-skill]").on("click","[data-act=remove-my-skill]",function(event){
		event.stopPropagation();
		var $this = $(this);
		$.confirm({
	        "text": '<div class="my_own_down_div"><label class="down_web_label">是否确认下线该技能？</label>' + '<br>' + '<span class="down_web_span">下线技能后需要重新提交技能进行审核哦！</span></div>',
	        "title": " ",
	        "ensureFn": function() {
	        	var skillId = $this.attr("data-skill-id");
	        	removeSkillFromBotFunc($scope.myHasSkillList,skillId,$rootScope.currentRobot);
	        	$scope.$apply();
	        }
		})
	});
	
}


























