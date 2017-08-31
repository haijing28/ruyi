function resourceCtrl($rootScope,$scope, $state, $stateParams){
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-resource]").addClass("active");
	$('[data-toggle="popover"]').popover();
	$('[data-toggle="popover"]').click(function(){
		var $this = $(this);
		var $popover_content = $(".popover-content");
		setTimeout(function(){
			if($popover_content.attr("class")){
			}else{
				$this.popover('show');
			}
		}, 200);
	});
	
	$scope.addResListTemp = []; //新上传的文件
	$scope.resType = "image";
	
	var loadpre = "pre";
	var loadnext = "next";
	var pageSize = 20;
	
	//初始化界面样式
	var initStyle = function(){
		$(".resource-manager .image-box").css("height",document.documentElement.clientHeight - 228);
		
		var image_ul_width = $(".image-box-ul").css("width");
		image_ul_width = image_ul_width.replace("px","");
		image_ul_width = +image_ul_width;
		var image_count = parseInt(image_ul_width/186);
		$("#image .reource-operation").css("width", image_count * 186);
	}
	$(window).resize(function() {
		initStyle();
	});
	initStyle();
	
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      // 获取已激活的标签页的名称
      var activeTab = $(e.target).text(); 
      if($.trim(activeTab) == "图片"){
    	  initStyle();
    	  $scope.resType = "image";
    	  //获取图片资源列表 start
    	  if(!$scope.resImgList || $scope.resImgList.length == 0){
    		  $scope.loadResourceFunc(0,20,$scope.loadResourceListFunc);
    	  }
    	//获取图片资源列表 end
      }else if($.trim(activeTab) == "音频"){
    	  $scope.resType = "voice";
    	  //获取音频资源列表
    	  if(!$scope.resVoiceList || $scope.resVoiceList.length == 0){
    		  $scope.loadResourceFunc(0,30,$scope.loadResourceListFunc);
    	  }
      }else if($.trim(activeTab) == "视频"){
    	  $scope.resType = "video";
    	//获取视频资源列表
    	  if(!$scope.resVideoList || $scope.resVideoList.length == 0){
    		  $scope.loadResourceFunc(0,30,$scope.loadResourceListFunc);
    	  }
      }
      $scope.$apply();
    });
    
    
    /*七牛上传图片相关代码 start */
    //七牛上传图片文件 start
    var optionImg = {
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfilesImg',
        container: 'container',
        drop_element: 'container',
        max_file_size: '1000mb',
        flash_swf_url: 'bower_components/plupload/js/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        multi_selection: !(mOxie.Env.OS.toLowerCase()==="ios"),
        //uptoken: $('#uptoken_url').val(),
        uptoken_url:ruyiai_host + "/ruyi-ai/getuptoken",
        domain: $('#domain').val(),
        get_new_uptoken: false,
        save_key: true,
        filters : {
            mime_types: [
                     {title : "Image files", extensions : "BMP,DIB,EMF,GIF,ICB,ICO,JPG,JPEG,PBM,PGM,PNG,PPM,PSD,PSP,RLE,SGI,TGA,TIF"}
            ]
        },
        auto_start: true,
        log_level: 5,
        init: {
            'FilesAdded': function(up, files) {
            	$("#addresource").modal("show");
                $('table').show();
                $('#success').hide();
                plupload.each(files, function(file) {
                    var progress = new FileProgress(file, 'fsUploadProgress');
                    progress.setStatus("等待...");
                    progress.bindUploadCancel(up);
                });
            },
            'BeforeUpload': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    progress.setChunkProgess(chunk_size);
                }
            },
            'UploadProgress': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                progress.setProgress(file.percent + "%", file.speed, chunk_size);
            },
            'UploadComplete': function() {
            	$("#addresource").modal("hide");
//            	$scope.loadImage();
            	$("#fsUploadProgress").html("");
                //$('#success').show();
            },
            'FileUploaded': function(up, file, info) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                progress.setComplete(up, info);
                var tempObj = new Object();
                tempObj.url = $('#domain').val() + JSON.parse(info).hash +"/" + file.name;
                tempObj.title = file.name;
                tempObj.size = file.size;
                
                switch ($scope.resType) {
				case "image":
					tempObj.type = "image"; 
					break;
				case "voice":
					tempObj.type = "voice"; 
					break;
				case "video":
					tempObj.type = "video"; 
					break;
				default:
					break;
				}
                $("#fsUploadProgress").html("");
                $scope.addResListTemp.push(tempObj);
                $scope.loadImage();
                $scope.addResListTemp = [];
                $scope.$apply();
            },
            'Error': function(up, err, errTip) {
                $('table').show();
                var progress = new FileProgress(err.file, 'fsUploadProgress');
                progress.setError();
                progress.setStatus(errTip);
            }
                // ,
                // 'Key': function(up, file) {
                //     var key = "";
                //     // do something with key
                //     return key
                // }
        }
    };
    var uploader = Qiniu.uploader(optionImg);
    //七牛上传图片文件 end

    uploader.bind('FileUploaded', function() {
    });
    $('#container').on(
        'dragenter',
        function(e) {
            e.preventDefault();
            $('#container').addClass('draging');
            e.stopPropagation();
        }
    ).on('drop', function(e) {
        e.preventDefault();
        $('#container').removeClass('draging');
        e.stopPropagation();
    }).on('dragleave', function(e) {
        e.preventDefault();
        $('#container').removeClass('draging');
        e.stopPropagation();
    }).on('dragover', function(e) {
        e.preventDefault();
        $('#container').addClass('draging');
        e.stopPropagation();
    });



    $('#show_code').on('click', function() {
        $('#myModal-code').modal();
        $('pre code').each(function(i, e) {
            hljs.highlightBlock(e);
        });
    });


    $('body').on('click', 'table button.btn', function() {
        $(this).parents('tr').next().toggle();
    });


    var getRotate = function(url) {
        if (!url) {
            return 0;
        }
        var arr = url.split('/');
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === 'rotate') {
                return parseInt(arr[i + 1], 10);
            }
        }
        return 0;
    };

    $('#myModal-img .modal-body-footer').find('a').on('click', function() {
        var img = $('#myModal-img').find('.modal-body img');
        var key = img.data('key');
        var oldUrl = img.attr('src');
        var originHeight = parseInt(img.data('h'), 10);
        var fopArr = [];
        var rotate = getRotate(oldUrl);
        if (!$(this).hasClass('no-disable-click')) {
            $(this).addClass('disabled').siblings().removeClass('disabled');
            if ($(this).data('imagemogr') !== 'no-rotate') {
                fopArr.push({
                    'fop': 'imageMogr2',
                    'auto-orient': true,
                    'strip': true,
                    'rotate': rotate,
                    'format': 'png'
                });
            }
        } else {
            $(this).siblings().removeClass('disabled');
            var imageMogr = $(this).data('imagemogr');
            if (imageMogr === 'left') {
                rotate = rotate - 90 < 0 ? rotate + 270 : rotate - 90;
            } else if (imageMogr === 'right') {
                rotate = rotate + 90 > 360 ? rotate - 270 : rotate + 90;
            }
            fopArr.push({
                'fop': 'imageMogr2',
                'auto-orient': true,
                'strip': true,
                'rotate': rotate,
                'format': 'png'
            });
        }

        $('#myModal-img .modal-body-footer').find('a.disabled').each(function() {

            var watermark = $(this).data('watermark');
            var imageView = $(this).data('imageview');
            var imageMogr = $(this).data('imagemogr');

            if (watermark) {
                fopArr.push({
                    fop: 'watermark',
                    mode: 1,
                    image: 'http://www.b1.qiniudn.com/images/logo-2.png',
                    dissolve: 100,
                    gravity: watermark,
                    dx: 100,
                    dy: 100
                });
            }

            if (imageView) {
                var height;
                switch (imageView) {
                    case 'large':
                        height = originHeight;
                        break;
                    case 'middle':
                        height = originHeight * 0.5;
                        break;
                    case 'small':
                        height = originHeight * 0.1;
                        break;
                    default:
                        height = originHeight;
                        break;
                }
                fopArr.push({
                    fop: 'imageView2',
                    mode: 3,
                    h: parseInt(height, 10),
                    q: 100,
                    format: 'png'
                });
            }

            if (imageMogr === 'no-rotate') {
                fopArr.push({
                    'fop': 'imageMogr2',
                    'auto-orient': true,
                    'strip': true,
                    'rotate': 0,
                    'format': 'png'
                });
            }
        });

        var newUrl = Qiniu.pipeline(fopArr, key);

        var newImg = new Image();
        img.attr('src', 'images/loading.gif');
        newImg.onload = function() {
            img.attr('src', newUrl);
            img.parent('a').attr('href', newUrl);
        };
        newImg.src = newUrl;
        return false;
    });
    //七牛上传文件js end
   
    //上传资源 start
    $scope.loadImage = function(){
    	$.ajax({
			url: ruyiai_host + "/ruyi-ai/save/"+ appId +"/multimedia",
			data:{"mediaType":$scope.resType,"liststr":JSON.stringify($scope.addResListTemp)},
			method: "GET",
			success: function(data) {
				data = dataParse(data);
					if(data.code == 0){
					if(data.result && data.result.length > 0){
						$scope.loadResourceListFunc(data.result,loadpre);
					}
				}else if(data && data.code == 2){
					goIndex();
				}
				//将新添加的文件加入到addResListTemp
				$scope.$apply();
			}
		});
    }
  //上传资源 end
    
    //加载新的资源对象 start
    $scope.loadResourceListFunc = function(resourceList,order){
    	if(resourceList && resourceList.length ){
    		switch ($scope.resType) {
    		case "image":
    			if(!$scope.resImgList){
    				$scope.resImgList = resourceList;
    			}else{
    				for(var i in resourceList){
    					if(order == loadpre){
    						$scope.resImgList.unshift(resourceList[i]);
    					}else if(order == loadnext){
    						$scope.resImgList.push(resourceList[i]);
    					}
    				}
    			}
    			break;
    		case "voice":
    			if(!$scope.resVoiceList){
    				$scope.resVoiceList = resourceList;
    			}else{
    				for(var i in resourceList){
    					if(order == loadpre){
    						$scope.resVoiceList.unshift(resourceList[i]);
    					}else if(order == loadnext){
    						$scope.resVoiceList.push(resourceList[i]);
    					}
    				}
    			}
    			break;
    		case "video":
    			if(!$scope.resVideoList){
    				$scope.resVideoList = resourceList;
    			}else{
    				for(var i in resourceList){
    					if(order == loadpre){
    						$scope.resVideoList.unshift(resourceList[i]);
    					}else if(order == loadnext){
    						$scope.resVideoList.push(resourceList[i]);
    					}
    				}
    			}
    			break;
    		}
    		$scope.$apply();
    	}
    }
    //加载新的资源对象 end
    
    //查询多媒体文件列表 start
    $scope.loadResourceFunc = function(beforeTime,size,loadResourceListFunc){
    	$.ajax({
			url: ruyiai_host + "/ruyi-ai/query/"+ appId +"/list",
			data:{"type":$scope.resType,"beforeTime":beforeTime,"size":size},
			method: "GET",
			success: function(data){
				data = dataParse(data);
					if(data.code == 0){
					if(data.result){
						if(loadResourceListFunc){
							loadResourceListFunc(data.result,loadpre);
						}
					}
				}else if(data && data.code == 2){
					goIndex();
				}
			}
		});
    }
   //查询多媒体文件列表 end
   
   //加载图片列表 start
    $scope.loadResourceFunc(0,20,$scope.loadResourceListFunc);
   //加载图片列表 end
    
    //图片分页 start
	var $imgLoadMoreBox = true;
	$("[data-act=image-box]").on("scroll",function(e){
		var $this = $(this);
		var scrollTopsize = $this[0].scrollTop;
		var scrollHeightsize = $this[0].scrollHeight;
		var board_boxsize = $this.height();
		if (scrollTopsize >= (scrollHeightsize - board_boxsize - 45) && $imgLoadMoreBox == true ) {
			$imgLoadMoreBox = false;
			$.ajax({
				url: ruyiai_host + "/ruyi-ai/query/"+ appId +"/list",
				data:{"type":$scope.resType,"beforeTime":$scope.resImgList[$scope.resImgList.length -1].createTime,"size":pageSize},
				method: "GET",
				success: function(data) {
					data = dataParse(data);
					if(data.code == 0){
						if(data.result && data.result.length > 0){
							$scope.loadResourceListFunc(data.result, loadnext);
							$imgLoadMoreBox = true;
							$scope.$apply();
						}else{
							$imgLoadMoreBox = false;
						}
					}else if(data.code == 2){
						goIndex();
					}else{
						if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
					}
				}
			});
		}
	})
	//图片分页 end
	
	//删除
	var deleteResourceFunc = function(resourceListId){
		var resListStr = "";
		for(var i in resourceListId){
			resListStr += resourceListId[i]+",";
		}
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/delete/"+ appId +"/multimedia",
			data:{"listid":resListStr},
			method: "GET",
			success: function(data) {
				
				data = dataParse(data);
					if(data.code == 0){
					for(var i in resourceListId){
						if($scope.resType == "image"){
							for(var j in $scope.resImgList){
								if(resourceListId[i] == $scope.resImgList[j].id){
									$scope.resImgList.splice(j,1);
								}
							}
						}else if($scope.resType == "voice"){
							for(var j in $scope.resVoiceList){
								if(resourceListId[i] == $scope.resVoiceList[j].id){
									$scope.resVoiceList.splice(j,1);
								}
							}
						}else if($scope.resType == "video"){
							for(var j in $scope.resVideoList){
								if(resourceListId[i] == $scope.resVideoList[j].id){
									$scope.resVideoList.splice(j,1);
								}
							}
						}
					}
					$scope.$apply();
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
	}
	
	//图文消息分页 end
	
	//删除图片 start
	$("body").off("click",".image-operation .delete").on("click",".image-operation .delete",function(event){
		var $this = $(this);
		var id = $this.closest(".image-operation").attr("data-id");
		var title = $this.closest(".image-operation").attr("data-title");
		$.confirm({
			"text": '你确定要删除"'+ title +'"吗？',
	        "title": "删除",
	        "ensureFn": function() {
	        	var resourceListId = [id];
	        	deleteResourceFunc(resourceListId);
	        }
		});
	});
	//删除图片 end
	
	//编辑 start
	$("body").off("click",".image-operation .edit").on("click",".image-operation .edit",function(event){
		var $this = $(this);
		var id = $this.closest(".image-operation").attr("data-id");
		var title = $this.closest(".image-operation").attr("data-title");
		$("#updateResource").modal("show");
		$("[data-act=resource-name]").val(title);
		$("[data-act=resource-id]").val(id);
	});
	//编辑 end
	
    $("body").off("keydown","[data-act=resource-name]").on("keydown","[data-act=resource-name]",function(event){
		var $this = $(this);
		if(event.keyCode == 13){
			$("[data-act=submit-rename-resource]").trigger("click");
		}
	});
    
    $('#updateResource').on('shown.bs.modal', function () {
    	$("[data-act=resource-name]").focus();
    });
    
    $("body").off("click","[data-act=submit-rename-resource]").on("click","[data-act=submit-rename-resource]",function(event){
    	var $resourceNmae = $("[data-act=resource-name]");
    	var $resourceId = $("[data-act=resource-id]");
    	if($.trim($resourceNmae.val()).length == 0){
    		$.trace("资源名称不能为空");
    	}
    	$.ajax({
			url: ruyiai_host + "/ruyi-ai/update/"+ appId +"/multimedia",
			data:{"id":$resourceId.val() ,"name":$resourceNmae.val()},
			method: "GET",
			success: function(data) {
				data = dataParse(data);
					if(data.code == 0){
					if($scope.resType == "image"){
						for(var i in $scope.resImgList){
							if(data.result && $scope.resImgList[i].id == data.result.id){
								$scope.resImgList[i] = data.result;
								break;
							}
						}
					}else if($scope.resType == "voice"){
						for(var i in $scope.resVoiceList){
							if(data.result && $scope.resVoiceList[i].id == data.result.id){
								$scope.resVoiceList[i] = data.result;
								break;
							}
						}
					}else if($scope.resType == "video"){
						for(var i in $scope.resVideoList){
							if(data.result && $scope.resVideoList[i].id == data.result.id){
								$scope.resVideoList[i] = data.result;
								break;
							}
						}
					}
					$scope.$apply();
					$.trace("素材名称修改成功","success");
					$("#updateResource").modal("hide");
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			}
		});
    });
    
    //图片选中
    $("body").off("click","[data-act=img-box-active]").on("click","[data-act=img-box-active]",function(event){
    	var $this = $(this);
    	var $image_box_li = $this.parent(".image-box-li");
    	var id = $image_box_li.attr("data-id");
    	for(var i in $scope.resImgList){
    		if($scope.resImgList[i].id == id){
    			if($scope.resImgList[i].active){
    				$scope.resImgList[i].active = false;
    			}else{
    				$scope.resImgList[i].active = true;
    			}
    			break;
    		}
    	}
    	$scope.$apply();
    });
    
    //图片全选，反选
    $("body").off("click","[data-act=all-choose]").on("click","[data-act=all-choose]",function(event){
    	var $this = $(this);
    	var $checkbox = $this.find("input");
    	if($scope.resType == "image"){
    		if($checkbox.is(':checked')){
    			for(var i in $scope.resImgList){
    				$scope.resImgList[i].active = true;
    			}
    		}else{
    			for(var i in $scope.resImgList){
    				$scope.resImgList[i].active = false;
    			}
    		}
    	}else if($scope.resType == "voice"){
    		if($checkbox.is(':checked')){
    			for(var i in $scope.resVoiceList){
    				$scope.resVoiceList[i].active = true;
    			}
    		}else{
    			for(var i in $scope.resVoiceList){
    				$scope.resVoiceList[i].active = false;
    			}
    		}
    	}else if($scope.resType == "video"){
    		if($checkbox.is(':checked')){
    			for(var i in $scope.resVideoList){
    				$scope.resVideoList[i].active = true;
    			}
    		}else{
    			for(var i in $scope.resVideoList){
    				$scope.resVideoList[i].active = false;
    			}
    		}
    	}
    	$scope.$apply();
    });
    
    //批量删除
    $("body").off("click","[data-act=all-delete]").on("click","[data-act=all-delete]",function(event){
    	$.confirm({
			"text": '你确定要批量删除所选素材吗？',
	        "title": "删除",
	        "ensureFn": function() {
	        	var $this = $(this);
	        	var checkedCount = 0;
	        	var resourceIdList = [];
	        	if($scope.resType == "image"){
	        		for(var i in $scope.resImgList){
	        			if($scope.resImgList[i].active){
	        				resourceIdList.push($scope.resImgList[i].id);
	        				checkedCount++;
	        			}
	        		}
	        	}else if($scope.resType == "voice"){
	        		for(var i in $scope.resVoiceList){
	        			if($scope.resVoiceList[i].active){
	        				resourceIdList.push($scope.resVoiceList[i].id);
	        				checkedCount++;
	        			}
	        		}
	        	}else if($scope.resType == "video"){
	        		for(var i in $scope.resVideoList){
	        			if($scope.resVideoList[i].active){
	        				resourceIdList.push($scope.resVideoList[i].id);
	        				checkedCount++;
	        			}
	        		}
	        	}
	        	if(checkedCount == 0){
	        		$.trace("你未选择要删除的素材");
	        	}else{
	        		deleteResourceFunc(resourceIdList);
	        	}
	        }
		});
    });
    /*七牛上传图片相关代码 end*/
    
    /*上传音频相关代码 start*/
    var QiniuVoice = new QiniuJsSDK();
  //七牛上传图片文件 start
    var optionVoice = {
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfilesVoice',
        container: 'container',
        drop_element: 'container',
        max_file_size: '1000mb',
        flash_swf_url: 'bower_components/plupload/js/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        multi_selection: !(mOxie.Env.OS.toLowerCase()==="ios"),
        //uptoken: $('#uptoken_url').val(),
        uptoken_url:ruyiai_host + "/ruyi-ai/getuptoken",
        domain: $('#domain').val(),
        get_new_uptoken: false,
        save_key: true,
        filters : {
             mime_types: [
                      {title : "Voice files", extensions : "MP3,AAC,WAV,WMA,CDA,FLAC,M4A,MID,MKA,MP2,MPA,MPC,APE,OFR,OGG,RA,WV,TTA,AC3,DTS"}
             ]
        },
        auto_start: true,
        log_level: 5,
        init: {
            'FilesAdded': function(up, files) {
            	$("#addresource").modal("show");
                $('table').show();
                $('#success').hide();
                plupload.each(files, function(file) {
                    var progress = new FileProgress(file, 'fsUploadProgress');
                    progress.setStatus("等待...");
                    progress.bindUploadCancel(up);
                });
            },
            'BeforeUpload': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    progress.setChunkProgess(chunk_size);
                }
            },
            'UploadProgress': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                progress.setProgress(file.percent + "%", file.speed, chunk_size);
            },
            'UploadComplete': function() {
            	$("#addresource").modal("hide");
            	//$scope.loadImage();
            	$("#fsUploadProgress").html("");
                //$('#success').show();
            },
            'FileUploaded': function(up, file, info) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                progress.setComplete(up, info);
                var tempObj = new Object();
                tempObj.url = $('#domain').val() + JSON.parse(info).hash +"/" + file.name;
                tempObj.title = file.name;
                tempObj.size = file.size;
                
                switch ($scope.resType) {
				case "image":
					tempObj.type = "image"; 
					break;
				case "voice":
					tempObj.type = "voice"; 
					break;
				case "video":
					tempObj.type = "video"; 
					break;
				default:
					break;
				}
                $scope.addResListTemp.push(tempObj);
                $scope.loadImage();
                $scope.addResListTemp = [];
                $scope.$apply();
            },
            'Error': function(up, err, errTip) {
                $('table').show();
                var progress = new FileProgress(err.file, 'fsUploadProgress');
                progress.setError();
                progress.setStatus(errTip);
            }
                // ,
                // 'Key': function(up, file) {
                //     var key = "";
                //     // do something with key
                //     return key
                // }
        }
    };
    var uploaderVoice = QiniuVoice.uploader(optionVoice);
    
    /*上传音频相关代码 start*/
    var QiniuVideo = new QiniuJsSDK();
  //七牛上传图片文件 start
    var optionVideo = {
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfilesVideo',
        container: 'container',
        drop_element: 'container',
        max_file_size: '1000mb',
        flash_swf_url: 'bower_components/plupload/js/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        multi_selection: !(mOxie.Env.OS.toLowerCase()==="ios"),
        //uptoken: $('#uptoken_url').val(),
        uptoken_url:ruyiai_host + "/ruyi-ai/getuptoken",
        domain: $('#domain').val(),
        get_new_uptoken: false,
        save_key: true,
        filters : {
             mime_types: [
                      {title : "video files", extensions : "avi,rmvb,rm,asf,divx,mpg,mpeg,mpe,wmv,mp4,mkv,vob,flv,mov"}
             ]
        },
        auto_start: true,
        log_level: 5,
        init: {
            'FilesAdded': function(up, files) {
            	$("#addresource").modal("show");
                $('table').show();
                $('#success').hide();
                plupload.each(files, function(file) {
                    var progress = new FileProgress(file, 'fsUploadProgress');
                    progress.setStatus("等待...");
                    progress.bindUploadCancel(up);
                });
            },
            'BeforeUpload': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    progress.setChunkProgess(chunk_size);
                }
            },
            'UploadProgress': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                progress.setProgress(file.percent + "%", file.speed, chunk_size);
            },
            'UploadComplete': function() {
            	$("#addresource").modal("hide");
            	$("#fsUploadProgress").html("");
                //$('#success').show();
            },
            'FileUploaded': function(up, file, info) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                progress.setComplete(up, info);
                var tempObj = new Object();
                tempObj.url = $('#domain').val() + JSON.parse(info).hash +"/" + file.name;
                tempObj.title = file.name;
                tempObj.size = file.size;
                
                switch ($scope.resType) {
				case "image":
					tempObj.type = "image"; 
					break;
				case "voice":
					tempObj.type = "voice"; 
					break;
				case "video":
					tempObj.type = "video"; 
					break;
				default:
					break;
				}
                $scope.addResListTemp.push(tempObj);
                $scope.loadImage();
                $scope.addResListTemp = [];
                $scope.$apply();
            },
            'Error': function(up, err, errTip) {
                $('table').show();
                var progress = new FileProgress(err.file, 'fsUploadProgress');
                progress.setError();
                progress.setStatus(errTip);
            }
                // ,
                // 'Key': function(up, file) {
                //     var key = "";
                //     // do something with key
                //     return key
                // }
        }
    };
    var uploaderVideo = QiniuVideo.uploader(optionVideo);
    //视频相关上传代码 end
    
  //音频分页 start
	var $voiceLoadMoreBox = true;
	$("[data-act=voice-box]").on("scroll",function(e){
		var $this = $(this);
		var scrollTopsize = $this[0].scrollTop;
		var scrollHeightsize = $this[0].scrollHeight;
		var board_boxsize = $this.height();
		console.log($voiceLoadMoreBox);
		if (scrollTopsize >= (scrollHeightsize - board_boxsize - 45) && $voiceLoadMoreBox == true ) {
			$voiceLoadMoreBox = false;
			$.ajax({
				url: ruyiai_host + "/ruyi-ai/query/"+ appId +"/list",
				data:{"type":$scope.resType,"beforeTime":$scope.resVoiceList[$scope.resVoiceList.length -1].createTime,"size":pageSize},
				method: "GET",
				success: function(data) {
					data = dataParse(data);
					if(data.code == 0){
						if(data.result && data.result.length > 0){
							$scope.loadResourceListFunc(data.result, loadnext);
							$voiceLoadMoreBox = true;
							$scope.$apply();
						}else{
							$imgLoadMoreBox = false;
						}
					}else if(data.code == 2){
						goIndex();
					}else{
						if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
					}
				}
			});
		}
	})
	//图片分页 end
    /*上传音频相关代码 end*/
	
	//视频分页 start
	var $videoLoadMoreBox = true;
	$("[data-act=video-box]").on("scroll",function(e){
		var $this = $(this);
		var scrollTopsize = $this[0].scrollTop;
		var scrollHeightsize = $this[0].scrollHeight;
		var board_boxsize = $this.height();
		if (scrollTopsize >= (scrollHeightsize - board_boxsize - 45) && $videoLoadMoreBox == true ) {
			$videoLoadMoreBox = false;
			$.ajax({
				url: ruyiai_host + "/ruyi-ai/query/"+ appId +"/list",
				data:{"type":$scope.resType,"beforeTime":$scope.resVideoList[$scope.resVideoList.length -1].createTime,"size":pageSize},
				method: "GET",
				success: function(data) {
					data = dataParse(data);
					if(data.code == 0){
						if(data.result && data.result.length > 0){
							$scope.loadResourceListFunc(data.result, loadnext);
							$imgLoadMoreBox = true;
							$scope.$apply();
						}else{
							$imgLoadMoreBox = false;
						}
					}else if(data.code == 2){
						goIndex();
					}else{
						if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
					}
				}
			});
		}
	})
    /*上传视频相关代码 end*/
	
	//删除音频 start
	$("body").off("click","#voice .delete,#video .delete").on("click","#voice .delete,#video .delete",function(event){
		var $this = $(this);
		var id = $this.closest("tr").attr("data-id");
		var title = $this.closest("tr").attr("data-title");
		$.confirm({
			"text": '你确定要删除"'+ title +'"吗？',
	        "title": "删除",
	        "ensureFn": function() {
	        	var resourceListId = [id];
	        	deleteResourceFunc(resourceListId);
	        }
		});
	});
	//删除音频 end
	
	//编辑音频 start
	$("body").off("click","#voice .edit,#video .edit").on("click","#voice .edit,#video .edit",function(event){
		var $this = $(this);
		var id = $this.closest("tr").attr("data-id");
		var title = $this.closest("tr").attr("data-title");
		$("#updateResource").modal("show");
		$("[data-act=resource-name]").val(title);
		$("[data-act=resource-id]").val(id);
	});
	//编辑音频 end
	
	//音频单选 start
	$("body").off("click","[name=choosed-voice]").on("click","[name=choosed-voice]",function(event){
		var $this = $(this);
		var id = $this.closest("tr").attr("data-id");
		for(var i in $scope.resVoiceList){
			if($scope.resVoiceList[i].id == id){
				if($scope.resVoiceList[i].active){
					$scope.resVoiceList[i].active = true;
				}else{
					$scope.resVoiceList[i].active = false;
				}
			}
		}
		$scope.$apply();
	});
	//音频单选 end
    
};










