$(function() {
    /**控制banner**/
    var mySwiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplay: 5000,
        speed: 1000,
        autoplayDisableOnInteraction: false,
        autoHeight: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        loop: true,
        onSlideNextStart: function(swiper) {
            $('.swiper-slide:not(.swiper-slide-active)').find(".robot-text").removeClass('animated fadeInRight').hide();
        },
        onSlideChangeEnd: function(swiper){
            $(".swiper-slide-active").find(".robot-text").addClass('animated fadeInRight').show();
        },
        onSlidePrevStart: function(swiper) {
            $('.swiper-slide:not(.swiper-slide-active)').find(".robot-text").removeClass('animated fadeInRight').hide();
        }
    });
    $("#drop3").css("margin-top","-6px");

    $('.swiper-slide').on("mouseover",function(){
        $(mySwiper).each(function(index,ele){
            ele.stopAutoplay();
        })
    })
    $('.swiper-slide').on("mouseout",function(){
        $(mySwiper).each(function(index,ele){
            ele.startAutoplay();
        })
    })
    // $('.swiper-container').hover({function(){
    //         swiper.stopAutoplay();
    //     },function(){
    //         swiper.startAutoplay();
    //     }
    // })

    /** 生产机器人 **/
    $(".make-robot").on("click", function() {
        if(window.innerWidth >= 768){
            if(window.innerWidth == 768){
                $(".make-robot-qrcode").hide();
                $(".make-robot-mobile").show();
            }else if(window.innerWidth > 768){
                $(".make-robot-mobile").hide();
                $(".make-robot-qrcode").show();
            }
            $(".dark-background").fadeIn(200);
        }else{
            window.open("official/qrcode-ruyi-mobile.html","_self");
        }
        $(".recruit-area").hide();
    })

    $(".dark-background").on("click",function(){
        $(this).fadeOut(200);
    })

    $(".icon-ruyiaiclose2").on("click",function(){
    	$(".dark-background").fadeOut(200);
    })

    $(".make-robot-qrcode").on("click",function(event){
        event.stopPropagation();
    })

    /** 控制新闻字数 **/
    $(".news-text").each(function(index,ele){
        if(window.innerWidth == 768 && $(ele).find("a").text().length > 20){
            $(ele).find("a").text($(ele).find("a").text().slice(0,19) + "...");
        }else if(window.innerWidth > 768 && $(ele).find("a").text().length > 30){
            $(ele).find("a").text($(ele).find("a").text().slice(0,25) + "...");
        }
    })

    /** 返回上一页 **/
    $("#back").on("click",function(){
        console.log(1);
        window.open("../index.html","_self");
    })

    /** 招聘 **/
    $(".recruit").on("click",function(){
        window.location.href = './recruit.html';
    })

    $('.myHome').on('click',function () {
        window.location.href = './index.html';
    })

})
