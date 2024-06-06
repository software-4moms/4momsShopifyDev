import $ from 'jquery';
import BaseSection from './base';

const selectors = {
  menu: '[data-country-modal]',
  toggle: '[data-country-modal-toggle]',
  countryItem: '.single-country',
  countryList: '.country-list'
};

export default class CountryModal extends BaseSection {
  constructor(container) {
    super(container, 'country-modal');

    this.$el     = $(selectors.menu, this.$container);
    this.$toggle = $(selectors.toggle); // Don't scope to this.$container

    this.$toggle.on('click', this.onToggleClick.bind(this));
    this.adjustCountryColumns();
  }

  adjustCountryColumns() {
    $.each($(selectors.countryList, this.$container), function(index, el) {
       const countryCount = $(selectors.countryItem, $(el)).length;

       if (countryCount > 18) {
        $(el).addClass('country-list--two-columns');
       }
    });
  }

  onToggleClick(e) {
    e.preventDefault();
    this.$el.modal('toggle');
  }

  onSelect() {
    this.$el.modal('show');
  }

  onDeselect() {
    this.$el.modal('hide');
  }

  onUnload() {

  }
}
