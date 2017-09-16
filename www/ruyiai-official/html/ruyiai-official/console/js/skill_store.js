function referenceAppCtrl($rootScope,$scope, $state, $stateParams){
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-robot-skill]").addClass("active");
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	}, 200);
	$('[data-toggle="popover"]').popover();

	$('body').on('click', '.top', function(e) {
		e = e || window.event;
		if(e.target.tagName == 'BUTTON') {
			return;
		}
		console.log(1)
		var i = window.location.href.lastIndexOf('/');
		var x = window.location.href.substr(0, i) + '/skill/1234';
		window.location.href = x;
	});
}

//更新技能列表，判断是否已经获得
var hasSkillCheckFunc = function(skillList,referencedApp){
	skillList.forEach(function(openSkill,index,self){
		if($.inArray(openSkill.id, referencedApp) > -1){
			openSkill.hasSkill = "yes";
		}else{
			openSkill.hasSkill = "no";
		}
	});
}

//增加技能插件
var addSkillToBotFunc = function(skillList,skillId,referencedApp){
	skillList.forEach(function(openSkill,index,self){
		if(openSkill.id == skillId){
			openSkill.hasSkill = "yes";
		}
	});
	if($.inArray(skillId, referencedApp) == -1){
		referencedApp.push(skillId);//TODO 需要按照推荐的顺序添加，不能单独添加
	}
}

//移除技能插件
var removeSkillFromBotFunc = function(skillList,skillId,referencedApp){
	skillList.forEach(function(openSkill,index,self){
		if(openSkill.id == skillId){
			openSkill.hasSkill = "no";
		}
	});
	var index = $.inArray(skillId, referencedApp);
	referencedApp.splice(index,1);
}








