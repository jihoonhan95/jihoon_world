
$(document).ready(function(){
    setInterval(() => {
    $(".slideWrap").animate({"margin-left":"-600px"},function(){
        $(".slideWrap>li:first-child").appendTo(".slideWrap");
        $(".slideWrap").css("margin-left","0");
    });
    }, 3000);
});