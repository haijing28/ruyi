function skillCtrl($rootScope,$scope, $state, $stateParams){
	
	$scope.mySkillId = getCookie("skillId");
	$scope.wechatTalksDetail = [];
	$scope.localTalksDetail = [];
	
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
		$("#responseJson").scrollTop(0);
	}, 0);
	
	setTimeout(function(){
		$("[data-act=sendMsg-max-skill]").focus();
		$scope.clickPlay('.testContain');
		$scope.clickPlay('.testContainLocal');
	}, 300);
	//提交测试
	$("body").off("keydown","[data-act=sendMsg-max-skill]").on("keydown","[data-act=sendMsg-max-skill]",function(e){
		if(e.keyCode == 13){
			var $parentNode = $(e.currentTarget.parentNode);
			if($parentNode.attr("class").indexOf("testTextareaLocalSkill") < 0){
				$scope.testMaxSkillSubmit();
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
		return inputText;
	}
	
	$scope.testMaxSkillSubmit = function($event){
		var $testTextareaWechatSkill = $(".testTextareaWechatSkill textarea");
		var content_type = $(".tab-content-max .tab-pane.active").attr("id");
		if(!$testTextareaWechatSkill.val() || $testTextareaWechatSkill.val().length == 0 || $testTextareaWechatSkill.val().replace(/(^\s*)|(\s*$)/g,"")=="" ){
			$.trace("请填写你要说的话");
			$testTextareaWechatSkill.focus();
			return false;
		}
		if($testTextareaWechatSkill.val()){
			$scope.wechatTalksDetail.push({serverLeft: false,userRight: true,talkText:$testTextareaWechatSkill.val()});
		}
		
		//TODO 记得提交代码的时候注释掉
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
		$scope.skillUserSaysTextTry = $scope.handleSpecialChars($testTextareaWechatSkill.val());
		var demo_input = encodeURIComponent($testTextareaWechatSkill.val());
		setTimeout(function(){
			$(".testContain").scrollTop($(".testContain")[0].scrollHeight);
		},500);
		$testTextareaWechatSkill.val('');
		demo_input = {
				"app_key":$scope.skillDetailObj.appKey,
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
									$scope.wechatTalksDetail.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "微信文本",type: "wechat_text"});
								break;
								case "wechat.image":
									if(result.intents[0].outputs[i].property.name){
										textValue = result.intents[0].outputs[i].property.name;
									}
									if(result.intents[0].outputs[i].property.media_id == null){
										url = result.intents[0].outputs[i].property.image_url;
									}else{
										url = ruyi_wechat + "/ruyi-wechat/"+ $scope.skillDetailObj.appKey +"/content/" + result.intents[0].outputs[i].property.media_id;
									}
									$scope.wechatTalksDetail.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "微信图片",backgroundcolor: "#56D875",type: "wechat_image",url: url});
								break;
								case "wechat.music":
									if(result.intents[0].outputs[i].property.title){
										textValue = result.intents[0].outputs[i].property.title;	
									}
									$scope.wechatTalksDetail.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "微信音乐",backgroundcolor: "#FF9D00",type: "wechat_music",url: result.intents[0].outputs[i].property.music_url});
								break;
								case "wechat.voice":
									if(result.intents[0].outputs[i].property.name){
										textValue = result.intents[0].outputs[i].property.name;
									}
									if(result.intents[0].outputs[i].property.media_id == null){
										url = result.intents[0].outputs[i].property.voice_url;
									}else{
										url = ruyi_wechat + "/ruyi-wechat/"+ $scope.skillDetailObj.appKey +"/content/" + result.intents[0].outputs[i].property.media_id;
									}
									$scope.wechatTalksDetail.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "微信音频",backgroundcolor: "#5DC9DB",type: "wechat_voice",url: url});
									break;
								case "wechat.video":
									if(result.intents[0].outputs[i].property.name){
										textValue = result.intents[0].outputs[i].property.name;
									}
									$scope.wechatTalksDetail.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "微信视频",backgroundcolor: "#6B89E1",type: "wechat_video",mediaId: result.intents[0].outputs[i].property.media_id,url: result.intents[0].outputs[i].property.video_url});
									break;
								case "wechat.news":
									if(result.intents[0].outputs[i].property.name){
										textValue = result.intents[0].outputs[i].property.name;
									}
									if(result.intents[0].outputs[i].property.media_id != null){
										var url_temp = ruyiai_host + "/ruyi-ai/"+ $scope.skillDetailObj.appKey +"/transfor/news/" + result.intents[0].outputs[i].property.media_id;
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
														object.pic_url = ruyi_wechat + "/ruyi-wechat/"+ $scope.skillDetailObj.appKey +"/content/" + data.result.news_item[i].thumb_media_id;
														object.url = data.result.news_item[i].url;
														list_temp.push(object);
													}
													$scope.wechatTalksDetail.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "微信图文",backgroundcolor: "#FFB800",type: "wechat_news",list: list_temp});
													$scope.$apply();
												}else if(data && data.code == 2){
													goIndex();
												}
											}
										});
									}else{
										var list_temp = result.intents[0].outputs[i].list;
										$scope.wechatTalksDetail.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "微信图文",backgroundcolor: "#FFB800",type: "wechat_news",list: list_temp});
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
					$scope.wechatTalksDetail.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "未匹配到意图"});
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
		$scope.skillUserSaysTextTry = "";
		if($event && $event.target){
			if($($($event.target)[0])){
				$($($event.target)[0]).css("background-color","#3794FF");
			}
		}
	};
	$(".testContain").delegate(".wechat-image","click",function(){
		var talkURL = $(this).attr("talkURL");
		var url = ruyiai_host + "/ruyi-ai/"+ $scope.skillDetailObj.appKey +"/transfor/video/" + talkURL;
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
	
	$scope.testSubmitMaxLocal = function($event){
		console.log('111111$(".testTextareaLocalSkill textarea").val():' + $(".testTextareaLocalSkill textarea").val());
		if(!$(".testTextareaLocalSkill textarea").val() || $(".testTextareaLocalSkill textarea").val().length == 0 || $(".testTextareaLocalSkill textarea").val().replace(/(^\s*)|(\s*$)/g,"")==""){
			$.trace("请填写你要说的话");
			$(".testTextareaLocalSkill textarea").focus();
			return false;
		}
		if($(".testTextareaLocalSkill textarea").val()){
			$scope.localTalksDetail.push({serverLeft: false,userRight: true,talkText:$(".testTextareaLocalSkill textarea").val()});
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
		
		$scope.skillUserSaysTextTryLocal = $scope.handleSpecialChars($(".testTextareaLocalSkill textarea").val());
		var demo_input = encodeURIComponent($(".testTextareaLocalSkill textarea").val());
		console.log("demo_input:" + demo_input);
		setTimeout(function(){
			$(".testContainLocal").scrollTop($(".testContainLocal")[0].scrollHeight);
		},500);
		$(".testTextareaLocalSkill textarea").val('');
		demo_input = {
				"app_key": $scope.skillDetailObj.appKey,
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
									$scope.localTalksDetail.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "硬件文本",type: "dialog"});
									break;
								case "image":
									textValue = result.intents[0].outputs[i].property.name;	
									$scope.localTalksDetail.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "硬件图片",type: "image",backgroundcolor: "#56D875",url: result.intents[0].outputs[i].property.image_url});
								break;
								case "voice":
									textValue = result.intents[0].outputs[i].property.name;
									$scope.localTalksDetail.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "硬件音频",type: "voice",backgroundcolor: "#5DC9DB",url: result.intents[0].outputs[i].property.voice_url});
									break;
								case "video":
									textValue = result.intents[0].outputs[i].property.name;
									$scope.localTalksDetail.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "硬件视频",type: "video",backgroundcolor: "#6B89E1",url: result.intents[0].outputs[i].property.video_url});
									break;
							}
						}
					}
				}
				if(textValue == "未匹配到意图"){
					if(result.intents && result.intents.length > 0){
						textValue = "该意图助理答为空";
					}
					$scope.localTalksDetail.push({serverLeft: true,userRight: false,talkText: textValue,talkType: "未匹配到意图",type: "dialog"});
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
		$scope.skillUserSaysTextTryLocal = "";
		if($event && $event.target){
			console.log(1);
			if($($($event.target)[0])){
				$($($event.target)[0]).css("background-color","#3794FF");
			}
		}
	};
	
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
		$("[ng-model=skillUserSaysTextTry]").val($scope.skillUserSaysTextTry);
		$("[ng-model=skillUserSaysTextTryLocal]").val($scope.skillUserSaysTextTryLocal);
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
	
	$("body").off("click","[data-act=changeApp]").on("click","[data-act=changeApp]",function(event){
		event.stopPropagation();
		var $this = $(this);
		$this.addClass("active").siblings().removeClass("active");
		$scope.skillDetailObj.appKey = $this.attr("data-app-key");
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
			$("[data-act=sendMsg-max-skill]").focus();
		}, 300);
	});
	setTimeout(function(){
		$("#responseJson").scrollTop($("#responseJson")[0].scrollHeight);
	}, 200);
	
	$("body").off("click",".content-intro li").on("click",".content-intro li",function(event){
		var $this = $(this);
		var example = $this.find("[data-act=example-text]").text();
		if($(".try-nav-left-max li.active").hasClass("try-weixin")){
			$scope.userSaysTextTry = example;
			$(".testTextareaWechatSkill textarea").val(example);
			$scope.testMaxSkillSubmit();
		}else if($(".try-nav-left-max li.active").hasClass("try-local")){
			$scope.userSaysTextTryLocal = example;
			$(".testTextareaLocalSkill textarea").val(example);
			$scope.testSubmitMaxLocal();
		}
	});
	
	//我引用的技能 TODO
	var getSkillDetilFunc = function() {
		$.ajax({
			url: api_host_v2beta + 'skills/' + $stateParams.skill_id,
			type: 'get',
			headers: {"Authorization" : "Bearer " + getCookie('accessToken')},
			success: function(data) {
				data = dataParse(data);
				var skillDetailObjList = [data];
				hasSkillCheckFunc(skillDetailObjList, $rootScope.currentRobot); //判断是否已经获取
				var skillDetailObj = skillDetailObjList[0];
				$scope.skillDetailObj = {};
				$scope.skillDetailObj.name = skillDetailObj.agents[0].agent.name;
				$scope.skillDetailObj.logo = skillDetailObj.agents[0].agent.logo;
				$scope.skillDetailObj.description = skillDetailObj.agents[0].agent.attributes.descriptionForAudit; 
				$scope.skillDetailObj.userInputExamples = skillDetailObj.agents[0].agent.attributes.userInputExamples;
				$scope.skillDetailObj.developerIntroduction = skillDetailObj.agents[0].agent.attributes.developerIntroduction;
				$scope.skillDetailObj.developerMainSite = skillDetailObj.agents[0].agent.attributes.developerMainSite;
				$scope.skillDetailObj.id = skillDetailObj.id;
				$scope.skillDetailObj.hasSkill = skillDetailObj.hasSkill;
				$scope.skillDetailObj.appKey = skillDetailObj.agents[0].agent.appKey;
				//$scope.skillDetailObj.agentId = skillDetailObj.agents[0].agentId;
				$scope.$apply();
			},
			error: function() {
				//出现问题，查询Develop对象
				$.ajax({
					url: api_host_v2beta + 'skills/' + $stateParams.skill_id,
					type: 'get',
					headers: {"Authorization" : "Bearer " + getCookie('accessToken')},
					data: {"tag": "Develop"},
					success: function(data) {
						data = dataParse(data);
						var skillDetailObjList = [data];
						hasSkillCheckFunc(skillDetailObjList, $rootScope.currentRobot); //判断是否已经获取
						var skillDetailObj = skillDetailObjList[0];
						$scope.skillDetailObj = {};
						$scope.skillDetailObj.name = skillDetailObj.agents[0].agent.name;
						$scope.skillDetailObj.logo = skillDetailObj.agents[0].agent.logo;
						$scope.skillDetailObj.description = skillDetailObj.agents[0].agent.attributes.descriptionForAudit; 
						$scope.skillDetailObj.userInputExamples = skillDetailObj.agents[0].agent.attributes.userInputExamples;
						$scope.skillDetailObj.developerIntroduction = skillDetailObj.agents[0].agent.attributes.developerIntroduction;
						$scope.skillDetailObj.developerMainSite = skillDetailObj.agents[0].agent.attributes.developerMainSite;
						$scope.skillDetailObj.id = skillDetailObj.id;
						$scope.skillDetailObj.hasSkill = skillDetailObj.hasSkill;
						$scope.skillDetailObj.appKey = skillDetailObj.agents[0].agent.appKey;
						//$scope.skillDetailObj.agentId = skillDetailObj.agents[0].agentId;
						$scope.$apply();
					},
					error: function(data) {
						if(data.status == 401 || data.status == 403){
		            		goIndex();
		            	}
					}
				});
			}
		})
	}
	setTimeout(function(){
		getSkillDetilFunc();
	},200);
	
	//获取技能
	$("body").off("click","[data-act=add-detail-skill]").on("click","[data-act=add-detail-skill]",function(event){
		event.stopPropagation();
		var $this = $(this);
		var skillId = $this.attr("data-skill-id");
		addSkillToBotFunc([$scope.skillDetailObj],skillId,$rootScope.currentRobot);
		$scope.$apply();
	});
	
	//移除技能
	$("body").off("click","[data-act=remove-detail-skill]").on("click","[data-act=remove-detail-skill]",function(event){
		event.stopPropagation();
		var $this = $(this);
		$.confirm({
	        "text": '<div class="my_own_down_div"><label class="down_web_label">是否确认移除该技能？</label>' + '<br>' + '<span class="down_web_span">移除之后，将失去该技能的功能！</span></div>',
	        "title": " ",
	        "ensureFn": function() {
	        	var skillId = $this.attr("data-skill-id");
	        	removeSkillFromBotFunc([$scope.skillDetailObj],skillId,$rootScope.currentRobot);
	        	$scope.$apply();
	        }
		})
	});
	
}

