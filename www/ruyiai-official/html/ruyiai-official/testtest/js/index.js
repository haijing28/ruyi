$(function(){
	 $('#index-carousel').carousel({
		  interval: 5000,
		  pause:false
	 });
	 
	 var setCarouselFunc = function(){
		 $("#index-carousel .carousel-inner .item").css("height",$(window).height()-118);
	 }
	 setCarouselFunc();
	 $(window).resize(function(){
		 setCarouselFunc();
	 });
	 $(".nav li a").click(function(){
			var $this = $(this);
			$this.addClass("active").parents().siblings().children("a").removeClass("active");
		});
});