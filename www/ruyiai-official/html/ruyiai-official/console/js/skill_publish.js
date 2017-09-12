function skillPublishCtrl($rootScope, $scope, $state, $stateParams) {

	// 全局属性
	$scope.imgSrc = 'http://img95.699pic.com/photo/50004/2199.jpg_wh300.jpg';
	$scope.robotName = '';
	$scope.awakes = [];
	$scope.wrongs = [];
	$scope.robotDesc = '';
	$scope.skillTypes = [1, 2, 3, 4, 5]
	$scope.selectedType = '请选择'
	$scope.userSays = [];
	$scope.selfDesc = '';
	$scope.skillDesc = '';
	$scope.plateforms = {sbc: false, xm: false, bd: false, rk: false}

	$(".list-group-item").removeClass("active");
	$("[data-act=nav-skill-publish]").addClass("active");
	// select 技能分类
	$('.mySel').on('click', 'li', function() {
		var text = $(this).text();
		$('.mySel button').html(text + '<span class="glyphicon glyphicon-chevron-down myIcon"></span>');
	})
	// select 技能分类 -- end
	// 上传图片
	$('.skill-img').click(function() {
		$('.hide_input_img_upload').click();
	})
	$('.hide_input_img_upload').change(function() {
		var reader = new FileReader();
		var img  = $('.hide_input_img_upload')[0].files[0];
		reader.onload = function(ret) {
			$('.skill-img').attr('src', ret.target.result);
		}
		reader.readAsDataURL(img);
	})
	// 上传图片 -- end
	// copy 机器人
	$('.skill_settings').on('click', 'span', function() {
		$scope.imgSrc = $rootScope.currentRobot.headUrl;
		$scope.robotName = $rootScope.currentRobot.appName;
		$scope.robotDesc = $rootScope.currentRobot.appDesc;
		$scope.awakes = $rootScope.currentRobot.attribute.alias.split(';');
		$scope.wrongs = $rootScope.currentRobot.attribute.voiceToCorrect.split(';');
		$scope.userSays = $rootScope.currentRobot.attribute.hobby.split(';');
		try{
			$scope.awakes.splice(5, 1000);
			$scope.wrongs.splice(5, 1000);
			$scope.userSays.splice(5, 1000);
		}catch(e){}
		$scope.$apply();
	})
	// copy 机器人 -- end
	// 添加新项
	$('.addCorect').click(function() {
		var tp = $(this).attr('repeat-type');
		if($scope[tp].length < 5) {
			$scope[tp].push('');
		}
		$scope.$apply();
	})
	// 添加新项 -- end
	
}




