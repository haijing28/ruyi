var apiManagerApp = angular.module("apiManagerApp",['ui.router','ngSanitize','ui.sortable']);
var ruyi_api_help = "http://docs.ruyi.ai";
apiManagerApp.run(
	      [        '$rootScope', '$state', '$stateParams',
	      function ($rootScope,   $state,   $stateParams) {
	        // It's very handy to add references to $state and $stateParams to the $rootScope
	        // so that you can access them from any scope within your applications.For example,
	        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
	        // to active whenever 'contacts.list' or one of its decendents is active.
	        $rootScope.$state = $state;
	        $rootScope.$stateParams = $stateParams;
	}]);
apiManagerApp.config(function($locationProvider , $stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/");
	$stateProvider
	.state('user_log_list',{
		url: "/user_log_list",
		templateUrl: "user_log_list.html",
        controller: function($rootScope,$scope, $state, $stateParams){
        	userLogListFunc($rootScope,$scope, $state, $stateParams);
        }
	}).state('log_statistics',{
		url: "/log_statistics",
		templateUrl: "log_statistics.html",
        controller: function($rootScope,$scope, $state, $stateParams){
        	userLogsStatisticsCtrl($rootScope,$scope, $state, $stateParams);
        }
	}).state('user_log_list.user_logs',{
		url: "/user_logs/{user_id}",
		templateUrl: "user_logs.html",
        controller: function($rootScope,$scope, $state, $stateParams){
        	userLogsCtrl($rootScope,$scope, $state, $stateParams);
        }
	}).state('intent_list',{
		url: "/intent_list/{scenes_id}",
		templateUrl: "intent_list.html",
        controller: function($rootScope,$scope, $state, $stateParams){
        	intentListCtrl($rootScope,$scope, $state, $stateParams);
        }  //     !!!!!!!!!!!!!!
    }).state('intent_list.intent_event_detail',{
		url: "/intent_event_detail/{intent_id}",
		templateUrl: "intent_event_detail.html",
		controller: function($rootScope,$scope, $state, $stateParams,$sce){
			intentDetailCtrl($rootScope,$scope, $state, $stateParams,$sce);
		} //  !!!!!!!!!!!!!!!!!!!
	}).state('intent_list.intent_welcome_detail',{
		url: "/intent_welcome_detail/{intent_id}",
		templateUrl: "intent_welcome_detail.html",
		controller: function($rootScope,$scope, $state, $stateParams,$sce){
			intentDetailCtrl($rootScope,$scope, $state, $stateParams,$sce);
		}
	}).state('intent_list.intent_timeout_detail',{
		url: "/intent_timeout_detail/{intent_id}",
		templateUrl: "intent_timeout_detail.html",
		controller: function($rootScope,$scope, $state, $stateParams,$sce){
			intent_timeout_detail($rootScope,$scope, $state, $stateParams,$sce);
		}
	}).state('intent_list.intent_lost_detail',{
		url: "/intent_lost_detail/{intent_id}",
		templateUrl: "intent_lost_detail.html",
		controller: function($rootScope,$scope, $state, $stateParams,$sce){
			intentDetailCtrl($rootScope,$scope, $state, $stateParams,$sce);
		}
	}).state('intent_list.intent_repeat_detail',{
		url: "/intent_repeat_detail/{intent_id}",
		templateUrl: "intent_repeat_detail.html",
		controller: function($rootScope,$scope, $state, $stateParams,$sce){
			intentDetailCtrl($rootScope,$scope, $state, $stateParams,$sce);
		}
	}).state('intent_list.intent_detail',{
		url: "/intent_detail/{intent_id}",
		templateUrl: "intent_detail.html",
        controller: function($rootScope,$scope, $state, $stateParams,$sce){
        	intentDetailCtrl($rootScope,$scope, $state, $stateParams,$sce);
        }
	}).state('entity_list',{
		url: "/entity_list",
		templateUrl: "entity_list.html",
        controller: function($rootScope,$scope, $state, $stateParams){
        	entityListCtrl($rootScope,$scope, $state, $stateParams);
        } 
	}).state('import_knowledge_base',{
		url: "/import_knowledge_base",
		templateUrl: "import_knowledge_base.html",
        controller: function($rootScope,$scope, $state, $stateParams){
        	importKnowledgeBaseCtrl($rootScope,$scope, $state, $stateParams);
        } 
	}).state('entity_list.entity_detail',{
		url: "/entity_detail/{entity_id}",
		templateUrl: "entity_detail.html",
        controller: function($rootScope,$scope, $state, $stateParams){
        	entityDetailCtrl($rootScope,$scope, $state, $stateParams);
        } 
	}).state('skill_store',{
		url: "/skill_store",
		templateUrl: "skill_store.html",
        controller: function($rootScope,$scope, $state, $stateParams){
        	referenceAppCtrl($rootScope,$scope, $state, $stateParams);
        }
	}).state('delete_robot',{
		url: "/delete_robot",
		templateUrl: "delete_robot.html",
        controller: function($rootScope,$scope, $state, $stateParams){
        	deleteRobotCtrl($rootScope,$scope, $state, $stateParams);
        }
	}).state('robot_paramenter',{
		url: "/robot_paramenter",
		templateUrl: "robot_paramenter.html",
        controller: function($rootScope,$scope, $state, $stateParams){
        	assistantParaCtrl($rootScope,$scope, $state, $stateParams);
        }
	}).state('action_set',{
		url: "/action_set",
		templateUrl: "action_set.html",
        controller: function($rootScope,$scope, $state, $stateParams){
        	actionSetCtrl($rootScope,$scope, $state, $stateParams);
        }
	}).state('angularDemo',{
		url: "/angularDemo",
		templateUrl: "angularDemo.html",
        controller: function($rootScope,$scope, $state, $stateParams){
        	angularDemoCtrl($rootScope,$scope, $state, $stateParams);
        }
	}).state('resource',{
		url: "/resource",
		templateUrl: "resource.html",
        controller: function($rootScope,$scope, $state, $stateParams){
        	resourceCtrl($rootScope,$scope, $state, $stateParams);
        }
	}).state('angularDemoTry',{
		url: "/angularDemoTry",
		templateUrl: "angularDemoTry.html",
        controller: function($rootScope,$scope, $state, $stateParams){
        	angularDemoTryCtrl($rootScope,$scope, $state, $stateParams);
        }
	})
//	.state('assistantPara',{
//		url: "/assistantPara",
//		//templateUrl: "assistantPara.html",
//		templateUrl: "assistant_parameter.html",
//        controller: function($rootScope,$scope, $state, $stateParams){
//        	assistantParaCtrl($rootScope,$scope, $state, $stateParams);
//        }
//	})
	.state('intent_search',{
		url: "/intent_search",
		templateUrl: "intent_search.html",
        controller: function($rootScope,$scope, $state, $stateParams){
        	intentSearchCtrl($rootScope,$scope, $state, $stateParams);
        }
	}).state('intent_search.intent_detail',{
		url: "/{scenes_id}/intent_detail/{intent_id}",
		templateUrl: "intent_detail.html",
        controller: function($rootScope,$scope, $state, $stateParams,$sce){
        	intentDetailCtrl($rootScope,$scope, $state, $stateParams,$sce);
        }
	});
});

apiManagerApp.filter('paramentRequiredFilter',
	function(){
	 return function(required) {
       var out = "";
	   if(required){
    	   out = "checked";
       }
       return out;
   };
}).filter('intentStatusFilter',
		function(){
	 return function(input,errorModelStr) {
      var out = "";
	  if(input == "INVALID" && errorModelStr && errorModelStr.length > 0){
		  out = "error";
	  }else if(input == "WARNING" && errorModelStr && errorModelStr.length > 0){
		  out = "warning";
	  }else{
		  out = "success";
	  }
      return out;
  };
}).filter('beforeTimeFilter',
		function(){
	 	return function(input) {
		    var minute = 1000 * 60;
		 	var hour = minute * 60;
		 	var day = hour * 24;
		 	var halfamonth = day * 15;
		 	var month = day * 30;
		 	function getDateDiff(dateTimeStamp){
		 		var now = new Date().getTime();
		 		var diffValue = now - dateTimeStamp;
		 		if(diffValue < 0){
		 		 //若日期不符则弹出窗口告之
		 		 //alert("结束日期不能小于开始日期！");
		 		 }
		 		var monthC =diffValue/month;
		 		var weekC =diffValue/(7*day);
		 		var dayC =diffValue/day;
		 		var hourC =diffValue/hour;
		 		var minC =diffValue/minute;
		 		if(monthC>=1){
		 		 result="" + parseInt(monthC) + "个月前";
		 		 }
		 		 else if(weekC>=1){
		 		 result="" + parseInt(weekC) + "周前";
		 		 }
		 		 else if(dayC>=1){
		 		 result=""+ parseInt(dayC) +"天前";
		 		 }
		 		 else if(hourC>=1){
		 		 result=""+ parseInt(hourC) +"小时前";
		 		 }
		 		 else if(minC>=1){
		 		 result=""+ parseInt(minC) +"分钟前";
		 		 }else
		 		 result="刚刚";
		 		return result;
		 	}
		 	return getDateDiff(input);
	 };
}).filter('headImgFilter',
		function(){
	 return function(input) {
     var out = "img/ruyi_default.png";
	 if(input && input.length > 0){
		 out = input;
	 }
     return out;
 };
}).filter('logTypeFilter',
		function(){
	return function(input) {
	var out = "";
	switch(input){
	case "dialog": out = "硬件文本";break;
	case "image": out = "硬件图片";break;
	case "voice": out = "硬件音频";break;
	case "video": out = "硬件视频";break;
	case "wechat.text": out = "微信文本";break;
	case "wechat.image": out = "微信图片";break;
	case "wechat.music": out = "微信音乐";break;
	case "wechat.voice": out = "微信音频";break;
	case "wechat.video": out = "微信视频";break;
	case "wechat.news": out = "微信图文";break;
	}
    return out;
};
}).filter('logTypeColorFilter',
		function(){
	return function(input) {
	var out = "";
	switch(input){
	case "dialog": out = "#2AA7D8";break;
	case "image": out = "#56D875";break;
	case "voice": out = "#5DC9DB";break;
	case "video": out = "#6B89E1";break;
	case "wechat.text": out = "#2AA7D8";break;
	case "wechat.image": out = "#56D875";break;
	case "wechat.music": out = "#FF9D00";break;
	case "wechat.voice": out = "#5DC9DB";break;
	case "wechat.video": out = "#6B89E1";break;
	case "wechat.news": out = "#FFB800";break;
	}
    return out;
};
}).filter('nickNameFilter',
		function(){
	 return function(nickname,userId) {
     if(userId){
    	 userId = userId.replace(/爨/g,":");
     }
     var out = userId;
	 if(nickname && nickname.length > 0){
		 out = nickname;
	 }
	 if(userId == "ruyi-test-" + appId){
		 out = getCookie("appName") + "（测试）";
	 }
    return out;
};
}).filter('positionFilter',
		function(){
	 return function(input) {
  var out = "无地址信息";
	 if(input && input.length > 0){
		 out = input;
	 }
  return out;
};
}).filter('rateFilter',
		function(){
	 return function(response) {
    var out = "";
	 if(response){
		if(response && response.intents && response.intents.length > 0){
			var score = response.intents[0].score;
			score = parseFloat(score);
			if(score == 0){
				out = "0";
			}else{
				out = (new Number(score * 100).toFixed(2)) + "%";
			}
		}else{
			out = "0";
		}
	 }
	 return out;
};
}).filter('rateColorFilter',
		function(){
	 return function(response) {
     var out = "";
	 if(response){
		if(response && response.intents && response.intents.length > 0){
			var score = response.intents[0].score;
			score = parseFloat(score);
			if(score == 0){
				out = "intent-rate-black";
			}else if(score > 0 && score <= 0.8){
				out = "intent-rate-red";
			}else if(score > 0.8 && score <= 0.95){
				out = "intent-rate-yellow";
			}else if(score > 0.95 && score <= 1){
				out = "intent-rate-green";
			}
		}else{
			out = "intent-rate-black";
		}
	 }
return out;
};
}).filter('editIconFilter',
		function(){
	 return function(response) {
     var out = "create";
	 if(response && response.intents && response.intents.length > 0){
		 if(response.intents[0].score > 0){
			out = "edit";
		 }
	 }
return out;
};
}).filter('editIntentTitleFilter',
		function(){
	 return function(response) {
     var out = "创建意图";
	 if(response && response.intents && response.intents.length > 0){
		if(response.intents[0].score > 0){
			out = "编辑意图";
		}
	 }
return out;
};
}).filter('confidenceCountGreenFilter',
		function(){
	 return function(input) {
		 var out = 0;
		 if(input){
			 var total = 0;
			 confidenceCount = input;
			 for(var i in confidenceCount){
				 total = total + confidenceCount[i];
			 }
			 out = (confidenceCount[3]/total) * 100;
		 }
		 return out;
	};
}).filter('confidenceCountYellowFilter',
		function(){
	 return function(input) {
		 var out = 0;
		 if(input){
			 var total = 0;
			 confidenceCount = input;
			 for(var i in confidenceCount){
				 total = total + confidenceCount[i];
			 }
			 out = (confidenceCount[2]/total) * 100;
		 }
		 return out;
	};
}).filter('confidenceCountRedFilter',
		function(){
	 return function(input) {
		 var out = 0;
		 if(input){
			 var total = 0;
			 confidenceCount = input;
			 for(var i in confidenceCount){
				 total = total + confidenceCount[i];
			 }
			 out = (confidenceCount[1]/total) * 100;
		 }
		 return out;
	};
}).filter('confidenceCountBlackFilter',
		function(){
	 return function(input) {
		 var out = 0;
		 if(input){
			 var total = 0;
			 confidenceCount = input;
			 for(var i in confidenceCount){
				 total = total + confidenceCount[i];
			 }
			 out = (confidenceCount[0]/total) * 100;
		 }
		 return out;
	};
}).filter('diffErrorFilter',
		function(){
	 return function(input) {
		 var out = false;
		 if(input){
			 out = input;
		 }
		 return out;
	};
}).filter('tipFilter',
		function(){
	 return function(input) {
		 var out = "";
		 switch(input){
		 case "wrong-answer": out = "答非所问"; break;
		 case "negative-answer": out = "负面消极"; break;
		 case "strange-answer": out = "用户问题奇怪"; break;
		 case "wrong-logic": out = "功能触发错误"; break;
		 case "no-answer": out = "无回复"; break;
		 case "sensitive-words": out = "敏感词"; break;
		 case "wrong-context": out = "没有理解上下文"; break;
		 case "unfit-child": out = "不适宜儿童"; break;
		 case "wrong-encyclopedia-answer": out = "百科答案不正确"; break;
		 case "wrong-charater": out = "答案中有错字"; break;
		 }
		 return out;
	};
}).filter('dataFormatFilter',
		function(){
	 return function(input) {
		var tempDate = new Date();
		tempDate.setTime(input*1000);
		out = $.timeFormat(tempDate,"yyyy-MM-dd HH:mm");
		 return out;
	};
}).filter('dataFormatMilliFilter',
		function(){
	 return function(input) {
		var tempDate = new Date();
		tempDate.setTime(input);
		out = $.timeFormat(tempDate,"yyyy-MM-dd HH:mm");
		 return out;
	};
}).filter('mediaTypeFilter',
		function(){
	 return function(input) {
		var out = "";
		if("wechat.news" == input || "news" == input){
			out = "图文: ";
		}else if("wechat.image" == input || "image" == input){
			out = "图片: ";
		}else if("wechat.voice" == input || "voice" == input){
			out = "音频: ";
		}else if("wechat.video" == input || "video" == input){
			out = "视频: ";
		}else if("wechat.music" == input){
			out = "音乐: ";
		}
		return out;
	};
}).filter('mediaShowFilter',
		function(){
	 return function(input) {
		var out = input;
		if(input.indexOf("@mediaResourceResponse") > -1){
			var para = input.split("#");
			for(var i in para){
				var keyValue = para[i].split(":");
				if(keyValue[0] == "name"){
					out = keyValue[1];
				}
			}
		}
		return out;
	};
}).filter('helpUrlFilter',
		function(){
	 return function(input) {
		var out = "";
		switch(input){
			case "c1f12d91-b204-41c0-915d-cff454876d6e": out= ruyi_api_help; break;
			case "be9b29a3-09a3-442e-af66-021334cdbcfc": out= ruyi_api_help; break;
			case "c64e8ccc-1894-4335-ba43-e09242e8f9dc": out= ruyi_api_help; break;
			case "80e89fee-0a80-4a68-a76c-ff1c521d7293": out= ruyi_api_help + "/33_xing_zuo_yun_shi.html"; break;
			case "5a2875a1-3093-43e8-b409-243561ba241c": out= ruyi_api_help + "/34_mei_tu_sou_sou.html"; break;
			case "a141a4d8-35a1-4190-bffa-e61079144df0": out= ruyi_api_help + "/38_ji_suan_qi.html"; break;
			case "3b1cfe4d-dc78-4b66-9d9b-a5c065ca5e50": out= ruyi_api_help + "/37_ying_wu_xue_she.html"; break;
			case "02d8f0d7-9574-414d-a601-a1f8ad0e3b26": out= ruyi_api_help + "/39_cheng_yu_jie_long.html"; break;
			case "cfc4488b-5c0f-4315-9ff4-fadb75f05f01": out= ruyi_api_help + "/31_cha_xun_tian_qi.html"; break;
			case "451074cb-7076-4c92-aa35-5c4ad1a870d1": out= ruyi_api_help + "/310_zhong_yi_ying.html"; break;
			case "95ab31a2-6a89-42f0-89c2-79cf65f527f0": out= ruyi_api_help; break;
			case "535c1b4e-0f01-4704-b325-dfad45db31cf": out= ruyi_api_help + "/311_gu_shi_8bcd28_er_tong_724829.html"; break;
			case "a6bc834d-a94e-44c2-9180-ab59ce423bfe": out= ruyi_api_help + "/312_cai_pu_cha_xun.html"; break;
			case "fb30e181-a97b-425a-a9f5-b6cbb546afa8": out= ruyi_api_help + "/32_cha_xun_huang_li.html"; break;
			case "dfd87e8d-5b93-4070-b11c-5ec5c6d78b33": out= ruyi_api_help + "/314_ri_cheng_chuang_jian.html"; break;
			case "d5c80071-1c19-4db9-814f-648c14b91e8e": out= ruyi_api_help + "/35_yu_le_tui_song.html"; break;
			case "3a59359b-b40b-4581-be62-8112dbf5fb90": out= ruyi_api_help + "/36_you_sheng_zi_yuan.html"; break;
			case "d3268e7d-e317-4b34-9e06-4a833270bbd5": out= ruyi_api_help; break;
			case "52481364-d566-4d38-88be-5b593be5b57a": out= ruyi_api_help; break;
			case "4e71771c-810a-4728-a733-8f07d7d43047": out= ruyi_api_help; break;
			case "ee2a04ac-b87c-46ba-9277-a2077c82e498": out= ruyi_api_help + "/313_shi_jian_xun_wen.html"; break;
			case "b19a9b71-ff1d-4e63-9e49-7afc89c5a4bc": out= ruyi_api_help; break;
			case "6fc1c620-e31b-4ae5-a0e1-6709bb7029d9": out= ruyi_api_help; break;
			case "c8031097-039f-4f0f-819b-464cb3b2df7f": out= ruyi_api_help; break;
			case "15de5ea2-4502-4f78-a49f-fcb04625ec3c": out= ruyi_api_help; break;
			case "8ef790a5-b62c-4457-a5e4-889aeee97b3d": out= ruyi_api_help; break;
			case "c7b853e0-af47-4ab5-b0a7-27bb8165ca8e": out= ruyi_api_help; break;
			case "ce74ed7c-3935-4cef-a8b1-5c5f79ccd42d": out= ruyi_api_help; break;
			case "1ecb882e-92e7-4577-b848-52db8737fdbd": out= ruyi_api_help; break;
			case "0bcf3898-f105-4165-b1c0-96167b31c897": out= ruyi_api_help; break;
			case "43cd293f-c1e1-4664-89ff-3a7c188bda56": out= ruyi_api_help; break;
			case "459bd6b6-e38e-45e4-8934-4593bb707d4c": out= ruyi_api_help; break;
			case "bb8d6aec-8ac4-42f5-86bd-a8125addc8fe": out= ruyi_api_help; break;
			case "10756975-29f6-40dd-a77c-e5942f177360": out= ruyi_api_help; break;
			case "d78a996b-0272-4337-ba58-6cddd00a7503": out= ruyi_api_help; break;
			case "d2c33e92-1f29-4bee-8d95-1a579a960e94": out= ruyi_api_help + "/315_xin_wen_fu_wu.html"; break;
			case "6fc1c620-e31b-4ae5-a0e1-6709bb7029d9": out= ruyi_api_help; break;
			case "7e9b61b7-6dac-4005-83e0-ea2197372bf2": out= ruyi_api_help + "/316_smart_reply.html"; break;
			case "2013efe4-0f8e-423e-848c-be31f9f54396": out= ruyi_api_help; break;
			case "6e3a8217-d07d-4cb8-803c-75e952bb521b": out= ruyi_api_help; break;	
			case "1cfc16c8-bf40-4aef-88d4-adb9da5c9a2c": out= ruyi_api_help; break;
		}
		window.open(out);
		return out;
	};
}).filter("trustUrlFilter", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]).filter("mediaTrustUrlFilter", ['$rootScope','$sce', function ($rootScope,$sce) {
    return function (recordingUrl) {
    	recordingUrl = ruyi_wechat + "/ruyi-wechat/"+ $rootScope.app_key +"/content/" + recordingUrl;
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]).filter('popTypeFilter',
		function(){
	 return function(input) {
		var out = "";
		if(input < 6){
			out = "bottom";
		}else{
			out = "top";
		}
		return out;
	};
}).filter('arrayStrsFilter',
		function(){
	 return function(input) {
		if(input && input.length > 0){
			input = input.replace(/;/g,"&nbsp;&nbsp;&nbsp;");
		}
		return input;
	};
}).filter('nameFirstFilter',
		function(){
	 return function(input) {
		if(input.indexOf(";") > -1){
			var nameList = input.split(";");
			return nameList[0];
		}else{
			return input;
		}
	};
}).filter('robotHeadUrlFilter',
		function(){
	 return function(input) {
		if(!input || input.length == 0 || input == "img/default-robot.svg"){
			return "https://dn-vbuluo-static.qbox.me/default-robot.svg";
		}else{
			return input;
		}
	};
}).filter('robotHeadUrlListFilter',
		function(){
	 return function(input) {
		if(!input || input.length == 0){
			return "https://dn-vbuluo-static.qbox.me/default-robot.svg";
		}else{
			return input;
		}
	};
}).filter('robotTypeFilter',
		function(){
	 return function(input) {
		// if(input == "COMMON"){ 
		// 	return "通用";
		// }else{
		// 	return "儿童";
		// }
		switch(input){
			case "COMMON":
				return '通用';
			case "CHILD":
				return '儿童';
			case "INTEL_STORY_ROBOT":
				return '智能故事机';
			case "INTEL_ROBOT":
				return '智能机器人';
			case "INTEL_SPEAKER":
				return '智能音箱';
			case "SMART_TV":
				return '智能电视';
			case "INTEL_REFRIGERATOR":
				return '智能冰箱';
			case "SMART_HOME":
				return '智能家居';
			case "INTEL_CUSTOM_SERVICE":
				return '智能客服';
			default:
				return '通用';
		}
	};
}).filter('robotCheckedFilter',
		function(){
	 return function(id,myskills) {
		for(var i in myskills){
			if(myskills[i] == id){
				return true;
			}
		}
		return false;
	};
}).filter('assistantAnswerFilter',
		function(){
	 return function(assistantAnswer) {
		if(assistantAnswer){
			assistantAnswer = assistantAnswer.replace("sys.template.javascript =","");
			assistantAnswer = assistantAnswer.replace("sys.template.javascript=","");
			return assistantAnswer;
		}
	};
});

apiManagerApp.controller("apiManagerCtrl",function($rootScope,$scope, $state){
	$rootScope.ruyi_api_help = "http://docs.ruyi.ai";
	//设置让页面使用 start
	$rootScope.ruyi_wechat = ruyi_wechat;
	$rootScope.appId = appId;
	if(ruyiai_host.indexOf("127.0.0.1") > -1){
		$rootScope.appId = "692efdbc-9647-4394-9de3-bbfc57fb0b5a";
	}
	//设置让页面使用 end

	//根据当前页面的cookie来初始化选中当前是测试微信还是硬件
	var weixinLocal = getCookie("weixin_local");
	if(weixinLocal == "try-weixin"){
		$("#try-try .try-weixin").addClass("active").siblings("li").removeClass("active");
		$("#try-try #weixin-try").addClass("active in").siblings().removeClass("active in");
	}else if(weixinLocal == "try-local"){
		$("#try-try .try-local").addClass("active").siblings("li").removeClass("active");
		$("#try-try #local-try").addClass("active in").siblings().removeClass("active in");
	}
	
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	}, 200);
	dataEditedFlag = false;
	//获取中间栏的列表
	
	//跳转到app管理页面
	$scope.skipAppManager = function(){
		window.location.href = static_host + "/app_manager.html";
	}
	
	//点击放大试一试按钮
	$("body").off("click","[data-act=nav-test-try]").on("click","[data-act=nav-test-try]",function(event){
		$("#try-try .try-close").trigger("click");
	});
	
	$scope.clearAudio = function(containerOfAudio){
		containerOfAudio.find('audio').each(function(index, ele){
			if(!ele.paused){
				ele.pause();
			}
//			ele.currentTime = 0;
		});
	}
	
	$scope.goCenterList = function(listType,scenesId){
		setCookie("last-location-href",window.location.href);
		$(".fixed-btn").show();
		$scope.clearAudio($('.testContain'));
		$scope.clearAudio($('.testContainLocal'));
		setTimeout(function(){
			if(dataEditedFlag) {
				$.confirm_save({
					"text": "你的修改未保存，确定要离开此页面吗？",
			        "title": "系统提示",
			        "ensureFn": function() {
			        	dataEditedFlag = false;
			        	if(listType == "log_statistics"){
			    			$state.go("log_statistics");
			    		}else if(listType == "user_log_list"){
			    			$state.go("user_log_list");
			    		}else if(listType == "entity_list"){
			    			$state.go("entity_list");
			    		}else if(listType == "import_knowledge_base"){
			    			$state.go("import_knowledge_base");
			    		}else if(listType == "skill_store"){
			    			$state.go("skill_store");
			    		}else if(listType == "delete_robot"){
			    			$state.go("delete_robot");
			    		}else if(listType == "robot_paramenter"){
			    			$state.go("robot_paramenter");
			    		}else if(listType == "action_set"){
			    			$state.go("action_set");
			    		}else if(listType == "angularDemo"){
			    			$state.go("angularDemo");
			    		}else if(listType == "resource"){
			    			$state.go("resource");
			    		}else if(listType == "angularDemoTry"){
			    			$state.go("angularDemoTry");
//			    			$(".fixed-btn").hide();
			    		}else if(listType == "assistantPara"){
			    			$state.go("assistantPara");
			    		}else if(listType == "intent_search"){
			    			$state.go("intent_search");
			    			setTimeout(function(){
			    				$(".search-intent-list").focus();	
			    			},100);
			    		}else if(listType == "logout"){
			    			logoutFunc();
			    		}
			        	$('.modal-backdrop').hide();
			        },
			        "saveFn": function() {
			        	$(".save-and-apply").trigger("click");
			        	dataEditedFlag = false;
			        	if(listType == "log_statistics"){
			    			$state.go("log_statistics");
			    		}else if(listType == "user_log_list"){
			    			$state.go("user_log_list");
			    		}else if(listType == "entity_list"){
			    			$state.go("entity_list");
			    		}else if(listType == "import_knowledge_base"){
			    			$state.go("import_knowledge_base");
			    		}else if(listType == "skill_store"){
			    			$state.go("skill_store");
			    		}else if(listType == "delete_robot"){
			    			$state.go("delete_robot");
			    		}else if(listType == "robot_paramenter"){
			    			$state.go("robot_paramenter");
			    		}else if(listType == "action_set"){
			    			$state.go("action_set");
			    		}else if(listType == "angularDemo"){
			    			$state.go("angularDemo");
			    		}else if(listType == "resource"){
			    			$state.go("resource");
			    		}else if(listType == "angularDemoTry"){
			    			$state.go("angularDemoTry");
//			    			$(".fixed-btn").hide();
			    		}else if(listType == "assistantPara"){
			    			$state.go("assistantPara");
			    		}else if(listType == "intent_search"){
			    			$state.go("intent_search");
			    			setTimeout(function(){
			    				$(".search-intent-list").focus();	
			    			},100);
			    		}else if(listType == "logout"){
			    			setTimeout(function(){
			    				logoutFunc();
			    			}, 200);
			    		}
			        	$('.modal-backdrop').hide();
			        }
				});
			}
			
			if(dataEditedFlag) {
				return;
			}
			
			if(listType == "log_statistics"){
				$state.go("log_statistics");
			}else if(listType == "user_log_list"){
				$state.go("user_log_list");
			}else if(listType == "entity_list"){
				$state.go("entity_list");
			}else if(listType == "import_knowledge_base"){
				$state.go("import_knowledge_base");
			}else if(listType == "skill_store"){
				$state.go("skill_store");
			}else if(listType == "delete_robot"){
				$state.go("delete_robot");
			}else if(listType == "robot_paramenter"){
				$state.go("robot_paramenter");
			}else if(listType == "action_set"){
				$state.go("action_set");
			}else if(listType == "angularDemo"){
				$state.go("angularDemo");
			}else if(listType == "resource"){
				$state.go("resource");
			}else if(listType == "angularDemoTry"){
				$state.go("angularDemoTry");
//				$(".fixed-btn").hide();
			}else if(listType == "assistantPara"){
				$state.go("assistantPara");
			}else if(listType == "intent_search"){
				$state.go("intent_search");
				setTimeout(function(){
					$(".search-intent-list").focus();	
				},100);
			}else if(listType == "logout"){
				logoutFunc();
			}
			$('.modal-backdrop').hide();
		}, 100);
	}
	
	
	//跳转到首页
	$scope.skipIndex = function(){
		window.location.href = static_host + "/index.html";
	}
	
	//设置app名称
	$scope.appName = getCookie("appName");
	
	//根据场景获取中间栏的列表
	$("body").off("click",".scenario-object").on("click",".scenario-object",function(event){
		if($(this).hasClass('active')){
			return;
		}
		$('.scenario-object.active').removeClass('active');
		$(".fixed-btn").show();
		var $this = $(this);
		var scenarioId = $this.attr("data-scenario-id");
		if ($(event.target).is('.btn-scenario')) {
		    return;
		}
		if(dataEditedFlag) {
			$.confirm_save({
				"text": "你的修改未保存，确定要离开此页面吗？",
		        "title": "系统提示",
		        "ensureFn": function() {
		        	dataEditedFlag = false;
		        	window.location.href = "#/intent_list/" + scenarioId;
		        },
		        "saveFn": function() {
		        	$(".save-and-apply").trigger("click");
		        	dataEditedFlag = false;
		        	window.location.href = "#/intent_list/" + scenarioId;
		        }
			});
		}
		
		if(dataEditedFlag) {
			return;
		}

		if($(this).find('.colorBtn').css('background-color') == 'rgb(172, 172, 174)'){
			localStorage.isAbled = false;
		}else{
			localStorage.isAbled = true;
		}
		// 如果是系统动作
		if($(this).hasClass('sysSettings')){
			$(this).addClass('active');
			// 导向系统动作的路由器
			window.location.href = "#/intent_list/" + scenarioId;
			return;
		}
		window.location.href = "#/intent_list/" + scenarioId;
	});
	// 默认设置 localStorage.isAbled 为true，也就是打开状态
	localStorage.isAbled = true;
	//创建场景
	$("body").off("click",".left-addScenario").on("click",".left-addScenario",function(event){
	    event.stopPropagation();
	    window.location.href = "#/intent_list/-1";
	});
	
	$("body").off("click",".left-search").on("click",".left-search",function(event){
	    event.stopPropagation();
	});
	
	//删除场景
	$("body").off("click",".delete-scenario").on("click",".delete-scenario",function(event){
		event.stopPropagation();
		var $this = $(this);
		var scenarioId = $this.attr("data-scenario-id");
		var scenarioName = $this.attr("data-scenario-name");
		$.confirm({
	        "text": '场景删除之后所有数据都将无法恢复，你确认要删除 <span class="delete-confirm-tip">"'+ scenarioName +'"</span> 吗？' ,
	        "title": "删除场景",
	        "ensureFn": function() {
	        	for(var i in $scope.scenarioList){
					if(scenarioId == $scope.scenarioList[i].id){
						$scope.scenarioList.splice(i,1);
						$scope.$apply();
						if($scope.scenarioList.length > 1){
							////// [1]
							window.location.href = "#/intent_list/" + $scope.scenarioList[0].id;
						}else{
							window.location.href = "";
						}
						break;
					}
				}
	        	$.ajax({
	    			url: ruyiai_host + "/ruyi-ai/"+ appId +"/scenario/" + scenarioId,
	    			method: "DELETE",
	    			success: function(data){
	    				data = dataParse(data);
					if(data.code == 0){
	    					$.trace("删除成功","success");
	    					callAgentReloadTestFunc(); //通知nlp reload
	    				}else if(data.code == 2){
	    					goIndex();
	    				}else{
	    					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
	    				}
	    			}
	    		});
				return false;
			}
		});
	});
	$("#dialogScenes").delegate(".btn-scenario","click",function(event){
		event.stopPropagation();
		var $this = $(this);
		$this.parent().addClass("open");
		var left = this.getBoundingClientRect().left+document.documentElement.scrollLeft;
		var top = this.getBoundingClientRect().top+document.documentElement.scrollTop;
		$this.next().css({"left":left,"top":top});
	});
	$("#dialogScenes").delegate(".btn-group","mouseleave",function(){
		$(this).removeClass("open");
	});
	//复制场景
	$scope.copyScenario = function(scenarioId,newappId){
		var url_temp = window.location.href.split("/");
		var current_intentId = url_temp[url_temp.length - 1];
		var current_sceneId = url_temp[url_temp.length - 3];
//		console.log("url_temp:" + url_temp);
//		console.log("current_intentId:" + current_intentId);
//		console.log("current_sceneId:" + current_sceneId);
//		console.log("scenarioId:" + scenarioId);
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+ appId+ "/scenario/" + scenarioId + "/copy/" + newappId,
			method: "GET",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					callAgentReloadTestFunc(); //通知nlp reload
					$.trace("场景复制成功","success");
//					window.location.href = "#/intent_list/" +scenarioId+ "/intent_detail/" + current_intentId;
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	}
	//获取场景列表
	$scope.getScenarioListFunc = function(){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+ appId +"/scenario",
			data:{"start":0, "limit":500},
			method: "GET",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					$scope.scenarioList = data.result;
					for(var i = 0, len = $scope.scenarioList.length; i < len; i++){
						$scope.scenarioList[i].isAbledClass = $scope.scenarioList[i].scenarioStatus == 'VALID' ? 'isAbled' : 'unAbled';
						$scope.scenarioList[i].title = $scope.scenarioList[i].scenarioStatus == 'VALID' ? "该场景已打开" : "该场景已关闭";
						// 针对第一个 也就是系统动作
						if(i == 0 && $scope.scenarioList[i].scenarioType == "SYSTEMACTION"){
							$scope.scenarioList[i].shouldHide = true;
						}
					}
					if(window.location.href.length - (window.location.href.indexOf(".html") + 5) < 3){
						// if($scope.scenarioList && $scope.scenarioList.length > 1){
							///// [1]
							window.location.href = "#/intent_list/" + $scope.scenarioList[0].id;
						// }
					}
					$scope.$apply();
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
				// 跳转主页，临时解决     后续需要处理  2017-07-11 @zhoubc
				// if($('.list-group li.active')[0] == $('.list-group li:nth-child(3)')[0]){
				// 	$('.list-group [data-act="nav-log-statistics"]').click();
				// }
			}
		});
	}
	$scope.getScenarioListFunc();
	
	//查询所有虚拟助理
	$scope.getAllAppFunc = function(){
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
					}else if(data.code == 1){
					}else if(data && data.code == 2){
						goIndex();
					}
				}
			});
		}
	}
	
	//切换app
	$scope.goConsoleManager = function(appId,appName,appKey){
		setCookie("appId",appId);
		setCookie("appName",appName);
		setCookie("appKey",appKey);
		//window.location.href = static_host + "/console/api_manager.html";
		if(window.location.href.indexOf("log_statistics") > -1){
			window.location.reload();
		}else{
			window.location.href = static_host + "/console/api_manager.html#/log_statistics";
			window.location.reload();
		}
	}
	
	//退出登录状态
//	function logoutFunc(){
//		$.ajax({
//			url : ruyiai_host + "/ruyi-ai/user/logout.html",
//			method : "get",
//			success: function(data) {
//				delCookie("email");
//				delCookie("nickname");
//				delCookie("userId");
//				delCookie("appId");
//				delCookie("appName");
//				delCookie("appKey");
//				delCookie("tgt");
//				window.location.href = static_host + "/index.html";
//			}
//		});
//	}
	
	//缺省回复设置
	$("[data-act=assistant-answer]").click(function(){
		$("#assistantAnswerModal").modal("show");
	});
	
	//导出html5链接
	$("[data-act=html5-link]").click(function(){
		$("#export-html5-link").modal("show");
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		if (userAgent.indexOf("Firefox") > -1 || userAgent.indexOf("Chrome") > -1) {
	    }else{
	    	$("#export-html5-link .copy-link").hide();
	    	$("#export-html5-link .form-control.link").css("width", "100%");
	    }
		$(".link").val(static_host + "/h5-wechat/wechat.html?appName=" + getCookie("appName") + "&appKey=" + getCookie("appKey"));
	});
	
	//设置agent
	$scope.settingAppFunc = function(){
		setTimeout(function(){
			$.ajax({
				url : ruyiai_host + "/ruyi-ai/app/" + appId,
				data: JSON.stringify({"id": appId,"defaultResponses":$scope.defaultResponses}),
				traditional: true,
				headers: {"Content-Type" : "application/json"},
				method: "PUT",
				success: function(data) {
					data = dataParse(data);
					if(data.code == 0){
						$.trace("保存成功","success");
						$("#assistantAnswerModal").modal("hide");
					}else if(data.code == 2){
						goIndex();
					}else{
						if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
					}
				}
			});
		},100);
	}
	
	$('#assistantAnswerModal').on('shown.bs.modal', function () {
		$.ajax({
			url : ruyiai_host + "/ruyi-ai/app/" + appId,
			method : "get",
			success: function(data) {
				data = dataParse(data);
					if(data.code == 0){
					$scope.agent = data.result.attribute;
					$scope.defaultResponses = data.result.defaultResponses;
					$scope.$apply();
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	})
	
	//用户编辑用户说话的模板
	$scope.addDefaultResponseFunc = function(defResponse,$index){
		if(!defResponse || $.trim(defResponse).length <= 0){
			return false;
		}
		if(!$scope.defaultResponses){
			$scope.defaultResponses = new Array();
			$scope.defaultResponses.push(defResponse);
		}else{
			var flag = false;
			for(var i in $scope.defaultResponses){
				if(i == $index){
					$scope.defaultResponses[i] = defResponse;
					flag = true;
				}
			}
			if(!flag){
				$scope.defaultResponses.push(defResponse);
			}
		}
		$scope.defResponse = "";
	}
	//enter添加用户说的模板
	$scope.addDefaultResponseKeydownFunc = function($event,defResponse,index){
		if($event.keyCode == 13){
			$scope.addDefaultResponseFunc(defResponse,index);
		}
	}
	
	//提交缺省回复保存
	$scope.setDefaultResponseFunc = function(){
		$scope.settingAppFunc();
	}
	
	//删除缺省回复
	$scope.deleteDefaultResponseFunc = function(index){
		for(var i in $scope.defaultResponses){
			if(i == index){
				$scope.defaultResponses.splice(i,1);
				break;
			}
		}
	}
	
	//场景展开收起
	$("[data-act=nav-scenario]").click(function(){
		var $this = $(this);
		var myclass = $this.attr("class");
		var select_icon = $this.find(".select-icon");
		if(myclass.indexOf("collapsed") > -1){
			select_icon.removeClass("glyphicon-triangle-right").addClass("glyphicon-triangle-bottom");
		}else{
			select_icon.removeClass("glyphicon-triangle-bottom").addClass("glyphicon-triangle-right");
		}
	});
	
	//点击界面任何一个地方触发
//	$("body").click(function(event){
//		var $target = $(event.target);
//		if(!$target.is('[data-toggle="popover"]') && !$target.is('.popover-content')){
//			$('[data-toggle="popover"]').popover('hide');
//		}
//	});
//	
//	$("body").keydown(function(event){
//		if(event.keyCode == 27){
//			$('[data-toggle="popover"]').popover('hide');
//			$(".modal").modal("hide");
//		}
//	});
//	$("body").on("[data-toggle='popover']",function(){});
	
	//显示隐藏app列表
	$("[data-act=show-app-list],[data-act=app-list-box]").mouseover(function(){
		$scope.getAllAppFunc();
		$(".left-box .assistant-box ul").css("display","block");
	});
	//显示隐藏app列表
	$("[data-act=show-app-list],[data-act=app-list-box]").mouseout(function(){
		$(".left-box .assistant-box ul").css("display","none");
	});
	
	//设置app列表的高度
	function setAppListBoxHeight(){
		$("[data-act=app-list-box]").css("max-height",($(document).height()-170) + "px");
	}
	setAppListBoxHeight();
	
	$(window).resize(function() {
		setAppListBoxHeight();
		//设置属性框的高度
		//$("#assistantParaModal .modal-body").css("height",document.documentElement.clientHeight - 180);
	});
	
	//设置关闭图标的关闭动作
	$("body").off("click",".close-modal,.cancel-modal").on("click",".close-modal,.cancel-modal",function(event){
		var $this = $(this);
		$this.closest(".modal").modal("hide");
	});

	$("body").off("click",".title-action").on("click",".title-action",function(event){
		var $this = $(this);
		var $icon = $this.find("i.glyphicon");
		$("[data-act=assistant-para-arrow]").removeClass("glyphicon-triangle-bottom").addClass("glyphicon-triangle-left");
			var isopen = $this.closest(".title").find(".panel-collapse").attr("aria-expanded");
			if(!isopen || isopen == "false"){
				$icon.removeClass("glyphicon-triangle-left").addClass("glyphicon-triangle-bottom");
			}
	});
	
	// 试一试对话
	$scope.talks = [];
	$scope.localTalks = [];
	$scope.responseJSONS = [];
//	$scope.userSaysTextTry = "";
//	$scope.userSaysTextTryLocal = "";
	//提交测试
	var myrandom = Math.random();
	var demo_user_id = (myrandom + "").substr(0, 10);
	$rootScope.app_key = getCookie("appKey");
	//TODO 记得提交代码的时候注释掉
//	$rootScope.app_key = "fca2f900-5e36-4014-90e2-9d166ea6a089";
	$rootScope.assistant_app_id = appId;
	
	$("body").off("keydown","[data-act=sendMsg]").on("keydown","[data-act=sendMsg]",function(e){
		if(e.keyCode == 13){
			var $parentNode = $(e.currentTarget.parentNode);
			if($parentNode.attr("class").indexOf("testTextareaLocal") < 0){
				$scope.testSubmit();
			}else{
				$scope.testSubmitLocal();
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
	
	$scope.testSubmit = function($event){
		var content_type = $(".tab-content-max .tab-pane.active").attr("id");
		if(!$(".testTextarea textarea").val() || $(".testTextarea textarea").val().length == 0  || $(".testTextarea textarea").val().replace(/(^\s*)|(\s*$)/g,"")==""){
			$.trace("请填写你要说的话");
			$(".testTextarea textarea").focus();
			return false;
		}
		if($(".testTextarea textarea").val()){
			$scope.talks.push({serverLeft: false,userRight: true,talkText:$(".testTextarea textarea").val()});
			setTimeout(function(){
				$(".try-testContain").scrollTop($(".try-testContain")[0].scrollHeight);
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
		var demo_input;
		var options = "entities,intents,know,act";
		var domains = "test";
		var context = {
			'reference_time': new Date().getTime(),
			'timezone':'Asia/Shanghai',
			'domains':domains
		}
//		if($scope.userSaysTextTry.indexOf('%') > -1){
//			$scope.errorUserSaysTextTry = $scope.userSaysTextTry.split('%');
//			 $scope.userSaysTextTry = '';
//			$($scope.errorUserSaysTextTry).each(function(index, ele){
//				if(ele !== ''){
//					$scope.userSaysTextTry += ele;
//				}
//			});
//		}
		$scope.userSaysTextTry = $scope.handleSpecialChars($scope.userSaysTextTry);
		demo_input = encodeURIComponent($scope.userSaysTextTry);
		demo_input = {
				"app_key": $rootScope.app_key,
//				"app_key":'7b730914-a5c5-43d7-889a-e27e62931fff',
				"q":demo_input,
				"options":options,
				"user_id":uuid,
				"reset_session":wechatResetSession,
//				"skip_log":"ruyi123",
				"context":context
		};
		
		//正式版和测试版做不同的处理 start
		var processApiResultFunc = function(data){
			data = dataParse(data);
					if(data.code == 0){
				wechatResetSession = "false";
				var result = data.result;
				var textValue = "未匹配到意图";
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
//									url = "http://ml.ruyi.ai/ruyi-wechat/1b793621-31ce-4a61-9e6f-fe4ed10422c2/content/WsqI-spqLgZCIKUFEPSP50PWAwYEMuUsTwJUqc-Xj3E";
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
//									url = "http://ml.ruyi.ai/ruyi-wechat/1b793621-31ce-4a61-9e6f-fe4ed10422c2/content/WsqI-spqLgZCIKUFEPSP5whkHDLhyzJg1U7IMrcPDA8";
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
//									var url_temp = "http://127.0.0.1/ruyi-ai/1b793621-31ce-4a61-9e6f-fe4ed10422c2/transfor/news/WsqI-spqLgZCIKUFEPSP5ymo10vm3azU3nlfZb6CLFQ";
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
//									var data = '{"msg": "success","result": {"news_item": [{"author": "admin","content_source_url": "","digest": "testnewstestnewstestnewstestnewstestnewstestnewstestnews","show_cover_pic": 1,"thumb_media_id": "WsqI-spqLgZCIKUFEPSP523FodiFag0VhgmBcRh5yAI","thumb_url": "http://mmbiz.qpic.cn/mmbiz/neQXvoSSJbLPZJIjfzDk2cbf8A30kv7n9c12HRb06Qu7FxhBiciaeh0vF8bn5tqQuAM8apz1jfS7jIEJJLUODuBg/0?wx_fmt=jpeg","title": "testnews","url": "http://mp.weixin.qq.com/s?__biz=MzI0NDEyMTk0OQ==&mid=100000029&idx=1&sn=9332da4a5c9755b8bd0bf110ffc76115#rd"}],"success": true},"code": 0}';
//									var data = '{"msg": "success","result": {"news_item": [{"author": "admin","content_source_url": "","digest": "testnewstestnewstestnewstestnewstestnewstestnewstestnews","show_cover_pic": 1,"thumb_media_id": "WsqI-spqLgZCIKUFEPSP523FodiFag0VhgmBcRh5yAI","thumb_url": "http://mmbiz.qpic.cn/mmbiz/neQXvoSSJbLPZJIjfzDk2cbf8A30kv7n9c12HRb06Qu7FxhBiciaeh0vF8bn5tqQuAM8apz1jfS7jIEJJLUODuBg/0?wx_fmt=jpeg","title": "testnews","url": "http://mp.weixin.qq.com/s?__biz=MzI0NDEyMTk0OQ==&mid=100000029&idx=1&sn=9332da4a5c9755b8bd0bf110ffc76115#rd"},{"author": "admin","content_source_url": "","digest": "testnewstestnewstestnewstestnewstestnewstestnewstestnews","show_cover_pic": 1,"thumb_media_id": "WsqI-spqLgZCIKUFEPSP523FodiFag0VhgmBcRh5yAI","thumb_url": "http://mmbiz.qpic.cn/mmbiz/neQXvoSSJbLPZJIjfzDk2cbf8A30kv7n9c12HRb06Qu7FxhBiciaeh0vF8bn5tqQuAM8apz1jfS7jIEJJLUODuBg/0?wx_fmt=jpeg","title": "testnews","url": "http://mp.weixin.qq.com/s?__biz=MzI0NDEyMTk0OQ==&mid=100000029&idx=1&sn=9332da4a5c9755b8bd0bf110ffc76115#rd"}],"success": true},"code": 0}';
//									
//									for(var i in data.result.news_item){
//										var object = new Object();
//										object.description = data.result.news_item[i].digest;
//										object.title = data.result.news_item[i].title;
//										object.pic_url = ruyi_wechat + "/ruyi-wechat/"+ $rootScope.assistant_app_id +"/content/" + data.result.news_item[i].thumb_media_id;
//										object.url = data.result.news_item[i].url;
//										list.push(object);
//									}
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
				$(".try-testContain").scrollTop($(".try-testContain")[0].scrollHeight);
				if($("#responseJson")[0]){
					$("#responseJson").scrollTop($("#responseJson")[0].scrollHeight);
				}
			}else{
				$.trace(data.msg);
			}
		}
		//正式版和测试版做不同的处理 end
		
		var preTime = new Date().getTime();
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

	$scope.testSubmitLocal = function($event){
		if(!$(".testTextareaLocal textarea").val() || $(".testTextareaLocal textarea").val().length == 0 || $(".testTextareaLocal textarea").val().replace(/(^\s*)|(\s*$)/g,"")==""){
			$.trace("请填写你要说的话");
			$(".testTextarea textarea").focus();
			return false;
		}
		if($(".testTextareaLocal textarea").val()){
			$scope.localTalks.push({serverLeft: false,userRight: true,talkText:$(".testTextareaLocal textarea").val()});
			setTimeout(function(){
				$(".try-testContain-local").scrollTop($(".try-testContain-local")[0].scrollHeight);
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
		var demo_input;
		var options = "entities,intents,know,act";
		var domains = "test";
		var context = {
			'reference_time': new Date().getTime(),
			'timezone':'Asia/Shanghai',
			'domains':domains
		}
		//jds
		$scope.userSaysTextTryLocal = $scope.handleSpecialChars($scope.userSaysTextTryLocal);
		demo_input = encodeURIComponent($scope.userSaysTextTryLocal);
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
				$(".try-testContain-local").scrollTop($(".try-testContain-local")[0].scrollHeight);
				if($("#responseJson")[0]){
					$("#responseJson").scrollTop($("#responseJson")[0].scrollHeight);
				}
			}else{
				$.trace(data.msg);
			}
		}
		//正式版和测试版做不同的处理 end
		
		var preTime = new Date().getTime();
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
			if($($($event.target)[0])){
				$($($event.target)[0]).css("background-color","#3794FF");
			}
		}
	};
	
	$(".fixed-btn").click(function(){
		$(".try-dialog").addClass("ng-scope");
	});
	$(".try-dialog").draggable({ 
	    cursor: 'move',   
	    refreshPositions: true,
	    cancel: ".not-drag",
	    containment: "#api-manager-box"
	});
	
	$(".max-modal").click(function(){
		$scope.userSaysTextTry = $("[ng-model=userSaysTextTry]").val();
		$scope.userSaysTextTryLocal = $("[ng-model=userSaysTextTryLocal]").val();
//		$(".fixed-btn").hide();
	});
	
	//阻止点击屏幕其他地方关闭此窗口
	$('#try-try').on('hide.bs.modal', function (event) {
		return false;
	});
	
	//关闭试一试弹框
	$("body").off("click","#try-try .try-close").on("click","#try-try .try-close",function(event){
		$("#try-try").css("display","none");
	});
	
	//试一试按钮
	$("body").off("click","[data-act=try-btn]").on("click","[data-act=try-btn]",function(event){
		if(window.location.href.indexOf("angularDemoTry") == -1){
			if($("#try-try").css("display") == "none"){
				$("#try-try").css("display","block");
				setTimeout(function(){
					$("[data-act=sendMsg]").focus();
				}, 300);
			}else{
				$("#try-try").css("display","none");
			}
		}
	});
	
	 // 复制html5链接
	 $("body").off("click","[data-act=copy-link]").on("click","[data-act=copy-link]",function(event){
			event.stopPropagation();
			var $this = $(this);
			var html5_link = $this.siblings().val();
			var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		    if (userAgent.indexOf("Firefox") > -1 || userAgent.indexOf("Chrome") > -1) {
		    	 var html5_link_copy=document.getElementById("html5-link");
		    	 html5_link_copy.value= encodeURI(html5_link);
		    	 html5_link_copy.select(); // 选择对象
		    	 document.execCommand("Copy"); // 执行浏览器复制命令
		    	 $.trace("已复制，可直接贴粘。");
			 }else{
				 
			 }
	 });
	 
	 $('body').on('#save_change', function () {
		$("#save_change").focus();
	});
	 
	 $("body").off("keydown","#save_change").on("keydown","#save_change",function($event){
		if($event.keyCode == 13){
			$("[data-act=save]").trigger("click");
		}
	});
	 
	 //控制帮助对话框 start
    $("body").off("click","#help-box").on("click","#help-box",function(){
		 var $this = $(this);
		 $this.css("transform","scale(1)");
	 });
	//控制帮助对话框 end
    
	$("#help-box").draggable({ 
	    cursor: 'move',   
	    refreshPositions: true,
	    cancel: ".not-drag",
	    containment: "#api-manager-box"
	});
	
	//显示隐藏帮助聊天框
	$("body").off("click","#help-icon,#help-box .help-reduce").on("click","#help-icon,#help-box .help-reduce",function(){
		var $helpBox = $("#help-box");
		if($helpBox.css("display") == "block"){
			$helpBox.css("display","none");
		}else{
			setTimeout(function(){
				$(window.frames["help-iframe"].document).contents().find("#talkInputId").focus();
			}, 200);
			$helpBox.css("display","block");
		}
	});

	
		
	//判断是否已经登陆
	function checkUserFunc(){
		var email = getCookie("email");
		var userId = getCookie("userId");
		var tgt = getCookie('tgt');
		if(tgt && tgt.length > 0){
			$("#nav-mylogin").css("display","none");
			$("#nav-register").css("display","none");
			$("#nav-user-info").css("display","block");
			$("#help").css("display","block");
		}else{
			$("#nav-mylogin").css("display","block");
			$("#nav-register").css("display","block");
			$("#nav-user-info").css("display","none");
			$("#help").css("display","none");
		}
		$("[data-act=myemail]").text(getCookie("email"));
	}
	checkUserFunc();
	
	$("#appkey-manager").click(function(){
		window.location.href = static_host + "/app_manager.html";
	});
	
	//修改密码 start
	//修改密码
	$("body").off("click","[data-act=change-password]").on("click","[data-act=change-password]",function($event){
		var oldpasswd = $("#oldpasswd");
		var newpasswd = $("#newpasswd");
		var re_newpasswd = $("#re-newpasswd");
		if($.trim(oldpasswd.val()).length == 0){
			$.trace("请输入原始密码");
			oldpasswd.focus();
			return false;
		}else if ($.trim(newpasswd.val()).length == 0){
	        $.trace("请输入新密码");  
	        newpasswd.focus();
	        return false;  
	    }else if(newpasswd.val() != re_newpasswd.val()){
	    	$.trace("两次输入的新密码不一致");  
	    	re_newpasswd.focus();
	        return false;  
	    }
	    
		$.ajax({
			url : api_host + "/password",
			method : "POST",
			data: JSON.stringify({"email": getCookie("email"),"old_password":oldpasswd.val(),"new_password":newpasswd.val()}),
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				$.trace("密码修改成功","success");
				delCookie("email");
				delCookie("nickname");
				delCookie("userId");
				delCookie("appId");
				delCookie("appName");
				delCookie("appKey");
				delCookie('tgt');
				window.location.href = static_host + "/base/login.html"
				//$("#change-password").modal("hide");
			},
			error: function(err){
				var err = JSON.parse(err.responseText);
				$.trace(err.msg);
			}
		});
		
	});
	
	//修改密码获得光标
	$('#change-password').on('shown.bs.modal', function () {
		$("#oldpasswd").focus();
	});
	
	//修改密码回车
	$("body").off("keydown","#oldpasswd,#newpasswd,#re-newpasswd").on("keydown","#oldpasswd,#newpasswd,#re-newpasswd",function($event){
		if($event.keyCode == 13){
			$("[data-act=change-password]").trigger("click");
		}
	})
	//修改密码 end
	
//	$("#mylogout").click(function(){//注销
//		$.ajax({
//			url : ruyiai_host + "/ruyi-ai/user/logout.html",
//			method : "get",
//			success: function(data) {
//				data = JSON.parse(data);
//				if(data.code == 0){
//					delCookie("email");
//					delCookie("nickname");
//					delCookie("userId");
//					delCookie("appId");
//					delCookie("appName");
//					delCookie("appKey");
//					window.location.href = static_host + "/index.html";
//				}else if(data.code == 2){
//					goIndex();
//				}else if(data.code == 1){
//					$.trace(""+data.msg,"error");
//					$r_username.focus();
//				}
//			}
//		});
//	});
	
	$("#mylogout").click(function(){//注销
		$.ajax({
			url : api_host + "/v1/tickets/" + getCookie('tgt'),
			method : "DELETE",
			success: function(data) {
				delCookie("email");
				delCookie("nickname");
				delCookie("userId");
				delCookie("appId");
				delCookie("appName");
				delCookie("appKey");
				delCookie('tgt');
				window.location.href = static_host + "/index.html";
			}
		});
	});
	
	//判断当前是否是创建机器人状态
	var createRobot = getCookie("createRobot");
	if(createRobot && createRobot == "true"){
		$(".nav-robot-box").css("display","block");
		$(".create-robot-foot").css("display","block");
		$(".create-robot-left").css("display","block");
		$(".para-action-tips").css("display","block");
	}
	
	//跳出引导
	$("body").off("click",".create-robot-skip").on("click",".create-robot-skip",function($event){
		$(".nav-robot-box").css("display","none");
		$(".create-robot-foot").css("display","none");
		$(".create-robot-left").css("display","none");
		$(".para-action-tips").css("display","none");
		setCookie("createRobot","false");
	})
	
	//下一步引导
	$("body").off("click",".create-robot-next").on("click",".create-robot-next",function($event){
		var $this = $(this);
		var href =window.location.href;
		if(href.indexOf("#/robot_paramenter") > -1 || href.indexOf("#/delete_robot") > -1){
			$this.text("完成");
			$(".para-action-tips").css("display","block");
			$(".para-action-tips p").text("点击卡片查看详情,添加机器人技巧插件");
			$(".para-action-tips").css({"top":"176px","left":"30%"});
			$(".nav-robot-box li:last").addClass("active");
			$state.go("skill_store");
		}else if(href.indexOf("#/skill_store") > -1){
			$(".nav-robot-box").css("display","none");
			$(".create-robot-foot").css("display","none");
			$(".create-robot-left").css("display","none");
			$(".para-action-tips").css("display","none");
			setCookie("createRobot","false");
			$("#finish-baseinfo-set").modal("show");
		}
	})
	
	$scope.continueGuide = function(){
		window.location.href = static_host + "/console/api_manager.html";
	}
	$scope.exitContinueGuide = function(){
		setCookie("isOldUser","true");
		$("#finish-baseinfo-set").modal("hide");
	}
	
	$("body").off("click","[data-act=nav-scenario]").on("click","[data-act=nav-scenario]",function($event){
		$("#robot-parament").removeClass("in");
	})
	
	$("body").off("click","[data-act=nav-robot-para]").on("click","[data-act=nav-robot-para]",function($event){
		$("#dialogScenes").removeClass("in");
	})
	
	//动脑猜猜,词汇乐园,鹦鹉学舌
//	var markSmartList = ["0bcf3898-f105-4165-b1c0-96167b31c897","43cd293f-c1e1-4664-89ff-3a7c188bda56","3b1cfe4d-dc78-4b66-9d9b-a5c065ca5e50"];
	
	//获得最新的岁数，月份和天
	var getNewYearMonthFunc = function(){
		var birthday = $rootScope.currentRobot.attribute.birthday;
		var diffYear = 1;
		var diffMonth = 0;
		var diffDay = 0;
		var currTime = new Date().getTime();
		var diffTime = currTime - birthday;
		diffTime = Math.abs(diffTime);
		
		var chuYear = diffTime / (365*24*60*60*1000);
		chuYear = parseInt(chuYear);
		if(chuYear > 0){
			diffYear =  chuYear;
			diffTime = diffTime - (chuYear * (365*24*60*60*1000));
		}else{
			diffYear = 0;
		}
		
		var chuMonth = diffTime / (30*24*60*60*1000);
		chuMonth = parseInt(chuMonth);
		if(chuMonth > 0){
			diffMonth = chuMonth;
			diffTime = diffTime - (chuMonth * (30*24*60*60*1000));
		}else{
			diffMonth = 0;
		}
		
		var chuDay = diffTime / (24*60*60*1000);
		chuDay = parseInt(chuDay);
		if(chuDay > 0){
			diffDay = chuDay;
		}else{
			diffDay = 0;
		}
		
		if(currTime < birthday){
			diffYear = -diffYear;
			diffMonth = -diffMonth;
			diffDay = -diffDay;
		}
		$rootScope.currentRobot.attribute.ageyear = diffYear;
		$rootScope.currentRobot.attribute.agemonth = diffMonth;
		$rootScope.currentRobot.attribute.ageday = diffDay;
	}
	//!!!!!!!!!!
	var getAppModelFunc = function(){
		//获取app信息
		$.ajax({
			url : ruyiai_host + "/ruyi-ai/app/" + appId,
			method : "get",
			success: function(data) {
				data = dataParse(data);
					if(data.code == 0){
					$rootScope.currentRobot = data.result;
					$rootScope.currentRobotType = data.result.robotType;
					getNewYearMonthFunc();
					$rootScope.$apply();
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	}
	getAppModelFunc();
	
	$("body").off("click","[data-act=skip-to-index]").on("click","[data-act=skip-to-index]",function(event){
		if(dataEditedFlag) {
			$.confirm_save({
				"text": "你的修改未保存，确定要离开意图详情页面吗？",
		        "title": "系统提示",
		        "ensureFn": function() {
		        	dataEditedFlag = false;
		        	if(!$("[data-act=confirmShow]").css("display")){
		        		window.location.href = static_host + "/index.html";
		    		}
		        },
		        "saveFn": function() {
					$(".save-and-apply").trigger("click");
					dataEditedFlag = false;
					setTimeout(function(){
						if(!$("[data-act=confirmShow]").css("display")){
							window.location.href = static_host + "/index.html";
						}
					}, 200);
		        }
			});
		}else {
			window.location.href = static_host + "/index.html";
		}
		if(dataEditedFlag) {
			return;
		}
	});
	
	//禁用bootstrap自带的跳转，防止浏览器地址被改变
	 $('.try-nav li').on('show.bs.tab', function (e) {
		 setCookie("weixin_local",$(this).attr("class"));
		 //手动选中 start
		 if(getCookie("weixin_local") == "try-local"){
			 $(".try-nav .try-local").addClass("active").siblings().removeClass("active");
			 $("#local-try").addClass("active in").siblings().removeClass("active in");
		 }else{
			 $(".try-nav .try-weixin").addClass("active").siblings().removeClass("active");
			 $("#weixin-try").addClass("active in").siblings().removeClass("active in");
		 }
		 setTimeout(function(){
			 $("[data-act=sendMsg]").focus();
		 }, 300);
		 //手动选中 end
	      return false;
	 });
	
	//通用的修改tab地址跳转的方法 start
	$("body").off("click","[data-act=nav-tabs] li").on("click","[data-act=nav-tabs] li",function(event){
		var $this = $(this);
		var tabNameStr = $this.attr("data-act");
		if(!$this.hasClass("active")){
			$this.addClass("active").siblings("li").removeClass("active");
			$this.parent(".nav-tabs").siblings(".tab-content").find("#" + tabNameStr).addClass("in active").siblings(".tab-pane").removeClass("in active");
		}
	});
	//通用的修改tab地址跳转的方法 end
	
	//通用的修改tab地址跳转的方法 start
	$("body").off("mouseover","[data-act=copy-to-other-robot]").on("mouseover","[data-act=copy-to-other-robot]",function(event){
		$scope.getAllAppFunc();
	});
	//通用的修改tab地址跳转的方法 end
	
	$("body").off("dblclick","[data-act=show-app-list]").on("dblclick","[data-act=show-app-list]",function(event){
		setTimeout(function(){
			$(".robot-header-edit").siblings(".edit-para").trigger("click");
		}, 500);
		window.location.href = "#/robot_paramenter";
	});
	
	$("body").off("dblclick","[data-act=try-nav-dbclick]").on("dblclick","[data-act=try-nav-dbclick]",function(event){
		$("[data-act=nav-test-try]").trigger("click");
	});
	
	//定时判断是否已经登出，如果登出了，给出提示 start
//	var loginCheckInterval = setInterval(function(){
//		$.ajax({
//			url: ruyiai_host + "/ruyi-ai/"+ appId +"/login/status",
//			method: "GET",
//			success: function(data){
//				
//				data = dataParse(data);
//					if(data.code == 0){
//				}else{
//					if($("[data-act=confirmShow]").css("display") != "block"){
//						$.confirm({
//							"text": '账号已经登出，未保存的数据将会丢失？' ,
//							"title": "登出提示",
//							"ensureFn": function() {
//								goIndex();
//							}
//						});
//					}
//				}
//			}
//		});
//	}, 120000);
	//定时判断是否已经登出，如果登出了，给出提示 end
	
	//延迟加载编辑器js
    setTimeout(function () {  
        var head = document.getElementsByTagName('head')[0];  
        var js = document.createElement("script");  
        js.type = "text/javascript";  
        js.src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/ace.js";
        var js1 = document.createElement("script");  
        js1.type = "text/javascript";  
        js1.src = "https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.6.8/beautify.js";
        head.appendChild(js);
        head.appendChild(js1);
    }, 6000);

    // 开启所有tooltip

    setTimeout(function(){
    	$("[data-toggle='tooltip']").tooltip({
    		'placement': 'auto top',
    		'container': "body"
    	});
    },800)

    $('.left-box ul:first li:first').click();

});







