var statisticsApp = angular.module("statisticsApp",[]);

statisticsApp.controller("statisticsCtrl",function($scope){
	//数据总览 start
	$scope.getDataOverviewFunc = function(){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/super/background/overview",
			method: "get",
			success: function(data){
				data = dataParse(data);
				if(data.code == 0){
					$scope.dataOverview = data.result;
					$scope.$apply();
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	}
	$scope.getDataOverviewFunc();
	//数据总览 end
	
	//获得整体趋势 start
	$scope.getOverallTrendFunc = function(result){
		$('#overall-trend').highcharts({
			title: {
				text: '',
				x: -20 //center
			},
			subtitle: {
				text: '',
				x: -20
			},
			xAxis: {
				categories: result.dateList
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
				name: '新增用户',
				data: result.dailyNewAddUsersCountList,
				color:'#2B908F'
			}, {
				name: '活跃用户',
				data: result.dailyActvieUsersCountList,
				color:'#90EE7E'
			}, {
				name: '新增交互数',
				data: result.dailyNewAddFaqCountList,
				color:'#7798BF'
			}, {
				name: '活跃机器人',
				data: result.dailyAvtiveBotCountList,
				color:'#F45B5B'
			}]
		});
	}
	$scope.getOverallTrendAjaxFunc = function(){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/super/overall/trend",
			method: "get",
			success: function(data){
				data = dataParse(data);
				if(data.code == 0){
					$scope.getOverallTrendFunc(data.result);
					$scope.$apply();
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	}
	$scope.getOverallTrendAjaxFunc();
	//获得整体趋势 end
	
	//机器人概况 start
	$scope.getRobotProfileFunc = function(type){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/super/over/view/bot",
			data:{"type": type},
			method: "get",
			success: function(data){
				data = dataParse(data);
				if(data.code == 0){
					$scope.robotProfileList = data.result.list;
					$scope.$apply();
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	}
	$scope.getRobotProfileFunc("allUsersCount");
	//机器人概况 end
	
	$(".sort-condition-box button").click(function(){
		var $this = $(this);
		var dataType = $this.attr("data-type");
		$this.addClass("active").siblings("button").removeClass("active");
		$scope.getRobotProfileFunc(dataType);
	});
	
	$("[data-act=robot-profile]").click(function(){
		window.location.href = "robot.html";
	});
	

	$("[data-act=skill-plugin-new]").click(function(){
		window.location.href = "skill-plugin-new.html";
	});
	
});






