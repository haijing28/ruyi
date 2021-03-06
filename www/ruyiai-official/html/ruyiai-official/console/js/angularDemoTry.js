function angularDemoTryCtrl($rootScope, $scope, $state, $stateParams){
	//$(".fixed-btn").hide();
	$("#try-try").css("display","none");
	var data_act = $(".list-group-item.active").attr("data-act");
	var scenarioId = $(".scenario-object.list-group-item.active").attr("data-scenario-id");
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-test-try]").addClass("active");
	$('[data-toggle="tooltip"]').tooltip(); //初始化提示json
	$('.assistant-box ').height();
	$scope.json = getCookie("json");
	if($scope.json == "json"){
		$(".try-nav-max .json").addClass("active").siblings().removeClass("active");
		$("#json").addClass("active in").siblings().removeClass("active in");
	}else if($scope.json == "app-list"){
		$(".try-nav-max .app-list").addClass("active").siblings().removeClass("active");
		$("#app-list").addClass("active in").siblings().removeClass("active in");
	}
	if(getCookie("weixin_local") == "try-local"){
		$(".try-nav-left-max .try-local").addClass("active").siblings().removeClass("active");
		$("#local-try-max").addClass("active in").siblings().removeClass("active in");
		setTimeout(function(){
			$(".scrollContainLocal").scrollTop($(".scrollContainLocal")[0].scrollHeight);
		}, 0);
	}else{
		$(".try-nav-left-max .try-weixin").addClass("active").siblings().removeClass("active");
		$("#weixin-try-max").addClass("active in").siblings().removeClass("active in");
		setTimeout(function(){
			$(".scrollContain").scrollTop($(".scrollContain")[0].scrollHeight);
		}, 0);
	}
	setTimeout(function(){
//		$("#responseJson").scrollTop($("#responseJson")[0].scrollHeight);
		$("#responseJson").scrollTop(0);
	}, 0);
	
	setTimeout(function(){
		$("[data-act=sendMsg-max]").focus();
		$scope.clickPlay('.testContain');
		$scope.clickPlay('.testContainLocal');
	}, 300);
	//提交测试
	$("body").off("keydown","[data-act=sendMsg-max]").on("keydown","[data-act=sendMsg-max]",function(e){
		if(e.keyCode == 13){
			var $parentNode = $(e.currentTarget.parentNode);
			if($parentNode.attr("class").indexOf("testTextareaLocal") < 0){
				$scope.testMaxSubmit();
			}else{
				$scope.testSubmitMaxLocal();
			}
			return false;
        }
	});
	
	//保证只有一个音频播放
	$scope.clearOtherPlay = function(currentIndex, audioContainer){
		audioContainer.find('audio').each(function(index, ele){
			if(index !== currentIndex){
				ele.pause();
			}
		})
	}
	
	//微信端（硬件端）播放音频停止硬件端（微信端）正在播放的音频
	$scope.stopOtherContainerAudio = function(container){
		var playingAudio = container.find('audio');
		if(playingAudio.length > 0){
			$(playingAudio).each(function(index, ele){
				if(!ele.paused){
					ele.pause();
				}
			});
		}
	}
	
	//监控点击播放音频
	$scope.clickPlay = function(audioContainer){
		var anotherAudioContainer = "";
		if(audioContainer === '.testContain'){
			anotherAudioContainer = '.testContainLocal';
		}else{
			anotherAudioContainer = '.testContain';
		}
		$(audioContainer).find('audio').each(function(index, ele){
			ele.onplay = function(){
				$scope.clearOtherPlay(index, $(audioContainer));
				$scope.stopOtherContainerAudio($(anotherAudioContainer));
			}
		});
	}
	
	//处理特殊符号
	$scope.handleSpecialChars = function(inputText){
		// $scope.errorUserSaysTextTry = [];
		// var specialChars = "";
		// if(inputText.indexOf('%') > -1) {
		// 	specialChars = '%';
		// } else if(inputText.indexOf('"') > -1) {
		// 	specialChars = '"';
		// }
		// $scope.errorUserSaysTextTry = inputText.split(specialChars);
		// inputText = '';
		// $($scope.errorUserSaysTextTry).each(function(index, ele){
		// 	if(ele !== ''){
		// 		inputText += ele;
		// 	}
		// });
		//		$scope.userSaysTextTry = inputText;
		return inputText;
	}
	
	$scope.testMaxSubmit = function($event){
		var content_type = $(".tab-content-max .tab-pane.active").attr("id");
		if(!$(".testTextarea textarea").val() || $(".testTextarea textarea").val().length == 0 || $(".testTextarea textarea").val().replace(/(^\s*)|(\s*$)/g,"")=="" ){
			$.trace("请填写你要说的话");
			$(".testTextarea textarea").focus();
			return false;
		}
		if($(".testTextarea textarea").val()){
			$scope.talks.push({serverLeft: false,userRight: true,talkText:$(".testTextarea textarea").val()});
			setTimeout(function(){
				$(".testContain").scrollTop($(".testContain")[0].scrollHeight);
			},500);
			$(".testTextarea textarea").val('');
		}
		
		//TODO 记得提交代码的时候注释掉
//		isproductDomain = true;
		
		//TODO
		var url = "https://api.ruyi.ai/v1/message";
		if(!isproductDomain){   
		  	url = "http://lab.ruyi.ai/ruyi-api/v1/message";
		}
		var options = "entities,intents,know,act";
		
		var domains = "test";
		var context = {
			'reference_time': new Date().getTime(),
			'timezone':'Asia/Shanghai',
			'domains':domains
		}
		$scope.userSaysTextTry = $scope.handleSpecialChars($scope.userSaysTextTry);
		var demo_input = encodeURIComponent($scope.userSaysTextTry);
		demo_input = {
				"app_key":$rootScope.app_key,
//				"app_key":'7b730914-a5c5-43d7-889a-e27e62931fff',
				"q":demo_input,
				"options":options,
				"user_id":uuid,
//				"skip_log":"ruyi123",
				"reset_session":wechatResetSession,
				"context":context
		};
		
		//正式版和测试版做不同的处理 start
		var processApiResultFunc = function(data){
			data = dataParse(data);
					if(data.code == 0){
				wechatResetSession = "false";
				var result = data.result;
				var textValue = "未匹配到意图";
				var url = "";
				if(result.intents && result.intents.length > 0){
					if(result.intents[0].outputs){
						for(var i in result.intents[0].outputs){
							switch (result.intents[0].outputs[i].type) {
								case "wechat.text":
									if(result.intents[0].outputs[i].property.text){
										textValue = result.intents[0].outputs[i].property.text;
										textValue = textValue.replace(/\\n/g,"<br/>");
									}
									$scope.talks.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "微信文本",type: "wechat_text"});
								break;
								case "wechat.image":
									if(result.intents[0].outputs[i].property.name){
										textValue = result.intents[0].outputs[i].property.name;
									}
									if(result.intents[0].outputs[i].property.media_id == null){
										url = result.intents[0].outputs[i].property.image_url;
									}else{
										url = ruyi_wechat + "/ruyi-wechat/"+ $rootScope.app_key +"/content/" + result.intents[0].outputs[i].property.media_id;
//										url = "http://ml.ruyi.ai/ruyi-wechat/1b793621-31ce-4a61-9e6f-fe4ed10422c2/content/WsqI-spqLgZCIKUFEPSP50PWAwYEMuUsTwJUqc-Xj3E";
									}
									$scope.talks.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "微信图片",backgroundcolor: "#56D875",type: "wechat_image",url: url});
								break;
								case "wechat.music":
									if(result.intents[0].outputs[i].property.title){
										textValue = result.intents[0].outputs[i].property.title;	
									}
									$scope.talks.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "微信音乐",backgroundcolor: "#FF9D00",type: "wechat_music",url: result.intents[0].outputs[i].property.music_url});
								break;
								case "wechat.voice":
									if(result.intents[0].outputs[i].property.name){
										textValue = result.intents[0].outputs[i].property.name;
									}
									if(result.intents[0].outputs[i].property.media_id == null){
										url = result.intents[0].outputs[i].property.voice_url;
									}else{
										url = ruyi_wechat + "/ruyi-wechat/"+ $rootScope.app_key +"/content/" + result.intents[0].outputs[i].property.media_id;
//										url = "http://ml.ruyi.ai/ruyi-wechat/1b793621-31ce-4a61-9e6f-fe4ed10422c2/content/WsqI-spqLgZCIKUFEPSP5whkHDLhyzJg1U7IMrcPDA8";
									}
									$scope.talks.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "微信音频",backgroundcolor: "#5DC9DB",type: "wechat_voice",url: url});
									break;
								case "wechat.video":
									if(result.intents[0].outputs[i].property.name){
										textValue = result.intents[0].outputs[i].property.name;
									}
									$scope.talks.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "微信视频",backgroundcolor: "#6B89E1",type: "wechat_video",mediaId: result.intents[0].outputs[i].property.media_id,url: result.intents[0].outputs[i].property.video_url});
									break;
								case "wechat.news":
									if(result.intents[0].outputs[i].property.name){
										textValue = result.intents[0].outputs[i].property.name;
									}
									if(result.intents[0].outputs[i].property.media_id != null){
										var url_temp = ruyiai_host + "/ruyi-ai/"+ $rootScope.app_key +"/transfor/news/" + result.intents[0].outputs[i].property.media_id;
//										var url_temp = "http://127.0.0.1/ruyi-ai/1b793621-31ce-4a61-9e6f-fe4ed10422c2/transfor/news/WsqI-spqLgZCIKUFEPSP5ymo10vm3azU3nlfZb6CLFQ";
										$.ajax({
											url : url_temp,
											method : "get",
											success: function(data) {
												
												var list_temp = [];
												data = dataParse(data);
												if(data.code == 0){
													for(var i in data.result.news_item){
														var object = new Object();
														object.description = data.result.news_item[i].digest;
														object.title = data.result.news_item[i].title;
														object.pic_url = ruyi_wechat + "/ruyi-wechat/"+ $rootScope.app_key +"/content/" + data.result.news_item[i].thumb_media_id;
														object.url = data.result.news_item[i].url;
														list_temp.push(object);
													}
													$scope.talks.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "微信图文",backgroundcolor: "#FFB800",type: "wechat_news",list: list_temp});
													$scope.$apply();
												}else if(data && data.code == 2){
													goIndex();
												}
											}
										});
//										var data = '{"msg": "success","result": {"news_item": [{"author": "admin","content_source_url": "","digest": "testnewstestnewstestnewstestnewstestnewstestnewstestnews","show_cover_pic": 1,"thumb_media_id": "WsqI-spqLgZCIKUFEPSP523FodiFag0VhgmBcRh5yAI","thumb_url": "http://mmbiz.qpic.cn/mmbiz/neQXvoSSJbLPZJIjfzDk2cbf8A30kv7n9c12HRb06Qu7FxhBiciaeh0vF8bn5tqQuAM8apz1jfS7jIEJJLUODuBg/0?wx_fmt=jpeg","title": "testnews","url": "http://mp.weixin.qq.com/s?__biz=MzI0NDEyMTk0OQ==&mid=100000029&idx=1&sn=9332da4a5c9755b8bd0bf110ffc76115#rd"}],"success": true},"code": 0}';
//										var data = '{"msg": "success","result": {"news_item": [{"author": "admin","content_source_url": "","digest": "testnewstestnewstestnewstestnewstestnewstestnewstestnews","show_cover_pic": 1,"thumb_media_id": "WsqI-spqLgZCIKUFEPSP523FodiFag0VhgmBcRh5yAI","thumb_url": "http://mmbiz.qpic.cn/mmbiz/neQXvoSSJbLPZJIjfzDk2cbf8A30kv7n9c12HRb06Qu7FxhBiciaeh0vF8bn5tqQuAM8apz1jfS7jIEJJLUODuBg/0?wx_fmt=jpeg","title": "testnews","url": "http://mp.weixin.qq.com/s?__biz=MzI0NDEyMTk0OQ==&mid=100000029&idx=1&sn=9332da4a5c9755b8bd0bf110ffc76115#rd"},{"author": "admin","content_source_url": "","digest": "testnewstestnewstestnewstestnewstestnewstestnewstestnews","show_cover_pic": 1,"thumb_media_id": "WsqI-spqLgZCIKUFEPSP523FodiFag0VhgmBcRh5yAI","thumb_url": "http://mmbiz.qpic.cn/mmbiz/neQXvoSSJbLPZJIjfzDk2cbf8A30kv7n9c12HRb06Qu7FxhBiciaeh0vF8bn5tqQuAM8apz1jfS7jIEJJLUODuBg/0?wx_fmt=jpeg","title": "testnews","url": "http://mp.weixin.qq.com/s?__biz=MzI0NDEyMTk0OQ==&mid=100000029&idx=1&sn=9332da4a5c9755b8bd0bf110ffc76115#rd"}],"success": true},"code": 0}';
//										
//										for(var i in data.result.news_item){
//											var object = new Object();
//											object.description = data.result.news_item[i].digest;
//											object.title = data.result.news_item[i].title;
//											object.pic_url = ruyi_wechat + "/ruyi-wechat/"+ $rootScope.assistant_app_id +"/content/" + data.result.news_item[i].thumb_media_id;
//											object.url = data.result.news_item[i].url;
//											list.push(object);
//										}
									}else{
										var list_temp = result.intents[0].outputs[i].list;
										$scope.talks.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "微信图文",backgroundcolor: "#FFB800",type: "wechat_news",list: list_temp});
									}
									break;
							}
						}
					}
				}
				if(textValue == "未匹配到意图"){
					if(result.intents && result.intents.length > 0){
						textValue = "该意图助理答为空";
					}
					$scope.talks.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "未匹配到意图"});
				}
				$scope.responseJSONS.push({request:result._text,response:JSON.stringify(result,null,4)});
				$scope.$apply();
				//微信端
				$scope.clickPlay('.testContain');
				$(".testContain").scrollTop($(".testContain")[0].scrollHeight);
				$("#responseJson").scrollTop($("#responseJson")[0].scrollHeight);
			}else{
				$.trace(data.msg);
			}
		}
		//正式版和测试版做不同的处理 end
		$.ajax({
			url : url,
			data: JSON.stringify(demo_input),
			method : "post",
			success: function(data) {
				
				processApiResultFunc(data);
			}
		});
		$scope.userSaysTextTry = "";
		if($event && $event.target){
			if($($($event.target)[0])){
				$($($event.target)[0]).css("background-color","#3794FF");
			}
		}
	};
	$(".testContain").delegate(".wechat-image","click",function(){
		var talkURL = $(this).attr("talkURL");
//		switch(talkType){
//			case "微信图片": 
//				var url = ruyi_wechat + "/ruyi-wechat/"+ $rootScope.app_key +"/content/" + talkURL;
//				//url = "http://ml.ruyi.ai/ruyi-wechat/1b793621-31ce-4a61-9e6f-fe4ed10422c2/content/WsqI-spqLgZCIKUFEPSP50PWAwYEMuUsTwJUqc-Xj3E";
//				var $img = $("<span class='back' talkType='"+ $(this).attr("talkType") +"' talkURL='"+ talkURL +"' talkbackgroundcolor='"+ $(this).attr("talkBackgroundcolor") +"' talkText='"+$(this).attr("talkText")+"' type='"+ $(this).attr("Type") +"'>&nbsp;</span><img src='" + url + "' style='height:170px;width:260px;'/>");
//				$(this).parent().addClass("localImage").html($img);
//				break;
//			case "微信音乐":
//				var url = talkURL;
//				//url = "http://ml.ruyi.ai/ruyi-wechat/1b793621-31ce-4a61-9e6f-fe4ed10422c2/content/WsqI-spqLgZCIKUFEPSP5whkHDLhyzJg1U7IMrcPDA8";
//				var $music = $("<span class='back' talkType='"+ $(this).attr("talkType") +"' talkURL='"+ talkURL +"' talkbackgroundcolor='"+ $(this).attr("talkBackgroundcolor") +"' talkText='"+$(this).attr("talkText")+"' type='"+ $(this).attr("Type") +"'>&nbsp;</span><audio src='" + url +"' controls='controls' style='height:30px;width:260px;margin-top:5px;'></audio>")
//				$(this).parent().addClass("localAudio").html($music);
//				break;
//			case "微信音频":
//				var url = ruyi_wechat + "/ruyi-wechat/"+ $rootScope.app_key +"/content/" + talkURL;
//				//url = "http://ml.ruyi.ai/ruyi-wechat/1b793621-31ce-4a61-9e6f-fe4ed10422c2/content/WsqI-spqLgZCIKUFEPSP5whkHDLhyzJg1U7IMrcPDA8";
//				var $audio = $("<span class='back' talkType='"+ $(this).attr("talkType") +"' talkURL='"+ talkURL +"' talkbackgroundcolor='"+ $(this).attr("talkBackgroundcolor") +"' talkText='"+$(this).attr("talkText")+"' type='"+ $(this).attr("Type") +"'>&nbsp;</span><audio src='" + url +"' controls='controls' style='height:30px;width:260px;margin-top:5px;'></audio>")
//				$(this).parent().addClass("localAudio").html($audio);
//				break;
//			case "微信视频": 
//				var url = ruyiai_host + "/ruyi-ai/"+ $rootScope.app_key +"/transfor/video/" + talkURL;
//				//url = "http://192.168.1.182/ruyi-ai/1b793621-31ce-4a61-9e6f-fe4ed10422c2/transfor/video/WsqI-spqLgZCIKUFEPSP5__LBFAdmdLqWS13nuRdJ2o";
//				$.ajax({
//					url : url,
//					method : "get",
//					success: function(data) {
//						
//						data = dataParse(data);
//							window.open(data.result.down_url);
//						}
//					}
//				});
//				break;
//			case "微信图文": 
//				var url = ruyiai_host + "/ruyi-ai/"+ $rootScope.app_key +"/transfor/news/" + talkURL;
//				//url = "http://192.168.1.182/ruyi-ai/1b793621-31ce-4a61-9e6f-fe4ed10422c2/transfor/news/WsqI-spqLgZCIKUFEPSP5ymo10vm3azU3nlfZb6CLFQ";
//				$.ajax({
//					url : url,
//					method : "get",
//					success: function(data) {
//						
//						data = dataParse(data);
//							window.open(data.result.news_item[0].url);
//						}
//					}
//				});
//				break;
//		}
		var url = ruyiai_host + "/ruyi-ai/"+ $rootScope.app_key +"/transfor/video/" + talkURL;
//		url = "http://127.0.0.1/ruyi-ai/1b793621-31ce-4a61-9e6f-fe4ed10422c2/transfor/video/WsqI-spqLgZCIKUFEPSP5__LBFAdmdLqWS13nuRdJ2o";
		$.ajax({
			url : url,
			method : "get",
			success: function(data) {
				
				data = dataParse(data);
					if(data.code == 0){
					window.open(data.result.down_url);
				}else if(data && data.code == 2){
					goIndex();
				}
			}
		});
	});
	$(".testContain").delegate(".wechat-news-single","click",function(){
		var go_url = $(this).attr("go_url");
		window.open(go_url);
	});
//	$(".testContain").delegate(".talk-content","click",function(){
//		var talkType = $(this).attr("talkType");
//		var talkURL = $(this).attr("talkURL");
//		switch(talkType){
//			case "微信图片": 
//				var url = ruyi_wechat + "/ruyi-wechat/"+ $rootScope.assistant_app_id +"/content/" + talkURL;
//				//url = "http://ml.ruyi.ai/ruyi-wechat/1b793621-31ce-4a61-9e6f-fe4ed10422c2/content/WsqI-spqLgZCIKUFEPSP50PWAwYEMuUsTwJUqc-Xj3E";
//				var $img = $("<span class='back' talkType='"+ $(this).attr("talkType") +"' talkURL='"+ talkURL +"' talkbackgroundcolor='"+ $(this).attr("talkBackgroundcolor") +"' talkText='"+$(this).attr("talkText")+"' type='"+ $(this).attr("Type") +"'>&nbsp;</span><img src='" + url + "' style='height:170px;width:260px;'/>");
//				$(this).parent().addClass("localImage").html($img);
//				break;
//			case "微信音乐":
//				var url = talkURL;
//				//url = "http://ml.ruyi.ai/ruyi-wechat/1b793621-31ce-4a61-9e6f-fe4ed10422c2/content/WsqI-spqLgZCIKUFEPSP5whkHDLhyzJg1U7IMrcPDA8";
//				var $music = $("<span class='back' talkType='"+ $(this).attr("talkType") +"' talkURL='"+ talkURL +"' talkbackgroundcolor='"+ $(this).attr("talkBackgroundcolor") +"' talkText='"+$(this).attr("talkText")+"' type='"+ $(this).attr("Type") +"'>&nbsp;</span><audio src='" + url +"' controls='controls' style='height:30px;width:260px;margin-top:5px;'></audio>")
//				$(this).parent().addClass("localAudio").html($music);
//				break;
//			case "微信音频":
//				var url = ruyi_wechat + "/ruyi-wechat/"+ $rootScope.assistant_app_id +"/content/" + talkURL;
//				//url = "http://ml.ruyi.ai/ruyi-wechat/1b793621-31ce-4a61-9e6f-fe4ed10422c2/content/WsqI-spqLgZCIKUFEPSP5whkHDLhyzJg1U7IMrcPDA8";
//				var $audio = $("<span class='back' talkType='"+ $(this).attr("talkType") +"' talkURL='"+ talkURL +"' talkbackgroundcolor='"+ $(this).attr("talkBackgroundcolor") +"' talkText='"+$(this).attr("talkText")+"' type='"+ $(this).attr("Type") +"'>&nbsp;</span><audio src='" + url +"' controls='controls' style='height:30px;width:260px;margin-top:5px;'></audio>")
//				$(this).parent().addClass("localAudio").html($audio);
//				break;
//			case "微信视频": 
//				var url = ruyiai_host + "/ruyi-ai/"+ $rootScope.assistant_app_id +"/transfor/video/" + talkURL;
////				url = "http://192.168.1.182/ruyi-ai/1b793621-31ce-4a61-9e6f-fe4ed10422c2/transfor/video/WsqI-spqLgZCIKUFEPSP5__LBFAdmdLqWS13nuRdJ2o";
//				$.ajax({
//					url : url,
//					method : "get",
//					success: function(data) {
//						
//						data = dataParse(data);
//							window.open(data.result.down_url);
//						}
//					}
//				});
//				break;
//			case "微信图文": 
//				var url = ruyiai_host + "/ruyi-ai/"+ $rootScope.assistant_app_id +"/transfor/news/" + talkURL;
//				//url = "http://192.168.1.182/ruyi-ai/1b793621-31ce-4a61-9e6f-fe4ed10422c2/transfor/news/WsqI-spqLgZCIKUFEPSP5ymo10vm3azU3nlfZb6CLFQ";
//				$.ajax({
//					url : url,
//					method : "get",
//					success: function(data) {
//						
//						data = dataParse(data);
//							window.open(data.result.news_item[0].url);
//						}
//					}
//				});
//				break;
//		}
//	});

//	$(".testContain").delegate(".back","click",function(){
//		var $pre = $("<span class='serverBorder'></span><span class='serverContain'></span>"+
//					"<span class='talkType' style='background-color:"+ $(this).attr("talkbackgroundcolor") +"'>"+ $(this).attr("talkType") +"</span>"+
//					"<span class='talk-content ng-binding' talkType='"+ $(this).attr("talkType") +"' talkURL='"+ $(this).attr("talkURL") +"' talkbackgroundcolor='"+ $(this).attr("talkBackgroundcolor") +"' talkText='"+$(this).attr("talkText")+"' type='"+ $(this).attr("Type") +"'>"+ $(this).attr("talkText") +"</span>");
//		$(this).parent().removeClass("localAudio").removeClass("localImage").removeClass("localVideo").html($pre);
//	});
	
	$scope.testSubmitMaxLocal = function($event){
		if(!$(".testTextareaLocal textarea").val() || $(".testTextareaLocal textarea").val().length == 0 || $(".testTextareaLocal textarea").val().replace(/(^\s*)|(\s*$)/g,"")==""){
			$.trace("请填写你要说的话");
			$(".testTextarea textarea").focus();
			return false;
		}
		if($(".testTextareaLocal textarea").val()){
			$scope.localTalks.push({serverLeft: false,userRight: true,talkText:$(".testTextareaLocal textarea").val()});
			setTimeout(function(){
				$(".testContainLocal").scrollTop($(".testContainLocal")[0].scrollHeight);
			},500);
			$(".testTextareaLocal textarea").val('');
		}
		
		//TODO 记得提交代码的时候注释掉
//		isproductDomain = true;
		
		//TODO
		var url = "https://api.ruyi.ai/v1/message";
		if(!isproductDomain){   
		  	url = "http://lab.ruyi.ai/ruyi-api/v1/message";
		}
		var options = "entities,intents,know,act";
		
		var domains = "test";
		var context = {
			'reference_time': new Date().getTime(),
			'timezone':'Asia/Shanghai',
			'domains':domains
		}
		
		$scope.userSaysTextTryLocal = $scope.handleSpecialChars($scope.userSaysTextTryLocal);
		var demo_input = encodeURIComponent($scope.userSaysTextTryLocal);
		demo_input = {
				"app_key":$rootScope.app_key,
//				"app_key":'7b730914-a5c5-43d7-889a-e27e62931fff',
				"q":demo_input,
				"options":options,
				"user_id":uuid,
				"reset_session":localResetSession,
//				"skip_log":"ruyi123",
				"context":context
		};
		
		//正式版和测试版做不同的处理 start
		var processApiResultFunc = function(data){
			data = dataParse(data);
					if(data.code == 0){
				localResetSession = "false";
				var result = data.result;
				var textValue = "未匹配到意图";
				if(result.intents && result.intents.length > 0){
					if(result.intents[0].outputs){
						for(var i in result.intents[0].outputs){
							switch (result.intents[0].outputs[i].type) {
								case "dialog":
									textValue = result.intents[0].outputs[i].property.text;
									textValue = textValue.replace(/\\n/g,"<br/>");
									$scope.localTalks.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "硬件文本",type: "dialog"});
									break;
								case "image":
									textValue = result.intents[0].outputs[i].property.name;	
									$scope.localTalks.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "硬件图片",type: "image",backgroundcolor: "#56D875",url: result.intents[0].outputs[i].property.image_url});
								break;
								case "voice":
									textValue = result.intents[0].outputs[i].property.name;
									$scope.localTalks.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "硬件音频",type: "voice",backgroundcolor: "#5DC9DB",url: result.intents[0].outputs[i].property.voice_url});
									break;
								case "video":
									textValue = result.intents[0].outputs[i].property.name;
									$scope.localTalks.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "硬件视频",type: "video",backgroundcolor: "#6B89E1",url: result.intents[0].outputs[i].property.video_url});
									break;
							}
						}
					}
				}
				if(textValue == "未匹配到意图"){
					if(result.intents && result.intents.length > 0){
						textValue = "该意图助理答为空";
					}
					$scope.localTalks.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "未匹配到意图",type: "dialog"});
				}
				$scope.responseJSONS.push({request:result._text,response:JSON.stringify(result,null,4)});
				$scope.$apply();
				//硬件端
				$scope.clickPlay('.testContainLocal');
				$(".testContainLocal").scrollTop($(".testContainLocal")[0].scrollHeight);
				$("#responseJson").scrollTop($("#responseJson")[0].scrollHeight);
			}else{
				$.trace(data.msg);
			}
		}
		//正式版和测试版做不同的处理 end
		$.ajax({
			url : url,
			data: JSON.stringify(demo_input),
			method : "post",
			success: function(data) {
				
				processApiResultFunc(data);
			}
		});
		$scope.userSaysTextTryLocal = "";
		if($event && $event.target){
			console.log(1);
			if($($($event.target)[0])){
				$($($event.target)[0]).css("background-color","#3794FF");
			}
		}
	};
//	$(".testContainLocal").delegate(".talk-content","click",function(){
//		var talkType = $(this).attr("talkType");
//		switch(talkType){
//			case "硬件图片": 
//				var $img = $("<span class='back' talkType='"+ $(this).attr("talkType") +"' talkURL='"+ $(this).attr("talkURL") +"' talkbackgroundcolor='"+ $(this).attr("talkBackgroundcolor") +"' talkText='"+$(this).attr("talkText")+"' type='"+ $(this).attr("Type") +"'>&nbsp;</span><img src='" + $(this).attr("talkURL") + "' style='height:170px;width:260px;'/>");
//				$(this).parent().addClass("localImage").html($img);
//				break;
//			case "硬件音频": 
//				var $audio = $("<span class='back' talkType='"+ $(this).attr("talkType") +"' talkURL='"+ $(this).attr("talkURL") +"' talkbackgroundcolor='"+ $(this).attr("talkBackgroundcolor") +"' talkText='"+$(this).attr("talkText")+"' type='"+ $(this).attr("Type") +"'>&nbsp;</span><audio src='" + $(this).attr("talkURL") +"' controls='controls' style='height:30px;width:260px;margin-top:5px;'></audio>")
//				$(this).parent().addClass("localAudio").html($audio);
//				break;
//			case "硬件视频": 
//				var $video = $("<span class='back' talkType='"+ $(this).attr("talkType") +"' talkURL='"+ $(this).attr("talkURL") +"' talkbackgroundcolor='"+ $(this).attr("talkBackgroundcolor") +"' talkText='"+$(this).attr("talkText")+"' type='"+ $(this).attr("Type") +"'>&nbsp;</span><video src='" + $(this).attr("talkURL") +"' controls='controls' style='height:150px;width:271px;margin-top:-2px;'></video>")
//				$(this).parent().addClass("localVideo").html($video);
//				break;
//		}
//	});


//	$(".testContainLocal").delegate(".back","click",function(){
//		var $pre = $("<span class='serverBorder'></span><span class='serverContain'></span>"+
//					"<span class='talkType' style='background-color:"+ $(this).attr("talkbackgroundcolor") +"'>"+ $(this).attr("talkType") +"</span>"+
//					"<span class='talk-content ng-binding' talkType='"+ $(this).attr("talkType") +"' talkURL='"+ $(this).attr("talkURL") +"' talkbackgroundcolor='"+ $(this).attr("talkBackgroundcolor") +"' talkText='"+$(this).attr("talkText")+"' type='"+ $(this).attr("Type") +"'>"+ $(this).attr("talkText") +"</span>");
//		$(this).parent().removeClass("localAudio").removeClass("localImage").removeClass("localVideo").html($pre);
//	});
	
	//双击关闭试一试窗口
	$("body").off("dblclick",".try-nav-max").on("dblclick",".try-nav-max",function(event){
		$(".min-try-max").trigger("click");
	});

	$scope.closeTry = function(){
		$(".list-group-item").removeClass("active");
		$("[data-act=" + data_act + "]").addClass("active");
		var last_location_href = getCookie("last-location-href");
		if(window.location.href == last_location_href){
			window.location.href = static_host + "/console/api_manager.html";;
		}else{
			window.location.href = last_location_href;
		}
		//$(".fixed-btn").show();
		setTimeout(function(){
			 $("[data-act=sendMsg]").focus();
			 $(".testContainLocal").scrollTop($(".testContainLocal")[0].scrollHeight);
			 $(".testContain").scrollTop($(".testContain")[0].scrollHeight);
			 $scope.clickPlay('.testContain');
			 $scope.clickPlay('.testContainLocal');
		 }, 0);
		$("[ng-model=userSaysTextTry]").val($scope.userSaysTextTry);
		$("[ng-model=userSaysTextTryLocal]").val($scope.userSaysTextTryLocal);
		//确保小窗口跟大窗口的active一致
		if(getCookie("weixin_local") == "try-local"){
			$(".try-nav .try-local").addClass("active").siblings().removeClass("active");
			$("#local-try").addClass("active in").siblings().removeClass("active in");
		}else{
			$(".try-nav .try-weixin").addClass("active").siblings().removeClass("active");
			$("#weixin-try").addClass("active in").siblings().removeClass("active in");
		}
	};
	$(".min-try-max").click(function(){
		$(".try-dialog").addClass("ng-scope");
		$("#try-try").css("display","block");
	});
	
	//获取app列表
	var appkeyManagerFunc = function(){
		if(!$scope.appList){
			var userId = getCookie("userId");
			$.ajax({
				url : ruyiai_host + "/ruyi-ai/app/query/list",
				method : "get",
				data:{"userId": userId},
				success: function(data) {
					
					data = dataParse(data);
					if(data.code == 0){
						$scope.appList = data.result;
						$scope.$apply();
					}else if(data && data.code == 2){
						goIndex();
					}
				}
			});
		}
	}
	appkeyManagerFunc();
	
	$("body").off("click","[data-act=changeApp]").on("click","[data-act=changeApp]",function(event){
		event.stopPropagation();
		var $this = $(this);
		$this.addClass("active").siblings().removeClass("active");
		$rootScope.app_key = $this.attr("data-app-key");
		$rootScope.assistant_app_id = $this.attr("data-app-id");
	});
	
	$(".try-nav-max li").click(function(){
		setCookie("json",$(this).attr("class"));
	});
	
	//禁用硬件和试一试切换，改变浏览器地址
	$(".try-nav-left-max li").click(function(){
		setCookie("weixin_local",$(this).attr("class"));
		if(getCookie("weixin_local") == "try-local"){
			$(".try-nav-left-max .try-local").addClass("active").siblings().removeClass("active");
			$("#local-try-max").addClass("active in").siblings().removeClass("active in");
			
			$(".try-nav .try-local").addClass("active").siblings().removeClass("active");
			$("#local-try").addClass("active in").siblings().removeClass("active in");
		}else{
			$(".try-nav-left-max .try-weixin").addClass("active").siblings().removeClass("active");
			$("#weixin-try-max").addClass("active in").siblings().removeClass("active in");
			
			$(".try-nav .try-weixin").addClass("active").siblings().removeClass("active");
			$("#weixin-try").addClass("active in").siblings().removeClass("active in");
		}
		setTimeout(function(){
			$("[data-act=sendMsg-max]").focus();
		}, 300);
	});
	setTimeout(function(){
		$("#responseJson").scrollTop($("#responseJson")[0].scrollHeight);
	}, 200);
	
}