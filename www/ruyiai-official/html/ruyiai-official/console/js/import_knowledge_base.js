function importKnowledgeBaseCtrl($rootScope,$scope, $state, $stateParams){
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-import-knowledge-base]").addClass("active");
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	}, 200);
	
	//点击窗口其他的时候，隐藏某些元素 start
	$(document).click(function(event){
		var $target = $(event.target);
		if(!$target.is(".questions-answers-panel") && !$target.is(".questions-answers-panel .questions-answers-content")
				 && !$target.is(".questions-answers-panel .common-submit-button")
				 && !$target.is(".questions-answers-content .common-cancel-modal")){
			$(".questions-answers-panel").fadeOut(500,function(e){
				$(this).remove();
			});
		}
    });
	//点击窗口其他的时候，隐藏某些元素 end
	
	//点击esc键，隐藏某些元素 start
	$("body").off("keydown").on("keydown",function(event){
		var $this = $(this);
		if(event.keyCode == "27"){
			$(".questions-answers-panel").fadeOut(500,function(e){
				$(this).remove();
			});
		}
	});
	//点击esc键，隐藏某些元素 end
	
	/*词典的导入导出 start **/
	$("body").off("click","#importEntityKnowledgeBaseButton").on("click","#importEntityKnowledgeBaseButton",function(event){
		$("[data-act=chooseImportEntityInput]").trigger("click");
	});
	
	$("body").off("change","[data-act=chooseImportEntityInput]").on("change","[data-act=chooseImportEntityInput]",function(event){
		var formData = new FormData($("#importEntityKnowledgeBaseForm")[0]);  
		$.ajax({  
			url: ruyiai_host + "/ruyi-ai/dictionary/import/" + appId,
			type: 'POST',  
			data: formData,  
			async: false,  
			cache: false,  
			contentType: false,  
			processData: false,  
			success: function (data) {
				
				data = dataParse(data);
					if(data.code == 0){
					$.trace("总共"+data.result.total+"个词条，成功导入"+data.result.success+"个，失败"+data.result.fail+"个","success");
					//$("[data-act=importSuccessTips]").append("<div style='color:#009688;margin-top:14px;'>总共"+data.result.total+"个词条，成功导入"+data.result.success+"个，失败"+data.result.fail+"个</div>");
					$scope.entityImportLogList.push(data.result);
					$scope.$apply();
					$("[data-act=chooseImportEntityInput]").val("");
				}else if(data.code == 2){
					goIndex();
				}else{
					$.trace(data.msg,"error");
				}
			},  
			error: function (data) {  
			}  
		});
	});
	//上传词典库 end
	
	//查询词典列表
	function queryEntityList(){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/" + appId + "/importlog/query",
			data:{"type":"ENTITY"},
			method: "GET",
			success: function(data){
				
				data = dataParse(data);
					if(data.code == 0){
					$scope.entityImportLogList = data.result;
					$scope.$apply();
					setEntityTable();
				}else if(data.code == 2){
					goIndex();
				}else{
				}
			}
		});
	}
	queryEntityList();
	
	$scope.deleteImportLog = function(logId,fileName){
		$.confirm({
	        "text": fileName + "文件对应上传的词典数据删除之后将无法恢复，你确认要删除吗？" ,
	        "title": "删除词典",
	        "ensureFn": function() {
	        	$.ajax({
	        		url: ruyiai_host + "/ruyi-ai/" + appId + "/importlog/del",
	        		data:{"logId":logId},
	        		method: "GET",
	        		success: function(data){
	        			
	        			data = dataParse(data);
					if(data.code == 0){
	        				for(var i in $scope.entityImportLogList){
	        					if($scope.entityImportLogList[i].id == logId){
	        						$scope.entityImportLogList.splice(i,1);
	        						break;
	        					}
	        				}
	        				$.trace("删除成功","success");
	        				$scope.$apply();
	        			}else if(data.code == 2){
	        				goIndex();
	        			}else{
	        			}
	        		}
	        	});
				return false;
			}
		});
		
	}
	
	//导出当前问答对
	$scope.downloadEntityFile = function(hashId){
		window.open(ruyiai_host + "/ruyi-ai/dictionary/export/" + appId + "?hashId=" + hashId);
	}
	
	//导出所有问答对
	$("body").off("click","#exportEntityKnowledgeBaseButton").on("click","#exportEntityKnowledgeBaseButton",function(event){
		window.open(ruyiai_host + "/ruyi-ai/dictionary/export/" + appId);
	});
	
	//下载示例词典文件
	$("body").off("click","[data-act=download-example-entity]").on("click","[data-act=download-example-entity]",function(event){
		window.open(static_host + "/console/example-file/词典示例.zip");
	});
	
	//下载示例问答对文件
	$("body").off("click","[data-act=download-example-faq]").on("click","[data-act=download-example-faq]",function(event){
		window.open(static_host + "/console/example-file/问答对示例.zip");
	});
	/*词典的导入导出 end **/
	
	/*问答对的导入导出 start **/
	$("body").off("click","#importFaqKnowledgeBaseButton").on("click","#importFaqKnowledgeBaseButton",function(event){
		$("[data-act=chooseImportFaqInput]").trigger("click");
	});
	
	$("body").off("change","[data-act=chooseImportFaqInput]").on("change","[data-act=chooseImportFaqInput]",function(event){
		var formData = new FormData($("#importFaqKnowledgeBaseForm")[0]);  
		$.ajax({  
			url: ruyiai_host + "/ruyi-ai/faq/import/" + appId,
			type: 'POST',  
			data: formData,  
			async: false,  
			cache: false,  
			contentType: false,  
			processData: false,  
			success: function (data) {
				
				data = dataParse(data);
					if(data.code == 0){
					$("[data-act=chooseImportFaqInput]").val("");
					setTimeout(function(){
						queryFaqList(faqPageSize,1);
					}, 1000);
					$.trace("总共"+data.result.totalCount+"个问答对，成功导入"+data.result.successCount+"个，失败"+data.result.errorCount+"个","success");
					//$scope.faqImportLogList.push(data.result);
//					$scope.$apply();
				}else if(data.code == 2){
					goIndex();
				}else{
					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
				}
			},  
			error: function (data) {  
			}  
		});
	});
	
	//导出当前问答对
	$scope.downloadFaqFile = function(hashId){
		window.open(ruyiai_host + "/ruyi-ai/faq/export/" + appId + "?hashId=" + hashId);
	}
	
	$scope.deleteImportFaqLog = function(logId,fileName){
		$.confirm({
	        "text": fileName + "文件对应上传的问答对数据删除之后将无法恢复，你确认要删除吗？" ,
	        "title": "删除问答对",
	        "ensureFn": function() {
	        	$.ajax({
	        		url: ruyiai_host + "/ruyi-ai/" + appId + "/importlog/del",
	        		data:{"logId":logId},
	        		method: "GET",
	        		success: function(data){
	        			
	        			data = dataParse(data);
					if(data.code == 0){
	        				for(var i in $scope.faqImportLogList){
	        					if($scope.faqImportLogList[i].id == logId){
	        						$scope.faqImportLogList.splice(i,1);
	        						break;
	        					}
	        				}
	        				$.trace("删除成功","success");
	        				$scope.$apply();
	        			}else if(data.code == 2){
	        				goIndex();
	        			}else{
	        			}
	        		}
	        	});
				return false;
			}
		});
		
	}
	/*问答对的导入导出 start **/
	
	//根据弹出框的位置，设置表格滚动条的位置
	function setEditPanelHeightFunc(){
		var $questionsAnswersTable = $(".questions-answers-table");
		var tableHeight = $questionsAnswersTable.offset().top + $questionsAnswersTable.outerHeight();
		var $questionsAnswersPanel = $(".questions-answers-panel");
		var panelHeight = $questionsAnswersPanel.offset().top + $questionsAnswersPanel.outerHeight();
		var heightDiff = panelHeight - tableHeight;
		if(heightDiff > 0){
			$(".questions-answers-table").scrollTop($(".questions-answers-table").scrollTop() + heightDiff);
		}
	}
	
	//设置可编辑div光标位置到最后
	function set_focus(my_selector)
	{
	    el= $(my_selector);
	    el=el[0];  //jquery 对象转dom对象
	    el.focus();
	    if($.support.msie)
	    {
	        var range = document.selection.createRange();
	        this.last = range;
	        range.moveToElementText(el);
	        range.select();
	        document.selection.empty(); //取消选中
	        console.log(1);
	    }
	    else
	    {
	        var range = document.createRange();
	        range.selectNodeContents(el);
	        range.collapse(false);
	        var sel = window.getSelection();
	        sel.removeAllRanges();
	        sel.addRange(range);
	        console.log(2);
	    }
	}
	
	function set_select(my_selector) {
    var text= $(my_selector);
		text = text[0]; 
    if(document.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    }else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }else{
			set_focus(".questions-answers-content");
		}
	}
	
	/*获得光标，添加删除和确认按钮 start*/
	$("body").off("click","[data-act-focus=questions-answers]").on("click","[data-act-focus=questions-answers]",function(event){
		var $this = $(this);
		$this.closest("tr").find(".trash-icon").css("display","none");
		setTimeout(function(){
			var dataType = $this.closest(".questions-answers-parent").attr("data-type");
			if(dataType == "oldQuestion"){
				return false;
			}
			var dataId = $this.closest("tr").attr("data-id");
			var operation_panel_width = $this.parent().outerWidth() + 40;
			var positionTop = $this.position().top - 20;
			var editContent = $this.html();
			$this.closest(".questions-answers-parent").append('<div class="questions-answers-panel" data-id="'+ dataId +'" data-type="'+ dataType +'" style="top:'+ positionTop +'px;width:'+ operation_panel_width +'px;"><div contenteditable="true" class="questions-answers-content"> '+ editContent +' </div><button class="pull-right common-submit-button" data-act-submit="questions-answers-submit">确 定</button><button class="pull-right common-cancel-modal" data-act-cancel="questions-answers-cancel">取 消</button></div>');
			setTimeout(function(){
//				$(".questions-answers-content").focus();
//				set_focus(".questions-answers-content");
				set_select(".questions-answers-content");
				//根据弹出框的位置，设置表格滚动条的位置
				setEditPanelHeightFunc();
			}, 500);
		}, 100);
	});
	
	
	$("body").off("keydown",".questions-answers-content").on("keydown",".questions-answers-content",function(event){
		var $this = $(this);
		if(event.keyCode == 13){
			$this.parent(".questions-answers-panel").find("[data-act-submit=questions-answers-submit]").trigger("click");
			event.stopPropagation();
			return false;
		}
	});
	
	//修改faq数据
	$scope.updateFaqFunc = function(faqObject){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/faq/update/" + appId,
			data: JSON.stringify(faqObject),
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			method: "POST",
			success: function(data){
				
				data = dataParse(data);
					if(data.code == 0){
				}else if(data.code == 2){
					goIndex();
				}else{
				}
			}
		});
	}
	
	$("body").off("click","[data-act-submit=questions-answers-submit]").on("click","[data-act-submit=questions-answers-submit]",function(event){
		var $this = $(this);
		var dataId = $this.closest(".questions-answers-panel").attr("data-id");
		var dataType = $this.closest(".questions-answers-panel").attr("data-type");
		var $content = $this.parent(".questions-answers-panel").find(".questions-answers-content");
		var content = $content.html();
		console.log("===具体情况=========");
		console.log(dataId,dataType,content);
		content = $.trim(content).replace(/&nbsp;+/g,"");
		if(!content || content.length == 0){
//			if(dataType == "question"){
//				$.trace("用户说不能为空");
//			}else if(dataType == "answer"){
//				$.trace("机器人答不能为空");
//			}
			$.trace("内容不能为空");
			$content.focus();
			return false;
		}
		if(dataType == "question" || dataType == "answer"){
			for(var i in $scope.faqImportLogList){
				if(dataId == $scope.faqImportLogList[i].id){
					if(dataType == "question"){
						$scope.faqImportLogList[i].question = content;
					}else if(dataType == "answer"){
						$scope.faqImportLogList[i].answer = content;
					}
					$scope.updateFaqFunc($scope.faqImportLogList[i]);
					break;
				}
			}
		}else if(dataType == "oldQuestion" || dataType == "newQuestion"){
			for(var i in $scope.correctImportLogList){
				if(dataId == $scope.correctImportLogList[i].id){
					$scope.correctImportLogList[i].correctionSentence = content;
					$scope.updateCorrectionFunc($scope.correctImportLogList[i]);
					break;
				}
			}
		}
		
		$scope.$apply();
		$this.closest(".questions-answers-panel").fadeOut(500,function(){
			$this.closest(".questions-answers-panel").remove();
		});
	});
	
	$scope.deleteFaqFunc = function(dataId){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/faq/delete/" + appId + "/" + dataId,
			method: "DELETE",
			success: function(data){
				
				data = dataParse(data);
					if(data.code == 0){
					for(var i in $scope.faqImportLogList){
						if(dataId == $scope.faqImportLogList[i].id){
							$scope.faqImportLogList.splice(i,1);
							break;
						}
					}
					$scope.$apply();
					//如果删除到最后，则从新查询10个
					if($scope.faqImportLogList.length <= 1){
						queryFaqList(faqPageSize,1);
					}
				}else if(data.code == 2){
					goIndex();
				}
			}
		});
	}
	
	$("body").off("click","[data-act-cancel=questions-answers-cancel]").on("click","[data-act-cancel=questions-answers-cancel]",function(event){
		var $this = $(this);
		$this.closest(".questions-answers-panel").fadeOut(500,function(){
			$this.closest(".questions-answers-panel").remove();
		});
	});
	/*获得光标，添加删除和确认按钮 end*/
	
	var setEntityTable = function(){
		$("#entity-library-box").css("max-height", ($(window).height() - 422) + "px");
	}
	
	var setQuestionsAnswersTable = function(){
		$(".questions-answers-table").css("max-height", ($(window).height() - 342) + "px");
		$(".questions-answers-table").css("height", ($(window).height() - 342) + "px");
	}
	$(window).resize(function() {
		setEntityTable();
		setQuestionsAnswersTable();
	});
	
	/*问答对的导入导出 start**/
	var faqPageSize = 10;
	var faqPageNo = 1;
	//查询问答对列表
	function queryFaqList(faqPageSize,faqPageNo){
		var query_question = $("#query_question").val();
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/faq/list/" + appId,
			data:{"size":faqPageSize,"page": faqPageNo,"query":query_question},
			method: "GET",
			success: function(data){
				
				data = dataParse(data);
					if(data.code == 0){
					var resultObj = data.result;
					$scope.faqImportLogList = resultObj.hits;
					$scope.$apply();
					//显示分页
					var totalPage = resultObj.totalPage;
					showPagesHtml(faqPageNo,totalPage,"common-paging-box");
					setTimeout(function(){
						//设置页面高度
						setQuestionsAnswersTable();
					}, 300);
				}else if(data.code == 2){
					goIndex();
				}else{
				}
			}
		});
	}
	queryFaqList(faqPageSize ,faqPageNo);
	/*问答对的导入导出 end**/
	
	//分页算法，保持永久是显示7个数字
	function showPages(page, total) {
		var str = '';
		if(total == 1){
			return false;
		}
		if(total <= 7){
			for(var i = 1;i <= total; i++){
				str = str + i;
				if(i != total){
					 str+= ' ';
				}
			}
			if(page > 1){
				str = '上一页' + ' ' + str;
			}
			if(page < total){
				str =  str + ' ' + '下一页';
			}
			return str;
		}
			
		str = page + '';
		var indexTempOne = 1;
		if(page < 4 ){
			indexTempOne = 5 - page;
		}
		for (var i = 1; i <= indexTempOne; i++) {
			if (page - i > 2) {
				str = page - i + ' ' + str;
			}
			if (page + i < total) {
				str = str + ' ' + (page + i);
			}
		}
		
		var totalDiff = total - page;
		if(totalDiff <= 2){
//			var strTemp = "";
			for(var i=2;i<=4-totalDiff;i++){
				str = (page - i) + ' ' + str;
			}
//			str = strTemp + ' ' + str;
		}
		
		if (page - 4 >= 1) {
			str = '...' + ' ' + str;
		}

		if(page > 2){
			str = 2 + ' ' + str;
		}
		
		if (page > 1) {
			str = '上一页' + ' ' + 1 + ' ' + str;
		}
		
		if (page + 3 < total) {
			str = str + ' ' + '...';
		}
		
		if(total - page > 2){
			str = str + ' ' + (total-1);
		}
		if(total - page > 0){
			str = str + ' ' + total + ' ' + '下一页';
		}
		return str;
	}
	
	//展示分页
	var showPagesHtml = function(pageNo,total,faqTypeStr){
		pageNo = pageNo + 1;
		if(total > 1){
			var pageList = showPages(pageNo,total).split(' ');
			var pageListStr = ""; 
			for(var i in pageList){
				if(pageList[i] == pageNo){
					pageListStr += "<li class='pull-left active'>"+pageList[i] + "</li>";
				}else{
					pageListStr += "<li class='pull-left'>"+pageList[i] + "</li>";
				}
			}
			console.log("pageListStr");
			console.log(pageListStr);
			$("."+faqTypeStr).html("").append(pageListStr);
		}else{
			$("."+faqTypeStr).html("");
		}
	}
	
	$("body").off("click",".common-paging-box li").on("click",".common-paging-box li",function(event){
		var $this = $(this);
		var activePageNo  = $(".common-paging-box li.active").html(); 
		var pageNo = $this.html();
		if(pageNo == "..."){
			return false;
		}else if(pageNo == "上一页"){
			pageNo = parseInt(activePageNo) - 1;
		}else if(pageNo == "下一页"){
			pageNo = parseInt(activePageNo) + 1;
		}else{
			pageNo = parseInt(pageNo);
		}
		queryFaqList(faqPageSize,pageNo);
	});
	
	//搜索用户说
	$("body").off("keydown","#query_question").on("keydown","#query_question",function(event){
		var $this = $(this);
		if(event.keyCode == 13){
			queryFaqList(faqPageSize,1);
		}
	});
	
	$("body").off("mouseover","[data-act=questions-answers-tr]").on("mouseover","[data-act=questions-answers-tr]",function(event){
		var $this = $(this);
		if($this.find(".questions-answers-panel").length == 0){
			$this.find(".trash-icon").css("display","block");
		}
	});
	
	$("body").off("mouseout","[data-act=questions-answers-tr]").on("mouseout","[data-act=questions-answers-tr]",function(event){
		var $this = $(this);
		$this.find(".trash-icon").css("display","none");
	});
	
	
	
	
	
	
	
	
	/////////纠错问答对 strt//////////////////
	/*纠错问答对导入 start **/
	
	
	/*问答对的导入导出 start**/
	var correcPageSize = 10;
	var correcPageNo = 0;
	//查询问答对列表
	function queryCorrectList(correcPageSize,correcPageNo){
		var correction_query = $("#correction-query").val();
		var queryUrl = "";
		if(correction_query && correction_query.length > 0){
			queryUrl = ruyiai_host + "/ruyi-ai/agents/" + appId + "/sentenceCorrectionTokenQuery?sentenceString=" + correction_query;
			
		}else{
			queryUrl = ruyiai_host + "/ruyi-ai/agents/" + appId + "/sentenceCorrection";
		}
		$.ajax({
			url: queryUrl,
			data:{"size":correcPageSize,"page": correcPageNo},
			method: "GET",
			success: function(data){
				data = dataParse(data);
				if(data.code == 0){
					data = dataParse(data.result);
					$scope.correctImportLogList = data.content;
					$scope.$apply();
					//显示分页
					var totalPage = parseInt((data.pagination.totalElements / correcPageSize)) + 1;
					showPagesHtml(correcPageNo,totalPage,"correct-common-paging-box");
					setTimeout(function(){
						//设置页面高度
						setQuestionsAnswersTable();
					}, 300);
				}
				
//				data = dataParse(data);
//				if(data.code == 0){
//					var resultObj = data.result;
//					var resultObj = '{ "hits": [ { "question": "晚安", "answer": "晚安，做个好梦！", "id": "AV4UbH4T7SsidbP9A1Na" }, { "question": "晚安", "answer": "晚安，睡个好觉！", "id": "AV4UbH4T7SsidbP9A1Nb" }, { "question": "你好", "answer": "好呀!", "id": "AV4UbH4T7SsidbP9A1Nd" }, { "question": "怎么联系你们", "answer": "请关注艾如意宝宝。", "id": "AV4UbH4T7SsidbP9A1Ne" }, { "question": "晚安", "answer": "晚安，好梦啦", "id": "AV4UbH4T7SsidbP9A1Nc" }, { "question": "你个傻x", "answer": "听你这么说，我好伤心哦", "id": "AVue2JwL7SsidbP98mAC" }, { "question": "晚安", "answer": "晚安，好梦啦", "id": "AVue2JwL7SsidbP98mAB" }, { "question": "蠢猪一只，不想和你说话了", "answer": "听你这么说，我好伤心哦", "id": "AVue2JwL7SsidbP98l_-" }, { "question": "用户说", "answer": "机器人答", "id": "AVue2JwL7SsidbP98l__" }, { "question": "你真笨", "answer": "听你这么说，我好伤心哦", "id": "AVue2JwL7SsidbP98mAA" } ], "totalSize": 47, "size": 10, "totalPage": 5, "currentPage": 1 }';
//					resultObj = JSON.parse(resultObj);
//					
//					$scope.correctImportLogList = resultObj.hits;
//					$scope.$apply();
//					//显示分页
//					var totalPage = resultObj.totalPage;
//					showPagesHtml(correcPageNo,totalPage,"correct-common-paging-box");
//					setTimeout(function(){
//						//设置页面高度
//						setQuestionsAnswersTable();
//					}, 300);
//				}else if(data.code == 2){
//					goIndex();
//				}else{
//				}
			}
		});
	}
	queryCorrectList(correcPageSize ,correcPageNo);
	/*问答对的导入导出 end**/
	
	$("body").off("click",".correct-common-paging-box li").on("click",".correct-common-paging-box li",function(event){
		var $this = $(this);
		var activePageNo  = $(".correct-common-paging-box li.active").html(); 
		var pageNo = $this.html();
		if(pageNo == "..."){
			return false;
		}else if(pageNo == "上一页"){
			pageNo = parseInt(activePageNo) - 1;
		}else if(pageNo == "下一页"){
			pageNo = parseInt(activePageNo) + 1;
		}else{
			pageNo = parseInt(pageNo);
		}
		pageNo = pageNo - 1;
		queryCorrectList(faqPageSize,pageNo);
	});
	
	$("body").off("click","#importCorrectionFaqKnowledgeBaseButton").on("click","#importCorrectionFaqKnowledgeBaseButton",function(event){
		$("[data-act=chooseImportCorrectionFaqInput]").trigger("click");
	});
	
	$("body").off("change","[data-act=chooseImportCorrectionFaqInput]").on("change","[data-act=chooseImportCorrectionFaqInput]",function(event){
		var formData = new FormData($("#importCorrectionFaqKnowledgeBaseForm")[0]);  
		$.ajax({  
			url: ruyiai_host + "/ruyi-ai/sentenceCorrection/import/" + appId,
			type: 'POST',  
			data: formData,  
			async: false,  
			cache: false,  
			contentType: false,  
			processData: false,  
			success: function (data) {
				data = dataParse(data);
				if(data.code == 0){
					result = dataParse(data.result);
					if(result.status == 200){
						$.trace("导入成功");
						$("[data-act=chooseImportCorrectionFaqInput]").val("");
						setTimeout(function(){
							queryCorrectList(correcPageSize ,0);
						}, 1000);
					}else{
						$.trace("导入出现异常");
					}
				}
//				if(data.code == 0){
//					$("[data-act=chooseImportCorrectionFaqInput]").val("");
//					setTimeout(function(){
//						queryCorrectList(correcPageSize,1); //更新纠错列表页面
//					}, 1000);
//					$.trace("总共"+data.result.totalCount+"个，成功导入"+data.result.successCount+"个，失败"+data.result.errorCount+"个","success");
//				}else if(data.code == 2){
//					goIndex();
//				}else{
//					if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
//				}
			},  
			error: function (data) {  
			}  
		});
	});
	
	$scope.deleteCorrectFaqFunc = function(dataId){
		var dataIdList = {"id":dataId};
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/agents/"+ appId +"/sentenceCorrection/" + dataId,
			method: "DELETE",
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			success: function(data){
				data = dataParse(data);
				if(data.code == 0){
					data = dataParse(data.result);
					if(data.status == 200){
						for(var i in $scope.correctImportLogList){
							if(dataId == $scope.correctImportLogList[i].id){
								$scope.correctImportLogList.splice(i,1);
								break;
							}
						}
						$scope.$apply();
						//如果删除到最后，则从新查询10个
						if($scope.correctImportLogList.length <= 1){
							setTimeout(function(){
								queryCorrectList(correcPageSize,1);
							},2000);
						}
					}
				}
//				if(data.code == 0){
//					for(var i in $scope.faqImportLogList){
//						if(dataId == $scope.faqImportLogList[i].id){
//							$scope.faqImportLogList.splice(i,1);
//							break;
//						}
//					}
//					$scope.$apply();
//					//如果删除到最后，则从新查询10个
//					if($scope.faqImportLogList.length <= 1){
//						queryFaqList(faqPageSize,1);
//					}
//				}else if(data.code == 2){
//					goIndex();
//				}
			}
		});
	}
	
	//修改faq数据
	$scope.updateCorrectionFunc = function(correctionObj){
		$.ajax({
			url: ruyiai_host + "/ruyi-ai/agents/"+ appId +"/sentenceCorrection/"+ correctionObj.id,
			data: JSON.stringify(correctionObj),
			traditional: true,
			headers: {"Content-Type" : "application/json"},
			method: "POST",
			success: function(data){
				data = dataParse(data);
//				if(data.code == 0){
//				}else if(data.code == 2){
//					goIndex();
//				}else{
//				}
			}
		});
	}
	
	//搜索用户说
	$("body").off("keydown","#correction-query").on("keydown","#correction-query",function(event){
		var $this = $(this);
		if(event.keyCode == 13){
			queryCorrectList(faqPageSize,0);
		}
	});
	
	
	/*纠错问答对导入 end **/
	/////////纠错问答对 end///////////////////
	
	
	
	
};












