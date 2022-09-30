/* 팝업 스크립트 */
var timer = setInterval("slideAuto()", 1000);
function slideAuto(){
    $(".slide_box>div").animate({"margin-top":"-300px"},function(){
        $(".slide_box>div>div:nth-child(1)").appendTo(".slide_box>div");
        $(".slide_box>div").css("margin-top","0");
    });
}

$(document).ready(function(){
/* gnb 스크립트  */
    $(".menu>li").hover(function(){
        $(this).children('.sub_menu').stop().slideDown(800);
    },function(){
        $(this).children('.sub_menu').stop().slideUp(800);
    });

/* 슬라이드 멈춤/재개 */
   $(".slide_box").hover(function(){
      clearInterval(timer);
   },function(){
      timer = setInterval(slideAuto(), 1000);
   });
});

function Func(){
   $(".popup").show(400);    
    $(".close_btn").click(function(){
        $(".popup").hide();
    });
}