import $ from 'jquery';
import BaseSection from './base';
import VideoPlayer from '../ui/videoPlayer';

const selectors = {
  videoPlayer: '[data-video-player]',
  playButton: '[data-play-button]',
  videoModal: '[data-video-modal]',
  videoUrl: '[data-video-url]',
  videoId: '[data-video-id]'
};

$( ".tscripts-btn" ).click(function() {
  $( ".transcriptbox" ).toggle( ".transcriptbox__show" );
});

export default class ModalVideoPlayer extends BaseSection {
  constructor(container) {
    super(container, 'modal-video-player');

    this.player = new VideoPlayer($(selectors.videoPlayer, this.$container), {

    });

    $(selectors.playButton, this.$container).on('click', this.toggleVideoModal.bind(this));
    $(selectors.videoModal, this.$container).on('show.bs.modal', this.playVideo.bind(this));
    $(selectors.videoModal, this.$container).on('hide.bs.modal', this.stopVideo.bind(this));
  }

  toggleVideoModal(e) {
    e.preventDefault();
    $(selectors.videoModal, this.$container).modal('toggle');
  }

  playVideo() {
    this.player.play();
  }

  stopVideo() {
    this.player.pause();
  }
}
