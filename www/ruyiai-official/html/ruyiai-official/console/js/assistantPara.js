function assistantParaCtrl($rootScope, $scope, $state, $stateParams){
	var data_act = $(".list-group-item.active").attr("data-act");
	var scenarioId = $(".scenario-object.list-group-item.active").attr("data-scenario-id");
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-test-try]").addClass("active");
	var agentDuplicate = "";
	$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	// entityDetail监视
	$scope.$watch('agent', function(newValue, oldValue) {
		var newValueTemp = JSON.stringify(newValue);
		if(newValueTemp == agentDuplicate){
			dataEditedFlag = false;
		}else{
			dataEditedFlag = true;
		}
	}, true);
	//初始化日历插件
	$("#assistantParaModal [name=birthday]").datepicker({
      changeMonth: true,
      changeYear: true
    });
	var multiFeature = ["name","habitualaction","play","eat","drink","thing","people","book","movie","tv","music","place","color","sport","dislike",
	                    "skill","ability","dream","belief","friend","idol","secret","motto","language","checkedList"];
	//初始化助理属性设置页面
		$.ajax({
			url : ruyiai_host + "/ruyi-ai/app/" + appId,
			method : "get",
			success: function(data) {
				data = dataParse(data);
					if(data.code == 0){
					$scope.agent = data.result.attribute;
					$scope.defaultResponses = data.result.defaultResponses;
					$scope.agent.deleteTip = "是";
					if($scope.agent.isgrowth){
						if($scope.agent.isgrowth == 'true'){
							$scope.agent.isgrowth = true;
						}else{
							$scope.agent.isgrowth = false;
						}
						var birthday = $scope.agent.birthday;
						if(birthday && birthday.length > 0){
							birthday = parseInt(birthday);
							var tempDate = new Date();
							tempDate.setTime(birthday);
							var out = $.timeFormat(tempDate,"MM/dd/yyyy");
							$scope.agent.birthdayDate = out;
						}
						if(!$scope.agent.deleteTip){
							$scope.agent.deleteTip = "是";
						}
					}else{
						var agent = new Object();
						agent.name = [];
						agent.whyname = "";
						agent.sex = "";
						agent.bloodtype = "";
						agent.birthday = "";
						agent.birthdayDate = "";
						agent.ageyear = "";
						agent.agemonth = "";
						agent.ageday = "";
						agent.isgrowth = true;
						agent.constellation = "";
						agent.zodiac = "";
						agent.sexuality = "";
						agent.face = "";
						agent.brow = "";
						agent.eye = "";
						agent.nose = "";
						agent.mouth = "";
						agent.skincolor = "";
						agent.personaltrait = "";
						agent.habitualaction = []; 
						agent.height = "";
						agent.weight = "";
						agent.personal = "";
						agent.favorite = "";
						agent.play = [];
						agent.eat = [];
						agent.drink = [];
						agent.thing = [];
						agent.people = [];
						agent.book = [];
						agent.movie = [];
						agent.tv = [];
						agent.music = [];
						agent.place = [];
						agent.color = [];
						agent.sport = [];
						agent.dislike = [];
						agent.skill = [];
						agent.ability = [];
						agent.IQ = "";
						agent.dream = [];
						agent.belief = [];
						agent.friend = [];
						agent.marry = "";
						agent.idol = [];
						agent.experience = "";
						agent.secret = [];
						agent.motto = [];
						agent.mantra = "";
						agent.language= [];
						agent.nationality = "";
						agent.birthplace = "";
						agent.family = "";
						agent.father= "";
						agent.foccupation = "";
						agent.fop = "";
						agent.mother = "";
						agent.moccupation = "";
						agent.mop = "";
						agent.bbro= "";
						agent.bbo = "";
						agent.bbop = "";
						agent.lbro = "";
						agent.lbo = "";
						agent.lbop = "";
						agent.bsis= "";
						agent.bso = "";
						agent.bsop = "";
						agent.lsis = "";
						agent.lso = "";
						agent.lsop = "";
						agent.occupation = "";
						agent.op = "";
						agent.edu = "";
						agent.school = "";
						agent.heightCM = "";
						agent.heightCustom = "";
						agent.heightCustomize = "";
						agent.deleteTip = "是";
						agent.checkedList = [];
						$scope.agent = agent;
					}
					$scope.$apply();
					if(typeof $scope.agent.habitualaction == "string" && $scope.agent.habitualaction.length >= 2 && $scope.agent.habitualaction.indexOf(";;") == -1){
						//$scope.agent.habitualaction = JSON.parse($scope.agent.habitualaction);
						$scope.agent.habitualaction = $scope.agent.habitualaction.split(";");
					}else{
						$scope.agent.habitualaction = [];
					}
					for(var i in multiFeature){
						if($scope.agent[multiFeature[i]] != "" && typeof $scope.agent[multiFeature[i]] == "string"){
							$scope.agent[multiFeature[i]] = $scope.agent[multiFeature[i]].split(";");
						}
					}
					for(var i in $scope.agent.checkedList){
						if($("." + $scope.agent.checkedList[i]).parents(".btn-group").attr("class")){
							if($("." + $scope.agent.checkedList[i]).parents(".btn-group").attr("class").indexOf("favorite") != -1){
								$(".favorite").show();
							}
							if($("." + $scope.agent.checkedList[i]).parents(".btn-group").attr("class").indexOf("appearance") != -1){
								$(".appearance").show();
							}
						}
						$(".dropdown-menu li." + $scope.agent.checkedList[i]).addClass("disabled").attr("disabled","disabled");
						$(".btn." + $scope.agent.checkedList[i]).attr("disabled","disabled");
						$("." + $scope.agent.checkedList[i]).removeClass("deleted").show();
					}
					$scope.agent.checkedList = [];
					//生理属性 start
					$scope.habitualactionList = ['抖腿',"皱眉","挠头","叉腰","耸肩","托腮",'撩头发','托眼镜','二郎腿','摸耳朵','抿嘴巴',"舔嘴唇","咬下唇","咬指甲","摸鼻子","掰手指","打响指","吹口哨","绕头发","翻白眼儿","双手抱胸","摇头晃脑"]; 
				    var updateSelected = function(action,multiFeature,featureType){
						switch(featureType){
						case "habitualaction": if(!$scope.agent.habitualaction){
									$scope.agent.habitualaction = [];
								}
							    if(action == 'add' && $scope.agent.habitualaction.indexOf(multiFeature) == -1){ 
							      $scope.agent.habitualaction.push(multiFeature); 
							    }else if(action == 'remove' && $scope.agent.habitualaction.indexOf(multiFeature) != -1){ 
							      var idx = $scope.agent.habitualaction.indexOf(multiFeature);
							      $scope.agent.habitualaction.splice(idx,1); 
							    } 
								break;
						}
						
				     } 
					  $scope.updateSelection = function($event, multiFeature,featureType){
					    var checkbox = $event.target; 
					    var action = (checkbox.checked?'add':'remove'); 
					    updateSelected(action,multiFeature,featureType); 
					  } 
					  $scope.isSelected = function(multiFeature,featureType){ 
						switch(featureType){
						case "habitualaction": if(!$scope.agent.habitualaction){
													$scope.agent.habitualaction = [];
												}
										    	return $scope.agent.habitualaction.indexOf(multiFeature)>=0; 
												break;
						}
							
					  }
					//生理属性 end
					agentDuplicate = JSON.stringify($scope.agent);
					$scope.$apply();
					
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		
		});
	
	//设置agent
	$scope.settingAppFunc = function(){
		setTimeout(function(){
			if($scope.agent){
				if( $scope.agent.birthdayDate && $scope.agent.birthdayDate.length > 0){
					$scope.agent.birthday = new Date($scope.agent.birthdayDate).getTime();
				}
				if($scope.agent.heightCustomize == "cm"){
					$scope.agent.height = $scope.agent.heightCM;
				}else if($scope.agent.heightCustomize == "其他"){
					$scope.agent.height = $scope.agent.heightCustom;
				}else if($scope.agent.heightCustomize == ""){
					$scope.agent.height = "保密";
				}
				$scope.agent.checkedList = [];
				for(var i = 0; i < $(".btn[disabled]").length; i++){
					$scope.agent.checkedList.push($(".btn[disabled]").eq(i).attr("class").split(" ")[2]);
				}
				for(var i = 0; i < $(".dropdown-menu li[disabled]").length; i++){
					$scope.agent.checkedList.push($(".dropdown-menu li[disabled]").eq(i).attr("class").split(" ")[0]);
				}
				//将多项特征转换为用"；"号隔开
				for(var i in multiFeature){
					if($scope.agent[multiFeature[i]] && $scope.agent[multiFeature[i]].length > 0){
						var length = $scope.agent[multiFeature[i]].length;
						var temp = "";
						for(var j in $scope.agent[multiFeature[i]]){
							temp+=$scope.agent[multiFeature[i]][j];
							if(j != (length - 1)){
								temp +=";";
							}
						}
						$scope.agent[multiFeature[i]] = temp;
					}else{
						$scope.agent[multiFeature[i]] = "";
					}
				}
				
				$.ajax({
					url : ruyiai_host + "/ruyi-ai/app/" + appId,
					data: JSON.stringify({"id": appId,"attribute":$scope.agent,"defaultResponses":$scope.defaultResponses}),
					traditional: true,
					headers: {"Content-Type" : "application/json"},
					method: "PUT",
					success: function(data) {
						data = dataParse(data);
					if(data.code == 0){
							$.trace("保存成功","success");
							dataEditedFlag = false;
						}else if(data.code == 2){
							goIndex();
						}else{
							if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
						}
					}
				});
				if(typeof $scope.agent.habitualaction == "string" && $scope.agent.habitualaction.length >= 2 && $scope.agent.habitualaction.indexOf(";;") == -1){
					//$scope.agent.habitualaction = JSON.parse($scope.agent.habitualaction);
					$scope.agent.habitualaction = $scope.agent.habitualaction.split(";");
				}else{
					$scope.agent.habitualaction = [];
				}
				for(var i in multiFeature){
					if($scope.agent[multiFeature[i]] != "" && typeof $scope.agent[multiFeature[i]] == "string"){
						$scope.agent[multiFeature[i]] = $scope.agent[multiFeature[i]].split(";");
					}
				}
				
			}
		},0);
	}
	
	//根据日期获取星座
	function getAstro(month,day){    
	    var s="魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
	    var arr=[20,19,21,21,21,22,23,23,23,23,22,22];
	    return s.substr(month*2-(day<arr[month-1]?2:0),2) + "座";
	}
	
	//根据日期获取属相
	function getZodiac(year){
		var ssc=year%12;
		var ssyear=new Array("鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"); 
		return ssyear[ssc];
	}
	
	//是否成长
	$scope.isGrowthFunc = function(){
		if($scope.agent.birthdayDate){
			$scope.setBirthdayFunc($scope.agent.birthdayDate);
		}
	}
	//选择生日
	$scope.setBirthdayFunc = function(birthday){
		birthday = new Date(birthday);
		setTimeout(function(){
			var year = birthday.getYear();
			var month = birthday.getMonth()+1;
			var day = birthday.getDate();
			var constellation = getAstro(month,day);
			var zodiac = getZodiac(year);
			$scope.agent.constellation = constellation;
			$scope.agent.zodiac = zodiac;
			
			if($scope.agent.isgrowth && $scope.agent.isgrowth != "false"){
				var diffYear = 1;
				var diffMonth = 0;
				var diffDay = 0;
				var currTime = new Date().getTime();
				var diffTime = currTime - birthday.getTime();
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
				$scope.agent.ageyear = diffYear;
				$scope.agent.agemonth = diffMonth;
				$scope.agent.ageday = diffDay;
				$scope.$apply();
			}
		}, 100);
	}
	$scope.resetAgentParaFunc = function(){
		$.confirm({
			"text": '你确定要重置所有助理属性吗？',
	        "title": "重置",
	        "ensureFn": function() {
	        	var agent = new Object();
	        	agent.name = [];
	        	agent.whyname = "";
				agent.sex = "";
				agent.bloodtype = "";
				agent.birthday = "";
				agent.birthdayDate = "";
				agent.ageyear = "";
				agent.agemonth = "";
				agent.ageday = "";
				agent.isgrowth = true;
				agent.heightCM = "";
				agent.heightCustom = "";
				agent.heightCustomize = "";
				agent.constellation = "";
				agent.zodiac = "";
				agent.sexuality = "";
				agent.face = "";
				agent.brow = "";
				agent.eye = "";
				agent.nose = "";
				agent.mouth = "";
				agent.skincolor = "";
				agent.personaltrait = "";
				agent.habitualaction = []; 
				agent.height = "";
				agent.weight = "";
				agent.IQ = "";
				agent.personal = "";
				agent.favorite = "";
				agent.play = [];
				agent.eat = [];
				agent.drink = [];
				agent.thing = [];
				agent.people = [];
				agent.book = [];
				agent.movie = [];
				agent.tv = [];
				agent.music = [];
				agent.place = [];
				agent.color = [];
				agent.sport = [];
				agent.dislike = [];
				agent.skill = [];
				agent.ability = [];
				agent.dream = [];
				agent.belief = [];
				agent.friend = [];
				agent.marry = "";
				agent.idol = [];
				agent.experience = "";
				agent.secret = [];
				agent.motto = [];
				agent.mantra = "";
				agent.language= [];
				agent.nationality = "";
				agent.birthplace = "";
				agent.family = "";
				agent.father= "";
				agent.foccupation = "";
				agent.fop = "";
				agent.mother = "";
				agent.moccupation = "";
				agent.mop = "";
				agent.bbro= "";
				agent.bbo = "";
				agent.bbop = "";
				agent.lbro = "";
				agent.lbo = "";
				agent.lbop = "";
				agent.bsis= "";
				agent.bso = "";
				agent.bsop = "";
				agent.lsis = "";
				agent.lso = "";
				agent.lsop = "";
				agent.occupation = "";
				agent.op = "";
				agent.edu = "";
				agent.school = "";
				agent.deleteTip = "是";
				agent.checkedList = [];
				$scope.agent = agent;
				$scope.$apply();
				$(".assistant-para-basic .btn").attr("disabled","disabled");
				$(".assistant-para-personal .btn").removeAttr("disabled");
				$(".assistant-para-family .btn").removeAttr("disabled");
				$(".assistant-para-social .btn").removeAttr("disabled");
				$(".dropdown-menu li").removeClass("disabled").removeAttr("disabled");
				$(".assistant-para-basic li").show();
				$(".assistant-para-personal .list-group-item:gt(1)").hide();
				$(".assistant-para-family .list-group-item:gt(1)").hide();
				$(".assistant-para-social .list-group-item:gt(1)").hide();
				$("li.appearance > div").hide();
				$("li.favorite > div").hide();
	        }
		});
	}
	$scope.closeAssistantPara = function(){
		if(dataEditedFlag) {
			$.confirm_save({
				"text": "你的修改未保存，确定要离开助理属性页面吗？",
		        "title": "系统提示",
		        "ensureFn": function() {
		        	dataEditedFlag = false;
		        	$(".list-group-item").removeClass("active");
		    		$("[data-act=" + data_act + "]").addClass("active");
					switch(data_act){
					case "nav-scenario": window.location.href = "#/intent_list/" + scenarioId;break;
					case "nav-entity": $state.go("entity_list"); break;
					case "nav-resource": $state.go("resource"); break;
					case "nav-log": $state.go("user_log_list.log_statistics"); break;
					case "nav-reference": $state.go("skill_store"); break;
					case "nav-test": $state.go("angularDemo"); break;
					case "nav-test-try": $state.go("angularDemoTry"); break;
					}
		        },
		        "saveFn": function() {
		        	$(".assistant-footer .rating-submit").trigger("click");
		        	dataEditedFlag = false;
		        	$(".list-group-item").removeClass("active");
		    		$("[data-act=" + data_act + "]").addClass("active");
					switch(data_act){
					case "nav-scenario": window.location.href = "#/intent_list/" + scenarioId;break;
					case "nav-entity": $state.go("entity_list"); break;
					case "nav-resource": $state.go("resource"); break;
					case "nav-log": $state.go("user_log_list.log_statistics"); break;
					case "nav-reference": $state.go("skill_store"); break;
					case "nav-test": $state.go("angularDemo"); break;
					case "nav-test-try": $state.go("angularDemoTry"); break;
					}
		        }
			});
		}else{
			$(".list-group-item").removeClass("active");
			$("[data-act=" + data_act + "]").addClass("active");
			switch(data_act){
			case "nav-scenario": window.location.href = "#/intent_list/" + scenarioId;break;
			case "nav-entity": $state.go("entity_list"); break;
			case "nav-resource": $state.go("resource"); break;
			case "nav-log": $state.go("user_log_list.log_statistics"); break;
			case "nav-reference": $state.go("skill_store"); break;
			case "nav-test": $state.go("angularDemo"); break;
			case "nav-test-try": $state.go("angularDemoTry"); break;
			}
		}
		
	}
	$(".delete-tips input").click(function(){
		$scope.$apply();
	});
	// 删除助理属性
	$(".assistant-para-box li i.delete").click(function($event){
		$event.stopPropagation();
		var $this = $(this);
		if($this.parents(".title").length){
			var appearance = $this.parents(".title").attr("class").split(" ")[3];
		}else{
			var appearance = null;
		}
		var delete_item = $this.parent().attr("class").split(" ")[1];
		var temp = $this.parent().attr("class").split(" ")[0];
		if($scope.agent.deleteTip == "是"){
			$.confirm({
				"text": '您确认删除该属性吗？',
		        "title": "删除属性",
		        "ensureFn": function() {
		        	if(appearance != null){
		        		$scope.agent[appearance] = "";
						$this.parents(".title").addClass("deleted").hide();
						$this.parents(".list-group-item").siblings().children(".btn-group").find("." + appearance).removeClass("disabled").removeAttr("disabled");
						if($this.parents(".appearance").children(".deleted").length == 9){
							$this.parents(".appearance").hide();
						}
		        	}else if(delete_item != "deleted" && delete_item != null){
							if(delete_item == "height"){
								$scope.agent.height = "";
								$scope.agent.heightCM = "";
								$scope.agent.heightCustom = "";
								$scope.agent.heightCustomize = "";
							}else if(delete_item == "father" || delete_item == "mother" || delete_item == "bbro" || delete_item == "lbro" || delete_item == "bsis" || delete_item == "lsis" || delete_item == "occupation" || delete_item == "education"){
								for(var i = 0; i < $this.siblings("input").length; i++){
									var delete_item_temp = $this.siblings("input").eq(i).attr("class").split(" ")[0];
									$scope.agent[delete_item_temp] = "";
								}
							}else if(delete_item == "birthday"){ 
								$scope.agent.birthdayDate = "";
								$scope.agent.birthday = "";
								$scope.agent.agemonth = "";
								$scope.agent.ageyear = "";
								$scope.agent.zodiac = "";
								$scope.agent.constellation = "";
							}else{
								$scope.agent[delete_item] = "";
							}
							$this.parent().hide().siblings().children(".btn." + delete_item).removeClass("disabled").removeAttr("disabled");
					}else{
						$scope.agent[temp] = "";
						$this.parent().addClass("deleted").hide();
						$this.parents(".list-group-item").siblings().children(".btn-group").find("." + temp).removeClass("disabled").removeAttr("disabled");
						if($this.parents(".favorite").children(".deleted").length == 12){
							$this.parents(".favorite").hide();
						}
					}
		        }
			});
		}else{
			if(appearance != null){
				$scope.agent[appearance] = "";
				$this.parents(".title").addClass("deleted").hide();
				$this.parents(".list-group-item").siblings().children(".btn-group").find("." + appearance).removeClass("disabled").removeAttr("disabled");
				if($this.parents(".appearance").children(".deleted").length == 9){
					$this.parents(".appearance").hide();
				}
			}else if(delete_item != null){
					if(delete_item == "height"){
						$scope.agent.height = "";
						$scope.agent.heightCM = "";
						$scope.agent.heightCustom = "";
						$scope.agent.heightCustomize = "";
					}else if(delete_item == "father" || delete_item == "mother" || delete_item == "bbro" || delete_item == "lbro" || delete_item == "bsis" || delete_item == "lsis" || delete_item == "occupation" || delete_item == "education"){
						for(var i = 0; i < $this.siblings("input").length; i++){
							var delete_item_temp = $this.siblings("input").eq(i).attr("class").split(" ")[0];
							$scope.agent[delete_item_temp] = "";
						}
					}else if(delete_item == "birthday"){ 
						$scope.agent.birthdayDate = "";
						$scope.agent.birthday = "";
						$scope.agent.agemonth = "";
						$scope.agent.ageyear = "";
						$scope.agent.zodiac = "";
						$scope.agent.constellation = "";
					}else{
						$scope.agent[delete_item] = "";
					}
					$this.parent().hide().siblings().children(".btn." + delete_item).removeClass("disabled").removeAttr("disabled");
			}else{
				$scope.agent[temp] = "";
				$this.parent().addClass("deleted").hide().parent().siblings().find("." + temp).removeClass("disabled").removeAttr("disabled");
				if($this.parents(".favorite").children(".deleted").length == 12){
					$this.parents(".favorite").hide();
				}
			}
		}
		$scope.$apply();
	});
	// 添加助理属性
	$(".assistant-para-box li button.btn").click(function(){
		var add_item = $(this).attr("class").split(" ")[2];
		if(add_item != "appearance" && add_item != "favorite" && add_item != "myhelp"){
			$(this).attr("disabled","disabled").parents(".assistant-para-box").children("." + add_item).show().children("input").text(" ");
		}	
	});
	$(".assistant-para-box li .btn-group li").click(function(){
		var parents = $(this).parents(".btn-group").attr("class").split(" ")[1];
		if(parents == "appearance"){
			$(".appearance").show();
		}else if(parents == "favorite"){
			$(".favorite").show();
		}
		var add_item = $(this).attr("class");
		$(this).addClass("disabled").attr("disabled","disabled").parents(".assistant-para-box").find("." + add_item).removeClass("deleted").show().find("a").show();
	});
	
	//传入多个属性
	$scope.addMultiFeatureFunc = function(addFeature,type,temp){
		if(addFeature && $.trim(addFeature).length > 0){
			if(!$scope.agent[type]){
				$scope.agent[type] = new Array();
			}
			if($scope.agent[type].indexOf(addFeature) == -1){
				$scope.agent[type].push(addFeature);
				$scope[temp] = "";
			}else{
				$.trace("请不要重复输入！");
			}

		}
	}
	//enter添加多个属性
	$scope.addMultiFeatureKeydownFunc = function($event,addFeature,type,temp){
		if($event.keyCode == 13){
			$scope.addMultiFeatureFunc(addFeature,type,temp);
		}
	}
	//删除传入多个属性
	$scope.deleteMultiFeatureFunc = function(context,type){
		for(var i in $scope.agent[type]){
			if($scope.agent[type][i] == context){
				$scope.agent[type].splice(i,1);
			}
		}
		
	}
}