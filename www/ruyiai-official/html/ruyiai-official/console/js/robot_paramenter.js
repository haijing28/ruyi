function assistantParaCtrl($rootScope, $scope, $state, $stateParams) {
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-robot-para]").addClass("active");
	$("[data-act=nav-robot-role]").addClass("active");
	setTimeout(function() {
		$('[data-toggle="tooltip"]').tooltip(); // 初始化提示
	}, 200);
	$('[data-toggle="popover"]').popover();

	// 获取当前用户的userId
	$scope.currentUserId = getCookie("userId");

	// 将;分割的字符串，转换成数组
	var parseToArrayFunc = function(strs) {
		var myarray = [];
		if (strs && strs.length > 0) {
			myarray = strs.split(";");
		}
		return myarray;
	}
	// 将数组分割成;组成的字符串
	var parseFromArrayFunc = function(myarray) {
		var strs = "";
		for ( var i in myarray) {
			if (i < myarray.length - 1) {
				strs = strs + myarray[i] + ";";
			} else {
				strs = strs + myarray[i]
			}
		}
		return strs;
	};

	// 判断是否能够添加属性，如果可以添加则添加否则给出提示
	$scope.actionAddAttrFunc = function(valueList, value, valueName,
			valueCount, index, $event) {
		if (!$event || $event.keyCode == 13) {
			function tempFunc() {
				var indexFlag = false; // 判断是编辑还是添加
				var exitCount = 0; // 判断有几次相同
				var indexTemp = -1; // 判断哪一个需要编辑
				var editSelf = false; // 判断哪一个需要编辑
				for ( var i in valueList) {
					if (i == index) {
						indexFlag = true;
						indexTemp = i;
					}
					if (value == valueList[i]) {
						exitCount++;
						if (index == i) {
							editSelf = true;
						}
					}
				}

				if (indexFlag) {// 如果是编辑
					if (editSelf) {
						if (exitCount > 1) {
							$.trace("此属性已存在");
							valueList[indexTemp] = "";
						} else {
							valueList[indexTemp] = value;
						}
					} else {
						if (exitCount >= 1) {
							$.trace("此属性已存在");
							valueList[indexTemp] = "";
						} else {
							valueList[indexTemp] = value;
						}
					}
				} else {// 如果是添加
					if (value.length > 0) {
						if (valueList && valueList.length >= valueCount) {
							$.trace("最多只能添加" + valueCount + "条");
						} else {
							if (exitCount >= 1) {
								$.trace("此属性已存在");
							} else {
								if (!valueList) {
									valueList = [];
								}
								valueList.push(value);
							}
						}
					}
				}
				value = "";
				$scope[valueName] = "";
				if ($event && $event.keyCode == 13) {
					$($event.target).closest("[data-act=tail-box]").find(
							"[data-act=addParaText]").focus();
				}
			}
			if (valueName == "petPhraseStr") { // 如果是缺省回复
				setTimeout(function() {
					tempFunc();
					$("[data-act=petPhrasePara]").val("");
					$scope.petPhrasePara = "";
					$scope.$apply();
				}, 200);
			}else if (valueName == "timeoutResponse") { // 如果是缺省回复
				setTimeout(function() {
					tempFunc();
					$("[data-act=timeoutResponsePara]").val("");
					$scope.timeoutResponsePara = "";
					$scope.$apply();
				}, 200);
			} else {
				tempFunc();
			}
		}
	}

	$scope.valueDeleteFunc = function(valueList, index) {
		for ( var i in valueList) {
			if (i == index) {
				valueList.splice(i, 1);
				break;
			}
		}
	}

	// 设置agent
	$scope.settingAppFunc = function() {
		setTimeout(function() {
			if ($scope.agent) {
				$.ajax({
					url : ruyiai_host + "/ruyi-ai/app/" + appId,
					data : JSON.stringify({
						"id" : appId,
						"attribute" : $scope.agent,
						"defaultResponses" : $scope.defaultResponses
					}),
					traditional : true,
					headers : {
						"Content-Type" : "application/json"
					},
					method : "PUT",
					success : function(data) {
						if (data.code == 0) {
							$.trace("保存成功", "success");
						} else if (data.code == 2) {
							goIndex();
						} else {
							if (data.msg) {
								$.trace(data.msg + "( " + data.detail + " )",
										"error");
							}
						}
					}
				});
			}
		}, 0);
	}

//	var mydomain = "http://o8naiyefa.bkt.clouddn.com/";
	var mydomain = "https://qiniu.ruyi.ai/";
	/* 七牛上传图片相关代码 start */
	// 七牛上传图片文件 start
	var optionImg = {
		runtimes : 'html5,flash,html4',
		browse_button : 'pickRobotImg',
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
				extensions : "BMP,DIB,EMF,GIF,ICB,ICO,JPG,JPEG,PBM,PGM,PNG,PPM,PSD,PSP,RLE,SGI,TGA,TIF"
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
	var uploader = Qiniu.uploader(optionImg);
	// 七牛上传图片文件 end

	$('#clip_btn_sure').click(function() {
		$('.jcrop-tracker').dblclick();
	})
	
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
						$("[data-act=edit-the-status]").find(".robot-head")
								.attr("src", data.result);
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
					$.trace("请确保是.jpg格式图片(未修改过后缀)，并且小于10M");
				}
			}
		});
	}
	/* 裁剪 end */

	// 将应用的领域服务排序
	function referenceAppOrderFunc(appDetail) {
		var allReferenceApp = [ "15de5ea2-4502-4f78-a49f-fcb04625ec3c",
				"02d8f0d7-9574-414d-a601-a1f8ad0e3b26",
				"a141a4d8-35a1-4190-bffa-e61079144df0",
				"d3268e7d-e317-4b34-9e06-4a833270bbd5",
				"0bcf3898-f105-4165-b1c0-96167b31c897",
				"43cd293f-c1e1-4664-89ff-3a7c188bda56",
				"3b1cfe4d-dc78-4b66-9d9b-a5c065ca5e50",
				"10756975-29f6-40dd-a77c-e5942f177360",
				"451074cb-7076-4c92-aa35-5c4ad1a870d1",
				"80e89fee-0a80-4a68-a76c-ff1c521d7293",
				"fb30e181-a97b-425a-a9f5-b6cbb546afa8",
				"ee2a04ac-b87c-46ba-9277-a2077c82e498",
				"d5c80071-1c19-4db9-814f-648c14b91e8e",
				"535c1b4e-0f01-4704-b325-dfad45db31cf",
				"dfd87e8d-5b93-4070-b11c-5ec5c6d78b33",
				"d2c33e92-1f29-4bee-8d95-1a579a960e94",
				"cfc4488b-5c0f-4315-9ff4-fadb75f05f01",
				"8f79e341-d659-48e5-a060-4db3357cec0a",
				"1ecb882e-92e7-4577-b848-52db8737fdbd",
				"341ceeb3-1995-4106-9eb6-2341c5dc9660",
				"3a59359b-b40b-4581-be62-8112dbf5fb90",
				"6e3a8217-d07d-4cb8-803c-75e952bb521b",
				"6fc1c620-e31b-4ae5-a0e1-6709bb7029d9",
				"2013efe4-0f8e-423e-848c-be31f9f54396",
				"a6bc834d-a94e-44c2-9180-ab59ce423bfe",
				"bb8d6aec-8ac4-42f5-86bd-a8125addc8fe",
				"a03782f4-1427-4a5f-adb7-2a47533dfdcd",
				"52481364-d566-4d38-88be-5b593be5b57a",
				"c8031097-039f-4f0f-819b-464cb3b2df7f",
				"1cfc16c8-bf40-4aef-88d4-adb9da5c9a2c",
				"ce74ed7c-3935-4cef-a8b1-5c5f79ccd42d",
				"7e9b61b7-6dac-4005-83e0-ea2197372bf2",
				"d78a996b-0272-4337-ba58-6cddd00a7503" ];
		var referencedApp = [];
		if (appDetail && appDetail.referencedApp
				&& appDetail.referencedApp.length > 0) {
			for ( var i in allReferenceApp) {
				if ($.inArray(allReferenceApp[i], appDetail.referencedApp) > -1) {
					referencedApp.push(allReferenceApp[i]);
				}
			}
		}
		appDetail.referencedApp = referencedApp;
		return appDetail;
	}

	$scope.saveAgentFunc = function(robot) {

		// 合并虚拟助理处理
		// var flag = false;
		// for(var i in robot.referencedApp){
		// if(robot.referencedApp[i] == "yizhiyouxihebing"){
		// robot.referencedApp.splice(i,1);
		// robot.referencedApp.push("0bcf3898-f105-4165-b1c0-96167b31c897");
		// robot.referencedApp.push("43cd293f-c1e1-4664-89ff-3a7c188bda56");
		// robot.referencedApp.push("3b1cfe4d-dc78-4b66-9d9b-a5c065ca5e50");
		// flag = true;
		// break;
		// }
		// }
		// robot = referenceAppOrderFunc(robot);

		// 设置agent
		setTimeout(function() {
			$.ajax({
				url : ruyiai_host + "/ruyi-ai/app/" + appId,
				data : JSON.stringify(robot),
				traditional : true,
				headers : {
					"Content-Type" : "application/json"
				},
				method : "PUT",
				success : function(data) {
					if (data.code == 0) {
						// if(flag){
						// for(var i in robot.referencedApp){
						// if(
						// robot.referencedApp[i] ==
						// "0bcf3898-f105-4165-b1c0-96167b31c897"
						// || robot.referencedApp[i] ==
						// "43cd293f-c1e1-4664-89ff-3a7c188bda56"
						// || robot.referencedApp[i] ==
						// "3b1cfe4d-dc78-4b66-9d9b-a5c065ca5e50"
						// ){
						// robot.referencedApp.splice(i,1);
						// }
						// }
						// robot.referencedApp.push("yizhiyouxihebing");
						// }
						// $rootScope.$apply();

					} else if (data.code == 2) {
						goIndex();
					} else {
						if (data.msg) {
							$.trace(data.msg + "( " + data.detail + " )",
									"error");
						}
					}
				}
			});
		}, 0);
	}

	$("body")
			.off("dblclick", "[data-act=ass-para-box]")
			.on(
					"dblclick",
					"[data-act=ass-para-box]",
					function(event) {
						var $this = $(this);
						if ($this.find("[data-act=check-the-status]").css(
								"display") == "block") {
							$this.find("[data-act=edit-para]").trigger("click");
						}
					});

	$("body")
			.off("click",
					"[data-act=edit-para],.common-blank-button,[data-act=header-submit]")
			.on(
					"click",
					"[data-act=edit-para],.common-blank-button,[data-act=header-submit]",
					function(event) {
						var $this = $(this);
						var $checkTheStatus = $this.closest(
								"[data-act=ass-para-box]").find(
								"[data-act=check-the-status]");
						var $editTheStatus = $this.closest(
								"[data-act=ass-para-box]").find(
								"[data-act=edit-the-status]");
						if ($checkTheStatus.css("display") == "block") {
							$checkTheStatus.css("display", "none");
							$editTheStatus.css("display", "block");
							$this.css("display", "none");
						} else {
							if ($editTheStatus.find("input[type='checkbox']")
									.is(':checked')) {
								if ($editTheStatus
										.find("[data-act=tail-box] li").length <= 1) {
									$.trace("你勾选了机器人小尾巴，请至少填写一条小尾巴");
									return;
								}
							}
							$checkTheStatus.css("display", "block");
							$editTheStatus.css("display", "none");
							$("[data-act=edit-para]").css("display", "block");
						}
					});

	$scope.submitHeaderFunc = function() {
		var appName = $("[data-act=robot-name-input]").val();
		var serviceName = $("[data-act=service-name]").val();
		if (!appName || $.trim(appName).length == 0) {
			$.trace("请填写机器人名称");
			return false;
		}
		if (serviceName) {
			$rootScope.currentRobot.serviceName = serviceName;
		}
		$rootScope.currentRobot.appName = appName;
		$rootScope.currentRobot.appDesc = $(".robot-desc-textarea").val();
		$rootScope.currentRobot.headUrl = $("[data-act=edit-the-status]").find(
				".robot-head").attr("src");
		$scope.saveAgentFunc($rootScope.currentRobot);
	}

	// 去除空的属性
	var deleteBlankParaFunc = function(valueList) {
		for ( var i in valueList) {
			if ($.trim(valueList[i]).length == 0) {
				valueList.splice(i, 1);
			}
		}
		return valueList;
	}

	// 姓名 start
	$scope.editNameFunc = function() {
		$rootScope.currentRobot.attribute.name = parseToArrayFunc($rootScope.currentRobot.attribute.name);
		if ($rootScope.currentRobot.attribute.name.length > 0) {
			$scope.namesTemp = $rootScope.currentRobot.attribute.name[0];
		}
		if ($rootScope.currentRobot.attribute.nameTailsFlag == "true"
				|| $rootScope.currentRobot.attribute.nameTailsFlag == true) {
			$scope.nameTailsFlagTemp = true;
		} else {
			$scope.nameTailsFlagTemp = false;
		}
		$scope.nameTailsTemp = parseToArrayFunc($rootScope.currentRobot.attribute.nameTails);
	}

	$scope.editNameSubmitFunc = function() {
		if (!$scope.namesTemp || $.trim($scope.namesTemp).length == 0) {
			$.trace("机器人名字不能为空");
			return;
		}
		$rootScope.currentRobot.attribute.name[0] = $scope.namesTemp;
		$rootScope.currentRobot.attribute.name = parseFromArrayFunc($rootScope.currentRobot.attribute.name);
		$rootScope.currentRobot.appName = $scope.namesTemp;
		$rootScope.currentRobot.attribute.nameTailsFlag = $scope.nameTailsFlagTemp;
		$rootScope.currentRobot.attribute.nameTails = parseFromArrayFunc(deleteBlankParaFunc($scope.nameTailsTemp));
		$scope.saveAgentFunc($rootScope.currentRobot);
	}
	// 姓名 end

	// 将别名和语音纠错放入name中
	$scope.addAliasToName = function(aliasTails, voiceToCorrect) {
		var appNameTemps = parseToArrayFunc($rootScope.currentRobot.appName);
		var newName = [];
		var nameFirst = null;
		if (appNameTemps && appNameTemps.length > 0) {
			nameFirst = appNameTemps[0];
			newName.push(nameFirst);
		}

		for ( var i in aliasTails) {
			newName.push(aliasTails[i]);
		}
		for ( var i in voiceToCorrect) {
			newName.push(voiceToCorrect[i]);
		}
		$rootScope.currentRobot.attribute.name = parseFromArrayFunc(newName);
	}

	// 别名 start
	$scope.editAliasFunc = function() {
		$scope.aliassTemp = parseToArrayFunc($rootScope.currentRobot.attribute.alias);
		if ($rootScope.currentRobot.attribute.aliasTailsFlag == true
				|| $rootScope.currentRobot.attribute.aliasTailsFlag == "true") {
			$scope.aliasTailsFlagTemp = true;
		} else {
			$scope.aliasTailsFlagTemp = false;
		}
		$scope.aliasTailsTemp = parseToArrayFunc($rootScope.currentRobot.attribute.aliasTails);
	}

	$scope.editAliasSubmitFunc = function() {
		$rootScope.currentRobot.attribute.alias = parseFromArrayFunc($scope.aliassTemp);
		$scope.addAliasToName($scope.aliassTemp,
				parseToArrayFunc($scope.currentRobot.attribute.voiceToCorrect));
		$rootScope.currentRobot.attribute.aliasTailsFlag = $scope.aliasTailsFlagTemp;
		$rootScope.currentRobot.attribute.aliasTails = parseFromArrayFunc(deleteBlankParaFunc($scope.aliasTailsTemp));
		$scope.saveAgentFunc($rootScope.currentRobot);
	}
	// 别名 end

	// 语音纠正 start
	$scope.editvoiceToCorrect = function() {
		$scope.voiceToCorrectTemp = parseToArrayFunc($rootScope.currentRobot.attribute.voiceToCorrect);
	}

	$scope.editvoiceToCorrectSubmit = function() {
		$rootScope.currentRobot.attribute.voiceToCorrect = parseFromArrayFunc(deleteBlankParaFunc($scope.voiceToCorrectTemp));
		$scope.addAliasToName(
				parseToArrayFunc($scope.currentRobot.attribute.alias),
				deleteBlankParaFunc($scope.voiceToCorrectTemp));
		$scope.saveAgentFunc($rootScope.currentRobot);
	}
	// 语音纠正 end

	// 性别 start
	$scope.editSexFunc = function() {
		$scope.sexTemp = $rootScope.currentRobot.attribute.sex;
		if ($rootScope.currentRobot.attribute.sexTailsFlag == true
				|| $rootScope.currentRobot.attribute.sexTailsFlag == "true") {
			$scope.sexTailsFlagTemp = true;
		} else {
			$scope.sexTailsFlagTemp = false;
		}
		$scope.sexTailsTemp = parseToArrayFunc($rootScope.currentRobot.attribute.sexTails);
	}

	$scope.editSexSubmitFunc = function() {
		$rootScope.currentRobot.attribute.sex = $scope.sexTemp;
		$rootScope.currentRobot.attribute.sexTailsFlag = $scope.sexTailsFlagTemp;
		$rootScope.currentRobot.attribute.sexTails = parseFromArrayFunc(deleteBlankParaFunc($scope.sexTailsTemp));
		$scope.saveAgentFunc($rootScope.currentRobot);
	}
	// 性别 end

	// 生日 start
	// 初始化日历插件
	$("#assistantParaModal [name=birthday]").datepicker({
		changeMonth : true,
		changeYear : true
	});

	// 选择生日
	$scope.editBirthdayFunc = function() {
		if ($rootScope.currentRobot.attribute.birthdayTailsFlag == true
				|| $rootScope.currentRobot.attribute.birthdayTailsFlag == "true") {
			$scope.birthdayTailsFlagTemp = true;
		} else {
			$scope.birthdayTailsFlagTemp = false;
		}
		$scope.birthdayTailsTemp = parseToArrayFunc($rootScope.currentRobot.attribute.birthdayTails);
		$scope.birthdayTemp = $rootScope.currentRobot.attribute.birthdayDate;
		$scope.zodiacTemp = $rootScope.currentRobot.attribute.zodiac;
		$scope.constellationTemp = $rootScope.currentRobot.attribute.constellation;
		$scope.agedayTemp = $rootScope.currentRobot.attribute.ageday;
		$scope.agemonthTemp = $rootScope.currentRobot.attribute.agemonth;
		$scope.ageyearTemp = $rootScope.currentRobot.attribute.ageyear;
	}

	$scope.editBirthdaySubmitFunc = function() {
		$rootScope.currentRobot.attribute.birthdayTailsFlag = $scope.birthdayTailsFlagTemp;
		$rootScope.currentRobot.attribute.birthdayTails = parseFromArrayFunc(deleteBlankParaFunc($scope.birthdayTailsTemp));

		$rootScope.currentRobot.attribute.birthdayDate = $scope.birthdayTemp;
		$rootScope.currentRobot.attribute.birthday = new Date(
				$scope.birthdayTemp).getTime();
		$rootScope.currentRobot.attribute.zodiac = $scope.zodiacTemp;
		$rootScope.currentRobot.attribute.constellation = $scope.constellationTemp;
		$rootScope.currentRobot.attribute.ageday = $scope.agedayTemp;
		$rootScope.currentRobot.attribute.agemonth = $scope.agemonthTemp;
		$rootScope.currentRobot.attribute.ageyear = $scope.ageyearTemp;

		$scope.saveAgentFunc($rootScope.currentRobot);
	}

	// 根据日期获取星座
	function getAstro(month, day) {
		var s = "魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
		var arr = [ 20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22 ];
		return s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2) + "座";
	}

	// 根据日期获取属相
	function getZodiac(year) {
		var ssc = year % 12;
		var ssyear = new Array("鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴",
				"鸡", "狗", "猪");
		return ssyear[ssc];
	}

	$("[name=birthday]")
			.focus(
					function() {
						var year = parseInt($(
								".ui-datepicker-year [selected=selected]")
								.attr("value"));
						var month = parseInt($(
								".ui-datepicker-month [selected=selected]")
								.attr("value"));
						var dateTemp = new Date($scope.birthdayTemp);
						dateTemp.setFullYear(year, month);
						$scope.birthdayTemp = $.timeFormat(dateTemp,
								"MM/dd/yyyy");
						$scope.setBirthdayFunc($scope.birthdayTemp);
						$scope.$apply();
					});

	// 选择生日
	$scope.setBirthdayFunc = function(birthday) {
		birthday = new Date(birthday);
		setTimeout(function() {
			var year = birthday.getYear();
			var month = birthday.getMonth() + 1;
			var day = birthday.getDate();
			var constellation = getAstro(month, day);
			var zodiac = getZodiac(year);
			$scope.constellationTemp = constellation;
			$scope.zodiacTemp = zodiac;

			var diffYear = 1;
			var diffMonth = 0;
			var diffDay = 0;
			var currTime = new Date().getTime();
			var diffTime = currTime - birthday.getTime();
			diffTime = Math.abs(diffTime);

			var chuYear = diffTime / (365 * 24 * 60 * 60 * 1000);
			chuYear = parseInt(chuYear);
			if (chuYear > 0) {
				diffYear = chuYear;
				diffTime = diffTime - (chuYear * (365 * 24 * 60 * 60 * 1000));
			} else {
				diffYear = 0;
			}

			var chuMonth = diffTime / (30 * 24 * 60 * 60 * 1000);
			chuMonth = parseInt(chuMonth);
			if (chuMonth > 0) {
				diffMonth = chuMonth;
				diffTime = diffTime - (chuMonth * (30 * 24 * 60 * 60 * 1000));
			} else {
				diffMonth = 0;
			}

			var chuDay = diffTime / (24 * 60 * 60 * 1000);
			chuDay = parseInt(chuDay);
			if (chuDay > 0) {
				diffDay = chuDay;
			} else {
				diffDay = 0;
			}

			if (currTime < birthday) {
				diffYear = -diffYear;
				diffMonth = -diffMonth;
				diffDay = -diffDay;
			}
			$scope.ageyearTemp = diffYear;
			$scope.agemonthTemp = diffMonth;
			$scope.agedayTemp = diffDay;
			$scope.$apply();
		}, 100);
	}

	// 生日 end

	// 喜好 start
	$scope.editHobbyFunc = function() {
		$scope.hobbysTemp = parseToArrayFunc($rootScope.currentRobot.attribute.hobby);
		if ($rootScope.currentRobot.attribute.hobbyTailsFlag == true
				|| $rootScope.currentRobot.attribute.hobbyTailsFlag == "true") {
			$scope.hobbyTailsFlagTemp = true;
		} else {
			$scope.hobbyTailsFlagTemp = false;
		}
		$scope.hobbyTailsTemp = parseToArrayFunc($rootScope.currentRobot.attribute.hobbyTails);
	}

	$scope.editHobbySubmitFunc = function() {
		$rootScope.currentRobot.attribute.hobby = parseFromArrayFunc($scope.hobbysTemp);
		$rootScope.currentRobot.attribute.hobbyTailsFlag = $scope.hobbyTailsFlagTemp;
		$rootScope.currentRobot.attribute.hobbyTails = parseFromArrayFunc(deleteBlankParaFunc($scope.hobbyTailsTemp));
		$scope.saveAgentFunc($rootScope.currentRobot);
	}
	// 喜好 end

	// 父亲 start
	$scope.editFatherFunc = function() {
		$scope.fathersTemp = $rootScope.currentRobot.attribute.father;
		if ($rootScope.currentRobot.attribute.fatherTailsFlag == true
				|| $rootScope.currentRobot.attribute.fatherTailsFlag == "true") {
			$scope.fatherTailsFlagTemp = true;
		} else {
			$scope.fatherTailsFlagTemp = false;
		}
		$scope.fatherTailsTemp = parseToArrayFunc($rootScope.currentRobot.attribute.fatherTails);
	}

	$scope.editFatherSubmitFunc = function() {
		$rootScope.currentRobot.attribute.father = $scope.fathersTemp;
		$rootScope.currentRobot.attribute.fatherTailsFlag = $scope.fatherTailsFlagTemp;
		$rootScope.currentRobot.attribute.fatherTails = parseFromArrayFunc(deleteBlankParaFunc($scope.fatherTailsTemp));
		$scope.saveAgentFunc($rootScope.currentRobot);
	}
	// 父亲 end

	// 口头禅 start
	$scope.editPetPhraseFunc = function() {
		if (!$rootScope.currentRobot.defaultResponses) {
			$rootScope.currentRobot.defaultResponses = [];
		}
		$scope.petPhraseTemp = [];
		for ( var i in $rootScope.currentRobot.defaultResponses) {
			$scope.petPhraseTemp
					.push($rootScope.currentRobot.defaultResponses[i]);
		}
	}

	$scope.editPetPhraseSubmitFunc = function() {
		setTimeout(function() {
			$rootScope.currentRobot.defaultResponses = $scope.petPhraseTemp;
			$scope.saveAgentFunc($rootScope.currentRobot);
		}, 500);
	}
	
	//超时回复 start
	$scope.editTimeoutResponseFunc = function() {
		if (!$rootScope.currentRobot.defaultResponses) {
			$rootScope.currentRobot.defaultResponses = [];
		}
		$scope.timeoutResponseTemp = [];
		for ( var i in $rootScope.currentRobot.defaultResponses) {
			$scope.timeoutResponseTemp
					.push($rootScope.currentRobot.defaultResponses[i]);
		}
	}

	$scope.editPetPhraseSubmitFunc = function() {
		setTimeout(function() {
			$rootScope.currentRobot.defaultResponses = $scope.petPhraseTemp;
			$scope.saveAgentFunc($rootScope.currentRobot);
		}, 500);
	}
	//超时回复 end

	// 检测助理答，是空状态点击编辑，还是输入了值之后点击编辑
	var assistantEditStatus = "isEmpty";
	var checkAssistantEditStatusFunc = function() {
		var content = $("[data-act=petPhrasePara]").val();
		if (content && $.trim(content).length > 0) {
			assistantEditStatus = "notEmpty";
		} else {
			assistantEditStatus = "isEmpty";
		}
		return content;
	}

	$scope.editPetPhraseTextFunc = function(petPhrase, index) {
		var outputTextWeixin = checkAssistantEditStatusFunc();
		$("#editPetPhraseTextarea").modal({backdrop: 'static'});
		var $editPetPhraseText = $("#editPetPhraseText");
		// $("#editPetPhraseText").val(petPhrase);
		$editPetPhraseText.attr("myIndex", index);

		if (index == -1) { // 如果是新创建的时候，直接点编辑器
			$("#editor-iframe-box-wechat")
					.html(
							'<iframe id="editor-iframe-wechat" name="editor-iframe-wechat" width="718" height="570" frameborder="0" scrolling="yes" src="../console/editor.html"></iframe>');
			if (!petPhrase || petPhrase.length == 0) {// 如果助理答此时为空
				return false;
			} else {
				$editPetPhraseText.val(petPhrase);
				var editorWechatContentInterval = setInterval(
						function() {
							try {
								$(
										window.frames["editor-iframe-wechat"].document)
										.find("#editor_content_temp").val(
												petPhrase);
								if ($(
										window.frames["editor-iframe-wechat"].document)
										.find("#editor_content_temp").val().length > 0) {
									clearInterval(editorWechatContentInterval);
								}
							} catch (e) {
							}
						}, 20);
			}
		} else {
			$("#editor-iframe-box-wechat")
					.html(
							'<iframe id="editor-iframe-wechat" name="editor-iframe-wechat" width="718" height="570" frameborder="0" scrolling="yes" src="../console/editor.html"></iframe>');
			$editPetPhraseText.val(petPhrase);
			var editorWechatContentInterval = setInterval(function() {
				try {
					$(window.frames["editor-iframe-wechat"].document).find(
							"#editor_content_temp").val(petPhrase);
					if ($(window.frames["editor-iframe-wechat"].document).find(
							"#editor_content_temp").val().length > 0) {
						clearInterval(editorWechatContentInterval);
					}
				} catch (e) {
				}
			}, 20);
		}

	}
	// 微信编辑文字回复 end

	$scope.editPetPhraseTextSubmitFunc = function() {
		var editor_content_textarea = $(
				window.frames["editor-iframe-wechat"].document).find(
				"#editor_content_textarea").val();
		var $textarea = $("#editPetPhraseText");
		$textarea.val(editor_content_textarea);
		var myIndex = $textarea.attr("myIndex");
		if (myIndex == -1 || myIndex == "-1") {
			if (assistantEditStatus == "isEmpty") {
				$scope.petPhraseTemp.push($textarea.val());
			} else if (assistantEditStatus == "notEmpty") {
				$scope.petPhraseTemp[$scope.petPhraseTemp.length - 1] = $textarea
						.val();
			}
		} else {
			$scope.petPhraseTemp[myIndex] = $textarea.val();
		}
		$("#editPetPhraseTextarea").modal("hide");
	}
	// 口头禅 end
	
	$scope.timeoutChange = function(timeout){
		$("[name=timeout-input]").val(timeout);
	}
	setTimeout(function(){
		$("[name=timeout-input]").val(1500);
	}, 500);

}
