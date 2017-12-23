import $ from 'jquery';

class Slugify {
  constructor($scope, cb) {
    // Check if we have an input element and callback
    if (!($scope && $scope.length) && !cb) {
      throw new Error('$scope or callback not found');
    }

    // Check if it is an input
    if ($scope.is('input') !== true) {
      throw new Error('$scope is not an input!');
    }

    this.$scope = $scope;
    this.cb = cb;

    // Init observers
    this.initObservers();
  }

  initObservers() {
    this.$scope.on('change', ::this.onInputChange);
  };

  onInputChange(e) {
    e.preventDefault();

    // Check if ajax call already is going
    if (this.ajaxCall) {
      return;
    }

    // Ajax call
    this.ajaxCall = $.post('/admin/slugify.json', {
      text: this.$scope.val()
    }).done(::this.onAjaxDone).fail(::this.onAjaxFail);
  }

  onAjaxDone(response) {
    this.ajaxCall = null;

    if (response && response.data) {
      this.cb(response.data.slug);
    }
  }

  onAjaxFail(response) {
    this.ajaxCall = null;
  }
}

export default Slugify;
