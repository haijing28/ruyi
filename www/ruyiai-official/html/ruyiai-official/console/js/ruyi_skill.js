function ruyiSkillCtrl($rootScope,$scope, $state, $stateParams){
	$("[data-act=ruyi_skill]").addClass("active").siblings("li").removeClass("active");
	$('.my_button').click(function(){
		console.log(1)
		var i = window.location.href.lastIndexOf('/');
		var x = window.location.href.substr(0, i) + '/skill/1234';
		window.location.href = x;
	})
}

