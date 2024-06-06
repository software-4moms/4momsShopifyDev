import $ from 'jquery';
import ProductDetailForm from './productDetailForm';
import ProductDetailGalleries from './productDetailGalleries';
import VideoPlayer from '../../ui/videoPlayer';

const selectors = {
  productDetailForm: '[data-product-detail-form]',
  productDetailGalleries: '[data-product-detail-galleries]',
  videoUrl: '[data-product-video-url]',
  descriptionToggle: '[data-description-toggle]',
  shortDescription: '[data-short-description]',
  longDescription: '[data-long-description]',
  playVideo: '[data-product-video-play]',
  productVideoModal: '[data-product-video-modal]',
  videoPlayer: '[data-product-video-player]',
  babyListData: '[data-babylist-info]',
  addToRegistry: '[data-add-to-registry]',
  affirmBlock: '[data-affirm-block]',
  affirmAsLowAs: '.affirm-as-low-as',
  addToCartBtn: '[data-add-to-cart]',
  bisButton: '[data-bis-button]'
};

export default class ProductDetail {
  /**
   * ProductDetail constructor
   *
   *
   * @param {jQuery | HTMLElement} el - Main element, see snippets/product-detail.liquid
   * @param {Boolean} enableHistoryState - enables URL history updates on variant change.  See productDetailForm.js
   */
  constructor(el, enableHistoryState = true) {
    this.settings = {};
    this.name = 'productDetail';

    const self = this;

    this.$el = $(el);

    if (!this.$el || this.$el === undefined) {
      console.warn(`[${this.name}] - $el required to initialize`);
      return;
    }

    this.$pdg = $(selectors.productDetailGalleries, this.$el);
    this.$pdf = $(selectors.productDetailForm, this.$el);
    
    this.galleries = new ProductDetailGalleries({
      $container: this.$pdg
    });


    this.form = new ProductDetailForm({
      $container: this.$pdf,
      onVariantChange: this.onVariantChange.bind(this),
      enableHistoryState: enableHistoryState
    });

    this.videoUrl = $(selectors.videoUrl).val() || '';

    if (this.videoUrl !== '') {
      $.get('https://vimeo.com/api/oembed.json?url='+this.videoUrl, (data) => {
        $(selectors.videoPlayer, self.$el).data('video-id', data.video_id);
        self.player = new VideoPlayer($(selectors.videoPlayer, self.$el));
      });
    }

    this.$productVideoModal = $(selectors.productVideoModal, this.$el);

    // Add to registry trigger
    $(selectors.addToRegistry, this.$el).on('click', this.addToRegistry.bind(this));

    // Short-Long description toggle
    $(selectors.descriptionToggle, this.$el).on('click', this.toggleDescription.bind(this));

    // Video toggle and play
    $(selectors.playVideo, this.$el).on('click', this.toggleVideoModal.bind(this) );
    this.$productVideoModal.on('show.bs.modal', this.playVideo.bind(this));
    this.$productVideoModal.on('hide.bs.modal', this.stopVideo.bind(this));

  }

  playVideo(el) {
    this.player.play();
  }

  stopVideo() {
    this.player.pause();
  }

  addToRegistry(e) {
    e.preventDefault();
    e.stopPropagation();
    const registryData = JSON.parse($(selectors.babyListData).html());
    window.bl.addToRegistry(registryData);
  }

  toggleDescription(e) {
    e.preventDefault();
    $(selectors.shortDescription).toggleClass('hide');
    $(selectors.longDescription).toggleClass('hide');
  }

  toggleVideoModal(e) {
    e.preventDefault();
    this.$productVideoModal.modal('toggle');
  }

  onVariantChange(variant) {
    this.galleries.updateForVariant(variant);
    if (variant.price > 5000) {
      $(selectors.affirmAsLowAs).attr('data-amount', variant.price);
      $(selectors.affirmBlock).show();
      window.affirm.ui.refresh();
    } else {
      $(selectors.affirmBlock).hide();
    }

    if (variant.available === true) {
      $(selectors.addToCartBtn).show();
      $(selectors.bisButton).hide();
    } else {
      $(selectors.addToCartBtn).hide();
      $(selectors.bisButton).show();
    }
  }
}
