function intentSearchCtrl($rootScope,$scope, $state, $stateParams){
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-scenario]").addClass("active");
	$("[data-act=nav-scenario-"+ $stateParams.scenes_id +"]").addClass("active");
	$scope.pageSize = 12;//意图页面，每页的数量
	$scope.searchIntentWords = "";//搜索意图
	$scope.isCreateSuccess = true;
	
	//设置意图列表页面，放置的意图数
	var setIntentListCountFunc = function(){
		var windowHeight = $(window).height();
		$scope.pageSize = parseInt(windowHeight/56);
	}
	setIntentListCountFunc();
	
	$(window).resize(function() {
		setIntentListCountFunc();
	});
	//查询意图详情
	$scope.goIntentDetail = function(scenarioId,intent_id,event){
		if (event && ($(event.target).is('.btn-intent') 
				|| $(event.target).is('.copy-intent-target') 
				|| $(event.target).is('.delete-intent-target') 
				|| $(event.target).is('.copy-intent')
				|| $(event.target).is('[data-act=move-scenario]')
				|| $(event.target).is('[data-click=scenario-name]'))) {
		    return;
		}
		if(dataEditedFlag) {
			$.confirm_save({
				"text": "你的修改未保存，确定要离开意图详情页面吗？",
		        "title": "系统提示",
		        "ensureFn": function() {
		        	dataEditedFlag = false;
		        	if(!$("[data-act=confirmShow]").css("display")){
		    			window.location.href = "#/intent_search/" + scenarioId + "/intent_detail/" + intent_id;
		    		}
		        },
		        "saveFn": function() {
					$(".save-and-apply").trigger("click");
					dataEditedFlag = false;
		        	if(!$("[data-act=confirmShow]").css("display")){
		    			window.location.href = "#/intent_search/" + scenarioId + "/intent_detail/" + intent_id;
		    		}
		        }
			});
		}
		if(dataEditedFlag) {
			return;
		}
		if(!$("[data-act=confirmShow]").css("display")){
			window.location.href = "#/intent_search/" + scenarioId + "/intent_detail/" + intent_id;
		}
//		setTimeout(function(){
//			$("[data-act=nav-scenario-"+ scenarioId +"]").addClass("active").siblings().removeClass("active");
//			$("[data-act=nav-intent-"+ intent_id +"]").addClass("active");
//		},100);
		$("[data-act=nav-scenario-"+ scenarioId +"]").addClass("active").siblings().removeClass("active");
		//$scope.searchIntentWords = "";
	}
	//获取场景详情
	$scope.getScenarioFunc = function(){
		var scenarioList = angular.element("#api-manager-box").scope().scenarioList;
		for(var i in scenarioList){
			if($stateParams.scenes_id == scenarioList[i].id){
				$scope.scenario = scenarioList[i];
				$scope.$apply();
				break;
			}
		}
	}
	setTimeout(function(){
		$scope.getScenarioFunc();
	}, 10);
	//回车搜索意图
	$scope.searchIntentWordsNameKeydownFunc = function($event, searchIntentWords){
		if($event.keyCode == 13){
			$scope.searchIntentWordsNameFunc(searchIntentWords);
		}
	}
	//点击搜索按钮搜索意图
	$scope.searchIntentWordsNameFunc = function(searchIntentWords){
		$(".popover").remove();
		var sortkey = getCookie("sortkey");
		if(searchIntentWords != ""){
			$.ajax({
				url: ruyiai_host + "/ruyi-ai/"+ appId + "/intents",
				data:{"start":0, "limit":"800", "keywords": searchIntentWords, "sortkey": sortkey},
				method: "GET",
				success: function(data){
					data = dataParse(data);
					if(data.code == 0){
						$scope.intentList = data.result;
						for(var j in $scope.intentList){
							var errorModelStr = "";
							if($scope.intentList[j].errorModels){
								var index = 1;
								for(var i in $scope.intentList[j].errorModels){
									index = parseInt(i) + 1;
									if($scope.intentList[j].errorModels[i].code && $scope.intentList[j].errorModels[i].code.substring(0,1) == "0"){
										errorModelStr+="<div style='color:#ee524f;'>"+ index + "." + $scope.intentList[j].errorModels[i].detail +"</div>";
									}else if($scope.intentList[j].errorModels[i].code && $scope.intentList[j].errorModels[i].code.substring(0,1) == "1"){
										errorModelStr+="<div style='color:#ffb64c;'>"+ index + "." + $scope.intentList[j].errorModels[i].detail +"</div>";
									}
								}
								$scope.intentList[j].errorModelStr = errorModelStr;
							}
						}
						$scope.$apply();
						if($scope.intentList.length <= 0){
							$.trace("未搜索到意图");
						}else{
							window.location.href = "#/intent_search/" + $scope.intentList[0].scenarioId + "/intent_detail/" + $scope.intentList[0].id;
							setTimeout(function(){
								$("[data-act=nav-scenario-"+ $scope.intentList[0].scenarioId +"]").addClass("active").siblings().removeClass("active");
								$("[data-act=nav-intent-"+ $scope.intentList[0].id +"]").addClass("active");
							},100);
						}
					}else if(data.code == 2){
						goIndex();
					}else{
						if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
					}
				}
			});
		}else{
			$.trace("请填写关键词");
			//$scope.intentList = [];
		}
		$(".list-group-item").removeClass("active");
	}
	//删除意图
	$scope.deleteIntentNameFunc = function(intent_id,event){
		var url_temp = window.location.href.split("/");
		var current_intentId = url_temp[url_temp.length - 1];
		var current_scenarioId = url_temp[url_temp.length - 3];
		$.confirm({
	        "text": "意图删除之后所有数据都将无法恢复，你确认要删除此意图吗？" ,
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
	    								window.location.href = "#/intent_search/";
	    								$(".list-group-item").removeClass("active");
	    							}else if(intent_id == current_intentId){
	    								window.location.href = "#/intent_search/" + $scope.intentList[0].scenarioId + "/intent_detail/" + $scope.intentList[0].id;
	    								setTimeout(function(){
	    									$("[data-act=nav-scenario-"+ $scope.intentList[0].scenarioId +"]").addClass("active").siblings().removeClass("active");
	    								},100);
	    							}else{
	    								window.location.href = "#/intent_search/" + current_scenarioId + "/intent_detail/" + current_intentId;
	    								setTimeout(function(){
	    									$("[data-act=nav-scenario-"+ current_scenarioId +"]").addClass("active").siblings().removeClass("active");
	    								},0);
	    							}
	    							break;
	    						}
	    					}
	    				}else if(data.code == 2){
	    					goIndex();
	    				}else{
	    					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
	    				}
	    				return false;
	    			}
	    		});
				return false;
			}
		});
		return false;
	}
	
	//复制意图
	$scope.copyIntentDetailFunc = function(intentDetailPara,scenarioId){
		if(!$scope.isCreateSuccess){
			return false;
		}
		$scope.isCreateSuccess = false;
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+appId+"/"+ scenarioId +"/intent",
			data: JSON.stringify(intentDetailPara),
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
					$scope.intentList.push(intentDetail);
					$scope.$apply();
					window.location.href = "#/intent_search/" + scenarioId + "/intent_detail/" + intentDetail.id;
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
		var current_scenarioId = url_temp[url_temp.length - 3];
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+ appId +"/"+ scenarioId +"/intent/"+ intentId +"/move",
			method: "PUT",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					$.trace("移动成功","success");
//					callAgentReloadTestFunc(); //通知nlp reload
//					for(var i in $scope.intentList){
//						if($scope.intentList[i].id == intentId){
//							$scope.intentList.splice(i,1);
//							$scope.$apply();
//							if($scope.intentList.length <= 0){
//								window.location.href = "#/intent_search/";
//								$(".list-group-item").removeClass("active");
//							}else if(intentId == current_intentId){
//								window.location.href = "#/intent_search/intent_detail/" + $scope.intentList[0].id;
//								setTimeout(function(){
//									$("[data-act=nav-scenario-"+ $scope.intentList[0].scenarioId +"]").addClass("active").siblings().removeClass("active");
//									$("[data-act=nav-intent-"+ $scope.intentList[0].id +"]").addClass("active");
//								},100);
//							}else{
//								setTimeout(function(){
//									for(var j in $scope.intentList){
//										if($scope.intentList[j].id == current_intentId){
//											$("[data-act=nav-scenario-"+ $scope.intentList[j].scenarioId +"]").addClass("active").siblings().removeClass("active");
//										}
//									}
//									window.location.href = "#/intent_search/intent_detail/" + current_intentId;
//								},0);
//							}
//							break;
//						}
//					}
//					callAgentReloadTestFunc(); //通知nlp reload
//					for(var i in $scope.intentList){
//						if($scope.intentList[i].id == intentId){
//							$scope.intentList.splice(i,1);
//							$scope.$apply();
//							if($scope.intentList.length <= 0){
//								window.location.href = "#/intent_search/";
//								$(".list-group-item").removeClass("active");
//							}else if(intentId == current_intentId){
//								window.location.href = "#/intent_search/" + scenarioId + "/intent_detail/" + $scope.intentList[0].id;
//								setTimeout(function(){
//									$("[data-act=nav-scenario-"+ $scope.intentList[0].scenarioId +"]").addClass("active").siblings().removeClass("active");
//									$("[data-act=nav-intent-"+ $scope.intentList[0].id +"]").addClass("active");
//								},100);
//							}else{
//								window.location.href = "#/intent_search/" + current_scenarioId + "/intent_detail/" + current_intentId;
//								setTimeout(function(){
//									$("[data-act=nav-scenario-"+ current_scenarioId +"]").addClass("active").siblings().removeClass("active");
//								},0);
//							}
//							break;
//						}
//					}
				}else if(data.code == 2){
					goIndex();
				}else{
					$.trace("此意图已在本场景下，无需移动！");
				}
			}
		});
	}
	//复制意图    TODO 需要修改
	$scope.copyIntentNameFunc = function(intent_id,scenarioId){
		for(var i in $scope.intentList){
			if($scope.intentList[i].id == intent_id){
				$scope.copyIntentDetailFunc($scope.intentList[i],scenarioId);
				break;
			}
		}
	}
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
	setTimeout(function(){
		$(".search-intent-list").focus();
	}, 200);
	
};




