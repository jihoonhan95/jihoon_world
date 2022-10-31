$(document).ready(function(){
      $('.menu>a').click(function(){
          if ( $(this).parent().hasClass('active') ){
            $(this).parent().removeClass('active');
            $(this).next().slideUp();
          }else {
            $('.menu').removeClass('active');
            $('.hide').slideUp();
            $(this).parent().addClass('active');
            $(this).next().slideDown();
          }
          return false;
      });
});
