$(function(){
	//设置关闭图标的关闭动作
	$("body").off("click",".close-modal,.cancel-modal").on("click",".close-modal,.cancel-modal",function(event){
		var $this = $(this);
		$this.closest(".modal").modal("hide");
	});
	
	$(".nav li").click(function(){
		var $this = $(this);
		$this.addClass("active").siblings().removeClass("active");
	});
	$(".starter-template").click(function(){
		$("#navbar").animate({height:"1px"},400,function(){
			$("#navbar").attr("aria-expanded","false").removeClass("in");
		});
		$(".navbar-header button").addClass("collapsed").attr("aria-expanded","false");
	});
	$(".navbar-nav").on('touchend',function(e){
		$("#navbar").animate({height:"1px"},400,function(){
			$("#navbar").attr("aria-expanded","false").removeClass("in");
		});
		$(".navbar-header button").addClass("collapsed").attr("aria-expanded","false");
	});
});