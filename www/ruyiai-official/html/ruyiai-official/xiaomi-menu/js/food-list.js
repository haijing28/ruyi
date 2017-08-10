var foodListApp = angular.module("foodListApp",[]);
foodListApp.controller("foodListAppCtrl",function($rootScope,$scope){
	
	$scope.getFoodInfoFunc = function(demo_input){
		var url = "http://apix.ruyi.ai/ruyi-xiaomi/getdata";
		if(!isproductDomain){
			url = "http://lab.ruyi.ai/ruyi-api/v1/xiaomi/getdata";
		}
		demo_input = {
			"id":Request.id
		};
		$.ajax({
			url : url,
			method : "get",
			data: demo_input,
			success: function(data) {
				data = JSON.parse(data);
				if(data.code == 0){
					var intents = data.result.intents;
					if(intents && intents.length > 0){
						var resultObj = intents[0].result;
						if(resultObj.code == 200 && resultObj.response.code == "success"){
							if(resultObj.response.data.recipes){
								$scope.foodObjects = resultObj.response.data.recipes;
							}else{
								$scope.foodObjects = resultObj.response.data;
							}
							$scope.$apply();
							setTimeout(function(){
								for(var i = 1;i <= $scope.foodObjects.length; i++){
									setFoodImgPositoinCommonFunc("[data-act=img-desc"+ i +"]",200,140);
								}
							}, 500);
						}
						$(".food-list-box").css("display","block");
					}
				}
			}
		});
	}
	$scope.getFoodInfoFunc(Request.q);
	$scope.userSay = Request.q;

	$("body").off("click","[data-act=shrink-icon]").on("click","[data-act=shrink-icon]",function(event){
		var $this = $(this);
		var $helpBox = $this.closest(".help-box");
		var helpBoxWidth = $helpBox.width();
		if(helpBoxWidth == 190){
			$(".user-say-example-box").hide();
			$helpBox.animate({width:"37px"},function(){
				$(".menu-list-box").css("transform","translateX(-95px)");
				$(".help-box [data-act=shrink-icon]").attr("class","shrink-icon-right");
				$helpBox.css("background-color","rgba(0,0,0,0)");
			});
		}else{
			$(".menu-list-box").css("transform","translateX(0)");
			$helpBox.animate({width:"190px"},function(){
				$(".user-say-example-box").show();
			});
			$(".help-box [data-act=shrink-icon]").attr("class","shrink-icon");
			$helpBox.css("background-color","#1e1e1e");
		}
	});
	
});












