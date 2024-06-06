import $ from 'jquery'; // eslint-disable-line no-unused-vars
import BaseSection from './base';

const selectors = {

  formSelector: '[data-form-selector]',
  formContainer: '[data-form-container]',
  subjectSelect: '[data-contact-reason]',
  dataCaptureFields: '[data-field-index]',
  breezeModels: '[data-breeze-models]',
  formMessage: '[data-form-message]',
  wufooForm: '[data-wufoo-form]',
  messageContainer: '[data-message-container]',
  fileInput: '[data-file-input]',
  fileName: '[data-file-name]',
  salesforceForm: '[data-salesforce-form]',
  countrySelect: '[data-country-select]',
  provinceContainer: '[data-province-container]',
  provinceSelect: '[data-province-select]',
  provinceList: '[data-province-list]',
  zipCode: '[data-zip-code]'
};

const classes = {
  messageSuccess: 'form__message--success',
  messageFail: 'form__message--fail',
  error: 'is-invalid'
}

export default class ContactForm extends BaseSection {
  constructor(container) {
    super(container, 'contactForm');

    $(selectors.wufooForm, this.$container).on('submit', this.wufooFormSubmit.bind(this));
    $(selectors.formSelector, this.$container).on('change', this.changeVisibleform.bind(this));
    $(selectors.fileInput, this.$container).on('change', this.changeInputValue.bind(this));
    $(selectors.salesforceForm, this.$container).on('click', 'input[type=submit]', this.validateForm.bind(this) );
    this.checkSubmission();
  }

  validateForm(e) {
    const $form = $(selectors.salesforceForm, this.$container);
    let errorCounter = 0;

    $.each($('input[required],select[required], textarea[required]', $form), function(index, el) {
      const $el = $(el);
      if ($el.parent().parent().is(':visible')) {
        if ($el.val().trim() === '') {
          $el.addClass(classes.error);
          $el.siblings('.invalid-feedback').text('This field can\'t be empty');
          errorCounter++;
        }

        if (!el.checkValidity()) {
          $el.addClass(classes.error);
          $el.siblings('.invalid-feedback').text(el.validationMessage);
          errorCounter++;
        }
      }
    });

    if (errorCounter > 0) {
      e.preventDefault();
    } else {
      $form.submit();
    }
  }

  checkSubmission() {
    const hash = window.location.hash;
    const successMessage = $(selectors.messageContainer, this.$container).data('success-message');

    if (hash === '#success') {
      $(selectors.messageContainer, this.$container)
        .removeClass(classes.messageFail)
        .addClass(classes.messageSuccess)
        .text(successMessage)
        .show();


      const offsetTop = $(selectors.messageContainer).offset().top - $('.header').outerHeight();

      setTimeout(()=>{
        $('html, body').animate({
          scrollTop: offsetTop
        }, 1000);
      }, 1000);
    }
  }

  changeVisibleform(e) {
    const currentForm = $(e.currentTarget).val();

    $.each($(selectors.formContainer, this.$container), function(index, el) {
      const $form = $(el);
      if($form.is(`[data-form-container=${currentForm}`)){
        $form.show();
      } else {
        $form.hide();
      }
    });
  }

  changeInputValue(e) {
    const $el = $(e.currentTarget);
    const $label = $el.siblings('label');
    const file = $el[0].files[0];
    const fileSize = file.size / 1048576.0;

    if ($el[0].files.length > 0 && fileSize <= 10) {
      const fileName = file.name;
      $(selectors.fileName, $label).text(fileName);
    } else if (fileSize > 10) {
      $(selectors.fileName, $label).text('File is over 10 mb please upload another one');
      $el.val('');
      setTimeout(function() {
        $(selectors.fileName, $label).text('Choose File');
      }, 3000);
    } else {
      $(selectors.fileName, $label).text('Choose File');
    }
  }

  wufooFormSubmit(e) {
    e.preventDefault();
    const $el = $(e.currentTarget);
    const targetUrl = $el.attr('action');
    const formData = new FormData(e.currentTarget);
    let errorCounter = 0;

    $.each($('input[required], select[required], textarea[required]', $el), function(index, field) {
      const $field = $(field);
      if ($field.parent().parent().is(':visible')) {
        if ($field.val().trim() === '') {
          $field.addClass(classes.error);
          $field.siblings('.invalid-feedback').text('This field can\'t be empty');
          errorCounter++;
        }

        if (!field.checkValidity()) {
          $field.addClass(classes.error);
          $field.siblings('.invalid-feedback').text(field.validationMessage);
          errorCounter++;
        }
      }
    });

    if (errorCounter > 0) {
      const errorMessage = $(selectors.messageContainer, this.$container).data('error-message');

      $(selectors.messageContainer, this.$container)
        .addClass(classes.messageFail)
        .removeClass(classes.messageSuccess)
        .text(errorMessage)
        .show();
      return;
    } else {
      $('input.btn').val('Submitting').addClass('loading').prop('disabled', true);
    }

    $.ajax({
      url: targetUrl,
      type: 'POST',
      data: formData,
      cache: false,
      contentType: false,
      processData: false
    })
    .done(function(data) {
      const successMessage = $(selectors.messageContainer, this.$container).data('success-message');

      $.each($('input, textarea').not('.btn').not('[name="idstamp"]'), function(index, input) {
        $(input).val('');
      });
      $(selectors.fileName, $el).text('Choose File');

      $(selectors.messageContainer, this.$container)
        .removeClass(classes.messageFail)
        .addClass(classes.messageSuccess)
        .text(successMessage)
        .show();
    })
    .fail(function() {
      const errorMessage = $(selectors.messageContainer, this.$container).data('error-message');

      $.each($('input, textarea').not('.btn'), function(index, input) {
        $(input).val('');
      });
      $(selectors.fileName, $el).text('Choose File');

      $(selectors.messageContainer, this.$container)
        .removeClass(classes.messageSuccess)
        .addClass(classes.messageFail)
        .text(errorMessage)
        .show();
    })
    .always( function() {
      $('input.btn').val('Submit').removeClass('loading').prop('disabled', false);
    })

  }
}
