var slideIndex = 0;
function slideAuto(){
    $(".backimg>li").removeClass("topImg");
    // .backimg 안에 잇는 모든 li에 접든 한 후 거이에 topImg클래스가 있다면 지워 버려라!
    slideIndex++;
    var isIdx = slideIndex % 3;
    $(".backimg>li").eq(isIdx).addClass("topImg");
}
// var slideCall = setInterval("slideAuto()",1500);

$(".headerWrap").hover(function(){
    clearInterval(slideCall);
},function(){
    slideCall = setInterval("slideAuto()",1500);
});

$(function(){
    $("#gnb>li").hover(function(){
        $(this).children(".sub").stop().fadeIn(1000); // == .slideDown
    },function(){
        $(this).children(".sub").stop().fadeOut(); // == .slideUp
    });
});

$(function(){
    $("#menu").click(function(){
        $(this).toggleClass("aniMenu");
        $("#gnb").fadeToggle(100);
    });
});



