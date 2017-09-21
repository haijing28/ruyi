function referenceAppCtrl($rootScope,$scope, $state, $stateParams){
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-robot-skill]").addClass("active");
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	}, 200);
	$('[data-toggle="popover"]').popover();

	$('body').on('click', '.my_store .top', function(e) {
		e = e || window.event;
		if(e.target.tagName == 'BUTTON') {
			return;
		}
		var $this = $(this);
		var skillId = $this.attr("data-skill-id");
		window.location.href = "#/skill_store/skill/" + skillId;
	});
}

//更新技能列表，判断是否已经获得
var hasSkillCheckFunc = function(skillList,currentRobot){
	skillList.forEach(function(openSkill,index,self){
		if($.inArray(openSkill.id, currentRobot.referencedApp) > -1){
			openSkill.hasSkill = "yes";
		}else{
			openSkill.hasSkill = "no";
		}
	});
}

var allReferenceAppSortFunc = function(referencedAppCurrent,fn){
	var referencedApp = [];
	$.getJSON("js/INTEL_STORY_ROBOT-skill-store.json", function(data) {
		var allApp = data;
		for(var i in allApp){
			if($.inArray(allApp[i].id, referencedAppCurrent) > -1){
				referencedApp.push(allApp[i].id);
				for(var j in referencedAppCurrent){
					if(referencedAppCurrent[j] == allApp[i].id){
						referencedAppCurrent.splice(j,1);
						break;
					}
				}
			}
		}
		for(var i in referencedAppCurrent){
			referencedApp.push(referencedAppCurrent[i]);
		}
		fn(referencedApp);
	});
	
//	var allReferenceApp = ["15de5ea2-4502-4f78-a49f-fcb04625ec3c", "02d8f0d7-9574-414d-a601-a1f8ad0e3b26", "a141a4d8-35a1-4190-bffa-e61079144df0", "d3268e7d-e317-4b34-9e06-4a833270bbd5", "0bcf3898-f105-4165-b1c0-96167b31c897", "43cd293f-c1e1-4664-89ff-3a7c188bda56", "3b1cfe4d-dc78-4b66-9d9b-a5c065ca5e50", "10756975-29f6-40dd-a77c-e5942f177360", "451074cb-7076-4c92-aa35-5c4ad1a870d1", "80e89fee-0a80-4a68-a76c-ff1c521d7293", "fb30e181-a97b-425a-a9f5-b6cbb546afa8", "ee2a04ac-b87c-46ba-9277-a2077c82e498", "d5c80071-1c19-4db9-814f-648c14b91e8e", "535c1b4e-0f01-4704-b325-dfad45db31cf", "dfd87e8d-5b93-4070-b11c-5ec5c6d78b33", "d2c33e92-1f29-4bee-8d95-1a579a960e94", "cfc4488b-5c0f-4315-9ff4-fadb75f05f01", "8f79e341-d659-48e5-a060-4db3357cec0a", "1ecb882e-92e7-4577-b848-52db8737fdbd", "341ceeb3-1995-4106-9eb6-2341c5dc9660","3a59359b-b40b-4581-be62-8112dbf5fb90", "6e3a8217-d07d-4cb8-803c-75e952bb521b", "6fc1c620-e31b-4ae5-a0e1-6709bb7029d9", "2013efe4-0f8e-423e-848c-be31f9f54396", "a6bc834d-a94e-44c2-9180-ab59ce423bfe", "bb8d6aec-8ac4-42f5-86bd-a8125addc8fe", "a03782f4-1427-4a5f-adb7-2a47533dfdcd", "52481364-d566-4d38-88be-5b593be5b57a", "c8031097-039f-4f0f-819b-464cb3b2df7f", "1cfc16c8-bf40-4aef-88d4-adb9da5c9a2c", "ce74ed7c-3935-4cef-a8b1-5c5f79ccd42d", "7e9b61b7-6dac-4005-83e0-ea2197372bf2", "d78a996b-0272-4337-ba58-6cddd00a7503"];
//	var referencedApp = [];
//	for(var i in allReferenceApp){
//		if($.inArray(allReferenceApp[i], referencedAppCurrent) > -1){
//			referencedApp.push(allReferenceApp[i]);
//			for(var j in referencedAppCurrent){
//				if(referencedAppCurrent[j] == allReferenceApp[i]){
//					referencedAppCurrent.splice(j,1);
//					break;
//				}
//			}
//		}
//	}
//	for(var i in referencedAppCurrent){
//		referencedApp.push(referencedAppCurrent[i]);
//	}
//	return referencedApp;
}


//增加技能插件
var addSkillToBotFunc = function(skillList,skillId,currentRobot){
	skillList.forEach(function(skill,index,self){
		if(skill.id == skillId){
			skill.hasSkill = "yes";
		}
	});
	if($.inArray(skillId, currentRobot.referencedApp) == -1){
		currentRobot.referencedApp.push(skillId);//TODO 需要按照推荐的顺序添加，不能单独添加
	}
	$.trace("已获取该技能","success");
	allReferenceAppSortFunc(currentRobot.referencedApp,function(referencedApp){
		currentRobot.referencedApp = referencedApp;
		putBotParaFunc(currentRobot);
	});
}

//移除技能插件
var removeSkillFromBotFunc = function(skillList,skillId,currentRobot,remove){
	skillList.forEach(function(skill,index,self){
		if(skill.id == skillId){
			if(remove && remove == "remove"){
				skillList.splice(index,1);
			}else{
				skill.hasSkill = "no";
			}
		}
	});
	var index = $.inArray(skillId, currentRobot.referencedApp);
	currentRobot.referencedApp.splice(index,1);
	putBotParaFunc(currentRobot);
}

//更新bot引用的app的属性
var putBotParaFunc = function(currentRobot){
	$.ajax({
		url : api_host_v2beta + "bots/" + getCookie("botId"),
		data : JSON.stringify({"skillIds": currentRobot.referencedApp}),
		traditional : true,
		headers : {
			"Content-Type" : "application/json",
			"Authorization" : "Bearer " + getCookie('accessToken')
		},
		method : "POST",
		success : function(data) {

		},error:function(data){
			if(data.status == 401 || data.status == 403){
        		goIndex();
        	}
		}
	});
}








