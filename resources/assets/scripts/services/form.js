import $ from 'jquery';
import flatpickr from 'flatpickr';

class Form {
  constructor($scope) {
    // Check if we have a scope
    if (!($scope && $scope.length)) {
      throw new Error('$scope not found');
    }

    // Check if it is a form
    if ($scope.is('form') !== true) {
      throw new Error('$scope is not a form!');
    }

    // Flatpickr
    this.initFlatpickr();

    // Bind this
    this.onInputActiveClearError = this.onInputActiveClearError.bind(this);

    // Public
    this.$scope = $scope;
    this.$buttonSubmit = this.$scope.find('[type=submit]');

    // Init observers
    this.initObservers();

    // Enable form
    this.enableForm();
  }

  initFlatpickr() {
    $('[data-plugin=flatpickr]').each((index, el) => {
      flatpickr(el, { enableTime: true, enableSeconds: true, dateFormat: 'Y-m-d H:i:S' });
    });
  }

  initObservers() {
    this.$scope.on('keydown focus', 'input,textarea,select', this.onInputActiveClearError);
  };

  enableForm() {
    this.$buttonSubmit.removeClass('button--loading').removeAttr('disabled');

    this.$buttonSubmit.each((index, el) => {
      let $button = $(el);

      if ($button.data('loader')) {
        let $loader = $('<span />').addClass('button__loader');
        $button.append($loader);
      }
    });
  };

  onInputActiveClearError(e) {
    let $input = $(e.target);

    // Get input wrapper
    let $inputWrapper = $input.closest('.input-wrapper');

    // Remove error status from wrapper
    $inputWrapper.removeClass('error');

    // Find previous error
    let $error = $inputWrapper.find('.error');

    // Try to remove
    $error.remove();
  }

  showErrors(errors) {
    this.$buttonSubmit.removeClass('loading');

    for (let index in errors) {
      let error = errors[index][0];

      let $input = this.$scope.find('[name=' + index + ']');
      let $inputWrapper = $input.closest('.input-wrapper');

      // Find existing error
      let $error = $inputWrapper.find('.error');

      // Add error class to input wrapper
      $inputWrapper.addClass('error');

      // Remove existing error
      $error.remove();

      // Create new error
      $error = $('<p>');
      $error.addClass('error error-message');
      $error.text(error);

      // Add error to dom
      $inputWrapper.append($error);
    }
  }

  hideErrors() {
    // Get input wrappers
    let $inputWrappers = this.$scope.find('.input-wrapper');

    // Get errors
    let $errors = $inputWrappers.find('.error');

    // Remove class
    $inputWrappers.removeClass('error');

    // Remove errors
    $errors.remove();

    // Main error?
    this.$scope.find('.error.submit').remove();
  }

  showMainError(error) {
    // Remove errors
    this.hideErrors();

    let $inputWrapper = this.$buttonSubmit.closest('.input-wrapper');

    // Add error class
    $inputWrapper.addClass('error');

    // Create new error
    let $error = $('<p>');
    $error.addClass('error submit');
    $error.text(error);

    // Add error to dom
    this.$buttonSubmit.after($error);
  }

  showMainSuccess(success) {
    // Remove errors
    this.hideErrors();

    // Find input wrapper
    let $inputWrapper = this.$buttonSubmit.closest('.input-wrapper');

    // Add error class
    $inputWrapper.addClass('success');

    // Create new error
    let $success = $('<p>');
    $success.addClass('success submit');
    $success.text(success);

    // Add error to dom
    this.$buttonSubmit.after($success);

    // Remove success message
    setTimeout(function() {
      $inputWrapper.removeClass('success');
      $success.remove();
    }, 7500);
  }
}

export default Form;
