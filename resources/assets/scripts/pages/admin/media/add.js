import $ from 'jquery';
import Base from '../../base';
import FormService from '../../../services/form';

class Add extends Base {
  get pageId() {
    return '#pageAdminMediaAdd';
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

    this.$inputs = this.$scope.find('.input--file');

    this.$inputs.each(function () {
      let $input = $(this);
      let $label = $input.next();

      $input.on('change', (e) => {
        let fileName = e.target.value.split('\\').pop();

        if (fileName) {
          $label.find('[data-id=placeholder]').text(fileName);
          return;
        }

        $label.find('[data-id=placeholder]').text('');
      });
    });
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
    this.ajaxCall = $.ajax({
      method: this.$form.attr('method'),
      url: this.$form.attr('action'),
      enctype: this.$form.attr('enctype'),
      processData: false,
      data: new FormData(this.$form.get(0)),
      contentType: false,
      cache: false,
    }).done(::this.onAjaxDone).fail(::this.onAjaxFail);
  }

  onAjaxDone(response) {
    this.ajaxCall = null;

    // TODO: Make dynamic
    window.location = '/admin/media';
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
