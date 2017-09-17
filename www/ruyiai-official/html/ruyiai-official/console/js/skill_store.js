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
	putBotParaFunc(currentRobot);
}

//移除技能插件
var removeSkillFromBotFunc = function(skillList,skillId,currentRobot){
	skillList.forEach(function(skill,index,self){
		if(skill.id == skillId){
			skill.hasSkill = "no";
		}
	});
	var index = $.inArray(skillId, currentRobot.referencedApp);
	currentRobot.referencedApp.splice(index,1);
	putBotParaFunc(currentRobot);
}

//更新bot引用的app的属性
var putBotParaFunc = function(currentRobot){
	$.ajax({
		url : ruyiai_host + "/ruyi-ai/app/" + appId,
		data : JSON.stringify(currentRobot),
		traditional : true,
		headers : {
			"Content-Type" : "application/json"
		},
		method : "PUT",
		success : function(data) {
			if (data.code == 0) {
			} else if (data.code == 2) {
				goIndex();
			} else {
				if (data.msg) {
					$.trace(data.msg + "( " + data.detail + " )","error");
				}
			}
		}
	});
}








