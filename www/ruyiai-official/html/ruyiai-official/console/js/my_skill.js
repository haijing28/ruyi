function mySkillCtrl($rootScope,$scope, $state, $stateParams){
	$("[data-act=my_skill]").addClass("active").siblings("li").removeClass("active");

	$('body').on('click', '.my_down_web', function() {
		$.confirm({
		        "text": '<div class="my_own_down_div"><label class="down_web_label">是否确认下线该技能？</label>' + '<br>' + '<span class="down_web_span">下线技能后需要重新提交技能进行审核哦！</span></div>',
		        "title": " ",
		        "ensureFn": function() {
		        	}
		})
	})

	var getSkillCards = function() {
		$.ajax({
			url: api_host_v2beta + 'skills',
			type: 'get',
			headers: {"Authorization" : "Bearer " + getCookie('accessToken')},
			success: function(ret) {
				console.log(ret);

			},
			error: function() {
				// goIndex();
			}
		})
	}
	getSkillCards();
}

