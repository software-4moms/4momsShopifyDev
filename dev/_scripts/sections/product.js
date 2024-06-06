import $ from 'jquery';
import { throttle } from 'throttle-debounce';
import { getBreakpointMinWidth } from '../core/breakpoints';
import BaseSection from './base';
import ProductDetail from '../view/product/productDetail';

const selectors = {
  productDetail: '[data-product-detail]',
  stickyBar: '[data-product-sticky-bar]',
  stickyBarFormSlot: '[data-product-sticky-bar-form-slot]',
  addToCartForm: '[data-add-to-cart-form]',
  addToCartFormWrapper: '[data-add-to-cart-form-wrapper]',
  reviewsStickySlow: '[data-review-sticky-slot]',
  formReviewsContainer: '[data-review-stars-form]',
  reviewStars: '[data-review-stars]'
};

const classes = {
  stickyBarVisible: 'is-visible',
}

const $window   = $(window);

export default class ProductSection extends BaseSection {
  constructor(container) {
    super(container, 'product');

    this.stickyFormEnabled = this.$container.data('sticky-form-enabled') || false;
    this.formIsSticky = false;
    this.stickyFormMinBreakpoint = getBreakpointMinWidth('md');
    this.isBelowStickyFormMinBreakpoint = false;

    this.$addToCartFormWrapper = $(selectors.addToCartFormWrapper, this.$container);
    this.$addToCartForm = $(selectors.addToCartForm, this.$container);

    this.productDetail = new ProductDetail($(selectors.productDetail, this.$container));

    this.$reviewStars = $(selectors.reviewStars, this.$container);
    this.$reviewsStickySlow = $(selectors.reviewsStickySlow, this.$container);
    this.$formReviewsContainer = $(selectors.formReviewsContainer, this.$container);

    if(this.stickyFormEnabled) {

      this.$stickyBar = $(selectors.stickyBar, this.$container);
      this.$stickyBarFormSlot = $(selectors.stickyBarFormSlot, this.$container);

      $window.on('scroll', throttle(50, this.onScroll.bind(this)));
      $window.on('resize', throttle(100, this.onResize.bind(this)));

      // hit these one time on init to make sure everything is good
      this.onScroll();
      this.onResize();
    }
  }

  stickAddToCartForm() {
    if(!this.stickyFormEnabled) return;

    if(this.formIsSticky === false) {

      this.$addToCartFormWrapper.css('height', this.$addToCartForm.outerHeight());
      this.$addToCartForm.fadeOut(50, function(){
        this.$addToCartForm.detach().appendTo(this.$stickyBarFormSlot);
        this.$reviewStars.detach().appendTo(this.$reviewsStickySlow);
        this.$stickyBar.addClass(classes.stickyBarVisible);
        this.$addToCartForm.fadeIn(150);
      }.bind(this));
      this.formIsSticky = true;
    }
  }

  /**
   * Removes the product form from the header product bar and hides the bar.
   *
   */
  unstickAddToCartForm() {
    if(!this.stickyFormEnabled) return;

    if(this.formIsSticky === true) {
      // Un stick it
      this.$stickyBar.removeClass(classes.stickyBarVisible);
      this.$addToCartForm.fadeOut(50, function(){
        this.$addToCartForm.detach().appendTo(this.$addToCartFormWrapper);
        this.$reviewStars.detach().appendTo(this.$formReviewsContainer);
        this.$addToCartFormWrapper.css('height', '');
        this.$addToCartForm.fadeIn(150);
      }.bind(this));
      this.formIsSticky = false;
    }
  }

  /**
   * Checks the window size and scroll position to determine if the product form should be stuck or unstuck from the header
   *
   */
  stickyAddToCartFormCheck() {
    if(this.isAboveStickyFormMinBreakpoint) {
      if ($window.scrollTop() > this.$addToCartFormWrapper.offset().top){
        this.stickAddToCartForm();
      }else {
        this.unstickAddToCartForm();
      }
    }
    else {
      this.unstickAddToCartForm();
    }
  }

  onScroll(e) {
    this.stickyAddToCartFormCheck();
  }

  onResize() {
    this.isAboveStickyFormMinBreakpoint = ( $window.width() >= this.stickyFormMinBreakpoint );
    this.stickyAddToCartFormCheck();
  }
}



// Get a reference to the element that you want to work with
var preLovePdpCallout = document.querySelector("#pre-love-pdpCallout");
if (preLovePdpCallout) {
preLovePdpCallout.addEventListener('mouseover', changeDefOver);
preLovePdpCallout.addEventListener('mouseout', changeDefOut);
}
function changeDefOver() {
  document.getElementById("rebelHoverBox").classList.add('hoverr');
};

function changeDefOut() {
  document.getElementById("rebelHoverBox").classList.remove('hoverr');
};
