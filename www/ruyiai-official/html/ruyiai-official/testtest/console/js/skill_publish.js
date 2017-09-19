function skillPublishCtrl($rootScope, $scope, $state, $stateParams) {

	/*-------------------------------启用toggle按钮--------------------------------*/

	$('[data-toggle="toggle"]').bootstrapToggle({
		size: 'mini',
		on: '',
	    	off: ''
	});

	var agentType = getCookie('agentType');
	var appID = getCookie('appId');

	/*-------------------------------stringArr to objArr--------------------------------*/
	
	function stringToObjectArr(str) {
		if(str == undefined) {
			str = [];
		} else {
			str = str.split(';');
		}
		console.log(str)
		var arr = str;
		var objArr = [];
		arr.forEach(function(ele) {
			objArr.push({value: ele})
		})
		return objArr;
	}

	/*-------------------------------objArr to stringArr--------------------------------*/

	function objectArrToArr(arr) {
		var array = [];
		arr.forEach(function(ele){
			array.push(ele.value);
		})
		return array;
	}

	/*-------------------------------全局属性--------------------------------*/

	$scope.imgSrc = 'https://dn-vbuluo-static.qbox.me/default-robot.svg';
	$scope.robotName = '';
	$scope.awakes = [{value: ''}];
	$scope.wrongs = [{value: ''}];
	$scope.robotDesc = '';
	$scope.skillTypes = [{name: '音频点播', value: ''},{name: '视频点播', value: ''},{name: '家居指令', value: ''},{name: '语音游戏', value: ''},{name: '电商购物', value: ''},{name: '生活服务', value: ''},{name: '美妆时尚', value: ''},{name: '医疗健康', value: ''},{name: '金融服务', value: ''},{name: '新闻资讯', value: ''},{name: '法律顾问', value: ''},{name: '效率工具', value: ''},{name: '体育健身', value: ''},{name: '测试娱乐', value: ''},{name: '其他', value: ''}]
	$scope.selectedType = '请选择'
	$scope.userSays = [{value: ''}];
	$scope.selfDesc = '';
	$scope.self_homepage = '';
	$scope.skillDesc = '';
	$scope.plateforms = [];

	/*-------------------------------定义缓存的名字--------------------------------*/
	var hasSkill_storage = 'hasSkill_storage' + appID;
	var imgSrc = 'imgSrc' + appID;
	var robotName = 'robotName' + appID;
	var awakes = 'awakes' + appID;
	var wrongs = 'wrongs' + appID;
	var userSays = 'userSays' + appID;
	var robotDesc = 'robotDesc' + appID;
	var selectedType = 'selectedType' + appID;
	var selfDesc = 'selfDesc' + appID;
	var self_homepage = 'self_homepage' + appID;
	var skillDesc = 'skillDesc' + appID;
	var plateforms = 'plateforms' + appID;

	/*-------------------------------失焦保存--------------------------------*/

	$('.my_body').on('blur', 'input, textarea', function() {
		try{
			localStorage[hasSkill_storage] = 'true';
			localStorage[imgSrc] =  $('#pickSkillImg').attr('src');
			localStorage[robotName] = $scope.robotName;
			
			localStorage[awakes] = JSON.stringify($scope.awakes);
			localStorage[wrongs] = JSON.stringify($scope.wrongs);
			localStorage[userSays] = JSON.stringify($scope.userSays);
		
			localStorage[robotDesc] = $scope.robotDesc;
			localStorage[selectedType] = $scope.selectedType;
			localStorage[selfDesc]= $scope.selfDesc;
			localStorage[self_homepage] = $scope.self_homepage;
			localStorage[skillDesc] = $scope.skillDesc;
			localStorage[plateforms] = $scope.plateforms.toString();
			hasRepeatData();
		}catch(e){}
	})

	
	/*-------------------------------获得skill详情--------------------------------*/

	var botId = getCookie('botId');
	
	function getSkillDetailFunc (){
		var skillId = getCookie("skillId");
		if(skillId && skillId.length > 0){
			$.ajax({
				url: api_host_v2beta + 'skills/' + skillId + "?tag=" + developTag,
				type: 'GET',
				headers: {"Authorization" : "Bearer " + getCookie('accessToken')},
				success: function(data) {
					data = dataParse(data);
					var ret = data.agents[0].agent;
					$scope.robotName = ret.name;
			 		$scope.skillDesc = ret.description;
			 		$scope.selectedType = ret.category || '请选择';
			 		$scope.imgSrc = ret.logo;
			 		$scope.awakes = stringToObjectArr(ret.attributes.nickNames);
			 		$scope.wrongs = stringToObjectArr(ret.attributes.nickNameVoiceVariants);
			 		$scope.userSays = stringToObjectArr(ret.attributes.userInputExamples);
			 		$scope.self_homepage = ret.attributes.developerMainSite;
					$scope.selfDesc = ret.attributes.developerIntroduction;
			 		$scope.robotDesc = ret.attributes.descriptionForAudit;
			 		$scope.plateforms = ret.attributes.thirdPartyPlatforms;
			 		checkImgStatus();
			 		$scope.$apply();
				},error:function(){
					goIndex();
				}
			});
		}
	}

	/*-------------------------------提交发布申请--------------------------------*/

	function commitPublish(id) {
		var skillID = id || getCookie('skillId');
		$.ajax({
			url: api_host_v2beta + 'skills/' + getCookie("skillId") + '/submit',
			type: 'post',
			headers: {"Authorization" : "Bearer " + getCookie('accessToken')},
			success: function() {
				$('#uploadSuccess').modal('show');
			},
			error: function(err) {
				err = dataParse(err.responseText);
				$.trace('提交失败: ' + err.message);
			}
		})
	}

	/*-------------------------------图片切换--------------------------------*/
	function checkImgStatus() {
		$scope.plateforms.forEach(function(ele){
			$('.' + ele).addClass('active');
			$('.' + ele).find('input').prop('checked', true);
			$('.' + ele).find('.off').removeClass('off')
		})
	}

	/*-------------------------------检查用户说等的状态--------------------------------*/

	function hasRepeatData() {
		var tag = false;
		var errText = '';
		var awakes = objectArrToArr($scope.awakes);
		$scope.awakes.forEach(function(ele, index) {
			if( awakes.indexOf(ele.value) != awakes.lastIndexOf(ele.value) ) {
				tag = true;
				errText = '唤醒语的内容不能重复哦！'

				var i = awakes.indexOf(ele.value);
				var l_i = awakes.lastIndexOf(ele.value);
				$('[repeat-type=awakes]').parent().find('b')[i].children[0].classList.add('wrong')
				$('[repeat-type=awakes]').parent().find('b')[l_i].children[0].classList.add('wrong')
				$.trace(errText);
				return;
			}else {
				$('[repeat-type=awakes]').parent().children('b').find('input').removeClass('wrong')
			}
		})
		var wrongs = objectArrToArr($scope.wrongs);
		$scope.wrongs.some(function(ele, index) {
			if( wrongs.indexOf(ele.value) != wrongs.lastIndexOf(ele.value) ) {
				tag = true;
				errText = '纠错语的内容不能重复哦！'

				var i = wrongs.indexOf(ele.value);
				var l_i = wrongs.lastIndexOf(ele.value);
				$('[repeat-type=wrongs]').parent().find('b')[i].children[0].classList.add('wrong')
				$('[repeat-type=wrongs]').parent().find('b')[l_i].children[0].classList.add('wrong')
				$.trace(errText);
				return;
			}else {
				$('[repeat-type=wrongs]').parent().children('b').find('input').removeClass('wrong')
			}
		})
		var userSays = objectArrToArr($scope.userSays);
		$scope.userSays.some(function(ele, index) {
			if( userSays.indexOf(ele.value) != userSays.lastIndexOf(ele.value) ) {
				tag = true;
				errText = '用户说的内容不能重复哦！'

				var i = userSays.indexOf(ele.value);
				var l_i = userSays.lastIndexOf(ele.value);
				$('[repeat-type=userSays]').parent().find('b')[i].children[0].classList.add('wrong')
				$('[repeat-type=userSays]').parent().find('b')[l_i].children[0].classList.add('wrong')
				$.trace(errText);
				return;
			}else {
				$('[repeat-type=userSays]').parent().children('b').find('input').removeClass('wrong')
			}
		})

		return {tag, errText}
	}

	/*-------------------------------先从本地缓存拿数据--------------------------------*/
	
	if( localStorage[hasSkill_storage] == 'true') {
		try{
			$scope.imgSrc = localStorage[imgSrc];
			$scope.robotName = localStorage[robotName];

			$scope.awakes = JSON.parse(localStorage[awakes]);
			$scope.wrongs = JSON.parse(localStorage[wrongs]);
			$scope.userSays = JSON.parse(localStorage[userSays]);
			
			$scope.robotDesc = localStorage[robotDesc];
			$scope.selectedType = localStorage[selectedType];
			$scope.selfDesc = localStorage[selfDesc];
			$scope.self_homepage = localStorage[self_homepage];
			$scope.skillDesc = localStorage[skillDesc];
			if(localStorage[plateforms].length > 1){
				$scope.plateforms = localStorage[plateforms].split(',');
			}
			$scope.$apply();
			checkImgStatus();
		}catch(e){}
		
	}else {
		getSkillDetailFunc();
	}
	

	$(".list-group-item").removeClass("active");
	$("[data-act=nav-skill-publish]").addClass("active");

	/*-------------------------------技能分类--------------------------------*/

	$('.mySel').on('click', 'li', function() {
		var text = $(this).text();
		$('.mySel button').html(text + '<span class="glyphicon glyphicon-chevron-down myIcon"></span>');
		$scope.selectedType = text;
		$scope.$apply();
		$('.small').blur();
	})

	/*-------------------------------上传图片--------------------------------*/

	$('.skill-img').click(function() {
		$('.hide_input_img_upload').click();
	})
	$('.hide_input_img_upload').change(function() {
		var reader = new FileReader();
		var img  = $('.hide_input_img_upload')[0].files[0];
		reader.onload = function(ret) {
			var jcropApi;
			$scope.imgSrc = ret.target.result;
			$scope.$apply();
			// $('#uploadImg').modal('show');
			// $("#clipImg").Jcrop({
			// 	aspectRatio: 1,
			// 	onDblClick: function() {
			// 		console.log(111)
			// 	}
			// }, function() {
			//   	jcropApi = this;
			// });
		}
		reader.readAsDataURL(img);
		$('input').blur();
	})	

	/*-------------------------------copy 机器人--------------------------------*/
	
	$('.skill_settings').on('click', '.copy_robot_attr', function() {
		console.log('------------------------')
		console.log($rootScope.currentRobot)
		$scope.imgSrc = $rootScope.currentRobot.headUrl || $scope.imgSrc;
		$scope.robotName = $rootScope.currentRobot.appName;
		$scope.robotDesc = $rootScope.currentRobot.appDesc;
		$scope.awakes = stringToObjectArr($rootScope.currentRobot.attribute.alias)
		$scope.wrongs = stringToObjectArr($rootScope.currentRobot.attribute.voiceToCorrect)
		$scope.awakes.splice(5, 100);
		$scope.wrongs.splice(5, 100);
		$scope.$apply();
		$('#pickSkillImg').addClass('my_shake');
		$('.robotName').addClass('my_shake');
		$('.small').addClass('my_shake');
		$('.robotDesc').addClass('my_shake');
		setTimeout(function() {
			$('.my_shake').removeClass('my_shake');
		}, 1000)
		$('input').blur();
	})

	/*-------------------------------添加新项--------------------------------*/
	
	$('.addCorect').click(function() {
		var tp = $(this).attr('repeat-type');
		if($scope[tp].length < 5) {
			console.log($scope[tp])
			$scope[tp].push({value: ''});
		}
		$scope.$apply();
		$(this).prev('input').focus();
	})
	$('div').on('keydown', '.small', function(e) {
		if($(this).val() == ''){
			return;
		}
		if(e.keyCode == 13){
			$(this).parent().next('.addCorect').click();
			$(this).parent().next().find('input').focus();
		}
	})


	/*-------------------------------删除新项--------------------------------*/
	$('body').on('click', '.del_input', function() {
		var tp = $(this).parent().parent().find('.addCorect').attr('repeat-type');
		var index = $(this).parent().index() - 1;
		$scope[tp].splice(index, 1);
		$scope.$apply();
		$('.small').blur();
	})

	/*-------------------------------点击发布--------------------------------*/

	$('.skill_publish').click(function() {
		$('.wrong').removeClass('wrong');
		if( $scope.headUrl == 'http://img95.699pic.com/photo/50004/2199.jpg_wh300.jpg' ) {
			$('.skill-img').addClass('wrong');
		}
		if($scope.robotName.trim() == ''){
			$('.robotName').addClass('wrong');
		}
		if($scope.robotDesc.trim() == ''){
			$('.robotDesc').addClass('wrong');
		}
		if($scope.selectedType == '请选择'){
			$('.selectedType').addClass('wrong');
		}
		if($scope.selfDesc.trim() == ''){
			$('.selfDesc').addClass('wrong');
		}
		if($scope.skillDesc.trim() == ''){
			$('.skillDesc').addClass('wrong');
		}

		var awakes = $scope.awakes.some(function(ele) {
			return ele.value.trim() != '';
		})
		if(!awakes) {
			$('[repeat-type=awakes]').parent().find( 'input' ).addClass('wrong');
		}
		var wrongs = $scope.wrongs.some(function(ele) {
			return ele.value.trim() != '';
		})
		if(!wrongs) {
			$('[repeat-type=wrongs]').parent().find( 'input' ).addClass('wrong');
		}
		var userSays = $scope.userSays.some(function(ele) {
			return ele.value.trim() != '';
		})
		if(!userSays) {
			$('[repeat-type=userSays]').parent().find( 'input' ).addClass('wrong');
		}

		if($('.wrong').length > 0) {
			$.trace('要配置完技能插件才能发布哦！')
		}else {
			// 清除空的用户说、唤醒语、纠错语
			$scope.awakes.forEach(function(ele, index , arr) {
				if(ele.value.trim() == ''){
					arr.splice(index, 1);
				}
			})
			$scope.wrongs.forEach(function(ele, index , arr) {
				if(ele.value.trim() == ''){
					arr.splice(index, 1);
				}
			})
			$scope.userSays.forEach(function(ele, index , arr) {
				if(ele.value.trim() == ''){
					arr.splice(index, 1);
				}
			})

			var hasRepeatCheck = hasRepeatData();
			if(hasRepeatCheck.tag) {
				// $.trace(hasRepeatCheck.errText)
				return;
			}
			$('.skill_publish').attr('disabled', true);
			$('.skill_publish').addClass('my_gray');
			$('.skill_publish').text('提交中');
			var skillId = getCookie("skillId");
			var url = "";
			if(skillId && skillId.length > 0){
				url = api_host_v2beta + 'skills/' + skillId;
			}else{
				url = api_host_v2beta + 'skills?botId=' + getCookie("botId");
			}
			$.ajax({
				url: url,
				type: 'POST',
				headers: {"Content-Type" : "application/json", "Authorization" : "Bearer " + getCookie('accessToken')},
				data: JSON.stringify({
					"name": $scope.robotName.trim(),
					"description": $scope.skillDesc.trim(),
					"category": $scope.selectedType.trim(),
					"service": '123',
					"agentType": agentType,
					"logo": $scope.imgSrc,
					"nickNames": objectArrToArr($scope.awakes),
					"nickNameVoiceVariants": objectArrToArr($scope.wrongs),
					"userInputExamples": objectArrToArr($scope.userSays),
					"developerMainSite": $scope.self_homepage.trim(),
					"developerIntroduction": $scope.selfDesc.trim(),
					"descriptionForAudit": $scope.robotDesc.trim(),
					"thirdPartyPlatforms": $scope.plateforms
				}),
				success: function(ret) {
					setCookie('skillId' ,ret.id);
					commitPublish(ret.id);
					
				},
				error: function(err) {
					err = JSON.parse(err.responseText);
					$.trace(err.message)
					// goIndex();
				},
				complete: function() {
					$('.skill_publish').attr('disabled', false);
					$('.skill_publish').removeClass('my_gray');
					$('.skill_publish').text('提交发布');
				}
			})
		}
	})

	/*-------------------------------点击模态框确定--------------------------------*/

	$('.iKown').click(function() {
		$('#uploadSuccess').modal('hide');
	})

	/*-------------------------------平台接入多选--------------------------------*/
	
	$('input[type=checkbox]').change(function() {
		if($(this).prop('checked')) {
			$(this).parents('li').addClass('active');
			if($scope.plateforms.toString().indexOf($(this).attr('name')) == -1) {
				$scope.plateforms.push($(this).attr('name'))
			}
		}else {
			$(this).parents('li').removeClass('active');
			var index = $scope.plateforms.indexOf($(this).attr('name'));
			$scope.plateforms.splice(index, 1);
		}
		$('input').blur();
	})

	/*-------------------------------头像上传--------------------------------*/
	
	////头像上传 lucas start///////
	var mydomain = "https://qiniu.ruyi.ai/";
	/* 七牛上传图片相关代码 start */
	// 七牛上传图片文件 start
	var optionImgSkill = {
		runtimes : 'html5,flash,html4',
		browse_button : 'pickSkillImg',
		container : 'container',
		drop_element : 'container',
		max_file_size : '1000mb',
		flash_swf_url : 'bower_components/plupload/js/Moxie.swf',
		dragdrop : true,
		chunk_size : '4mb',
		multi_selection : !(mOxie.Env.OS.toLowerCase() === "ios"),
		// uptoken: $('#uptoken_url').val(),
		uptoken_url : ruyiai_host + "/ruyi-ai/getuptoken",
		domain : mydomain,
		get_new_uptoken : false,
		save_key : true,
		filters : {
			mime_types : [ {
				title : "Image files",
				extensions : "JPG"
			} ]
		},
		auto_start : true,
		log_level : 5,
		init : {
			'FilesAdded' : function(up, files) {
				$("#addresource").modal({backdrop: 'static'});
				$('table').show();
				$('#success').hide();
				plupload.each(files, function(file) {
					var progress = new FileProgress(file, 'fsUploadProgress');
					progress.setStatus("等待...");
					progress.bindUploadCancel(up);
					$('input').blur();
				});
			},
			'BeforeUpload' : function(up, file) {
				var progress = new FileProgress(file, 'fsUploadProgress');
				var chunk_size = plupload.parseSize(this
						.getOption('chunk_size'));
				if (up.runtime === 'html5' && chunk_size) {
					progress.setChunkProgess(chunk_size);
				}
			},
			'UploadProgress' : function(up, file) {
				var progress = new FileProgress(file, 'fsUploadProgress');
				var chunk_size = plupload.parseSize(this
						.getOption('chunk_size'));
				progress
						.setProgress(file.percent + "%", file.speed, chunk_size);
						$('input').blur();
			},
			'UploadComplete' : function() {
				$("#addresource").modal("hide");
				$("#fsUploadProgress").html("");
				$('input').blur();
			},
			'FileUploaded' : function(up, file, info) {
				var progress = new FileProgress(file, 'fsUploadProgress');
				progress.setComplete(up, info);
				var url = mydomain + JSON.parse(info).hash + "/" + file.name;

				$("#cut-header").modal({backdrop: 'static'});
				
				console.log("上传成功后的url:" + url);

				var eImg = $(".container").html(
						"<img src='" + url + "' id='tar'/>");
				toJcrop();
				$('input').blur();
			},
			'Error' : function(up, err, errTip) {
				$('table').show();
				var progress = new FileProgress(err.file, 'fsUploadProgress');
				progress.setError();
				progress.setStatus(errTip);
			}
		}
	};
	var uploader = Qiniu.uploader(optionImgSkill);
	// 七牛上传图片文件 end

	// 图片剪裁 start
	var api;
	function toJcrop(c) {
		$('#tar').Jcrop({
			boxWidth : 400,
			boxHeight : 400,
			bgOpacity : 0.5,
			aspectRatio : 1,
			bgColor : 'black',
			addClass : 'jcrop-light',
			onChange : jds,
			onDblClick : cutFunc
		}, function() {
			api = this;
			api.setSelect([ 130, 65, 130 + 350, 65 + 285 ]);
			api.setOptions({
				bgFade : true
			});
			console.log("api.ui.selection:" + api.ui.selection);
			api.ui.selection.addClass('jcrop-selection');
		});
	}

	function jds(c) {

	}

	function cutFunc(c) {
		var wScale = api.getScaleFactor()[0];
		var hScale = api.getScaleFactor()[1];
		var mywidth = api.tellSelect()[0];
		var myheight = api.tellSelect()[1];
		$.ajax({
			url : ruyiai_host + "/ruyi-ai/app/cutImage/" + appId,
			method : "get",
			data : {
				"imageUrl" : $("#tar").attr("src"),
				"x" : parseInt(c.x * wScale),
				"y" : parseInt(c.y * hScale),
				"w" : parseInt(c.w * wScale),
				"h" : parseInt(c.h * hScale),
			},
			success : function(data) {
				data = dataParse(data);
				try {
					if (data.code == 0) {
						$("#cut-header").modal("hide");
						$("#pickSkillImg").attr("src",data.result);
					} else if (data.code == 2) {
						goIndex();
					} else {
						if (data.msg) {
							$.trace(data.msg + "( " + data.detail + " )",
									"error");
						}
					}
					$scope.$apply();
				} catch (e) {
					$.trace("请确保是.jpg格式图片(未修改过后缀)，并且小于120M");
				}
			}
		});
	} 
	/* 裁剪 end */
}


