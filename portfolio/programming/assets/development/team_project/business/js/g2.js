

$(document).ready(function(){
  // FAQ 영역
    $('.question > a').click(function(){
        if ( $(this).parent().hasClass('active') ){
          $(this).parent().removeClass('active');
          $(this).next().slideUp();
        }else {
          $('.question').removeClass('active');
          $('.answer').slideUp();
          $(this).parent().addClass('active');
          $(this).next().slideDown();
        }
        return false;
    });

    //제품 슬라이드 영역
    $('.carousel a').click(function(){
      var idx = $(this).index();
      console.log(idx);

      $('.carousel a').removeClass('active');
      $(this).addClass('active');

      $('.product>.inner>ul>li').removeClass('active');
      $('.product>.inner>ul>li').eq(idx).addClass('active');

      $('.character .detail').removeClass('active');
      $('.character .detail').eq(idx).addClass('active');

      $('.faq').removeClass('active');
      $('.faq').eq(idx).addClass('active');
      
      return false;
    });

    $('.product .button').click(function(){
		var current = $('.product>.inner>ul>li.active').index();
		if ($(this).hasClass('prev-button')){
			if ( current != 0 ){
				$('.carousel a').eq(current-1).trigger('click');
			}
		}else {
			$('.carousel a').eq(current+1).trigger('click');
		}
		return false;
	});

    
 });

