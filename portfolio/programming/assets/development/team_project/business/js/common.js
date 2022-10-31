
/* 햄버거 버튼 변형 */
var burger = $('#m_btn');
burger.each(function(index){
	var $this = $(this);
	$this.on('click', function(e){
    e.preventDefault();
    $(this).toggleClass('active-' + (index+1));
	})
});


$(function(){
	$("#m_btn").click(function(){
		$("#gnb").fadeToggle();
	});
});

$(window).resize(function(){ 
	if (window.innerWidth <= 1024) { 
		$('#gnb').css("display","none");
	} else {
		$('#gnb').css("display","block");
	}
}).resize();