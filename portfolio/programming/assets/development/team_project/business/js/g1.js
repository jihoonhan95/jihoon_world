var n = 0;
$("#carousel a").eq(n).children("img").attr("src","./img/g1_img/btn_banner_ov.png");

function count(){
    n++
    if(n<5){
        slidView(n);
    }else{
        n=0;
        slidView(n);
    }
}
var time = 2000;
var slideStart = setInterval("count()",time);
function slidView(n){
    $("#carousel a").children("img").attr("src","./img/g1_img/btn_banner.png");

    $("#carousel a").eq(n).children("img").attr("src","./img/g1_img/btn_banner_ov.png");

    $("#slideImg source").animate({"opacity":"0"},time-500);
    $("#slideImg source").eq(n).stop().addClass("topImg").css("opacity",0).animate({"opacity":"1"},time-500);
}
$("#container").hover(function(){
    clearInterval(slideStart);
},function(){
    slideStart = setInterval("count()", time);
});

$("#carousel a").click(function(){
    n = $(this).attr("data-i");
    slidView(n);
});