import $ from 'jquery'; // eslint-disable-line no-unused-vars
import BaseSection from './base';

const selectors = {
  formSelector: '[data-form-selector]',
  formContainer: '[data-form-container]',
  productFamily: '[data-product-family]',
  productFamilyJson: '[data-product-family-json]',
  product: '[data-product]',
  countrySelect: '[data-country-select]',
  provinceContainer: '[data-province-container]',
  provinceSelect: '[data-province-select]',
  provinceList: '[data-province-list]',
  zipCode: '[data-zip-code]',
  postalCode: '[data-postal-code]',
  dataCaptureFields: '[data-field-index]',
  breezeModels: '[data-breeze-models]',
  formMessage: '[data-form-message]',
  wufooForm: '[data-wufoo-form]',
  messageContainer: '[data-message-container]',
  fileInput: '[data-file-input]',
  fileName: '[data-file-name]',
  registerProductForm: '[data-register-product-form]',
  productSerialContainer: '[data-product-serial]',
  serialInfoToggler: '[data-serial-info-toggler]',
  serialModal: '[data-serial-info-modal]',
  icsInformation: '[data-ics-information]',
  address1: '[data-address1]',
  address2: '[data-address2]',
  streetField: '[data-street-input]'
};

const classes = {
  messageSuccess: 'form__message--success',
  messageFail: 'form__message--fail',
  error: 'is-invalid'
}

export default class ContactForm extends BaseSection {
  constructor(container) {
    super(container, 'contactForm');
    this.provinceList = JSON.parse($(selectors.provinceList, this.$container).html());
    $(selectors.fileInput, this.$container).on('change', this.changeInputValue.bind(this));
    $(selectors.countrySelect, this.$container).on('change', this.onCountryChange.bind(this));
    $(selectors.registerProductForm, this.$container).on('click', 'input[type=submit]', this.validateForm.bind(this) );
    $(selectors.productFamily, this.$container).on('change', this.updateProductList.bind('this'));
    $(selectors.product, this.$container).on('change', this.updateFormFields.bind(this));
    $(selectors.breezeModels, this.$container).on('change', this.updateBreezeModel.bind(this));
    $(selectors.serialInfoToggler, this.$container).on('click', this.openSerialModal.bind(this));
    $(selectors.address1, this.container).on('blur', this.onAddressUpdate.bind(this));
    $(selectors.address2, this.container).on('blur', this.onAddressUpdate.bind(this));

    this.checkSubmission();
  }

  onAddressUpdate() {
    const combinedStreet = $(selectors.address1, this.$container).val() + ' ' + $(selectors.address2, this.$container).val();
    $(selectors.streetField, this.$container).val(combinedStreet);
  }

  validateForm(e) {
    const $form = $(selectors.registerProductForm, this.$container);
    let errorCounter = 0;

    $.each($('input[required], select[required], textarea[required]', $form), function(index, el) {
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

    if($form.find('[name="email"]').val() !== $form.find('[name="confirm_email"]').val()) {
      $form.find('[name="confirm_email"]').addClass(classes.error);
      $form.find('[name="confirm_email"]').siblings('.invalid-feedback').text('The email doesn\'t match');
      errorCounter++;
    }

    alert("You can't procedfvded!");


      if(grecaptcha.getResponse() == "") {
      e.preventDefault();
        alert("You can't proceed!");
        errorCounter++;
      } else {
        alert("Thank you");
      }



    if (errorCounter > 0) {
      e.preventDefault();
    } else {
      $form.submit();
    }
  }

  openSerialModal(e) {
    e.preventDefault();
    $(selectors.serialModal, this.$container).modal('toggle');
  }

  changeInputValue(e) {
    const $el = $(e.currentTarget);
    const $label = $el.siblings('label');

    if ($el[0].files.length > 0) {
      const fileName = $el[0].files[0].name;
      $(selectors.fileName, $label).text(fileName);
    } else {
      $(selectors.fileName, $label).text('Choose File');
    }
  }

  checkSubmission() {
    const hash = window.location.hash;

    if (hash === '#success') {
      $(selectors.messageContainer, this.$container).show();
    }
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
  updateBreezeModel() {
    const backOption = $('option:selected', selectors.breezeModels).data('option-select');
    $(selectors.product).val(backOption).trigger('chosen:updated');


  }
  updateProductList(e) {
    const productList = JSON.parse($(selectors.productFamilyJson, this.$container).html());
    const currentValue = $(e.currentTarget).val();
    const $productSelector = $(selectors.product, this.$container);
    $('option', $productSelector).not(':eq(0)').remove();
    $(selectors.dataCaptureFields).hide();
    $.each(productList[currentValue].products, function(productIndex, option) {
      $productSelector.append(`<option data-fields="${option.product_fields}" value="${option.option_value}">${option.option_name}</option>`);
    });
    $productSelector.trigger('chosen:updated');
  }

 

  
  updateFormFields(e) {
    const fieldsToShow = $('option:checked', selectors.product).data('fields');
    const currentValue = $(e.currentTarget).val();
    $(selectors.dataCaptureFields).hide();

    $.each(fieldsToShow, function(index, val) {
       $('[data-field-index="'+val+'"]').show();
       if ( $('option[data-option-select="'+currentValue+'"]', selectors.breezeModels).length > 0 ) {
        $('option[data-option-select="'+currentValue+'"]', selectors.breezeModels).prop('selected', true);
        $(selectors.breezeModels).trigger('chosen:updated');
       } else {
        $('option', selectors.breezeModels).eq(0).prop('selected', true);
        $(selectors.breezeModels).trigger('chosen:updated');
       }
    });

    $(selectors.productSerialContainer).hide();

    if ($(`[data-product-serial="${currentValue}"]`, this.$container).length) {
      $(selectors.serialInfoToggler, this.$container).show();
      $(`[data-product-serial="${currentValue}"]`, this.$container).show();
    }else {
      $(selectors.serialInfoToggler, this.$container).hide();
    }

    if (currentValue === 'infant car seat') {
      $(selectors.icsInformation, this.$container).show();
    } else {
      $(selectors.icsInformation, this.$container).hide();
    }



  }
}
