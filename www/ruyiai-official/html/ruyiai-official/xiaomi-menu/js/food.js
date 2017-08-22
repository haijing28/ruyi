var foodApp = angular.module("foodApp",[]);
foodApp.filter('imageCheckFilter',
	function(){
	 return function(imageUrl) {
       var out = "";
	   if(imageUrl && imageUrl.length > 0){
    	   out = imageUrl;
       }else{
       	   out = "img/404.jpg";
       }
       return out;
   };
})
foodApp.controller("foodAppCtrl",function($rootScope,$scope){
	//如果图片过大，加载不出来图片，则暂时显示低清晰度的图片
	var showVagueImgFunc = function(){
		var updateImgSizeTimeout = setTimeout(function(){
			var $foodImgBox = $(".food-img-box img");
			if($foodImgBox.width() < 200 || $foodImgBox.height() < 200){
				$foodImgBox.attr("src",$scope.foodObject.img.s700);
				$foodImgBox.css({"width":"auto","height":"1080px"});
			}
		}, 100);
	}
	
	$scope.resultOperatoinFunc = function(data){
		if(data.code == 0){
			var intents = data.result.intents;
			if(intents && intents.length > 0){
				var resultObj = intents[0].result;
				if(resultObj.code == 200 && resultObj.response.code == "success"){
					$scope.foodObject = resultObj.response.data.recipe;
					$scope.foodObject.majorMinor = $.merge($scope.foodObject.major, $scope.foodObject.minor);
					$scope.$apply();
					clearInterval(getDataInterval);
					$(".food-box").css("display","block");
					$(".food-list-box").css("display","block");
					if(window.location.href.indexOf("#step") > -1 && window.location.href.indexOf("#step0") == -1){
						$(".food-box").css("opacity","0");
						$(".food-list-box").css("opacity","0");
						setTimeout(function(){
							window.location.href = window.location.href;
							$(".food-box").css("opacity","1");
							$(".food-list-box").css("opacity","1");
						}, 100);
					}
					
					var selectorImg = ".food-img-box img";
					var setIntervalPositoinFunc = setInterval(function(){
						if($(selectorImg).width() > 0){
							clearInterval(setIntervalPositoinFunc);
							setFoodImgPositoinCommonFunc(selectorImg,468,540);//设置图片位置
							showVagueImgFunc();//如果图片过大，加载不出来图片，则暂时显示低清晰度的图片
						}
					},100);
					setTimeout(function(){
						for(var i = 1;i <= $scope.foodObject.cookstep.length; i++){
							setFoodImgPositoinCommonFunc("[data-act=img-desc-food"+ i +"]",200,140);
						}
					}, 1000);
				}
			}
		}
	}
	
	$scope.getFoodInfoFunc = function(){
		var url = "http://apix.ruyi.ai/ruyi-xiaomi/getdata";
		if(!isproductDomain){
			url = "http://lab.ruyi.ai/ruyi-api/v1/xiaomi/getdata";
		}
		var demo_input = {
			"id":Request.id
		};
		$.ajax({
			url : url,
			data: demo_input,
			method : "get",
			success: function(data) {
				if(typeof data == 'string'){
					data = JSON.parse(data);
				}
				$scope.resultOperatoinFunc(data);
			}
		});
	}
	
	var getDataInterval = setInterval(function(){
		$scope.getFoodInfoFunc();
	}, 200);
	
	setTimeout(function(){
		clearInterval(getDataInterval);
	}, 3000);
	
	$scope.userSay = Request.q;
	
	$("body").off("focus","[data-act=step-skip]").on("focus","[data-act=step-skip]",function(event){
		var $this = $(this);
		var positionTop = $this.position().top;
		$("body").scrollTop(positionTop - 12);
	});
	
	var scrollIntervalFunc = setInterval(function(){
		if($("body").scrollTop() <= 540){
			$("body").scrollTop(0);
		}
	}, 100);
});





