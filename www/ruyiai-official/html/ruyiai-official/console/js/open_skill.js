function openSkillCtrl($rootScope,$scope, $state, $stateParams){
	$("[data-act=open_skill]").addClass("active").siblings("li").removeClass("active");

	var getSkillCards = function() {
		$.ajax({
			url: api_host_v2beta + 'skills',
			type: 'get',
			headers: {"Authorization" : "Bearer " + getCookie('accessToken')},
			data: {
				range: 'public'
			},
			success: function(ret) {
				
			},
			error: function() {
				// goIndex();
			}
		})
	}
	getSkillCards();

}

