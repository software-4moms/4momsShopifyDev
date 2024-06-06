import $ from 'jquery'; // eslint-disable-line no-unused-vars
import Swiper from 'swiper';
import BaseSection from './base';

const selectors = {
  swiperContainer: '.swiper-container'
};

export default class AwardBadges extends BaseSection {
  constructor(container) {
    super(container, 'AwardBadges');
    this.swiperContainer = $(selectors.swiperContainer, this.$container);

    this.mySwiper = new Swiper(this.swiperContainer, {
      init: true,
      draggable: true,
      slidesPerView: 6,
      spaceBetween: 50,
      watchOverflow: true,
      breakpoints: {
        992: {
          slidesPerView: 3.6,
          spaceBetween: 35
        }
      }
    });
  }
}
