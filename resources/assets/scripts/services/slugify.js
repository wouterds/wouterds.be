import slugify from 'slugify';

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
    this.$scope.on('keyup change', ::this.onInputChange);
  };

  onInputChange(e) {
    e.preventDefault();

    // Ajax call
    this.cb(slugify(this.$scope.val(), { lower: true, remove: /[$*_+~.()'"!\-:@]/g }));
  }
}

export default Slugify;
