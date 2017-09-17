function userLogsStatisticsCtrl($rootScope,$scope, $state, $stateParams){
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-log-statistics]").addClass("active");
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	}, 200);
	
	//绘制饼图
	var drawPiechatFunc = function(green, yellow, red, black){
		$("#rate-title").highcharts({
			chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '问答对准确率'
            },
            tooltip: {
        	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: false,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: '准确率',
                data: [
                    {
                        name: '95% - 100%',
                        y: green,
                        sliced: false,
                        selected: false,
                        color: "#00AA88"
                    },
                    {
                        name: '80% - 95%',
                        y: yellow,
                        sliced: false,
                        selected: false,
                        color: "#FFB800"
                    },
                    {
                        name: '0% - 80%',
                        y: red,
                        sliced: false,
                        selected: false,
                        color: "#DD4B39"
                    },
                    {
                        name: '0',
                        y: black,
                        sliced: false,
                        selected: false,
                        color: "#52656D"
                    }
                ]
            }]
        });
		
	}
	//绘制柱状图
	var drawbarchatFunc = function(intentNames,redRate,yellowRate,greenRate){
		$('#container').highcharts({
			chart: {
				type: 'column'
			},
			title: {
				text: '意图准确率'
			},
			xAxis: {
				categories: intentNames
			},
			yAxis: {
				min: 0,
				title: {
					text: ''
				}
			},
			tooltip: {
				pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
				shared: true
			},
			plotOptions: {
				column: {
					stacking: 'percent'
				}
			},
			series: [{
				name: '0%-80%',
				color: '#DD4B39',
				data: redRate
			}, {
				name: '80%-95%',
				color: '#FFB800',
				data: yellowRate
			}, {
				name: '95%-100%',
				color: '#00AA88',
				data: greenRate
			}]
		});
	}
	
	//解析出数组
	var intentArrayFunc = function(statistics){
		var intentNames = [];
		var redRate = [];
		var yellowRate = [];
		var greenRate = [];
		$scope.intentNamesTemp = [];
		
		//statistics ='{ "userCount": 9, "qaRight": [71, 0, 0, 3], "totalQa": 208, "intentRight": [{ "name": "意图A", "rate": [2, 2, 4] }, { "name": "意图B", "rate": [2, 2, 4] }, { "name": "意图C", "rate": [2, 3, 4] }, { "name": "意图D", "rate": [2, 2, 4] }, { "name": "意图E", "rate": [2, 2, 4] }, { "name": "意图F", "rate": [2, 2, 4] }, { "name": "意图G", "rate": [2, 2, 4] }], "intentCount": 5 }';
		//statistics = JSON.parse(statistics);
		
		var intentRight = statistics.intent_right;
		var intentRightLength = intentRight.length;
		if(intentRight){
			for (var i=intentRightLength-1;i<intentRightLength;i--)//倒序排列
			//for (var i=0;i<intentRightLength;i++)//正序排列
			{
				if(intentRight[i].name){
					intentNames.push(intentRight[i].name);
					$scope.intentNamesTemp.push({"name":intentRight[i].name});
					redRate.push(intentRight[i].rate[1]);
					yellowRate.push(intentRight[i].rate[2]);
					greenRate.push(intentRight[i].rate[3]);
				}
				if(i <= intentRightLength - 5 || i <= 0){ //倒序排列
				//if(i >= 4){ //正序排列
					break;
				}
			}
			drawbarchatFunc(intentNames,redRate,yellowRate,greenRate);
		}
	}
	
	/**
	 * 获取日志的统计数据
	 */
	$scope.getStatisticsDataFunc = function(){
		//TODO 记得提交代码的时候注释掉 chenxu start
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/app/stat/" + appId,
			data: {"startTime":-1},
			timeout : 2000, 
			method: "GET",
			success: function(data){
				if(data){
					//data = '{ "msg": "success", "result": { "otherUserCount": 4, "avg": 33, "userCount": 589, "qaRight": [2396, 269, 89, 17194], "wechatUserCount": 1148, "totalQa": 19948, "intentRight": [{ "name": "计算器（识别表达式直接返回结果）", "rate": [0, 1, 1, 369] }, { "name": "faq_20000", "rate": [0, 0, 0, 448] }, { "name": "单曲点播", "rate": [0, 4, 0, 456] }, { "name": "faq_2000", "rate": [0, 0, 0, 512] }, { "name": "引导语", "rate": [0, 0, 1, 570] }, { "name": "通用笑话点播", "rate": [0, 0, 0, 577] }, { "name": "连续-搜索", "rate": [0, 0, 0, 696] }, { "name": "问候_hello", "rate": [0, 11, 1, 724] }, { "name": "玩成语接龙", "rate": [0, 0, 0, 1307] }, { "name": "实时百科", "rate": [0, 0, 0, 1353] }], "other_avg": 607, "intentCount": 542, "wechat_avg": 29, "wechat_qa": 17517, "other_qa": 2431 }, "code": 0 }';
					//
					data = dataParse(data);
					if(data.code == 0){
						data = data.result;
						//data.avCount = data.totalQa/data.userCount;
						//data.avCount = data.avg.toFixed(1);
						//data.totalUserCount = data.user_count;
						//data.totalQa = data.wechat_qa + data.other_qa;
						//data.totalAvg = data.totalQa/data.totalUserCount;
						//data.totalAvg = data.totalAvg.toFixed(1);
						$scope.statistics = data;
						intentArrayFunc($scope.statistics);
						$("[data-act=tips-text]").css("display","none");
						$("[data-act=statistics-box]").css("display","block");
						$scope.$apply();
						$rootScope.$apply();
						questionAaswerRate();
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
	$scope.getStatisticsDataFunc();
	
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
		
		
		drawPiechatFunc(parseFloat(green), parseFloat(yellow), parseFloat(red), parseFloat(black));
		
		
//	    var data_arr = [1];  
//	    var color_arr = ["#00AA88"];  
//	    var text_arr = ["95% - 100%", "80% - 95%", "0% - 80%", "0"];  
//	    drawCircle("question-answer-rate", data_arr, color_arr, text_arr);
//	    
//	    var data_arr = [green, yellow, red, black];  
//	    var color_arr = ["#00AA88", "#FFB800", "#DD4B39", "#52656D"];  
//	    var text_arr = ["95% - 100%", "80% - 95%", "0% - 80%", "0"];  
//	    drawCircle("question-answer-rate", data_arr, color_arr, text_arr);
	    
	    
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
	
}













