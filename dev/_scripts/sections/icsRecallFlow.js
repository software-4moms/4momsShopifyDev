import $ from 'jquery';
import BaseSection from './base';

const selectors = {
  startFormContainer: '[data-form-start]',
  startForm: '[data-ics-recall-form]',
  serialNumber: '[data-serial-number]',
  notFound: '[data-not-found]',
  registered: '[data-registered-message]',
  recalled: '[data-recalled]',
  notRecalled: '[data-not-recalled]',
  registerConfirmation: '[data-register-confirmation]',
  actionField: '[data-action-url]',
  autenticityCode: '[data-key]',
  restartForm: '[data-return]',
  countrySelect: '[data-country-select]',
  provinceContainer: '[data-province-container]',
  provinceSelect: '[data-province-select]',
  provinceList: '[data-province-list]',
  zipCode: '[data-zip-code]',
  postalCode: '[data-postal-code]',
  productRegisterForm: '[data-register-product-form]',
  spinnerContainer: '[data-spinner]',
  address1: '[data-address1]',
  address2: '[data-address2]',
  streetField: '[data-street-input]'
};

const classes = {
  error: 'is-invalid'
}

export default class ICSRecall extends BaseSection {
  constructor(container) {
    super(container, 'icsRecallForm');

    this.$el = $(this.container);

    this.provinceList = JSON.parse($(selectors.provinceList, this.$container).html());

    $(selectors.startForm, this.container).on('submit', this.onRecallCheckSubmit.bind(this));
    $(selectors.restartForm, this.container).on('click', this.onRestartForm.bind(this));
    $(selectors.countrySelect, this.$container).on('change', this.onCountryChange.bind(this));
    $(selectors.productRegisterForm, this.$container).on('click', 'input[type=submit]', this.productRegisterSubmit.bind(this));
    $(selectors.address1, this.container).on('blur', this.onAddressUpdate.bind(this));
    $(selectors.address2, this.container).on('blur', this.onAddressUpdate.bind(this));

    const codeRegistered = this._urlParam('code_registered') || '';
    if (codeRegistered !== '') {
      this.registerCode(codeRegistered);
    }
  }

  onAddressUpdate() {
    const combinedStreet = $(selectors.address1, this.$container).val() + ' ' + $(selectors.address2, this.$container).val();
    $(selectors.streetField, this.$container).val(combinedStreet);
  }

  onRecallCheckSubmit(evt) {
    evt.preventDefault();
    const $form = $(selectors.startForm, this.container);
    const testMode = $form.data('test-mode');
    const serialNumber = $form.find(selectors.serialNumber).val();
    const autenticityCode = $form.find(selectors.autenticityCode).val();
    let action = 'https://auth.4moms.com/api/v1/ics_serial_number_statuses';

    if (testMode === true) {
      action = 'https://staging-auth.4moms.com/api/v1/ics_serial_number_statuses';
    }

    $.ajax({
      method: 'GET',
      url: action,
      type: 'json',
      data: {
        serial_number: serialNumber,
        autenticity_code: autenticityCode
      }
    })
    .done(function(data) {
      $(selectors.startFormContainer, this.$container).hide();
      if (data['found?'] === 0) {
          $(selectors.notFound, this.$container).show();
        } else if (data['found?'] === 1 && data.blacklisted === 0) {
          $(selectors.notRecalled, this.$container).show();
        } else if (data['found?'] === 1 && data.blacklisted === 1 && data.registered === 0) {
          $(selectors.recalled, this.$container).show();
          const $recallForm = $(selectors.productRegisterForm, this.$container);
          const retUrlBase = $recallForm.data('return-url-base');
          $recallForm.find('input[name="Serial_Number__c"]').val(serialNumber);
          $recallForm.find('input[name="retURL"]').attr('value', retUrlBase + serialNumber);
        } else if (data['found?'] === 1 && data.registered === 1) {
          $(selectors.registered, this.$container).show();
        }
    })
    .fail(function() {
      console.warn('API error');
    })
  }

  onRestartForm() {
    $(selectors.startFormContainer).show();
    $(selectors.notFound+','+ selectors.notRecalled +','+ selectors.recalled +','+ selectors.registered).hide()
  }

  onCountryChange(e) {
    const currentOption = $(e.currentTarget).val();

    if (currentOption !== '') {
      $(selectors.provinceSelect, this.$container).find('option').not(':eq(0)').remove();
      $.each(this.provinceList[currentOption].regions, function(index, val) {
        $(selectors.provinceSelect, this.$container).append(`<option value=${val.region}>${val.region_description}</option>`);
      });
      $(selectors.provinceSelect, this.$container).trigger('chosen:updated');
      $(selectors.provinceContainer, this.$container).show();
    } else {
      $(selectors.provinceSelect, this.$container).find('option').not(':eq(0)').remove();
      $(selectors.postalCode, this.$container).hide();
      $(selectors.zipCode, this.$container).hide();
    }

    if (currentOption === 'US') {
      $(selectors.provinceContainer, this.$container).find('label').text('State *');
      $(selectors.zipCode, this.$container).show().find('input').attr('name', 'zip').prop('required', true);
      $(selectors.postalCode, this.$container).hide().find('input').attr('name', '').prop('required', false);
    } else if (currentOption === 'CA') {
      $(selectors.provinceContainer, this.$container).find('label').text('Province *');
      $(selectors.zipCode, this.$container).hide().find('input').attr('name', '').prop('required', false);
      $(selectors.postalCode, this.$container).show().find('input').attr('name', 'zip').prop('required', true);
    } else {
      $(selectors.postalCode, this.$container).hide().find('input').attr('name', '').prop('required', false);
      $(selectors.zipCode, this.$container).hide().find('input').attr('name', '').prop('required', false);
      $(selectors.postalCode, this.$container).hide().find('input').attr('name', '').prop('required', false);
      $(selectors.provinceContainer, this.$container).hide().find('input').attr('name', '').prop('required', false);
    }
  }

  productRegisterSubmit(e) {
    const $productRegisterForm = $(selectors.productRegisterForm, this.$container);
    let errorCounter = 0;

    $.each($('input[required], select[required], textarea[required]', $productRegisterForm), function(index, el) {
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

    if($productRegisterForm.find('[name="email"]').val() !== $productRegisterForm.find('[name="confirm_email"]').val()) {
      $productRegisterForm.find('[name="confirm_email"]').addClass(classes.error);
      $productRegisterForm.find('[name="confirm_email"]').siblings('.invalid-feedback').text('The email doesn\'t match');
      errorCounter++;
    }

    // If theres any required field is blank the form will not submit
    if (errorCounter > 0) {
      e.preventDefault();
    }
  }

  registerCode(serialNumber) {
    const $form = $(selectors.startForm, this.container);
    const testMode = $form.data('test-mode');
    const autenticityCode = $form.find(selectors.autenticityCode).val();
    let action = 'https://auth.4moms.com/api/v1/ics_serial_number_statuses/register';
    $(selectors.startFormContainer, this.$container).hide();
    $(selectors.spinnerContainer, this.$container).show();

    if (testMode === true) {
      action = 'https://staging-auth.4moms.com/api/v1/ics_serial_number_statuses/register';
    }

    $.ajax({
      method: 'POST',
      url: action,
      type: 'json',
      data: {
        serial_number: serialNumber,
        autenticity_code: autenticityCode
      }
    })
    .done(function(data) {
      $(selectors.startFormContainer, this.$container).hide();
      if (data['found?'] === 1 && data.blacklisted === 1 && data.registered === 1) {
        $(selectors.spinnerContainer, this.$container).hide();
        $(selectors.registerConfirmation, this.$container).show();
      }
    })
    .fail(function() {
      console.warn('API error');
    })
  }

  _urlParam(name) {
    const results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results !== null) {
      return results[1] || 0;
    }
  }

}


