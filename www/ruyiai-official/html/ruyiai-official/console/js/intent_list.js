
function intentListCtrl($rootScope,$scope, $state, $stateParams){
	// 场景开关
	$('[data-toggle="toggle"]').bootstrapToggle({
		size: 'mini',
		on: '',
	    off: ''
	});
	// end
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-scenario]").addClass("active");
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip(); //初始化提示
		$("[data-act=nav-scenario-"+ $stateParams.scenes_id +"]").addClass("active");
	}, 200);
	$scope.pageSize = 12;//意图页面，每页的数量
	$scope.searchIntentWords = "";//搜索意图
	
	$scope.isCreateSuccess = true;
	$scope.currentScenesId = $stateParams.scenes_id;
	
	/***新手向导开始***/
	//判断如果是新用户进入此页面，则进行引导
	function newUserGuideFunc(){
		if("isNewUser" == getCookie("app"+appId) && getCookie("isOldUser") != "true" && window.location.href.indexOf("intent_detail") > -1){
			$("[data-act=new-user-guide-box]").css("display","block");
			$(".action-tips").css({
				"top":$(".left-addScenario").offset().top - $(".scenario-box").height() - 26 + "px",
				"left":$(".left-addScenario").offset().left - $(".action-tips").width()/2 -10 + "px"
			});
		}
	}
	//设置新手向导提示框的初始位置
	
	function skip(){
		$(".new-user-box").hide();
		$(".new-user-main").hide();
		$(".new-user-foot").hide();
		$(".action-tips").hide();
		guideId = 1;
		delCookie("app" + appId);
	}
	
	var guideId = 1;	//用于判断当前为引导的第几步的参数
	//下一步引导
	$("body").off("click",".new-user-next").on("click",".new-user-next",function($event){
		if(guideId < 5){
			guideId ++;
		}
		switch(true){
			case guideId == 1:
				$(".action-tips p").text("创建场景“打招呼”");
				$(".action-tips").css({
					"top":$(".left-addScenario").offset().top - $(".scenario-box").height() - 26 + "px",
					"left":$(".left-addScenario").offset().left - $(".action-tips").width()/2 -6 + "px"
				});
				$(".new-user-under-arrow").css("top","45px");
				break;
			case guideId == 2:
				$(".action-tips p").text("创建意图“寒暄”");
				$(".action-tips").css({
					"left": 300,
					"top": 100
				});
				$(".new-user-under-arrow").css("top","45px");
				break;
			case guideId == 3:
				var userSay = $(".user-say-templates").find(".list-group-item");
				$(".action-tips p").text("填写用户说，例如：“hi”");
				$(".action-tips").css({
					"left":userSay.offset().left + 70,
					"top":userSay.offset().top - userSay.height() - 20
				})
				$(".new-user-under-arrow").css("top","45px");
				break;
			case guideId == 4:
				var response = $("[data-act=robot-answer-text]");
				$(".action-tips p").html("在机器人答里填写“hello！”" + "<br>" + "最后别忘了保存哦！");
				$(".action-tips").css({
					"left":$(response).offset().left + 70,
					"top":$(response).offset().top - $(response).height()
				})
				$(".new-user-under-arrow").css("top","69px");
				break;
			case guideId == 5:
				$(".action-tips p").html('点这里，试试你刚才写的问答！<br>更多新手教程，<a href="http://docs.ruyi.ai/344948" target="_black" style="text-decoration: underline;">点击这里</a>' );
				$(".action-tips").css({
					"left":"2%",
					"top":$(".new-user-foot").offset().top - $(".new-user-foot").height() + 20
				})
				$(".new-user-under-arrow").css("top","69px");
				$(".new-user-prev").hide();
				$(".new-user-next").hide();
				$(".new-user-complete").show().css("margin-left","12%");
				$(".new-user-next").text("完成");
				break;
			default:;
		}
		for(var i=1;i<guideId;i++){
			$($(".new-user-box").find("li")[i]).css({
				"background-color": "#191e24",
				"color": "#fff"
			})
		}
		$($(".new-user-box").find("li")[guideId]).children("i").attr("class","cave-arrow");
	})
	
	//上一步引导
	$("body").off("click",".new-user-prev").on("click",".new-user-prev",function($event){
		if(guideId > 1){
			guideId --;
		}
		switch(true){
		case guideId == 1:
			$(".action-tips p").text("创建场景“打招呼”");
			$(".action-tips").css({
				"top":$(".left-addScenario").offset().top - $(".scenario-box").height() - 22 + "px",
				"left":$(".left-addScenario").offset().left - $(".action-tips").width()/2 -8 + "px"
			});
			$(".new-user-under-arrow").css("top","45px");
			break;
		case guideId == 2:
			$(".action-tips p").text("创建意图“寒暄”");
			$(".action-tips").css({
				"left": 300,
				"top": 100
			});
			$(".new-user-under-arrow").css("top","45px");
			break;
		case guideId == 3:
			var userSay = $(".user-say-templates").find(".list-group-item");
			$(".action-tips p").text("填写用户说，例如：“hi”");
			$(".action-tips").css({
				"left":userSay.offset().left + 70,
				"top":userSay.offset().top - userSay.height() - 20
			})
			$(".new-user-under-arrow").css("top","45px");
			break;
		case guideId == 4:
			var response = $("[data-act=robot-answer-text]");
			$(".action-tips p").html("在机器人答里填写“hello！”" + "<br>" + "最后别忘了保存哦！");
			$(".action-tips").css({
				"left":$(response).offset().left + 70,
				"top":$(response).offset().top - $(response).height()
			})
			$(".new-user-under-arrow").css("top","69px");
			break;
			default:;
		}
		$($(".new-user-box").find("li")[guideId]).css({
			"background-color": "#fff",
			"color": "#000"
		});
		$($(".new-user-box").find("li")[guideId+1]).children("i").attr("class","tips-arrow");
	})
	
	//点击跳出，结束向导
	$("body").off("click",".new-user-skip").on("click",".new-user-skip",function($event){
		skip();
	})
	
	
	//点击完成，结束向导
	$("body").off("click",".new-user-complete").on("click",".new-user-complete",function($event){
		skip();
	})
	/***新手向导结束***/
	
	//设置意图列表页面，放置的意图数
	var setIntentListCountFunc = function(){
		var windowHeight = $(window).height();
		$scope.pageSize = parseInt((windowHeight - 190)/40);
		if($scope.setPagingCountFunc){
			$scope.setPagingCountFunc();
		}
	}
	setIntentListCountFunc();
	
	$(window).resize(function() {
		setIntentListCountFunc();
	});
	//查询意图详情
	$scope.goIntentDetail = function(scenarioId,intent_id,event){
		$("[data-act=nav-scenario-"+ scenarioId +"]").addClass("active");
		//$("[data-act=nav-intent-"+ intent_id +"]").siblings().removeClass("active");
		//$("[data-act=nav-intent-"+ intent_id +"]").addClass("active");
		if (event && $(event.target).is('.btn-intent')) {
		    return;
		}
		if(dataEditedFlag) {
			$.confirm_save({
				"text": "你的修改未保存，确定要离开意图详情页面吗？",
		        "title": "系统提示",
		        "ensureFn": function() {
		        	dataEditedFlag = false;
		        	if(!$("[data-act=confirmShow]").css("display")){
		        		if($scope.scenario && $scope.scenario.scenarioType == "SYSTEMACTION"){
		    				var center = '';
							switch(event.target.innerText){
								case '订阅欢迎语':
									center = '/intent_welcome_detail/';
									break;
								case '却省回复':
									center = '/intent_lost_detail/';
									break;
								case '超时回复':
									center = '/intent_timeout_detail/';
									break;
								case '重复多轮回复':
									center = '/intent_repeat_detail/';
									break;
							}
							window.location.href = "#/intent_list/" + scenarioId + center + intent_id;
		    			}else{
		    				window.location.href = "#/intent_list/" + scenarioId + "/intent_detail/" + intent_id;
		    			}
		    		}
		        },
		        "saveFn": function() {
					$(".save-and-apply").trigger("click");
					dataEditedFlag = false;
					setTimeout(function(){
						if(!$("[data-act=confirmShow]").css("display")){
							window.location.href = "#/intent_list/" +scenarioId+ "/intent_detail/" + intent_id;
						}
					}, 200);
		        }
			});
		}
		if(dataEditedFlag) {
			return;
		}
		if(!$("[data-act=confirmShow]").css("display")){
    		if($scope.scenario && $scope.scenario.scenarioType == "SYSTEMACTION"){
    			var center = '';
				switch(event.target.innerText){
					case '订阅欢迎语':
						center = '/intent_welcome_detail/';
						break;
					case '缺省回复':
						center = '/intent_lost_detail/';
						break;
					case '超时回复':
						center = '/intent_timeout_detail/';
						break;
					case '重复多轮回复':
						center = '/intent_repeat_detail/';
						break;
					default: 
						center = '/intent_welcome_detail/';
				}
				console.log(center)
				window.location.href = "#/intent_list/" +scenarioId+ center + intent_id;
			}else{
				window.location.href = "#/intent_list/" +scenarioId+ "/intent_detail/" + intent_id;
				// 导向自己的页面     !!!!!!!!!!!!!!!
			}
		}
//		$scope.getIntentListFunc(0, $scope.pageSize, "", intent_id);
		$scope.searchIntentWords = "";
	}
	//点击+号创建意图
	$scope.createIntentFunc = function(){
		if($stateParams.scenes_id == -1){
			$.trace("请先创建场景");
			return false;
		}else{
			if(dataEditedFlag) {
				$.confirm_save({
					"text": "你的修改未保存，确定要离开意图详情页面吗？",
			        "title": "系统提示",
			        "ensureFn": function() {
			        	dataEditedFlag = false;
			        	if(!$("[data-act=confirmShow]").css("display")){
			        		window.location.href = "#/intent_list/" +$stateParams.scenes_id+ "/intent_detail/-1";
			    		}
			        },
			        "saveFn": function() {
						$(".save-and-apply").trigger("click");
						dataEditedFlag = false;
						setTimeout(function(){
							if(!$("[data-act=confirmShow]").css("display")){
								window.location.href = "#/intent_list/" +$stateParams.scenes_id+ "/intent_detail/-1";
							}
						}, 200);
			        }
				});
			}
			if(dataEditedFlag) {
				return;
			}
			window.location.href = "#/intent_list/" +$stateParams.scenes_id+ "/intent_detail/-1";
		}
	}
	//获取场景详情
	$scope.getScenarioFunc = function(){
		var scenarioList = angular.element("#api-manager-box").scope().scenarioList;
		if(!scenarioList){
			setTimeout(function(){
				$scope.getScenarioFunc();
				$scope.$apply();
			}, 600);
		}else{
			for(var i in scenarioList){
				if($stateParams.scenes_id == scenarioList[i].id){
					$scope.scenario = scenarioList[i];
					break;
				}
			}
		}
		var isAbled = localStorage.isAbled;
		if(isAbled == 'true' || isAbled == undefined){
			$('.toggle.btn').removeClass('btn-default').removeClass('off').addClass('btn-primary');
			$('#sceneBtn').prop('checked',true);
		}else{
			$('.toggle.btn').removeClass('btn-primary').addClass('btn-default').addClass('off');
			$('#sceneBtn').prop('checked',false);
		}
	}
	$scope.getScenarioFunc();
	//添加场景
	$scope.addScenarioFunc = function(scenario_title){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+ appId +"/scenario",
			data:JSON.stringify({"name":scenario_title}),
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			method: "POST",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					callAgentReloadTestFunc(); //通知nlp reload
					$scope.scenario = data.result;
					var scenarioList = angular.element("#api-manager-box").scope().scenarioList;
					if(!scenarioList){
						scenarioList = new Array();
					}
					scenarioList.push($scope.scenario);
					angular.element("#api-manager-box").scope().scenarioList = scenarioList;
					$scope.$apply();
					setTimeout(function(){
						$(".center-list-title input").select();
						$(".center-list-title input").focus();
					}, 300);
					window.location.href = "#/intent_list/" + $scope.scenario.id;
					$.trace("场景创建成功","success");
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg.indexOf("already exists") > -1){
						createScenarioCommonFunc();
					}else{
						if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
					}
				}
			}
		});
	};
	//修改场景
	$scope.updateScenarioFunc = function(scenario_title){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+appId+"/scenario/" + $scope.scenario.id,
			data:JSON.stringify({"name":scenario_title}),
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			method: "PUT",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					callAgentReloadTestFunc(); //通知nlp reload
					$scope.scenario = data.result;
					var scenarioList = angular.element("#api-manager-box").scope().scenarioList;
					for(var i in scenarioList){
						if(scenarioList[i].id == $scope.scenario.id){
							scenarioList[i].name = $scope.scenario.name;
							console.log(scenarioList)
						}
					}
					angular.element("#api-manager-box").scope().scenarioList = scenarioList;
					$scope.$apply();
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	};	
	
	//编辑场景
	$scope.editScenarioFunc = function(scenario_title){
		if(scenario_title && $.trim(scenario_title).length > 0){
			if($scope.scenario && $scope.scenario.id && $scope.scenario.id.length > 0){
				$scope.updateScenarioFunc(scenario_title);
			}else{
				$scope.addScenarioFunc(scenario_title);
			}
		}
	}
	
	//回车创建，修改场景
	$scope.editScenarioKeydownFunc = function($event,scenario_title){
		if($event.keyCode == 13){
			$("#scenario-name-temp").focus();
		}
	}
	
	//查询意图列表
	$scope.getIntentListFunc = function(startSize, pageSize, keywords,intent_id){
		var sortkey = getCookie("sortkey");
		if(!keywords){
			keywords = "";
		}
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+ appId + "/"+ $stateParams.scenes_id +"/intents",
			data:{"start":startSize, "limit":pageSize, "keywords": keywords, "sortkey": sortkey},
			method: "GET",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					$scope.intentList = data.result;
					if($scope.intentList && $scope.intentList.length > 0){
						if(window.location.href.indexOf("intent_list") != -1 && window.location.href.indexOf("intent_detail") == -1){
							// 针对系统动作
							if($scope.scenario && $scope.scenario.scenarioType == "SYSTEMACTION"){
								window.location.href = "#/intent_list/" + $stateParams.scenes_id + "/intent_welcome_detail/" + $scope.intentList[0].id;
							}else{
								window.location.href = "#/intent_list/"+ $stateParams.scenes_id + "/intent_detail/" + $scope.intentList[0].id;
							}
						}
					}else{
						$("[data-act=intent-tips]").css("display","block");
						$("[data-act=intent-detail-tips]").css("display","block");
					}
					for(var j in $scope.intentList){
						var errorModelStr = "";
						if($scope.intentList[j].errorModels){
							var index = 1;
							for(var i in $scope.intentList[j].errorModels){
								index = parseInt(i) + 1;
								if($scope.intentList[j].errorModels[i].code && $scope.intentList[j].errorModels[i].code.substring(0,1) == "0"){
									errorModelStr+="<div style='color:#ee524f;max-height:300px;overflow: hidden;overflow-y:auto;'>"+ index + "." + $scope.intentList[j].errorModels[i].detail +"</div>";
								}else if($scope.intentList[j].errorModels[i].code && $scope.intentList[j].errorModels[i].code.substring(0,1) == "1"){
									errorModelStr+="<div style='color:#ffb64c;max-height:300px;overflow: hidden;overflow-y:auto;'>"+ index + "." + $scope.intentList[j].errorModels[i].detail +"</div>";
								}
							}
							$scope.intentList[j].errorModelStr = errorModelStr;
						}
					}
					$scope.$apply();
					setTimeout(function(){
						$('[data-toggle="popover"]').popover();
					}, 500);
					$("[data-act=nav-intent-"+ intent_id +"]").siblings().removeClass("active");
					$("[data-act=nav-intent-"+ intent_id +"]").addClass("active");
					newUserGuideFunc();
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
					if(data.code == 1001){
						window.location.href = static_host + "/console/api_manager.html";
					}
				}
			}
		});
	};
	
	var scenarioIndex = 0;
	if(angular.element("#api-manager-box").scope().scenarioList){
		scenarioIndex = angular.element("#api-manager-box").scope().scenarioList.length;
	}
	
	//创建意图
	var createScenarioCommonFunc = function(){
		scenarioIndex+=1;
		$scope.intentList = new Array();
		$scope.scenes_title = "未命名场景" + scenarioIndex;
		$scope.addScenarioFunc("未命名场景" + scenarioIndex);
	}
	
	//点击+号创建场景
	if($stateParams.scenes_id == -1){
		createScenarioCommonFunc();
	}else{
		$scope.getIntentListFunc(0, $scope.pageSize);
	}
	
	//意图列表过滤
	$scope.intentListFilter = function(intent){
		if(!$scope.searchIntentWords || $scope.searchIntentWords.length ==0 ){
			return true;
		}
		if(intent.name.indexOf($scope.searchIntentWords) > -1 ){
			return true;
		}else{
			return false;
		}
	}
	
	//增加意图
	$scope.addIntentNameFunc = function(intentName,index){
		if(intentName && $.trim(intentName).length > 0){
			var intentObj = new Object();
			intentObj.name = intentName;
			$scope.intentList.push(intentObj);
		}
		$scope.intentName = "";
	}
	
	//enter增加意图
	$scope.addIntentNameKeydownFunc = function($event,intentName,index){
		if($event.keyCode == 13){
			$scope.addIntentNameFunc(intentName,index);
		}
	}
	//删除意图
	$scope.deleteIntentNameFunc = function(intent_id,name){
		var url_temp = window.location.href.split("/");
		var current_intentId = url_temp[url_temp.length - 1];
		$.confirm({
	        "text": '意图删除之后所有数据都将无法恢复，你确认要删除 <span class="delete-confirm-tip">"'+ name +'"</span> 吗？' ,
	        "title": "删除意图",
	        "ensureFn": function() {
	        	$.ajax({
	    			url: ruyiai_host + "/ruyi-ai/"+ appId +"/"+ $stateParams.scenes_id +"/intent/" + intent_id,
	    			method: "DELETE",
	    			success: function(data){
	    				data = dataParse(data);
					if(data.code == 0){
	    					callAgentReloadTestFunc(); //通知nlp reload
	    					for(var i in $scope.intentList){
	    						if($scope.intentList[i].id == intent_id){
	    							$scope.intentList.splice(i,1);
	    							$scope.$apply();
	    							if($scope.intentList.length <= 0){
	    								window.location.href = "#/intent_list/" +$stateParams.scenes_id;
	    							}else if(intent_id == current_intentId){
	    								window.location.href = "#/intent_list/"+ $stateParams.scenes_id +"/intent_detail/" + $scope.intentList[0].id;
	    							}else{
	    								window.location.href = "#/intent_list/"+ $stateParams.scenes_id +"/intent_detail/" + current_intentId;
	    								$("[data-act=nav-intent-"+ current_intentId +"]").addClass("active");
	    							}
	    							break;
	    						}
	    					}
	    					$.trace("删除成功","success");
	    					$scope.getIntentCountFunc(function(){
	    						$scope.setPagingCountFunc();
	    					});
	    				}else if(data.code == 2){
	    					goIndex();
	    				}else{
	    					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
	    				}
	    			}
	    		});
				return false;
			}
		});
	}
	
	function cloneIntentDetail(myObj){ 
		var myObjTemp = new Object();
		myObjTemp.appId = myObj.appId;
		myObjTemp.auto = myObj.auto;
		myObjTemp.contexts = myObj.contexts;
		myObjTemp.errorModels = myObj.errorModels;
		myObjTemp.gmtCreate = myObj.gmtCreate;
		myObjTemp.gmtUpdate = myObj.gmtUpdate;
		myObjTemp.id = myObj.id;
		myObjTemp.intentState = myObj.intentState;
		myObjTemp.intentStatus = myObj.intentStatus;
		myObjTemp.intentType = myObj.intentType;
		myObjTemp.mlLevel = myObj.mlLevel;
		myObjTemp.name = myObj.name;
		myObjTemp.priority = myObj.priority;
		myObjTemp.responses = myObj.responses;
		myObjTemp.scenarioId = myObj.scenarioId;
		myObjTemp.speech = myObj.speech;
		myObjTemp.templates = myObj.templates;
		myObjTemp.errorModelStr = myObj.errorModelStr;
		return myObjTemp;
	}  
	
	//复制意图
	$scope.copyIntentDetailFunc = function(intentDetailPara){
		if(!$scope.isCreateSuccess){
			return false;
		}
		var intentDetailParaTemp = cloneIntentDetail(intentDetailPara);
		intentDetailParaTemp.name = intentDetailParaTemp.name + "(副本)";
		// intentDetailParaTemp.name = 'yes';
		intentDetailParaTemp.id = "";
		$scope.isCreateSuccess = false;
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+appId+"/"+ $stateParams.scenes_id +"/intent",
			data: JSON.stringify(intentDetailParaTemp),
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			method: "POST",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					callAgentReloadTestFunc(); //通知nlp reload
					var validateResult = {};
					var intentDetail = {};
					if(data.result.validateResult){
						validateResult = data.result.validateResult;
						intentDetail = data.result.intent;
					}else{
						intentDetail = data.result;
					}
					$.trace("意图复制成功","success");
					if($scope.intentList && $scope.intentList.length > 0){
					}else{
						$scope.intentList = new Array();
					}
					//将intentDetail中的errorModels数组，转变成未字符串 start
					//jds
					var errorModelStr = "";
					if(intentDetail.errorModels){
						var index = 1;
						for(var i in intentDetail.errorModels){
							index = parseInt(i) + 1;
							if(intentDetail.errorModels[i].code && intentDetail.errorModels[i].code.substring(0,1) == "0"){
								errorModelStr+="<div style='color:#ee524f;max-height:300px;overflow: hidden;overflow-y:auto;'>"+ index + "." + intentDetail.errorModels[i].detail +"</div>";
							}else if(intentDetail.errorModels[i].code && intentDetail.errorModels[i].code.substring(0,1) == "1"){
								errorModelStr+="<div style='color:#ffb64c;max-height:300px;overflow: hidden;overflow-y:auto;'>"+ index + "." + intentDetail.errorModels[i].detail +"</div>";
							}
						}
						intentDetail.errorModelStr = errorModelStr;
					}
					//将intentDetail中的errorModels数组，转变成未字符串 end
					
					$scope.intentList.unshift(intentDetail);
					$scope.getIntentCountFunc(function(){
						$scope.setPagingCountFunc();
					});
					$scope.$apply();
					window.location.href = "#/intent_list/" +$stateParams.scenes_id+ "/intent_detail/" + intentDetail.id;
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
				$scope.isCreateSuccess = true;
			},error:function(){
				$.trace("意图复制失败");
			}
		});
	}
	//移动意图
	$scope.moveIntentNameFunc = function(intentId,scenarioId){
		var url_temp = window.location.href.split("/");
		var current_intentId = url_temp[url_temp.length - 1];
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+ appId +"/"+ scenarioId +"/intent/"+ intentId +"/move",
			method: "PUT",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					callAgentReloadTestFunc(); //通知nlp reload
					$scope.getIntentCountFunc(function(){
						$scope.setPagingCountFunc();
					});
					for(var i in $scope.intentList){
						if($scope.intentList[i].id == intentId){
							$scope.intentList.splice(i,1);
							$scope.$apply();
							if($scope.intentList.length <= 0){
								window.location.href = "#/intent_list/" +$stateParams.scenes_id;
							}else if(intentId == current_intentId){
								window.location.href = "#/intent_list/"+ $stateParams.scenes_id +"/intent_detail/" + $scope.intentList[0].id;
							}else{
								window.location.href = "#/intent_list/"+ $stateParams.scenes_id +"/intent_detail/" + current_intentId;
							}
							break;
						}
					}
				}else if(data.code == 2){
					goIndex();
				}else{
					$.trace("此意图已在本场景下，无需移动！");
				}
			}
		});
	}
	
//	$scope.stopProFunc = function($event,intentId){
//		$event.stopPropagation();
//		for(var i in $scope.intentList){
//			if($scope.intentList[i].id == intentId){
//				$scope.intentList[i].isClick = true;
//			}else{
//				$scope.intentList[i].isClick = false;
//			}
//		}
//		var left = getElementLeft($event.target);
//		var top = getElementTop($event.target);
////		$event.target.nextElementSibling().css({"left":left,"top":top});
//	}
	$(".intent").delegate(".btn-intent","click",function(event){
		event.stopPropagation();
		var $this = $(this);
		var url_temp = window.location.href.split("/");
		var current_intentId = url_temp[url_temp.length - 1];
		$this.parent().addClass("open");
		$("[data-act=nav-intent-"+ current_intentId +"]").addClass("active");
		var left = this.getBoundingClientRect().left+document.documentElement.scrollLeft;
		var top = this.getBoundingClientRect().top+document.documentElement.scrollTop;
		$this.next().css({"left":left,"top":top});
		
	});
	$(".intent").delegate(".btn-group","mouseleave",function(){
		$(this).removeClass("open");
	});
	//复制意图    TODO 需要修改
	$scope.copyIntentNameFunc = function(intent_id){
		for(var i in $scope.intentList){
			if($scope.intentList[i].id == intent_id){
				$scope.copyIntentDetailFunc($scope.intentList[i]);
				break;
			}
		}
	}
	
	//分页 start
	
	//获取总共有多少条意图
	$scope.getIntentCountFunc = function(getIntentCountFunc){
		if($stateParams.scenes_id != -1){
			$.ajax({
				url: ruyiai_host + "/ruyi-ai/"+ appId +"/"+ $stateParams.scenes_id +"/intent/count",
				method: "GET",
				success: function(data){
					data = dataParse(data);
					if(data.code == 0){
						$scope.intentCount = data.result;
						$scope.$apply();
						if(getIntentCountFunc){
							getIntentCountFunc();
						}
					}else if(data.code == 2){
						goIndex();
					}else{
						if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
					}
				}
			});
		}
	}
	$scope.getIntentCountFunc(function(){
		$scope.setPagingCountFunc(function(){
			$(".paging-box li:nth-child(2)").addClass("active").siblings().removeClass("active");
		});
	});
	
	//设置初始分页数数组
	$scope.setPagingCountFunc = function(initActivePage){
		if($scope.intentCount){
			//总共的页数
			var pageCount = Math.ceil($scope.intentCount / $scope.pageSize);
			$scope.pageCount = pageCount;
			$scope.intentPageNumList = [];
			for (var i=1; i<= $scope.pageCount && $scope.intentPageNumList.length <= 7; i++)
			{
				$scope.intentPageNumList.push(i);
			}
			var lastNum
			if($scope.pageCount > 8){
				$scope.intentPageNumList.push("...");
				lastNum = $scope.intentPageNumList[$scope.intentPageNumList.length - 2];
			}else{
				lastNum = $scope.intentPageNumList[$scope.intentPageNumList.length - 1];
			}
			$scope.lastNum = lastNum;
			$scope.$apply();
			if(initActivePage){
				initActivePage();
			}
		}
	}
	
	$scope.firstNum = 1;
	//意图分页
	$("body").off("click",".paging-box li a").on("click",".paging-box li a",function(event){
		var $this = $(this);
		if($this.parent("li").hasClass("disabled")){
			return false;
		}
		var pageNum = $this.text();
		if(pageNum == "«"){
			var firstNum = $scope.intentPageNumList[0];
			$scope.firstNum = firstNum;
			if(firstNum >= 9){
				$scope.intentPageNumList = [];
				for (var i = firstNum - 1; i>= 1 && $scope.intentPageNumList.length <= 7; i--)
				{
					$scope.intentPageNumList.unshift(i);
				}
			}
			var lastNum = 0;
			if($scope.intentPageNumList.length == 8 && $scope.intentPageNumList[$scope.intentPageNumList.length - 1] < $scope.pageCount){
				$scope.intentPageNumList.push("...");
				lastNum = $scope.intentPageNumList[$scope.intentPageNumList.length - 2];
			}else{
				lastNum = $scope.intentPageNumList[$scope.intentPageNumList.length - 1];
			}
			firstNum = $scope.intentPageNumList[0];
			$scope.firstNum = firstNum;
			$scope.lastNum = lastNum;
		}else if(pageNum == "»"){
			var lastNum = $scope.intentPageNumList[$scope.intentPageNumList.length - 2];
			$scope.lastNum = lastNum;
			if(lastNum < $scope.pageCount){
				$scope.intentPageNumList = [];
				for (var i = lastNum + 1; i<= $scope.pageCount && $scope.intentPageNumList.length <= 7; i++)
				{
					$scope.intentPageNumList.push(i);
				}
			}
			if($scope.intentPageNumList.length == 8 && $scope.intentPageNumList[$scope.intentPageNumList.length - 1] < $scope.pageCount){
				$scope.intentPageNumList.push("...");
				lastNum = $scope.intentPageNumList[$scope.intentPageNumList.length - 2];
			}else{
				lastNum = $scope.intentPageNumList[$scope.intentPageNumList.length - 1];
			}
			var firstNum = $scope.intentPageNumList[0];
			$scope.firstNum = firstNum;
			$scope.lastNum = lastNum;
		}else if(pageNum == "..."){
			
		}else{
			pageNum = parseInt(pageNum);
			pageNum = pageNum - 1;
			$scope.getIntentListFunc(pageNum * $scope.pageSize, $scope.pageSize,$scope.searchIntentWords);
			$this.parent("li").addClass("active").siblings("li").removeClass("active");
		}
		$scope.$apply();
	});
	//分页 end
	
//	//回车搜索意图
//	$scope.searchIntentWordsNameKeydownFunc = function($event, searchIntentWords){
//		if($event.keyCode == 13){
//			$scope.searchIntentWordsNameFunc(searchIntentWords);
//		}
//	}

	
	$(".sort-key").click(function(){
		var sortkey = getCookie("sortkey");
		$(this).find("." + sortkey).addClass("active").siblings().removeClass("active");
	});
	$(".sort-key li").click(function(){
		var $this = $(this);
		var sortkey = $this.attr("class").split(" ")[0];
		setCookie("sortkey",sortkey);
		$scope.getIntentListFunc(0, $scope.pageSize);
		$scope.getIntentCountFunc(function(){
			$scope.setPagingCountFunc(function(){
				$(".paging-box li:nth-child(2)").addClass("active").siblings().removeClass("active");
			});
		});
	});
	// 场景开关
	$('#toggleScene').on('click',function(){
		var li = $('.scenario-object.active');
		var name = li.find('.ng-binding').text();
		var colorBtn = li.find('.colorBtn');
		var isChecked =	!$(this).find('input').prop('checked');
		
		var isValid = isChecked == true ? 'VALID' : 'INVALID';
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+appId+"/scenario/" + $scope.scenario.id +'/update/status',
			method: 'POST',
			data: {"scenarioStatus":isValid},
			success: function(data){
				var code = data.code;
				if(code != 0){
					return;
				}
				if(isChecked == true){
					colorBtn.removeClass('unAbled').addClass('isAbled');
					$(colorBtn).attr('data-original-title','该场景已打开');
				}else{
					colorBtn.removeClass('isAbled').addClass('unAbled');
					$(colorBtn).attr('data-original-title','该场景已关闭');
				}
			},
			error: function(err){
				console.log(err);
			}
		});
	})
	// 新建意图
	$('.form-control.myNewIssue').on('keydown',function(e){
		if(e.keyCode == 13){
			var intentName = $(this).val();
			$scope.createIntentFunc();
			// console.log($('[data-act="intent-detail-title"]'));
			// $('[data-act="intent-detail-title"]').val(intentName);
			setTimeout(function(){
				// $scope.intentList[0].name = intentName;
				console.log($scope.intentList[0])
			},0)
		}
	})

	if($scope.scenario && $scope.scenario.scenarioType == 'SYSTEMACTION'){
		$scope.isSY = true;
		$('.center-list-title input').attr('disabled',true);
	}
};




