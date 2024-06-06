import $ from 'jquery';
import BaseSection from './base';
import Drawer from '../ui/drawer';

const selectors = {
  toggle: '[data-mobile-menu-toggle]',
  menu: '[data-mobile-menu]',
  header: '[data-header]'
};

export default class MobileMenuSection extends BaseSection {
  constructor(container) {
    super(container, 'mobileMenu');

    this.$el     = $(selectors.menu, this.$container);
    this.$toggle = $(selectors.toggle); // Don't scope to this.$container
    this.$header = $(selectors.header); // Don't scope to this.$container

    this.drawer  = new Drawer(this.$el);

    this.$toggle.on('click', this.onToggleClick.bind(this));
    this.$el.on('hidden.drawer', this.toggleIcon.bind(this));
    this.$el.on('shown.drawer', this.toggleIcon.bind(this));
  }

  onToggleClick(e) {
    e.preventDefault();
    this.drawer.toggle();
  }

  toggleIcon(e) {
    if (e.type === 'hidden') {
      $('.icon-wrapper').removeClass('is-open');
    } else if(e.type === 'shown'){
      $('.icon-wrapper').addClass('is-open');
    }
  }

  onSelect() {
    this.drawer.show();
  }

  onDeselect() {
    this.drawer.hide();
  }

  onUnload() {
    this.drawer.$backdrop && this.drawer.$backdrop.remove();
  }
}
