import $ from 'jquery';
import Swiper from 'swiper';
import BaseSection from './base';

const selectors = {
  slideshow: '[data-slideshow]',
  slideshowNavBtn: '[data-slide-nav-btn]'
};

const classes = {
  active: 'is-active'
};

/**
 * Product movement section constructor
 *
 * @param { Object } config
 */

export default class ProductMovements extends BaseSection {
  constructor(container) {
    super(container, 'product-movement');

    this.$slideshow = $(selectors.slideshow, this.$container);

    const swiperOptions = {
      loop: true,
      autoHeight: true,
      centeredSlides: true,
      slidesPerView: 1,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      breakpoints: {
        768: {}
      }
    };

    this.swiper = new Swiper(this.$slideshow, swiperOptions);

    $(selectors.slideshowNavBtn, this.$container).on(
      'click',
      this.onSelectSwiperSlide.bind(this)
    );
  }

  onSelectSwiperSlide(e) {
    e.preventDefault();

    // Remove all active classes from nav buttons
    $(selectors.slideshowNavBtn, this.container).removeClass(classes.active);

    // Add active class to clicked button
    $(e.target)
      .closest(selectors.slideshowNavBtn)
      .addClass(classes.active);

    // navigate to selected slide
    const targetSlide =
      $(e.target)
        .closest(selectors.slideshowNavBtn)
        .data().slideNumber + 1;
    this.swiper.slideTo(targetSlide, 1000, 0);
  }
}
