$( document ).ready(function() {
  //adds empty alt attribute just in case any images don't have an alt attribute at all
  $('img').each(function() {
    if ( ! $(this).attr('alt') ) {
      $(this).attr('alt', '');
    }
  });
  
  //menu stuff
  $('.main-menu .menu-items-container > .menu-item-wrapper:first-child > p > a').on('click', function(e){
    e.preventDefault();
    $(this).toggleClass("active");
    $(this).parent().next().toggleClass("active");
  });
  $('.main-menu .menu-items-container > .menu-item-wrapper:first-child > p > a').on('keypress', function(e){
    var keycode = (e.keyCode ? e.keyCode : e.which);
  	if(keycode == '13'){
    	$(this).addClass("active");
      	$(this).parent().next().addClass("active");
    }
  });
  $(document).on('keydown', function(e){
    var keycode = (e.keyCode ? e.keyCode : e.which);
  	if(keycode == '27'){
      //close mobile menu
      $('.main-menu .menu-items-container > .menu-item-wrapper:first-child > p > a').removeClass("active");
      $('.main-menu .menu-items-container > .menu-item-wrapper:first-child > .menu-blocks__block').removeClass("active");
      //close search modal
      $('.header .search-overlay').removeClass("is-visible");
      $('.ajax-cart-container').removeClass("is-open");
      $('.ajax-cart-backdrop').removeClass("is-visible");
    }
  });
  
  //Swiper
  var mySwiper = document.querySelector('.swiper-container').swiper
  
  mySwiper.autoplay.stop();
  
  $(".swiper-container").mouseenter(function() {
    mySwiper.autoplay.stop();
  });

  $(".swiper-container").mouseleave(function() {
    mySwiper.autoplay.start();
  });
  $(".swiper-container").focusin(function() {
    $(this).addClass('focused');
    mySwiper.autoplay.stop();
  });
  $(".swiper-container").focusout(function() {
    $(this).removeClass('focused');
    mySwiper.autoplay.start();
  });
  
  $(".swiper-slide-duplicate, .swiper-slide-duplicate-active, .swiper-slide-duplicate-next").each(function() {
    $(this).attr('aria-hidden', 'true');
    $(this).attr('tabindex', '-1');
  });
  
  $(".swiper-slide-duplicate a, .swiper-slide-duplicate-active a, .swiper-slide-duplicate-next a").each(function() {
    $(this).attr('aria-hidden', 'true');
    $(this).attr('tabindex', '-1');
  });
  
  
  
	//$('.dots .dot').on('keypress', function(e) {
      	//var variantname = $(this).data('variant-option-value');
    	//if(e.which == 13 && !$(this).hasClass('is-active') ) {
    		//$('.dots .dot').removeClass('is-active');
          	//$(this).addClass('is-active');
          	//$('.option-name-span').html(variantname);
    	//}
	//});
});