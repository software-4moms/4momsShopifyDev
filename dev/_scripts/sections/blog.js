import Swiper from 'swiper';
import $ from 'jquery';
import BaseSection from './base';

const selectors = {
  contentGrid: '.content-grid',
  contentGridItem: '.content-grid__item',
  pagination: '[data-pagination]',
  nextPageLink: '[data-next-page]',
  swiperContainer: '.swiper-container',
  swiperSlides: '.swiper-slide',
  swiperArrowLeft: '[data-swiper-arrow-prev]',
  swiperArrowRight: '[data-swiper-arrow-next]'
};

export default class BlogSection extends BaseSection {
  constructor(container) {
    super(container, 'blog');
    this.swiperContainer = $(selectors.swiperContainer, this.$container);
    this.swiperSlides = $(selectors.swiperSlides, this.$container);

    const swiperSettings = {
      init: true,
      loop: true,
      draggable: true,
      slidesPerView: 1,
      watchOverflow: true,
      autoHeight: true,
      pagination: {
        el: $('.swiper-pagination', this.$container),
        type: 'bullets',
        clickable: true,
      },
      navigation: {
        prevEl: $(selectors.swiperArrowLeft, this.$container),
        nextEl: $(selectors.swiperArrowRight, this.$container),
      },
    }

    if (this.swiperSlides.length > 1) {
      this.mySwiper = new Swiper(this.swiperContainer, swiperSettings);
    }

    this.$container.on('click', selectors.nextPageLink, this.onNextPageLinkClick.bind(this));
  }

  onNextPageLinkClick(e) {
    e.preventDefault();
    
    const $link = $(e.currentTarget);
    const url   = $link.attr('href');

    $.ajax({
      url,
      beforeSend() {
        $link.html(theme.strings.loading || 'Loading');
      }
    })
      .done((data) => {
        const $dom = $(data);
        const $contentItems = $(selectors.contentGridItem, $dom);
        const $newNextPageLink = $(selectors.nextPageLink, $dom);

        $(selectors.contentGrid, this.$container).append($contentItems);

        if ($newNextPageLink.length) {
          $link.replaceWith($newNextPageLink);
        }
        else {
          $(selectors.pagination, this.$container).remove();
        }
      });
  }
}
