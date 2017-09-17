function entityListCtrl($rootScope,$scope, $state, $stateParams){
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-entity]").addClass("active");
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	}, 200);
	$scope.mycity = "city";
	$scope.createEntityFunc = function(entity_id){
		if(window.location.href.substring(window.location.href.length-3,window.location.href.length) == "/-1"){
			if(dataEditedFlag) {
				$.confirm_save({
					"text": "你的修改未保存，确定要离开词典详情页面吗？",
			        "title": "系统提示",
			        "ensureFn": function() {
			        	window.location.reload();
			        },
					"saveFn": function() {
						$(".save-and-apply").trigger("click");
						window.location.reload();
			        }
				});
			}
		}else{
			window.location.href = "#/entity_list" + "/entity_detail/" + entity_id;
		}
	}
	
	$('[data-toggle="popover"]').popover();
	
	$scope.pageSize = 12;//意图页面，每页的数量
	//设置意图列表页面，放置的意图数
	var setEntityListCountFunc = function(){
		var windowHeight = $(window).height();
		$scope.pageSize = parseInt((windowHeight - 242)/40);
		if($scope.setPagingCountFunc){
			$scope.setPagingCountFunc();
		}
	}
	setEntityListCountFunc();
	
	$(window).resize(function() {
		setEntityListCountFunc();
	});
	
	$scope.searchEntityWords = "";//搜索意图
	
	//查询词典列表
	$scope.getEntityListFunc = function(startSize, pageSize, keywords){
		if(!keywords){
			keywords = "";
		}
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+ appId +"/entitys",
			data:{"start":startSize, "limit":pageSize, "keywords": keywords},
			method: "GET",
			success: function(data){
				if(keywords){
					$(".paging-box").hide();
				}else{
					$(".paging-box").show();
				}
				data = dataParse(data);
					if(data.code == 0){
					$scope.entityList = data.result;
//					if($scope.entityList && $scope.entityList.length > 0){
//						if(window.location.href.indexOf("entity_detail") == -1){
//							window.location.href = "#/entity_list" + "/entity_detail/" + $scope.entityList[0].id;
//						}
//					}
					$scope.$apply();
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	};
	$scope.getEntityListFunc(0, $scope.pageSize);
	
	//词典列表过滤
	$scope.entityListFilter = function(entity){
		if(!$scope.searchEntity || $scope.searchEntity.length ==0 ){
			return true;
		}
		if(entity.name.indexOf($scope.searchEntity) > -1 ){
			return true;
		}else{
			return false;
		}
	}
	
	//删除词典
	$scope.deleteEntityNameFunc = function(entity_id,name){
		$.confirm({
	        "text": '词典删除之后所有数据都将无法恢复，你确认要删除 <span class="delete-confirm-tip">"'+ name +'"</span> 吗？' ,
	        "title": "删除词典",
	        "ensureFn": function() {
	        	$.ajax({
	    			url: ruyiai_host + "/ruyi-ai/"+ appId + "/entity/" + entity_id,
	    			method: "DELETE",
	    			success: function(data){
	    				data = dataParse(data);
					if(data.code == 0){
	    					callAgentReloadTestFunc(); //通知nlp reload
	    					for(var i in $scope.entityList){
	    						if($scope.entityList[i].id == entity_id){
	    							$scope.entityList.splice(i,1);
	    							$scope.$apply();
	    							if($scope.entityList.length <= 0){
	    								window.location.href = "#/entity_list";
	    							}else{
	    								window.location.href = "#/entity_list" + "/entity_detail/" + $scope.entityList[0].id;
	    							}
	    							break;
	    						}
	    					}
	    					$.trace("删除成功","success");
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
	
	//查询词典详情
	$scope.goEntityDetail = function(entity_id){
		if(dataEditedFlag) {
			$.confirm_save({
				"text": "你的修改未保存，确定要离开词典详情页面吗？",
		        "title": "系统提示",
		        "ensureFn": function() {
		        	dataEditedFlag = false;
		        	if(!$("[data-act=confirmShow]").css("display")){
		    			window.location.href = "#/entity_list/entity_detail/" + entity_id;
		    		}
		        },
		        "saveFn": function() {
					$(".save-and-apply").trigger("click");
					dataEditedFlag = false;
		        	if(!$("[data-act=confirmShow]").css("display")){
		    			window.location.href = "#/entity_list/entity_detail/" + entity_id;
		    		}
		        }
			});
		}
		if(dataEditedFlag) {
			return;
		}
		if(!$("[data-act=confirmShow]").css("display")){
			window.location.href = "#/entity_list/entity_detail/" + entity_id;
		}
	}
	
	//分页 start
	//获取总共有多少条词典
	$scope.getEntityCountFunc = function(getEntityCountFunc){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+ appId+ "/entity/count ",
			method: "GET",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					$scope.entityCount = data.result;
					if(getEntityCountFunc){
						getEntityCountFunc();
					}
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	}
	$scope.getEntityCountFunc(function(){
		$scope.setPagingCountFunc();
	});
	
	//设置初始分页数数组
	$scope.setPagingCountFunc = function(){
		//总共的页数
		var pageCount = Math.ceil($scope.entityCount / $scope.pageSize);
		$scope.pageCount = pageCount;
		$scope.entityPageNumList = [];
		for (var i=1; i<= $scope.pageCount && $scope.entityPageNumList.length <= 7; i++)
		{
			$scope.entityPageNumList.push(i);
		}
		var lastNum = $scope.entityPageNumList[$scope.entityPageNumList.length - 1];
		$scope.lastNum = lastNum;
		$scope.$apply();
		$(".paging-box li:nth-child(2)").addClass("active");
	}
	
	$scope.firstNum = 1;
	//意图分页
	$("body").off("click",".paging-box li a").on("click",".paging-box li a",function(event){
		var $this = $(this);
		var pageNum = $this.text();
		if(pageNum == "«"){
			var firstNum = $scope.entityPageNumList[0];
			$scope.firstNum = firstNum;
			if(firstNum >= 9){
				$scope.entityPageNumList = [];
				for (var i = firstNum - 1; i>= 1 && $scope.entityPageNumList.length <= 7; i--)
				{
					$scope.entityPageNumList.unshift(i);
				}
			}
			firstNum = $scope.entityPageNumList[0];
			$scope.firstNum = firstNum;
			var lastNum = $scope.entityPageNumList[$scope.entityPageNumList.length - 1];
			$scope.lastNum = lastNum;
		}else if(pageNum == "»"){
			var lastNum = $scope.entityPageNumList[$scope.entityPageNumList.length - 1];
			$scope.lastNum = lastNum;
			if(lastNum < $scope.pageCount){
				$scope.entityPageNumList = [];
				for (var i = lastNum + 1; i<= $scope.pageCount && $scope.entityPageNumList.length <= 7; i++)
				{
					$scope.entityPageNumList.push(i);
				}
			}
			var firstNum = $scope.entityPageNumList[0];
			$scope.firstNum = firstNum;
			lastNum = $scope.entityPageNumList[$scope.entityPageNumList.length - 1];
			$scope.lastNum = lastNum;
		}else{
			pageNum = parseInt(pageNum);
			pageNum = pageNum - 1;
			$scope.getEntityListFunc(pageNum * $scope.pageSize, $scope.pageSize,$scope.searchEntityWords);
			$this.parent("li").addClass("active").siblings("li").removeClass("active");
		}
	});
	
	//回车搜索意图
	$scope.searchEntityWordsNameKeydownFunc = function($event, searchEntityWords){
		if($event.keyCode == 13){
			$scope.getEntityListFunc(0, $scope.pageSize, searchEntityWords);
		}
	}
	//点击搜索按钮搜索意图
	$scope.searchEntityWordsNameFunc = function(searchEntityWords){
		$scope.getEntityListFunc(0, $scope.pageSize, searchEntityWords);
	}
	//分页 end
	
	$('[data-toggle="popover"]').click(function(){
		var $this = $(this);
		var $popover_content = $(".popover-content");
		setTimeout(function(){
			if($popover_content.attr("class")){
				//$this.popover('hide');
			}else{
				$this.popover('show');
			}
		}, 200);
	});
};