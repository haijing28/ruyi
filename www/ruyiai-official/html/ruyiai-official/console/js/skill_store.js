function referenceAppCtrl($rootScope,$scope, $state, $stateParams){
	$(".list-group-item").removeClass("active");
//	$("[data-act=nav-robot-para]").addClass("active");
	$("[data-act=nav-robot-skill]").addClass("active");
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	}, 200);
	$('[data-toggle="popover"]').popover();
	
	// 点击消除徽章 chaos
	$('.nav-tabs li').on('click',function(){
		var $this = $(this);
		var $span = $this.find('span');
		if($span.length == 1){
			$span.text('');
		}
	})
	
	var initPageFunc = function(){
		$(".s-skill-box-nav").css("height",($(window).height()-192) + "px");
	}
	//已经引用的app
	$(window).resize(function() {
		initPageFunc();
	});
	initPageFunc();
	
	setTimeout(function(){
		$('#myCarousel').carousel({
			  interval: 5000,
			  pause:true
		 });
	}, 200);
	// chaos 成功添加功能时的提示函数
	$scope.alert = function(msg){
		$('#alert_msg').fadeOut(0);
		$('#alert_msg').fadeIn().find('.text').text(msg);
		setTimeout(function(){
			$('#alert_msg').fadeOut();
		},2000);
	}
	// chaos 用户是否自助排序过判断
	$scope.hasBeenChanged = function(){
		// 获取$scope.originSkills 原排序
		$(".entry-sort").trigger('click',['false']);
		// 获取$scope.currentSort 推荐排序
		$scope.recoverySort();
		for(var i = 0, len = $scope.originSkills.length; i < len; i++){
			// 用户修改过
			if($scope.originSkills[i].id != $scope.currentSort[i].id){
				return true;
			}
		}
		return false;
	}
	// chaos 添加删除功能函数
	$scope.handleRobotStatusFunc = function(robotId,appName,fn){

		$('body').on('fnCanBeUsed',function(){
			fn && fn();
			$('body').off('fnCanBeUsed')
		})

		var isExistflag = false;
		var index = 0;
		for(var i in $rootScope.currentRobot.referencedApp){
			if(robotId == $rootScope.currentRobot.referencedApp[i]){
				index = i;
				isExistflag = true;
				break;
			}
		}
		// chaos 获取
		if(!isExistflag){
			
			// chaos 若未改动，则执行 recoverySort 推荐排序
			if(!$scope.hasBeenChanged()){		
				$rootScope.currentRobot.referencedApp.push(robotId);
				updateAppInfoFunc($rootScope.currentRobot);
				$(".entry-sort").trigger('click',['false']);
				$scope.recoverySort();
				$scope.changeSort();
			}else{
				$rootScope.currentRobot.referencedApp.push(robotId);
				updateAppInfoFunc($rootScope.currentRobot);
			}
			$scope.alert('成功添加到我的技能里！');
			if(appName == '音乐知识图谱'){
				$('a.skillSettings').css('display','inline-block');
				$scope.getMusicSettings(robotId);
				// 本应在我的技能重新渲染完成之后 重新添加配置元素
				setTimeout(function(){
					var aSetting = document.createElement('a');
					aSetting.innerHTML = '';
					aSetting.classList.add('skillSettings');
					aSetting.classList.add('specialSettings');
					$('#robot-sortable li').each(function(index,ele){
						if($(this).find('h4').text() == '音乐知识图谱'){
							$(this).append(aSetting);
						}
					})
				},100);
			}
			$('body').trigger('fnCanBeUsed');
		}else{ // 移除时,保留默认数据
			$rootScope.currentRobot.referencedApp.splice(index,1);
			$rootScope.currentRobot.appSkillConfig = $scope.appSkillConfig;
					console.log($rootScope.currentRobot)
			console.log(111111111111111111111111111111111)
			updateAppInfoFunc($rootScope.currentRobot);
			if(appName == '音乐知识图谱'){
				var jsonData = {};
				jsonData['appId'] = robotId;
				jsonData['appSkillConfig'] = $scope.appSkillConfig;
				setTimeout(function(){
					$.ajax({
						url: ruyiai_host + "/ruyi-ai/app/"+appId,
						data: JSON.stringify(jsonData),
						traditional: true,
						headers: {"Content-Type" : "application/json"},
						method: "PUT",
						success: function(data){
						},
						error:function(err){
							console.log(err);
						}
					})
				},0)
			}
			$scope.$apply();
			$scope.alert('成功删除该技能');
			$('body').trigger('fnCanBeUsed');

			// $.confirm({
			// 	"text": '你确定要移除"'+ appName +'"吗？',
		 //        "title": "移除",
		 //        "ensureFn": function() {
		 //        	$rootScope.currentRobot.referencedApp.splice(index,1);
			// 		updateAppInfoFunc($rootScope.currentRobot);
			// 		$scope.$apply();
			// 		$scope.alert('成功删除该技能');
			// 		$('body').trigger('fnCanBeUsed');
		 //        }
			// });
		}
	}
	
	//将应用的领域服务排序
	function referenceAppOrderFunc(appDetail){
		var allReferenceApp = ["15de5ea2-4502-4f78-a49f-fcb04625ec3c", "02d8f0d7-9574-414d-a601-a1f8ad0e3b26", "a141a4d8-35a1-4190-bffa-e61079144df0", "d3268e7d-e317-4b34-9e06-4a833270bbd5", "0bcf3898-f105-4165-b1c0-96167b31c897", "43cd293f-c1e1-4664-89ff-3a7c188bda56", "3b1cfe4d-dc78-4b66-9d9b-a5c065ca5e50", "10756975-29f6-40dd-a77c-e5942f177360", "451074cb-7076-4c92-aa35-5c4ad1a870d1", "80e89fee-0a80-4a68-a76c-ff1c521d7293", "fb30e181-a97b-425a-a9f5-b6cbb546afa8", "ee2a04ac-b87c-46ba-9277-a2077c82e498", "d5c80071-1c19-4db9-814f-648c14b91e8e", "535c1b4e-0f01-4704-b325-dfad45db31cf", "dfd87e8d-5b93-4070-b11c-5ec5c6d78b33", "d2c33e92-1f29-4bee-8d95-1a579a960e94", "cfc4488b-5c0f-4315-9ff4-fadb75f05f01", "8f79e341-d659-48e5-a060-4db3357cec0a", "1ecb882e-92e7-4577-b848-52db8737fdbd", "341ceeb3-1995-4106-9eb6-2341c5dc9660","3a59359b-b40b-4581-be62-8112dbf5fb90", "6e3a8217-d07d-4cb8-803c-75e952bb521b", "6fc1c620-e31b-4ae5-a0e1-6709bb7029d9", "2013efe4-0f8e-423e-848c-be31f9f54396", "a6bc834d-a94e-44c2-9180-ab59ce423bfe", "bb8d6aec-8ac4-42f5-86bd-a8125addc8fe", "a03782f4-1427-4a5f-adb7-2a47533dfdcd", "52481364-d566-4d38-88be-5b593be5b57a", "c8031097-039f-4f0f-819b-464cb3b2df7f", "1cfc16c8-bf40-4aef-88d4-adb9da5c9a2c", "ce74ed7c-3935-4cef-a8b1-5c5f79ccd42d", "7e9b61b7-6dac-4005-83e0-ea2197372bf2", "d78a996b-0272-4337-ba58-6cddd00a7503"];
		var referencedApp = [];
		if(appDetail && appDetail.referencedApp && appDetail.referencedApp.length > 0){
			for(var i in allReferenceApp){
				if($.inArray(allReferenceApp[i], appDetail.referencedApp) > -1){
					referencedApp.push(allReferenceApp[i]);
				}
			}
		}
		appDetail.referencedApp = referencedApp;
		return appDetail;
	}
	
	//更新app信息
	var updateAppInfoFunc = function(appDetail){
		//将应用的领域服务排序
		//appDetail = referenceAppOrderFunc(appDetail);
		//更新已经获取的领域服务对象
		var data;
		console.log(appDetail)
		// if(appDetail.appName == '音乐知识图谱'){
		// 	appDetail.appSkillConfig = $scope.appSkillConfig;

		// 	console.log($scope.appSkillConfig +  '   111111111')
		// 	// !!!!!!!!!!!!
		// 	// appDetail.appSkillConfig.size = $('#settingSize').size
		// }
		data = JSON.stringify(appDetail);
		$scope.getCurrentReferencedAppFunc();
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/app/" + appDetail.id,
			data: data,
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			method: "PUT",
			success: function(data){
			}
		});
	}
	
	//移除app
	var removeRobotFunc = function(appIds){
		console.log('enter');
		for(var j in $scope.robotList){
			for(var i in appIds){
				if(appIds[i] == $scope.robotList[j].id){
					$scope.robotList.splice(j,1);
					console.log('delete')
				}
			}
		}
	}
	
	//移除只对艾如意宝宝开放的
	var removeNoactiveRobotFunc = function(){
		var robotList = [];
		for(var i in $scope.robotList){
			if(!$scope.robotList[i].status || $scope.robotList[i].status != "noactive"){
				robotList.push($scope.robotList[i]);
			}
		}
		$scope.robotList = robotList;
	}
	
	//测试环境，临时添加 上线需要去掉 chenxu
	// $rootScope.currentRobot.referencedApp = ["2013efe4-0f8e-423e-848c-be31f9f54396","a03782f4-1427-4a5f-adb7-2a47533dfdcd","6e3a8217-d07d-4cb8-803c-75e952bb521b","15de5ea2-4502-4f78-a49f-fcb04625ec3c","7e9b61b7-6dac-4005-83e0-ea2197372bf2"];


	var getSkillS= function(){

		var name = $rootScope.currentRobot.robotType + '';
		// if(name == "undefined" || name == undefined){
		// 	name = "COMMON";
		// }
		var json_url;
		if(name == 'INTEL_STORY_ROBOT'){
			json_url = 'js/INTEL_STORY_ROBOT-skill-store.json';
		}else{
			json_url = 'js/COMMON-skill-store.json';
		}
		// var json_url = 'js/' + name + '-skill-store.json';

		$.getJSON(json_url, function(data) {

			$scope.robotList = data;

			switch(name){
				case "COMMON":
					break;
				case "CHILD":
					break;
				case "INTEL_STORY_ROBOT":
					removeRobotFunc(["c0c96f7e-5fad-4d83-afc7-ff544bbad97d"]);
					removeRobotFunc(["0f5eb8c1-553b-44b3-92da-81120dc196d5"]);
					removeRobotFunc(["be077037-0529-437b-bd1c-5e48807a21bd"]);
					removeRobotFunc(["1cfc16c8-bf40-4aef-88d4-adb9da5c9a2c"]);
					removeRobotFunc(["d5c80071-1c19-4db9-814f-648c14b91e8e"]);
					removeRobotFunc(["567428a5-9f0e-4d99-88a1-28a04f6e75ee"]);
					removeRobotFunc(["30d93921-198b-45ac-bff4-bdad32992829"]);
					removeRobotFunc(["401427f2-7299-4225-98e9-b9515181c649"]);
					break;
				case "INTEL_CUSTOM_SERVICE":
					removeRobotFunc(["b6c86e82-852f-4e45-b2c0-6a40994f1a75"]);
					removeRobotFunc(["37b2f61f-8cff-4b63-a355-0c8287d5f1f2"]);
					removeRobotFunc(["3b1cfe4d-dc78-4b66-9d9b-a5c065ca5e50"]);
					break;
				case "INTEL_REFRIGERATOR":
					removeRobotFunc(["abd3e668-f984-4c38-ba75-73af7c5fbb9a"]);
					break;
				case "INTEL_ROBOT":
					break;
				case "INTEL_SPEAKER":
					removeRobotFunc(["b6c86e82-852f-4e45-b2c0-6a40994f1a75"]);
					removeRobotFunc(["37b2f61f-8cff-4b63-a355-0c8287d5f1f2"]);
					removeRobotFunc(["c0c96f7e-5fad-4d83-afc7-ff544bbad97d"]);
					break;
				case "SMART_HOME":
					removeRobotFunc(["abd3e668-f984-4c38-ba75-73af7c5fbb9a"]);
					break;
				case "SMART_TV":
					removeRobotFunc(["abd3e668-f984-4c38-ba75-73af7c5fbb9a"]);
					break;
			}

			console.log(name)

			console.log(json_url)


			if(appId != "3a59359b-b40b-4581-be62-8112dbf5fb90"){ //只有有声资源的机器人能用
				removeRobotFunc(["00a602f9-a813-4102-80bb-0231d3da4ccf"]);
			}
			//如果不是艾如意宝宝，则移除未开放的robot
			if(appId != "f64dba56-66c2-46fe-ad44-08da7d2689f3"){
				removeNoactiveRobotFunc();
			}
			//如果不是新华社，则移除 新华社百科
			if(appId != "0dda44ee-cab8-49b7-bc02-b9e90d32c20e"){
				removeRobotFunc(["cd1fab85-dc0a-430a-8a5c-a1516e9ea51e"]);
			}
			$scope.$apply();
			$scope.getCurrentReferencedAppFunc();

		})
	}

	setTimeout(function(){
		getSkillS();
	},500);

	$("body").off("click","[data-act=data-my-skill]").on("click","[data-act=data-my-skill]",function(event){
		var $this = $(this);
		var robotId = $this.attr("data-id");
		$scope.goRobotDetail(robotId);
	});
	
	// 每次都初始化技能数量数据 chaos
	$scope.allCheckedNum = 0;
	$('[data-act="skill-store"]').on('click',function(){
		$scope.allCheckedNum = $scope.referencedAppObj.length;
	})
	//勾中数据
	//发送配置请求
	$scope.ensureSettings =function(){
		var size = $('#settingSize').val();
		var xiami = $('#xiami:checked').val();
		var cloudMusic = $('#cloudMusic:checked').val();
		var dataSource = '';
		//   方式不好
		if(xiami == undefined && cloudMusic !== undefined){
			dataSource = cloudMusic;
		}else if(xiami !== undefined && cloudMusic == undefined){
			dataSource = xiami;
		}else if(xiami !== undefined && cloudMusic !== undefined){
			dataSource = xiami + ';' + cloudMusic;
		}
		if(size > 20 || size <= 0){
			$.trace('请输入1-20之间的数值');
			return;
		}
		var  skillData = {size: size, dataSource: dataSource};
		// robotid mei'yo
		var robotId = $scope.musicID + '';
		var appSkillConfig = {};
		appSkillConfig[robotId] =  skillData;

		$rootScope.currentRobot.appSkillConfig = appSkillConfig;

		var jsonData = {};
		jsonData['appId'] = robotId;
		jsonData['appSkillConfig'] = appSkillConfig;

		$.ajax({
			url: ruyiai_host + "/ruyi-ai/app/"+appId,
			data: JSON.stringify(jsonData),
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			method: "PUT",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					$('#mySettingsModal').modal('hide');
					$scope.appSkillConfig = appSkillConfig;
				}
			},
			error:function(err){
				console.log(err);
			}
		})
	}
	// 点击配置时获取配置信息
	$scope.getMusicSettings = function(robotId){
		$scope.musicID = robotId;
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/app/" + appId,
			method: 'GET',
			success: function(data){
				var data = data.result;
				var size = 20;
				var dataSource = 'www.xiami.com';
				console.log(data.appSkillConfig[robotId])
				if(data.appSkillConfig[robotId]){
					size = data.appSkillConfig[robotId].size;
					dataSource = data.appSkillConfig[robotId].dataSource;
					$scope.appSkillConfig = data.appSkillConfig;
					// 第一次执行
				}else{
					var  skillData = {size: size, dataSource: dataSource};
					var appSkillConfig = {};
					appSkillConfig[robotId] =  skillData;
					var jsonData = {};
					jsonData['appId'] = robotId;
					jsonData['appSkillConfig'] = appSkillConfig;
					$.ajax({
						url: ruyiai_host + "/ruyi-ai/app/"+appId,
						data: JSON.stringify(jsonData),
						traditional: true,
						headers: {"Content-Type" : "application/json"},
						method: "PUT",
						success: function(data){
						},
						error:function(err){
							console.log(err);
						}
					})
				}
				if(dataSource.indexOf('www.xiami.com') != -1){
					$('#xiami').prop('checked',true);
				}else{
					$('#xiami').prop('checked',false);
				}
				if(dataSource.indexOf('music.163.com') != -1){
					$('#cloudMusic').prop('checked',true);
				}else{
					$('#cloudMusic').prop('checked',false);
				}
				$('#settingSize').val(size);
			},
			error:function(err){
				console.log(err);
			}
		})
		$('#mySettingsModal').modal({
			keyboard: true,
			backdrop: true,
		})
	}
	// 点击配置时获取配置信息
	$scope.getMusicSettings = function(robotId){
		$scope.musicID = robotId;
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/app/" + appId,
			method: 'GET',
			success: function(data){
				var data = data.result;
				var size = 20;
				var dataSource = 'www.xiami.com';
				console.log(data.appSkillConfig[robotId])
				if(data.appSkillConfig[robotId]){
					size = data.appSkillConfig[robotId].size;
					dataSource = data.appSkillConfig[robotId].dataSource;
					$scope.appSkillConfig = data.appSkillConfig;
					// 第一次执行
				}else{
					var  skillData = {size: size, dataSource: dataSource};
					var appSkillConfig = {};
					appSkillConfig[robotId] =  skillData;
					var jsonData = {};
					jsonData['appId'] = robotId;
					jsonData['appSkillConfig'] = appSkillConfig;
					$.ajax({
						url: ruyiai_host + "/ruyi-ai/app/"+appId,
						data: JSON.stringify(jsonData),
						traditional: true,
						headers: {"Content-Type" : "application/json"},
						method: "PUT",
						success: function(data){
						},
						error:function(err){
							console.log(err);
						}
					})
				}
				if(dataSource.indexOf('www.xiami.com') != -1){
					$('#xiami').prop('checked',true);
				}else{
					$('#xiami').prop('checked',false);
				}
				if(dataSource.indexOf('music.163.com') != -1){
					$('#cloudMusic').prop('checked',true);
				}else{
					$('#cloudMusic').prop('checked',false);
				}
				$('#settingSize').val(size);
			},
			error:function(err){
				console.log(err);
			}
		})
		$('#mySettingsModal').modal({
			keyboard: true,
			backdrop: true,
		})
	}
	// 设置modal默认值
	$scope.modal = {name: '',size: '20',robotId: ''};
	//查看娱乐推送详情 chaos
	$scope.goRobotDetail = function(robotId,e){

		$scope.musicID = robotId;
		// 获取点击目标
		var target = e.target;
		// // 判断是否点击了配置按钮
		if(target.className.indexOf('skillSettings') != -1){
			$scope.modal.robotId = robotId;
			 // 获取音乐技能的ID			
			$scope.getMusicSettings(robotId);
			return;
		}
		// 判断是否点击复选框 
		if(target.className.indexOf('s-skill') != -1 && e.target.tagName == 'P'){
			$scope.allCheckedNum = $scope.referencedAppObj.length;
			//判断是否是音乐知识图谱，是则显示配置按钮
			var appName = $(target).parent().find('.s-skill-item-title').text();
			$scope.handleRobotStatusFunc(robotId,appName,function(){
				if($(target).hasClass('s-skill-checked')){
					$scope.allCheckedNum -=1;
					$(target).css('display:none');
					$(target).find('p').css('display:block');
					if(appName == '音乐知识图谱'){
						$('a.skillSettings').css('display','none');
					}
				}else{
					$scope.allCheckedNum +=1;
					$(target).css('display:none');
					$(target).find('p').css('display:block');
				}
				var li = $(target).parents('li');
				if($(li).attr('data-act') != 'data-my-skill'){
					$('.nav-tabs .badge').text($scope.allCheckedNum);
				}
			});
			return;
		}
		var robotDetail = {};
		for(var i in $scope.robotList){
			if($scope.robotList[i].id == robotId){
				robotDetail = $scope.robotList[i];
				break;
			}
		}
		$("[data-act=skill-store]").removeClass("active");
		$("[data-act=my-skill]").removeClass("active");
		$("#skill-store").removeClass("active in");
		$("#my-skill").removeClass("active in");
		$("[data-act=skill-detail]").css("display","block");
		$("[data-act=skill-detail]").addClass("active");
		$("#skill-detail").addClass("active in");
		$(".para-action-tips").css("display","none");
		$scope.robotDetail = robotDetail;
		$scope.$apply();
	}
	
	$("body").off("click","[data-act=my-skill],[data-act=skill-store]").on("click","[data-act=my-skill],[data-act=skill-store]",function(event){
		$('.change-option').find('li').each(function(index, ele){
//			if($(ele).hasClass('active')) {
//				$(ele).find('a').css('border-bottom', 'none');
//			}
		});
		var $this = $(this);
		$("[data-act=skill-detail]").css("display","none");
	});
	
	//我引用的系统助理排序
//	$( "#robot-sortable" ).sortable({ stop: function(event, ui) {
//		var referencedAppTemp = [];
//		var $referencedAppLi = $("#robot-sortable li");
//		$.each($referencedAppLi, function(i, referencedAppLi) {
//			var $referencedAppLi = $(referencedAppLi);
//			var robotId = $referencedAppLi.attr("data-id");
//			if(robotId && robotId != "undefined"){
//				referencedAppTemp.push(robotId);
//			}
//		});
//		$rootScope.currentRobot.referencedApp = referencedAppTemp;
//		$scope.getCurrentReferencedAppFunc();
//		updateAppInfoFunc($rootScope.currentRobot);
//		$scope.$apply();
//    } });
//	$( "#robot-sortable" ).disableSelection();
	
	//获取当前选中的领域服务机器人
	$scope.getCurrentReferencedAppFunc = function(){
		$scope.referencedAppObj = [];
		for(var i in $rootScope.currentRobot.referencedApp){
			for(var j in $scope.robotList){
				if($rootScope.currentRobot.referencedApp[i] ==  $scope.robotList[j].id){
					$scope.referencedAppObj.push($scope.robotList[j]);
					break;
				}
			}
		}
		$scope.$apply();
	}
	// chaos 获取当前技能的默认排序
	$scope.recoverySort = function(){
		var skillsQuantity = $scope.recommendSkills.length;
		$scope.currentSort = [];
		for(var i=0;i<skillsQuantity;i++){
			if($.inArray($scope.recommendSkillName[i],$scope.mySkillName) > -1){
				$scope.currentSort.push($scope.recommendSkills[i]);
			}
		}
		if($scope.currentSort.length > 0){
			$scope.mySkills = [];
			$($scope.currentSort).each(function(index,ele){
				$scope.mySkills.push(ele);
			})
		}
	}
	
	$(window).resize(function() {
		setLookLogJsonFunc();
	});
	
	//设置查看json模态框的高度
	function setLookLogJsonFunc(){
		$("#skillSortModal .select-sort-list").css("max-height",(window.innerHeight - 184) + "px");
		$("#skillSortModal .recommend-sort-list").css("max-height",(window.innerHeight - 184) + "px");
	}
	//点击进入技能排序模式 chaos 进入时获取当前技能的用户排序 tag 为假时不显示modal
	$scope.originSkills = [];
	$(".entry-sort").on('click',function(event,tag){
		var event = window.event;
		var tag = tag || true;
		if(tag != 'false'){
			$("#skillSortModal").modal("show");
		}
		setLookLogJsonFunc();
		$scope.mySkills = [];
		$scope.recommendSkills = [];
		$scope.mySkillName = [];
		$scope.recommendSkillName = [];
		
		$($scope.referencedAppObj).each(function(index,ele){
			$scope.mySkills.push(ele);
			$scope.mySkillName.push(ele.appName);
		})
		$($scope.robotList).each(function(index,ele){
			$scope.recommendSkills.push(ele);
			$scope.recommendSkillName.push(ele.appName);
		})
		$scope.originSkills = $scope.mySkills;
		$scope.$apply();
		// chaos 若是tag为假不显示modal，则在背后执行确认函数
		if(!tag){
			$scope.changeSort(false);
		}
	});
	
	//点击保存当前技能顺序
	$scope.changeSort = function(tag){
		var tag = tag || true;
		$scope.referencedAppObj = [];
		var referencedIds = [];
		$($scope.mySkills).each(function(index,ele){
			$scope.referencedAppObj.push(ele);
			referencedIds.push(ele.id);
		})
		$("#skillSortModal").modal("hide");
		$rootScope.currentRobot.referencedApp = referencedIds;
		updateAppInfoFunc($rootScope.currentRobot);
		if(!tag){
			$scope.alert('您的更改已保存');
		}
	}
	
	function checkTel(telephone){  
	    var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;  
	    var isMob=/^((\+?86)|(\+86))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;  
	    if(isMob.test(telephone)||isPhone.test(telephone)){  
	        return true;  
	    }else{  
	        return false;  
	    }  
	} 
	
	$("body").off("click",".skill-create-submit").on("click",".skill-create-submit",function(event){
		var $this = $(this);
		var $plugin_name = $("#plugin-name");
		var $hope_feature = $("#hope-feature");
		var $data_resource = $("#data-resource");
		var $target_user = $("#target-user");
		var $user_name = $("#user-name");
		var $user_telephone = $("#user-telephone");
		var $user_company = $("#user-company");
		if($.trim($plugin_name.val()).length == 0){
			$.trace("请填写插件名称");
			$plugin_name.focus();
			return false;
		}else if($.trim($hope_feature.val()).length == 0){
			$.trace("请填写您期望的功能");
			$hope_feature.focus();
			return false;
		}else if($.trim($data_resource.val()).length == 0){
			$.trace("请填写数据资源");
			$data_resource.focus();
			return false;
		}else if($.trim($target_user.val()).length == 0){
			$.trace("请填写目标用户");
			$target_user.focus();
			return false;
		}else if($.trim($user_name.val()).length == 0){
			$.trace("请填写姓名");
			$user_name.focus();
			return false;
		}else if($.trim($user_telephone.val()).length == 0){
			$.trace("请填写联系电话");
			$user_telephone.focus();
			return false;
		}
//		else if(!checkTel($user_telephone.val())){
//			$.trace("请填写正确的电话号码");
//			$user_telephone.focus();
//		}
		else if($.trim($user_company.val()).length == 0){
			$.trace("请填写单位名称");
			$user_company.focus();
			return false;
		}
		var apiUrl = ruyiai_host + "/ruyi-ai/item/insert/";
//		if(isproductDomain){
//			apiUrl = "http://ruyi.ai/ruyi-ai/item/insert/";
//		}
		$.ajax({
		    url : apiUrl,
		    method : "post",
		    data: JSON.stringify({
					"appId":"SYSTEM_USER_ID",
					"ownerAppId":appId,
					"userId":getCookie("userId"),
					"type":"createSkillPlugin",
					"pluginName":$plugin_name.val(), 
					"hopeFeature":$hope_feature.val(),
					"dataResource":$data_resource.val(),
					"targetUser":$target_user.val(),
					"userName":$user_name.val(),
					"userTelephone":$user_telephone.val(),
					"userCompany":$user_company.val()
			  }), 
		    success: function(data) {
			    	
					data = dataParse(data);
					if(data.code == 0){
						$(".skill-create-detail-form").css("display","none");
						$(".skill-create-detail.contact").css("display","none");
						$(".skill-create-apply-success").css("display","block");
					}
			  }
		});
	});
	
	//根据cookie中checked-skill-type的值，初始胡选中哪一个
	var checked_skill_type = getCookie("checked-skill-type");
	if(checked_skill_type == "my-skill"){
		$(".change-option [data-act=my-skill]").addClass("active").siblings("li").removeClass("active");
		$("#myTabContent #my-skill").addClass("active in").siblings().removeClass("active in");
	}else if(checked_skill_type == "skill-store" || checked_skill_type == "skill-detail" || !checked_skill_type){
		$(".change-option [data-act=skill-store]").addClass("active").siblings("li").removeClass("active");
		$("#myTabContent #skill-store").addClass("active in").siblings().removeClass("active in");
	}else if(checked_skill_type == "skill-create"){
		$(".change-option [data-act=skill-create]").addClass("active").siblings("li").removeClass("active");
		$("#myTabContent #skill-create").addClass("active in").siblings().removeClass("active in");
	}
	
	$("body").off("click",".change-option li").on("click",".change-option li",function(event){
		var $this = $(this);
		var dataAct = $this.attr("data-act");
		setCookie("checked-skill-type",dataAct);
	});

	var judge = function(){
		var t = setInterval(function(){
			if($('.skillSettings').length == 1){
				clearInterval(t);
			}else{
				var aSetting = [];
				var i = 0;
				$('li.s-skill-item').each(function(index,ele){
					var appName = $(this).find('.s-skill-item-title').text();
					var isChecked = $(this).find('p.s-skill-checked').hasClass('ng-hide') ? false : true;
					if(appName == '音乐知识图谱'){
						aSetting[i] = document.createElement('a');
						aSetting[i].innerHTML = '';
						aSetting[i].classList.add('skillSettings');
						$(this).append(aSetting[i]);
						i++;
						if(!isChecked){
							$(this).find('.skillSettings').css('display','none');
						}
						if($(this).parent('ul').attr('id') == 'robot-sortable'){
							$(this).find('.skillSettings').addClass('specialSettings')
						}
						// i = 1 引导界面 i = 2 技能扩展界面
						if(i == 2 || i == 1){
							$(this).remove(aSetting[i - 1]);
						}
					}
					// 提高性能
					if(i >= 3){
						return;
					}
				})
			}
		},500);
	}

	setTimeout(judge,0)
}

