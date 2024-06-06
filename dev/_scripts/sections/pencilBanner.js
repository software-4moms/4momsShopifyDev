import $ from 'jquery'; // eslint-disable-line no-unused-vars
import Swiper from 'swiper';
import BaseSection from './base';


const selectors = {
  swiperContainer: '.swiper-container',
  carouselSpeed: '[data-carousel-speed]',
  bannerSlide: '.banner-slide',
  swiperArrowLeft: '[data-pencil-banner-arrow-prev]',
  swiperArrowRight: '[data-pencil-banner-arrow-next]',
  pencilBannerArrows: '[data-pencil-banner-arrow]'

};

export default class PencilBannerSection extends BaseSection {
  constructor(container) {
    super(container, 'pencilBanner');
    this.swiperContainer = $(selectors.swiperContainer, this.$container);
    this.bannerSlide = $(selectors.bannerSlide, this.$container);

    const carouselSpeed = $(selectors.carouselSpeed, this.$container).data('carousel-speed') * 1000;

    if (this.bannerSlide.length > 1) {
      this.mySwiper = new Swiper(this.swiperContainer, {
        speed: 500,
        loop: true,
        autoplay: {
          delay: carouselSpeed,
        },
        navigation: {
          prevEl: $(selectors.swiperArrowLeft, this.$container),
          nextEl: $(selectors.swiperArrowRight, this.$container),
        },
      });
      $(selectors.pencilBannerArrows).addClass('showArrows');
    }
  }
}


