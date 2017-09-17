function userLogsStatisticsCtrl($rootScope,$scope, $state, $stateParams){
	
	//appId = "f64dba56-66c2-46fe-ad44-08da7d2689f3";
	
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-log-statistics]").addClass("active");
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	}, 200);
	
	//转换扇形数据
	var parseRateDateFunc = function(result){
		var rateList = [];
		for(var i in result){
			var rateObj = [result[i].name + "(" + result[i].count + ")",parseInt(result[i].count)];
			rateList.push(rateObj);
		}
		return rateList;
	}
	
	//绘制饼图
	var drawPiechatFunc = function(result){
		var rateList = parseRateDateFunc(result);
		$('#call-rate').highcharts({
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
	
	var getTendencyChartFunc = function(type){
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
	getTendencyChartFunc("week");
	
	//设置app列表的高度
	function setDataStatisticsWidth(){
		if($(window).width() >= 990){
			$("#call-rate").css("width",($(window).width()/2-160) + "px");
			$("#tendency-chart").css("width",($(window).width()/2-160) + "px");
		}else{
			$("#call-rate").css("width","90%");
			$("#tendency-chart").css("width","90%");
		}
		$("#tendency-chart").css("height",($(window).height()-540) + "px");
		$("#call-rate").css("height",($(window).height()-520) + "px");
	}
	setDataStatisticsWidth();
	$(window).resize(function() {
		setDataStatisticsWidth();
	});
	
	//解析出数组
	var intentArrayFunc = function(statistics){
		var intentNames = [];
		var redRate = [];
		var yellowRate = [];
		var greenRate = [];
		$scope.intentNamesTemp = [];
		var intentRight = statistics.intent_right;
		var intentRightLength = intentRight.length;
		if(intentRight){
			for (var i=intentRightLength-1;i<intentRightLength;i--)//倒序排列
			{
				if(intentRight[i].name){
					intentNames.push(intentRight[i].name);
					$scope.intentNamesTemp.push({"name":intentRight[i].name});
					redRate.push(intentRight[i].rate[1]);
					yellowRate.push(intentRight[i].rate[2]);
					greenRate.push(intentRight[i].rate[3]);
				}
				if(i <= intentRightLength - 5 || i <= 0){ //倒序排列
					break;
				}
			}
		}
	}
	
	/**
	 * 获取日志的统计数据
	 */
	$scope.getStatisticsDataFunc = function(type){
		//TODO 记得提交代码的时候注释掉 chenxu start
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/app/stat2/" + appId,
			data: {"type":type},
			timeout : 2000, 
			method: "GET",
			success: function(data){
				if(data){
					data = dataParse(data);
					if(data.code == 0){
						data = data.result;
						$scope.statistics = data;
						//intentArrayFunc($scope.statistics);
						$("[data-act=tips-text]").css("display","none");
						$("[data-act=statistics-all-box]").css("display","block");
						$scope.$apply();
						$rootScope.$apply();
						//questionAaswerRate();
					}
					else if(data.code == 2){
						goIndex();
					}else{
						if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
					}
				}
			},complete:function(XMLHttpRequest,status){
				if("timeout" == status){
					$("[data-act=tips-text]").css("display","none");
					$("[data-act=empty-tips]").css("display","block");
				}
			}
		});
		//TODO 记得提交代码的时候注释掉 chenxu end
		//TODO 记得提交代码的时候注释掉 chenxu start
//		var data = '{ "msg": "success", "result": { "totalQa": 22, "userCount": 13, "intentCount": 2, "qaRight": [10, 6, 4, 2], "intentRight": [1, 1, 0] }, "code": 0 }';
//		
//		data = data.result;
//		data.avCount = data.totalQa/data.userCount;
//		data.avCount = data.avCount.toFixed(1);
//		$scope.statistics = data;
//		$scope.$apply();
		//TODO 记得提交代码的时候注释掉 chenxu end
	}
	$scope.getStatisticsDataFunc("today");
	
	//绘制饼图  
	function drawCircle(canvasId, data_arr, color_arr, text_arr)  
	{  
	    var c = document.getElementById(canvasId);  
	    var ctx = c.getContext("2d");  

	    var radius = c.height / 2 - 20; //半径  
	    var ox = radius + 20, oy = radius + 20; //圆心  

	    var width = 14, height = 14; //图例宽和高  
	    var posX = ox * 2 + 20, posY = 30;   //  
	    var textX = posX + width + 5, textY = posY + 10;  

	    var startAngle = 0; //起始弧度  
	    var endAngle = 0;   //结束弧度  
	    for (var i = 0; i < data_arr.length; i++)  
	    {  
	        //绘制饼图  
	        endAngle = endAngle + data_arr[i] * Math.PI * 2; //结束弧度  
	        ctx.fillStyle = color_arr[i];  
	        ctx.beginPath();  
	        ctx.moveTo(ox, oy); //移动到到圆心  
	        ctx.arc(ox, oy, radius, startAngle, endAngle, false);  
	        ctx.closePath();  
	        ctx.fill();  
	        startAngle = endAngle; //设置起始弧度  

	        //绘制比例图及文字  
	        ctx.fillStyle = color_arr[i];  
	        ctx.fillRect(posX, posY + 30 * i, width, height);  
	        ctx.moveTo(posX, posY + 30 * i);  
	        ctx.font = 'bold 12px 微软雅黑';    //斜体 30像素 微软雅黑字体  
	        ctx.fillStyle = color_arr[i]; //"#000000";  
	        //var percent = text_arr[i] + "：" + 100 * data_arr[i] + "%";
	        var percent = text_arr[i];  
	        ctx.fillText(percent, textX, textY + 31 * i);  
	    }  
	}  
	
	var questionAaswerRate = function(id) {  
	    //绘制饼图  
	    //比例数据和颜色
		var qaRight = $scope.statistics.qa_right;
		var total = 0;
		for(var i in qaRight){
			total = total + qaRight[i];
		}
		var black = (qaRight[0]/total).toFixed(2);
		var red = (qaRight[1]/total).toFixed(2);
		var yellow = (qaRight[2]/total).toFixed(2);
		var green = (qaRight[3]/total).toFixed(2);
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
	
	$scope.exportHtml5LinkFunc = function(appName,appKey){
		$scope.htmlLink = static_host + "/h5-wechat/wechat.html?appName=" + appName + "&appKey=" + appKey;
		$("#export-html5-link").modal("show");
	}
	
	$("#export-html5-link").on('shown.bs.modal', function () {
		setTimeout(function(){
			$("#html5-link-extend").focus();
			$("#html5-link-extend").select();
		}, 200);
    });
	
	//数据统计切换
	$("body").off("click","[data-act=nav-tabs-statistics] li").on("click","[data-act=nav-tabs-statistics] li",function(event){
		var $this = $(this);
		var tabNameStr = $this.attr("data-act");
		if(!$this.hasClass("active")){
			$this.addClass("active").siblings("li").removeClass("active");
		}
		$scope.getStatisticsDataFunc(tabNameStr);
	});
	
	//趋势图切换
	$("body").off("click","[data-act=nav-tabs-trend] li").on("click","[data-act=nav-tabs-trend] li",function(event){
		var $this = $(this);
		var tabNameStr = $this.attr("data-act");
		if(!$this.hasClass("active")){
			$this.addClass("active").siblings("li").removeClass("active");
		}
		//绘制条形图
		getTendencyChartFunc(tabNameStr);
	});
	
	//获得技能插件调用比例
	var getSysRobotRateFunc = function(type){
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
	getSysRobotRateFunc();
	
	//系统机器人调用次数比例
	$("body").off("click","[data-act=nav-tabs-sys-robot] li").on("click","[data-act=nav-tabs-sys-robot] li",function(event){
		var $this = $(this);
		var tabNameStr = $this.attr("data-act");
		if(!$this.hasClass("active")){
			$this.addClass("active").siblings("li").removeClass("active");
		}
		console.log("绘制扇形图：" + tabNameStr);
		//获得技能插件调用比例
		getSysRobotRateFunc(tabNameStr);
	});
	
}













