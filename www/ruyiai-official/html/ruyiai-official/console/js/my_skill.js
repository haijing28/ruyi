function mySkillCtrl($rootScope,$scope, $state, $stateParams){
	$("[data-act=my_skill]").addClass("active").siblings("li").removeClass("active");

	var downlineSkillFunc = function(dataSkillId){
		$.ajax({
			url: api_host_v2beta + 'skills/'+ dataSkillId +'/offline',
			type: 'post',
			headers: {"Authorization" : "Bearer " + getCookie('accessToken')},
			success: function(data) {
			},
			error: function(data) {
				if(data.status == 401 || data.status == 403){
            		goIndex();
            	}
			}
		});
	}
	
	$('body').on('click', '.my_down_web', function() {
		var $this = $(this);
		var dataSkillId = $this.attr("data-skill-id");
		$.confirm({
	        "text": '<div class="my_own_down_div"><label class="down_web_label">是否确认下线该技能？</label>' + '<br>' + '<span class="down_web_span">下线技能后需要重新提交技能进行审核哦！</span></div>',
	        "title": " ",
	        "ensureFn": function() {
	        	$this.text('已下线');
	        	$this.attr('disabled', true);
	        	$this.addClass('has_dis_true');
	        	downlineSkillFunc(dataSkillId);
	        	$scope.mySkillList[0].auditStatus = 'OFFLINE';
	        	updateAuditStatusFunc($scope.mySkillList[0]);
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
			data: {"tag": "Develop"},
			success: function(data) {
				data = dataParse(data);
				updateAuditStatusFunc(data);
			},
			error: function() {
				$.ajax({
					url: api_host_v2beta + 'skills/' + mySkillId,
					type: 'get',
					headers: {"Authorization" : "Bearer " + getCookie('accessToken')},
					data: {"tag": "Product"},
					success: function(data) {
						data = dataParse(data);
						updateAuditStatusFunc(data);
					},
					error: function(data) {
						if(data.status == 401 || data.status == 403){
		            		goIndex();
		            	}
					}
				});
			}
		});
	}
	
	//更新页面显示的审核状态
	var updateAuditStatusFunc = function(mySkillDetail){
		//mySkillDetail = '{ "auditStatus": "REJECTED","id": "9c70c763-1b5e-455d-a49c-a10fabf6652d", "developerId": "50f6837d-f1a4-4cf5-95cb-3f2cff7149c4", "published": true, "developStatus": null, "gmtCreate": "2017-09-17T01:31:50", "gmtUpdate": "2017-09-17T01:31:50", "agents": [ { "version": "0.0.1", "tag": "Product", "agentId": "34dfd63a-7896-410c-991b-bfca91aaa56a", "agent": { "name": "seconhhhd 222 skill", "description": "description", "logo": "path-to-logo image", "service": "service", "category": "children toy", "agentType": "SKILL", "skillIds": [], "attributes": { "nickNames": [ "bot", "dadou" ], "nickNameTail": null, "nickNameVoiceVariants": [ "bolt", "kaka" ], "gender": "", "genderTail": null, "birthday": null, "birthdayTail": null, "hobbies": [], "hobbiesTail": null, "father": "", "fatherTail": null, "userInputExamples": [ "你好！" ], "developerMainSite": "http://ruyi.ai", "developerIntroduction": "best ai developer", "descriptionForAudit": "realy good skill", "thirdPartyPlatforms": [ "ruyi.ai" ] }, "defaultResponses": [], "id": "34dfd63a-7896-410c-991b-bfca91aaa56a", "appKey": "479cbdb0-e368-4dd8-8e46-c51a101926c8" } } ], "companionBotId": null }';
		mySkillDetail = dataParse(mySkillDetail);
		mySkillList.push(mySkillDetail);
		$scope.mySkillList = mySkillList;
		$scope.mySkillList.forEach(function(ele) {

			ele.btn_show = true
			ele.btn_Text = '从技能商店撤回技能';

			// if(ele.auditStatus == 'INIT') {
			// 	ele.statuClass = 'succ';
			// 	ele.statuText = '通过审核'
			// 	ele.btn_Text = '从技能商店撤回技能';
			// 	ele.btn_show = true;
			// }
			
			if(ele.auditStatus == 'APPROVED') {
				ele.statuClass = 'approved';
				ele.statuText = '通过审核'
				ele.btn_Text = '从技能商店撤回技能';
				ele.btn_show = true;
			}
			if(ele.auditStatus == 'PENDING_APPROVAL') {
				ele.statuClass = 'pending_approval';
				ele.statuText = '审核中'
				ele.btn_show = false;
			}
			if(ele.auditStatus == 'REJECTED') {
				ele.statuClass = 'rejected';
				ele.statuText = '未通过'
				ele.btn_show = false;
			}
			if(ele.auditStatus == 'OFFLINE') {
				ele.statuClass = 'offline';
				ele.statuText = '已下线'
				ele.btn_show = false;
			}
		})
		
		$scope.$apply();
	}
	
	//通过引用的技能id列表查询技能列表
	var getMyHasSkillFunc = function(){
		if($rootScope.currentRobot.referencedApp.length > 0){
			var referencedSkillId = $rootScope.currentRobot.referencedApp.join(",");
			$.ajax({
				url: api_host_v2beta + 'skills/public',
				type: 'get',
				headers: {"Authorization" : "Bearer " + getCookie('accessToken')},
				//data:{"size": 100,"tag": productTag,"skillIds": "9c70c763-1b5e-455d-a49c-a10fabf6652d,a159b729-1dca-4df9-ae25-48d270de70ca"},
				data:{"size": 100,"tag": productTag,"skillIds": referencedSkillId},
				success: function(data) {
					data = dataParse(data);
					$scope.myHasSkillList = data.content;
					hasSkillCheckFunc($scope.myHasSkillList,$rootScope.currentRobot);//判断是否已经获取
					$scope.$apply();
				},
				error: function(data) {
					if(data.status == 401 || data.status == 403){
	            		goIndex();
	            	}
				}
			});
		}
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
	        "text": '<div class="my_own_down_div"><label class="down_web_label">是否确认移除该技能？</label>' + '<br>' + '<span class="down_web_span">移除之后，将失去该技能的功能！</span></div>',
	        "title": " ",
	        "ensureFn": function() {
		        	var skillId = $this.attr("data-skill-id");
		        	removeSkillFromBotFunc($scope.myHasSkillList,skillId,$rootScope.currentRobot,"remove");
		        	$scope.$apply();
	        }
		})
	});
	
}


























