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
	$scope.skillDesc = '';
	$scope.plateforms = {sbc: false, xm: false, bd: false, rk: false};

	/*-------------------------------初始化--------------------------------*/

	// $.ajax({
	// 	url: api_host + '/skills/' + $rootScope.currentRobot.id,
	// 	type: 'get',
	// 	success: function(ret) {
	// 		console.log(ret)
	// 		$scope.imgSrc = ret.logo;
	// 		$scope.robotName = ret.name;
	// 		$scope.awakes = ret.nickNameVoiceVariants;

	// 		$scope.robotDesc = ret.descriptionForAudit;
	// 		$scope.userSays = ret.userInputExamples;
	// 		$scope.selfDesc = ret.developerIntroduction;
	// 		$scope.skillDesc = ret.description;
			
			
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
		if( $scope.headUrl == '' ) {
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
		}
	})

	/*-------------------------------点击模态框确定--------------------------------*/

	$('.iKown').click(function() {
		$('#uploadSuccess').modal('hide');
	})
	
}


