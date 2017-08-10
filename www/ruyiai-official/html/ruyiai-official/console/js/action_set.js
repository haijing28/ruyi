function actionSetCtrl($rootScope, $scope, $state, $stateParams){
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-robot-para]").addClass("active");
	$("[data-act=nav-action-set]").addClass("active");
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	}, 200);
	$('[data-toggle="popover"]').popover();
	
	$scope.getActionList = function(){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/action/query/list",
			data:{"appId": appId,"start":0,"limit":1000},
			method: "get",
			success: function(data){
				
				data = dataParse(data);
					if(data.code == 0){
					$scope.actionList = data.result;
					$($scope.actionList).each(function(index, ele){
						if(ele.errorModels.length > 0){
							ele.errorList = $scope.getErrorList(ele.errorModels);
						}
						if($.isEmptyObject(ele.header)){
							console.log(2222);
							ele.header = {};
						}
					})
					$scope.$apply();
					$scope.changePostion();
					
					//打开关闭
					$(".action-set-box-parent").delegate(".show-action .action-title-top","click",function(event){
						event.stopPropagation();
						var $this = $(this);
						var actionSetUl = $this.parent().find(".action-set-ul");
						var titleHeight = actionSetUl.hasClass("open");
						var triggerIcon = $this.find('.trigger-icon');
						if(titleHeight){
//							var actionSetUlheight = actionSetUl.height() + 2;
//							var gap = $("<div class='gap'>").height(actionSetUlheight);
//							actionSetUl.parent().append(gap);
							actionSetUl.css('border', 'none');
							actionSetUl.removeClass("open").addClass("close");
							triggerIcon.removeClass("icon-down").addClass("icon-right-copy-copy");
						}else{
//							if(actionSetUl.parent().find('.gap')){
//								actionSetUl.parent().find('.gap').remove();
//							}
							actionSetUl.css('border', '1px solid #dcdddd');
							actionSetUl.removeClass("close").addClass("open");
							triggerIcon.removeClass("icon-right-copy-copy").addClass("icon-down");
//							actionSetUl.closest(".action-set-box").siblings(".action-set-box").find(".action-set-ul").removeClass("open").addClass("close");
//							$scope.orignData.headerKey = $(actionProperties).find('[data-act=header-key]').val();
//							$scope.orignData.headerValue = $(actionProperties).find('[data-act=header-value]').val();
						}
					});
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	}
	$scope.getActionList();
	
	//取消
	$("body").delegate(".show-action .common-blank-button","click",function(event){
		var $this = $(this);
		var $actionSetBox = $this.closest(".action-set-box");
		var $actionSetUl = $actionSetBox.find(".action-set-ul");
		var currentIndex = $actionSetBox.find("[data-act=myindex]").val();
		var currentTrigger = $scope.actionList[currentIndex];
		$actionSetUl.find('[data-act=name]').val(currentTrigger.name);
		$actionSetUl.find('[data-act=url]').val(currentTrigger.url);
		var headerValue = [];
		var headers = currentTrigger.header;
		for(header in headers){
			headerValue.push({'key': header, 'value': headers[header]});
		}
//		if($actionSetUl.find('.header-list-li').length == headerValue.length)
		$actionSetUl.find('.header-list').empty();
		var headerItem = "";
		$(headerValue).each(function(index, ele){
			headerItem = "<li class='header-list-li clearfix'>";
			headerItem += '<input type="text" placeholder="name" data-act="header-key" value="' + ele.key + '">';
			headerItem += '<input type="text" class="header-value" placeholder="value" data-act="header-value" value="' + ele.value + '">';
			headerItem += '<i class="iconfont icon-delete pull-right"></i></li>';
//			$(ele).find('[data-act=header-key]').val(headerValue[index].key);
//			$(ele).find('[data-act=header-value]').val(headerValue[index].value);
			$actionSetUl.find('.header-list').append(headerItem);
		})
//		$actionSetUl.removeClass("open").addClass("close");
	});
	
	//获得错误信息列表
	$scope.getErrorList = function(allErrorInfo){
		var errorList = "<ul style='color: #ee524f;'>";
		$(allErrorInfo).each(function(i, e){
			errorList += "<li>" + (i + 1) + "." + e.detail + "</li>";
		})
		errorList += "</ul>";
		return errorList;
	}
	
	//动态改变图标位置
	$scope.changePostion = function(){
		$('.action-title-top').each(function(index,ele){
			if($(ele).find('.show-url').text() !== ""){
				$(ele).find('.icon-delete').css('margin-top', '18px');
				$(ele).find('.icon-copy').css('margin-top', '18px');
			}
		});
	}
	
	//创建或者修改
	$scope.createOrUpdateAction = function(actionObj,$actionSetBox,index){
		var errorInfo = [];
		index = index + "";
		if(index && index != "undefined" && index >= 0){ //修改
			$.ajax({
				url: ruyiai_host + "/ruyi-ai/action/update",
				traditional: true,
				headers: {"Content-Type" : "application/json"},
				data:JSON.stringify(actionObj),
				method: "POST",
				success: function(data){
					
					data = dataParse(data);
					if(data.code == 0){
						errorInfo = data.result.errorModels;
						actionObj.errorModels = errorInfo;
						actionObj.errorList = $scope.getErrorList(errorInfo);
						$scope.actionList[index] = actionObj;
						$scope.$apply();
						if(errorInfo.length > 0){
							var actionQuantity = $(".show-action").length;
							$($(".show-action")[actionQuantity - 1]).find('.icon-iconfontzhifushibai').show();
						}
						$scope.changePostion();
						$.trace("已修改","success");
					}else if(data.code == 2){
						goIndex();
					}else{
						if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
					}
				}
			});
		}else{  //创建
			$.ajax({
				url: ruyiai_host + "/ruyi-ai/action/create",
				traditional: true,
				headers: {"Content-Type" : "application/json"},
				data:JSON.stringify(actionObj),
				method: "POST",
				success: function(data){
					data = dataParse(data);
					if(data.code == 0){
						errorInfo = data.result.errorModels;
						data.result.errorList = $scope.getErrorList(errorInfo);
						if($.isEmptyObject(data.result.header)){
							console.log("111111");
							data.result.header = {};
						}
						$scope.actionList.push(data.result);
						$scope.$apply();
						var actionQuantity = $(".show-action").length;
						$($(".show-action")[actionQuantity - 1]).find('.action-set-ul').removeClass('close').addClass('open');
						$($(".show-action")[actionQuantity - 1]).find('.trigger-icon').removeClass("icon-right").addClass("icon-down");
						if(errorInfo.length > 0){
							$($(".show-action")[actionQuantity - 1]).find('.icon-iconfontzhifushibai').show();
						}
						if(index < 0){
							$.trace("复制成功","success");
						}else{
							$actionSetBox.find("[data-act=name]").val("");
							$actionSetBox.find("[data-act=method]").html('GET<span class="caret"></span>');
							$actionSetBox.find("[data-act=url]").val("");
							$actionSetBox.find(".header-list").html('<li class="header-list-li"> <input type="text" placeholder="key" data-act="header-key" /> <input type="text" placeholder="value" data-act="header-value" /> <i class="iconfont icon-delete pull-right"></i></li>');
							$actionSetBox.find(".json-body-textarea").val("");
							$actionSetBox.find(".is-need-cache button:first-child").addClass("active").siblings().removeClass("active");
							$actionSetBox.find(".expire-time").get(0).selectedIndex=0;
							$actionSetBox.find(".add-cache-key-help").html('<span class="add-cache-key-span" style="position:relative;"><input placeholder="key名称"/></span><input placeholder="key名称" />');
							$actionSetBox.find('.action-set-ul').removeClass('open').addClass('close');
							$.trace("添加成功","success");
						}
						$scope.changePostion();
					}else if(data.code == 2){
						goIndex();
					}else{
						if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
					}
				}
			});
		}
	}
	
	//还原action属性的原始值
	$scope.restore = function(currentAction){
		if(!$.isEmptyObject($scope.orignData)){
			$(currentAction).find('[data-act=name]').val($scope.orignData.name);
			$(currentAction).find('[data-act=url]').val($scope.orignData.url);
			$(currentAction).find('.header-list-li').each(function(index, ele){
				$(ele).find('[data-act=header-key]').val($scope.header[index].key);
				$(ele).find('[data-act=header-value]').val($scope.header[index].value);
			})
//			$(currentAction).find('[data-act=header-key]').val($scope.orignData.headerKey);
//			$(currentAction).find('[data-act=header-value]').val($scope.orignData.headerValue);
			$(currentAction).find('.btn').html($scope.orignData.method + '<span class="caret"></span>');
		}
	}
	
	//确定
	$(".action-set-box-parent").delegate(".action-set-box .common-active-button","click",function(event){
		event.stopPropagation(); 
		var $this = $(this);
		var $actionSetBox = $this.closest(".action-set-box");
		var myindex = $actionSetBox.find("[data-act=myindex]").val();
		var actionId = $actionSetBox.find("[data-act=actionId]").val();
		var $actionSetUl = $actionSetBox.find(".action-set-ul");
		var name = $actionSetBox.find("[data-act=name]").val().trim();
		var url = $actionSetBox.find("[data-act=url]").val();
		var method = $actionSetBox.find('[data-act=method]').text().trim();
		var jsonBody = $actionSetBox.find(".json-body-textarea").val();
		var enableCache = $actionSetBox.find(".is-need-cache button.active").attr("data-act");
		var expireTime = $actionSetBox.find(".expire-time").val();
		var entitiesInCacheKey = [];
		var $entitiesInCacheKey = $actionSetBox.find(".add-cache-key-box div input");
		$entitiesInCacheKey.each(function(){
		    if($(this).val() && $.trim($(this).val()).length > 0){
		    	entitiesInCacheKey.push($(this).val());
		    }
		});
		
		//获取header start
		var headerObj = {};
		var $headerListLi = $actionSetBox.find(".header-list li");
		console.log(5555);
		$headerListLi.each(function(i){
			var $thisHeader = $(this);
			if($thisHeader.find("[data-act=header-key]").val() && $thisHeader.find("[data-act=header-key]").val().length > 0){
				headerObj[$thisHeader.find("[data-act=header-key]").val()] = $thisHeader.find("[data-act=header-value]").val();
			}
		});
		//获取header end
		if(!$scope.actionList){
			$scope.actionList = [];
		}
		var actionObj = {};
		actionObj.id = actionId;
		actionObj.appId = appId;
		actionObj.name = name;
		actionObj.url = url;
		actionObj.method = method;
		actionObj.header = headerObj;
		actionObj.jsonBody = jsonBody;
		actionObj.enableCache = enableCache;
		actionObj.expireTime = expireTime;
		actionObj.entitiesInCacheKey = entitiesInCacheKey;
		$scope.isError = 0;
		if(actionObj.name !== ""){
			$scope.createOrUpdateAction(actionObj,$actionSetBox ,myindex);
			$('.add-action').find('.action-title-top').hide();
		}else{
			$.trace('触发器名称不能为空！', 'error');
		}
	});
	
	//添加更多header
	$(".action-set-box-parent").delegate(".action-set-ul .header-li .icon-ruyiaiaddscence","click",function(event){
		event.stopPropagation(); 
		var $this = $(this);
		$this.closest(".action-set-box").find(".header-list").append('<li class="header-list-li"> <input type="text" placeholder="name" data-act="header-key" /> <input type="text" placeholder="value" class="header-value" data-act="header-value" /><i class="iconfont icon-delete pull-right"></i> </li>');
	});
	
	//删除一个header选项
	$('.action-set-box-parent').delegate('.header-list .icon-delete', 'click', function(){
		$(this).parent('li').remove();
	})
	
	//复制一个header选项
	$('.action-set-box-parent').delegate('.icon-copy', 'click', function(event){
		event.stopPropagation();
		var $this = $(this);
		var $actionSetBox = $this.closest(".action-set-box");
		var actionId = $actionSetBox.find("[data-act=actionId]").val();
		var $actionSetUl = $this.parent().next('ul');
		var name = $actionSetBox.find("[data-act=name]").val().trim();
		var url = $actionSetUl.find("[data-act=url]").val();
		var method = $actionSetUl.find('[data-act=method]').text().trim();
		var jsonBody = $actionSetUl.find('.json-body-textarea').val();
		var enableCache = $actionSetUl.find(".is-need-cache button.active").attr("data-act");
		var expireTime = $actionSetUl.find(".expire-time").val();
		var entitiesInCacheKey = [];
		var $entitiesInCacheKey = $actionSetUl.find(".add-cache-key-box div input");
		$entitiesInCacheKey.each(function(){
		    if($(this).val() && $.trim($(this).val()).length > 0){
		    	entitiesInCacheKey.push($(this).val());
		    }
		});
		//获取header start
		var headerObj = {};
		var $headerListLi = $actionSetBox.find(".header-list li");
		$headerListLi.each(function(i){
			var $thisHeader = $(this);
			headerObj[$thisHeader.find("[data-act=header-key]").val()] = $thisHeader.find("[data-act=header-value]").val();
		});
		//获取header end
		
		if(!$scope.actionList){
			$scope.actionList = [];
		}
		var actionObj = {};
		actionObj.id = actionId;
		actionObj.appId = appId;
		actionObj.name = name;
		actionObj.url = url;
		actionObj.method = method;
		actionObj.header = headerObj;
		actionObj.jsonBody = jsonBody;
		actionObj.enableCache = enableCache;
		actionObj.expireTime = expireTime;
		actionObj.entitiesInCacheKey = entitiesInCacheKey;
		
		$scope.isError = 0;
		$scope.createOrUpdateAction(actionObj,$actionSetBox, -1);
	})
	
	//删除一个已创建的header
	$(".action-set-box-parent").delegate("[data-act=delete-action]","click",function(event){
		event.stopPropagation(); 
		var $this = $(this);
		var id = $this.attr("data-action-id");
		var index = $this.attr("data-index");
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/action/delete/"+id + "?appId=" + appId,
			method: "DELETE",
			success: function(data){
				$.trace("已删除","success");
				$scope.actionList.splice(index,1);
				$scope.$apply();
			}
		});
	});
	
	//点击选择method
	$('.action-set-box-parent').delegate('.method-item', 'click', function(){
		var selectMethod = $(this).text();
		var parentLi = $(this).closest("[data-act=change-method]").find(".open .btn").html(selectMethod + '<span class="caret"></span>');
		//$('.open').find('.btn').html(selectMethod + '<span class="caret"></span>');
	})
	
	//添加action点击取消按钮清空数据
	$('.action-set-box-parent').delegate('.add-action .common-blank-button', 'click', function(){
		$(this).closest(".action-set-ul").removeClass('open').addClass('close')
		var $actionSetBox = $('.add-action');
		$actionSetBox.find("[data-act=name]").val("");
		$actionSetBox.find("[data-act=method]").html('GET<span class="caret"></span>');
		$actionSetBox.find("[data-act=url]").val("");
		$actionSetBox.find(".header-list").html('<li class="header-list-li"> <input type="text" placeholder="key" data-act="header-key" /> <input type="text" placeholder="value" data-act="header-value" /> <i class="iconfont icon-delete pull-right"></i></li>');
		$actionSetBox.find(".json-body-textarea").val("");
		$actionSetBox.find(".is-need-cache button:first-child").addClass("active").siblings().removeClass("active");
		$actionSetBox.find(".expire-time").get(0).selectedIndex=0;
		$actionSetBox.find(".add-cache-key-help").html('<span class="add-cache-key-span" style="position:relative;"><input placeholder="key名称"/></span><input placeholder="key名称" />');
		
		
		if($('.add-action').find('.header-list-li').length > 0){
			$('.add-action').find('.header-list-li').each(function(index, ele){
				if(index != 0){
					$(ele).remove();
				}
			});
		}else{
			var headerItem = "<li class='header-list-li clearfix'>";
			headerItem += '<input type="text" placeholder="name" data-act="header-key">';
			headerItem += '<input type="text" class="header-value" placeholder="value" data-act="header-value">';
			headerItem += '<i class="iconfont icon-delete pull-right"></i></li>';
			$('.add-action').find('.header-list').append(headerItem);
		}
		$('.add-action').find('.action-title-top').hide();
	})
	
	//添加新的触发器
	$('.add-trigger').find('.icon-ruyiaiaddscence').on('click', function(){
		var actionSetUl = $('.add-action').find('.action-set-ul');
		if($('.add-action').find('.action-title-top').css("display") == "block"){
			$.trace("请先完成上一个触发器的创建");
		}else{
			$('.add-action').find('.action-title-top').show();
			actionSetUl.removeClass('close').addClass('open');
		}
//		actionSetUl.closest(".action-set-box").siblings(".action-set-box").find(".action-set-ul").removeClass("open").addClass("close");
	})
	
	//用于解决事件冲突
	$('.action-set-box-parent').delegate('.trigger-name', 'click', function(event){
		event.stopPropagation();
	})
	
	//针对Firefox的兼容性问题，为.action-set-box-parent动态设置高度
	$(".action-set-box-parent").height(window.innerHeight-115);
	
	$('.action-set-box-parent').delegate('.is-need-cache button', 'click', function(event){
		var $this = $(this);
		$this.addClass("active").siblings("button").removeClass("active");
	})
	
	$('.action-set-box-parent').delegate('#add-cache-key', 'click', function(event){
		var $this = $(this);
		$this.parent().find("div").append('<input placeholder="key名称" />');
		$this.parent().find("div input:last-child").focus();
	})
	
	$('.action-set-box-parent').delegate('.add-cache-key-close', 'click', function(event){
		var $this = $(this);
		$this.parent().remove();
	})
	
}
















