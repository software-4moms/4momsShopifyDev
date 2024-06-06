import $ from 'jquery';
import BaseSection from './base';
import VideoPlayer from '../ui/videoPlayer';

const selectors = {
  videoUrl: '[data-video-url]',
  playVideo: '[data-video-play]',
  productVideoModal: '[data-video-modal]',
  videoPlayer: '[data-video-player]'
};

export default class FiftyFiftyContent extends BaseSection {
  constructor(container) {
    super(container, 'FiftyFiftyContent');
    this.name = 'fiftyFiftyContent';

    const self = this;

    this.videoUrl = $(selectors.videoUrl, this.$container).val() || '';

    if (this.videoUrl !== '') {
      $.get('https://vimeo.com/api/oembed.json?url='+this.videoUrl, (data) => {
        $(selectors.videoPlayer, this.$container).data('video-id', data.video_id);
        self.player = new VideoPlayer($(selectors.videoPlayer, this.$container));
      });
    }

    this.$productVideoModal = $(selectors.productVideoModal, this.$container);

    $(selectors.playVideo, this.$container).on('click', this.toggleVideoModal.bind(this) );
    this.$productVideoModal.on('show.bs.modal', this.playVideo.bind(this));
    this.$productVideoModal.on('hide.bs.modal', this.stopVideo.bind(this));
  }

  playVideo() {
    this.player.play();
  }

  stopVideo() {
    this.player.pause();
  }

  toggleVideoModal(e) {
    e.preventDefault();
    this.$productVideoModal.modal('toggle');
  }
}
