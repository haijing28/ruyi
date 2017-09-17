function deleteRobotCtrl($rootScope,$scope, $state, $stateParams){
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-robot-para]").addClass("active");
//	$("[data-act=nav-robot-delete]").addClass("active");
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	}, 200);
	$('[data-toggle="popover"]').popover();
	
	$("body").off("click",".d-robot-delete-button").on("click",".d-robot-delete-button",function(event){
		$("#delete-text").val("");
		var $this = $(this);
		$("#deleteRobot").modal("show");
	});
	$(".para-action-tips").css("display","none");
	
	$("body").off("click","[data-act=delete-robot-submit]").on("click","[data-act=delete-robot-submit]",function(event){
		var $this = $(this);
		var $deleteText = $("#delete-text");
		if($deleteText.val().trim() == "删除"){
			$.ajax({
    			url : ruyiai_host + "/ruyi-ai/app/" + $rootScope.currentRobot.id,
    			method : "DELETE",
    			success: function(data) {
    				data = dataParse(data);
					if(data.code == 0){
    					$.trace("删除成功","success");
    					window.location.href = static_host + "/app_manager.html";
    				}else if(data.code == 2){
    					goIndex();
    				}else if(data.code == 1){
    					$.trace(""+data.msg);
    				}
    			}
    		});
			
		}else{
			$.trace("请在文本框中输入’删除‘,以确认删除");
			$deleteText.focus();
		}
	});
	
}











