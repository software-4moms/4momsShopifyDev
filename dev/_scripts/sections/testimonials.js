import $ from 'jquery';
import Swiper from 'swiper';
import BaseSection from './base';

const selectors = {
  swiperContainer: '.swiper-container',
  swiperSlides: '.testimonial-container',
  swiperArrowLeft: '[data-swiper-arrow-prev]',
  swiperArrowRight: '[data-swiper-arrow-next]'
};

export default class Testimonials extends BaseSection {
  constructor(container) {
    super(container, 'customersOrder');
    this.swiperContainer = $(selectors.swiperContainer, this.$container);
    this.swiperSlides = $(selectors.swiperSlides, this.$container);

    if (this.swiperSlides.length > 1) {
      this.mySwiper = new Swiper(this.swiperContainer, {
        init: true,
        draggable: true,
        loop: true,
        slidesPerView: 1,
        watchOverflow: true,
        spaceBetween: 10,
        autoHeight: true,
        autoplay: {
          delay: 5000,
        },
        pagination: {
          el: $('.swiper-pagination', this.$container),
          type: 'bullets',
          clickable: true,
        },
        navigation: {
          prevEl: $(selectors.swiperArrowLeft, this.$container),
          nextEl: $(selectors.swiperArrowRight, this.$container),
        },
      });
    }

    this.swiperContainer.on('mouseenter', this.onStopAutoplay.bind(this));
    this.swiperContainer.on('mouseleave', this.onStartAutoplay.bind(this));
  }

  onStopAutoplay(e) {
    e.preventDefault();
    this.mySwiper.autoplay.stop();
  }

  onStartAutoplay(e) {
    e.preventDefault();
    this.mySwiper.autoplay.start();
  }
}
