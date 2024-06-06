import $ from 'jquery';
import BaseSection from './base';
import CartAPI from '../core/cartAPI';
import AJAXFormManager from '../managers/ajaxForm';
import AJAXCartUI from '../ui/ajaxCart';

const $window = $(window);
const $body = $(document.body);


const selectors = {
  noteLabel: '[data-note-label]',
  noteField: '[data-note-textarea]'
};



/**
 * Ajax Cart Section Script
 * ------------------------------------------------------------------------------
 * All logic is handled cia CartAPI or AJAXCartUI
 * This file is strictly for handling section settings and theme editor interactions
 *
 */
export default class AJAXCartSection extends BaseSection {
  constructor(container) {
    super(container, 'ajaxCart');

    if ($body.hasClass('template-cart')) {
      return;
    }

    // Create a new instance of the cart UI.
    // Pass in any variables used by the Handlebars template that aren't part of the cart object
    this.ajaxCartUI = new AJAXCartUI({
      footer_text: this.$container.data('footer-text')
    });

    // Store callbacks so we can remove them later
    this.callbacks = {
      changeSuccess: (e) => {
        this.ajaxCartUI.onChangeSuccess(e.cart);
      },
      changeFail: (e) => {
        this.ajaxCartUI.onChangeFail(e.data);
      }
    };

    $window.on(AJAXFormManager.events.ADD_SUCCESS, this.callbacks.changeSuccess);
    $window.on(AJAXFormManager.events.ADD_FAIL, this.callbacks.changeFail);

    // Make sure we get the latest cart data when this initializes
    CartAPI.getCart().then((cart) => {
      this.ajaxCartUI.render(cart);
    });

    
    this.$noteLabel = $(selectors.noteLabel, this.$container);
    this.$noteField = $(selectors.noteField, this.$container);

    this.$noteLabel.on('click', this.toggleNoteField.bind(this));
  }
  
  toggleNoteField() {
    this.$noteField.toggleClass('show');
  }
  onSelect() {
    this.ajaxCartUI.open();
  }

  onDeselect() {
    this.ajaxCartUI.close();
  }

  onUnload() {
    this.ajaxCartUI && this.ajaxCartUI.destroy(); // Need to destroy to clean up body / window event listeners
    $window.off(AJAXFormManager.events.ADD_SUCCESS, this.callbacks.changeSuccess);
    $window.off(AJAXFormManager.events.ADD_FAIL, this.callbacks.changeFail);
  }
}


// $("#CartNote").keydown(function (e) {
//   // Allow: backspace, delete, tab, escape and enter
//   if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
//        // Allow: Ctrl+A
//       (e.keyCode === 65 && e.ctrlKey === true) ||

//       (e.keyCode >= 96 && e.keyCode <= 105) ||

//       (e.keyCode >= 49 && e.keyCode <= 57 && e.shiftKey === false) ||

//       (e.keyCode === 49 && e.shiftKey === true) ||

//       (e.keyCode >= 65 && e.keyCode <= 90 && e.altKey === false) ||
//        // Allow: home, end, left, right
//       (e.keyCode >= 32 && e.keyCode <= 39)) {
//            // let it happen, don't do anything
//            return;
//             }

//   if (e.shiftKey || (e.keyCode < 65 || e.keyCode > 105)) {
//       e.preventDefault();
//   }
// });




// $('#CartNote').on('input', function() {
//   var c = this.selectionStart,
//       r = /[^a-z0-9]/gi,
//       v = $(this).val();
//   if(r.test(v)) {
//     $(this).val(v.replace(r, ''));
//     c--;
//   }
//   this.setSelectionRange(c, c);
// });


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
  });
});


