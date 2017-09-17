function userLogListFunc($rootScope,$scope, $state, $stateParams){
	//针对需要被超级后台用iframe嵌入，做特殊处理 start
	if(getCookie("currentCheckedAppId") && RequestTwo.implantInfoManagement == "yes"){
		appId = getCookie("currentCheckedAppId");
	}
	//针对需要被超级后台用iframe嵌入，做特殊处理 end
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-log]").addClass("active");
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	}, 200);
	
	$rootScope.logStatLoadedFlag = false;
	
	$scope.pageSize = 15;
	
	//设置app名称
	$scope.appName = getCookie("appName");
	
	/**
	 * 动态设置中间列，存放用户说的p标签的宽度
	 */
	var setWidthFunc = function(){
		var centerListWidth = ($(".center-list-box").css("width")).replace("px","");
		centerListWidth = parseInt(centerListWidth);
		$(".user-log-box li .user-intent p").css("width",(centerListWidth - 104) + "px");
	}
	
	//查询日志详情
	$scope.goUserLogsFunc = function(user_id){
		window.location.href = "#/user_log_list" + "/user_logs/" + user_id;
		$(".statistics-box").siblings("hr").hide();
	}
	
	//获得用户列表
	$scope.getUserListFunc = function(){
		//TODO 记得提交代码的时候注释掉 chenxu start
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/v2/"+ appId +"/user",
			data:{"size":$scope.pageSize},
			method: "GET",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					$scope.userList = data.result;
					//为了解决userId中含有:号的问题
					for(var i in $scope.userList){
						$scope.userList[i].id = $scope.userList[i].id.replace(/:/g,"爨");
					}
					
					$scope.$apply();
					setTimeout(function(){
						setWidthFunc();
					}, 200);
					
					//分页
					var loadPageId = 1;
					var $loadMoreBox = true;
					
					$(".center-list-main").on("scroll",function(e){
						var $this = $(this);
						var scrollTopsize = $this[0].scrollTop;
						var scrollHeightsize = $this[0].scrollHeight;
						var board_boxsize = $this.height();
						if (scrollTopsize >= (scrollHeightsize - board_boxsize - 30) && $loadMoreBox == true ) {
							var gmtUpdate = $scope.userList[$scope.userList.length - 1].gmtUpdate;
							$loadMoreBox = false;
							$.ajax({
								url: ruyiai_host + "/ruyi-ai/v2/"+ appId +"/user",
								data:{"size":$scope.pageSize,"beforeTime":gmtUpdate},
								method: "GET",
								success: function(data) {
									data = dataParse(data);
					if(data.code == 0){
										var userList = data.result;
										if(userList.length > 0){
											for(var i in userList){
												userList[i].id = userList[i].id.replace(/:/g,"爨");
												$scope.userList.push(userList[i]);
											}
											loadPageId++;
											$loadMoreBox = true;
											$scope.$apply();
											setTimeout(function(){
												setWidthFunc();
											}, 200);
										}else{
											$loadMoreBox = false;
										}
									}else if(data && data.code == 2){
										goIndex();
									}
								}
							});
						}
					})
					
					//进入到第一个用户日志列表中
					if(window.location.href.indexOf("user_logs") == -1 && $scope.userList[0]){
						$scope.goUserLogsFunc($scope.userList[0].id);
					}
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
		//TODO 记得提交代码的时候注释掉 chenxu end
		//TODO 记得提交代码的时候注释掉 chenxu start
		//		var data = '{ "msg": "success", "result": [{ "city": "", "confidenceCount": [10, 30, 20, 1], "gmtCreate": "1454394487428", "gmtUpdate": "1424192387428", "headImg": "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAPzdB4G333bK6xzia9Zd2LDrzngnmL7mxztXceejTLSooGDJthaj20h5sJvyRJJQT23ZhXGhHAlPw/0", "id": "o6k7mwbtCLmGJXxPXi3yGRhbDg9o", "lastSentence": "请问你今年几岁？请问你今年几岁？请问你今年几岁？请问你今年几岁？请问你今年几岁？", "nickname": "张三", "sex": "FEMALE", "userSource": "WECHAT", "lastContent": "1458531127000" }, { "city": "上海黄浦区", "confidenceCount": [13, 30, 20, 9], "gmtCreate": "1454394487428", "gmtUpdate": "1454394487428", "headImg": "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAPzdB4G333bK6xzia9Zd2LDrzngnmL7mxztXceejTLSooGDJthaj20h5sJvyRJJQT23ZhXGhHAlPw/0", "id": "o6k7mwbtCLmGJXxPXi3yGRhbDg91", "lastSentence": "请问你是逗比吗？", "nickname": "李四", "sex": "", "userSource": "WECHAT", "lastContent": "1458617527000" }], "code": 0 }';
//		
//		$scope.userList = data.result;
//		setTimeout(function(){
//			setWidthFunc();
//		}, 10);
//		//进入到第一个用户日志列表中
//		if(window.location.href.indexOf("user_logs") == -1){
//			$scope.goUserLogsFunc($scope.userList[0].id);
//		}
		//TODO 记得提交代码的时候注释掉 chenxu end
	}
	$scope.getUserListFunc();
	
	$(window).resize(function() {
		setWidthFunc();
	});
	
};










