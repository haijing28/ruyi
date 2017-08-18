angular.module('wechatApp', ['ionic']).run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  }).controller( 'wechatCtrl',['$scope',function($scope){
	  //设置能够复制
	  stop_browser_behavior: false  
	  self.touchStart = function(e) {
	    self.startCoordinates = getPointerCoordinates(e);
	    if ( ionic.tap.ignoreScrollStart(e) ) {
	      return;
	    }
	    if( ionic.tap.containsOrIsTextInput(e.target) ) {
	      // do not start if the target is a text input
	      // if there is a touchmove on this input, then we can start the scroll
	      self.__hasStarted = false;
	      return;
	    }
	    self.__isSelectable = true;
	    self.__enableScrollY = true;
	    self.__hasStarted = true;
	    self.doTouchStart(e.touches, e.timeStamp);
	    // e.preventDefault();
	  };
	//设置能够复制
	  
	  var resizeFunc = function(){
		  var bodyWidth = $(document.body).width();
		  if(bodyWidth > 920){
			  var containerWidth = (bodyWidth - 920)/2;
			  $(".container").css("margin-left",containerWidth + "px");
			  $(".top-nav").css("left",containerWidth + "px");
			  $(".footer-nav").css("left",containerWidth + "px");
		  }
	  }
	  resizeFunc();
	  $(window).resize(function() {
		  resizeFunc();
	  });
	  
	  //处理出界错误
	  var scrollable = document.getElementById("scrollable");
	  new ScrollFix(scrollable);
	//处理出界错误
	  
	  function isWeiXin(){
	    var ua = window.navigator.userAgent.toLowerCase();
	    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
	        return true;
	    }else{
	        return false;
	    }
	 }
	 if(isWeiXin()){
		 $(".top-nav").css("display","none");
		 $(".container .main").css("padding-top","20px");
	 }
	  // var appKey = "";
      var appId = "";
	  appKey = "1ff01bac-219a-40bd-94d0-2364099f158c"; //艾如意账号
	  //appKey = "fca2f900-5e36-4014-90e2-9d166ea6a089"; //chenxu 测试多媒体的账号
	  // if(Request.appKey && Request.appKey.length > 0){
		 //  appKey = Request.appKey;
	  // }

      if(Request.app_id && Request.app_id.length > 0){
          appId = Request.app_id;
      }
	  
	  var appName = "艾如意";
	  if(Request.appName && Request.appName.length > 0){
		  appName = Request.appName;
	  }
	  $("[data-act=wechat-title]").text(appName);
	  $("[data-act=content]").attr("placeholder","给" + appName + "发送消息...");
	  
	  //点击音频
	  $("body").off("click","[data-act=voice-play]").on("click","[data-act=voice-play]",function(){
			var $this = $(this);
			var $myaudio = $this.find("[data-act=voice]");
			var $coverAudio = $this.find("[data-act=cover-audio]");
			var status = "pause";
			if(!$myaudio[0].ended){//如果已经结束，则重置状态
				status = $myaudio.attr("status");
			}
			if(status == "playing"){
				$myaudio.attr("status","pause");
				$coverAudio.attr("src","img/pause-audio.png");
				$myaudio[0].pause();
			}else{
				$myaudio.attr("status","playing");
				$coverAudio.attr("src","img/play-audio.png");
				$myaudio[0].play();
			}
	   });
	  
	  //根据appKey和mediaId获得video或者news对象
	  var getVideoObjFunc = function(mediaId,type,fn){
		  $.ajax({
 				url : ruyiai_host + "/ruyi-ai/"+ appId +"/transfor/"+ type +"/" + mediaId + "/second",
 				method:"GET",
 				success: function(data) {
 					if(typeof data == 'string'){
						data = JSON.parse(data);
					}
 					if(data.code == 0){
 						if(fn){
 							fn(data.result);
 						}
 					}else{
 						return "";
 					}
 				}
 			});
	  }
	  
	  var scrollHeight = 0;
	  
	  //调整滚动条
	  function setScrollFunc(){
		  setTimeout(function(){
			  $("[data-act=wechat-title]").text(appName);
			  $(".container .main").scrollTop(scrollHeight + 500);
		  }, 300);
	  }
	  
		//创建图文消息 start
		var createNewsFunc = function(news_item){
			var newsObject = '';
			if(news_item.length > 1){
				var other_news_item_str = '';
				for(var i =1;i<news_item.length;i++){
					other_news_item_str+='<a href="'+ news_item[i].url +'" target="_blank" style="overflow:hidden;padding-top: 4px;padding-bottom: 4px;border-top: 1px solid #dcdddd;margin-top: 8px;display: block;color: #000;cursor: pointer;" class=""> <div style="float:left;width: 76%;font-size:16px;">'+ news_item[i].title +'</div> <img src="'+ news_item[i].thumb_url +'" style="width: 20%;float: right;"> </a>';
				}
				newsObject = '<!-- 图文 start --> <section class="left-box"> <div class="clearfix serverTalk"> <img class="ruyi-server" src="img/default-bot.png"> <div class="server_text" style="width: 280px;"> <span class="serverBorder"></span> <span class="serverContain"></span> <div class="talk-content"> <a target="_blank" href="'+ news_item[0].url +'" class="" style=" position: relative; display: block; cursor: pointer; "> <img src="'+ news_item[0].thumb_url +'" style="width: 100%;height: 100px;"> <div style="position: absolute; bottom: 0px; color: #fff; padding-right: 10px; background-color: #000; z-index: 1; padding: 4px; width: 100%; font-size: 16px; max-height: 100px; overflow: hidden;">'+ news_item[0].title +'</div> </a> <div class="news-item">'+ other_news_item_str +'</div> </div> </div> </section> <!-- 图文 end -->';
			}else{
				newsObject = '<!-- 图文 start --> <section class="left-box"> <div class="clearfix serverTalk"> <img class="ruyi-server" src="img/default-bot.png"> <div class="server_text" style="width: 280px;"> <span class="serverBorder"></span> <span class="serverContain"></span> <div class="talk-content"> <a target="_blank" href="'+ news_item[0].url +'" class="" style=" position: relative; display: block; cursor: pointer; "> <img src="'+ news_item[0].thumb_url +'" style="width: 100%;height: 100px;"> <div style="position: absolute; bottom: 0px; color: #fff; padding-right: 10px; background-color: #000; z-index: 1; padding: 4px; width: 100%; font-size: 16px; max-height: 100px; overflow: hidden;">'+ news_item[0].title +'</div> </a> <div class="news-item"></div> </div> </div> </section> <!-- 图文 end -->';
			}
			$(".container .main").append(newsObject);
			setScrollFunc();
		}
		//创建图文消息 end
		
	  //正式版和测试版做不同的处理 start
		var processApiResultFunc = function(data){
			if(data.code == 0){
				var result = data.result;
				var textValue = "未匹配到意图";
				if(result.intents && result.intents.length > 0){
					if(result.intents[0].outputs){
						for(var i in result.intents[0].outputs){
							var output = result.intents[0].outputs[i];
							switch (output.type) {
								case "wechat.text":
									textValue = output.property.text;
									textValue = textValue.replace(/\\n/g,"<br/>")
									$(".container .main").append('<!-- 聊天内容左侧 start --> <section class="left-box"> <div class="clearfix serverTalk"> <img class="ruyi-server" ng-src="img/default-bot.png" src="img/default-bot.png"> <div class="server_text"> <span class="serverBorder"></span><span class="talk-content" type="wechat_text">'+ textValue +'</span> </div> </div> </section> <!-- 聊天内容左侧 end -->');
									setScrollFunc();
									break;
								case "wechat.image":
									var image_url = "";
									if(output.property.media_id && output.property.media_id.length > 0){
										image_url = ruyi_wechat + "/ruyi-wechat/"+ appId +"/content/" + output.property.media_id + "/second";
									}else if(output.property.image_url && output.property.image_url.length > 0){
										image_url = output.property.image_url;
									}
									$(".container .main").append('<!-- 聊天图片左侧 start --> <section class="left-box"> <div class="clearfix serverTalk"> <img class="ruyi-server" ng-src="img/default-bot.png" src="img/default-bot.png"> <div class="server_text"> <span class="serverBorder"></span> <span class="serverContain"></span> <span class="talk-content"> <img src="'+ image_url +'" width="100%"> </span> </div> </div> </section> <!-- 聊天图片左侧 end -->');
									setScrollFunc();
									break;
								case "wechat.voice":
									var music_url = "";
									var title = output.property.title;
									if(!title || title.length == 0){
										title = output.property.name;
									}
									var author = "";
									var album = "";
									if(output.property.media_id && output.property.media_id.length > 0){
										music_url = ruyi_wechat + "/ruyi-wechat/"+ appId +"/content/" + output.property.media_id + "/second";
									}else if(output.property.music_url && output.property.music_url.length > 0){
										music_url = output.property.music_url;
										if(output.property.description){
											album = output.property.description;
										}
									}
									$(".container .main").append('<!-- 聊天音乐左侧 start --> <section class="left-box"> <div class="clearfix serverTalk"> <img class="ruyi-server" ng-src="img/default-bot.png" src="img/default-bot.png"> <div class="server_text" style=" width: 280px; "> <span class="serverBorder"></span> <span class="serverContain"></span> <div data-act="voice-play" class="talk-content clearfix"> <div style="float:left;width: 70px;"><img src="img/pause-audio.png" data-act="cover-audio" style="width:60px;"></div> <div style="float: left;width: 184px;"> <div style=" font-size: 16px; margin-bottom: 4px; ">'+ title +'</div> <h3 style=" font-size: 14px; color: #736e6e; margin-bottom: 2px; ">'+ author +'</h3> <h4 style=" font-size: 14px; color: #736e6e; ">'+ album +'</h4> </div> <audio style="display:none;" src="'+ music_url +'" controls="controls" style="height:30px;width:260px;margin-top:5px;" data-act="voice"></audio> </div> </div> </div> </section> <!-- 聊天音乐左侧 end -->');
									setScrollFunc();
									break;
								case "wechat.music":
									var music_url = "";
									var title = output.property.title;
									if(!title || title.length == 0){
										title = output.property.name;
									}
									var author = "";
									var album = "";
									if(output.property.media_id && output.property.media_id.length > 0){
										music_url = ruyi_wechat + "/ruyi-wechat/"+ appId +"/content/" + output.property.media_id + "/second";
									}else if(output.property.music_url && output.property.music_url.length > 0){
										music_url = output.property.music_url;
										if(output.property.description){
											album = output.property.description;
										}
									}
									$(".container .main").append('<!-- 聊天音乐左侧 start --> <section class="left-box"> <div class="clearfix serverTalk"> <img class="ruyi-server" ng-src="img/default-bot.png" src="img/default-bot.png"> <div class="server_text" style=" width: 280px; "> <span class="serverBorder"></span> <span class="serverContain"></span> <div data-act="voice-play" class="talk-content clearfix"> <div style="float:left;width: 70px;"><img src="img/pause-audio.png" data-act="cover-audio" style="width:60px;"></div> <div style="float: left;width: 184px;"> <div style=" font-size: 16px; margin-bottom: 4px; ">'+ title +'</div> <h3 style=" font-size: 14px; color: #736e6e; margin-bottom: 2px; ">'+ author +'</h3> <h4 style=" font-size: 14px; color: #736e6e; ">'+ album +'</h4> </div> <audio style="display:none;" src="'+ music_url +'" controls="controls" style="height:30px;width:260px;margin-top:5px;" data-act="voice"></audio> </div> </div> </div> </section> <!-- 聊天音乐左侧 end -->');
									setScrollFunc();
									break;
								case "wechat.video":
									var title = output.property.title;
									if(!title || title.length == 0){
										title = output.property.name;
									}
									var video_url = "";
									var createVideoFunc = function(video_url){
										$(".container .main").append('<!-- 聊天视频左侧 start --> <section class="left-box"> <div class="clearfix serverTalk"> <img class="ruyi-server" ng-src="img/default-bot.png" src="img/default-bot.png"> <div class="server_text" style="width: 280px;"> <span class="serverBorder"></span> <span class="serverContain"></span> <div class="talk-content" style="positon:relative;"> <a target="_blank" href="'+ video_url +'" class=""> <img src="img/default-video.png" style="width: 100%;height:150px;"> </a> <div style="position:absolute;bottom: 17px;left: 52px;color:#fff;padding-right: 10px;overflow:hidden;width:218px;font-size:16px;">'+ title +'</div> </div> </div> </div> </section> <!-- 聊天视频左侧 end -->');
										setScrollFunc();
									}
									if(output.property.media_id && output.property.media_id.length > 0){
										getVideoObjFunc(output.property.media_id,"video",function(resultObj){
											video_url = resultObj.down_url;
											createVideoFunc(video_url);
										});
									}else if(output.property.video_url && output.property.video_url.length > 0){
										video_url = output.property.video_url;
										createVideoFunc(video_url);
									}
									break;
								case "wechat.news":
									if(output.property && output.property.media_id && output.property.media_id.length > 0){
										getVideoObjFunc(output.property.media_id,"news",function(resultObj){ //通过api，参数为mediaId获得图文消息
											for(var i in resultObj.news_item){
												resultObj.news_item[i].thumb_url = ruyi_wechat + "/ruyi-wechat/"+ appId +"/content/" + resultObj.news_item[i].thumb_media_id + "/second";
											}
											createNewsFunc(resultObj.news_item);
										});
									}else if(output.list && output.list.length > 0){
										for(var i in output.list){
											output.list[i].thumb_url = output.list[i].pic_url;
										}
										createNewsFunc(output.list);
									}
									break;
							}
						}
					}
				}
			}else{
				alert(data.msg);
			}
			setScrollFunc();
		}
		//正式版和测试版做不同的处理 end
		
	   $scope.wechatKeydownSubmit = function(content,$event){
		   if($event.keyCode == 13){
				$scope.wechatSubmit(content);
			}
	   }
	  
       $scope.wechatSubmit = function(content){
    	   scrollHeight = $(".container .main")[0].scrollHeight;
    	   $("[data-act=wechat-title]").text("输入中...");
    	   if(!content || $.trim(content).length == 0){
    		   return false;
    	   }
    	   if("sys.h5wechat.welcome" != content){
    		   $(".container .main").append('<!-- 聊天内容右侧 start --> <section class="right-box"> <div class="clearfix userTalk"> <img class="ruyi-user" ng-src="img/default-user.png" src="img/default-user.png"> <div class="user-text"> <span class="userBorder"></span>'+ content +' </div> </div> </section> <!-- 聊天内容右侧 end -->');
    		   setScrollFunc();
    	   }
    	   
    	    var url = "https://api.ruyi.ai/v1/message_h5";
	   		if(!isproductDomain){
	   		  	url = "http://lab.ruyi.ai/ruyi-api/v1/message_h5";
	   		}
	   		var demo_input;
	   		var options = "entities,intents,know,act";
	   		var domains = "test";
	   		var context = {
	   			'reference_time': new Date().getTime(),
	   			'timezone':'Asia/Shanghai',
	   			'domains':domains
	   		}
	   		demo_input = $scope.userSaysTextTry;
	   		demo_input = {
	   				"app_id":appId,
	   				"q":content,
	   				"options":options,
	   				"user_id":uuid,
	   				//"skip_log":"ruyi123",
	   				"context":context
	   		};
   			$.ajax({
   				url : url,
   				data: demo_input,
   				method : "get",
   				success: function(data) {
   					if(typeof data == 'string'){
						data = JSON.parse(data);
					}
   					processApiResultFunc(data);
   				}
   			});
    	    $scope.content = "";
       }
       
       $scope.contentFocusFunc = function(){
    	   setScrollFunc();
       }
       
     //判断如果2小时内，第一次加载，则给出提示语
     var firstTimeLoadFunc = function(){
    	 if(!getCookie("firstTimeLoad")){
    		 $scope.wechatSubmit("sys.h5wechat.welcome");
    	 }
    	 var expires_date = new Date();
    	 expires_date.setTime(expires_date.getTime() + (5 * 60 * 1000));
    	 $.cookie("firstTimeLoad", "false", { "expires": expires_date });
     }
     firstTimeLoadFunc();
     
     $scope.contentFocusFunc = function(){
    	 $(".container .main").css("padding-top","20px");
     }
     
     //判断客户端类型
     var checkClickTypeFunc = function(){
    	 var u = navigator.userAgent;
    	 var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    	 var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    	 if(isAndroid){
    		 return "android";
    	 }else if(isiOS){
    		 return "ios";
    	 }
     } 
     
     $scope.contentFocusFunc = function(){
    	 if(isWeiXin() && checkClickTypeFunc() == "ios"){
    		 $(".container .main").css("padding-top","340px");
    	 }
    	 setScrollFunc();
     }
     
     $scope.contentBlurFunc = function(){
    	 if(isWeiXin()){
    		 $(".container .main").css("padding-top","20px");
    	 }
     }
  }]);







