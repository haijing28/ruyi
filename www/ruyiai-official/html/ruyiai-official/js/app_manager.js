var appManagerApp = angular.module("appManagerApp",[]);
appManagerApp.controller("appManagerAppCtrl",function($rootScope,$scope){
	$rootScope.ruyi_api_help = "http://docs.ruyi.ai";
	$('[data-toggle="popover"]').popover();
	$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	var userId = getCookie("userId");
	var email = getCookie("email");
//	if(email == "ruyi_sys@ruyi.ai"){
	if(email == "chenx@ruyi.ai"){
		$scope.userType = "system_user";
	}else{
		$scope.userType = "normal_user";
	}
	
	//判断如果是新创建的bot，则弹出提示框
	var createRobot = getCookie("createRobot");
	if(createRobot && createRobot == "true"){
		$scope.newRobotAppId = getCookie("appId");
		$scope.newRobotAppName = getCookie("appName");
		$("#new_robot_appid").modal("show");
	}
	
	//点击进入新手引导
	$scope.newUserGuideClick = function(){
		setCookie("isOldUser","false");
		window.location.href = "console/api_manager.html#/robot_paramenter";
	}
	
	//点击我是老用户
	$scope.oldUserClick = function(){
		setCookie("createRobot","false");
		setCookie("isOldUser","true");
		$("#new_robot_appid").modal("hide");
	}
	
	function myBrowser(){
	    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	    var isOpera = userAgent.indexOf("Opera") > -1;
	    if (isOpera) {
	        return "Opera"
	    }; //判断是否Opera浏览器
	    if (userAgent.indexOf("Firefox") > -1) {
	        return "FF";
	    } //判断是否Firefox浏览器
	    if (userAgent.indexOf("Chrome") > -1){
		  return "Chrome";
		 }
	    if (userAgent.indexOf("Safari") > -1) {
	        return "Safari";
	    } //判断是否Safari浏览器
	    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
	        return "IE";
	    }; //判断是否IE浏览器
	}
	//以下是调用上面的函数
	var mb = myBrowser();
	
	//获取app列表
	var appkeyManagerFunc = function(){
		
	 	$.ajax({
		 	url : ruyiai_host + "/ruyi-ai/app/query/uidV2",
		 	method : "get",
		 	xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
		 	success: function(data,status,xhr) {
		 		data = dataParse(data);
		 		if(data.code == 0){
					$scope.appList = data.result;
					$scope.$apply();
					$('[data-toggle="tooltip"]').tooltip(); //初始化提示
					$('[data-toggle="popover"]').popover();
					setTimeout(function(){
						if ("Safari" == mb) {
							$("[data-act=copy-btn]").remove();
						}
					}, 100);
				}else if(data.code == 2){
					goIndex();
				}
		 	},
		 	error:function(err){
		 		var err = JSON.parse(err.responseText);
		 		console.log(err.msg);
		 		goIndex();
		 	}
		});
	}

	appkeyManagerFunc();
	
	$("body").off("click","[data-act=goConsoleManager]").on("click","[data-act=goConsoleManager]",function(event){
		event.stopPropagation();
		var $this = $(this);
		var appId = $this.attr("data-app-id");
		var appName = $this.attr("data-app-name");
		var appKey = $this.attr("data-app-key");
		setCookie("appId",appId);
		setCookie("appName",appName);
		setCookie("appKey",appKey);
		window.location.href = static_host + "/console/api_manager.html#/log_statistics";
	});
	
	//添加新的app
	$scope.addAppFunc = function(){
		var setAppkeyInterval = setInterval(function(){
			$("#appkey-apply").css("display","block");
			$("#appkey-apply-info").css("display","none");
		}, 10);
		setTimeout(function(){
			clearInterval(setAppkeyInterval);
		}, 2000);
	}
	
	//关闭添加app页面后，整个页面自动刷新
	$('#appkey').on('hidden.bs.modal', function () {
		 location.reload();
	});
	
	$scope.goHomePage = function(){
		window.location.href = static_host + "/index.html";
	}
	
	$("body").off("click","[data-act=deleteapp]").on("click","[data-act=deleteapp]",function(event){
		event.stopPropagation();
		var $this = $(this);
		var appId = $this.attr("data-app-id");
		var appName = $this.attr("data-app-name");
		$.confirm({
			"text": '你确定要删除"'+appName+'"吗？',
	        "title": "删除",
	        "ensureFn": function() {
	        	$.ajax({
	    			url : ruyiai_host + "/ruyi-ai/app/" + appId,
	    			method : "DELETE",
	    			success: function(data) {
	    				
			data = dataParse(data);
		 		if(data.code == 0){
	    					for(var i in $scope.appList){
	    						if($scope.appList[i].appModel.id == appId){
	    							$scope.appList.splice(i,1);
	    						}
	    					}
	    					$scope.$apply();
	    				}else if(data.code == 2){
	    					goIndex();
	    				}else if(data.code == 1){
	    					$.trace(""+data.msg,"error");
	    					$r_username.focus();
	    				}
	    			}
	    		});
	        }
		});
	});
	

	$("body").off("click",".app-key-value").on("click",".app-key-value",function(event){
		event.stopPropagation();
		return false;
	});
	
	$("body").off("click","[data-act=editapp]").on("click","[data-act=editapp]",function(event){
		event.stopPropagation();
		var $this = $(this);
		var appId = $this.attr("data-app-id");
		$("#editApp").modal("show");
		$.ajax({
			url : ruyiai_host + "/ruyi-ai/app/" + appId,
			method : "get",
			success: function(data) {
				data = dataParse(data);
		 		if(data.code == 0){
					$("#edit_app_name").val(data.result.appName);
					$("#edit_app_service").val(data.result.serviceName);
					$("#edit_app_desc").val(data.result.appDesc);
					$("#edit_app_id").val(data.result.id);
				}else if(data.code == 2){
					goIndex();
				}
				$scope.editAppId = appId;
				$scope.$apply();
			}
		});
	});
	
	//确认编辑
	$scope.editAppSubmitFunc = function(){
		var $edit_app_name = $("#edit_app_name");
		var $edit_app_service = $("#edit_app_service");
		var $edit_app_desc = $("#edit_app_desc");
		var $edit_app_id = $("#edit_app_id");
		if($.trim($edit_app_name.val()).length == 0){
			$.trace("助理名称不能为空");
			$edit_app_name.focus();
			return false;
		}else if($.trim($edit_app_desc.val()).length == 0){
			$.trace("助理描述不能为空");
			$edit_app_desc.focus();
			return false;
		}
		$.ajax({
			url : ruyiai_host + "/ruyi-ai/app/" + $scope.editAppId,
			data: JSON.stringify({"id": $scope.editAppId,"appName": $edit_app_name.val(),"appDesc":$edit_app_desc.val(),"serviceName": $edit_app_service.val()}),
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			method: "PUT",
			success: function(data) {
				data = dataParse(data);
		 		if(data.code == 0){
					for(var i in $scope.appList){
						if($scope.appList[i].appModel.id == $scope.editAppId){
							$scope.appList[i].appModel.appName = $edit_app_name.val();
							$scope.appList[i].appModel.serviceName = $edit_app_service.val();
							$scope.appList[i].appModel.appDesc = $edit_app_desc.val();
							break;
						}
					}
					$scope.$apply();
				}else if(data.code == 2){
					goIndex();
				}
			}
		});
		$("#editApp").modal("hide");
	}
	
	
	////检测是否支持视频播放器/////////////
	function checkVideo() {
		var flag = false;
		if (!!document.createElement('video').canPlayType) {
			// 创建video元素
			var vidTest = document.createElement("video");
			// 检测是否可以播放ogg格式的视频
			var oggTest=vidTest.canPlayType('video/ogg; codecs="theora, vorbis"'); 
			if (!oggTest) {
				flag = false;
			} else {
				if (oggTest == "probably") {
					flag = true;
				} else {
					flag = false;
				}
			}
		} else {
			flag = false;
		}
		return flag;
	} 

	//写到这里
	if(Request.loginstatus == "firstlogin"){
		$("#video-list").modal('show');
	}
	
	$(".video-img").click(function(){
		var $this = $(this);
		var videoUrl = $this.attr("data-video-url");
		if(checkVideo()){
			$(".video-box").css("display","block");
			$("[data-act=video-iframe]").attr("src",static_host + "/help/video.html?mediaUrl=" + videoUrl);
		}else{
			window.open(videoUrl,"_blank");
		}
	});
	
	//关闭视频播放
	$(".video-box span").click(function(){
		$(".video-box").css("display","none");
		$("[data-act=video-iframe]").attr("src","");
		$("[data-act=video-iframe]").html("");
	});
	
	//esc关闭视频
	$(document).keyup(function(event){
		 if(event.keyCode == 27){
			$(".video-box").css("display","none");
			$("[data-act=video-iframe]").attr("src","");
			$("[data-act=video-iframe]").html("");
			$('[data-toggle="popover"]').popover('hide');
		 }
	});
	
	$('[data-act="popover"]').click(function(){
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
	
	$("body").click(function(event){
		var $target = $(event.target);
		if(!$target.is('[data-act="popover"]')){
			$('[data-act="popover"]').popover('hide');
		}
	});
	
	$("body").off("click","[data-act=msgapp]").on("click","[data-act=msgapp]",function(event){
		event.stopPropagation();
		var $this = $(this);
		var appId = $this.attr("data-app-id");
		var appName = $this.attr("data-app-name");
		var appKey = $this.attr("data-app-key");
		setCookie("appId",appId);
		setCookie("appName",appName);
		setCookie("appKey",appKey);
		window.location.href = static_host + "/console/api_manager.html#/user_log_list/user_logs/log_statistics";
	});
	
	$("body").off("click","[data-act=go-home]").on("click","[data-act=go-home]",function(event){
		window.location.href = "index.html";
	});
	
    setTimeout(function(){
    	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    	if (userAgent.indexOf("Firefox") > -1 || userAgent.indexOf("Chrome") > -1 || userAgent.indexOf("MSIE") > -1) {
    	}else{
    		$("[data-act=copy-btn]").remove();
    		$("[data-act=copy-link]").remove();
    	}
    }, 200);
	
	$("body").off("click","[data-act=click-copy]").on("click","[data-act=click-copy]",function(event){
		event.stopPropagation();
		var $this = $(this);
		var appkey = $this.closest("[data-act=goConsoleManager]").attr("data-app-key");
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	    if (userAgent.indexOf("Firefox") > -1 || userAgent.indexOf("Chrome") > -1 || userAgent.indexOf("MSIE") > -1) {
	    	 var myappkey=document.getElementById("myappkey");
	    	 myappkey.value= appkey;
	    	 myappkey.select(); // 选择对象
	    	 document.execCommand("Copy"); // 执行浏览器复制命令
	    	 $.trace("已复制，可直接贴粘。","success");
		 }else{
		 }
	});
	
	$scope.copyAppKeyFunc = function(appKey){
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	    if (userAgent.indexOf("Firefox") > -1 || userAgent.indexOf("Chrome") > -1 || userAgent.indexOf("MSIE") > -1) {
	    	 var myappkey=document.getElementById("myappkey");
	    	 myappkey.value= encodeURI(appKey);;
	    	 myappkey.select(); // 选择对象
	    	 document.execCommand("Copy"); // 执行浏览器复制命令
	    	 $.trace("已复制，可直接贴粘。","success");
		 }else{
			 
		 }
	}
	
	$scope.exportHtml5LinkFunc = function(appName,appId){
		$scope.htmlLink = static_host + "/h5-wechat/wechat.html?appName=" + appName + "&app_id=" + appId;
		$("#export-html5-link").modal("show");
	}
	
	// 复制html5链接
	 $("body").off("click","[data-act=copy-link]").on("click","[data-act=copy-link]",function(event){
			event.stopPropagation();
			var $this = $(this);
			var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		    if (userAgent.indexOf("Firefox") > -1 || userAgent.indexOf("Chrome") > -1) {
		    	 var html5Link=document.getElementById("html5-link");
		    	 html5Link.value= encodeURI($("#html5-link").val());
		    	 html5Link.select(); // 选择对象
		    	 document.execCommand("Copy"); // 执行浏览器复制命令
		    	 $.trace("已复制，可直接贴粘。","success");
			 }else{
			 }
	 });
	
	 $scope.goConsoleManagerFunc = function(appId,appName,appKey){
		setCookie("appId",appId);
		setCookie("appName",appName);
		setCookie("appKey",appKey);
		
		if(window.location.href.indexOf("testtest") > -1){
			window.location.href = "http://lab.ruyi.ai/ruyiai-official/testtest/console/api_manager.html";
		}else{
			if("isNewUser" == getCookie("app"+appId)){
				window.location.href = static_host + "/console/api_manager.html#/log_statistics";
			}else{
				window.location.href = static_host + "/console/api_manager.html#/log_statistics";
			}
		}
		
	 }
	 
	////检测是否支持视频播放器/////////////
	function checkVideo() {
		var flag = false;
		if (!!document.createElement('video').canPlayType) {
			// 创建video元素
			var vidTest = document.createElement("video");
			// 检测是否可以播放ogg格式的视频
			var oggTest=vidTest.canPlayType('video/ogg; codecs="theora, vorbis"'); 
			if (!oggTest) {
				flag = false;
			} else {
				if (oggTest == "probably") {
					flag = true;
				} else {
					flag = false;
				}
			}
		} else {
			flag = false;
		}
		return flag;
	} 
	 
	$("body").off("click","[data-act=create-robot-video]").on("click","[data-act=create-robot-video]",function(event){
		var $this = $(this);
		var data_src = $this.attr("data-src");
		window.open(data_src,"_blank");
	});
	
	$("[data-act=create-robot-video]").mouseover(function(){
		var $this = $(this);
		var mysrc = $this.attr("src").replace(".jpg","-hover.jpg");
		console.log("mysrc:" + mysrc);
		$this.attr("src",mysrc);
	});
	
	$("[data-act=create-robot-video]").mouseout(function(){
		var $this = $(this);
		var mysrc = $this.attr("src").replace("-hover","");
		console.log("mysrc1:" + mysrc);
		$this.attr("src",mysrc);
	});
	
	//登陆之后，获得用户信息
	$.ajax({
		url : ruyiai_host + "/ruyi-ai/getinfo",
		method : "get",
		success : function(data) {
			data = dataParse(data);
			if (data.code == 0) {
				setCookie("email", data.result.email);
				setCookie("userId", data.result.id);
			} else if (data.code == 2) {
				goIndex();
			} else {
				if (data.msg) {
					$.trace(data.msg + "( " + data.detail
							+ " )", "error");
				}
			}
		}
	});
	
	//登陆之后，获得用户信息
	$.ajax({
		url : ruyiai_host + "/ruyi-ai/getinfo",
		method : "get",
		success: function(data) {
			data = dataParse(data);
			if(data.code == 0){
				setCookie("email",data.result.email);
				setCookie("userId",data.result.id);
			}else if(data.code == 2){
				goIndex();
			}else{
				if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
			}
		}
	});
	
});





