import $ from "jquery";

class Base {
  get pageId() {
    return '#undefined';
  }

  constructor() {
    let $scope = $(this.pageId);

    if (!($scope && $scope.length === 1)) {
      return;
    }

    this.$scope = $scope;

    this.init();
  }

  init() {
  }
}

export default Base;
