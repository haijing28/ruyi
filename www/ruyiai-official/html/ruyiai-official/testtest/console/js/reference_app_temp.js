function referenceAppCtrl($rootScope,$scope, $state, $stateParams){
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-reference]").addClass("active");
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	}, 200);
	$('[data-toggle="popover"]').popover();
	
	$(".edit-service").click(function(){
		$(".selected-service-box").css("display","none");
		$(".all-service-box").css("display","block");
		setTimeout(function(){
			setServiceTableSetFunc();
		}, 10);
	});
	
	//已经引用的app
	$scope.referencedAppIds = [];
	$(window).resize(function() {
		setServiceTableSetFunc();
	});
	var setServiceTableSetFunc = function(){
		var choosedHeight = $(".choosed-service-box").css("height");
		if(choosedHeight){
			choosedHeight = choosedHeight.replace("px","");
			choosedHeight = parseInt(choosedHeight);
		}
		var documentHeight = $(document).height();
		if(documentHeight <= 620){
			$(".confirm-service").css("bottom","50px");
		}else if(documentHeight > 620 && documentHeight <= 720){
			$(".confirm-service").css("bottom","40px");
		}else{
			$(".confirm-service").css("bottom","20px");
		}
		$("[data-act=service-table-set]").css("height",$(document).height() - choosedHeight - 155 -80);
		$("[data-act=service-table-set]").css("height",$(document).height() - choosedHeight - 155 -80);
	}
	setServiceTableSetFunc();
	
	//获取app详情
	$scope.getAppDetailFunc = function(checkReferencedFunc){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/app/" + appId,
			method: "GET",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					$scope.appDetail = data.result;
					$scope.referencedAppIds = $scope.appDetail.referencedApp;
					$scope.$apply();
					if($scope.referencedAppIds && $scope.referencedAppIds.length > 0){
						$(".selected-service-box").css("display","block");
						$scope.fetchReferenceFunc($scope.referencedAppIds);
					}else{
						$(".all-service-box").css("display","block");
						$scope.fetchReferenceFunc();
					}
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	}
	$scope.getAppDetailFunc();
	
	//引用的AppList
	var referencedAppList = [];
	$scope.referencedAppList = [];
	
	//获取系统app
	$scope.fetchReferenceFunc = function(referencedAppIds){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/app/public/list",
			data:{"limit":100},
			method: "GET",
			success: function(data){
				
				//TODO 临时开启 chenxu
				//data = { code: 0, msg: "成功", result: [{id: "c1f12d91-b204-41c0-915d-cff454876d6e",appName: "test",appDesc: "test",appEnv: "TEST",appStatus: "VALID",appKey: "8485a761-c7c4-4c5e-93e0-89dd1b9b4d3c",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-02T14:51:44",gmtUpdate: "2016-02-02T14:51:44",appLevel: "PRIVATE"}, {id: "be9b29a3-09a3-442e-af66-021334cdbcfc",appName: "account",appDesc: "account",appEnv: "TEST",appStatus: "VALID",appKey: "e05c4534-9280-4e03-bd60-5d38d3f7fb6b",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-02T14:52:03",gmtUpdate: "2016-02-02T14:52:03",appLevel: "PRIVATE"}, {id: "f9e313f9-0247-4d88-b3b3-709a9bdca486",appName: "control control control control",appDesc: "control control control control",appEnv: "TEST",appStatus: "VALID",appKey: "ddd650b5-053d-4f8a-b07d-eddcb4bc679f",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-02T14:52:11",gmtUpdate: "2016-02-02T14:52:11",appLevel: "PRIVATE"}, {id: "d8aa911c-9b74-4303-89ae-8322b22ad5c2",appName: "词典专属",appDesc: "词典专属",appEnv: "TEST",appStatus: "VALID",appKey: "5b5c2e5e-a07d-4fd6-aa4c-2a7e4009bc3a",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-02T14:52:39",gmtUpdate: "2016-02-02T14:52:39",appLevel: "PRIVATE"}, {id: "80e89fee-0a80-4a68-a76c-ff1c521d7293",appName: "星座  星座 星座 星座",appDesc: "星座  星座 星座 星座",appEnv: "TEST",appStatus: "VALID",appKey: "9f1033da-1fdd-4d18-9f75-cd6a8abeddf5",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-03T18:10:05",gmtUpdate: "2016-02-03T18:10:05",appLevel: "PRIVATE"}, {id: "ba1c40f2-e84b-4907-92f2-5fdc9dabaef8",appName: "塔罗",appDesc: "塔罗",appEnv: "TEST",appStatus: "VALID",appKey: "0084b616-484f-45cb-bd5e-a9815eae2759",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-03T18:10:36",gmtUpdate: "2016-02-03T18:10:36",appLevel: "PRIVATE"}, {id: "36c9755b-988f-4869-8d09-c4144ec89958",appName: "八字合婚  八字合婚  八字合婚  八字合婚",appDesc: "八字合婚  八字合婚  八字合婚  八字合婚",appEnv: "TEST",appStatus: "VALID",appKey: "8c7d1afa-510c-4012-8f0d-2f42bad1cd7c",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-03T18:11:33",gmtUpdate: "2016-02-03T18:11:33",appLevel: "PRIVATE"}, {id: "96526444-c8cc-452f-bee2-4d7863172a31",appName: "生肖",appDesc: "生肖",appEnv: "TEST",appStatus: "VALID",appKey: "be4ef44b-f778-42fc-8ed3-2b0e146464ea",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-03T18:12:01",gmtUpdate: "2016-02-03T18:12:01",appLevel: "PRIVATE"}, {id: "2afa1af9-92b3-46a6-b881-dc3c6466a49b",appName: "袁天罡称骨算命 袁天罡称骨算命 袁天罡称骨算命",appDesc: "袁天罡称骨算命 袁天罡称骨算命 袁天罡称骨算命",appEnv: "TEST",appStatus: "VALID",appKey: "b907cd7e-cc19-488c-b206-fc459cc56b9b",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-03T18:13:15",gmtUpdate: "2016-02-03T18:13:15",appLevel: "PRIVATE"}, {id: "3a548c4c-20ba-40f8-8ad2-de7244840486",appName: "灯谜",appDesc: "灯谜",appEnv: "TEST",appStatus: "VALID",appKey: "cd8acccd-6c04-4924-8d5f-c20e20f84c14",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-16T12:34:02",gmtUpdate: "2016-02-16T12:34:02",appLevel: "PRIVATE"}, {id: "b33541ef-dd16-4ff2-ab42-0e8a13d04047",appName: "儿童问答",appDesc: "儿童问答",appEnv: "TEST",appStatus: "VALID",appKey: "4a0ddee1-fba9-4e41-8787-59af7e8835ff",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-22T18:33:04",gmtUpdate: "2016-02-22T18:33:04",appLevel: "PRIVATE"},{id: "be9b29a3-09a3-442e-af66-021335cdbcfc",appName: "account",appDesc: "account",appEnv: "TEST",appStatus: "VALID",appKey: "e05c4534-9280-4e03-bd60-5d38d3f3fb6b",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-02T14:52:03",gmtUpdate: "2016-02-02T14:52:03",appLevel: "PRIVATE"}, {id: "f9e313f9-0247-4d88-b3b3-709a9bdca286",appName: "control control control control",appDesc: "control control control control",appEnv: "TEST",appStatus: "VALID",appKey: "ddd650b5-053d-4f8a-b07d-eddsb4bc679f",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-02T14:52:11",gmtUpdate: "2016-02-02T14:52:11",appLevel: "PRIVATE"}, {id: "d8aa911c-2b74-4303-89ae-8322b22ad5c2",appName: "词典专属",appDesc: "词典专属",appEnv: "TEST",appStatus: "VALID",appKey: "525c2e5e-a07d-4fd6-aa4c-2a7e4009bc3a",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-02T14:52:39",gmtUpdate: "2016-02-02T14:52:39",appLevel: "PRIVATE"}, {id: "80e89fee-0a8s-4a68-a76c-ff1c521d7293",appName: "星座  星座 星座 星座",appDesc: "星座  星座 星座 星座",appEnv: "TEST",appStatus: "VALID",appKey: "9f1033da-1fdd-4de8-9f75-cd6a8abeddf5",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-03T18:10:05",gmtUpdate: "2016-02-03T18:10:05",appLevel: "PRIVATE"}, {id: "ba1c40f2-e84b-r907-92f2-5fdc9dabaef8",appName: "塔罗",appDesc: "塔罗",appEnv: "TEST",appStatus: "VALID",appKey: "0084b616-484f-4ecb-bd5e-a9815eae2759",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-03T18:10:36",gmtUpdate: "2016-02-03T18:10:36",appLevel: "PRIVATE"}, {id: "36c97d5b-988f-4869-8d09-c4144ec89958",appName: "八字合婚  八字合婚  八字合婚  八字合婚",appDesc: "八字合婚  八字合婚  八字合婚  八字合婚",appEnv: "TEST",appStatus: "VALID",appKey: "8g7d1afa-510c-4012-8f0d-2f42bad1cd7c",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-03T18:11:33",gmtUpdate: "2016-02-03T18:11:33",appLevel: "PRIVATE"}, {id: "96526444-c8cc-452f-bed2-4d7863172a31",appName: "生肖",appDesc: "生肖",appEnv: "TEST",appStatus: "VALID",appKey: "be4ef44b-f778-g2fc-8ed3-2b0e146464ea",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-03T18:12:01",gmtUpdate: "2016-02-03T18:12:01",appLevel: "PRIVATE"}, {id: "2afa1af9-92b3-4ga6-b881-dc3c6466a49b",appName: "袁天罡称骨算命 袁天罡称骨算命 袁天罡称骨算命",appDesc: "袁天罡称骨算命 袁天罡称骨算命 袁天罡称骨算命",appEnv: "TEST",appStatus: "VALID",appKey: "b907cd7e-cc19-488c-b20d-fc459cc56b9b",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-03T18:13:15",gmtUpdate: "2016-02-03T18:13:15",appLevel: "PRIVATE"}, {id: "3a548c4g-20ba-40f8-8ad2-de7244840486",appName: "灯谜",appDesc: "灯谜",appEnv: "TEST",appStatus: "VALID",appKey: "cd8acccd-6c04-4d24-8d5f-c20e20f84c14",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-16T12:34:02",gmtUpdate: "2016-02-16T12:34:02",appLevel: "PRIVATE"}, {id: "b33541es-dd16-4ff2-ab42-0e8a13d04047",appName: "儿童问答",appDesc: "儿童问答",appEnv: "TEST",appStatus: "VALID",appKey: "4a0dgee1-fba9-4e41-8787-59af7e8835ff",appDeveloperId: "SYSTEM_USER_ID",appDeveloperObject: {id: "SYSTEM_USER_ID",email: "ruyi_sys@ruyi.ai",contact: "ruyi_sys",telephone: "11111111111",gmtCreate: "2016-02-02T14:02:03",username: "ruyi_sys",level: "PERSON"},referencedApp: [],gmtCreate: "2016-02-22T18:33:04",gmtUpdate: "2016-02-22T18:33:04",appLevel: "PRIVATE"}]};
				data = dataParse(data);
					if(data.code == 0){
					if(data.result && data.result.length > 0){
						$scope.publicAppList = data.result;
						//如果已经勾选了领域服务，则根据领域服务的id查找领域服务对象
						if(referencedAppIds && referencedAppIds.length > 0){
							for(var i in referencedAppIds){
								for(var j in $scope.publicAppList){
									if(referencedAppIds[i] == $scope.publicAppList[j].id){
										referencedAppList.push($scope.publicAppList[j]);
										$scope.publicAppList.splice(j,1);
										break;
									}
								}
							}
							$scope.referencedAppList = referencedAppList;
						}
						$scope.$apply();
					}
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	}
	
	//选择一个领域服务
	$scope.selectAppServiceFunc = function(appId){	
		var appObj = {};
		for(var i in $scope.publicAppList){
			if($scope.publicAppList[i].id == appId){
				appObj = $scope.publicAppList[i];
				$scope.publicAppList.splice(i,1);
			}
		}
		$scope.referencedAppList.push(appObj);
		var choosed_height = $(".choosed-service-box").height();
		var service_height = 534 - choosed_height;
		$(".chose-line .service-table").css("height",service_height + "px");
		setServiceTableSetFunc();
	}
	
	//删除一个领域服务
	$scope.removeAppServiceFunc = function(appId){
		var appObj = {};
		for(var i in $scope.referencedAppList){
			if($scope.referencedAppList[i].id == appId){
				appObj = $scope.referencedAppList[i];
				$scope.referencedAppList.splice(i,1);
			}
		}
		$scope.publicAppList.push(appObj);
	}
	
	//更新app信息
	$scope.updateAppInfoFucn = function(){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/app/" + appId,
			data: JSON.stringify($scope.appDetail),
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			method: "PUT",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					$(".selected-service-box").css("display","block");
					$(".all-service-box").css("display","none");
					callAgentReloadTestFunc(); //通知nlp reload
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	}
	
	//点击确定按钮
	$scope.submitServiceApp = function(){
		var referencedApp = [];
		for(var i in $scope.referencedAppList){
			referencedApp.push($scope.referencedAppList[i].id);
		}
		$scope.appDetail.referencedApp = referencedApp;
		$scope.updateAppInfoFucn();
		$(".selected-service-box").css("display","block");
		$(".all-service-box").css("display","none");
		  
	}
	
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
	
	//拖拽排序
	$(".sortable" ).sortable();
    $(".sortable" ).disableSelection();
    
    //拖动排序后
    $('.sortable').sortable({ stop: function(event, ui) {
    	var referencedAppIdTemp = [];
    	var referencedAppListTemp = [];
    	var $selectedTrObjList = $("[data-act=selected-tr]");
    	$.each($selectedTrObjList, function(n, selectedTrObj) {
    		var $selectedTrObj = $(selectedTrObj);
    		referencedAppIdTemp.push($selectedTrObj.attr("data-id"));
    	}); 
    	
    	for(var i in referencedAppIdTemp){
    		for(var j in $scope.referencedAppList){
    			if(referencedAppIdTemp[i] == $scope.referencedAppList[j].id){
    				referencedAppListTemp.push($scope.referencedAppList[j]);
    				break;
    			}
    		}
    	}
    	$scope.referencedAppList = referencedAppListTemp;
    	$scope.$apply();
    	
    	//排序之后提交
    	$scope.appDetail.referencedApp = referencedAppIdTemp;
		$scope.updateAppInfoFucn();
    	
    } }); 
    
}











