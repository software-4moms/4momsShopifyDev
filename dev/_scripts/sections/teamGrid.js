import $ from 'jquery';
import Swiper from 'swiper';
import BaseSection from './base';

const selectors = {
  swiperContainer: '.swiper-container',
  swiperSlides: '.team-card'
};

const swiperSettings = {
  init: true,
  draggable: true,
  slidesPerView: 3,
  watchOverflow: true,
  centeredSlides: false,
  updateOnWindowResize: true,
  breakpoints: {
    991: {
      loop: true,
      slidesPerView: 1.7,
      centeredSlides: true
    }
  }
}

export default class IconGrid extends BaseSection {
  constructor(container) {
    super(container, 'teamGrid');
    this.swiperContainer = $(selectors.swiperContainer, this.$container);
    this.swiperSlides = $(selectors.swiperSlides, this.$container);

    if (this.swiperSlides.length > 1 && $(window).width() < 768 ) {
      this.mySwiper = new Swiper(this.swiperContainer, swiperSettings);
      $(window).on('breakpointChange', this.onResize.bind(this));
    }
    
  }


  onResize(e) {
    e.preventDefault();
    this.mySwiper.destroy();
    this.mySwiper = new Swiper(this.swiperContainer, swiperSettings);
  }
}
