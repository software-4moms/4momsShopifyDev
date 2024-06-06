import $ from 'jquery'; // eslint-disable-line no-unused-vars
import BaseSection from './base';
import AJAXKlaviyoForm from '../lib/ajaxKlaviyoForm';

const selectors = {
  newsletterForm: '[data-newsletter-form]',
  successMessage: '[data-message-success]',
  failMessage:    '[data-message-fail]',
  newsletterInput: '[newsletter-input]'
};

const classes = {
  isInvalid: 'is-invalid'
}

export default class FooterSection extends BaseSection {
  constructor(container) {
    super(container, 'footer');
    this.newsletterForm = $(selectors.newsletterForm, this.$container);

    const $form = this.newsletterForm;
    const listId = $form.data('list-id');

    const options = {
      onSubscribeSuccess() {
        const successMessage = $(selectors.successMessage, $form).data('message-success');
        const $successMessage = $('.success-message', $form).text(successMessage);
        const $newsletterInput = $(selectors.newsletterInput, $form);
        const $newsletterButton = $('.inline-submit');
        const $invalidFeedback = $('.invalid-feedback', $form);

        $successMessage.removeClass('hiden');
        $newsletterInput.addClass('hiden');
        $newsletterButton.addClass('hiden');
        $invalidFeedback.removeClass('show');

        setTimeout(function(){
          $newsletterInput.removeClass('hiden');
          $newsletterInput.val('');
          $newsletterButton.removeClass('hiden');
          $successMessage.addClass('hiden');
        }, 3000);
      },
      onSubscribeFail() {
        const failMessage = $(selectors.failMessage, $form).data('message-fail');
        const defaultFailMessage = $(selectors.failMessage, $form).data('default-fail');
        const $newsletterInput = $(selectors.newsletterInput, $form);
        const $invalidFeedback = $('.invalid-feedback', $form);

        $newsletterInput.val(defaultFailMessage);
        $newsletterInput.addClass(classes.isInvalid);
        $invalidFeedback.text(failMessage).addClass('show');
        $form.addClass(classes.isInvalid);

        setTimeout(function(){
          $form.removeClass(classes.isInvalid);
          $newsletterInput.val('');
          $newsletterInput.removeClass(classes.isInvalid);
          $invalidFeedback.removeClass('show');
        }, 3000);
      },
      onSubmitFail() {
        const failMessage = $(selectors.failMessage, $form).data('message-fail');
        const defaultFailMessage = $(selectors.failMessage, $form).data('default-fail');
        const $newsletterInput = $(selectors.newsletterInput, $form);
        const $invalidFeedback = $('.invalid-feedback', $form);

        $newsletterInput.val(defaultFailMessage);
        $newsletterInput.addClass(classes.isInvalid);
        $invalidFeedback.text(failMessage).addClass('show');
        $form.addClass(classes.isInvalid);

        setTimeout(function(){
          $form.removeClass(classes.isInvalid);
          $newsletterInput.val('');
          $newsletterInput.removeClass(classes.isInvalid);
          $invalidFeedback.removeClass('show');
        }, 3000);
      }
    };

    options.listId = listId;

    this.ajaxKlaviyoForm = new AJAXKlaviyoForm($form, options);
  }
}
