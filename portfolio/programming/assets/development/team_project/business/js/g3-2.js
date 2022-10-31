$(window).load(function(){
  $('.loader').delay('2000').fadeOut();
});

setTimeout('move_page()', 2000); //2초후에 move_page함수실행

function move_page(){
location.href="g3-3.html"  // 페이지 이동
}


