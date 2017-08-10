$(document).ready(
	$(".customize-radio").change(function(){
		$("#" + $(this).attr("id") + "-detail").show().siblings().hide();
	})

);