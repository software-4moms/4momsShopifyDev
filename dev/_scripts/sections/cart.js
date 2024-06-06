import $ from 'jquery';
import BaseSection from './base';

const selectors = {
  form: '[data-cart-form]',
  itemQaInput: '[data-quantity-adjuster] input[data-item-qa-input]',
  noteLabel: '[data-note-label]',
  noteField: '[data-note-textarea]'
};

export default class CartSection extends BaseSection {
  constructor(container) {
    super(container, 'cart');

    const $form = $(selectors.form, this.$container);

    // Since we have more than 1 quantity adjuster per row (1 for mobile, 1 for desktop)
    // We need to use single input per row, which is responsible for sending the form data for that line item
    // Watch for changes on the quantity adjuster, and then update the input.  These two are tied together using a data attribute
    this.$container.on('change', selectors.itemQaInput, function() {
      // Have to do '[id=".."]' instead of '#id' because id is generated using {{ item.key }} which has semi-colons in it - breaks normal id select
      const $itemQtyInput = $(`[id="${$(this).data('item-qa-input')}"]`);

      $itemQtyInput.val($(this).val());
      $form.submit();
    });

    this.$noteLabel = $(selectors.noteLabel, this.$container);
    this.$noteField = $(selectors.noteField, this.$container);

    this.$noteLabel.on('click', this.toggleNoteField.bind(this));
  }

  toggleNoteField() {
    this.$noteField.toggleClass('show');
  }
}

$(document).ready(function(){
  $('#CartNote').keydown(function(e){
      // Allow: backspace, delete, tab, escape and enter
      if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
           // Allow: Ctrl+A
          (e.keyCode === 65 && e.ctrlKey === true) ||
           // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
               // let it happen, don't do anything
               return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.altKey === true) || (e.keyCode === 220) || (e.keyCode === 191 && e.shiftKey === false)){
          e.preventDefault();
      }

      if (e.keyCode === 192){
        return false;
      }

  });
});
