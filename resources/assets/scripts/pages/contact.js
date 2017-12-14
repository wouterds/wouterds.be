import $ from 'jquery';
import Base from './base';
import FormService from '../services/form';

class Contact extends Base {
  get pageId() {
    return '#pageContact';
  }

  init() {
    // Private vars
    this.$form = this.$scope.find('form');

    // Init form
    this.initForm();

    // Init observers
    this.initObservers();
  }

  initForm() {
    this.form = new FormService(this.$form);
  }

  initObservers() {
    this.form.$scope.on('submit', ::this.onFormSubmit);
  }

  onFormSubmit(e) {
    e.preventDefault();

    // Check if ajax call already is going
    if (this.ajaxCall) {
      return;
    }

    // Add loading state
    this.form.$buttonSubmit.addClass('button--loading');

    // Ajax call
    this.ajaxCall = $.post(this.$form.attr('action'), this.$form.serialize()).done(::this.onAjaxDone).fail(::this.onAjaxFail);
  }

  onAjaxDone(response) {
    this.ajaxCall = null;

    // Remove loading button
    this.form.$buttonSubmit.removeClass('button--loading').blur();

    // Clear inputs
    this.$form.find('textarea,input').val('');

    // Show success message
    this.form.showMainSuccess('Your message has been sent successfully!');
  }

  onAjaxFail(response) {
    this.ajaxCall = null;

    if (response && typeof response.responseJSON === 'object') {
      if (response.responseJSON.error) {
        this.form.showMainError(response.responseJSON.error);
      } else {
        this.form.showErrors(response.responseJSON);
      }
    }

    // Remove loading button
    this.form.$buttonSubmit.removeClass('button--loading').blur();
  }
}

export default Contact;
