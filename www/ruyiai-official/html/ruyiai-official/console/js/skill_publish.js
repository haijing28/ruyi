function skillPublishCtrl($rootScope, $scope, $state, $stateParams) {

	/*-------------------------------启用toggle按钮--------------------------------*/

	$('[data-toggle="toggle"]').bootstrapToggle({
		size: 'mini',
		on: '',
	    	off: ''
	});

	/*-------------------------------全局属性--------------------------------*/

	$scope.imgSrc = 'http://img95.699pic.com/photo/50004/2199.jpg_wh300.jpg';
	$scope.robotName = '';
	$scope.awakes = [{value: ''}];
	$scope.wrongs = [{value: ''}];
	$scope.robotDesc = '';
	$scope.skillTypes = [1, 2, 3, 4, 5]
	$scope.selectedType = '请选择'
	$scope.userSays = [{value: ''}];
	$scope.selfDesc = '';
	$scope.self_homepage = '';
	$scope.skillDesc = '';
	$scope.plateforms = [];

	/*-------------------------------初始化--------------------------------*/

	// $.ajax({
	// 	url: api_host + '/skills/' + $rootScope.currentRobot.id,
	// 	type: 'get',
	// 	success: function(ret) {
	// 		console.log(ret)
	// 		$scope.robotName = ret.name;
	// 		$scope.skillDesc = ret.description;
	// 		$scope.selectedType = ret.serviceCategory; 
	// 		$scope.imgSrc = ret.logo;
	// 		$scope.awakes = stringToObjectArr(ret.nickNames);
	// 		$scope.wrongs = stringToObjectArr(ret.nickNameVoiceVariants);
	// 		$scope.userSays = stringToObjectArr(ret.userInputExamples);
	// 		$scope.self_homepage = ret.developerMainSite;
	//		$scope.selfDesc = ret.developerIntroduction;
	// 		$scope.robotDesc = ret.descriptionForAudit;
	// 		$scope.plateforms = ret.thirdPartyPlatforms;		
	// 	}
	// })

	$(".list-group-item").removeClass("active");
	$("[data-act=nav-skill-publish]").addClass("active");

	/*-------------------------------技能分类--------------------------------*/

	$('.mySel').on('click', 'li', function() {
		var text = $(this).text();
		$('.mySel button').html(text + '<span class="glyphicon glyphicon-chevron-down myIcon"></span>');
		$scope.selectedType = text;
	})

	/*-------------------------------获得裁剪的图片--------------------------------*/

	$scope.setImg = function() {
		console.log(1)
	}

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
	})

	/*-------------------------------string to objArr--------------------------------*/
	
	function stringToObjectArr(string) {
		var arr = string.split(';');
		var objArr = [];
		arr.forEach(function(ele) {
			objArr.push({value: ele})
		})
		return objArr;
	}

	/*-------------------------------objArr to string--------------------------------*/

	function objectArrToArr(arr) {
		var array = [];
		arr.forEach(function(ele){
			array.push(ele.value);
		})
		return array;
	}	

	/*-------------------------------copy 机器人--------------------------------*/
	
	$('.skill_settings').on('click', 'span', function() {
		try{
			$scope.imgSrc = $rootScope.currentRobot.headUrl || $scope.imgSrc;
			$scope.robotName = $rootScope.currentRobot.appName;
			$scope.robotDesc = $rootScope.currentRobot.appDesc;

			$scope.awakes = stringToObjectArr($rootScope.currentRobot.attribute.alias)
			$scope.wrongs = stringToObjectArr($rootScope.currentRobot.attribute.voiceToCorrect)
			$scope.userSays = stringToObjectArr($rootScope.currentRobot.attribute.hobby)

			$scope.awakes.splice(5, 100);
			$scope.wrongs.splice(5, 100);
			$scope.userSays.splice(5, 100);
		}catch(e){}
		$scope.$apply();
		$('#pickSkillImg').addClass('my_shake');
		$('.robotName').addClass('my_shake');
		$('.small').addClass('my_shake');
		$('.robotDesc').addClass('my_shake');
		setTimeout(function() {
			$('.my_shake').removeClass('my_shake');
		}, 1000)
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
			$(this).next('.addCorect').click();
		}
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
		$scope.awakes.forEach(function(ele, index) {
			if(ele.value.trim() == '') {
				$('[repeat-type=awakes]').parent().find( 'input' )[index].classList.add('wrong');
			}
		})
		$scope.wrongs.forEach(function(ele, index) {
			if(ele.value.trim() == '') {
				$('[repeat-type=wrongs]').parent().find( 'input' )[index].classList.add('wrong');
			}
		})
		$scope.userSays.forEach(function(ele, index) {
			if(ele.value.trim() == '') {
				$('[repeat-type=userSays]').parent().find( 'input' )[index].classList.add('wrong');
			}
		})
		if($('.wrong').length > 0) {
			$.trace('要配置完技能插件才能发布哦！')
		}else {
			$('#uploadSuccess').modal('show');
			// $.ajax({
			// 	url: '',
			// 	type: 'post',
			// 	data: JSON.stringify({
			// 		"name": $scope.robotName,
			// 		"description": $scope.skillDesc,
			// 		"serviceCategory": $scope.selectedType,
			// 		"logo": $scope.imgSrc,
			// 		"nickNames": objectArrToArr($scope.awakes),
			// 		"nickNameVoiceVariants": objectArrToArr($scope.wrongs),
			// 		"userInputExamples": objectArrToArr($scope.userSays),	
			// 		"developerMainSite": $scope.self_homepage,
			// 		"developerIntroduction": $scope.selfDesc,
			// 		"descriptionForAudit": $scope.robotDesc,
			// 		"thirdPartyPlatforms": $scope.plateforms	
			// 	}),
			// 	success: function(ret) {

			// 	}
			// })
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
			$scope.plateforms.push($(this).attr('name'))
		}else {
			$(this).parents('li').removeClass('active');
			var index = $scope.plateforms.indexOf($(this).attr('name'));
			$scope.plateforms.splice(index, 1);
		}
	})

	/*-------------------------------失焦保存--------------------------------*/

	function blurSave() {
		console.log(1)
	}

	$('.my_body').on('blur', 'input, textarea', function() {
		blurSave();
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
			},
			'UploadComplete' : function() {
				$("#addresource").modal("hide");
				$("#fsUploadProgress").html("");
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


