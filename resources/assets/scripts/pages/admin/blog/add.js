import $ from 'jquery';
import Base from '../../base';
import FormService from '../../../services/form';
import SlugifyService from '../../../services/slugify';
import SimpleMDE from 'simplemde';

class Add extends Base {
  get pageId() {
    return '#pageAdminBlogAdd';
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
    new SimpleMDE({ element: this.$form.find('#body').get(0) });
    new SlugifyService(this.$form.find('#title'), ::this.onSlugifyDone);
    this.form = new FormService(this.$form);
  }

  initObservers() {
    this.form.$scope.on('submit', ::this.onFormSubmit);
  }

  onSlugifyDone(slug) {
    this.form.$scope.find('#slug').val(slug);
  }

  onFormSubmit(e) {
    e.preventDefault();

    // Check if ajax call already is going
    if (this.ajaxCall) {
      this.ajaxCall.abort();
      this.ajaxCall = null;
    }

    // Add loading state
    this.form.$buttonSubmit.first().addClass('button--loading');

    // Ajax call
    this.ajaxCall = $.post(this.$form.attr('action'), this.$form.serialize()).done(::this.onAjaxDone).fail(::this.onAjaxFail);
  }

  onAjaxDone(response) {
    this.ajaxCall = null;

    // Remove loading button
    this.form.$buttonSubmit.removeClass('button--loading').blur();
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

export default Add;
