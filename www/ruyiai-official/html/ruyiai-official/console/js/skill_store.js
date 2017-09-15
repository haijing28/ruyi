function referenceAppCtrl($rootScope,$scope, $state, $stateParams){
	$(".list-group-item").removeClass("active");
	$("[data-act=nav-robot-skill]").addClass("active");
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip(); //初始化提示
	}, 200);
	$('[data-toggle="popover"]').popover();

	$('body').on('click', '.top', function(e) {
		e = e || window.event;
		if(e.target.tagName == 'BUTTON') {
			return;
		}
		console.log(1)
		var i = window.location.href.lastIndexOf('/');
		var x = window.location.href.substr(0, i) + '/skill/1234';
		window.location.href = x;
	})
	
}

