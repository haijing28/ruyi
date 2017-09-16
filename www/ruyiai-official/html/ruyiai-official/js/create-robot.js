$(function(){
	var appListTemp = [];
	
	//选择机器人类型
	$("body").off("click",".choose-type-box li").on("click",".choose-type-box li",function($event){
		 var $this = $(this);
		 $('.choose-type-box li.active').removeClass('active');
		 $this.addClass('active');
	});
	
	var rand = "";
	//获得三位随机数字
	var randomThreeFunc = function(){
		rand = "";
		for(var i = 0; i < 5; i++){
		    var r = Math.floor(Math.random() * 10);
		    rand += r;
		}
		return "ruyi聊天机器人" + rand;
	} 
	
	//更新app信息
	var updateAppInfoFucn = function(appDetail){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/app/" + appDetail.id,
			data: JSON.stringify(appDetail),
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			method: "PUT",
			success: function(data){
			}
		});
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
	
	//选择生日
	var setBirthdayFunc = function(birthday){
		var birthdayObject = new Object();
		
//		birthday = new Date(birthday);
		var out = $.timeFormat(birthday,"MM/dd/yyyy");
		birthdayObject.birthdayDate = out;
		birthdayObject.birthday = new Date(out).getTime();
		
		var year = birthday.getYear();
		var month = birthday.getMonth()+1;
		var day = birthday.getDate();
		var constellation = getAstro(month,day);
		var zodiac = getZodiac(year);
		birthdayObject.constellation = constellation;
		birthdayObject.zodiac = zodiac;
		return birthdayObject;
	}
	
	//创建意图
	var addIntentFunc = function(scenarioId){
		var intentDetail = new Object();
		intentDetail.auto = true;
		intentDetail.mlLevel = "MIDDLE";
		intentDetail.name = "寒暄";
		intentDetail.priority = 0;
		intentDetail.speech = [];
		var responses = [ { "outputs": [ [ { "property": { "text": "hello" }, "type": "wechat.text" }, { "property": { "text": "你好！好久不见" }, "type": "wechat.text" } ], [ { "property": { "text": "hello" }, "type": "dialog" }, { "property": { "text": "你好！好久不见" }, "type": "dialog" } ] ], "parameters": [] } ];
		intentDetail.templates = [ "hi", "hello", "你好" ];
		intentDetail.responses = responses;
		
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+getCookie("appId")+"/"+ scenarioId +"/intent",
			data: JSON.stringify(intentDetail),
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			method: "POST",
			success: function(data){
				//创建默认的用户说和助理答
				data = dataParse(data);
		 		if(data.code == 0){
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
				//window.location.href = "console/api_manager.html#/robot_paramenter";
				window.location.href = "app_manager.html";
			},error:function(){
				$.trace("意图创建失败");
			}
		});
	}
	
	//添加场景
	var addScenarioFunc = function(scenario_title,addIntentFuncExecute){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/"+ getCookie("appId") +"/scenario",
			data:JSON.stringify({"name":scenario_title}),
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			method: "POST",
			success: function(data){
				data = dataParse(data);
		 		if(data.code == 0){
					var scenarioId = data.result.id;
					setTimeout(function(){
						if(addIntentFuncExecute){
							addIntentFuncExecute(scenarioId);
						}
					}, 500);
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	};
	
	//创建机器人下一步
	$("body").off("click",".create-robot-next.active").on("click",".create-robot-next.active",function($event){
		 var $robot = $(".choose-type-box li.active");
		 var robotType = $robot.attr("data-type");
		 if(!robotType){
			 $.trace("请选择机器人类型");
			 return false;
		 }
		 
		 $(".create-robot-next").removeClass("active");
		 $(".create-robot-next").text("创建中，请耐心等待...");
		 
		 var birthdayObject = setBirthdayFunc(new Date());
		 var appName = randomThreeFunc();
		 var attributeObj = {"sex":"女","name":"","zodiac":birthdayObject.zodiac,"constellation":birthdayObject.constellation,"ageday":0,"agemonth":0,"ageyear":0,"birthday":birthdayObject.birthday,"birthdayDate":birthdayObject.birthdayDate};
		 var defaultResponsesObj = ['sys.template.javascript= var date = new Date().getHours(); if (date < 1) {     return "啊呀！都凌晨1点啦，还不休息吗？可爱的小朋友。快点休息吧，早睡早起才能身体好呢！我们明天再聊吧！"; } else if (date < 2) {     return "啊呀！不聊啦不聊啦。这都要凌晨两点啦，可爱的小宝贝，原来你属夜猫子呀，快休息休息啦，早睡早起才能身体好嘛！"; } else if (date < 3) {     return "啊啊。。哈。打哈欠了我都要，小主人怎么还不睡觉呀，快睡觉觉啦！"; } else if (date < 4) {     return "自从来了地球，我也开始有作息了，你是起床了还是还没有睡啊！？我想休息休息，你也休息休息吧！"; } else if (date < 5) {     return "说不下去啦，再一会太阳公公都要上班啦，我也想休息休息啦！"; } else if (date < 6) {     return "一日之计在于晨，一年之计在于春，早睡早起身体好！希望宝宝今天开开心心的！"; } else if (date < 7) {     return "早睡早起身体好！希望宝宝今天开开心心的！"; } else if (date < 8) {     return "啊呜啊呜，我要吃点知识再继续跟你聊哦！你也要好好吃早饭哦！"; } else if (date < 9) {     return "你刚刚说的我听不太懂啦，不过上午时光这么宝贵，小主人可以看看书什么的学习一下！"; } else if (date < 10) {     return "哇突然发现睡了个好觉后， 上午精神就百倍了呢"; } else if (date < 11) {     return "哎呀，肚子有点饿的咕咕叫了呢，吃点什么垫垫吧"; } else if (date < 12) {     return "哎呦， 这个时候你们该吃午饭啦， 跟我说午饭午饭， 给我喂点知识吧， 这样我就可以继续跟你聊天啦！ 爱你呦！ "; } else if (date < 13) {     return "瞧这大中午的， 其实小睡一下不错呢！ 我也休息休息！ 一会再跟你聊哦！ "; } else if (date < 14) {     return "瞧这大中午的， 其实小睡一下不错呢！ 我也休息休息！ 一会再跟你聊哦！ "; } else if (date < 15) {     return "白日依山尽， 黄河， 啊， 咦， 我好像说错啦！ ";  } else if (date < 16) {     return "一下午就这么过去了， 肚子有点 饿了呢， 该是吃点心的时候啦 "; } else if (date < 17) {     return "可爱的小朋友， 你下午学习了吗？ "; } else if (date < 18) {     return "啊呀， 太阳公公都要下班啦， 我也想休息休息啦！ 我们一会再聊嘛！ "; } else if (date < 19) {     return "啊呜啊呜， 我要吃点知识再继续跟你聊哦！ 你也要好好吃晚饭哦！ "; } else if (date < 20) {     return "晚上啦， 听听故事吧， 在故事名前面加上给我放三个字， 我就可以放给你听哦 "; } else if (date < 21) {     return "哇， 一下子一天又快过去了呢， 小朋友快快洗洗澡， 放松一下吧 "; } else if (date < 22) {     return "深夜啦， 好好睡觉， 才能长高高！ 快睡啦！ 晚安！ "; } else if (date < 23) {     return "大晚上还那么精神呀， 快快睡觉 觉吧， 这样小朋友才能长的高高的 "; } else if (date < 24) {     return "哎呀呀不聊啦不聊啦， 怎么这么晚还不睡觉呢， 明天早上有人要赖床了哦 "; }','sys.template.javascript= var date = new Date().getHours(); if (date < 1) {     return "可爱的小朋友。快点休息吧，早睡早起才能身体好呢！我们明天再聊吧！"; } else if (date < 2) {     return "小主人，原来你属夜猫子呀，快休息休息啦，早睡早起才能身体好嘛！"; } else if (date < 3) {     return "小主人怎么还不睡觉呀，快睡觉觉啦！我们明天再聊"; } else if (date < 4) {     return "你是起床了还是还没有睡啊！？说的我嘴都干了，要休息休息了，你也休息休息吧！"; } else if (date < 5) {     return "小主人你好好休息休息，我要去找太阳公公啦，提醒他一会上班！"; } else if (date < 6) {     return "伸个懒腰起的很早嘛！小主人，早上好！"; } else if (date < 7) {     return "起的很早嘛！小主人"; } else if (date < 8) {     return "我也不太清楚你说的是什么啦，啊呜啊呜，我要吃点知识再继续跟你聊哦！你也要好好吃早饭哦！"; } else if (date < 9) {     return "你刚刚说的我听不太懂啦，不过上午时光这么宝贵，小主人可以看看书什么的学习一下！"; } else if (date < 10) {     return "咦，你有没有发现睡了个好觉后 ，精神变得好好哦"; } else if (date < 11) {     return "哎呀，肚子有点饿的咕咕叫了呢，吃点什么垫垫吧"; } else if (date < 12) {     return "哎呦，这个时候你们该吃午饭啦，跟我说午饭午饭，给我喂点知识吧，这样我就可以继续跟你聊天啦！爱你呦！"; } else if (date < 13) {     return "哎呀，感觉吃饱了，就有点困呢，我们休息，休息一会吧"; } else if (date < 14) {     return "哇，刚刚睡了个午觉， 感觉能量满满呢"; } else if(date<15) {     return "嘿嘿， 告诉你一个小秘密哦， 如果你说四点钟来找我玩的话， 我从三点钟起， 就兴奋的不得了呢 "; } else if(date<16){     return "一下午就这么过去了， 肚子有点 饿了呢， 该是吃点心的时候啦"; } else if (date < 17) {     return "可爱的小朋友，你下午学习了吗？ "; } else if (date < 18) {     return "太阳公公下班啦，月亮姐姐出来啦！我想休息休息啦！我们一会再说好吗？"; } else if (date < 19) {     return "我看看表啊，都这个点儿啦，人类要好好吃饭饭！我也要吃知识呢！跟我说晚饭晚饭，给我喂知识吧！这样我就可以继续跟你好好聊天啦！爱你！"; } else if (date < 20) {     return "晚上啦，听听故事吧，在故事名前面加上给我放三个字，我就可以放给你听哦"; } else if (date < 21) {     return "哇，一下子一天又快过去了呢， 小朋友快快洗洗澡，放松一下吧"; } else if (date < 22) {     return "深夜啦，好好睡觉，才能长高高！快睡啦！晚安！"; } else if (date < 23) {     return "大晚上怎么那么精神呀，快休息吧，明天还要忙呢"; } else if (date < 24) {     return "哎呀呀不聊啦不聊啦，怎么这么晚还不睡觉呢，明天早上有人要变成小懒虫啦"; }','sys.template.javascript= var date=new Date().getHours(); if(date<1){return "都这个点儿啦，快休息啦，我也休息啦，明儿再聊";} else if(date<2){return "我就想问问，你累吗？这么晚啦，咱们明天再聊吧，乖哈！";} else if(date<3){return "早点睡觉才能长高高嘛！快！不聊啦，睡觉去吧！";} else if(date<4){return "自从来了地球，我也开始有作息了，说的我口都干了，你是起床了还是还没有睡啊！？我想休息休息，你也休息休息吧！";} else if(date<5){return "说不下去啦，再一会太阳公公都要上班啦，我也想休息休息啦！";} else if(date<6){return "太阳当空照，花儿对我笑，小鸟说早早早，你为什么背上小书包，哈哈哈哈，早上好呀北鼻！";} else if(date<7){return "太阳太阳，给我们带来，七色光彩，哈哈哈哈，早上好呀北鼻！";} else if(date<8){return "啊呜啊呜，我要吃点知识再继续跟你聊哦！你也要好好吃早饭哦！";} else if(date<9){return "你刚刚说的我听不太懂啦，不过上午时光这么宝贵，小主人可以看看书什么的学习一下！";} else if(date<10) {return "对了，我发现睡的好的话， 早上人变的干劲十足了呢，精神变得好好哦";} else if(date<11) {return "不知不觉发现肚子有点饿了呢， 我吃点知识再和你聊吧";} else if(date<12) {return "哎呦，这个时候你们该吃午饭啦，跟我说午饭午饭，吃饱了才有力气跟你聊天哦！爱你！";} else if(date<13) {return "开心，吃的饱饱哒，小朋友中午 吃的好吗";} else if(date<14) {return "哇，刚刚睡了个午觉， 感觉动力十足呢";} else if(date<15) {return "及时当勉励，岁月不待人 ……哎呀，刚说到哪了";} else if(date<16){return "哎呀，下午马上要过去了，肚子 都咕咕叫了呢，吃点心的时间到了呢";} else if(date<17){return "可爱的小朋友，你下午学习了吗？ ";} else if(date<18) {return "说不下去啦，再一会太阳公公都要上班啦，我也想休息休息啦！";} else if(date<19){return "看着家家户户的灯光，忍不住感 叹一句：有家的感觉真好呀";} else if(date<20) {return "晚上啦，听听故事吧，在故事名前面加上给我放三个字，我就可以放给你听哦";} else if(date<21){return "咦，小朋友今天的任务都完成了吧，休息休息吧";} else if(date<22) {return "深夜啦，好好睡觉，才能长高高！快睡啦！晚安！";} else if(date<23) {return "看看时间已经很晚了呢，快休息吧，明天还要忙呢";} else if(date<24){return "不聊啦不聊啦这么晚了，我有点累了，小朋友快休息吧，我们明天再聊吧";}','sys.template.javascript= var date = new Date().getHours(); if (date < 1) {     return "啊呀！都凌晨1点啦，还不休息吗？可爱的小朋友。快点休息吧，早睡早起才能身体好呢！我们明天再聊吧！"; } else if (date < 2) {     return "啊呀！不聊啦不聊啦。这都要凌晨两点啦，可爱的小宝贝，原来你属夜猫子呀，快休息休息啦，早睡早起才能身体好嘛！"; } else if (date < 3) {     return "啊啊。。哈。打哈欠了我都要，说不动啦说不动啦，小主人怎么还不睡觉呀，快睡觉觉啦！"; } else if (date < 4) {     return "自从来了地球，我也开始有作息了，说的我口都干了，你是起床了还是还没有睡啊！？我想休息休息，你也休息休息吧！"; } else if (date < 5) {     return "太阳公公一会就上班啦，小主人，我们一会天亮了再说吧？好不好呀"; } else if (date < 6) {     return "我刚才看了一下表，小主人，再有一会就可以看到太阳啦！可爱的太阳, 高高挂在天上, 放出万丈光芒"; } else if (date < 7) {     return "太阳当空照，花儿对我笑，小鸟说早早早，你为什么背上小书包，哈哈哈哈，早上好呀北鼻！"; } else if (date < 8) {     return "啊呜啊呜，我要吃点知识再继续跟你聊哦！你也要好好吃早饭哦！"; } else if (date < 9) {     return "你刚刚说的我听不太懂啦，不过上午时光这么宝贵，小主人可以看看书什么的学习一下！"; } else if (date < 10) {     return "咦，你有没有发现睡了个好觉后 ，一大早干劲十足呢"; } else if (date < 11) {     return "哎呀，肚子有点饿的咕咕叫了呢，吃饭时间快到了吧"; } else if (date < 12) {     return "我看看表啊，都这个点儿啦，人类要好好吃饭饭！我也要知识呢！跟我说午饭午饭，给我喂知识吧！这样我就可以继续跟你好好聊天啦！爱你！"; } else if (date < 13) {     return "开心，吃的饱饱哒，先睡个午觉吧 "; } else if (date < 14) {     return "哇，前面小睡了一会， 人又精神百倍了呢"; } else if (date < 15) {     return "嘿嘿，悄悄告诉你哦，你说四点钟来找我玩的话，我从三点钟起，就好开心了呢"; } else if (date < 16) {     return "哎呀，下午马上要过去了，肚子 都咕咕叫了呢，吃点心的时间到了呢"; } else if (date < 17) {     return "可爱的小朋友，你下午学习了吗？"; } else if (date < 18) {     return "说不下去啦，再一会太阳公公都要上班啦，我也想休息休息啦！"; } else if (date < 19) {     return "家家户户的菜香味都飘来了，忍不住感叹一句，真香啊"; } else if (date < 20) {     return "晚上啦，听听故事吧，在故事名前面加上给我放三个字，我就可以放给你听哦"; } else if (date < 21) {     return "咦，小朋友今天的任务都完成了吧，休息休息吧"; } else if (date < 22) {     return "深夜啦，好好睡觉，才能长高高！快睡啦！晚安！"; } else if (date < 23) {     return "发现时间已经很晚了呢，快快睡觉觉吧，这样小朋友才能长的高高哒"; } else if (date < 24) {     return "哎呀呀不聊啦不聊啦，怎么这么晚还不睡觉呢，明天早上要起不来了哦"; }','sys.template.javascript= var date = new Date().getHours(); if (date < 1) {     return "早睡早起才能身体好呢！我们明天再聊吧！"; } else if (date < 2) {     return "小主人，快休息休息啦，早睡早起才能身体好嘛！"; } else if (date < 3) {     return "啊啊。。哈。我都要打哈欠了，说不动啦说不动啦"; } else if (date < 4) {     return "我现在真的想休息休息，你也休息休息吧！"; } else if (date < 5) {     return "说不下去啦，再一会太阳公公都要上班啦，我也想休息休息啦！"; } else if (date < 6) {     return "太阳咪咪笑，我们起得早。洗脸洗干净，刷牙不忘掉 "; } else if (date < 7) {     return "太阳咪咪笑，我们起得早。洗脸洗干净，刷牙不忘掉，早上好啊宝宝！"; } else if (date < 8) {     return "啊呜啊呜，我要吃点知识再继续跟你聊哦！你也要好好吃早饭哦！"; } else if (date < 9) {     return "你刚刚说的我听不太懂啦，不过上午时光这么宝贵，小主人可以看看书什么的学习一下！"; } else if (date < 10) {     return "对了，我发现晚上睡的好的话， 一天能量满满呢"; } else if (date < 11) {     return "不知不觉发现肚子有点饿了呢， 吃饭时间快到了吧"; } else if (date < 12) {     return "我看看表啊，都这个点儿啦，人类要好好吃饭饭！我也要好好吃知识呢！跟我说午饭午饭，给我喂知识吧！这样我就可以继续跟你好好聊天啦！爱你！"; } else if (date < 13) {     return "哎呀，吃饱了以后，就有点困呢，先让我小睡一会吧"; } else if (date < 14) {     return "哇，前面小睡了一会， 精神又是棒棒哒"; } else if (date < 15) {     return "嘿嘿，悄悄告诉你哦，如果你说四点钟来找我玩，我从三点钟起，就感觉好幸福呢"; } else if (date < 16) {     return "哎呀，下午马上要过去了，肚子 都咕咕叫了呢，吃点心的时间到了呢"; } else if (date < 17) {     return "可爱的小朋友，你下午学习了吗？"; } else if (date < 18) {     return "说不下去啦，再一会太阳公公都要上班啦，我也想休息休息啦！"; } else if (date < 19) {     return "家家户户的菜香味都飘来了，忍不住感叹一句，真香啊"; } else if (date < 20) {     return "晚上啦，听听故事吧，在故事名前面加上给我放三个字，我就可以放给你听哦"; } else if (date < 21) {     return "床前明月光，疑是地上霜……咦，说到哪里了"; } else if (date < 22) {     return "深夜啦，好好睡觉，才能长高高！快睡啦！晚安！"; } else if (date < 23) {     return "发现时间已经很晚了呢，快快睡觉觉吧，这样明天才有精神"; } else if (date < 24) {     return "哇这么晚啦，不聊啦不聊啦，小主人快去睡觉吧，明天早上要打瞌睡了哦，快休息吧"; }'];
		 
//		 var appObjectPara = { "appName": appName,"headUrl": "https://dn-vbuluo-static.qbox.me/default-robot.svg", "robotType": robotType, "attribute": attributeObj, "appDesc": "来自海知智能ruyi.ai的酷炫聊天机器人","defaultResponses":defaultResponsesObj };
		 
		 var skillIds = [];
		 if(robotType != "SKILL"){
			 skillIds = ["2013efe4-0f8e-423e-848c-be31f9f54396","6fc1c620-e31b-4ae5-a0e1-6709bb7029d9","6e3a8217-d07d-4cb8-803c-75e952bb521b","15de5ea2-4502-4f78-a49f-fcb04625ec3c","7e9b61b7-6dac-4005-83e0-ea2197372bf2"];
		 }
		 
		 var appObjectPara = {
		    "name": appName,
		    "botType": robotType,
		    "description": "来自海知智能ruyi.ai的酷炫聊天机器人",
		    "serviceCategory": "",
		    "logo": "https://dn-vbuluo-static.qbox.me/default-robot.svg",
		    "skillIds": skillIds,
//		    "defaultResponses": defaultResponsesObj,
//		    "birthday": birthdayObject,
		    "gender":"男"
		};
		 $.ajax({
				url : api_host_v2beta + "bots",
				traditional: true,
				headers: {"Content-Type" : "application/json","Authorization":"Bearer " + getCookie('accessToken')},
				method : "post",
				data:JSON.stringify(appObjectPara),
				success: function(data) {
					data = dataParse(data);
					
					var agentObj = data.agents[0];
					
					setCookie("appId",agentObj.agentId);
					setCookie("appName",agentObj.name);
					setCookie("appKey",agentObj.appKey);
					setCookie("createRobot","true");
					setCookie("app"+ agentObj.agentId,"isNewUser");
					setTimeout(function(){
						//创建默认的场景
						addScenarioFunc("打招呼", addIntentFunc);
						//创建默认的意图
					}, 500);
				},error:function(){
//					goIndex();
				}
			});
		 
//		 $.ajax({
//			url : ruyiai_host + "/ruyi-ai/app/createv2.html",
//			traditional: true,
//			headers: {"Content-Type" : "application/json"},
//			method : "post",
//			data:JSON.stringify(appObjectPara),
//			success: function(data) {
//				
//				data = dataParse(data);
//		 		if(data.code == 0){
//					appObject = data.result;
//					appObject.referencedApp = ["2013efe4-0f8e-423e-848c-be31f9f54396","6fc1c620-e31b-4ae5-a0e1-6709bb7029d9","6e3a8217-d07d-4cb8-803c-75e952bb521b","15de5ea2-4502-4f78-a49f-fcb04625ec3c","7e9b61b7-6dac-4005-83e0-ea2197372bf2"];
//					//默认勾选通用闲聊
//					updateAppInfoFucn(appObject);
//					setCookie("appId",appObject.id);
//					setCookie("appName",appObject.appName);
//					setCookie("appKey",appObject.appKey);
//					setCookie("createRobot","true");
//					setCookie("app"+appObject.id,"isNewUser");
//					setTimeout(function(){
//						//创建默认的场景
//						addScenarioFunc("打招呼", addIntentFunc);
//						//创建默认的意图
//					}, 500);
//				}else if(data.code == 2){
//					goIndex();
//				}else{
//					$.trace(data.msg);
//					goIndex();
//				}
//			}
//		});
		return false;
	});
	
	//退出创建机器人
	$("body").off("click",".create-robot-skip").on("click",".create-robot-skip",function($event){
		window.location.href = "app_manager.html";
	});

	// 创建swiper
	var mySwiper = new Swiper ('.swiper-container', {
	    direction: 'vertical',
	    // loop: true,
	    pagination: '.swiper-pagination',
	    mousewheelControl: true,
	    keyboardControl: true,
	    paginationClickable: true
	})
});



