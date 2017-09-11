function entityDetailCtrl($rootScope,$scope, $state, $stateParams){
	
	setTimeout(function(){
		$("[data-act=nav-entity-"+ $stateParams.entity_id +"]").siblings().removeClass("active");
		$("[data-act=nav-entity-"+ $stateParams.entity_id +"]").addClass("active")
	}, 200);
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	}, 200);
	
	var entityDetailDuplicate = "";
	
	// entityDetail监视
//	$scope.$watch('entityDetail', function(newValue, oldValue) {
//		var newValueTemp = JSON.stringify(newValue);
//		if(newValueTemp == entityDetailDuplicate){
//			dataEditedFlag = false;
//		}else{
//			dataEditedFlag = true;
//		}
//	}, true);
	
	//判断是否显示帮助
	$scope.checkShowHelp = function(){
		//如果没有添加过词典，则显示帮助
		if(!$scope.entityDetail || !$scope.entityDetail.entries || $scope.entityDetail.entries.length == 0){
			$(".help-text").css("display","block");
		}
	}
	
	//删除帮助文档
	$scope.deleteHelpText = function(){
		$(".help-text").css("display","none");
	}
	
	//添加空的entity
	var addEmptyEntityFunc = function(entityDetail){
		if(entityDetail){
			if(!entityDetail.entries){
				entityDetail.entries = [];
				entityDetail.entries.push({"value":"","synonyms":[]});
			}else{
				var lastEntrie = entityDetail.entries[entityDetail.entries.length-1];
				if(lastEntrie && ($.trim(lastEntrie.value).length != 0 || lastEntrie.synonyms.length != 0)){
					entityDetail.entries.push({"value":"","synonyms":[]});
				}
			}
		}
		return entityDetail;
	}
	
	//删除空的entity  暂时还未用到
	var deleteEmptyEntityFunc = function(entityDetail){
		if(entityDetail){
			if(entityDetail.entries){
				for(var i in entityDetail.entries){
					if($.trim(entityDetail.entries.value).length == 0 && entityDetail.entries.synonyms.length == 0){
						entityDetail.entries.splice(i,1);
					}
				}
			}
		}
		return entityDetail;
	}
	
	//查询词典详情
	$scope.getEntityDetailFunc = function(){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+ appId +"/entity/" + $stateParams.entity_id,
			method: "GET",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					$scope.entityDetail = data.result;
					$scope.entityDetail = addEmptyEntityFunc($scope.entityDetail);
					entityDetailDuplicate = JSON.stringify($scope.entityDetail);
					$scope.$apply();
					$scope.checkShowHelp();//如果没有添加过词典，则显示帮助
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
	}
	
	var entityIndex = 0;
	if(angular.element(".center-list-box-entity").scope().entityCount){
		entityIndex = angular.element(".center-list-box-entity").scope().entityCount;
	}
	
	//创建词典函数
	var createEntityCommonFunc = function(){
		entityIndex+=1;
		$scope.entityDetail = new Object();
		$scope.entityDetail = addEmptyEntityFunc($scope.entityDetail);
		$scope.entityDetail.name = "未命名词典" + entityIndex;
		setTimeout(function(){
			$scope.addEntityFunc(saveEntityButtonFunc);
			$(".help-text").css("display","block");//如果没有添加过词典，则显示帮助
		}, 20);
	}
	
	if($stateParams.entity_id == -1){ //创建词典
		createEntityCommonFunc();
	}else{ //查询词典详情
		$scope.getEntityDetailFunc();
	}
	
	//添加词典的值
	$scope.addEntityValueFunc = function(entityEntryValue, $index){
		if(isContainSpacesFunc(entityEntryValue)) return; //检测是否包含空格
		if(!entityEntryValue || $.trim(entityEntryValue).length <= 0){
			return false;
		}
		if(!$scope.entityDetail.entries){ //不存在词典列表
			$scope.entityDetail.entries = new Array();
			var entityEntry = new Object();
			entityEntry.value = entityEntryValue;
			$scope.entityDetail.entries.push(entityEntry);
		}else{  //存在词典列表
			if($scope.entityDetail.entries[$index]){ //存在entity对象
				$scope.entityDetail.entries[$index].value = entityEntryValue;
			}else{ //不存在entity对象
				var entityEntry = new Object();
				entityEntry.value = entityEntryValue;
				$scope.entityDetail.entries.push(entityEntry);
			}
		}
		$scope.addEntityEntryValue = "";
		$scope.addSynonymsValue = new Array();
		$scope.addEntitySynonym = "";
		$scope.addSynonym = "";
		dataEditedFlag = true;
		addEmptyEntityFunc($scope.entityDetail);
		$scope.saveEntityDetailFunc();
	}
	
	//添加同义词的值
	$scope.addEntitySynonymFunc = function(addSynonym, $index){
		if(!addSynonym || $.trim(addSynonym).length <= 0){
			return false;
		}
		if(isContainSpacesFunc(addSynonym)) return; //检测是否包含空格
		if(!$scope.entityDetail.entries){ //不存在词典列表
			$scope.entityDetail.entries = new Array();
			var entityEntry = new Object();
			entityEntry.synonyms = new Array();
			entityEntry.synonyms.push(addSynonym);
			$scope.entityDetail.entries.push(entityEntry);
		}else{  //存在词典列表
			if($scope.entityDetail.entries[$index]){ //存在entityEntry对象
				if(!$scope.entityDetail.entries[$index].synonyms){ //不存在同义词数组
					$scope.entityDetail.entries[$index].synonyms = new Array();
				}
				var flag = false;  //判断是否已经存在同样的词条，如果已经存在了，则不再添加
				for(var i in $scope.entityDetail.entries[$index].synonyms){
					if($scope.entityDetail.entries[$index].synonyms[i] == addSynonym){
						flag = true;
					}
				}
				if(!flag){
					$scope.entityDetail.entries[$index].synonyms.push(addSynonym);
				}
			}else{ //不存在entityEntry对象
				var entityEntry = new Object();
				entityEntry.synonyms = new Array();
				entityEntry.synonyms.push(addSynonym);
				$scope.entityDetail.entries.push(entityEntry);
			}
		}
		$scope.addEntityEntryValue = "";
		$scope.addSynonymsValue = new Array();
		$scope.addEntitySynonym = "";
		$scope.addSynonym = "";
		$("[data-act=addEntitySynonym]").val("");
		dataEditedFlag = true;
		addEmptyEntityFunc($scope.entityDetail);
		$scope.saveEntityDetailFunc();
	}
	
//	$scope.addEntitySynonymKeydownFunc = function($event, addSynonym, $index){
//		if($event.keyCode == 13){
//			$scope.addEntitySynonymFunc(addSynonym, $index);
//		}
//	}
	
	$("body").off("keyup","[data-act=addEntitySynonym]").on("keyup","[data-act=addEntitySynonym]",function(event){
		var $this = $(this);
		var $index = $this.attr("data-index");
		if(event.keyCode == 13){
			if(!$this.val() || $this.val().length == 0){
				$index = parseInt($index) + 1;
				$("[data-act=entity-li-"+$index+"]").find("[data-act=entity-similar-title]").focus();
				
			}else{
				$scope.addEntitySynonymFunc($this.val(), $index);
				$scope.$apply();
			}
		}
	});
	
	$("body").off("keyup","[data-act=entity-name]").on("keyup","[data-act=entity-name]",function(event){
		var $this = $(this);
		if(event.keyCode == 13){
			$("[data-act=entity-li-0]").find("[data-act=entity-similar-title]").focus();
		}
	});
	
	//添加词典
	$scope.addEntityFunc = function(saveEntityButtonFunc){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+ appId +"/entity",
			data: JSON.stringify($scope.entityDetail),
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			method: "POST",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					$scope.entityDetail.id = data.result.id;
					//$.trace("词典创建成功","success");
					if(saveEntityButtonFunc){
						saveEntityButtonFunc();
					}
					var entityList = angular.element(".center-list-box-entity").scope().entityList;
					if(!entityList){
						entityList = new Array();
					}
					entityList.push($scope.entityDetail);
					angular.element(".center-list-box-entity").scope().entityList = entityList;
					angular.element(".center-list-box-entity").scope().entityCount = angular.element(".center-list-box-entity").scope().entityCount + 1;
					$scope.$apply();
					dataEditedFlag = false;
					entityDetailDuplicate = JSON.stringify($scope.entityDetail);
					$rootScope.$apply();
					setTimeout(function(){
						$("[data-act=entity-name]").focus();
						setTimeout(function(){
							$("[data-act=entity-name]").select();
						}, 100);
					}, 20);
					window.location.href = "#/entity_list/entity_detail/" + $scope.entityDetail.id;
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg.indexOf("already exists") > -1){
						createEntityCommonFunc();
					}else{
						if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
					}
				}
			},error:function(){
				$.trace("词典创建失败");
			}
		});
	}
	//修改词典
	$scope.updateEntityFunc = function(saveEntityButtonFunc){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+ appId +"/entity/" + $stateParams.entity_id,
			data: JSON.stringify($scope.entityDetail),
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			method: "PUT",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					callAgentReloadTestFunc(); //通知nlp reload
					var entityList = angular.element(".center-list-box-entity").scope().entityList;
					for(var i in entityList){
						if(entityList[i].id == $scope.entityDetail.id){
							entityList[i].name = $scope.entityDetail.name;
						}
					}
					angular.element(".center-list-box-entity").scope().entityList = entityList;
					$scope.$apply();
					//$.trace("词典更新成功","success");
					if(saveEntityButtonFunc){
						saveEntityButtonFunc();
					}
					dataEditedFlag = false;
					entityDetailDuplicate = JSON.stringify($scope.entityDetail);
					$rootScope.$apply();
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ 
						$.trace(data.msg + "( "+ data.detail +" )","error");
						$(".save-and-apply .save-text").text("保存并应用");
						$(".save-and-apply .dim-div").css("display","none");
						$(".save-and-apply .saveing").css("width","0");
					}
				}
			},error:function(){
				$.trace("词典更新失败");
			}
		});
	}
	//判断必填参数
	$scope.checkRequiredParaments = function(editEntityFunc){
		if(!$scope.entityDetail.name || $.trim($scope.entityDetail.name).length <= 0){
			$.trace("请填写词典名称");
		}else if(!$scope.entityDetail.entries || $scope.entityDetail.entries.length <= 0){
			$.trace("至少创建一个参数");
		}else{
			if(editEntityFunc){
				editEntityFunc();
			}
		}
	}
	
	//处理保存并应用按钮变化
	var saveEntityButtonFunc = function(){
		setTimeout(function(){
			$(".save-and-apply .save-text").text("保存成功","success");
			$(".save-and-apply .saveing").css("display","none");
			$(".save-and-apply .saveing").css("width","0");
			setTimeout(function(){
				$(".save-and-apply .saveing").css("display","block");
			}, 1000);
			setTimeout(function(){
				$(".save-and-apply .save-text").text("保存并应用");
				$(".save-and-apply .dim-div").css("display","none");
			}, 500);
		}, 1000);
	}
	
	//保存创建词典
	$scope.saveEntityDetailFunc = function(){
		
		if($(".save-and-apply .dim-div").css("display") != "block"){
			$(".save-and-apply .dim-div").css("display","block");
			$(".save-and-apply .save-text").text("保存中...");
			$(".save-and-apply .saveing").css("width","90px");
			
			$scope.checkRequiredParaments(function(){//判断必填参数
				$scope.entityDetail.appId = appId;
				if($scope.entityDetail.id && $scope.entityDetail.id.length > 0){
					$scope.updateEntityFunc(saveEntityButtonFunc); //修改词典
				}else{
					$scope.addEntityFunc(saveEntityButtonFunc); //添加词典
				}
			});
		}
		
	}
	//删除一个词典entity
	$scope.deleteEntityFunc = function($index,name){
		$.confirm({
			"text": '词条删除之后将无法恢复，你确定要删除"'+ name +'"吗？',
	        "title": "删除",
	        "ensureFn": function() {
	        	for(var i in $scope.entityDetail.entries){
	        		if(i == $index){
	        			$scope.entityDetail.entries.splice(i,1);
	        			$scope.$apply();
	        			dataEditedFlag = true;
	        			break;
	        		}
	        	}
	        }
	    });
	}
	//删除一个同义词
	$scope.deleteSynonymFunc = function($parentIndex,$index){
    	for(var i in $scope.entityDetail.entries){
    		if(i == $parentIndex){
    			for(var j in $scope.entityDetail.entries[i].synonyms){
    				if(j == $index){
    					$scope.entityDetail.entries[i].synonyms.splice(j,1);
    					dataEditedFlag = true;
    					$scope.saveEntityDetailFunc();
    					break;
    				}
    			}
    		}
    	}
	}
	
	$("body").off("keyup","[data-act=entity-similar-title]").on("keyup","[data-act=entity-similar-title]",function(event){
		var $this = $(this);
		if(event.keyCode == 13){
			$this.closest(".intent-row-box").find("[data-act=addEntitySynonym]").focus();
		}
	});
	
	$scope.entityNameChangeFunc = function(){
		dataEditedFlag = true;
		$scope.saveEntityDetailFunc();
	}
	
	
}











