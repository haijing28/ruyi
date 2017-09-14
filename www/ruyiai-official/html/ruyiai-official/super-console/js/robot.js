var robotApp = angular.module("robotApp",[]);

robotApp.controller("robotCtrl",function($scope){
	$scope.globalAppId = "";
	$scope.searchRobot = Request.appName;
	$scope.email = Request.email;
	setTimeout(function(){
		$("#search-robot").focus();
		$("#search-robot").select();
	}, 200);
	
	//查询机器人列表 start
	$scope.getRobotProfileListFunc = function(type){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/super/over/view/bot",
			data:{"type": type},
			method: "get",
			success: function(data){
				data = dataParse(data);
				if(data.code == 0){
					$scope.robotProfileList = data.result.list;
					$scope.$apply();
					//若没有appId这个参数，则默认选中列表中的第一个 start
					if(!Request.appId){
						$("[data-act=robot-id-"+ $scope.robotProfileList[0].appId +"]").addClass("active");
						 $scope.getRobotProfileDataFunc($scope.robotProfileList[0].appId);
						 $scope.email = $scope.robotProfileList[0].email;
						 $scope.globalAppId = $scope.robotProfileList[0].appId;
					}else{
						$("[data-act=robot-id-"+ Request.appId +"]").addClass("active");
						$scope.getRobotProfileDataFunc(Request.appId);
					}
					//若没有appId这个参数，则默认选中列表中的第一个 start
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	}
	$scope.getRobotProfileListFunc("allUsersCount");
	//查询机器人列表 end
	
	$(".robot-profile-filter li").click(function(){
		var $this = $(this);
		var type = $this.attr("data-type");
		$scope.getRobotProfileListFunc(type);
	});
	
	$scope.robotProfileListFilter = function(robotProfile){
		if(robotProfile.name && robotProfile.name.indexOf($scope.searchRobot) > -1){
			return true;
		}else{
			if(!$scope.searchRobot){
				return true;
			}else{
				return false;
			}
		}
	}
	
	//绘制柱状图
	var drawbarchatFunc = function(result){
		$('#tendency-chart').highcharts({
	        title: {
	            text: '',
	            x: -20 //center
	        },
	        subtitle: {
	            text: '',
	            x: -20
	        },
	        xAxis: {
	            categories: result.dataList
	        },
	        yAxis: {
	            title: {
	                text: ''
	            },
	            plotLines: [{
	                value: 0,
	                width: 1,
	                color: '#808080'
	            }]
	        },
	        tooltip: {
	            valueSuffix: ''
	        },
	        legend: {
	            layout: 'vertical',
	            align: 'right',
	            verticalAlign: 'middle',
	            borderWidth: 0
	        },
	        series: [{
	            name: '活跃用户',
	            data: result.activeUserList,
	            color:'#F7A35C'
	        }, {
	            name: '新增用户',
	            data: result.newAddUserCountList,
	            color:'#90ED7D'
	        }, {
	            name: '新增交互',
	            data: result.msgCountList,
	            color:'#7DB6EC'
	        }]
	    });
	}
	
	//转换扇形数据
	var parseRateDateFunc = function(result){
		var rateList = [];
		for(var i in result){
			var rateObj = [result[i].name + "(" + result[i].count + ")",parseInt(result[i].count)];
			rateList.push(rateObj);
		}
		return rateList;
	}
	 
	//技能插件调用情况，扇形图 start
	//绘制饼图
	var drawPiechatFunc = function(result){
		var rateList = parseRateDateFunc(result);
		$('#robot-call-analysis').highcharts({
	        chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false
	        },
	        title: {
	            text: ''
	        },
	        tooltip: {
	            pointFormat: '{point.value}{series.count}{series.name}<b>-{point.percentage:.1f}%</b>'
	        },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name}</b>-{point.percentage:.1f} %',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    }
	                }
	            }
	        },
	        series: [{
	            type: 'pie',
	            name: '调用比例',
	            data: rateList
	        }]
	    });
	}
	
	$("[data-act=overall-situation]").click(function(){
		window.location.href = "statistics.html";
	});
	
	$("[data-act=skill-plugin]").click(function(){
		window.location.href = "skill-plugin.html";
	});
	$("[data-act=skill-plugin-new]").click(function(){
		window.location.href = "skill-plugin-new.html";
	});
	 
	//获取所有技能插件 start
	 $scope.getAllSkillFunc = function(){
		 if(!$scope.allSkill || $scope.allSkill.length == 0){
			 $.getJSON("js/skill-store.json", function(data) {
				 $scope.allSkill = data;
				 $scope.$apply();
			 });
		 }
	 }
	 $scope.getAllSkillFunc();
	//获取所有技能插件 end
	 
	 //获取机器人基本信息 start
	 $scope.getRobotProfileFunc = function(appId){
		//获取app信息
		$.ajax({
			url : ruyiai_host + "/ruyi-ai/app/" + appId,
			method : "get",
			success: function(data) {
				data = dataParse(data);
				if(data.code == 0){
					$scope.currentRobot = data.result;
					$scope.referencedAppList = [];
					for(var i in $scope.currentRobot.referencedApp){
						for(var j in $scope.allSkill ){
							if($scope.currentRobot.referencedApp[i] == $scope.allSkill[j].id){
								$scope.referencedAppList.push($scope.allSkill[j]);
								break;
							}
						}
					}
					$scope.$apply();
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	 }
	//获取机器人基本信息 end
	 
	//获取数据概要 start
	$scope.getStatisticsDataFunc = function(type,appId){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/app/stat2/" + appId,
			data: {"type":type},
			method: "GET",
			success: function(data){
				if(data){
				data = dataParse(data);
				if(data.code == 0){
						$scope.statistics = data.result;
						$scope.$apply();
					}
					else if(data.code == 2){
						goIndex();
					}else{
						if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
					}
				}
			}
		});
	}
	
	//获取数据趋势 start
	$scope.getTendencyChartFunc = function(type,appId){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/app/tendency/chart",
			data: {"appId":appId,"type":type},
			method: "GET",
			success: function(data){
				//绘制柱状图
				drawbarchatFunc(data.result);
			}
		})
	};
	//获取数据趋势 end
	
	//获得技能插件调用比例 start
	$scope.getSysRobotRateFunc = function(type,appId){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/app/skill/request/spread",
			data: {"appId":appId,"type":type},
			method: "GET",
			success: function(data){
				//绘制柱状图
				drawPiechatFunc(data.result);
			}
		})
	};
	//获得技能插件调用比例 end
	
	//获取数据概要 end
	 //获取机器人概要信息 start
	 $scope.getRobotProfileDataFunc = function(appId){
		 $scope.globalAppId = appId;
		 //获取机器人基本信息
		 $scope.getRobotProfileFunc(appId);
		 //获取数据概要
		 $scope.getStatisticsDataFunc("today",appId);
		 //获取数据趋势
		 $scope.getTendencyChartFunc("week",appId);
		//获取技能插件调用情况
		 $scope.getSysRobotRateFunc("today",appId);
		 $("[data-act=data-profile]").find("[data-type=today]").addClass("active").siblings().removeClass("active");
		 $("[data-act=data-trend]").find("[data-type=week]").addClass("active").siblings().removeClass("active");
		 $("[data-act=call-analysis]").find("[data-type=today]").addClass("active").siblings().removeClass("active");
	 }
	//获取机器人概要信息 end
	 
	 //点击切换机器人
	 $scope.robotProfileClick = function(appId,email){
		 $("[data-act=robot-id-"+ appId +"]").addClass("active").siblings().removeClass("active");
		 $scope.email = email;
		 $scope.getRobotProfileDataFunc(appId);
	 }
	 
	 //切换数据概要 start
	 $("[data-act=data-profile] button").click(function(){
		 var $this = $(this);
		 var type = $this.attr("data-type");
		 $this.addClass("active").siblings("button").removeClass("active");
		 $scope.getStatisticsDataFunc(type,$scope.globalAppId);
	 });
	 //获取数据概要 end
	 
	//切换数据趋势 start
	 $("[data-act=data-trend] button").click(function(){
		 var $this = $(this);
		 var type = $this.attr("data-type");
		 $this.addClass("active").siblings("button").removeClass("active");
		//获取数据趋势
		 $scope.getTendencyChartFunc(type,$scope.globalAppId);
	 });
	 //获取数据趋势 end
    
	//切换技能插件调用情况 start
	 $("[data-act=call-analysis] button").click(function(){
		 var $this = $(this);
		 var type = $this.attr("data-type");
		 $this.addClass("active").siblings("button").removeClass("active");
		//获取技能插件调用情况
		 $scope.getSysRobotRateFunc(type,$scope.globalAppId);
	 });
	 //切换技能插件调用情况 end
	 
	 //删除账号 start
	 $("[data-act=delete-account]").click(function(){
		 var $this = $(this);
		 var appName = $this.attr("data-app-name");
		 $.confirm({
			"text": "你确定要删除 '"+ appName +"' 吗？",
	        "title": "删除",
	        "ensureFn": function() {
	        	$.ajax({
	        		url : ruyiai_host + "/ruyi-ai/app/" + $scope.globalAppId,
	        		method : "DELETE",
	        		success: function(data) {
	        			data = dataParse(data);
				if(data.code == 0){
	        				$.trace("删除成功","success");
	        				window.location.href = static_host + "/robot.html";
	        			}else if(data.code == 2){
	        				goIndex();
	        			}else if(data.code == 1){
	        				$.trace(""+data.msg);
	        			}
	        		}
	        	});
	        }
		});
	 });
	//删除账号 end
	 function setAccountInfoModalFunc(){
		 $("[data-act=modal-body]").css("height",($(document.body).height() - 116) + "px");
	 }
     $('#account-info').on('shown.bs.modal', function () {
		 setAccountInfoModalFunc();
	 });
     function setInfoManagementModalFunc(){
    	 console.log("window width:" + $(document.body).width());
    	 $("[data-act=info-management-body]").css("height",($(document.body).height() - 116) + "px");
    	 $("[data-act=info-management-content]").css("width",($(document.body).width() - 100) + "px");
    	 $("[data-act=info-management-content]").css("margin-left", "-" + (($(document.body).width() - 200)/2 - 250) + "px");
     }
     
     $("[data-act=info-management-trigger]").click(function(){
    	 $("[data-act=info-management-body]").empty();
    	 setInfoManagementModalFunc();
    	 setCookie("currentCheckedAppId",$scope.globalAppId);
    	 $("[data-act=info-management-body]").append('<iframe name="info-management-iframe" id="info-management-iframe" src="../console/api_manager.html#/user_log_list?implantInfoManagement=yes"></iframe>');
    	 $('#Interaction-info-management').modal("show");
     });
     
     $('#Interaction-info-management').on('shown.bs.modal', function () {
	 });
     
     $(window).resize(function() {
    	 setAccountInfoModalFunc();
    	 setInfoManagementModalFunc();
     });
});






