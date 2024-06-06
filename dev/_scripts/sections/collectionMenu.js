import $ from 'jquery';
import BaseSection from './base';
import Drawer from '../ui/drawer';

const selectors = {
  toggle: '[data-collection-menu-toggle]',
  menu: '[data-collection-menu]',
  header: '[data-header]'
};

export default class CollectionMenu extends BaseSection {
  constructor(container) {
    super(container, 'collectionMenu');

    this.$el     = $(selectors.menu, this.$container);
    this.$toggle = $(selectors.toggle);
    this.drawer  = new Drawer(this.$el);
    this.$toggle.on('click', this.onToggleClick.bind(this));
    this.$header = $(selectors.header);
  }

  onToggleClick(e) {
    e.preventDefault();
    this.drawer.toggle();
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
