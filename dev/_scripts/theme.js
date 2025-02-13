// jQuery
import $ from 'jquery';
import 'jquery-zoom';
import 'chosen-js';
import 'jquery-unveil';
import 'objectFitPolyfill';
import 'lazysizes';

// Bootstrap JS
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/modal';

// Core
import './core/iePolyfill'; // Fixes `currency.js` issue which blocks all subsequent JS in IE11
import * as Utils from './core/utils';
import * as RTE from './core/rte';
import * as A11Y from './core/a11y';
import * as Animations from './core/animations';
import * as Breakpoints from './core/breakpoints';
import './core/imedia';



// UI - Import all to enable data API
import './ui/drawer';
import './ui/overlay';
import './ui/slideup';
import './ui/tabs';
import './ui/quantityAdjuster';

// Sections
import SectionManager                from './sections/sectionManager';
import HeaderSection                 from './sections/header';
import FooterSection                 from './sections/footer';
import MobileMenuSection             from './sections/mobileMenu';
import ProductSection                from './sections/product';
import CartSection                   from './sections/cart';
import AJAXCartSection               from './sections/ajaxCart';
import PencilBannerSection           from './sections/pencilBanner';
import CollectionSection             from './sections/collection';
import BlogSection                   from './sections/blog';
import ArticleSection                from './sections/article';
// import InstagramFeedSection          from './sections/instagramFeed';
import NewsletterModalSection        from './sections/newsletterModal';
import NewsletterSlideupSection      from './sections/newsletterSlideup';
import SlideshowSection              from './sections/slideshow';
import SwatchesSection               from './sections/swatches';
import VideoSection                  from './sections/video';
import CMSPageSection                from './sections/cmsPage';
import CustomersLoginSection         from './sections/customersLogin';
import CustomersAccountSection       from './sections/customersAccount';
import CustomersAccountOrdersSection from './sections/customersAccountOrders';
import CustomersAddressesSection     from './sections/customersAddresses';
import CustomersOrderSection         from './sections/customersOrder';
import ICSRecall                     from './sections/icsRecallFlow';
import Testimonials                  from './sections/testimonials';
import AwardBadges                   from './sections/awardBadges';
import IconGrid                      from './sections/iconGrid';
import TeamGrid                      from './sections/teamGrid';
import ProductFeatures               from './sections/productFeatures';
import ProductMovement               from './sections/productMovement';
import FiftyFiftyContent             from './sections/fiftyFifty';
import CollectionMenu                from './sections/collectionMenu';
import ModalVideoPlayer              from './sections/modalVideoPlayer';
import CountryModal                  from './sections/countryModal';
import ProductRegistration           from './sections/productRegistration';
import ContactForm                   from './sections/contactForm';
import JobsListing                   from './sections/jobsListing';
import CanadaPopUp                   from './sections/canadaPopUp';



// Managers
import QuickViewManager from './managers/quickView';

// Models
import ProductCard from './view/product/productCard';

// Templates
import './templates/pageStyles';
import './templates/pageComponents';

// Do this ASAP
Animations.initialize();
Breakpoints.initialize();

(Modernizr => {
  const $document = $(document);
  const $body = $(document.body);

  const sectionManager = new SectionManager();

  sectionManager.register('header', HeaderSection);
  sectionManager.register('footer', FooterSection);
  sectionManager.register('mobile-menu', MobileMenuSection);
  sectionManager.register('product', ProductSection);
  sectionManager.register('cart', CartSection);
  sectionManager.register('ajax-cart', AJAXCartSection);
  sectionManager.register('pencil-banner', PencilBannerSection);
  sectionManager.register('collection', CollectionSection);
  sectionManager.register('blog', BlogSection);
  sectionManager.register('article', ArticleSection);
  // sectionManager.register('instagram-feed', InstagramFeedSection);
  sectionManager.register('newsletter-modal', NewsletterModalSection);
  sectionManager.register('newsletter-slideup', NewsletterSlideupSection);
  sectionManager.register('slideshow', SlideshowSection);
  sectionManager.register('swatches', SwatchesSection);
  sectionManager.register('video', VideoSection);
  sectionManager.register('cms-page', CMSPageSection);
  sectionManager.register('customers-login', CustomersLoginSection);
  sectionManager.register('customers-account', CustomersAccountSection);
  sectionManager.register('customers-account-orders', CustomersAccountOrdersSection);
  sectionManager.register('customers-addresses', CustomersAddressesSection);
  sectionManager.register('customers-order', CustomersOrderSection);
  sectionManager.register('ics-recall-flow', ICSRecall);
  sectionManager.register('product-movement', ProductMovement);
  sectionManager.register('testimonials', Testimonials);
  sectionManager.register('award-badges', AwardBadges);
  sectionManager.register('icon-grid', IconGrid);
  sectionManager.register('team-grid', TeamGrid);
  sectionManager.register('product-features', ProductFeatures);
  sectionManager.register('fifty-fifty-content', FiftyFiftyContent);
  sectionManager.register('collection-menu', CollectionMenu);
  sectionManager.register('modal-video-player', ModalVideoPlayer);
  sectionManager.register('country-modal', CountryModal);
  sectionManager.register('product-registration', ProductRegistration);
  sectionManager.register('contact-form', ContactForm);
  sectionManager.register('jobs-listing', JobsListing);
  sectionManager.register('Canada-Pop-Up', CanadaPopUp);


  $('.in-page-link').on('click', evt => {
    A11Y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Common a11y fixes
  A11Y.pageLinkFocus($(window.location.hash));

  // Target tables to make them scrollable
  RTE.wrapTables({
    $tables: $('.rte table'),
    tableWrapperClass: 'table-responsive'
  });

  // Target iframes to make them responsive
  const iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"]';

  RTE.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply UA classes to the document
  Utils.userAgentBodyClass();

  // Apply a specific class to the html element for browser support of cookies.
  if (Utils.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace(
      'supports-no-cookies',
      'supports-cookies'
    );
  }

  // Chosen JS plugin for select boxes
  Utils.chosenSelects();

  // Form event handling / validation
  $body.on('change keydown', '.form-control', e => {
    $(e.currentTarget).removeClass('is-invalid');
  });

  // START - Global handler for collapse plugin to add state class for open expandable lists
  const isOpenClass = 'is-open';

  $document.on('show.bs.collapse', '.collapse', e => {
    $(e.currentTarget)
      .parents('.expandable-list')
      .addClass(isOpenClass);
  });

  $document.on('hide.bs.collapse', '.collapse', e => {
    $(e.currentTarget)
      .parents('.expandable-list')
      .removeClass(isOpenClass);
  });

  $('.collapse.show').each(function() {
    $(this)
      .parents('.expandable-list')
      .addClass(isOpenClass);
  });
  // END - Global handler for collapse plugin to add state class for open expandable lists

  // Init any Product Cards on the page
  $('[data-product-card]').each((i, el) => {
    new ProductCard(el);
  });

  // Quickview stuff
  $body.on('click', '[data-quick-view-trigger]', function(e) {
    e.preventDefault();
    QuickViewManager.onQuickViewTriggerClick($(this));
  });

  // Add 'development mode' class for CSS hook
  if (window.location.hostname === 'localhost') {
    $body.addClass('development-mode');
  }
})(Modernizr);



