import $ from 'jquery';
import Swiper from 'swiper';
import BaseSection from './base';
import VideoPlayer from '../ui/videoPlayer';

const selectors = {
  slideshow: '[data-slideshow]',
  slideshowSlide: '[data-slideshow-slide]',
  slideshowNav: '[data-product-features-nav]',
  slideshowNavBtn: '[data-slide-nav-btn]',
  videoPlayer: '[data-video-player]',
  activeSlide: '.swiper-slide-active',
  slideContentContainer: '[data-slide-content-container]',
  productFeaturesContainer: '[data-product-features-container]'
};

const classes = {
  active: 'is-active',
  navigationLight: 'product-feature__nav-light',
  slideContentTextLight: 'product-feature__content-light'
};

/**
 * Product features section constructor
 *
 * @param { Object } container
 */

export default class ProductFeatures extends BaseSection {
  constructor(container) {
    super(container, 'product-features');

    this.$slideshow = $(selectors.slideshow, this.$container);

    const swiperOptions = {
      loop: true,
      centeredSlides: true,
      autoplay: true,
      stopOnLastSlide: true,
      slidesPerView: 1,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      on: {
        init: this.onInit.bind(this),
        transitionStart: this.onAutoSlideChange.bind(this)
      }
    };

    // initialize swiper carousel
    this.swiper = new Swiper(this.$slideshow, swiperOptions);

    // Initialize all video players in slideshow
    this.videoPlayers = [];
    this.$container.find(selectors.videoPlayer).each((i, el) => {
      this.videoPlayers.push(new VideoPlayer(el));
    });

    // Add event handlers
    $(selectors.slideshowNavBtn, this.$container).on(
      'click',
      this.onSelectSwiperSlide.bind(this)
    );
    $(selectors.productFeaturesContainer).hover(this.onPauseHover.bind(this), this.onPlayHoverOut.bind(this));
  }

  _updateSlideUI($slide) {
    const isDark = $($slide).data().navDark;

    if (isDark === false) {
      $($slide).find(selectors.slideContentContainer).addClass(classes.slideContentTextLight);
    } else if (isDark === true && $(selectors.slideContentContainer, $slide).hasClass(classes.slideContentTextLight)) {
      $(selectors.slideContentContainer, $slide).removeClass(classes.slideContentTextLight);
    }
  }

  _updateNavUI($slide) {
    // remove is-active class from all swiper navigation items
    $(selectors.slideshowNavBtn, this.container).removeClass(classes.active);

    // add parent modifier class to set navigation color to light or dark
    const $slideshowNav = $(selectors.slideshowNav, this.container);

    if ($($slide).data().navDark === false) {
      $slideshowNav.addClass(classes.navigationLight);
    } else {
      $slideshowNav.removeClass(classes.navigationLight);
    }

    // add is-active class to the nav item associated with the currently active slide
    $(`[data-slide-number=${$($slide).data().swiperSlideIndex}]`, this.container).addClass(classes.active);
  }

  onInit() {
    const $firstSlide = $(selectors.slideshowSlide, this.container)[1];
    this._updateSlideUI($firstSlide);
    this._updateNavUI($firstSlide);
  }

  onAutoSlideChange() {
    const $currentSlide = $(selectors.activeSlide, this.container);
    this._updateSlideUI($currentSlide);
    this._updateNavUI($currentSlide);
  }

  onPauseHover() {
    this.swiper.autoplay.stop();
  }

  onPlayHoverOut() {
    this.swiper.autoplay.start();
  }

  onSelectSwiperSlide(e) {
    e.preventDefault();

    const targetSlide =
      $(e.target)
        .closest(selectors.slideshowNavBtn)
        .data().slideNumber + 1;
    this.swiper.slideTo(targetSlide, 1000, 0);
    this.swiper.autoplay.start();
  }
}
