import $ from 'jquery';
import { throttle } from 'throttle-debounce';
import BaseSection from './base';

const $window = $(window);
const $body   = $(document.body);

const selectors = {
  header: '[data-header]',
  menuItem: '[data-menu-item]',
  subMenu: '[data-submenu]',
  subMenuItem: '[data-submenu-item]',
  promoItem: '[data-promo-id]',
  inlineMenu: '[data-inline-menu]',
  mobileMenu: '[data-mobile-menu]',
  collectionFilters: '[data-collection-menu]'
};

const classes = {
  show: 'show',
  isActive: 'active',
  headerFixed: 'is-fixed',
  siteHasFixedHeader: 'site-fixed-header'
};

export default class HeaderSection extends BaseSection {
  constructor(container) {
    super(container, 'header');

    this.$el = $(selectors.header, this.$container);
    this.$menuItem = $(selectors.menuItem, this.$container);
    this.$subMenuItem = $(selectors.subMenuItem, this.$container);
    this.$subMenu = $(selectors.subMenu, this.$container);
    this.$inlineMenu = $(selectors.inlineMenu, this.$container);

    if ($body.hasClass(classes.siteHasFixedHeader)) {
      $window.on(this.events.SCROLL, throttle(20, this.onScroll.bind(this)));
      this.onScroll(); // hit this one time on init to make sure everything is good
    }

    // Display the correct dropdown for the menu item
    this.$menuItem.on('mouseenter', this.onHoverMenuItem.bind(this));

    // Display the correct promo for the submenu item
    this.$subMenuItem.on('mouseenter', this.onHoverSubMenuItem.bind(this));

    // Hide elements when the mouse leaves the menu
    this.$el.on('mouseleave', this.onMenuLeave.bind(this));
  }

  scrollCheck() {
    // Do measurements outside of rAF.
    const scrollTop = $window.scrollTop();
    const actualOffset = this.$container.offset().top - this.$el.outerHeight();

    // Do DOM updates inside.
    requestAnimationFrame(() => {
      if (scrollTop < actualOffset) {
        this.$el.removeClass(classes.headerFixed);
        this.setDrawersPosition();
      }
      else {
        this.$el.addClass(classes.headerFixed);
        this.setDrawersPosition();
      }
    });

  }

  setDrawersPosition() {
    const $mobileMenu = $(selectors.mobileMenu);
    const $collectionFilters = $(selectors.collectionFilters);
    const headerBottom = this.$el.outerHeight() + (this.$el.offset().top - $(window).scrollTop());
    $mobileMenu.css('top', headerBottom).css('height', `calc(100vh - ${headerBottom}px`);
    $collectionFilters.css('top', headerBottom).css('height', `calc(100vh - ${headerBottom}px`);
  }

  onScroll() {
    this.scrollCheck();
  }

  onHoverMenuItem(e) {
    const $target = $(e.currentTarget);
    const dataSelector = $target.data('menu-item');

    $(selectors.subMenu).removeClass(classes.show);
    $(selectors.inlineMenu).removeClass(classes.show);
    $('[data-submenu="'+ dataSelector + '"]').addClass(classes.show);
  }

  onHoverSubMenuItem(e) {
    const $target = $(e.currentTarget);
    const dataSelector = $target.data('submenu-item');

    $(selectors.subMenuItem).removeClass(classes.isActive);
    $target.addClass(classes.isActive);

    $(selectors.promoItem).removeClass(classes.show);
    $('[data-promo-id="'+ dataSelector + '"]').addClass(classes.show);
  }

  onMenuLeave(e) {
    this.$subMenu.removeClass(classes.show);
    this.$inlineMenu.removeClass(classes.show);
  }

}


function logKey(e) {
    //console.log(e);
    if (e.key === 'Escape') {
      document.querySelector('.menu-blocks__block').classList.remove('show');
    };
};
document.addEventListener('keydown', logKey);
